from django.db import models
from django.contrib.auth.models import User
# Create your models here.


class MusicModel(models.Model):
    name = models.CharField(max_length=100)
    artist_name = models.CharField(max_length=100,default="Artist")
    description = models.CharField(max_length=100)
    tags = models.CharField(max_length=500)
    song_file = models.FileField(upload_to='songs/')
    image = models.ImageField(upload_to='images/')
    
    
class PlayListModel(models.Model):
    playlist_name= models.CharField(max_length=100,default="MyPlaylist")
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    
class PlayListSong(models.Model):
    playlist = models.ForeignKey(PlayListModel,on_delete=models.CASCADE)
    song = models.ForeignKey(MusicModel,on_delete=models.CASCADE)
    
class LikedModel(models.Model):
    song = models.ForeignKey(MusicModel,on_delete=models.CASCADE)
    user = models.ForeignKey(User,on_delete=models.CASCADE)