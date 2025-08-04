from rest_framework import generics, status
from rest_framework.response import Response
from .serializers import RegistroUsuarioSerializer
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import MyTokenObtainPairSerializer # Importa nuestro nuevo serializer
from rest_framework.permissions import IsAuthenticated # Permiso para requerir autenticación
from .serializers import PerfilUsuarioSerializer # Importar el nuevo serializer
from .models import Noticia, Usuario
from .serializers import NoticiaSerializer
from .permissions import IsAdminUser # Importar nuestro permiso personalizado
from .models import EventoSismico
from .serializers import EventoSismicoSerializer
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from .filters import EventoSismicoFilter, NoticiaFilter
from rest_framework.permissions import AllowAny
from .serializers import UserManagementSerializer
from rest_framework import viewsets, mixins 
from .serializers import (
    NoticiaSerializer,
    UserManagementSerializer
)
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import PasswordChangeSerializer
import os # Importa el modelo de usuario personalizado



Usuario = get_user_model()

class RegistroUsuarioView(generics.CreateAPIView):
    """
    Vista para registrar nuevos usuarios en el sistema.
    
    Endpoints:
    - POST /api/registro/: Crea un nuevo usuario
    
    Características:
    - No requiere autenticación
    - Accesible para cualquier usuario (AllowAny)
    - Valida y hashea la contraseña automáticamente
    - Asigna por defecto el tipo de usuario 'VISITANTE'
    - Valida formato de teléfono y unicidad de email
    
    Returns:
        201: Usuario creado exitosamente
        400: Error de validación en los datos proporcionados
    """
    queryset = Usuario.objects.all()
    serializer_class = RegistroUsuarioSerializer
    authentication_classes = [] # No se requiere ninguna autenticación
    permission_classes = [AllowAny] # Cualquier usuario (autenticado o no) tiene permiso

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid(): # Se ejecutan las validaciones del serializer [cite: 9]
            self.perform_create(serializer)
            # El documento pide NO mostrar una caja de diálogo, sino una página indicando éxito[cite: 12, 13].
            # En una API, esto se traduce a una respuesta JSON exitosa.
            # El frontend se encargará de mostrar la "página" de éxito.
            return Response(
                {"message": "Usuario registrado correctamente."}, # [cite: 12]
                status=status.HTTP_201_CREATED
            )

        # Si la validación falla, DRF por defecto devuelve los errores en formato JSON.
        # El validador del lado del servidor se ejecuta aquí[cite: 9].
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class MyTokenObtainPairView(TokenObtainPairView):
    """
    Vista personalizada para la obtención de tokens JWT.
    
    Endpoints:
    - POST /api/token/: Obtiene tokens de acceso y refresco
    
    Características:
    - Extiende TokenObtainPairView de SimpleJWT
    - No requiere autenticación previa
    - Incluye datos adicionales en el token (claims):
        * username
        * email
        * tipo_usuario
        * first_name
        * ruta_fotografia
    - Actualiza automáticamente last_login del usuario
    
    Returns:
        200: Tokens JWT (access y refresh) + datos personalizados
        401: Credenciales inválidas
    """
    serializer_class = MyTokenObtainPairSerializer
    authentication_classes = []
    permission_classes = [AllowAny]

class PerfilUsuarioView(generics.RetrieveUpdateAPIView):
    """
    Vista para gestionar el perfil del usuario autenticado.
    
    Endpoints:
    - GET /api/perfil/: Obtiene los datos del perfil del usuario actual
    - PATCH /api/perfil/: Actualiza parcialmente el perfil
    - PUT /api/perfil/: Actualiza completamente el perfil
    
    Características:
    - Requiere autenticación JWT
    - Manejo automático de archivos de imagen (foto de perfil)
    - Limpieza automática de fotos antiguas al actualizar
    - Validación de campos (teléfono, email, etc.)
    
    Campos editables:
    - first_name
    - last_name
    - telefono
    - ruta_fotografia
    
    Returns:
        200: Perfil obtenido/actualizado exitosamente
        401: Usuario no autenticado
        400: Datos de actualización inválidos
    """
    serializer_class = PerfilUsuarioSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

    def partial_update(self, request, *args, **kwargs):
     instance = self.get_object()
     old_photo = instance.ruta_fotografia
     response = super().partial_update(request, *args, **kwargs)
     # instance se ha actualizado, recarga desde la BD
     instance.refresh_from_db()
     if old_photo and instance.ruta_fotografia != old_photo:
        if hasattr(old_photo, 'path') and os.path.exists(old_photo.path):
            os.remove(old_photo.path)
     return response
    
