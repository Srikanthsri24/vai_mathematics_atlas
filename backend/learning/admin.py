from django.contrib import admin
from .models import Assignment, ContentRecord, ContentRevision, Attempt, LearningNote
@admin.register(ContentRecord, ContentRevision, Attempt)
class ImmutableAuditAdmin(admin.ModelAdmin):
    def get_readonly_fields(self, request, obj=None): return [field.name for field in self.model._meta.fields]
    def has_add_permission(self, request): return False
    def has_delete_permission(self, request, obj=None): return False
admin.site.register(Assignment)
admin.site.register(LearningNote)
