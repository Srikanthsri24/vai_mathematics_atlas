import math
import uuid
import json
from django.contrib.auth import authenticate, get_user_model
from django.db import transaction
from django.db.models import Count, Q
from rest_framework.decorators import api_view, permission_classes, throttle_classes
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.throttling import SimpleRateThrottle
from rest_framework import viewsets
from .models import ContentRecord, ContentRevision, Attempt, Assignment, LearningNote
from .serializers import AssignmentSerializer, NoteSerializer
from .symbolic import parse_expression, grade, MISCONCEPTIONS, x, symbols
import sympy as sp

class LoginThrottle(SimpleRateThrottle):
    scope = 'login'
    def get_cache_key(self, request, view):
        return self.cache_format % {'scope': self.scope, 'ident': self.get_ident(request)}

@api_view(['GET'])
@permission_classes([AllowAny])
def health(request):
    return Response({'service': 'VISIONICX MATHS ATLAS', 'status': 'ok'})

@api_view(['POST'])
@permission_classes([AllowAny])
@throttle_classes([LoginThrottle])
def login(request):
    if not isinstance(request.data, dict): return Response({'detail': 'A JSON object is required.'}, status=400)
    username, password = request.data.get('username'), request.data.get('password')
    if not isinstance(username, str) or not isinstance(password, str) or len(username) > 150 or len(password) > 1000:
        return Response({'detail': 'Invalid credentials.'}, status=400)
    user = authenticate(request, username=username, password=password)
    if not user: return Response({'detail': 'Invalid credentials.'}, status=400)
    token, _ = Token.objects.get_or_create(user=user)
    return Response({'token': token.key, 'teacher': user.is_staff})

@api_view(['POST'])
def logout(request):
    if request.auth: request.auth.delete()
    from django.contrib.auth import logout as session_logout
    session_logout(request)
    return Response({'signed_out': True})

@api_view(['POST'])
@permission_classes([AllowAny])
def symbolic(request):
    if not isinstance(request.data, dict): return Response({'detail': 'A JSON object is required.'}, status=400)
    try:
        expression = parse_expression(request.data.get('expression'))
        operation = request.data.get('operation')
        values = request.data.get('values', {})
        if not isinstance(values, dict): raise ValueError('Values must be a parameter object.')
        substitutions = {}
        for k, value in values.items():
            if k not in ('a', 'b', 'c'): raise ValueError('Only a, b and c may be substituted here.')
            substitutions[symbols[k]] = parse_expression(str(value), answer=True)
        expression = expression.subs(substitutions)
        if operation == 'differentiate': result = sp.diff(expression, x)
        elif operation == 'expand':
            def term_bound(value):
                if value.is_Add: return min(2001, sum(term_bound(v) for v in value.args))
                if value.is_Mul:
                    count = 1
                    for v in value.args: count = min(2001, count * term_bound(v))
                    return count
                if value.is_Pow and value.exp.is_Integer and value.exp >= 0: return min(2001, term_bound(value.base)**int(value.exp))
                return 1
            if term_bound(expression) > 2000: raise ValueError('Expansion exceeds 2000 estimated terms.')
            result = sp.expand(expression)
        elif operation == 'evaluate':
            result = expression.subs(x, parse_expression(str(request.data.get('at', '0')), answer=True))
        else: raise ValueError('Supported operations: differentiate, expand, evaluate.')
        if result.has(sp.zoo, sp.oo, -sp.oo, sp.nan): raise ValueError('Result is undefined.')
        return Response({'result': str(result), 'latex': sp.latex(result), 'exact': True, 'conditions': 'Check original expression domains; simplification does not remove original restrictions.'})
    except (ValueError, TypeError, ZeroDivisionError, OverflowError) as e:
        return Response({'detail': str(e)}, status=400)

