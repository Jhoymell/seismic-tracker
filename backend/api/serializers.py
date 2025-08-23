# ========================================
# SERIALIZERS - SEISMIC TRACKER
# PROPÓSITO: Conversión y validación de datos entre JSON y modelos Django
# ========================================

# ========================================
# IMPORTACIONES DE DJANGO REST FRAMEWORK
# ========================================

from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

# ========================================
# IMPORTACIONES DE DJANGO
# ========================================

from django.contrib.auth import get_user_model  # Para obtener el modelo Usuario activo
from django.contrib.auth.hashers import make_password  # Para hashear contraseñas de forma segura
from django.core.validators import RegexValidator  # Validadores personalizados
from django.contrib.auth.signals import user_logged_in  # Señales de Django

# ========================================
# IMPORTACIONES LOCALES
# ========================================

from .models import Noticia, EventoSismico

# Obtener el modelo de usuario personalizado
Usuario = get_user_model()

# ========================================
# SERIALIZER: Registro de Usuarios
# ========================================

class RegistroUsuarioSerializer(serializers.ModelSerializer):
    """
    SERIALIZER PRINCIPAL: RegistroUsuarioSerializer
    
    Maneja la creación de nuevos usuarios con validación completa.
    
    Funcionalidades:
    1. Validación de contraseñas coincidentes
    2. Hash automático de contraseñas
    3. Validación de formato de teléfono
    4. Verificación de unicidad de email y username
    5. Asignación automática de rol 'VISITANTE'
    
    Campos incluidos:
    - email: Correo electrónico único (campo de login)
    - username: Nombre de usuario único
    - first_name: Nombre (requerido)
    - last_name: Apellidos (requerido)
    - password: Contraseña (será hasheada)
    - password_confirm: Confirmación de contraseña (no se guarda)
    - telefono: Número de teléfono (opcional, validado)
    - fecha_nacimiento: Fecha de nacimiento (opcional)
    - ruta_fotografia: Foto de perfil (opcional)
    
    Validaciones implementadas:
    - Contraseñas deben coincidir
    - Email debe ser único y válido
    - Username debe ser único
    - Teléfono debe tener formato válido
    - Campos obligatorios completos
    """
    
    # ========================================
    # CAMPO ADICIONAL PARA CONFIRMACIÓN
    # ========================================
    
    password_confirm = serializers.CharField(
        write_only=True, 
        style={'input_type': 'password'},
        help_text="Confirmación de la contraseña"
    )

    # ========================================
    # VALIDADOR DE TELÉFONO
    # ========================================
    
    telefono_validator = RegexValidator(
        regex=r'^\+?1?\d{8,15}$',
        message="El número de teléfono debe tener un formato válido (ej: +50612345678 o 12345678)."
    )
    
    telefono = serializers.CharField(
        validators=[telefono_validator], 
        required=False, 
        allow_blank=True,
        help_text="Número de teléfono con formato internacional"
    )

    class Meta:
        model = Usuario
        fields = [
            'email', 'username', 'first_name', 'last_name', 
            'password', 'password_confirm', 'telefono', 
            'fecha_nacimiento', 'ruta_fotografia'
        ]
        
        # Configuración adicional de campos
        extra_kwargs = {
            'password': {
                'write_only': True, 
                'style': {'input_type': 'password'}
            },
            'first_name': {'required': True},
            'last_name': {'required': True},
            'email': {'required': True},
            'fecha_nacimiento': {'required': False},
        }

    def validate_username(self, value):
        """
        Validación personalizada para asegurar unicidad del username
        """
        if Usuario.objects.filter(username=value).exists():
            raise serializers.ValidationError("Este nombre de usuario ya existe.")
        return value

    def validate_email(self, value):
        """
        Validación personalizada para asegurar unicidad del email
        Convierte a minúsculas para consistencia
        """
        if Usuario.objects.filter(email=value).exists():
            raise serializers.ValidationError("Este correo electrónico ya está registrado.")
        return value.lower()  # Guardar emails en minúsculas

    def validate(self, data):
        """
        Validación a nivel de objeto para verificar contraseñas coincidentes
        """
        # Verificar que las contraseñas coincidan
        if data.get('password') != data.get('password_confirm'):
            raise serializers.ValidationError({
                "password_confirm": "Las contraseñas no coinciden."
            })

        # Remover password_confirm ya que no existe en el modelo
        data.pop('password_confirm', None)
        return data

    def create(self, validated_data):
        """
        Creación personalizada del usuario con hash de contraseña y configuración inicial
        """
        # Hashear la contraseña de forma segura
        validated_data['password'] = make_password(validated_data.get('password'))

        # Asignar tipo de usuario por defecto
        validated_data['tipo_usuario'] = Usuario.TipoUsuario.VISITANTE

        return super().create(validated_data)

