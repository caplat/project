from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.core.exceptions import ValidationError
import re
from django.contrib.auth import get_user_model

User = get_user_model()

class RegistrationForm(UserCreationForm):
    password1 = forms.CharField(
        label="Password",
        strip=False,
        widget=forms.PasswordInput(attrs={'autocomplete': 'new-password'}),

    )
    password2 = forms.CharField(
        label="Password confirmation",
        widget=forms.PasswordInput(attrs={'autocomplete': 'new-password'}),
        strip=False,
    )

    class Meta(UserCreationForm.Meta):
        model = User
        fields = ("username", "password1", "password2")

    def clean_username(self):
        username = self.cleaned_data.get("username")
        # Validation du nom d'utilisateur (seulement lettres et chiffres)
        if not re.match("^[a-zA-Z0-9]*$", username):
            raise ValidationError("Le nom d'utilisateur ne peut contenir que des lettres et des chiffres.")
        # Vérifier si le nom d'utilisateur est déjà pris
        if User.objects.filter(username=username).exists():
            raise ValidationError("Ce nom d'utilisateur est déjà pris.")
        return username

    def clean_password1(self):
        password1 = self.cleaned_data.get("password1")
        # Validation de la longueur minimale du mot de passe
        if len(password1) < 6:
            raise ValidationError("Le mot de passe doit comporter au moins 6 caractères.")
        return password1

    def clean_password2(self):
        password1 = self.cleaned_data.get("password1")
        password2 = self.cleaned_data.get("password2")
        # Vérifier que les mots de passe correspondent
        if password1 != password2:
            raise ValidationError("Les mots de passe ne correspondent pas.")
        return password2
