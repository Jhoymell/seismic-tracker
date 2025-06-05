from rest_framework import serializers
from django.contrib.auth import get_user_model # Para obtener el modelo Usuario activo
from django.contrib.auth.hashers import make_password # Para hashear la contraseña
from django.core.validators import RegexValidator

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