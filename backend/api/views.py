# ========================================
# VISTAS API - SEISMIC TRACKER
# PROPÓSITO: Endpoints REST para la gestión completa del sistema sísmico
# ========================================

# ========================================
# IMPORTACIONES DE DJANGO REST FRAMEWORK
# ========================================

from rest_framework import generics, status, viewsets, mixins, filters
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView

# ========================================
# IMPORTACIONES DE DJANGO
# ========================================

from django.contrib.auth import get_user_model
from django_filters.rest_framework import DjangoFilterBackend
import os

# ========================================
# IMPORTACIONES LOCALES
# ========================================

from .models import EventoSismico, Noticia
import logging

logger = logging.getLogger(__name__)
from .serializers import (
    EventoSismicoSerializer,
    RegistroUsuarioSerializer,
    MyTokenObtainPairSerializer,
    PerfilUsuarioSerializer,
    NoticiaSerializer,
    UserManagementSerializer,
    PasswordChangeSerializer
)
from .permissions import IsAdminUser
from .filters import EventoSismicoFilter, NoticiaFilter
from rest_framework.decorators import api_view, permission_classes

# Obtener el modelo de usuario personalizado
Usuario = get_user_model()

# ========================================
# VISTA: Registro de Usuarios
# ========================================

class RegistroUsuarioView(generics.CreateAPIView):
    """
    VISTA PRINCIPAL: RegistroUsuarioView
    
    Endpoint para registro de nuevos usuarios en el sistema.
    
    Funcionalidades:
    1. Creación de nuevos usuarios sin autenticación previa
    2. Validación automática de datos (email único, formato teléfono)
    3. Hash automático de contraseñas
    4. Asignación por defecto del rol 'VISITANTE'
    5. Respuesta personalizada de éxito
    
    Endpoint:
    - POST /api/registro/
    
    Campos requeridos:
    - username: Nombre de usuario único
    - email: Correo electrónico único
    - password: Contraseña (será hasheada)
    - first_name: Nombre
    - last_name: Apellidos
    - telefono: Número de teléfono
    - fecha_nacimiento: Fecha de nacimiento
    
    Respuestas:
    - 201: Usuario creado exitosamente
    - 400: Error de validación en los datos
    """
    queryset = Usuario.objects.all()
    serializer_class = RegistroUsuarioSerializer
    authentication_classes = []  # No requiere autenticación
    permission_classes = [AllowAny]  # Acceso público

    def create(self, request, *args, **kwargs):
        """
        Método personalizado para crear usuario con respuesta mejorada
        """
        serializer = self.get_serializer(data=request.data)
        
        if serializer.is_valid():
            # Se ejecutan las validaciones del serializer
            self.perform_create(serializer)
            
            # Respuesta personalizada de éxito
            return Response(
                {"message": "Usuario registrado correctamente."}, 
                status=status.HTTP_201_CREATED
            )

        # Si la validación falla, devuelve errores específicos
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ========================================
# VISTA: Autenticación JWT Personalizada
# ========================================

class MyTokenObtainPairView(TokenObtainPairView):
    """
    VISTA PRINCIPAL: MyTokenObtainPairView
    
    Vista personalizada para autenticación JWT con datos adicionales.
    
    Funcionalidades:
    1. Generación de tokens JWT (access y refresh)
    2. Inclusión de claims personalizados en el token
    3. Actualización automática de last_login
    4. Respuesta con datos del usuario autenticado
    
    Endpoint:
    - POST /api/token/
    
    Campos requeridos:
    - email: Email del usuario
    - password: Contraseña del usuario
    
    Claims adicionales en el token:
    - username: Nombre de usuario
    - email: Correo electrónico
    - tipo_usuario: Rol del usuario
    - first_name: Nombre
    - ruta_fotografia: URL de foto de perfil
    
    Respuestas:
    - 200: Tokens JWT + datos del usuario
    - 401: Credenciales inválidas
    """
    serializer_class = MyTokenObtainPairSerializer
    authentication_classes = []
    permission_classes = [AllowAny]

# ========================================
# VISTA: Gestión de Perfil de Usuario
# ========================================

