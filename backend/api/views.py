from rest_framework import generics, status
from rest_framework.response import Response
from .serializers import RegistroUsuarioSerializer
from django.contrib.auth import get_user_model

Usuario = get_user_model()

class RegistroUsuarioView(generics.CreateAPIView):
    queryset = Usuario.objects.all()
    serializer_class = RegistroUsuarioSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid(): # Se ejecutan las validaciones del serializer [cite: 9]
            self.perform_create(serializer)
            # El documento pide NO mostrar una caja de diálogo, sino una página indicando éxito[cite: 12, 13].
            # En una API, esto se traduce a una respuesta JSON exitosa.
            # El frontend se encargará de mostrar la "página" de éxito.
            return Response(
                {"message": "Usuario registrado correctamente."}, # [cite: 12]
                status=status.HTTP_201_CREATED
            )

        # Si la validación falla, DRF por defecto devuelve los errores en formato JSON.
        # El validador del lado del servidor se ejecuta aquí[cite: 9].
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)