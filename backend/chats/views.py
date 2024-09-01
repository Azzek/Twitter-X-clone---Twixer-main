from rest_framework import serializers, viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Conversation, Message
from .serializers import ConversationSerializer, MessageSerializer
from rest_framework.response import Response
from rest_framework import status
from accounts.models import UserProfile
from django.shortcuts import get_object_or_404

class ConversationViewSet(viewsets.ModelViewSet):
    queryset = Conversation.objects.all()
    serializer_class = ConversationSerializer
    permission_classes = [IsAuthenticated]
                                                                   
    def get_queryset(self):
        return self.queryset.filter(participants=self.request.user)

    # def perform_create(self, serializer):
    #     serializer.save(participants=[self.request.user])
        
    def list(self, request):
        user_profile = get_object_or_404(UserProfile, user=request.user)
        conversations = Conversation.objects.filter(user1=user_profile) | Conversation.objects.filter(user2=user_profile)
        serializer = ConversationSerializer(conversations, many=True)
        return Response(serializer.data)
    
    def retrive(self, request, pk=None):
        print(pk)
        isinstance = self.get_object()
        serializer = self.get_serializer(isinstance)
        return Response(serializer.data)

class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        user_profile = UserProfile.objects.get(user=self.request.user)
        conversation_id = self.request.data.get('conversation')
        conversation = get_object_or_404(Conversation, id=conversation_id)
        if (not conversation):
            return Response('Conversation id must be provided', status=status.HTTP_400_BAD_REQUEST)
        if user_profile != conversation.user1 and user_profile != conversation.user2:
            raise serializers.ValidationError("You are not a participant in this conversation.")
        serializer.save(sender=user_profile)
        
    def list(self, request):
        user_profile = get_object_or_404(UserProfile, user=request.user)
        conversation_id = request.query_params.get('conversation')

        # Sprawdzamy, czy parametr conversation_id jest przekazany
        if not conversation_id:
            return Response({'error': 'Conversation ID must be provided'}, status=status.HTTP_400_BAD_REQUEST)

        # Pobieramy konwersację lub zwracamy 404, jeśli nie istnieje
        conversation = get_object_or_404(Conversation, id=conversation_id)

        # Filtrowanie wiadomości związanych z tą konwersacją
        messages = Message.objects.filter(conversation=conversation)
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data)
        
    def retrieve(self, request, pk=None):
        try:
            conversation = Conversation.objects.get(pk=pk)
        except Conversation.DoesNotExist:
            return Response({"error": "Conversation not found."}, status=status.HTTP_404_NOT_FOUND)

        # Sprawdź, czy zalogowany użytkownik jest jednym z uczestników konwersacji
        if request.user != conversation.user1 and request.user != conversation.user2:
            return Response({"error": "You do not have access to this conversation."}, status=status.HTTP_403_FORBIDDEN)

        # Pobierz wszystkie wiadomości związane z tą konwersacją
        messages = Message.objects.filter(conversation=conversation).order_by('timestamp')
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data)