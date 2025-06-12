from django.contrib import admin # Importa el módulo admin de Django
from django.urls import path, include # Importa las funciones de path e include para definir las URLs
from django.conf import settings # Importa la configuración de Django
from django.conf.urls.static import static # Importa las funciones para servir archivos estáticos en modo DEBUG

# Importa la vista de refresco de simplejwt y nuestra vista de login personalizada
from rest_framework_simplejwt.views import TokenRefreshView
from api.views import MyTokenObtainPairView # <-- CAMBIO AQUÍ

urlpatterns = [
    path('admin/', admin.site.urls),

    # URLs de la API de nuestra app 'api'
    path('api/', include('api.urls')),

    # URLs de Autenticación JWT
    # Apuntamos a nuestra vista personalizada para la obtención de tokens
    path('api/token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'), 
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)