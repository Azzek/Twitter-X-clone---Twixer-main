from django.contrib import admin
from rest_framework.routers import DefaultRouter
from django.urls import path, include
from posts import views

router = DefaultRouter()
router.register(r'bookmarks/search', views.BookmarkSearchView.as_view(), basename='search-bookmarks')

urlpatterns = [
    path('posts/', include('posts.urls')),
    path('accounts/', include('accounts.urls')),
    path('messages/',include('chats.urls'))
]
