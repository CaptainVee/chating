from django.urls import path
from django.views.generic import TemplateView
from chat import views


urlpatterns = [
    path("room/<str:room_name>/", views.room_create, name='room-create'),
]