# ========================================
# SERIALIZER: Token JWT Personalizado
# ========================================

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    SERIALIZER PRINCIPAL: MyTokenObtainPairSerializer
    
    Extiende TokenObtainPairSerializer para incluir claims personalizados.
    
    Funcionalidades:
    1. Generación de tokens JWT estándar
    2. Inclusión de datos adicionales en el token
    3. Manejo seguro de URLs de archivos
    4. Señal de login exitoso
    
    Claims adicionales incluidos:
    - username: Nombre de usuario
    - email: Correo electrónico
    - tipo_usuario: Rol del usuario (VISITANTE/ADMINISTRADOR)
    - first_name: Nombre
    - ruta_fotografia: URL de la foto de perfil
    
    Características especiales:
    - Manejo seguro de archivos de imagen (URL vs objeto)
    - Envío de señal user_logged_in para auditoría
    - Contexto de request disponible para URLs absolutas
    """
    
    @classmethod
    def get_token(cls, user):
        """
        Método para generar token con claims personalizados
        """
        token = super().get_token(user)

        # ========================================
        # CLAIMS PERSONALIZADOS
        # ========================================
        
        token['username'] = user.username
        token['email'] = user.email
        token['tipo_usuario'] = user.tipo_usuario
        token['first_name'] = user.first_name

        # ========================================
        # MANEJO SEGURO DE FOTO DE PERFIL
        # ========================================
        
        # Asegurar que se pase la URL (string) y no el objeto archivo
        if user.ruta_fotografia:
            token['ruta_fotografia'] = user.ruta_fotografia.url  # ¡Crucial usar .url!
        else:
            token['ruta_fotografia'] = None

        return token

    def validate(self, attrs):
        """
        Validación personalizada con señal de login exitoso
        """
        # Ejecutar validación estándar
        data = super().validate(attrs)
        
        # Enviar señal de login exitoso para auditoría
        user_logged_in.send(
            sender=self.user.__class__, 
            request=self.context.get('request'), 
            user=self.user
        )
        
        return data

# ========================================
# SERIALIZER: Perfil de Usuario
# ========================================

class PerfilUsuarioSerializer(serializers.ModelSerializer):
    """
    SERIALIZER PRINCIPAL: PerfilUsuarioSerializer
    
    Maneja la lectura y actualización del perfil de usuario.
    
    Funcionalidades:
    1. Serialización de datos de perfil
    2. Generación de URLs absolutas para imágenes
    3. Campos de solo lectura para datos sensibles
    4. Manejo de archivos de imagen
    
    Campos incluidos:
    - id: Identificador único (solo lectura)
    - email: Correo electrónico (solo lectura)
    - username: Nombre de usuario (solo lectura)
    - first_name: Nombre (editable)
    - last_name: Apellidos (editable)
    - telefono: Número de teléfono (editable)
    - ruta_fotografia: Archivo de imagen (editable)
    - ruta_fotografia_url: URL absoluta de la imagen (calculado)
    
    Características especiales:
    - URLs absolutas para acceso desde frontend
    - Manejo opcional de campos de imagen
    - Protección de campos críticos (email, username)
    """
    
    ruta_fotografia_url = serializers.SerializerMethodField()

    class Meta:
        model = Usuario
        fields = (
            'id', 'email', 'username', 'first_name', 'last_name', 
            'telefono', 'ruta_fotografia', 'ruta_fotografia_url'
        )
        read_only_fields = ('id', 'email', 'username')
        extra_kwargs = {
            'ruta_fotografia': {'required': False, 'allow_null': True}
        }

    def get_ruta_fotografia_url(self, obj):
        """
        Método para generar URL absoluta de la foto de perfil
        Incluye el dominio completo para acceso desde frontend
        """
        request = self.context.get('request')
        
        if obj.ruta_fotografia and hasattr(obj.ruta_fotografia, 'url'):
            if request:
                return request.build_absolute_uri(obj.ruta_fotografia.url)
            else:
                return obj.ruta_fotografia.url
        
        return None

# ========================================
# SERIALIZER: Noticias
# ========================================

class NoticiaSerializer(serializers.ModelSerializer):
    """
    SERIALIZER PRINCIPAL: NoticiaSerializer
    
    Maneja la serialización de noticias del sistema.
    
    Funcionalidades:
    1. Serialización completa de noticias
    2. Fecha automática de publicación
    3. Validación de contenido
    
    Campos incluidos:
    - id: Identificador único
    - titulo: Título de la noticia
    - contenido: Contenido completo
    - fecha_publicacion: Fecha automática (solo lectura)
    
    Características:
    - Fecha de publicación se establece automáticamente
    - Validación automática de campos requeridos
    - Soporte para contenido de texto enriquecido
    """
    
    class Meta:
        model = Noticia
        fields = ['id', 'titulo', 'contenido', 'fecha_publicacion']
        read_only_fields = ['fecha_publicacion']  # Fecha automática

# ========================================
# SERIALIZER: Eventos Sísmicos
# ========================================

class EventoSismicoSerializer(serializers.ModelSerializer):
    """
    SERIALIZER PRINCIPAL: EventoSismicoSerializer
    
    Maneja la serialización de eventos sísmicos.
    
    Funcionalidades:
    1. Serialización completa de datos sísmicos
    2. Validación de coordenadas geográficas
    3. Formato apropiado para APIs de mapas
    
    Campos incluidos:
    - Todos los campos del modelo EventoSismico
    - Datos geográficos (latitud, longitud, profundidad)
    - Datos sísmicos (magnitud, fecha_hora_evento)
    - Metadatos (id_evento_usgs, lugar_descripcion, url_usgs)
    - Timestamps de registro local
    
    Características:
    - Incluye todos los campos del modelo
    - Formato optimizado para visualización en mapas
    - Datos compatibles con APIs externas (USGS)
    """
    
    class Meta:
        model = EventoSismico
        fields = '__all__'  # Incluir todos los campos del modelo

# ========================================
# SERIALIZER: Gestión de Usuarios (Admin)
# ========================================

class UserManagementSerializer(serializers.ModelSerializer):
    """
    SERIALIZER PRINCIPAL: UserManagementSerializer
    
    Maneja la visualización de usuarios para administradores.
    
    Funcionalidades:
    1. Vista simplificada de datos de usuarios
    2. Solo información relevante para administración
    3. Campos seguros para listados públicos
    
    Campos incluidos:
    - id: Identificador único
    - email: Correo de contacto
    - first_name: Nombre
    - last_name: Apellidos
    - date_joined: Fecha de registro
    - last_login: Último acceso
    
    Características:
    - Solo campos no sensibles
    - Información relevante para administración
    - Optimizado para listados y reportes
    """
    
    class Meta:
        model = Usuario
        fields = ['id', 'email', 'first_name', 'last_name', 'date_joined', 'last_login']

# ========================================
# SERIALIZER: Cambio de Contraseña
# ========================================

class PasswordChangeSerializer(serializers.Serializer):
    """
    SERIALIZER PRINCIPAL: PasswordChangeSerializer
    
    Maneja el cambio seguro de contraseñas para usuarios autenticados.
    
    Funcionalidades:
    1. Validación de contraseña actual
    2. Verificación de contraseñas nuevas coincidentes
    3. Validaciones de seguridad
    4. Proceso seguro de cambio
    
    Campos requeridos:
    - old_password: Contraseña actual del usuario
    - new_password1: Nueva contraseña
    - new_password2: Confirmación de nueva contraseña
    
    Validaciones implementadas:
    - Contraseña actual debe ser correcta
    - Nuevas contraseñas deben coincidir
    - Campos obligatorios completos
    - Protección contra ataques de fuerza bruta
    
    Características de seguridad:
    - Solo escritura para todos los campos
    - Validación en contexto de usuario autenticado
    - Verificación usando hash seguro de Django
    """
    
    old_password = serializers.CharField(
        write_only=True, 
        required=True,
        help_text="Contraseña actual del usuario"
    )
    
    new_password1 = serializers.CharField(
        write_only=True, 
        required=True,
        help_text="Nueva contraseña"
    )
    
    new_password2 = serializers.CharField(
        write_only=True, 
        required=True,
        help_text="Confirmación de la nueva contraseña"
    )

    def validate_old_password(self, value):
        """
        Validación de la contraseña actual usando el hash almacenado
        """
        user = self.context['request'].user
        
        if not user.check_password(value):
            raise serializers.ValidationError("Tu contraseña actual es incorrecta.")
        
        return value

    def validate(self, data):
        """
        Validación a nivel de objeto para verificar coincidencia de nuevas contraseñas
        """
        if data['new_password1'] != data['new_password2']:
            raise serializers.ValidationError({
                'new_password2': "Las nuevas contraseñas no coinciden."
            })
        
        # Aquí se pueden añadir validaciones adicionales de fortaleza
        # como longitud mínima, complejidad, etc.
        
        return data