class PerfilUsuarioView(generics.RetrieveUpdateAPIView):
    """
    VISTA PRINCIPAL: PerfilUsuarioView
    
    Vista para gestión completa del perfil del usuario autenticado.
    
    Funcionalidades:
    1. Obtención de datos del perfil actual
    2. Actualización de información personal
    3. Gestión de foto de perfil con limpieza automática
    4. Validación de campos editables
    
    Endpoints:
    - GET /api/perfil/: Obtener datos del perfil
    - PATCH /api/perfil/: Actualización parcial
    - PUT /api/perfil/: Actualización completa
    
    Campos editables:
    - first_name: Nombre
    - last_name: Apellidos
    - telefono: Número de teléfono
    - ruta_fotografia: Foto de perfil
    
    Características especiales:
    - Limpieza automática de fotos anteriores
    - Validación de formato de teléfono
    - Manejo de archivos con nombres únicos
    
    Respuestas:
    - 200: Operación exitosa
    - 401: Usuario no autenticado
    - 400: Datos inválidos
    """
    serializer_class = PerfilUsuarioSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        """Retorna el usuario autenticado actual"""
        return self.request.user

    def partial_update(self, request, *args, **kwargs):
        """
        Actualización parcial con limpieza de archivos antiguos
        """
        instance = self.get_object()
        old_photo = instance.ruta_fotografia  # Guarda referencia a foto anterior
        
        # Ejecuta la actualización estándar
        response = super().partial_update(request, *args, **kwargs)
        
        # Recarga la instancia desde la base de datos
        instance.refresh_from_db()
        
        # Limpia la foto anterior si se cambió por una nueva
        if old_photo and instance.ruta_fotografia != old_photo:
            if hasattr(old_photo, 'path') and os.path.exists(old_photo.path):
                os.remove(old_photo.path)
        
        return response

# ========================================
# VIEWSET: Gestión de Noticias
# ========================================

class NoticiaViewSet(viewsets.ModelViewSet):
    """
    VIEWSET PRINCIPAL: NoticiaViewSet
    
    ViewSet completo para CRUD de noticias con permisos diferenciados.
    
    Funcionalidades:
    1. CRUD completo de noticias
    2. Permisos diferenciados por acción
    3. Filtrado avanzado por fecha
    4. Ordenamiento cronológico
    
    Endpoints:
    - GET /api/noticias/: Listar noticias (usuarios autenticados)
    - GET /api/noticias/{id}/: Obtener noticia específica (usuarios autenticados)
    - POST /api/noticias/: Crear noticia (solo administradores)
    - PUT /api/noticias/{id}/: Actualizar noticia completa (solo administradores)
    - PATCH /api/noticias/{id}/: Actualizar noticia parcial (solo administradores)
    - DELETE /api/noticias/{id}/: Eliminar noticia (solo administradores)
    
    Sistema de permisos:
    - Lectura (list, retrieve): Usuarios autenticados
    - Escritura (create, update, delete): Solo administradores
    
    Filtros disponibles:
    - Por fecha de publicación
    - Por rango de fechas
    - Búsqueda en título y contenido
    
    Respuestas:
    - 200: Operación exitosa
    - 201: Noticia creada
    - 401: Usuario no autenticado
    - 403: Sin permisos de administrador
    - 404: Noticia no encontrada
    """
    queryset = Noticia.objects.all().order_by('-fecha_publicacion')
    serializer_class = NoticiaSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = NoticiaFilter

    def get_permissions(self):
        """
        Asigna permisos dinámicos basados en la acción:
        - CREATE, UPDATE, DELETE: Solo administradores
        - LIST, RETRIEVE: Usuarios autenticados
        """
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [IsAdminUser]
        else:
            permission_classes = [IsAuthenticated]

        return [permission() for permission in permission_classes]

# ========================================
# VIEWSET: Consulta de Eventos Sísmicos
# ========================================

