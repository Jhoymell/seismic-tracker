from django_filters import rest_framework as filters
from .models import EventoSismico, Noticia

class EventoSismicoFilter(filters.FilterSet):
    # Creamos un filtro personalizado para buscar eventos a partir de una fecha y hora.
    # El nombre 'since_date' es el que usaremos en la URL (ej: /api/sismos/?since_date=...)
    since_date = filters.DateTimeFilter(field_name="fecha_hora_evento", lookup_expr='gte')

    class Meta:
        model = EventoSismico
        fields = {
            'magnitud': ['exact', 'gte', 'lte'], # Mantenemos los filtros anteriores
        }

class NoticiaFilter(filters.FilterSet):
    # Filtro para obtener noticias publicadas después de una fecha y hora específicas
    published_after = filters.DateTimeFilter(field_name="fecha_publicacion", lookup_expr='gt') # 'gt' = greater than

    class Meta:
        model = Noticia
        fields = ['published_after']