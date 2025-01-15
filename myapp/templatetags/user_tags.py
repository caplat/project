from django import template
from django.contrib.auth import get_user_model

User = get_user_model()
register = template.Library()

@register.inclusion_tag('myapp/user_dropdown.html', takes_context=True)
def user_dropdown(context):
    request = context['request']
    users_info = User.objects.all()
    
    # Vérifier l'état de connexion des utilisateurs via le champ is_connected
    for user in users_info:
        if user.is_connected:
            user.status = 'connected'
        else:
            user.status = 'disconnected'
    
    return {'users_info': users_info, 'current_user': request.user}
