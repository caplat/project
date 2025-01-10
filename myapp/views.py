from django.shortcuts import render
from django.shortcuts import redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from .forms import RegistrationForm
from django.contrib import messages
from .models import Utilisateur
from django.contrib.auth import get_user_model

User = get_user_model()

def home_redirect(request):
    return redirect('/home/')

@login_required(login_url='/user_login')
def home(request):
        print(f"Utilisateur authentifié : {request.user.is_authenticated}",flush=True)
        return render(request, 'myapp/home.html')

@login_required(login_url='/user_login')
def page1(request):
    print("teeeeeeeeeeeeeeeeeeeeeessstttt", flush=True)
    return render(request, 'myapp/page1.html')

@login_required(login_url='/user_login')
def page2(request):
    return render(request, 'myapp/page2.html')

@login_required(login_url='/user_login')
def tournament(request):
    return render(request, 'myapp/tournament.html')

def registration(request):
    if request.method == 'POST':
        form = RegistrationForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data['username']
            password = form.cleaned_data['password1']

            if User.objects.filter(username=username).exists():
                messages.error(request, "Ce nom d'utilisateur est déjà pris.")
            else:
                User.objects.create_user(username=username, password=password)
                messages.success(request, "Compte créé avec succès. Vous pouvez maintenant vous connecter.")
                return redirect('user_login')
        else:
            messages.error(request, "Veuillez corriger les erreurs dans le formulaire.")
    else:
        form = RegistrationForm()

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

def user_logout(request):
    logout(request)
    return redirect('user_login')