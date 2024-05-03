from django.shortcuts import render
from rest_framework import viewsets,authentication,permissions
from rest_framework.decorators import action
from django.contrib.auth.models import User
from .serializers import *
from .models import *
from rest_framework.response import Response
# Create your views here.


class UserView(viewsets.ModelViewSet):
    queryset=User.objects.all()
    serializer_class=UserSerializer
    
    
class DetailView(viewsets.ModelViewSet):
    queryset=User.objects.all()
    serializer_class=UserSerializer
    authentication_classes = [authentication.TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]
    
    @action(methods=["GET"], detail=False)
    def userdetail(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            serializer = UserSerializer(request.user)
            return Response(data=serializer.data)
        else:
            return Response(data=False)
    
    
    
class MusicView(viewsets.ModelViewSet):
    queryset=MusicModel.objects.all()
    serializer_class=SongSerializer
    # authentication_classes = [authentication.TokenAuthentication]
    # permission_classes = [permissions.IsAuthenticated]
        
        
    # @action(methods=["GET"], detail=False)
    # def nextsong(self, request, *args, **kwargs):
    #     serializer = NextSerializer(data=request.data)
    #     if serializer.is_valid():
    #         print(serializer)
    #     return Response(data="done")
    
    
class PlayListView(viewsets.ModelViewSet):
    queryset=PlayListModel.objects.all()
    serializer_class=PlaylistSerializer
    authentication_classes = [authentication.TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]
    
    def list(self, request, *args, **kwargs):
        playlist = PlayListModel.objects.filter(user=request.user)
        serializer = PlaylistSerializer(playlist,many=True)
        return Response(data=serializer.data)
    
    
    @action(methods=["GET"], detail=True)
    def listplaylistsong(self, request, *args, **kwargs):
        id = kwargs.get('pk')
        playlist = PlayListModel.objects.get(id=id)
        songs = PlayListSong.objects.filter(playlist=playlist)
        serializer = PlaylistSongSerializer(songs,many=True)
        return Response(data=serializer.data)
    
    @action(methods=["POST"], detail=False)
    def createplaylist(self, request, *args, **kwargs):
        serializer = PlaylistSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(data=serializer.data)
        else:
            return Response(data=serializer.errors)
        
        
    @action(methods=["GET"], detail=True)
    def deleteplaylist(self, request, *args, **kwargs):
        id = kwargs.get('pk')
        play = PlayListModel.objects.get(id=id).delete()
        return Response(data=True)
    
    
class LikeView(viewsets.ModelViewSet):
    queryset=LikedModel.objects.all()
    serializer_class=LikedSerializer
    authentication_classes = [authentication.TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]
    
    
    @action(methods=["POST"], detail=True)
    def likesong(self, request, *args, **kwargs):
        id = kwargs.get('pk')
        song = MusicModel.objects.get(id=id)
        serializer = LikedSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(song=song,user=request.user)
            return Response(data=True)
        else:
            return Response(data=serializer.errors)
        
        
    @action(methods=["GET"], detail=False)
    def listlikedsong(self, request, *args, **kwargs):
        song = LikedModel.objects.filter(user=request.user)
        serializer = LikedSerializer(song,many=True)
        return Response(data=serializer.data)
    
    
    @action(methods=["GET"], detail=True)
    def unlikesong(self, request, *args, **kwargs):
        id = kwargs.get('pk')
        song = MusicModel.objects.get(id=id)
        LikedModel.objects.get(song=song,user=request.user).delete()
        return Response(data=False)
        
        
    @action(methods=["GET"], detail=True)
    def likedsongs(self, request, *args, **kwargs):
        id = kwargs.get('pk')
        song = MusicModel.objects.get(id=id)
        if LikedModel.objects.filter(song=song, user=request.user).exists():
            return Response(data=True)
        else:
            return Response(data=False)
        
        
        
        
    
    

        
        


class AddToPlayListView(viewsets.ViewSet):
    def create(self, request, *args, **kwargs):
        song_id = kwargs.get('song')
        song = MusicModel.objects.get(id=song_id)
        playlist_id = kwargs.get('playlist')
        playlist = PlayListModel.objects.get(id=playlist_id)
        serializer = PlaylistSongSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(song=song,playlist=playlist)
            return Response(data=serializer.data)
        else:
            return Response(data=serializer.errors)
        
        
class DeletePlaylistSongView(viewsets.ViewSet):
    def delete(self, request, *args, **kwargs):
        song_id = kwargs.get('song')
        song = MusicModel.objects.get(id=song_id)
        playlist_id = kwargs.get('playlist')
        playlist = PlayListModel.objects.get(id=playlist_id)
        PlayListSong.objects.get(song=song,playlist=playlist).delete()
        return Response(data=True)
