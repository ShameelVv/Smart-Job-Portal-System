from rest_framework import serializers,validators
from django.contrib.auth.models import User
from .models import Profile,Application

from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate

from rest_framework import serializers
from .models import Job,JobCategory,Company,JobType,Skill

from django.db import transaction

# registration for creating user using modelserializer
class RegisterSerializer(serializers.ModelSerializer):
    role = serializers.ChoiceField(choices=Profile.ROLE_CHOICES)

    company_name = serializers.CharField(required=False)


    preferred_category = serializers.PrimaryKeyRelatedField(
        queryset=JobCategory.objects.all(), required=False, allow_null=True
    )

    email  = serializers.EmailField(required=True,
    validators=[validators.UniqueValidator(queryset=User.objects.all())])
    class Meta:
        model = User
        fields = ['username','email','password','role','preferred_category','company_name' ]
        extra_kwargs={
            'password':{'write_only': True}
        }
        #define a function to link role and user 
    def create(self, validated_data):
        role = validated_data.pop('role') #taking role from user input
        category_obj = validated_data.pop('preferred_category',None) #takes the prefferedcategory
        company_name = validated_data.pop('company_name',None)

        
       # Enforce category for jobseeker
        if role == "jobseeker" and not category_obj:
             raise serializers.ValidationError({
            "preferred_category": "This field is required for jobseekers."
        })

    # Create the User
        user = User.objects.create_user(**validated_data)
        Profile.objects.create(
            user = user,
            role = role,
            preferred_category=category_obj if role =='jobseeker' else None
        )
        # create company automatically 
        if role =="employer":
            if not company_name:
                raise serializers.ValidationError({
                    "company_name":"Company name is required for employer"
                })
            Company.objects.create(
                name=company_name,
                owner=user
            )
        return user
           




# serializer for login
class LoginSerializer(serializers.Serializer):
    username=serializers.CharField()
    password= serializers.CharField()  

        #   for login jwt method

    def validate(self, data):

        user=authenticate(
            username=data['username'],
            password=data['password']
        )

        if not user:
            raise serializers.ValidationError("Invalid Credentials")
        refresh=RefreshToken.for_user(user)
        role=Profile.objects.get(user=user).role #checks the role of person who is login in

        return{
            "access":str(refresh.access_token),
            "refresh":str(refresh),
            "role":role
        }


# job serializer 
class JobSerializer(serializers.ModelSerializer):
    # code to fetch the employer name 
    employer = serializers.CharField(source='created_by.username', read_only=True)
    
    employer_email = serializers.CharField(
    source='created_by.email',
    read_only=True
    )
    company_name = serializers.CharField(
        source='company.name',
        read_only=True
    )

    category_name = serializers.CharField(
        source='category.name',
        read_only=True
    )
     # 👇 convert job_type ID → name
    # job_type = serializers.CharField(source='job_type.name', read_only=True)

    # 👇 convert skills → list of names
    # skills = serializers.SerializerMethodField()
    # for displayying
    skills_list = serializers.SerializerMethodField()

    job_type_name = serializers.CharField(
        source='job_type.name',
        read_only=True
    )

    def get_skills_list(self, obj):
        print(obj.skills.all())
        # This converts the Many-to-Many objects into a simple list of strings
        return [skill.name for skill in obj.skills.all()]
    class Meta:
        model = Job
        fields = [
        'id', 'title', 'description', 'company', 'company_name',
        'category', 'category_name', 'salary', 'location',
        'employer', 'employer_email', 'posted_on',
        'skills','skills_list','job_type','job_type_name'
        ]
        extra_kwargs={
            'company':{'required': False}
        }
        read_only_fields = ['created_by'] #this tells serializer to automatically take created by field



# job seeker to see all jobs serializer part
class ApplicationSerializer(serializers.ModelSerializer):
    # this code provided to fetch the title and cmpny name to frontend part
    # read only = true means user can only see the data they cant modify
    job_title = serializers.CharField(source='job.title', read_only=True)

    company = serializers.CharField(source='job.company', read_only=True) 

    resume = serializers.FileField(required=False)

    
    class Meta:
        model = Application
        fields = [
            'id',
            'job',
            'job_title',
            'company',
            'status',
            'resume',
            'applied_on'
        ]


# code for emplyer to see who applied for job
class ApplicantSerializer(serializers.ModelSerializer):
    # fetch the applicant name and email for frontend
    applicant_name=serializers.CharField(source='applicant.username',read_only=True)

    applicant_email = serializers.CharField(source='applicant.email', read_only=True)

    class Meta:
        model = Application
        fields = [
            'id',
            'applicant_name',
            'applicant_email',
            'status',
            'applied_on'
        ]


# code to change the status of job
class UpdateApplicationStatusSerializer(serializers.ModelSerializer):

    class Meta:
        model = Application
        fields = ['status']

# serializer for jobcategory to get in frontend
class JobCategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = JobCategory
        fields = ['id','name']

# serializer for company
class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model=Company
        fields=['id','name','location']

class JobTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobType
        fields = ['id', 'name']

class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ['id', 'name']        



# serializer for profile 
class ProfileSerializer(serializers.ModelSerializer):
    username=serializers.CharField(source='user.username')
    email=serializers.EmailField(source='user.email')
    class Meta:
        model = Profile
        fields = ['username','email','role','preferred_category']



# for editing the profile
class ProfileUpdateSerializer(serializers.ModelSerializer):

    username = serializers.CharField(source='user.username', required=False)
    email = serializers.EmailField(source='user.email', required=False)

    class Meta:
        model = Profile
        fields = ['username', 'email', 'preferred_category']

    def update(self, instance, validated_data):

        user_data = validated_data.pop('user', {})

        # update user table
        user = instance.user
        user.username = user_data.get('username', user.username)
        user.email = user_data.get('email', user.email)
        user.save()

        # update profile
        instance.preferred_category = validated_data.get(
            'preferred_category',
            instance.preferred_category
        )
        instance.save()

        return instance        
        