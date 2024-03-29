from django.contrib.auth.backends import ModelBackend
from .models import CustomUser

class CustomUserBackend(ModelBackend):
    def authenticate(self, request, name=None, password=None, **kwargs):
        try:
            user = CustomUser.objects.get(name=name)
        except CustomUser.DoesNotExist:
            return None

        if user.check_password(password):
            return user
        return None

    def get_user(self, user_id):
        try:
            return CustomUser.objects.get(pk=user_id)
        except CustomUser.DoesNotExist:
            return None
