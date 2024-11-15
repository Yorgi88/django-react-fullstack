from django.contrib.auth.models import User  #to create a new 
from rest_framework import serializers

from .models import Note

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User  #used to repr s user
        fields = ["id", "username", "password"]
        extra_kwargs = {"password" : {"write_only" : True}}  #we want to accept password when creating a new suer
                                                            #but we don't wanna return the password when are giving info about the user
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
    
class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ['id', 'title', 'content', 'created_at', 'author']
        extra_kwargs = {"author": {"read_only" : True}}
        
                                                           

