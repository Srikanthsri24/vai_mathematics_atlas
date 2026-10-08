from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
router = DefaultRouter()
router.register('assignments', views.AssignmentViewSet, basename='assignment')
router.register('notes', views.NoteViewSet, basename='note')
urlpatterns = [path('health/', views.health), path('login/', views.login), path('logout/', views.logout), path('symbolic/', views.symbolic), path('attempts/', views.attempts), path('progress/', views.progress), path('teacher-report/', views.teacher_report), path('assignments/<int:pk>/enroll/', views.enroll), path('content/', views.content), path('content/publish/', views.publish), path('content/rollback/', views.rollback), path('', include(router.urls))]
