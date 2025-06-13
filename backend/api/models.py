from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
from .utils import get_unique_filename

class Usuario(AbstractUser):
    telefono = models.CharField(max_length=20, blank=True, null=True)
    fecha_nacimiento = models.DateField(null=True, blank=True)
    ruta_fotografia = models.ImageField(upload_to=get_unique_filename, blank=True, null=True, max_length=255)
    class TipoUsuario(models.TextChoices):
        VISITANTE = 'VISITANTE', 'Visitante'
        ADMINISTRADOR = 'ADMINISTRADOR', 'Administrador'

    tipo_usuario = models.CharField(
        max_length=20,
        choices=TipoUsuario.choices,
        default=TipoUsuario.VISITANTE,
    )

    email = models.EmailField(unique=True)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name']

    def __str__(self):
        return self.email

class EventoSismico(models.Model):
    id_evento_usgs = models.CharField(max_length=100, unique=True, help_text="ID único del evento de USGS")
    latitud = models.FloatField()
    longitud = models.FloatField()
    magnitud = models.FloatField()
    profundidad = models.FloatField()
    fecha_hora_evento = models.DateTimeField(help_text="Fecha y hora UTC del evento")
    lugar_descripcion = models.CharField(max_length=255, blank=True, null=True)
    url_usgs = models.URLField(max_length=500, blank=True, null=True)
    fecha_registro_db = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Sismo {self.magnitud} Mw - {self.lugar_descripcion} ({self.fecha_hora_evento.strftime('%Y-%m-%d %H:%M:%S')})"

    class Meta:
        ordering = ['-fecha_hora_evento']

class Noticia(models.Model):
    titulo = models.CharField(max_length=200)
    contenido = models.TextField()
    fecha_publicacion = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.titulo 

    class Meta:
        ordering = ['-fecha_publicacion']
