from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('send', views.send, name='send'),
    path('mint', views.mint, name='mint'),
    path('events', views.event, name='events'),
]