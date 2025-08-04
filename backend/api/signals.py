
from django.contrib.auth.signals import user_logged_in
from django.dispatch import receiver
from django.utils import timezone
from .models import Usuario # Importa tu modelo de usuario personalizado
from django.urls import reverse
from django_rest_passwordreset.signals import reset_password_token_created
from django.core.mail import send_mail



@receiver(user_logged_in)
def update_last_login(sender, request, user, **kwargs):
    print(f"🔍 Tipo de user recibido en señal: {type(user)}")
    # El modelo AbstractUser ya tiene un campo 'last_login' que Django
    # actualiza automáticamente al usar las vistas de autenticación de Django.
    # El TokenObtainPairView de SimpleJWT también dispara esta señal, por lo que
    # Django debería manejar la actualización de 'last_login' por defecto.
    user.last_login = timezone.now()
    user.save(update_fields=['last_login'])
    print(f"Señal de login recibida: Se actualizó last_login para el usuario {user.email}")
    
@receiver(reset_password_token_created)
def password_reset_token_created(sender, instance, reset_password_token, *args, **kwargs):
    """
    Manejador para la señal que se dispara cuando se crea un token de reseteo.
    Se encarga de enviar el correo electrónico al usuario.
    """
    # Construimos el enlace que el usuario usará en el frontend
    # ¡IMPORTANTE! Asegúrate de que la URL del frontend sea la correcta.
    reset_url = f"http://localhost:3000/restablecer-password"

    email_plaintext_message = (
        f"Hola {reset_password_token.user.first_name},\n\n"
        f"Para restablecer tu contraseña, ve al siguiente enlace y usa el token que te proporcionamos.\n\n"
        f"Enlace: {reset_url}\n\n"
        f"Token de Reseteo (cópialo y pégalo en el formulario):\n"
        f"{reset_password_token.key}\n\n"
        f"Este token es válido por unas horas. Si no solicitaste esto, ignora este correo."
    )

    send_mail(
        # Título del correo
        "Restablecimiento de Contraseña para Proyecto Sismológico",
        # Mensaje
        email_plaintext_message,
        # From
        "noreply@proyectosismologico.com",
        # To
        [reset_password_token.user.email]
    )
    print(f"\n--- CORREO DE RESETEO ENVIADO A {reset_password_token.user.email} ---")
    print(f"--- TOKEN: {reset_password_token.key} ---")
    print(f"--- Enlace: {reset_url} ---\n")