from django.urls import path
from .views import RegistroUsuarioView

urlpatterns = [
    path('registro/', RegistroUsuarioView.as_view(), name='registro_usuario'),
    # Aquí irán otros endpoints de la API (login, noticias, sismos, etc.)
]