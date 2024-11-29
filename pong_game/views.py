from django.shortcuts import render

def game(request):
    return render(request, 'pong_game/game.html')