class EventoSismicoViewSet(viewsets.ReadOnlyModelViewSet):
    """
    VIEWSET PRINCIPAL: EventoSismicoViewSet
    
    ViewSet de solo lectura para consulta avanzada de eventos sísmicos.
    
    Funcionalidades:
    1. Consulta de eventos sísmicos (solo lectura)
    2. Filtrado avanzado por múltiples criterios
    3. Búsqueda por texto en descripciones
    4. Ordenamiento por diferentes campos
    5. Paginación automática
    
    Endpoints:
    - GET /api/sismos/: Listar eventos sísmicos
    - GET /api/sismos/{id}/: Obtener evento específico
    
    Filtros disponibles:
    - magnitud: Exacta, mayor o igual, menor o igual
    - fecha_hora_evento: Por fecha, mayor o igual, menor o igual
    - Búsqueda por texto en lugar_descripcion
    
    Ordenamiento disponible:
    - fecha_hora_evento (por defecto descendente)
    - magnitud
    - profundidad
    
    Características:
    - Solo usuarios autenticados pueden acceder
    - Datos ordenados por fecha (más recientes primero)
    - Filtrado optimizado para consultas geográficas
    
    Respuestas:
    - 200: Consulta exitosa
    - 401: Usuario no autenticado
    - 404: Evento no encontrado
    """
    queryset = EventoSismico.objects.all().order_by('-fecha_hora_evento')
    serializer_class = EventoSismicoSerializer
    permission_classes = [IsAuthenticated]

    # Configuración de backends de filtrado
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = EventoSismicoFilter

    # Filtros directos por parámetros URL
    filterset_fields = {
        'magnitud': ['exact', 'gte', 'lte'],  # Ej: ?magnitud__gte=5.0
        'fecha_hora_evento': ['date', 'gte', 'lte'],  # Ej: ?fecha_hora_evento__date=2024-01-01
    }

    # Campos de búsqueda por texto
    search_fields = ['lugar_descripcion']  # Ej: ?search=California

    # Campos de ordenamiento
    ordering_fields = ['fecha_hora_evento', 'magnitud', 'profundidad']  # Ej: ?ordering=-magnitud

    # ----------------------------------------
    # Override list para añadir logging de depuración
    # ----------------------------------------
    def list(self, request, *args, **kwargs):
        params = request.query_params.dict()
        logger.info("[SISMOS][LIST] Parámetros recibidos: %s", params)
        queryset = self.filter_queryset(self.get_queryset())

        total = queryset.count()
        logger.info("[SISMOS][LIST] Total después de filtros: %s", total)
        if total == 0:
            logger.warning("[SISMOS][LIST] Sin resultados para filtros: %s", params)

        page = self.paginate_queryset(queryset)
        if page is not None:
            logger.info("[SISMOS][LIST] Paginado activo. Elementos página: %s", len(page))
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        # Log de primeras coordenadas para confirmar datos
        sample = serializer.data[:3]
        logger.debug("[SISMOS][LIST] Muestra de datos: %s", [
            { 'id': s.get('id_evento_usgs'), 'lat': s.get('latitud'), 'lng': s.get('longitud'), 'mag': s.get('magnitud') }
            for s in sample
        ])
        return Response(serializer.data)

# ========================================
# VIEWSET: Gestión de Usuarios (Administradores)
# ========================================

class UserManagementViewSet(mixins.ListModelMixin,
                            mixins.RetrieveModelMixin,
                            mixins.DestroyModelMixin,
                            viewsets.GenericViewSet):
    """
    VIEWSET PRINCIPAL: UserManagementViewSet
    
    ViewSet especializado para gestión administrativa de usuarios visitantes.
    
    Funcionalidades:
    1. Listado de usuarios visitantes
    2. Visualización de detalles de usuario
    3. Eliminación de usuarios visitantes
    4. Acceso exclusivo para administradores
    
    Endpoints:
    - GET /api/admin/users/: Listar usuarios visitantes
    - GET /api/admin/users/{id}/: Obtener detalles de usuario
    - DELETE /api/admin/users/{id}/: Eliminar usuario visitante
    
    Restricciones:
    - Solo administradores pueden acceder
    - Solo gestiona usuarios de tipo 'VISITANTE'
    - No permite crear ni modificar usuarios
    - No puede eliminar otros administradores
    
    Datos mostrados:
    - ID de usuario
    - Email de contacto
    - Nombre completo
    - Fecha de registro
    - Último acceso
    - Estado activo/inactivo
    
    Respuestas:
    - 200: Operación exitosa
    - 401: Usuario no autenticado
    - 403: Usuario no es administrador
    - 404: Usuario no encontrado
    """
    serializer_class = UserManagementSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        """
        Filtra para mostrar solo usuarios de tipo 'VISITANTE'
        Excluye administradores del listado
        """
        return Usuario.objects.filter(tipo_usuario='VISITANTE')

