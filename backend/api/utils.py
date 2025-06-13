import uuid
import os

def get_unique_filename(instance, filename):
    """
    Genera un nombre de archivo único para la foto de perfil del usuario.
    Ej: /fotos_perfil/user_2_a1b2c3d4.jpg
    """
    # Obtiene la extensión del archivo original
    ext = filename.split('.')[-1]
    # Genera un nombre de archivo usando el ID del usuario y un UUID
    unique_id = uuid.uuid4().hex[:8] # Usamos 8 caracteres del UUID para brevedad
    new_filename = f"user_{instance.id}_{unique_id}.{ext}"

    # Devuelve la ruta donde se guardará el archivo
    return os.path.join('fotos_perfil', new_filename)