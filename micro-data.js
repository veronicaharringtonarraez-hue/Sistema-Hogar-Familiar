/* ============================================================
   SISTEMA INTELIGENTE DE TAREAS — Catálogo por persona y momento
   ------------------------------------------------------------
   Filosofía: las tareas siguen el flujo natural del día. Primero
   se muestra lo que toca AHORA y luego se van abriendo los
   siguientes momentos.

   Dos tipos de tarea:
     • type 'task'  → microtarea de checklist = 1 punto
                      (claim → aprobación del adulto).
     • type 'area'  → un área completa = base 10 puntos, que el
                      adulto califica por ORDEN (0-5) + LIMPIEZA (0-5).
                      Lleva su propia lista de microtareas (guía).

   Cada bloque del PLAN:
     { moment, group, freq, days?, type?, icon?, items? | micro? }
       - moment : id de MOMENTS (orden del día)
       - group  : subtítulo (p. ej. "Autocuidado")
       - freq   : 'diario' | 'semanal'
       - days   : [0..6] (Dom..Sáb) si la tarea es solo ciertos días
       - items  : [ [label, icon], ... ]   (para type 'task')
       - micro  : [ 'microtarea', ... ]     (para type 'area')
   ============================================================ */

/* Valor base de toda tarea/rutina = 10 puntos (el adulto puede ajustarlo
   con + / − al aprobar; sin tope). Las áreas se siguen calificando por
   orden (0-5) + limpieza (0-5). */
window.MICRO_POINTS = 10;

/* ---- Momentos del día (en orden de flujo) ---- */
window.MOMENTS = [
  { id: 'manana',  label: 'Mañana',            icon: '🌅' },
  { id: 'escuela', label: 'Listo para salir',  icon: '🎒' },
  { id: 'tarde',   label: 'Al volver',         icon: '🏠' },
  { id: 'estudio', label: 'Estudio',           icon: '📚' },
  { id: 'familia', label: 'Cuidar a la familia', icon: '👶' },
  { id: 'hogar',   label: 'La casa',           icon: '🧹' },
  { id: 'noche',   label: 'Noche',             icon: '🌙' },
  { id: 'semana',  label: 'Esta semana',       icon: '📅' },
];
window.MOMENT = id => window.MOMENTS.find(m => m.id === id);

/* días: Dom=0 … Sáb=6 */
const DOM_A_JUE = [0, 1, 2, 3, 4];
const DOM_A_MIE = [0, 1, 2, 3];

/* ============================================================
   PLAN por persona
   ============================================================ */
