from rest_framework import generics, permissions, filters, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.contrib.auth.models import User
from .serializers import UserSerializer, FollowSerializer, UserProfileSerializer
from .models import UserProfile, Follow, Blocked
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = UserSerializer
    
    def perform_create(self, serializer):
        print(self.request.data)
        user = serializer.save()
        user = User.objects.get(username=self.request.data['username'])
        user.set_password(self.request.data['password'])
        user.save()
        UserProfile.objects.create(user=user, username=user.username, id=user.id, email=user.email)
        
class LoginView(TokenObtainPairView):
    permission_classes = [permissions.AllowAny]
    
class RefreshTokenView(TokenRefreshView):
    permission_classes = [permissions.AllowAny]

class DetailsUserWithId(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserProfileSerializer
    queryset =  UserProfile.objects.all()
    
    lookup_field = 'pk'
    
    
class DetailsUserWithUsername(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserProfileSerializer
    lookup_field = 'username'
    
    def get_object(self):
        queryset = UserProfile.objects.all()
        filter_kwargs = {self.lookup_field: self.kwargs[self.lookup_field]}
        obj = generics.get_object_or_404(queryset, **filter_kwargs)
        return obj

class FollowView(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    queryset = Follow.objects.all()
    serializer_class = FollowSerializer

class UnfollowView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        user_profile = get_object_or_404(UserProfile, user=request.user)
        unfollow_user_profile = get_object_or_404(UserProfile, pk=kwargs['pk'])

        follow_instance = Follow.objects.filter(follower=user_profile, follows=unfollow_user_profile).first()
        
        if follow_instance:
            follow_instance.delete()
            return Response({"detail": "Unfollowed successfully."}, status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({"detail": "You are not following this user."}, status=status.HTTP_400_BAD_REQUEST)
    

class UnfollowView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def delete(self, request, *args, **kwargs):
        unfollow_user_id = request.data.get('user_id')
        
        if not unfollow_user_id:
            return Response({"detail": "User ID is required."}, status=status.HTTP_400_BAD_REQUEST)

        user_profile = get_object_or_404(UserProfile, user=request.user)
        unfollow_user_profile = get_object_or_404(UserProfile, pk=unfollow_user_id)

        follow_instance = Follow.objects.filter(follower=user_profile, follows=unfollow_user_profile).first()

        if follow_instance:
            follow_instance.delete()
            return Response({"detail": "Unfollowed successfully."}, status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({"detail": "You are not following this user."}, status=status.HTTP_400_BAD_REQUEST)
    
class UserSearchView(generics.ListAPIView):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['username']
    
    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)
        
class UserProfileUpdateView(generics.UpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return UserProfile.objects.get(user = self.request.user)

class BlockUserView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        blocker = get_object_or_404(UserProfile, id=request.user.id)
        blocked = get_object_or_404(UserProfile, id=kwargs['pk'])

        if Blocked.objects.filter(first_user=blocker, second_user=blocked).exists():
            return Response({"detail": "User already blocked."}, status=status.HTTP_400_BAD_REQUEST)

        Blocked.objects.create(first_user=blocker, second_user=blocked)
        return Response({"detail": "User blocked successfully."}, status=status.HTTP_201_CREATED)
    
    def delete(self, request, *args, **kwargs):
        blocker = get_object_or_404(UserProfile, id=request.user.id)
        blocked = get_object_or_404(UserProfile, id=kwargs['pk'])

        blocked_instance = Blocked.objects.filter(first_user=blocker, second_user=blocked).first()

        if blocked_instance:
            blocked_instance.delete()
            return Response({"detail": "User unblocked successfully."}, status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({"detail": "You have not blocked this user."}, status=status.HTTP_400_BAD_REQUEST)