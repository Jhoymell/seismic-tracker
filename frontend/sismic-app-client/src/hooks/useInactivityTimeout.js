import { useEffect, useRef } from "react";

const useInactivityTimeout = (logoutAction, navigate, timeout = 1200000) => {
  // timeout de 20 minutos en milisegundos
  const timeoutId = useRef(null);

  useEffect(() => {
    // Función para resetear el temporizador
    const resetTimeout = () => {
      // Limpia el temporizador anterior
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
      // Establece un nuevo temporizador
      timeoutId.current = setTimeout(() => {
        // Si el tiempo se agota, primero ejecuta el logout y luego navega
        console.log("Usuario inactivo, cerrando sesión.");
        logoutAction();
        // Pequeño retraso para asegurar que el logout se complete antes de navegar
        setTimeout(() => {
          navigate("/login", { state: { reason: "inactivity" } });
        }, 0);
      }, timeout);
    };

    // Lista de eventos que consideraremos como "actividad"
    const activityEvents = [
      "mousemove",
      "mousedown",
      "keypress",
      "scroll",
      "touchstart",
    ];

    // Inicia el temporizador cuando el hook se monta
    resetTimeout();

    // Añade los event listeners
    activityEvents.forEach((event) => {
      window.addEventListener(event, resetTimeout);
    });

    // Función de limpieza que se ejecuta cuando el componente se desmonta
    return () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
      // Elimina los event listeners para evitar fugas de memoria
      activityEvents.forEach((event) => {
        window.removeEventListener(event, resetTimeout);
      });
    };
  }, [logoutAction, navigate, timeout]); // Solo depende de las props pasadas al hook

  return null; // Este hook no necesita devolver nada
};

export default useInactivityTimeout;
