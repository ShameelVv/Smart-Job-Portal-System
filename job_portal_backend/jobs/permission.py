from rest_framework.permissions import BasePermission
from .models import Profile

# this checks the profile role of the person login in and grands permission if person is employee
class IsEmployer(BaseException):
    def has_permission(self,request,view):

        if not request.user.is_authenticated:
            return False
        Profile = Profile.objects.get(user=request.user)

        return profile.role == "employer"