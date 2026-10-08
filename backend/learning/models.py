from django.conf import settings
from django.db import models

class ContentRecord(models.Model):
    record_id = models.CharField(max_length=180, unique=True)
    kind = models.CharField(max_length=20)
    version = models.PositiveIntegerField(default=0)
    published = models.JSONField(default=dict)
    updated = models.DateTimeField(auto_now=True)

class ContentRevision(models.Model):
    record = models.ForeignKey(ContentRecord, on_delete=models.PROTECT, related_name='revisions')
    version = models.PositiveIntegerField()
    data = models.JSONField()
    note = models.TextField()
    reviewer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT)
    created = models.DateTimeField(auto_now_add=True)
    class Meta:
        constraints = [models.UniqueConstraint(fields=['record', 'version'], name='unique_content_revision')]

class Attempt(models.Model):
    client_id = models.UUIDField()
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    concept = models.CharField(max_length=100)
    question_id = models.CharField(max_length=100)
    response = models.CharField(max_length=240)
    correct = models.BooleanField()
    seconds = models.FloatField()
    kind = models.CharField(max_length=20)
    misconception = models.TextField(blank=True)
    created = models.DateTimeField(auto_now_add=True)
    class Meta:
        constraints = [models.UniqueConstraint(fields=['student', 'client_id'], name='unique_student_attempt')]

class Assignment(models.Model):
    teacher = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='created_assignments')
    title = models.CharField(max_length=200)
    lab_id = models.CharField(max_length=180)
    class_number = models.PositiveSmallIntegerField()
    instructions = models.TextField()
    assessment = models.TextField(blank=True)
    students = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='assignments', blank=True)
    created = models.DateTimeField(auto_now_add=True)

class LearningNote(models.Model):
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    kind = models.CharField(max_length=20)
    concept = models.CharField(max_length=180)
    data = models.JSONField()
    updated = models.DateTimeField(auto_now=True)
