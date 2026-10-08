import uuid
from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from .models import Attempt, Assignment, ContentRecord, ContentRevision
from .symbolic import parse_expression, grade
class SymbolicTests(TestCase):
    def test_exact_arithmetic(self):
        self.assertEqual(str(parse_expression('0.1+0.2')), '3/10')
        self.assertTrue(grade('circle-area', 'area-three', '18*pi/2'))
        self.assertTrue(grade('circle-area', 'area-three', '9π'))
        self.assertFalse(grade('circle-area', 'area-three', '28.27433388'))
    def test_rejects_code_and_resource_exhaustion(self):
        for source in ["__import__('os')", 'x.__class__', '[1][0]', 'sin(x,1)', '2**1000000', '((2**10)**10)**10', '1/0', '0**-1', 'pi**10**10', 'x;print(1)']:
            with self.subTest(source=source), self.assertRaises(ValueError): parse_expression(source)
    def test_symbolic_endpoint(self):
        res = self.client.post('/api/symbolic/', {'expression': 'a*x**2+b*x+c', 'operation': 'differentiate', 'values': {'a': 2, 'b': 3, 'c': 1}}, content_type='application/json')
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json()['result'], '4*x + 3')
        self.assertEqual(self.client.post('/api/symbolic/', {'expression': 'sqrt(x)', 'operation': 'evaluate', 'at': -1}, content_type='application/json').status_code, 200)
        self.assertEqual(self.client.post('/api/symbolic/', {'expression': '1/x', 'operation': 'evaluate', 'at': 0}, content_type='application/json').status_code, 400)
    def test_malformed_json_and_expansion_limits(self):
        self.assertEqual(self.client.post('/api/symbolic/', [], content_type='application/json').status_code, 400)
        self.assertEqual(self.client.post('/api/symbolic/', {'expression': '(x+a+b+c+sin(x))**10', 'operation': 'expand'}, content_type='application/json').status_code, 400)

class LearningAPITests(TestCase):
    def setUp(self):
        users = get_user_model()
        self.student = users.objects.create_user(username='student', password='unique-test-password')
        self.other = users.objects.create_user(username='other', password='unique-test-password')
        self.teacher = users.objects.create_user(username='teacher', password='unique-test-password', is_staff=True)
        self.admin = users.objects.create_superuser(username='reviewer', password='unique-test-password', email='reviewer@example.com')
        self.api = APIClient()
        self.api.force_authenticate(self.student)
    def attempt(self, question='area-three', response='9*pi', kind='understanding', identifier=None):
        return self.api.post('/api/attempts/', {'id': identifier or str(uuid.uuid4()), 'concept': 'circle-area', 'questionId': question, 'response': response, 'seconds': 10, 'kind': kind, 'correct': True}, format='json')
    def test_server_grades_and_sync_is_idempotent(self):
        identifier = str(uuid.uuid4())
        result = self.attempt(response='6*pi', identifier=identifier)
        self.assertFalse(result.data['correct'])
        self.assertEqual(self.attempt(identifier=identifier).status_code, 200)
        self.assertEqual(Attempt.objects.count(), 1)
        self.assertFalse(Attempt.objects.get().correct)
    def test_mastery_requires_distinct_questions_and_speed_is_separate(self):
        for i in range(5): self.attempt()
        self.assertFalse(self.api.get('/api/progress/').data['concepts']['circle-area']['mastered'])
        self.assertEqual(self.attempt(kind='speed').status_code, 400)
        for q, a in [('diameter-ten', '25*pi'), ('scale', '9'), ('ring', '16*pi'), ('error', '8*pi'), ('zero', '0')]: self.attempt(q, a)
        self.assertTrue(self.api.get('/api/progress/').data['concepts']['circle-area']['mastered'])
        self.assertEqual(self.attempt(kind='speed').status_code, 201)
        self.assertEqual(self.api.get('/api/progress/').data['concepts']['circle-area']['understanding_accuracy'], 1)
    def test_students_cannot_see_others_records_or_create_assignments(self):
        self.attempt()
        self.assertEqual(self.api.post('/api/assignments/', {'title': 'bad'}, format='json').status_code, 403)
        self.api.force_authenticate(self.other)
        self.assertEqual(self.api.get('/api/attempts/').data, [])
        self.assertEqual(self.api.get('/api/teacher-report/').status_code, 403)
    def test_teacher_reports_only_assigned_students(self):
        self.attempt()
        assignment = Assignment.objects.create(teacher=self.teacher, title='Circle', lab_id='lab-focus-circle-area', class_number=7, instructions='Explain')
        assignment.students.add(self.student)
        self.api.force_authenticate(self.teacher)
        report = self.api.get('/api/teacher-report/').data
        self.assertEqual([r['student'] for r in report['students']], ['student'])
        self.assertEqual(self.api.post('/api/assignments/'+str(assignment.pk)+'/enroll/', {'students': ['other']}, format='json').status_code, 400)
    def test_publishing_requires_reviewer_and_rollback_keeps_history(self):
        record = {'id': 'test-circle', 'problem': 'Garden', 'quantities': [['r','radius','m']], 'steps': [{'tex': 'A=pi*r^2', 'reason': 'Sector limiting argument'}], 'assumptions': ['Euclidean'], 'verification': 'Polygon bounds', 'valid': 'disk', 'invalid': 'sphere', 'history': {'source': 'https://mathshistory.st-andrews.ac.uk/'}}
        body = {'record_id': 'test-circle', 'data': record, 'note': 'Reviewed maths', 'kind': 'formula'}
        self.assertEqual(self.api.post('/api/content/publish/', body, format='json').status_code, 403)
        self.api.force_authenticate(self.teacher)
        self.assertEqual(self.api.post('/api/content/publish/', body, format='json').status_code, 403)
        self.api.force_authenticate(self.admin)
        self.assertEqual(self.api.post('/api/content/publish/', body, format='json').status_code, 201)
        record['problem'] = 'Updated garden'
        self.api.post('/api/content/publish/', body, format='json')
        self.assertEqual(self.api.post('/api/content/rollback/', {'record_id': 'test-circle', 'version': 1}, format='json').status_code, 200)
        self.assertEqual(ContentRecord.objects.get().published['problem'], 'Garden')
        self.assertEqual(ContentRevision.objects.count(), 3)
    def test_invalid_times_and_notes(self):
        self.assertEqual(self.api.post('/api/attempts/', {'id': str(uuid.uuid4()), 'response': '9*pi', 'seconds': 'inf', 'concept': 'circle-area', 'questionId': 'area-three', 'kind': 'understanding'}, format='json').status_code, 400)
        self.assertEqual(self.api.post('/api/notes/', {'kind': 'admin', 'concept': 'circle', 'data': {}}, format='json').status_code, 400)
    def test_sign_out_revokes_the_account_token(self):
        from rest_framework.authtoken.models import Token
        token = Token.objects.create(user=self.student)
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='Token '+token.key)
        self.assertEqual(client.post('/api/logout/').status_code, 200)
        self.assertFalse(Token.objects.filter(user=self.student).exists())
        self.assertEqual(client.get('/api/progress/').status_code, 401)