window.PLAN = {

  /* ===================== 👧 TAYLOR (10) ===================== */
  taylor: [
    { moment:'manana', group:'Autocuidado', freq:'diario', items:[
      ['Despertarse','⏰'], ['Tender la cama','🛏️'], ['Cepillarse los dientes','🪥'],
      ['Lavarse la cara','🧼'], ['Peinarse','💇'], ['Aplicar protector solar','🧴'],
      ['Cambiarse al uniforme escolar','👔'], ['Desayunar','🥣'],
      ['Lavar su plato, vaso y cubiertos','🍽️'], ['Preparar botella de agua','💧'],
    ]},
    { moment:'escuela', group:'Preparación para la escuela', freq:'diario', items:[
      ['Revisar horario del día','🗓️'], ['Empacar cuadernos correctos','📓'],
      ['Empacar útiles necesarios','✏️'], ['Preparar merienda','🍎'], ['Preparar mochila','🎒'],
    ]},
    { moment:'tarde', group:'Al volver de la escuela', freq:'diario', items:[
      ['Guardar mochila','🎒'], ['Cambiarse el uniforme','👕'],
      ['Colocar uniforme en su lugar o ropa sucia','🧺'], ['Comer merienda','🍎'],
      ['Lavar sus utensilios','🍽️'],
    ]},
    { moment:'tarde', group:'Si tiene gimnasia', freq:'diario', items:[
      ['Cambiarse al uniforme de gimnasia','🤸'], ['Llevar magnesio','🧴'],
      ['Preparar botella de agua','💧'],
    ]},
    { moment:'estudio', group:'Desarrollo académico', freq:'diario', items:[
      ['Hacer tarea','📝'], ['Estudiar','📚'], ['Avanzar proyectos escolares','📐'],
      ['Leer un libro','📖'], ['Escribir un párrafo','✍️'],
    ]},
    { moment:'hogar', group:'Sala', type:'area', icon:'🛋️', freq:'diario', micro:[
      'Barrer piso','Pasar coleto','Despejar muebles','Limpiar mesa del televisor',
    ]},
    { moment:'hogar', group:'Baño', type:'area', icon:'🚿', freq:'semanal', micro:[
      'Lavar poceta','Lavar lavamanos','Lavar ducha','Limpiar paredes de la ducha','Limpiar piso',
      'Reponer papel higiénico','Sacar basura','Colocar aromatizante','Limpiar mueble bajo el lavamanos',
      'Reponer jabón líquido','Reponer jabón corporal','Reponer shampoo','Reponer acondicionador',
    ]},
    { moment:'hogar', group:'Cuarto', type:'area', icon:'🛏️', freq:'semanal', micro:[
      'Cambiar sábanas','Cambiar fundas de almohadas','Doblar edredón','Guardar zapatos','Colgar ropa',
      'Colocar ropa sucia en cesta','Vaciar deshumidificador','Sacudir alfombras','Barrer piso','Pasar coleto',
    ]},
    { moment:'noche', group:'Preparar para mañana', freq:'semanal', days:DOM_A_JUE, items:[
      ['Preparar uniforme escolar para mañana','👔'],
    ]},
    { moment:'noche', group:'Antes de la gimnasia', freq:'semanal', days:[1,4], items:[
      ['Preparar uniforme de gimnasia','🤸'], ['Verificar que lleva magnesio','🧴'],
    ]},
    { moment:'noche', group:'Antes de dormir', freq:'diario', items:[
      ['Preparar ropa del día siguiente','👕'], ['Preparar mochila','🎒'], ['Dejar zapatos listos','👟'],
      ['Cargar dispositivos electrónicos','🔌'], ['Colocar botella de agua lista','💧'],
      ['Dejar escritorio ordenado','🗂️'], ['Revisar si hay tareas pendientes','✅'],
    ]},
    { moment:'noche', group:'Reinicio de 10 minutos', freq:'diario', items:[
      ['Recoger objetos fuera de lugar','🧺'], ['Tirar basura','🗑️'], ['Acomodar cojines','🛋️'],
      ['Revisar zapatos','👟'], ['Revisar ropa tirada','👕'],
    ]},
    { moment:'semana', group:'Autocuidado semanal', freq:'semanal', items:[
      ['Mascarilla capilar','💆'], ['Mascarilla facial','🧖'],
      ['Cortar uñas de manos','💅'], ['Cortar uñas de pies','🦶'],
    ]},
    { moment:'semana', group:'Habilidades para la vida', freq:'semanal', items:[
      ['Preparar una merienda sencilla','🥪'], ['Doblar su propia ropa','🧺'],
      ['Organizar su mochila sin ayuda','🎒'], ['Revisar que no olvida materiales','📚'],
      ['Ayudar a preparar la mesa','🍽️'], ['Participar en la planificación semanal','🗓️'],
    ]},
  ],

  /* ===================== 👦 EMMETH (7) ===================== */
  emmeth: [
    { moment:'manana', group:'Autocuidado', freq:'diario', items:[
      ['Tender cama','🛏️'], ['Cepillarse dientes','🪥'], ['Lavarse cara','🧼'], ['Peinarse','💇'],
      ['Cambiarse al uniforme','👔'], ['Desayunar','🥣'], ['Lavar plato, vaso y cubiertos','🍽️'],
    ]},
    { moment:'escuela', group:'Escuela', freq:'diario', items:[
      ['Preparar mochila','🎒'], ['Revisar materias','📚'], ['Preparar útiles','✏️'],
    ]},
    { moment:'tarde', group:'Al volver de la escuela', freq:'diario', items:[
      ['Guardar mochila','🎒'], ['Cambiarse de ropa','👕'], ['Guardar uniforme','🧺'],
      ['Merendar','🍎'], ['Lavar utensilios','🍽️'],
    ]},
    { moment:'estudio', group:'Desarrollo académico', freq:'diario', items:[
      ['Hacer tarea','📝'], ['Estudiar','📚'], ['Leer un libro','📖'], ['Escribir un párrafo','✍️'],
    ]},
    { moment:'hogar', group:'Comedor', type:'area', icon:'🍴', freq:'diario', micro:[
      'Llevar platos al fregadero','Lavar platos','Barrer piso','Despejar mesa','Limpiar superficie de mesa',
      'Colocar mantel','Organizar decoraciones','Acomodar sillas','Despejar mesón','Limpiar mesón',
    ]},
    { moment:'hogar', group:'Oficina de los niños', type:'area', icon:'📖', freq:'diario', micro:[
      'Guardar ropa','Guardar zapatos','Despejar escritorios','Barrer piso','Pasar coleto','Colgar ropa',
    ]},
    { moment:'noche', group:'Preparar para mañana', freq:'semanal', days:DOM_A_JUE, items:[
      ['Preparar uniforme escolar','👔'],
    ]},
    { moment:'noche', group:'Antes del fútbol', freq:'semanal', days:[5], items:[
      ['Preparar uniforme de fútbol','⚽'],
    ]},
    { moment:'noche', group:'Antes de dormir', freq:'diario', items:[
      ['Preparar ropa del día siguiente','👕'], ['Preparar mochila','🎒'], ['Dejar zapatos listos','👟'],
      ['Colocar botella de agua lista','💧'], ['Dejar escritorio ordenado','🗂️'],
      ['Revisar si hay tareas pendientes','✅'],
    ]},
    { moment:'noche', group:'Reinicio de 10 minutos', freq:'diario', items:[
      ['Recoger objetos fuera de lugar','🧺'], ['Tirar basura','🗑️'], ['Acomodar cojines','🛋️'],
      ['Revisar zapatos','👟'], ['Revisar ropa tirada','👕'],
    ]},
    { moment:'semana', group:'Habilidades para la vida', freq:'semanal', items:[
      ['Preparar una merienda sencilla','🥪'], ['Doblar su propia ropa','🧺'],
      ['Organizar su mochila sin ayuda','🎒'], ['Ayudar a preparar la mesa','🍽️'],
    ]},
  ],

  /* ===================== 👦 CHRISTOPHER (4) ===================== */
  christopher: [
    { moment:'manana', group:'Autocuidado', freq:'diario', items:[
      ['Cepillarse dientes (mañana)','🪥'], ['Bañarse','🛁'], ['Peinarse','💇'],
      ['Lavarse las manos antes de comer','🧼'],
    ]},
    { moment:'hogar', group:'Organización', freq:'diario', items:[
      ['Guardar juguetes','🧸'], ['Recoger basura del piso','🗑️'], ['Guardar zapatos','👟'],
      ['Colocar objetos donde pertenecen','📦'],
    ]},
    { moment:'hogar', group:'Cochera', type:'area', icon:'🚗', freq:'semanal', micro:[
      'Recoger basura','Barrer piso','Guardar zapatos','Despejar área','Guardar ropa u objetos fuera de lugar',
    ]},
    { moment:'familia', group:'Servicio (con ayuda)', freq:'diario', items:[
      ['Llevar un objeto a su lugar','📦'], ['Ayudar a recoger','🤝'], ['Llevar sus platos al fregadero','🍽️'],
    ]},
    { moment:'noche', group:'Autocuidado', freq:'diario', items:[
      ['Cepillarse dientes (noche)','🪥'], ['Lavarse las manos después del baño','🧼'],
    ]},
  ],

  /* ===================== 👨 MAYKOL ===================== */
  papa: [
    { moment:'hogar', group:'Cocina', freq:'diario', items:[
      ['Descongelar carne','🥩'], ['Preparar alimentos','🔪'], ['Cocinar','🍳'], ['Servir comida','🍽️'],
      ['Limpiar encimeras','🧽'], ['Limpiar cocina después de cocinar','🧼'], ['Dejar fregadero despejado','🚰'],
    ]},
    { moment:'hogar', group:'Lavandería', freq:'diario', items:[
      ['Separar ropa blanca','⚪'], ['Separar ropa de color','🌈'], ['Cargar lavadora','🧺'],
      ['Pasar ropa a secadora','🌀'], ['Llevar ropa limpia a la sala para doblar','🛋️'],
    ]},
    { moment:'manana', group:'Bienestar', freq:'diario', items:[
      ['Hacer ejercicio (1 hora)','💪'],
    ]},
    { moment:'semana', group:'Bienestar', freq:'semanal', items:[
      ['Cortar uñas','💅'],
    ]},
  ],

  /* ===================== 👩 VERÓNICA ===================== */
  mama: [
    { moment:'familia', group:'Cuidado de Rachel', freq:'diario', items:[
      ['Dar pecho','🤱'], ['Alimentar a Rachel','🍼'], ['Cambiar pañales','🧷'],
      ['Supervisar siestas','😴'], ['Supervisar higiene','🧼'],
    ]},
    { moment:'familia', group:'Alimentación infantil', freq:'diario', items:[
      ['Dar desayuno a Emmeth','🥣'], ['Dar almuerzo a Emmeth','🍲'], ['Dar cena a Emmeth','🍽️'],
      ['Dar desayuno a Christopher','🥣'], ['Dar almuerzo a Christopher','🍲'], ['Dar cena a Christopher','🍽️'],
    ]},
    { moment:'manana', group:'Autocuidado (mañana)', freq:'diario', items:[
      ['Cepillarse dientes','🪥'], ['Bañarse','🛁'], ['Skincare mañana','🧴'],
      ['Protector solar','☀️'], ['Peinarse','💇'],
    ]},
    { moment:'manana', group:'Bienestar', freq:'diario', items:[
      ['Hacer ejercicio (1 hora)','💪'],
    ]},
    { moment:'hogar', group:'Lavandería', freq:'diario', items:[
      ['Doblar ropa','🧺'], ['Guardar ropa doblada','🗄️'],
    ]},
    { moment:'hogar', group:'Cuarto principal', type:'area', icon:'🛏️', freq:'semanal', micro:[
      'Cambiar sábanas','Despejar habitación','Barrer','Pasar coleto','Limpiar mueble del televisor',
    ]},
    { moment:'hogar', group:'Baño principal', type:'area', icon:'🚿', freq:'semanal', micro:[
      'Limpieza profunda del baño','Lavar poceta','Lavar lavamanos','Lavar ducha','Limpiar espejo',
      'Barrer','Trapear','Vaciar papelera',
    ]},
    { moment:'semana', group:'Closet', freq:'semanal', items:[
      ['Ordenar ropa','👗'], ['Identificar ropa pequeña','📏'], ['Identificar ropa dañada','🧵'],
      ['Identificar ropa que no se usa','📦'], ['Separar para donar','🎁'], ['Separar para desechar','🗑️'],
    ]},
    { moment:'noche', group:'Autocuidado (noche)', freq:'diario', items:[
      ['Cepillarse dientes','🪥'], ['Skincare noche','🌙'],
    ]},
    { moment:'semana', group:'Autocuidado semanal', freq:'semanal', items:[
      ['Mascarilla capilar','💆'], ['Mascarilla facial','🧖'], ['Plancharse el cabello','💇'],
      ['Cortar uñas manos','💅'], ['Cortar uñas pies','🦶'],
    ]},
    { moment:'semana', group:'Afeitado', freq:'semanal', days:[6], items:[
      ['Afeitar piernas','🪒'],
    ]},
  ],

  /* ===================== 👶 RACHEL (1) — la cuidan los padres ===================== */
  rachel: [
    { moment:'familia', group:'Rutina del bebé', freq:'diario', items:[
      ['Lactancia','🤱'], ['Alimentación complementaria','🥄'], ['Cambio de pañal','🧷'],
      ['Cambio de ropa','👶'], ['Baño','🛁'], ['Cepillado de cabello','💇'],
      ['Limpieza de manos y cara','🧼'], ['Siestas','😴'],
    ]},
  ],
};

