from django.contrib import admin
from .models import Usuario, EventoSismico, Noticia
from django.contrib.auth.admin import UserAdmin

# Para personalizar cómo se muestra el modelo Usuario en el admin
class CustomUserAdmin(UserAdmin):
    model = Usuario
    # Campos a mostrar en la lista de usuarios
    list_display = ['email', 'username', 'first_name', 'last_name', 'tipo_usuario', 'is_staff', 'last_login']
    # Campos que se pueden usar para buscar
    search_fields = ['email', 'username', 'first_name', 'last_name']
    # Campos para filtrar
    list_filter = ['tipo_usuario', 'is_staff', 'is_active']

    # Definir los fieldsets para el formulario de creación/edición
    # Heredamos los fieldsets de UserAdmin y añadimos los nuestros
    fieldsets = UserAdmin.fieldsets + (
        (None, {'fields': ('telefono', 'fecha_nacimiento', 'ruta_fotografia', 'tipo_usuario')}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        (None, {'fields': ('telefono', 'fecha_nacimiento', 'ruta_fotografia', 'tipo_usuario', 'email')}),
    )

admin.site.register(Usuario, CustomUserAdmin)
admin.site.register(EventoSismico)
admin.site.register(Noticia)
