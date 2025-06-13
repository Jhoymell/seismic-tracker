from rest_framework import serializers
from django.contrib.auth import get_user_model # Para obtener el modelo Usuario activo
from django.contrib.auth.hashers import make_password # Para hashear la contraseña
from django.core.validators import RegexValidator
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.signals import user_logged_in

Usuario = get_user_model()

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
            'password': {'write_only': True, 'style': {'input_type': 'password'}}, # No leer la contraseña, solo escribirla
            'first_name': {'required': True},
            'last_name': {'required': True},
            'email': {'required': True},
            'fecha_nacimiento': {'required': False}, # Ajusta según los requisitos exactos
            'ruta_fotografia': {'read_only': True} # La ruta de la foto se generará, no la enviará el usuario directamente.
                                                    # La subida del archivo se manejará en la vista.
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
    
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        # La validación por defecto de TokenObtainPairSerializer se encarga de
        # verificar las credenciales del usuario.
        data = super().validate(attrs)

        # Si las credenciales son válidas, 'self.user' contendrá el objeto del usuario.
        # Aquí es donde disparamos la señal 'user_logged_in' manualmente.
        user_logged_in.send(sender=self.user.__class__, request=self.context.get('request'), user=self.user)

        return data
    

class PerfilUsuarioSerializer(serializers.ModelSerializer):
    # Hacemos los campos de contraseña opcionales y solo de escritura
    password = serializers.CharField(write_only=True, required=False, style={'input_type': 'password'})
    password_confirm = serializers.CharField(write_only=True, required=False, style={'input_type': 'password'})

    class Meta:
        model = Usuario
        # Campos que el usuario puede ver y modificar
        fields = ['id', 'email', 'username', 'first_name', 'last_name', 'telefono', 'fecha_nacimiento', 'ruta_fotografia', 'password', 'password_confirm']

        # El email y username no deben ser modificables en este endpoint
        read_only_fields = ['id', 'email', 'username']

    def validate(self, data):
        """
        Valida si las contraseñas nuevas coinciden.
        """
        password = data.get('password', None)
        password_confirm = data.get('password_confirm', None)

        if password and password_confirm and password != password_confirm:
            raise serializers.ValidationError({"password_confirm": "Las nuevas contraseñas no coinciden."})

        # No es necesario guardar password_confirm
        if 'password_confirm' in data:
            data.pop('password_confirm')

        return data

    def update(self, instance, validated_data):
        """
        Actualiza la instancia del usuario.
        """
        # Si se proporciona una nueva contraseña, la hasheamos y la actualizamos.
        password = validated_data.pop('password', None)
        if password:
            instance.set_password(password) # set_password se encarga del hashing

        # Llama al método update del padre para actualizar el resto de los campos
        return super().update(instance, validated_data)