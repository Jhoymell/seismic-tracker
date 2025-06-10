from django.apps import AppConfig


class ApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api'

    def ready(self):
        # Importa las señales aquí para asegurarte de que se registren
        # cuando la aplicación se inicie.
        import api.signals