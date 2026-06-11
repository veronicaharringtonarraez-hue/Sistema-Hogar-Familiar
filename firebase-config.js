/* ============================================================
   CONFIGURACIÓN DE LA NUBE  (Firebase)
   ------------------------------------------------------------
   Aquí pegas los datos de TU proyecto de Firebase para que los
   cambios se guarden en la nube y se vean desde cualquier
   dispositivo (teléfono, tablet, computadora).

   👉 Paso a paso en el archivo GUIA-NUBE.md

   Mientras estos valores digan "PEGA_AQUI...", la aplicación
   funciona igual pero guardando SOLO en este dispositivo.
   ============================================================ */

window.FIREBASE_CONFIG = {
  apiKey:            "PEGA_AQUI_TU_API_KEY",
  authDomain:        "PEGA_AQUI.firebaseapp.com",
  projectId:         "PEGA_AQUI",
  storageBucket:     "PEGA_AQUI.appspot.com",
  messagingSenderId: "PEGA_AQUI",
  appId:             "PEGA_AQUI",
};

/* Código del hogar: TODOS los dispositivos de la familia deben
   usar exactamente el MISMO código para compartir los datos.
   Puedes dejarlo así o poner el que quieras (sin espacios). */
window.CLOUD_DOC_ID = "hogar-familiar";
