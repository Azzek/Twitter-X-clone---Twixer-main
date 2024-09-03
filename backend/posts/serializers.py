from rest_framework import serializers
from .models import Post, Trend, Like, Bookmark

class PostSerializer(serializers.ModelSerializer):
    likes = serializers.SerializerMethodField()
    
    class Meta:
        model = Post
        fields = ['id', 'body', 'date', 'image', 'author', 'author_name', 'likes', 'parent', 'replies', 'reposted', 'quote']
        extra_kwargs = {
            'replies':{'read_only': True}
        }
        # fields = '__all__'
        
    def get_likes(self, obj):
        likes = Like.objects.filter(post=obj)
        return [f.user.id for f in likes]
        
class TrendSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trend
        fields = '__all__'
        # fields = ['author','author_name','body','comments','date','id','image','likes']
        
class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = ['id', 'user', 'post', 'created_at']
        extra_kwargs = {
            'user':{'read_only': True}
        }

class BookmarkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bookmark
        fields = '__all__'
        
# class RepostSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Repost
#         fields = '__all__'