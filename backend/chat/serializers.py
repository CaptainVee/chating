from rest_framework import serializers
from .models import Message
# from urllib.parse import unquote


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ["id", "user", "message", "read", "created_at"]
