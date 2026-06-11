# 🏠 Guía: editar, guardar y sincronizar en la nube

Esta app es **100% web** (no necesita instalar nada). Tiene dos pantallas:

- **`index.html`** → la app de los niños (tareas, puntos, mascotas)
- **`Panel Padres.html`** → el panel de los papás (administrar tareas, reparto, recompensas)

Los cambios se guardan **automáticamente**. Tienes dos formas de usarla:

| Modo | Qué necesitas | Se ve desde… |
|------|----------------|--------------|
| **Local** (por defecto) | Nada | Solo el mismo navegador/dispositivo |
| **Nube** ✅ (lo que pediste) | Configurar Firebase (gratis, 10 min) | Cualquier teléfono, tablet o computadora |

---

## Parte 1 · Publicar la app en internet (GitHub Pages)

Para que puedas abrirla desde cualquier dispositivo con un enlace:

1. Entra a tu repositorio en GitHub.
2. **Settings** (Configuración) → menú izquierdo **Pages**.
3. En **Source** elige **Deploy from a branch**.
4. En **Branch** elige `main` y carpeta `/ (root)`. Pulsa **Save**.
5. Espera 1–2 minutos. Aparecerá un enlace como:
   `https://veronicaharringtonarraez-hue.github.io/sistema-hogar-familiar/`
6. La app de los niños es ese enlace. El panel de papás es ese enlace + `/Panel%20Padres.html`.

> 💡 Guarda esos enlaces en la pantalla de inicio del teléfono para abrirlos como si fueran una app.

---

## Parte 2 · Activar la nube (para ver los cambios en todos los dispositivos)

Sin este paso, cada dispositivo guarda por su cuenta. Con este paso, **toda la familia ve lo mismo**.

### 2.1 Crear el proyecto de Firebase (gratis)

1. Entra a **https://console.firebase.google.com** con tu cuenta de Google.
2. Pulsa **Agregar proyecto** → ponle un nombre (ej. `hogar-familiar`) → continuar.
   (Puedes desactivar Google Analytics, no hace falta.)
3. Cuando termine, pulsa **Continuar**.

### 2.2 Crear la base de datos

1. En el menú izquierdo: **Compilación → Firestore Database**.
2. Pulsa **Crear base de datos**.
3. Elige una ubicación y pulsa **Siguiente**.
4. Selecciona **Iniciar en modo de prueba** → **Habilitar**.
5. (Recomendado) En la pestaña **Reglas**, pega esto y pulsa **Publicar** para que
   solo se pueda leer/escribir el documento de tu hogar:

   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /hogares/{hogar} {
         allow read, write: if true;
       }
     }
   }
   ```

### 2.3 Obtener la configuración (apiKey, etc.)

1. Arriba a la izquierda, pulsa el ⚙️ → **Configuración del proyecto**.
2. Baja hasta **Tus apps** y pulsa el icono **`</>`** (Web).
3. Ponle un apodo (ej. `app-hogar`) → **Registrar app**.
4. Te mostrará un bloque de código `const firebaseConfig = { ... }`. Copia esos valores.

### 2.4 Pegar la configuración en la app

Abre el archivo **`firebase-config.js`** y reemplaza los `"PEGA_AQUI..."` con tus valores:

```js
window.FIREBASE_CONFIG = {
  apiKey:            "AIza...",                         // el tuyo
  authDomain:        "hogar-familiar.firebaseapp.com",  // el tuyo
  projectId:         "hogar-familiar",                  // el tuyo
  storageBucket:     "hogar-familiar.appspot.com",      // el tuyo
  messagingSenderId: "1234567890",                      // el tuyo
  appId:             "1:1234...:web:abc...",            // el tuyo
};

window.CLOUD_DOC_ID = "hogar-familiar"; // déjalo igual en TODOS los dispositivos
```

Guarda el archivo y súbelo a GitHub. ¡Listo! A partir de ahí:

- Lo que cambies en un teléfono aparece en los demás.
- Si no hay internet, sigue funcionando y se sincroniza cuando vuelva.

> Para saber si está en modo nube, abre la consola del navegador (F12): si algo
> falla con Firebase verás un aviso, pero la app **nunca se rompe** — cae a modo local.

---

## ¿Cómo edito los datos de la familia?

- **Cosas del día a día** (marcar tareas hechas, agregar tareas nuevas, cambiar el
  reparto): se hacen **dentro de la app y el panel** con botones. Se guardan solas.
- **Cosas de fondo** (nombres, edades, colores, mascotas, recompensas, niveles):
  se editan en el archivo **`data.js`** (está todo comentado en español) y se sube a GitHub.

> ⚠️ Las **tareas marcadas como hechas se reinician cada semana** a propósito
> (para empezar la semana limpia). Las tareas que creas y la configuración **no** se borran.
