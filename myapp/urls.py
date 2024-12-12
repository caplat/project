from django.urls import path
from django.shortcuts import redirect
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('page1/', views.page1, name='page1'),
    path('page2/', views.page2, name='page2'),
    path('tournament/', views.tournament, name='tournament'),
    # path('<path:slug>/', lambda request, slug: redirect('home')),
]