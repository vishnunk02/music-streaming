"""
URL configuration for Classroom project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from app1.views import *
from rest_framework.routers import DefaultRouter
from rest_framework.authtoken.views import ObtainAuthToken
router = DefaultRouter()

router.register('user',UserView,basename='user')
router.register('detail',DetailView,basename='detail')
router.register('song',MusicView,basename='song')
router.register('playlist',PlayListView,basename='playlist')
router.register('like',LikeView,basename='like')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('token/',ObtainAuthToken.as_view()),
    path('addtoplaylist/<int:song>/<int:playlist>/', AddToPlayListView.as_view({'post': 'create'}), name='addtoplaylist'),
    path('deletesong/<int:song>/<int:playlist>/', DeletePlaylistSongView.as_view({'get': 'delete'}), name='deletesong'),
]+router.urls + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)