from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import RegisterSerializer,LoginSerializer,ApplicationSerializer,ApplicantSerializer,JobSerializer,UpdateApplicationStatusSerializer,JobCategorySerializer,CompanySerializer,JobTypeSerializer,SkillSerializer,ProfileSerializer,ProfileUpdateSerializer 
from rest_framework import status

from rest_framework.permissions import IsAuthenticated
from .models import Job, Profile,Application,JobCategory,Company,JobType,Skill

from django.contrib.auth.models import User

from rest_framework.parsers import MultiPartParser, FormParser




# Create your views here.


# registerations view function using serializer and restframework
class RegisterView(APIView):
    def post(self,request):
        data=request.data
        serializer=RegisterSerializer(data=data)
        
        if serializer.is_valid():
            serializer.save()   #saves user

            # Extract the role from the validated data
            role = serializer.validated_data.get('role')
            return Response({'message':'User Registeration Successfull','role': role},
            status=status.HTTP_201_CREATED)
        return Response({'message': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    

 #login 

class LoginView(APIView):
    def post(self,request):
        data=request.data
        serializer=LoginSerializer(data=data)
        if serializer.is_valid():
            # We combine the token data and the success message into one dictionary
            response_data = {
                "message": "Login Successful",
                **serializer.validated_data  # This 'unpacks' the access, refresh, and role tokens
            }
            return Response(response_data, status=status.HTTP_200_OK)
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# job creating 
class JobCreateView(APIView):
    permission_classes=[IsAuthenticated]

    def post(self,request):
        # checks the user role
        profile=Profile.objects.get(user=request.user)

        if profile.role !='employer':
            return Response(
                {"message":"only employer can create jobs"},
                status=status.HTTP_403_FORBIDDEN
            )
        # logic for auto connecting employer and company
        try:
            company=Company.objects.get(owner=request.user)
        except Company.DoesNotExist:
            return Response({'message':'Create company first'})
        data = request.data.copy()
        data['company']=company.id    
        serializer = JobSerializer(data=data)

        if serializer.is_valid():
            serializer.save(created_by=request.user)
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

# code for fetching the listed job
class JobListView(APIView):
    # This allows guests to see the jobs, but checks roles if they ARE logged in
    def get(self, request):
        # 1. Check if user is logged in at all
        if request.user.is_authenticated:
            try:
                user_profile = Profile.objects.get(user=request.user)
                if user_profile.role == 'employer':
                    # Employers only see jobs they created
                    jobs = Job.objects.filter(created_by=request.user)
                else:
                    # Jobseekers see everything
                    jobs = Job.objects.all()
            except Profile.DoesNotExist:
                # Fallback if a user exists but has no profile record
                jobs = Job.objects.all()
        else:
            # Guest users (not logged in) see all jobs
            jobs = Job.objects.all()

        serializer = JobSerializer(jobs, many=True)
        return Response(serializer.data)
    


# code for applying the job 
class ApplyJobView(APIView):
    permission_classes=[IsAuthenticated]
    parser_classes=[MultiPartParser,FormParser]

    def post(self,request):
        job_id=request.data.get('job')

        # check the job exist
        try:
            job=Job.objects.get(id=job_id)
        except Job.DoesNotExist:
            return Response({'message':'job not found'},status=404)
        #check role
        profile = Profile.objects.get(user=request.user) 
        if profile.role != "jobseeker":
            return Response(
                {"message": "Only job seekers can apply"},
                status=status.HTTP_403_FORBIDDEN
            )
        # prevent duplication
        if Application.objects.filter(job=job, applicant=request.user).exists():
            return Response(
                {"message": "You already applied for this job"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Create application
        Application.objects.create(
            job=job,
            applicant=request.user,
            resume=request.FILES.get('resume')
        )

        return Response(
            {"message": "Application submitted successfully"},
            status=status.HTTP_201_CREATED
        )
    

 # job seeker to see all jobs view function part 
class ApplicationView(APIView):
    permission_classes=[IsAuthenticated]

    def get(self,request):
        applications=Application.objects.filter(applicant=request.user)
        serializer=ApplicationSerializer(applications,many=True)
        return Response(serializer.data)
    

# jobapplicant view function
class ApplicantView(APIView):
    permission_classes=[IsAuthenticated]

    def get(self,request,job_id):
        try:
            job=Job.objects.get(id=job_id)
        except Job.DoesNotExist:
            return Response({'message':'Job not found'},status=404)
            # code foe only emplyer who created job can see the applicant
            
        if job.created_by !=request.user:
           return Response(
            {"message": "You are not allowed to view applicants"},
            status=403
            ) 
        applications = Application.objects.filter(job=job)

        serializer = ApplicantSerializer(applications, many=True)

        return Response(serializer.data)
    


# view function to change the status of job
class UpdateApplicationStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, application_id):

        try:
            application = Application.objects.get(id=application_id)
        except Application.DoesNotExist:
            return Response({"message": "Application not found"}, status=404)

        job = application.job

        # Ensure only employer who created job can update
        if job.created_by != request.user:
            return Response(
                {"message": "You are not allowed to update this application"},
                status=403
            )

        serializer = UpdateApplicationStatusSerializer(
            application,
            data=request.data,
            partial=True
        )

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=400)

# admin dashboard view function for listing all the user
class AdminUserView(APIView):
    permission_classes=[IsAuthenticated]

    def get(self,request):
        if request.user.profile.role !="admin":
            return Response({'message':'unauthorized User'},status=403)
        user=User.objects.all()
        data=[{'id':u.id,"username":u.username}for u in user]

        return Response(data)

# admin dashboard view function to view all jobs
class AdminJobsView(APIView):
    permission_classes=[IsAuthenticated]

    def get(self,request):
        if request.user.profile.role !='admin':
            return Response({'message':'unauthorized user'},status=403)
        jobs=Job.objects.all()
        serializer=JobSerializer(jobs,many=True)
        return Response(serializer.data)
    
# admin dashboard view function to view all applications
class AdminApplicationView(APIView):
    permission_classes=[IsAuthenticated]

    def get(self,request):
        if request.user.profile.role !='admin':
            return Response ({'message':'unauthorized user'},status=403)
        applications=Application.objects.all()
        serailizer=ApplicationSerializer(applications,many=true)   
        return Response(serailizer.data) 
    
# admin dashboard view function to view all delete job
class DeleteJobView(APIView):
    permission_classes=[IsAuthenticated]

    def delete(self,request,job_id):
        if request.user.profile.role !='admin':
            return Response({'message':'unauthorized user'},status=403)
        try:
            job=Job.objects.get(id=job_id)
        except Job.DoesNotExist:
            return Response({'message':'Job not found'},status=404)
        job.delete()
        return Response({'message':'Job deleted'})     

# admin dashboard view function to ban a user
class BanUserView(APIView):
    permission_classes=[IsAuthenticated]

    def patch(self,request,user_id):
        if request.user.profile.role !='admin':
            return Response({'message':'unauthorized user'},status=403)
        try:
            user=User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({'message':'User not found'},status=404)
        user.is_active = False
        user.save()

        return Response({'message':'User banned'})


# jobcatergory view function
class JobCategoryView(APIView):
     def get(self, request):

        categories = JobCategory.objects.all()

        serializer = JobCategorySerializer(categories, many=True)

        return Response(serializer.data)
     

# view function for company
class CreateCompanyView(APIView):
    permission_classes=[IsAuthenticated]

    def post(self,request):
        if Company.objects.filter(owner=request.user).exists():
            return Response({
                'message':'you already created a company'
            },status=400)
        serializer=CompanySerializer(data=request.data)
        if serializer .is_valid():
            company=serializer.save(owner=request.user)

            return Response({'message':'Company created','company_id':company.id},status=201)
        return Response(serializer.errors)

# function to see who is the current user inorder to fetch the name and email of the current user in frontend

class CurrentUserView(APIView):
    permission_classes=[IsAuthenticated]
    def get (self, request):

        user=request.user
        profile=Profile.objects.get(user=user)
        return Response({
            "username":user.username,
            "email":user.email,
            "role": profile.role,
        })
    

class JobTypeView(APIView):
    def get(self, request):
        types = JobType.objects.all()
        serializer = JobTypeSerializer(types, many=True)
        return Response(serializer.data)    
    
class SkillView(APIView):
    def get(self, request):
        skills = Skill.objects.all()
        serializer = SkillSerializer(skills, many=True)
        return Response(serializer.data)    
    

class ProfileView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile = Profile.objects.get(user=request.user)
        serializer = ProfileSerializer(profile)
        return Response(serializer.data)

    def patch(self, request):
        profile = Profile.objects.get(user=request.user)
        serializer = ProfileUpdateSerializer(
            profile,
            data=request.data,
            partial=True
        )

        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Profile updated'})
        
        return Response(serializer.errors, status=400)    