class NoticiaViewSet(viewsets.ModelViewSet):
    """
    ViewSet para el CRUD de Noticias.
    - `list` (GET): Abierto a cualquier usuario autenticado.
    - `retrieve` (GET /<id>): Abierto a cualquier usuario autenticado.
    - `create` (POST): Solo para administradores.
    - `update` (PUT /<id>): Solo para administradores.
    - `partial_update` (PATCH /<id>): Solo para administradores.
    - `destroy` (DELETE /<id>): Solo para administradores.
    """
    queryset = Noticia.objects.all().order_by('-fecha_publicacion')
    serializer_class = NoticiaSerializer
    # AÑADIMOS LA LÓGICA DE FILTRADO
    filter_backends = [DjangoFilterBackend]
    filterset_class = NoticiaFilter

    def get_permissions(self):
        """
        Asigna permisos basados en la acción que se está realizando.
        """
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            # Si la acción es crear, actualizar o eliminar, se requieren permisos de administrador. 
            permission_classes = [IsAdminUser]
        else:
            # Para otras acciones como 'list' o 'retrieve', solo se requiere estar autenticado. 
            permission_classes = [IsAuthenticated]

        return [permission() for permission in permission_classes]

class EventoSismicoViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet para consulta de eventos sísmicos (solo lectura).
    
    Endpoints:
    - GET /api/sismos/: Lista todos los eventos sísmicos
    - GET /api/sismos/{id}/: Obtiene un evento sísmico específico
    
    Características:
    - Solo lectura (no permite modificaciones)
    - Ordenamiento por fecha y hora (más recientes primero)
    - Filtrado avanzado y búsqueda
    - Requiere autenticación
    
    Filtros disponibles:
    - Magnitud (exact, gte, lte)
    - Fecha (exact, gte, lte)
    - Ubicación (búsqueda por texto)
    
    Campos de ordenamiento:
    - fecha_hora_evento
    - magnitud
    - profundidad
    
    Returns:
        200: Consulta exitosa
        401: Usuario no autenticado
        404: Evento no encontrado
    """
    queryset = EventoSismico.objects.all().order_by('-fecha_hora_evento')
    serializer_class = EventoSismicoSerializer
    permission_classes = [IsAuthenticated] # Solo usuarios logueados pueden ver los sismos

    # Configuración de los backends de filtrado
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
     # Usamos nuestra clase de filtros personalizada en lugar de 'filterset_fields'
    filterset_class = EventoSismicoFilter 

    # Campos por los que se puede filtrar directamente (ej: /api/sismos/?magnitud=5.5)
    filterset_fields = {
        'magnitud': ['exact', 'gte', 'lte'], # exacta, mayor o igual, menor o igual
        'fecha_hora_evento': ['date', 'gte', 'lte'], # por fecha exacta, mayor o igual, menor o igual
    }

    # Campos en los que se puede buscar texto (ej: /api/sismos/?search=California)
    search_fields = ['lugar_descripcion']

    # Campos por los que se puede ordenar (ej: /api/sismos/?ordering=magnitud o -magnitud)
    ordering_fields = ['fecha_hora_evento', 'magnitud', 'profundidad']
    
class UserManagementViewSet(mixins.ListModelMixin,
                            mixins.RetrieveModelMixin,
                            mixins.DestroyModelMixin,
                            viewsets.GenericViewSet):
    """
    ViewSet para la gestión de usuarios por parte de administradores.
    
    Endpoints:
    - GET /api/admin/users/: Lista todos los usuarios visitantes
    - GET /api/admin/users/{id}/: Obtiene detalles de un usuario específico
    - DELETE /api/admin/users/{id}/: Elimina un usuario visitante
    
    Características:
    - Acceso exclusivo para administradores
    - Solo gestiona usuarios de tipo 'VISITANTE'
    - Permite listar, ver detalles y eliminar usuarios
    - No permite crear ni modificar usuarios
    
    Datos mostrados:
    - ID
    - Email
    - Nombre completo
    - Fecha de registro
    - Último acceso
    
    Returns:
        200: Operación exitosa
        401: Usuario no autenticado
        403: Usuario no es administrador
        404: Usuario no encontrado
    """
    serializer_class = UserManagementSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        """
        Esta vista solo debe devolver usuarios de tipo 'VISITANTE'.
        """
        return Usuario.objects.filter(tipo_usuario='VISITANTE')
    
class ChangePasswordView(APIView):
    """
    Vista para que usuarios autenticados cambien su contraseña.
    
    Endpoint:
    - POST /api/perfil/cambiar-password/
    
    Características:
    - Requiere autenticación
    - Valida la contraseña actual antes de permitir el cambio
    - Verifica que las nuevas contraseñas coincidan
    - Hashea automáticamente la nueva contraseña
    
    Datos requeridos:
    - old_password: Contraseña actual
    - new_password1: Nueva contraseña
    - new_password2: Confirmación de la nueva contraseña
    
    Validaciones:
    - La contraseña actual debe ser correcta
    - Las nuevas contraseñas deben coincidir
    - La nueva contraseña debe cumplir los requisitos de seguridad
    
    Returns:
        200: Contraseña cambiada exitosamente
        400: Error de validación
        401: Usuario no autenticado
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = PasswordChangeSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            # Si la validación es exitosa, el serializer ya ha comprobado la contraseña antigua
            user = request.user
            user.set_password(serializer.validated_data['new_password1'])
            user.save()
            return Response({"detail": "Contraseña cambiada con éxito."}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)