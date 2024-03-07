import json

from asgiref.sync import sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from django.db.models import Q
from chat.models import Room, Message
from accounts.models import User
from django.shortcuts import get_object_or_404

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        print(self)
        print("this is scope", self.scope)
        self.user = self.scope["user"]
        if not self.user.is_authenticated:
            print("not authenticated")
            return
        self.room_name = self.scope["url_route"]["kwargs"]["room_slug"]
        self.room_group_name = "chat_%s" % self.room_name
        self.user = self.scope["user"]
        print("connecting", self.user)
        print("fdfdfd", self.user.id)

        await self.channel_layer.group_add(
            self.room_group_name, self.channel_name
        )

        await self.add_user(self.room_name, self.user)
        await self.accept()

    async def disconnect(self, close_code):
        await self.remove_user(self.room_name, self.user)
        await self.channel_layer.group_discard(
            self.room_group_name, self.channel_name
        )

    async def receive(self, text_data):
        json_text_data = json.loads(text_data)
        message_type = json_text_data["type"]
        if message_type == "chat_message":
            message = json_text_data["message"]
            username = self.user.username
            room = self.room_name
            print('this is message', message, username, room)
            await self.save_message(room, username, message)
            await self.channel_layer.group_send(
                self.room_group_name, 
                {
                    "type": "chat_message",
                    "message": message,
                    "room": room,
                    "username": username,
                }
            )
        if message_type == "read_receipt":
            room = self.room_name
            await self.read_message(room, self.user)


    async def chat_message(self, event):
        message = event["message"]
        room = event["room"]
        username = event["username"]
        await self.send(
            text_data=json.dumps(
                {   
                    "type": "new_message",
                    "message": message,
                    "room": room,
                    "username": username
                }
            )
        )

    @sync_to_async
    def save_message(self, room, username, message):
        room = Room.objects.get(slug=room)
        user = User.objects.get(username=username)
        Message.objects.create(room=room, user=user, message=message)

    @sync_to_async
    def add_user(self, room, user):
        room = Room.objects.get(slug=room)
        if user not in room.users.all():
            room.users.add(user)
            room.save()

    @sync_to_async
    def read_message(self, room, user):
        print("read message", room, self)
        print(f'{user} has seen all his messages')
        room = get_object_or_404(Room, slug=room)
        unread_messages = Message.objects.filter(
            room=room,read=False).exclude(Q(user=user))
        print(unread_messages)
        unread_messages.update(read=True)

    @sync_to_async
    def remove_user(self, room, user):
        room = Room.objects.get(slug=room)
        if user in room.users.all():
            room.users.remove(user)
            room.save()
