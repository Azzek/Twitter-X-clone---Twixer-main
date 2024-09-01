from django.urls import path, include
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('token/', views.LoginView.as_view(), name='login'),
    path('id/<int:pk>/', views.DetailsUserWithId.as_view(), name='id'),
    path('user-profile/<str:username>/', views.DetailsUserWithUsername.as_view(), name='username'),
    path('register/', views.CreateUserView.as_view(), name='register'),
    path('update-profile/<int:pk>', views.UserProfileUpdateView.as_view(), name='update-profile'),
    path('follow/', views.FollowView.as_view(), name='folllow'),
    path('block/<int:pk>/', views.BlockUserView.as_view(), name='block-user'),
    path('unfollow/', views.UnfollowView.as_view(), name='unfollow'),
    path('search/', views.UserSearchView.as_view(), name='search-username'),
    path('test-token/', views.RefreshTokenView.as_view(), name='test_token'),
    path("token/refresh/", TokenRefreshView.as_view(), name="refresh"),
    path("auth/", include("rest_framework.urls")),
]
