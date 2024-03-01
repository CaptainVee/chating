import string
import random
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, reverse, redirect
from django.utils.text import slugify
from chat.models import Room, Message
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.utils.crypto import get_random_string
from .serializers import MessageSerializer


@api_view(['GET'])
def room_create(request, room_name):
    room = Room.objects.get(slug=room_name)
    # room_id = get_random_string(length=4, allowed_chars='abcdefghijklmnopqrstuvwxyz0123456789')
    # room_slug = f"{room_name}_{room_id}"
    # user = get_object_or_404(User, pk=request.user.pk)
    messages = Message.objects.filter(room=room).order_by('-created_at')
    serializer = MessageSerializer(messages, many=True)
    return Response(serializer.data)