@api_view(['POST', 'GET'])
def attempts(request):
    if request.method == 'GET':
        return Response(list(Attempt.objects.filter(student=request.user).order_by('-created').values('client_id', 'concept', 'question_id', 'correct', 'kind', 'seconds', 'misconception')[:100]))
    if not isinstance(request.data, dict): return Response({'detail': 'A JSON object is required.'}, status=400)
    try:
        data = request.data
        client_id = uuid.UUID(str(data.get('id')))
        concept, question = data.get('concept'), data.get('questionId')
        response = data.get('response')
        seconds = float(data.get('seconds', 0))
        kind = data.get('kind')
        if not isinstance(response, str) or len(response) > 160: raise ValueError('Answer is too long.')
        if not math.isfinite(seconds) or seconds < 0 or seconds > 86400: raise ValueError('Invalid response time.')
        if kind not in ('understanding', 'speed'): raise ValueError('Invalid attempt kind.')
        if kind == 'speed' and not progress_data(request.user)['concepts'].get(concept, {}).get('mastered', False):
            raise ValueError('Master understanding before recording speed attempts.')
        correct = grade(concept, question, response)
        item, created = Attempt.objects.get_or_create(student=request.user, client_id=client_id, defaults={'concept': concept, 'question_id': question, 'response': response, 'seconds': seconds, 'kind': kind, 'correct': correct, 'misconception': '' if correct else MISCONCEPTIONS[question]})
        return Response({'id': item.pk, 'correct': item.correct, 'misconception': item.misconception}, status=201 if created else 200)
    except (ValueError, TypeError, OverflowError) as e:
        return Response({'detail': str(e)}, status=400)

def progress_data(user):
    result = {}
    records = list(Attempt.objects.filter(student=user).order_by('created'))
    for concept in {a.concept for a in records}:
        understanding = [a for a in records if a.concept == concept and a.kind == 'understanding'][-8:]
        timed = [a for a in records if a.concept == concept and a.kind == 'speed' and a.correct]
        accuracy = sum(a.correct for a in understanding)/len(understanding) if understanding else 0
        distinct = len({a.question_id for a in understanding if a.correct})
        result[concept] = {'attempts': len(understanding), 'understanding_accuracy': accuracy, 'mastered': distinct >= 5 and accuracy >= .8, 'correct_question_types': distinct, 'speed_seconds': sum(a.seconds for a in timed)/len(timed) if timed else None}
    return {'student': user.username, 'concepts': result}

@api_view(['GET'])
def progress(request): return Response(progress_data(request.user))

class AssignmentViewSet(viewsets.ModelViewSet):
    serializer_class = AssignmentSerializer
    def get_queryset(self):
        return Assignment.objects.filter(teacher=self.request.user) if self.request.user.is_staff else Assignment.objects.filter(students=self.request.user)
    def get_permissions(self):
        return [IsAdminUser()] if self.action not in ('list', 'retrieve') else super().get_permissions()
    def perform_create(self, serializer): serializer.save(teacher=self.request.user)

@api_view(['POST'])
@permission_classes([IsAdminUser])
def enroll(request, pk):
    if not isinstance(request.data, dict): return Response({'detail': 'A JSON object is required.'}, status=400)
    try:
        assignment = Assignment.objects.get(pk=pk, teacher=request.user)
    except Assignment.DoesNotExist: return Response({'detail': 'Assignment not found.'}, status=404)
    usernames = request.data.get('students')
    if not isinstance(usernames, list) or len(usernames) > 200 or not all(isinstance(s, str) for s in usernames):
        return Response({'detail': 'Provide a list of up to 200 usernames.'}, status=400)
    # Only students already visible to this teacher (or explicitly linked by an administrator) may be assigned.
    known = get_user_model().objects.filter(assignments__teacher=request.user).distinct()
    if request.user.is_superuser: known = get_user_model().objects.filter(is_staff=False)
    users = list(known.filter(username__in=usernames))
    if len(users) != len(set(usernames)): return Response({'detail': 'An administrator must link unknown students to your classroom first.'}, status=400)
    assignment.students.set(users)
    return Response({'assigned': len(users)})

@api_view(['GET'])
@permission_classes([IsAdminUser])
def teacher_report(request):
    students = get_user_model().objects.filter(assignments__teacher=request.user).distinct()
    return Response({'students': [progress_data(u) for u in students[:200]], 'misconceptions': list(Attempt.objects.filter(student__in=students, correct=False).values('misconception').annotate(count=Count('id')).order_by('-count')[:30])})

