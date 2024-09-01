from django.urls import path
from . import views

urlpatterns = [
    path('message/', views.MessageViewSet.as_view({'post': 'create'}), name='send-message'),
    path('conversation/', views.ConversationViewSet.as_view({'post': 'create'}), name='create-conversation'),
    path('conversation/list/', views.ConversationViewSet.as_view({'get': 'list'})),
    path('conversation/<int:pk>/', views.ConversationViewSet.as_view({'get': 'retrive'})),
    path('conversation/messages/', views.MessageViewSet.as_view({'get':'list'})),
    path('send/', views.MessageViewSet.as_view({'post':'create'})),
]
