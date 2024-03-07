from django.utils.text import slugify
from chat.models import Room, Message
from rest_framework.response import Response
from rest_framework.generics import ListAPIView
from .utils import create_room_name
from .serializers import MessageSerializer
from rest_framework.permissions import IsAuthenticated



class MessageListView(ListAPIView):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]
    queryset = Message.objects.all()

    def get_queryset(self):
        to_user_id = self.kwargs.get("to_user_id")
        room_name = create_room_name(self.request.user.id, to_user_id)
        room, created = Room.objects.get_or_create(name=room_name)
        messages = Message.objects.filter(room=room).order_by('created_at')
        return messages
