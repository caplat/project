from django.shortcuts import render
from django.contrib.auth.decorators import login_required

@login_required(login_url='/user_login')
def game(request):
    return render(request, 'pong_game/game.html')

