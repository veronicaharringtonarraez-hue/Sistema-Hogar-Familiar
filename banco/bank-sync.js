/* ============================================================
   SINCRONIZACIÓN EN LA NUBE — BANCO
   ------------------------------------------------------------
   Guarda el estado del banco (saldos, ahorros, registro, metas,
   puntos abonados) en Firebase para que se vea igual desde
   cualquier dispositivo de la familia.

   Es el mismo patrón que cloud-sync.js (módulo de tareas), pero:
     - usa la clave 'bancoCrece.v1' (el store del banco), y
     - guarda en un documento APARTE ("…-banco") para no chocar
       con los datos de tareas.

   Si Firebase no está configurado o no carga, el banco sigue
   funcionando guardando solo en este dispositivo (localStorage).
   ============================================================ */
(function () {
  var KEY = 'bancoCrece.v1';
  var cfg = window.FIREBASE_CONFIG || {};
  var DOC_ID = (window.CLOUD_DOC_ID || 'hogar-familiar') + '-banco';

  var configured = !!cfg.apiKey && !/PEGA_AQUI|PASTE|XXXX/i.test(cfg.apiKey)
                   && !!cfg.projectId && !/PEGA_AQUI/i.test(cfg.projectId);

  var readyResolved = false;
  var readyCbs = [];
  var lastState = null;
  var lastUpdated = 0;
  var applyingRemote = false;
  var writeTimer = null;
  var ref = null;

  function callReady() {
    if (readyResolved) return;
    readyResolved = true;
    readyCbs.forEach(function (cb) { try { cb(); } catch (e) {} });
    readyCbs = [];
  }

  window.BankSync = {
    configured: configured,
    mode: configured ? 'nube' : 'local',
    whenReady: function (cb) { if (readyResolved) cb(); else readyCbs.push(cb); }
  };

  // ---- Modo local (sin nube): montar de inmediato ----
  if (!configured || typeof firebase === 'undefined') {
    if (configured && typeof firebase === 'undefined') {
      console.warn('[banco/nube] Firebase no cargó (¿sin internet?). Se usa guardado local.');
    }
    setTimeout(callReady, 0);
    return;
  }

  // Red de seguridad: si la nube tarda demasiado, mostrar el banco igual.
  setTimeout(function () {
    if (!readyResolved) {
      console.warn('[banco/nube] La nube tardó demasiado; se muestra con lo guardado local.');
      callReady();
    }
  }, 8000);

  // ---- Modo nube ----
  try {
    if (!firebase.apps || !firebase.apps.length) firebase.initializeApp(cfg);
    ref = firebase.firestore().collection('hogares').doc(DOC_ID);
  } catch (e) {
    console.warn('[banco/nube] No se pudo iniciar Firebase, se usa guardado local.', e);
    setTimeout(callReady, 0);
    return;
  }

  // Interceptar el guardado local para subir cambios del banco a la nube
  var prevSet = localStorage.setItem.bind(localStorage);
  localStorage.setItem = function (k, v) {
    prevSet(k, v);
    if (k === KEY && !applyingRemote && v !== lastState) {
      lastState = v;
      schedulePush(v);
    }
  };

  function schedulePush(v) {
    clearTimeout(writeTimer);
    writeTimer = setTimeout(function () {
      var ts = Date.now();
      lastUpdated = ts;
      ref.set({ state: v, updated: ts })
         .catch(function (e) { console.warn('[banco/nube] No se pudo guardar:', e); });
    }, 600);
  }

  function applyRemote(stateStr) {
    if (stateStr == null || stateStr === lastState) return;
    lastState = stateStr;
    applyingRemote = true;
    prevSet(KEY, stateStr);
    applyingRemote = false;
    if (readyResolved) location.reload();
  }

  // 1) Lectura inicial: traer lo que haya en la nube hacia este dispositivo
  ref.get().then(function (snap) {
    if (snap.exists && snap.data().state) {
      lastState = snap.data().state;
      lastUpdated = snap.data().updated || 0;
      applyingRemote = true;
      prevSet(KEY, lastState);
      applyingRemote = false;
    } else {
      var local = localStorage.getItem(KEY);
      if (local) {
        lastState = local;
        lastUpdated = Date.now();
        ref.set({ state: local, updated: lastUpdated }).catch(function () {});
      }
    }
  }).catch(function (e) {
    console.warn('[banco/nube] No se pudo leer al iniciar, se usa lo local.', e);
  }).then(function () {
    callReady();
    // 2) Escuchar cambios en vivo de otros dispositivos.
    ref.onSnapshot(function (snap) {
      if (!snap.exists || !snap.data().state) return;
      var up = snap.data().updated || 0;
      if (up <= lastUpdated) return;
      lastUpdated = up;
      applyRemote(snap.data().state);
    }, function (e) { console.warn('[banco/nube] Error escuchando cambios:', e); });
  });
})();
