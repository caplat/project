from django.urls import path
from . import views

urlpatterns = [
    path('', views.home_redirect, name="home_redirect"),
    path('home/', views.home, name='home'),
    path('page1/', views.page1, name='page1'),
    path('page2/', views.page2, name='page2'),
    path('tournament/', views.tournament, name='tournament'),
    # path('<path:slug>/', lambda request, slug: redirect('home')),

    path('registration/', views.registration, name='registration'),
    path('login/', views.user_login, name='user_login'),
]