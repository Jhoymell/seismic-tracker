from django.contrib.auth.signals import user_logged_in
from django.dispatch import receiver
from django.utils import timezone
from .models import Usuario # Importa tu modelo de usuario personalizado

@receiver(user_logged_in)
def update_last_login(sender, request, user, **kwargs):
    """
    Una señal que se dispara cuando un usuario inicia sesión.
    """
    # El modelo AbstractUser ya tiene un campo 'last_login' que Django
    # actualiza automáticamente al usar las vistas de autenticación de Django.
    # El TokenObtainPairView de SimpleJWT también dispara esta señal, por lo que
    # Django debería manejar la actualización de 'last_login' por defecto.
   
    user.last_login = timezone.now()
    user.save(update_fields=['last_login'])
    print(f"Señal de login recibida: Se actualizó last_login para el usuario {user.email}")