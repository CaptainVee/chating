from django.urls import path
from .views import MessageListView


urlpatterns = [
    path("messages/<int:to_user_id>/", MessageListView.as_view(), name='room-create'),
]
