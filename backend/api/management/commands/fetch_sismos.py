import requests
from django.core.management.base import BaseCommand
from django.utils.dateparse import parse_datetime
from api.models import EventoSismico
from datetime import datetime
import pytz 

class Command(BaseCommand):
    help = 'Obtiene los datos de sismos desde la API de USGS y los guarda en la base de datos'

    def handle(self, *args, **options):
        # URL de la API de USGS. Pedimos sismos de magnitud 4.5+ del último mes.
        # Puedes ajustar estos parámetros según necesites.
        url = "https://earthquake.usgs.gov/fdsnws/event/1/query"
        params = {
            'format': 'geojson',
            'starttime': 'now-30days',
            'minmagnitude': 4.5
        }

        self.stdout.write("Obteniendo datos de sismos desde USGS...")

        try:
            response = requests.get(url, params=params, timeout=30)
            response.raise_for_status()  # Lanza un error para códigos de estado 4xx/5xx
            data = response.json()
        except requests.RequestException as e:
            self.stderr.write(self.style.ERROR(f'Error al conectar con la API de USGS: {e}'))
            return

        eventos_procesados = 0
        eventos_nuevos = 0

        features = data.get('features', [])
        if not features:
            self.stdout.write(self.style.WARNING('No se encontraron eventos sísmicos con los criterios actuales.'))
            return

        for feature in features:
            props = feature.get('properties', {})
            geom = feature.get('geometry', {})

            # Extraemos los datos requeridos 
            usgs_id = feature.get('id')
            magnitud = props.get('mag')
            lugar = props.get('place')
            # La API devuelve el tiempo en milisegundos desde la época
            tiempo_epoch_ms = props.get('time')
            profundidad = geom.get('coordinates', [])[2] if len(geom.get('coordinates', [])) > 2 else None
            longitud = geom.get('coordinates', [])[0] if len(geom.get('coordinates', [])) > 0 else None
            latitud = geom.get('coordinates', [])[1] if len(geom.get('coordinates', [])) > 1 else None
            url_usgs_detalle = props.get('url')

            # Validamos que tengamos los datos mínimos
            if not all([usgs_id, magnitud, tiempo_epoch_ms, profundidad, longitud, latitud]):
                self.stdout.write(self.style.WARNING(f"Omitiendo evento {usgs_id} por falta de datos clave."))
                continue

            # Convertimos el tiempo a un objeto datetime de Django
            fecha_hora_evento_utc = datetime.utcfromtimestamp(tiempo_epoch_ms / 1000.0).replace(tzinfo=pytz.UTC)

            # Usamos update_or_create para evitar duplicados basados en el ID de USGS
            obj, created = EventoSismico.objects.update_or_create(
                id_evento_usgs=usgs_id,
                defaults={
                    'latitud': latitud,
                    'longitud': longitud,
                    'magnitud': magnitud,
                    'profundidad': profundidad,
                    'fecha_hora_evento': fecha_hora_evento_utc,
                    'lugar_descripcion': lugar,
                    'url_usgs': url_usgs_detalle,
                }
            )

            eventos_procesados += 1
            if created:
                eventos_nuevos += 1

        self.stdout.write(self.style.SUCCESS(f'Proceso completado. {eventos_procesados} eventos verificados, {eventos_nuevos} nuevos eventos añadidos.'))