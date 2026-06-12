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
  apiKey:            "AIzaSyDA1FxgHPbJQAijuO7NObGaC0-xdokaUdc",
  authDomain:        "homeclean-up-e0b00.firebaseapp.com",
  projectId:         "homeclean-up-e0b00",
  storageBucket:     "homeclean-up-e0b00.firebasestorage.app",
  messagingSenderId: "331515561723",
  appId:             "1:331515561723:web:f6891147e52971554fd25e",
};

/* Código del hogar: TODOS los dispositivos de la familia deben
   usar exactamente el MISMO código para compartir los datos.
   Puedes dejarlo así o poner el que quieras (sin espacios). */
window.CLOUD_DOC_ID = "hogar-familiar";
