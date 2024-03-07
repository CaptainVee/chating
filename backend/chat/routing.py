from django.urls import path

from chat import consumers

websocket_urlpatterns = [
    path('chat/<str:to_user_id>/', consumers.ChatConsumer.as_asgi()),
]
