from .models import Conversation, Message
from rest_framework import serializers
from accounts.models import UserProfile

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['id', 'conversation', 'sender', 'text', 'timestamp', 'image']

class ConversationSerializer(serializers.ModelSerializer):

    class Meta:
        model = Conversation
        fields = '__all__'

    def create(self, validated_data):
        user1 = UserProfile.objects.get(username = self.context['request'].user)
        user2 = UserProfile.objects.get(username = validated_data['user2'])

        if user1 == user2:
            raise serializers.ValidationError("Nie możesz rozpocząć rozmowy sam ze sobą.")

        # Sprawdzenie, czy konwersacja już istnieje
        if Conversation.objects.filter(user1=user1, user2=user2).exists() or \
           Conversation.objects.filter(user1=user2, user2=user1).exists():
            raise serializers.ValidationError("Taka konwersacja już istnieje.")

        conversation = Conversation.objects.create(user1=user1, user2=user2)
        return conversation