# ========================================
# VISTA: Cambio de Contraseña
# ========================================

class ChangePasswordView(APIView):
    """
    VISTA PRINCIPAL: ChangePasswordView
    
    Vista para cambio seguro de contraseña por usuarios autenticados.
    
    Funcionalidades:
    1. Validación de contraseña actual
    2. Verificación de coincidencia de nuevas contraseñas
    3. Hash automático de la nueva contraseña
    4. Validación de requisitos de seguridad
    
    Endpoint:
    - POST /api/perfil/cambiar-password/
    
    Campos requeridos:
    - old_password: Contraseña actual del usuario
    - new_password1: Nueva contraseña
    - new_password2: Confirmación de nueva contraseña
    
    Validaciones de seguridad:
    - La contraseña actual debe ser correcta
    - Las nuevas contraseñas deben coincidir
    - La nueva contraseña debe cumplir requisitos mínimos
    - No puede ser igual a la contraseña actual
    
    Características:
    - Solo usuarios autenticados pueden cambiar su contraseña
    - Validación automática de fortaleza de contraseña
    - Hash seguro con algoritmos de Django
    
    Respuestas:
    - 200: Contraseña cambiada exitosamente
    - 400: Error de validación
    - 401: Usuario no autenticado
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        """
        Procesa el cambio de contraseña con validaciones completas
        """
        serializer = PasswordChangeSerializer(
            data=request.data, 
            context={'request': request}
        )
        
        if serializer.is_valid():
            # Si las validaciones son exitosas, actualiza la contraseña
            user = request.user
            user.set_password(serializer.validated_data['new_password1'])
            user.save()
            
            return Response(
                {"detail": "Contraseña cambiada con éxito."}, 
                status=status.HTTP_200_OK
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ========================================
# VISTA: Sismos Públicos (Sin Autenticación)
# ========================================

class PublicSismosView(generics.ListAPIView):
    """
    VISTA PRINCIPAL: PublicSismosView
    
    Vista pública para acceso básico a eventos sísmicos recientes.
    
    Funcionalidades:
    1. Acceso público sin autenticación
    2. Muestra los 10 sismos más recientes
    3. Datos básicos para páginas de inicio
    4. Ordenamiento por fecha descendente
    
    Endpoint:
    - GET /api/public/sismos/
    
    Características:
    - No requiere autenticación (AllowAny)
    - Limitado a 10 eventos más recientes
    - Ideal para widgets públicos o páginas de inicio
    - Datos optimizados para carga rápida
    
    Datos incluidos:
    - ID del evento USGS
    - Coordenadas geográficas
    - Magnitud y profundidad
    - Fecha y hora del evento
    - Descripción de ubicación
    - Enlace a USGS
    
    Respuestas:
    - 200: Lista de sismos recientes
    - 500: Error interno del servidor
    """
    queryset = EventoSismico.objects.order_by('-fecha_hora_evento')[:10]
    serializer_class = EventoSismicoSerializer
    permission_classes = [AllowAny]  # Acceso completamente público

# ========================================
# VISTA: Diagnóstico rápido de sismos
# ========================================
@api_view(['GET'])
@permission_classes([AllowAny])
def sismos_diagnostics(request):
    """Devuelve métricas rápidas para depurar el endpoint de sismos."""
    total = EventoSismico.objects.count()
    first = EventoSismico.objects.order_by('fecha_hora_evento').first()
    last = EventoSismico.objects.order_by('-fecha_hora_evento').first()
    return Response({
        'total': total,
        'first_event': first.fecha_hora_evento.isoformat() if first else None,
        'first_coords': {'lat': first.latitud, 'lng': first.longitud} if first else None,
        'last_event': last.fecha_hora_evento.isoformat() if last else None,
        'last_coords': {'lat': last.latitud, 'lng': last.longitud} if last else None,
    })