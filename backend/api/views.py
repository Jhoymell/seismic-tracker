from rest_framework import generics, status
from rest_framework.response import Response
from .serializers import RegistroUsuarioSerializer
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import MyTokenObtainPairSerializer # Importa nuestro nuevo serializer
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated # Permiso para requerir autenticación
from .serializers import PerfilUsuarioSerializer # Importar el nuevo serializer
from rest_framework import viewsets
from .models import Noticia
from .serializers import NoticiaSerializer
from .permissions import IsAdminUser # Importar nuestro permiso personalizado
from rest_framework.permissions import IsAuthenticated
from .models import EventoSismico
from .serializers import EventoSismicoSerializer
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from .filters import EventoSismicoFilter
from rest_framework.permissions import AllowAny


Usuario = get_user_model()

class RegistroUsuarioView(generics.CreateAPIView):
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
    serializer_class = MyTokenObtainPairSerializer
    authentication_classes = []
    permission_classes = [AllowAny]

class PerfilUsuarioView(generics.RetrieveUpdateAPIView):
    """
    Vista para que los usuarios vean y actualicen su perfil.
    - GET: Devuelve los datos del usuario autenticado.
    - PUT/PATCH: Actualiza los datos del usuario autenticado.
    """
    serializer_class = PerfilUsuarioSerializer
    permission_classes = [IsAuthenticated] # ¡Muy importante! Solo usuarios autenticados.

    def get_object(self):
        """
        Sobrescribimos este método para que siempre devuelva el usuario
        que está haciendo la petición (request.user).
        """
        return self.request.user
    
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
    queryset = Noticia.objects.all().order_by('-fecha_publicacion') # Aseguramos el orden requerido
    serializer_class = NoticiaSerializer

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
    ViewSet de solo lectura para los eventos sísmicos.
    Permite filtrar por magnitud, fecha y buscar por ubicación.
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