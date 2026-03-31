from django.contrib import admin
from jobs.models import Job,Application,Profile,JobCategory,Skill,JobType,Company

# Register your models here.
admin.site.register(Job)
admin.site.register(Application)
admin.site.register(Profile)
admin.site.register(JobCategory)
admin.site.register(Skill)
admin.site.register(JobType)
admin.site.register(Company)
