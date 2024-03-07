# views.py
from django.contrib.auth import get_user_model
from rest_framework.generics import RetrieveUpdateAPIView, ListAPIView
from rest_framework.permissions import IsAuthenticated
from .serializers import UserSerializer
from .models import User

class CustomUserDetailsView(RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

class UserListView(ListAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
            user = self.request.user
            queryset = User.objects.exclude(pk=user.pk)  # Exclude the requesting user
            return queryset
