from .models import *
from rest_framework import serializers


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['first_name','last_name','email','username','password']
        
    def create(self, validated_data):
        return User.objects.create_user(**validated_data)
    
    
class SongSerializer(serializers.ModelSerializer):
    class Meta:
        model = MusicModel
        fields = "__all__"
        
        
class PlaylistSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    class Meta:
        model = PlayListModel
        fields = "__all__"
        
        
class PlaylistSongSerializer(serializers.ModelSerializer):
    song = SongSerializer(read_only=True)
    playlist = PlaylistSerializer(read_only=True)
    class Meta:
        model = PlayListSong
        fields = ['song','playlist']
        
        
class LikedSerializer(serializers.ModelSerializer):
    song = SongSerializer(read_only=True)
    user = serializers.CharField(read_only=True)
    class Meta:
        model = LikedModel
        fields = "__all__"
        
        
class NextSerializer(serializers.ModelSerializer):
    tags = serializers.CharField(read_only=True)
    class Meta:
        model = MusicModel
        fields = ["tags"]