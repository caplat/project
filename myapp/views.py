from django.shortcuts import render
from django.shortcuts import redirect
from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required
from .forms import CreateUserForm
from django.contrib import messages

def home_redirect(request):
    return redirect('/home/')

@login_required(login_url='/registration')
def home(request):
        print(f"Utilisateur authentifié : {request.user.is_authenticated}")
        return render(request, 'myapp/home.html')

@login_required(login_url='/registration')
def page1(request):
    return render(request, 'myapp/page1.html')

@login_required(login_url='/registration')
def page2(request):
    return render(request, 'myapp/page2.html')

@login_required(login_url='/registration')
def tournament(request):
    return render(request, 'myapp/tournament.html')

def registration(request):
    form = CreateUserForm()

    if request.method == 'POST':
        form = CreateUserForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('user_login')
    else:
        form = CreateUserForm()
    return render(request, 'myapp/registration.html', {'form': form})


def user_login(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            messages.success(request, "Connexion réussie.")
            return redirect('home')  # Redirige vers la page principale après connexion
        else:
            messages.error(request, "Nom d'utilisateur ou mot de passe incorrect.")
    
    return render(request, 'myapp/login.html')

