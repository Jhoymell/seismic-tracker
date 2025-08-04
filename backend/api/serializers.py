from rest_framework import serializers
from django.contrib.auth import get_user_model # Para obtener el modelo Usuario activo
from django.contrib.auth.hashers import make_password # Para hashear la contraseña
from django.core.validators import RegexValidator
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.signals import user_logged_in
from .models import Noticia 
from .models import EventoSismico

Usuario = get_user_model()

# Serializer para el registro de usuarios
class RegistroUsuarioSerializer(serializers.ModelSerializer):
    # Campo para la confirmación de la contraseña, no se guarda en el modelo
    password_confirm = serializers.CharField(write_only=True, style={'input_type': 'password'})

    # Validador para el teléfono (ejemplo simple, puedes ajustarlo)
    telefono_validator = RegexValidator(
        regex=r'^\+?1?\d{8,15}$',
        message="El número de teléfono debe tener un formato válido (ej: +50612345678 o 12345678)."
    )
    telefono = serializers.CharField(validators=[telefono_validator], required=False, allow_blank=True)

    class Meta:
        model = Usuario
        fields = ['email', 'username', 'first_name', 'last_name', 'password', 'password_confirm', 'telefono', 'fecha_nacimiento', 'ruta_fotografia']
        # 'username' aquí es el que Django User model tiene por defecto. 
        # Lo mantenemos porque AbstractUser lo requiere, pero nuestro login será con email.
        # Puedes ponerlo como read_only si no quieres que el usuario lo envíe directamente y lo generas a partir del email o un valor por defecto.
        # O hacerlo opcional y si no se provee, usar el email.
        # Por ahora, dejémoslo como un campo que el usuario puede enviar (puede ser igual al email).

        extra_kwargs = {
            'password': {'write_only': True, 'style': {'input_type': 'password'}},
            'first_name': {'required': True},
            'last_name': {'required': True},
            'email': {'required': True},
            'fecha_nacimiento': {'required': False},
            # 'ruta_fotografia': {'read_only': True}
        }

    def validate_username(self, value):
        # Asegurar que el username (si se usa/envía) sea único
        if Usuario.objects.filter(username=value).exists():
            raise serializers.ValidationError("Este nombre de usuario ya existe.")
        return value

    def validate_email(self, value):
        # Asegurar que el email sea único (aunque el modelo ya lo hace, es bueno validar aquí también)
        if Usuario.objects.filter(email=value).exists():
            raise serializers.ValidationError("Este correo electrónico ya está registrado.")
        return value.lower() # Guardar emails en minúsculas

    def validate(self, data):
        # Validar que las contraseñas coincidan [cite: 11]
        if data.get('password') != data.get('password_confirm'):
            raise serializers.ValidationError({"password_confirm": "Las contraseñas no coinciden."})

        # Eliminar password_confirm del diccionario de datos, ya que no está en el modelo Usuario
        data.pop('password_confirm', None)
        return data

    def create(self, validated_data):
        # Hashear la contraseña antes de guardarla [cite: 10]
        validated_data['password'] = make_password(validated_data.get('password'))

        # Asignar tipo de usuario por defecto (Visitante)
        # El modelo ya lo hace por defecto, pero podemos ser explícitos.
        validated_data['tipo_usuario'] = Usuario.TipoUsuario.VISITANTE

        return super().create(validated_data)
    
# Serializer personalizado para el login con JWT
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Añadimos claims (datos) personalizados al token JWT
        token['username'] = user.username
        token['email'] = user.email
        token['tipo_usuario'] = user.tipo_usuario
        token['first_name'] = user.first_name

        # --- INICIO DE LA SOLUCIÓN ---
        # Nos aseguramos de pasar la URL (un string) y no el objeto de archivo
        if user.ruta_fotografia:
            token['ruta_fotografia'] = user.ruta_fotografia.url # ¡La clave está en el .url!
        else:
            token['ruta_fotografia'] = None
        # --- FIN DE LA SOLUCIÓN ---

        return token

    def validate(self, attrs):
        # Envía la señal de login exitoso
        data = super().validate(attrs)
        user_logged_in.send(sender=self.user.__class__, request=self.context.get('request'), user=self.user)
        return data
    
# Serializer para el perfil del usuario autenticado
class PerfilUsuarioSerializer(serializers.ModelSerializer):
    ruta_fotografia_url = serializers.SerializerMethodField()

    class Meta:
        model = Usuario
        fields = ('id', 'email', 'username', 'first_name', 'last_name', 'telefono', 'ruta_fotografia', 'ruta_fotografia_url')
        read_only_fields = ('id', 'email', 'username')
        extra_kwargs = {
            'ruta_fotografia': {'required': False, 'allow_null': True}
        }

    def get_ruta_fotografia_url(self, obj):
        request = self.context.get('request')
        if obj.ruta_fotografia and hasattr(obj.ruta_fotografia, 'url'):
            return request.build_absolute_uri(obj.ruta_fotografia.url) if request else obj.ruta_fotografia.url
        return None

# Serializer para las noticias
class NoticiaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Noticia
        fields = ['id', 'titulo', 'contenido', 'fecha_publicacion']
        read_only_fields = ['fecha_publicacion'] # La fecha se establece automáticamente

# Serializer para los eventos sísmicos
class EventoSismicoSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventoSismico
        fields = '__all__' # Incluimos todos los campos del modelo
        
# Serializer para la gestión de usuarios en el panel de admin
class UserManagementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        # Campos a mostrar en el panel de admin
        fields = ['id', 'email', 'first_name', 'last_name', 'date_joined', 'last_login']
        
# Serializer para el cambio de contraseña seguro
class PasswordChangeSerializer(serializers.Serializer):
    """
    Serializer para el cambio de contraseña que requiere la contraseña antigua.
    """
    old_password = serializers.CharField(write_only=True, required=True)
    new_password1 = serializers.CharField(write_only=True, required=True)
    new_password2 = serializers.CharField(write_only=True, required=True)

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Tu contraseña actual es incorrecta.")
        return value

    def validate(self, data):
        if data['new_password1'] != data['new_password2']:
            raise serializers.ValidationError({'new_password2': "Las nuevas contraseñas no coinciden."})
        # Aquí podrías añadir validaciones de fortaleza para la nueva contraseña si quisieras
        return data