/* ============================================================
   Aplanado: lista de tareas con id único por persona
   ============================================================ */
window.ROUTINES = (function () {
  const out = [];
  Object.keys(window.PLAN).forEach(pid => {
    let n = 0;
    (window.PLAN[pid] || []).forEach(blk => {
      const base = {
        pid, moment: blk.moment, group: blk.group,
        freq: blk.freq || 'diario', days: blk.days || null,
      };
      if (blk.type === 'area') {
        out.push(Object.assign({}, base, {
          id: pid + '-' + (n++), type: 'area',
          label: blk.group, icon: blk.icon || '🧹',
          micro: (blk.micro || []).slice(), pts: 10,
        }));
      } else {
        (blk.items || []).forEach(it => {
          out.push(Object.assign({}, base, {
            id: pid + '-' + (n++), type: 'task',
            label: it[0], icon: it[1] || '•', pts: 10,
          }));
        });
      }
    });
  });
  return out;
})();
window.ROUTINE = id => window.ROUTINES.find(t => t.id === id);

/* tareas de una persona */
window.routinesFor = pid => window.ROUTINES.filter(t => t.pid === pid);

/* ¿la tarea aplica hoy?  (para el flujo del día)
   - days definido  → solo esos días de la semana
   - moment 'semana'→ siempre visible (bolsa semanal)
   - resto          → siempre visible */
