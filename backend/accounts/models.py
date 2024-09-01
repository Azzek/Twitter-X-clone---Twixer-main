from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    description = models.CharField(max_length=255, blank=True)
    username = models.CharField(max_length=100, default='Unknown')
    email = models.EmailField(unique=True, null=True)
    avatar = models.ImageField(null=True, blank=True)
    banner = models.ImageField(null=True, blank=True)
    birth_date = models.DateField(null=True, blank=True)
    date = models.DateTimeField(auto_now_add=True)
    followers = models.ManyToManyField('self', through='Follow', symmetrical=False, related_name='following_profiles')
    
    def __str__(self):
        return self.username

class Follow(models.Model):
    follows = models.ForeignKey(UserProfile, related_name='following', on_delete=models.CASCADE)
    follower = models.ForeignKey(UserProfile, related_name='followership', on_delete=models.CASCADE)

    class Meta:
        unique_together = ('follows', 'follower')  # Ensure uniqueness based on user and follower

    def __str__(self):
        return f'{self.follower.username} follows {self.follows.username}'

class Blocked(models.Model):
    first_user = models.ForeignKey(UserProfile, related_name='blocking', on_delete=models.CASCADE)
    second_user = models.ForeignKey(UserProfile, related_name='blocked', on_delete=models.CASCADE)

    class Meta:
        unique_together = ('first_user', 'second_user')  # Ensure uniqueness based on user and blocked user

    def __str__(self):
        return f'{self.first_user.username} blocked {self.second_user.username}'
