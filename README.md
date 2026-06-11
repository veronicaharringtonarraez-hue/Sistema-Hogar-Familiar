# Sistema-Hogar-Familiar

Gestión de limpieza, organización, responsabilidades, sistema de puntos y control de calidad del hogar.

App web familiar (sin instalación) con dos pantallas:

- **`index.html`** — App de los niños: tareas, puntos, mascotas y recompensas.
- **`Panel Padres.html`** — Panel de los papás: administrar tareas, reparto de la casa y recompensas.

## Cómo se guardan los cambios

Todo se guarda **automáticamente**. Puedes usar la app de dos maneras:

- **Local** (por defecto): guarda en el navegador del dispositivo.
- **Nube** (recomendado): los cambios se ven desde cualquier teléfono, tablet o
  computadora. Se activa configurando `firebase-config.js`.

👉 **Guía paso a paso (publicar y activar la nube): [`GUIA-NUBE.md`](GUIA-NUBE.md)**

## Archivos principales

| Archivo | Para qué sirve |
|---------|----------------|
| `index.html` / `app.jsx` | App de los niños |
| `Panel Padres.html` / `admin.jsx` | Panel de los papás |
| `data.js` | Datos de la familia (nombres, mascotas, tareas, recompensas) — **editable** |
| `firebase-config.js` | Configuración de la nube (rellenar para sincronizar) |
| `cloud-sync.js` | Lógica de sincronización (no hace falta tocarlo) |
| `assets/` | Imágenes de las mascotas |
