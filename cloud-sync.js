/* ============================================================
   SINCRONIZACIÓN EN LA NUBE
   ------------------------------------------------------------
   Guarda automáticamente el estado de la app (perfiles, tareas
   hechas, tareas personalizadas, reparto) en Firebase, para que
   se vea igual desde cualquier dispositivo.

   - Si Firebase NO está configurado (firebase-config.js sin
     rellenar), la app sigue funcionando guardando solo en este
     dispositivo (localStorage). No se rompe nada.
   - No hay que tocar este archivo para usar la app.

   La clave de guardado 'fam_tareas_v1' es la misma que usan
   app.jsx (niños) y admin.jsx (panel de padres).
   ============================================================ */
(function () {
  var KEY = 'fam_tareas_v1';
  var cfg = window.FIREBASE_CONFIG || {};
  var DOC_ID = window.CLOUD_DOC_ID || 'hogar-familiar';

  // ¿Está configurado de verdad? (no quedó con los "PEGA_AQUI...")
  var configured = !!cfg.apiKey && !/PEGA_AQUI|PASTE|XXXX/i.test(cfg.apiKey)
                   && !!cfg.projectId && !/PEGA_AQUI/i.test(cfg.projectId);

  var readyResolved = false;
  var readyCbs = [];
  var lastState = null;     // último estado conocido (string JSON)
  var lastUpdated = 0;      // marca de tiempo del último estado aplicado/escrito
  var applyingRemote = false;
  var writeTimer = null;
  var ref = null;

  function callReady() {
    if (readyResolved) return;
    readyResolved = true;
    readyCbs.forEach(function (cb) { try { cb(); } catch (e) {} });
    readyCbs = [];
  }

  // API pública que usan app.jsx / admin.jsx para montar React
  window.CloudSync = {
    configured: configured,
    mode: configured ? 'nube' : 'local',
    whenReady: function (cb) { if (readyResolved) cb(); else readyCbs.push(cb); }
  };

  // ---- Modo local (sin nube): montar de inmediato ----
  if (!configured || typeof firebase === 'undefined') {
    if (configured && typeof firebase === 'undefined') {
      console.warn('[nube] Firebase no cargó (¿sin internet?). Se usa guardado local.');
    }
    setTimeout(callReady, 0);
    return;
  }

  // Red de seguridad: si la nube tarda demasiado, mostrar la app igual (modo local).
  setTimeout(function () {
    if (!readyResolved) {
      console.warn('[nube] La nube tardó demasiado; se muestra con lo guardado local.');
      callReady();
    }
  }, 8000);

  // ---- Modo nube ----
  try {
    firebase.initializeApp(cfg);
    ref = firebase.firestore().collection('hogares').doc(DOC_ID);
  } catch (e) {
    console.warn('[nube] No se pudo iniciar Firebase, se usa guardado local.', e);
    setTimeout(callReady, 0);
    return;
  }

  // Interceptar el guardado local para subir cambios a la nube
  var rawSet = localStorage.setItem.bind(localStorage);
  localStorage.setItem = function (k, v) {
    rawSet(k, v);
    if (k === KEY && !applyingRemote && v !== lastState) {
      lastState = v;
      schedulePush(v);
    }
  };

  function schedulePush(v) {
    clearTimeout(writeTimer);
    writeTimer = setTimeout(function () {
      var ts = Date.now();
      lastUpdated = ts;   // recordamos la marca de NUESTRA escritura (evita eco/recarga)
      ref.set({ state: v, updated: ts })
         .catch(function (e) { console.warn('[nube] No se pudo guardar:', e); });
    }, 600);
  }

  function applyRemote(stateStr) {
    if (stateStr == null || stateStr === lastState) return; // sin cambios o eco propio
    lastState = stateStr;
    applyingRemote = true;
    rawSet(KEY, stateStr);
    applyingRemote = false;
    // Si la app ya está en pantalla, recargar para mostrar lo nuevo
    if (readyResolved) location.reload();
  }

  // 1) Lectura inicial: traer lo que haya en la nube hacia este dispositivo
  ref.get().then(function (snap) {
    if (snap.exists && snap.data().state) {
      lastState = snap.data().state;
      lastUpdated = snap.data().updated || 0;
      applyingRemote = true;
      rawSet(KEY, lastState);
      applyingRemote = false;
    } else {
      // No hay nada en la nube todavía: subir lo que tengamos local
      var local = localStorage.getItem(KEY);
      if (local) {
        lastState = local;
        lastUpdated = Date.now();
        ref.set({ state: local, updated: lastUpdated }).catch(function () {});
      }
    }
  }).catch(function (e) {
    console.warn('[nube] No se pudo leer al iniciar, se usa lo local.', e);
  }).then(function () {
    callReady();
    // 2) Escuchar cambios en vivo desde otros dispositivos.
    //    Solo aplicamos (y recargamos) si el estado remoto es MÁS NUEVO que el
    //    que ya tenemos. Así evitamos un bucle de recarga cuando el primer
    //    snapshot llega con el valor previo del servidor.
    ref.onSnapshot(function (snap) {
      if (!snap.exists || !snap.data().state) return;
      var up = snap.data().updated || 0;
      if (up <= lastUpdated) return;   // no es más nuevo: ignorar (evita el bucle)
      lastUpdated = up;
      applyRemote(snap.data().state);
    }, function (e) { console.warn('[nube] Error escuchando cambios:', e); });
  });
})();
