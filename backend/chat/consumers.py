import json

from asgiref.sync import sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from django.db.models import Q
from chat.models import Room, Message
from accounts.models import User
from .serializers import MessageSerializer
from .utils import create_room_name


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope["user"]
        to_user_id = self.scope["url_route"]["kwargs"]["to_user_id"]
        self.room_name = create_room_name(self.user.id, to_user_id)
        self.room_group_name = f"chat_{self.room_name}"

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)

        # Avoid redundant sync call
        await self.add_user(self.room_name, self.user)
        await self.accept()

    async def disconnect(self, close_code):
        # Avoid redundant sync call
        await self.remove_user(self.room_name, self.user)
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        try:
            json_data = json.loads(text_data)
            message_type = json_data["type"]

            if message_type == "chat_message":
                message = json_data["message"]
                username = self.user.username
                room = self.room_name
                serialized_message = await self.save_message(room, username, message)
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        "type": "chat_message",
                        "serialized_message": serialized_message,
                        "room": room,
                        "username": username,
                    },
                )

            elif message_type == "read_receipt":
                room = self.room_name
                await self.read_message(room, self.user)
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {"type": "get_messages"},
                )

        except json.JSONDecodeError:
            # Handle invalid JSON data gracefully (e.g., close connection)
            pass

    async def chat_message(self, event):
        message = event["serialized_message"]
        room = self.room_name
        username = event["username"]
        await self.send(
            text_data=json.dumps(
                {
                    "type": "new_message",
                    "message": message,
                    "room": room,
                    "username": username,
                }
            )
        )


    async def get_messages(self, event):
        messages = await self._get_message_history(self.room_name)
        await self.send(
            text_data=json.dumps(
                {"type": "message_history", "messages": messages}
            )
        )

    @sync_to_async
    def save_message(self, room, username, message):
        room = Room.objects.get(name=room)
        user = User.objects.get(username=username)
        message = Message.objects.create(room=room, user=user, message=message)
        return MessageSerializer(message).data

    @sync_to_async
    def add_user(self, room, user):
        room, created =  Room.objects.get_or_create(name=room)
        if user not in room.users.all():
             room.users.add(user)
             room.save()

    @sync_to_async
    def remove_user(self, room, user):
        room =  Room.objects.get(name=room)
        if user in room.users.all():
             room.users.remove(user)
             room.save()

    @sync_to_async
    def read_message(self, room, user):
        print(f"{user} has read his messages"
        )
        room = Room.objects.get(name=room)
        unread_messages =  Message.objects.filter(
            room=room, read=False
        ).exclude(Q(user=user))
        unread_messages.update(read=True)
        

    @sync_to_async
    def _get_message_history(self, room_name):
            messages =  Message.objects.filter(room__name=room_name).order_by('created_at')[:100]  # Limit to 100 messages
            return MessageSerializer(messages, many=True).data
