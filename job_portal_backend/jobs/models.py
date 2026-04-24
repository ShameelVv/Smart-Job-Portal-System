from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

# Create your models here.

# job category
class JobCategory(models.Model):

    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name
    

# skill category
class Skill(models.Model):

    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name    
    
# type of job category parttime or fulltime etc

class JobType(models.Model):

    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name    




# company model
class Company(models.Model):

    name = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    location = models.CharField(max_length=200, blank=True, null=True)

   

    created_at = models.DateTimeField(auto_now_add=True)
    # link company to user 
    owner=models.OneToOneField(User,on_delete=models.CASCADE)

    def __str__(self):
        return self.name



# job model
class Job(models.Model):
    title = models.CharField(max_length=200)

    description = models.TextField()

    company = models.ForeignKey(Company,on_delete=models.CASCADE)

    posted_on = models.DateTimeField(auto_now_add=True)

    created_by = models.ForeignKey(User, on_delete=models.CASCADE)

    salary = models.CharField(max_length=50) 

    location = models.CharField(max_length=100, null=True, blank=True)

    category = models.ForeignKey(JobCategory, on_delete=models.SET_NULL, null=True)

    job_type = models.ForeignKey(JobType, on_delete=models.SET_NULL, null=True)

    skills = models.ManyToManyField(Skill, blank=True)

# application model
class Application(models.Model):
    STATUS_CHOICES = (
        ('pending','Pending'),
        ('shortlisted','ShortListed'),
        ('rejected','Rejected'),
        ('hired','Hired'),
    ) 
    job=models.ForeignKey(Job,on_delete=models.CASCADE)
    applicant = models.ForeignKey(User,on_delete=models.CASCADE)
    status = models.CharField(max_length=20,choices=STATUS_CHOICES, default='pending')
    applied_on=models.DateTimeField(auto_now_add=True)
    resume = models.FileField(upload_to='resumes/', null=True, blank=True)



#for role based 
class Profile(models.Model):

    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('employer', 'Employer'),
        ('jobseeker', 'JobSeeker'),
    )



    resume = models.FileField(upload_to="resumes/", null=True, blank=True)
    skills = models.JSONField(default=list)
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    role = models.CharField(max_length=20, choices=ROLE_CHOICES)

    # for jobcategory to be filled while registration proces
    preferred_category = models.ForeignKey(
        JobCategory,on_delete=models.SET_NULL,null=True,blank=True
    )

    def __str__(self):
        return f"{self.user.username} - {self.role}"


class Notification(models.Model):
    # Who receives this notification
    recipient = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='notifications'
    )
    # The message text
    message = models.TextField()

    # False = unread (new), True = read (seen)
    is_read = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"To {self.recipient.username}: {self.message[:40]}"