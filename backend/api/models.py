# ========================================
# MODELOS DE BASE DE DATOS - SEISMIC TRACKER
# PROPÓSITO: Definición de todas las entidades de datos de la aplicación
# ========================================

from django.db import models
from django.contrib.auth.models import AbstractUser  # Modelo de usuario personalizado
from django.utils import timezone  # Utilidades de zona horaria
from .utils import get_unique_filename  # Función auxiliar para nombres únicos de archivo

# ========================================
# MODELO: Usuario
# PROPÓSITO: Gestión de usuarios del sistema con roles y datos personales
# ========================================

class Usuario(AbstractUser):
    """
    MODELO PRINCIPAL: Usuario
    
    Extiende el modelo AbstractUser de Django para incluir:
    1. Información personal adicional (teléfono, fecha de nacimiento)
    2. Foto de perfil con gestión de archivos
    3. Sistema de roles (Visitante/Administrador)
    4. Autenticación por email en lugar de username
    
    Campos principales:
    - telefono: Número de contacto del usuario
    - fecha_nacimiento: Para validaciones de edad
    - ruta_fotografia: Imagen de perfil con nombres únicos
    - tipo_usuario: Rol del usuario en el sistema
    - email: Campo único para autenticación
    """
    
    # ========================================
    # CAMPOS ADICIONALES DEL USUARIO
    # ========================================
    
    telefono = models.CharField(
        max_length=20, 
        blank=True, 
        null=True,
        help_text="Número de teléfono del usuario"
    )
    
    fecha_nacimiento = models.DateField(
        null=True, 
        blank=True,
        help_text="Fecha de nacimiento para validaciones de edad"
    )
    
    ruta_fotografia = models.ImageField(
        upload_to=get_unique_filename,  # Función que genera nombres únicos
        blank=True, 
        null=True, 
        max_length=255,
        help_text="Foto de perfil del usuario"
    )
    
    # ========================================
    # SISTEMA DE ROLES
    # ========================================
    
    class TipoUsuario(models.TextChoices):
        """
        Definición de roles disponibles en el sistema
        - VISITANTE: Usuario estándar con permisos básicos
        - ADMINISTRADOR: Usuario con permisos administrativos completos
        """
        VISITANTE = 'VISITANTE', 'Visitante'
        ADMINISTRADOR = 'ADMINISTRADOR', 'Administrador'

    tipo_usuario = models.CharField(
        max_length=20,
        choices=TipoUsuario.choices,
        default=TipoUsuario.VISITANTE,
        help_text="Rol del usuario en el sistema"
    )

    # ========================================
    # CONFIGURACIÓN DE AUTENTICACIÓN
    # ========================================
    
    email = models.EmailField(
        unique=True,
        help_text="Email único para autenticación"
    )
    
    # Configuración para usar email como campo de login principal
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name']

    def __str__(self):
        """Representación string del usuario mostrando su email"""
        return self.email

# ========================================
# MODELO: EventoSismico
# PROPÓSITO: Almacenamiento de datos sísmicos obtenidos de USGS
# ========================================

class EventoSismico(models.Model):
    """
    MODELO PRINCIPAL: EventoSismico
    
    Almacena información detallada de eventos sísmicos:
    1. Datos geográficos (latitud, longitud, profundidad)
    2. Datos de magnitud y tiempo del evento
    3. Información descriptiva y enlaces a fuentes
    4. Metadatos de registro en la base de datos
    
    Funcionalidades:
    - Sincronización con API de USGS
    - Ordenamiento por fecha de evento (más recientes primero)
    - Prevención de duplicados por ID único de USGS
    """
    
    # ========================================
    # IDENTIFICACIÓN Y DATOS BÁSICOS
    # ========================================
    
    id_evento_usgs = models.CharField(
        max_length=100, 
        unique=True, 
        help_text="ID único del evento proporcionado por USGS"
    )
    
    # ========================================
    # DATOS GEOGRÁFICOS
    # ========================================
    
    latitud = models.FloatField(
        help_text="Latitud geográfica del epicentro"
    )
    
    longitud = models.FloatField(
        help_text="Longitud geográfica del epicentro"
    )
    
    profundidad = models.FloatField(
        help_text="Profundidad del hipocentro en kilómetros"
    )
    
    # ========================================
    # DATOS SÍSMICOS
    # ========================================
    
    magnitud = models.FloatField(
        help_text="Magnitud del sismo en escala de momento (Mw)"
    )
    
    fecha_hora_evento = models.DateTimeField(
        help_text="Fecha y hora UTC del evento sísmico"
    )
    
    # ========================================
    # INFORMACIÓN DESCRIPTIVA
    # ========================================
    
    lugar_descripcion = models.CharField(
        max_length=255, 
        blank=True, 
        null=True,
        help_text="Descripción del lugar donde ocurrió el sismo"
    )
    
    url_usgs = models.URLField(
        max_length=500, 
        blank=True, 
        null=True,
        help_text="Enlace a la página de detalles en USGS"
    )
    
    # ========================================
    # METADATOS DE REGISTRO
    # ========================================
    
    fecha_registro_db = models.DateTimeField(
        auto_now_add=True,
        help_text="Fecha y hora de registro en la base de datos local"
    )

    def __str__(self):
        """
        Representación string del evento sísmico
        Formato: "Sismo [magnitud] Mw - [lugar] ([fecha])"
        """
        return f"Sismo {self.magnitud} Mw - {self.lugar_descripcion} ({self.fecha_hora_evento.strftime('%Y-%m-%d %H:%M:%S')})"

    class Meta:
        """
        Configuración del modelo:
        - Ordenamiento por fecha de evento descendente (más recientes primero)
        """
        ordering = ['-fecha_hora_evento']

# ========================================
# MODELO: Noticia
# PROPÓSITO: Sistema de noticias y comunicados para usuarios
# ========================================

class Noticia(models.Model):
    """
    MODELO COMPLEMENTARIO: Noticia
    
    Sistema básico de noticias para comunicados importantes:
    1. Información sobre sismos relevantes
    2. Comunicados del sistema
    3. Actualizaciones y mantenimientos
    
    Características:
    - Ordenamiento cronológico inverso
    - Contenido flexible con texto enriquecido
    - Fecha automática de publicación
    """
    
    # ========================================
    # CAMPOS DE CONTENIDO
    # ========================================
    
    titulo = models.CharField(
        max_length=200,
        help_text="Título de la noticia o comunicado"
    )
    
    contenido = models.TextField(
        help_text="Contenido completo de la noticia"
    )
    
    fecha_publicacion = models.DateTimeField(
        default=timezone.now,
        help_text="Fecha y hora de publicación de la noticia"
    )

    def __str__(self):
        """Representación string de la noticia mostrando su título"""
        return self.titulo 

    class Meta:
        """
        Configuración del modelo:
        - Ordenamiento por fecha de publicación descendente (más recientes primero)
        """
        ordering = ['-fecha_publicacion']
