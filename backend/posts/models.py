from django.db import models
from django.contrib.auth.models import User
from accounts.models import UserProfile
from . import trends

class Post(models.Model):
    body = models.TextField()
    date = models.DateTimeField(auto_now_add=True)
    image = models.ImageField(null=True)
    author = models.ForeignKey(UserProfile, on_delete=models.CASCADE, default=None, related_name='posts')
    author_name = models.CharField(max_length=18, default='Unknown Author')    
    parent = models.ForeignKey('self', null=True, blank=True, on_delete=models.CASCADE, related_name='replies')
    reposted = models.ForeignKey(UserProfile, null=True, on_delete=models.CASCADE, related_name='reposted_posts')
    
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        words = self.body.split(" ")
        trends.create_trends_for_words(words)
        
        
    def __str__(self):
        return self.body    

class Trend(models.Model):
    name = models.CharField(max_length=255, unique=True)
    count = models.IntegerField(default=0)

    def __str__(self):
        return self.name
    
class Like(models.Model):
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='likes')
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='likes')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'post')
        
    def __str__(self):
        return self.user

class Bookmark(models.Model):
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='bookmakrs')
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='bookmarked')
    date = models.DateField(auto_now_add=True)
    
# class Repost(models.Model):
#     user = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='reposted_posts')
#     post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='reposted_by')
#     date = models.DateField(auto_now_add=True)