window.appliesToday = (t, d = new Date()) => {
  if (t.days && t.days.length) return t.days.includes(d.getDay());
  return true;
};

/* ============================================================
   Modelo de puntos + inspección
   marks[pid + ':' + id]:
     • tarea: { s:'claim'|'ok', pts? }       → pts (o 10 base) si 'ok'
     • área : { s:'claim'|'ok', o, c }       → o+c puntos si 'ok'
   ============================================================ */
window.MAX_ORDER = 5;
window.MAX_CLEAN = 5;
window.microMarkState = m => !m ? 'todo' : (m.s === 'ok' ? 'ok' : 'claim');

/* puntos de una tarea según su tipo y su marca:
   - área   → orden + limpieza (0-5 / 0-5)
   - rutina → el valor ajustado por el adulto (m.pts) o 10 base */
window.routinePoints = (t, m) => {
  if (!m || m.s !== 'ok') return 0;
  if (t && t.type === 'area') return (m.o || 0) + (m.c || 0);
  return (typeof m.pts === 'number') ? m.pts : window.MICRO_POINTS;
};
/* compat */
window.microMarkPoints = m => {
  if (!m || m.s !== 'ok') return 0;
  return (typeof m.pts === 'number') ? m.pts : window.MICRO_POINTS;
};

/* ---- Bonos: ayudas espontáneas (puntos extra) ---- */
window.MICRO_BONUSES = [
  { id: 'hermano',    label: 'Ayudar a un hermano',                      icon: '🤝', pts: 20 },
  { id: 'derrame',    label: 'Limpiar un derrame sin que se lo pidan',   icon: '🧽', pts: 20 },
  { id: 'insumo',     label: 'Reponer un insumo',                        icon: '🧴', pts: 10 },
  { id: 'mantenim',   label: 'Detectar un problema de mantenimiento',    icon: '🔧', pts: 20 },
  { id: 'basura',     label: 'Recoger basura de otra área',              icon: '🗑️', pts: 10 },
  { id: 'orden',      label: 'Ordenar algo que estaba fuera de lugar',   icon: '✨', pts: 10 },
  { id: 'iniciativa', label: 'Hacer una tarea sin que se la pidan',      icon: '🌟', pts: 30 },
  { id: 'dia',        label: 'Completar todas sus tareas del día',       icon: '🏅', pts: 50 },
];
window.MICRO_BONUS = id => window.MICRO_BONUSES.find(b => b.id === id);
