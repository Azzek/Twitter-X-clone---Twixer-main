from accounts.models import UserProfile
from django.db import models

from django.core.exceptions import ValidationError

class Conversation(models.Model):
    user1 = models.ForeignKey(UserProfile, related_name='conversations_user1', on_delete=models.CASCADE)
    user2 = models.ForeignKey(UserProfile, related_name='conversations_user2', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if self.user1 == self.user2:
            raise ValidationError("Conversation must be between two different users.")
        if Conversation.objects.filter(user1=self.user1, user2=self.user2).exists() or \
           Conversation.objects.filter(user1=self.user2, user2=self.user1).exists():
            raise ValidationError("A conversation between these two users already exists.")
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Conversation between {self.user1.username} and {self.user2.username}"


class Message(models.Model):
    conversation = models.ForeignKey(Conversation, related_name='messages', on_delete=models.CASCADE)
    sender = models.ForeignKey(UserProfile, related_name='sent_messages', on_delete=models.CASCADE)
    text = models.TextField()
    image = models.ImageField(null=True)
    timestamp = models.DateTimeField(auto_now_add=True)