class NoteViewSet(viewsets.ModelViewSet):
    serializer_class = NoteSerializer
    def get_queryset(self): return LearningNote.objects.filter(student=self.request.user)
    def perform_create(self, serializer): serializer.save(student=self.request.user)

@api_view(['GET'])
@permission_classes([AllowAny])
def content(request):
    return Response(list(ContentRecord.objects.values('record_id', 'kind', 'version', 'published')[:2000]))

def validate_content(data, record_id, kind):
    if not isinstance(data, dict) or len(json.dumps(data)) > 100000 or data.get('id') != record_id:
        raise ValueError('Provide a content object with its stable ID, under 100KB.')
    required = ('title', 'description', 'strand', 'unit', 'chapter', 'topic', 'subtopic', 'microConcept', 'coverage', 'prerequisites', 'objectives') if kind == 'curriculum' else ('problem', 'quantities', 'steps', 'assumptions', 'verification', 'valid', 'invalid', 'history')
    if kind not in ('curriculum', 'formula') or any(key not in data for key in required): raise ValueError('Required content fields are missing.')
    if kind == 'curriculum':
        keys = {'concept', 'visual', 'activity', 'derivation', 'methods', 'applications', 'assessment', 'history'}
        if not isinstance(data['coverage'], dict) or set(data['coverage']) != keys or any(v not in ('missing', 'available', 'reviewed') for v in data['coverage'].values()): raise ValueError('Invalid coverage states.')
        if not isinstance(data['prerequisites'], list) or not isinstance(data['objectives'], list): raise ValueError('Prerequisites/objectives must be arrays.')
    else:
        if not isinstance(data['steps'], list) or not data['steps'] or any(not isinstance(s, dict) or not s.get('reason') or not s.get('tex') for s in data['steps']): raise ValueError('Every derivation line needs mathematics and a reason.')
        if not isinstance(data['history'], dict) or not str(data['history'].get('source', '')).startswith('https://'): raise ValueError('Supply historical evidence or an explicit sourced uncertainty statement.')

@api_view(['POST'])
@permission_classes([IsAdminUser])
def publish(request):
    if not isinstance(request.data, dict): return Response({'detail': 'A JSON object is required.'}, status=400)
    if not request.user.has_perm('learning.change_contentrecord'): return Response({'detail': 'Content reviewer permission is required.'}, status=403)
    try:
        record_id, data, note, kind = (request.data.get(k) for k in ('record_id', 'data', 'note', 'kind'))
        if not isinstance(record_id, str) or len(record_id) > 180 or not isinstance(note, str) or not note.strip(): raise ValueError('Stable ID and review note are required.')
        validate_content(data, record_id, kind)
        with transaction.atomic():
            ContentRecord.objects.get_or_create(record_id=record_id, defaults={'kind': kind})
            record = ContentRecord.objects.select_for_update().get(record_id=record_id)
            if record.kind != kind: raise ValueError('Record type cannot change.')
            record.version += 1
            ContentRevision.objects.create(record=record, version=record.version, data=data, note=note, reviewer=request.user)
            record.published = data
            record.save()
        return Response({'record_id': record_id, 'version': record.version}, status=201)
    except (ValueError, TypeError) as e: return Response({'detail': str(e)}, status=400)

@api_view(['POST'])
@permission_classes([IsAdminUser])
def rollback(request):
    if not isinstance(request.data, dict): return Response({'detail': 'A JSON object is required.'}, status=400)
    if not request.user.has_perm('learning.change_contentrecord'): return Response({'detail': 'Content reviewer permission is required.'}, status=403)
    try:
        with transaction.atomic():
            record = ContentRecord.objects.select_for_update().get(record_id=request.data.get('record_id'))
            revision = record.revisions.get(version=request.data.get('version'))
            record.version += 1
            ContentRevision.objects.create(record=record, version=record.version, data=revision.data, note='Rollback to version '+str(revision.version), reviewer=request.user)
            record.published = revision.data
            record.save()
        return Response({'version': record.version})
    except (ContentRecord.DoesNotExist, ContentRevision.DoesNotExist, ValueError, TypeError): return Response({'detail': 'Revision not found.'}, status=404)
