from django.db import models
from accounts.models import User

class Room(models.Model):
    name = models.CharField(max_length=128)
    # slug = models.SlugField(unique=True)
    users = models.ManyToManyField(User)

    def __str__(self):
        return self.name


class Message(models.Model):
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name="room_messages")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="sender")
    message = models.TextField()
    read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return (self.room.name + " - " + str(self.user.username) + " : " + str(self.message))
