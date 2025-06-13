from rest_framework.permissions import BasePermission

class IsAdminUser(BasePermission):
    """
    Permiso personalizado para permitir el acceso solo a usuarios administradores.
    """
    def has_permission(self, request, view):
        # Se debe estar autenticado y ser de tipo ADMINISTRADOR
        return request.user and request.user.is_authenticated and request.user.tipo_usuario == 'ADMINISTRADOR'