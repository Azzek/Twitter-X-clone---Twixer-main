from django.urls import path, re_path
from . import views


urlpatterns = [
    path('', views.PostsList.as_view(), name='posts-list'),
    path('new-post/', views.PostsCreate.as_view(), name='create-post'),
    path('repost/', views.RepostApiView.as_view({'post':'create'}), name='create-post'),
    path('post/<int:pk>/', views.PostDetails.as_view(), name='post'),
    path('posts/<str:username>/', views.UserPostList.as_view(), name='user-posts'),
    path('liked/<str:username>/', views.UserLikedPostsList.as_view(), name='user-liked-posts'),
    path('delete/<int:pk>/', views.DeletePosts.as_view(), name='delete-post'),
    path('trends/list/', views.TrendsListView.as_view(), name='trends-list'),
    path('like/', views.LikeCreate.as_view(), name='like-post'),
    path('unlike/<int:post>/', views.UnLike.as_view(), name='unlike-post'),
    path('bookmarks/', views.BookmarksApiViewSet.as_view({'post':'create'})),
    path('bookmarks/', views.BookmarksApiViewSet.as_view({'get':'list'})),
    path('bookmarks/<int:pk>', views.BookmarksApiViewSet.as_view({'delete':'destroy'})),

]
