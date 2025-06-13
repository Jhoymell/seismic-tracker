from django.urls import path
from .views import RegistroUsuarioView, PerfilUsuarioView # Importa las vistas que has creado

urlpatterns = [
    path('registro/', RegistroUsuarioView.as_view(), name='registro_usuario'),
    # Aquí irán otros endpoints de la API (login, noticias, sismos, etc.)
    path('perfil/', PerfilUsuarioView.as_view(), name='perfil_usuario'),
]