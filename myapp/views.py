from django.shortcuts import render

def home(request):
    return render(request, 'myapp/home.html')

def page1(request):
    return render(request, 'myapp/page1.html')

def page2(request):
    return render(request, 'myapp/page2.html')

def tournament(request):
    return render(request, 'myapp/tournament.html')