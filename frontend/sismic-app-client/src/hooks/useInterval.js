// src/hooks/useInterval.js

import { useEffect, useRef } from 'react';

function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Guarda la última versión del callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Configura el intervalo.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

export default useInterval;