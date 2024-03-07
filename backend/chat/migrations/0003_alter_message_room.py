# Generated by Django 4.1.6 on 2024-03-01 10:15

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("chat", "0002_room_users_message"),
    ]

    operations = [
        migrations.AlterField(
            model_name="message",
            name="room",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="room_messages",
                to="chat.room",
            ),
        ),
    ]