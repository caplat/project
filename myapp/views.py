from django.shortcuts import render
from django.shortcuts import redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from .forms import RegistrationForm
from django.contrib import messages
from .models import Utilisateur
from django.contrib.auth import get_user_model
from django.contrib.sessions.models import Session
from django.utils import timezone

User = get_user_model()

def index(request):
    # Récupérer tous les utilisateurs
    users_info = User.objects.all()

    # Récupérer toutes les sessions actives
    active_sessions = Session.objects.filter(expire_date__gte=timezone.now())  # Les sessions qui n'ont pas expiré
    active_user_ids = [session.get_decoded().get('_auth_user_id') for session in active_sessions]

    # Ajouter un attribut 'status' à chaque utilisateur
    for user in users_info:
        if str(user.id) in active_user_ids:
            user.status = 'connected'  # Utilisateur connecté
        else:
            user.status = 'disconnected'  # Utilisateur déconnecté

    return render(request, 'index.html', {'users_info': users_info})

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
            return redirect('/')  # Redirige vers la page principale après connexion
        else:
            messages.error(request, "Nom d'utilisateur ou mot de passe incorrect.")
    
    return render(request, 'myapp/login.html')

def user_logout(request):
    logout(request)
    return redirect('user_login')

@login_required(login_url='/user_login')
def index(request):
    users_info = User.objects.all()
    print(f"Users info: {users_info}")

    return render(request, 'myapp/index.html', {'users_info': users_info})