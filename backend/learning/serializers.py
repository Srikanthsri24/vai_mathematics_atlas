from rest_framework import serializers
from .models import Assignment, LearningNote
class AssignmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assignment
        fields = ['id', 'title', 'lab_id', 'class_number', 'instructions', 'assessment', 'students', 'created']
        read_only_fields = ['id', 'students', 'created']
    def validate_class_number(self, value):
        if not 1 <= value <= 12: raise serializers.ValidationError('Class must be 1–12.')
        return value
class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = LearningNote
        fields = ['id', 'kind', 'concept', 'data', 'updated']
        read_only_fields = ['id', 'updated']
    def validate_kind(self, value):
        if value not in ('notebook', 'observation', 'experiment'): raise serializers.ValidationError('Unsupported note kind.')
        return value
    def validate_data(self, value):
        import json
        if len(json.dumps(value)) > 20000: raise serializers.ValidationError('Note is too large.')
        return value
