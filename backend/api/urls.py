from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RegistroUsuarioView, PerfilUsuarioView, NoticiaViewSet # Importar el ViewSet
from .views import RegistroUsuarioView, PerfilUsuarioView, NoticiaViewSet, EventoSismicoViewSet # Importar

# Creamos un router
router = DefaultRouter()
# Registramos nuestro ViewSet de Noticias con el router
# 'noticias' será el prefijo de la URL para este recurso
router.register(r'noticias', NoticiaViewSet, basename='noticia') # <-- REGISTRAR NUEVO VIEWSET
router.register(r'sismos', EventoSismicoViewSet, basename='sismo') # <-- REGISTRAR NUEVO VIEWSET

# Nuestras URLs de la API ahora consisten en las del router y las que definimos manualmente
urlpatterns = [
    path('registro/', RegistroUsuarioView.as_view(), name='registro_usuario'), # Vista para registrar un nuevo usuario
    path('perfil/', PerfilUsuarioView.as_view(), name='perfil_usuario'), # Vista para ver y actualizar el perfil del usuario autenticado
    # Incluimos las URLs generadas por el router
    path('', include(router.urls)),
]





