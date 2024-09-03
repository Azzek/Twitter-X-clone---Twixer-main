from rest_framework import viewsets, permissions, filters
from .serializers import PostSerializer, TrendSerializer, LikeSerializer, BookmarkSerializer
from rest_framework import generics
from .models import Post, Trend, Like, Bookmark
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import ValidationError
from accounts.models import UserProfile
from django.shortcuts import get_object_or_404
from django.core.exceptions import ObjectDoesNotExist

class PostsList(generics.ListAPIView):
    queryset = Post.objects.all().order_by('-date')
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticated]
    
class PostsCreate(generics.CreateAPIView):
    serializer_class = PostSerializer   
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        print(self.request.user)
        user_profile = UserProfile.objects.get(username=self.request.user)
        serializer.save(author_name=self.request.user, author=user_profile)
        
    def get_queryset(self):
        return Post.objects.filter(author=self.request.user)
        
class PostDetails(generics.RetrieveAPIView):
    queryset = Post.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = PostSerializer

class UserPostList(generics.ListAPIView):
    serializer_class = PostSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        username = self.kwargs.get('username')
        user_profile = UserProfile.objects.get(user=self.request.user)
        reposts = Post.objects.filter(reposted=user_profile)
        posts = Post.objects.filter(author_name=username)
        return reposts.union(posts).order_by('-date')
    
class UserLikedPostsList(generics.ListAPIView):
    serializer_class = PostSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        user_profile = UserProfile.objects.get(user=self.request.user)
        return Post.objects.filter(likes__user=user_profile)
    
class DeletePosts(generics.DestroyAPIView):
    
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = PostSerializer
    
    def get_queryset(self): 
        user_profile = UserProfile.objects.get(user=self.request.user)
        return Post.objects.filter(author=user_profile)
        
class TrendsListView(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = TrendSerializer
    
    def get_queryset(self):
        return Trend.objects.all().order_by('-count')[:8]

class LikeCreate(generics.CreateAPIView):
    serializer_class = LikeSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Like.objects.all()

    def perform_create(self, serializer):
        user = get_object_or_404(UserProfile, user=self.request.user)
        post_id = self.request.data.get('post')

        if not post_id:
            raise ValidationError('Post ID is required.')

        # Get the post or raise a ValidationError if it does not exist
        post = get_object_or_404(Post, id=post_id)

        # Check if the user already liked this post
        if Like.objects.filter(user=user, post=post).exists():
            raise ValidationError('You already liked this post.')

        # Save the new like
        serializer.save(user=user, post=post)
class UnLike(generics.DestroyAPIView):
    serializer_class = LikeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Like.objects.filter(user=UserProfile.objects.get(user=self.request.user))

    def get_object(self):
        post_id = self.kwargs.get('post')
        if post_id is None:
            raise ValidationError("Post ID is required to unlike a post.")

        try:
            post = Post.objects.get(id=post_id)
        except Post.DoesNotExist:
            raise ValidationError("Post with the given ID does not exist.")

        try:
            like = Like.objects.get(user=UserProfile.objects.get(user=self.request.user), post=post)
        except Like.DoesNotExist:
            raise ValidationError("You have not liked this post.")

        return like

    def perform_destroy(self, instance):
        instance.delete()
        
class BookmarksApiViewSet(viewsets.ModelViewSet):
    serializer_class = BookmarkSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user_profile = UserProfile.objects.get(user=self.request.user)
        return Bookmark.objects.filter(user=user_profile)
    
    def perform_create(self, serializer):
        user_profile = UserProfile.objects.get(user=self.request.user)
        if Bookmark.objects.filter(user=user_profile, post=self.request.data.get('post')).exists():
            raise ValidationError('You already Bookmarked this post.')
        serializer.save(user=user_profile)
        
    def destroy(self, request, pk=None):
        user_profile = UserProfile.objects.get(user=request.user)
        bookmark = Bookmark.objects.get(user = user_profile, post=pk)
        bookmark.delete()
        return Response('deleted bookmark')
    
class BookmarkSearchView(generics.ListAPIView):
    serializer_class = BookmarkSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['user']
    
    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)
    
    def get_queryset(self):
        user_profile = UserProfile.objects.get(user=self.request.user)
        return Bookmark.objects.filter(user = user_profile)
    
class RepostApiView(viewsets.ModelViewSet):
    serializer_class = PostSerializer  
    permission_classes = [permissions.IsAuthenticated]

    
    
    def perform_create(self, serializer):
        post_id = self.request.data.get('post_id')
        user_profile = get_object_or_404(UserProfile, user=self.request.user)

        if not post_id or not user_profile:
            raise ValidationError('Post and user id is required.')

        try:
            post = get_object_or_404(Post, id=post_id)

        except ObjectDoesNotExist:
            raise ValidationError('Post with this id does not exist.')
        serializer.save(
            author=post.author,
            author_name=post.author_name,
            body=post.body,
            image=post.image,
            parent=post.parent, 
            reposted_id=user_profile.id,
        )
        
        