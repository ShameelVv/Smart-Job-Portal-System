from django.contrib import admin
from django.urls import path
from .views import RegisterView,LoginView,JobCreateView,JobListView,ApplyJobView,ApplicationView,ApplicantView,UpdateApplicationStatusView,AdminUserView,AdminJobsView,AdminApplicationView,DeleteJobView,BanUserView,JobCategoryView,CurrentUserView,JobTypeView,SkillView,ProfileView

# to upload the resume
from django.conf import settings
from django.conf.urls.static import static
# for jwt authentication
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/register/', RegisterView.as_view(),name='register'),
    path('api/login/', LoginView.as_view(),name='login'),

    path('api/token/', TokenObtainPairView.as_view()),
    path('api/token/refresh/', TokenRefreshView.as_view()),

    path('api/jobs/create/', JobCreateView.as_view(), name='create-job'),
    path('api/jobs/', JobListView.as_view(), name='job-list'),
    path('api/jobs/apply/', ApplyJobView.as_view(), name='apply-job'),

    path('api/applications/', ApplicationView.as_view(), name='applications'),

    path('api/jobs/<int:job_id>/applications/',ApplicantView.as_view(), name='job-applications'),

    path(
    'api/applications/<int:application_id>/status/',
    UpdateApplicationStatusView.as_view(),
    name='update-application-status'),



    path('api/admin/users/', AdminUserView.as_view()),
    path('api/admin/jobs/', AdminJobsView.as_view()),
    path('api/admin/applications/', AdminApplicationView.as_view()),
    path('api/admin/delete-job/<int:job_id>/', DeleteJobView.as_view()),
    path('api/admin/ban-user/<int:user_id>/', BanUserView.as_view()),
    
    path('api/job-categories/', JobCategoryView.as_view()),

    path('api/me/',CurrentUserView.as_view()),

    path('api/job-type/',JobTypeView.as_view()),
    path('api/skills/',SkillView.as_view()),

    path('api/profile/', ProfileView.as_view()),


]


# Add this to allow viewing uploaded files in the browser
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)