/* ============================================================
   DATOS DE LA FAMILIA — Tabla de Tareas Familiares
   Todo editable: nombres de mascotas, colores, áreas, etc.
   ============================================================ */

/* ---- PIN del Panel de Padres ----
   Para entrar al Panel de Padres desde la app de los niños se pide este PIN.
   Cámbialo por el número que quieras (puede ser de 4 o más dígitos).        */
window.PARENT_PIN = '0904';

/* ---- PERFILES ---- */
window.FAMILY = [
  {
    id: 'mama', name: 'Verónica', short: 'Vero', age: null, role: 'adulto', title: 'Directora Estratégica',
    note: 'Trabaja desde casa · horario flexible',
    colors: { a: '#7C5CFF', b: '#B69DFF', c: '#E9E2FF', ink: '#3A2D7A' },
    emoji: '💜', isKid: false, caresBaby: true,
    pet: { name: 'Luna', species: 'Búho', img: window.IMG.mama, emoji: '🦉' }, petCared: false,
  },
  {
    id: 'papa', name: 'Papá', short: 'Papá', age: null, role: 'adulto', title: 'Director de Mantenimiento',
    note: 'Trabaja 5am–2pm · oficina 2 días/semana', realName: 'Maykol',
    colors: { a: '#1FB6A6', b: '#5FD3C6', c: '#D7F4F0', ink: '#0C5A52' },
    emoji: '💚', isKid: false, caresBaby: true,
    pet: { name: 'Brutus', species: 'Bulldog inglés', img: window.IMG.papa, emoji: '🐶' }, petCared: false,
  },
  {
    id: 'taylor', name: 'Taylor', short: 'Taylor', age: 10, role: 'hija', title: 'Guardiana del Orden',
    note: 'Sakura · anime · gimnasia artística',
    tree: '🌸', treeName: 'Sakura',
    colors: { a: '#42BDEE', b: '#B98FE8', c: '#FBC4DA', ink: '#5A3E7A' },
    palette: ['#42BDEE', '#B98FE8', '#FBC4DA'],
    emoji: '🌸', isKid: true, caresBaby: true, petCared: true,
    pet: { name: 'Mochi', species: 'Perrito mini toy', img: window.IMG.taylor },
    quota: 3,
  },
  {
    id: 'emmeth', name: 'Emmeth', short: 'Emmeth', age: 7, role: 'hijo', title: 'Guardián de los Zapatos',
    note: 'Pino · dinosaurios · Pokémon',
    tree: '🌲', treeName: 'Pino',
    colors: { a: '#2962FF', b: '#E53935', c: '#E2E9FF', ink: '#11235A' },
    palette: ['#2962FF', '#E53935', '#111111'],
    emoji: '⚡', isKid: true, caresBaby: true, petCared: true,
    pet: { name: 'Rayo', species: 'Gato gris', img: window.IMG.emmeth },
    quota: 2,
  },
  {
    id: 'christopher', name: 'Christopher', short: 'Chris', age: 4, role: 'hijo', title: 'Guardián de los Juguetes',
    note: 'Araguaney · Octonautas · los Kratts',
    tree: '🌳', treeName: 'Araguaney',
    colors: { a: '#F5B500', b: '#5CB85C', c: '#E8D5A8', ink: '#6B5410' },
    palette: ['#FFC107', '#5CB85C', '#E8D5A8'],
    emoji: '🌻', isKid: true, caresBaby: false, petCared: true,
    pet: { name: 'Oreo', species: 'Gato blanco y negro', img: window.IMG.christopher },
    quota: 1,
  },
  {
    id: 'rachel', name: 'Rachel', short: 'Rachel', age: 1, role: 'bebé', title: 'Jefa de Ternura',
    note: 'Arce japonés · flor morada',
    tree: '🍁', treeName: 'Arce japonés',
    colors: { a: '#F48FB1', b: '#CE93D8', c: '#F8E7F3', ink: '#7A4A6A' },
    palette: ['#F48FB1', '#CE93D8', '#F3E5F5'],
    emoji: '🌷', isKid: false, isBaby: true, caresBaby: false, petCared: true,
    pet: { name: 'Nube', species: 'Gato blanco peludo', img: window.IMG.rachel },
    quota: 0,
  },
];

window.PERSON = id => window.FAMILY.find(p => p.id === id);

/* ---- ÁREAS / TAREAS DE LA CASA ----
   freq: 'diario' | 'semanal'
   day:  para semanales — 0=Dom..6=Sáb (día sugerido)
   Cada tarea bien hecha = 10 puntos.
*/
window.TASKS = [
  // Cocina y comida
  { id: 'cocinar',     label: 'Cocinar',            area: 'Cocina',          icon: '🍳', freq: 'diario',  cat: 'cocina' },
  { id: 'platos',      label: 'Lavar los platos',   area: 'Cocina',          icon: '🍽️', freq: 'diario',  cat: 'cocina' },
  { id: 'cocina1',     label: 'Limpiar Cocina 1',   area: 'Cocina 1',        icon: '🧼', freq: 'diario',  cat: 'cocina' },
  { id: 'cocina2',     label: 'Limpiar Cocina 2',   area: 'Cocina 2',        icon: '🧼', freq: 'semanal', day: 3, cat: 'cocina' },
  // Salas / comedor
  { id: 'sala1',       label: 'Limpiar Sala 1',     area: 'Sala 1',          icon: '🛋️', freq: 'diario',  cat: 'social' },
  { id: 'sala2',       label: 'Limpiar Sala 2',     area: 'Sala 2',          icon: '🛋️', freq: 'semanal', day: 4, cat: 'social' },
  { id: 'comedor',     label: 'Limpiar el comedor', area: 'Comedor',         icon: '🍴', freq: 'diario',  cat: 'social' },
  // Oficinas
  { id: 'oficina1',    label: 'Limpiar Oficina 1',  area: 'Oficina 1',       icon: '💻', freq: 'semanal', day: 1, cat: 'oficina' },
  { id: 'oficina2',    label: 'Limpiar Oficina 2',  area: 'Oficina 2',       icon: '💻', freq: 'semanal', day: 2, cat: 'oficina' },
  // Cuartos
  { id: 'cuartopral',  label: 'Cuarto principal',   area: 'Cuarto principal',icon: '🛏️', freq: 'semanal', day: 1, cat: 'cuarto' },
  { id: 'cuartonin',   label: 'Cuarto de los niños',area: 'Cuarto niños',    icon: '🧸', freq: 'diario',  cat: 'cuarto' },
  { id: 'juguetes',    label: 'Recoger los juguetes',area: 'Sala / cuarto',  icon: '🧩', freq: 'diario',  cat: 'cuarto' },
  // Baños
  { id: 'bano1',       label: 'Baño común',         area: 'Baño 1',          icon: '🚿', freq: 'diario',  cat: 'bano' },
  { id: 'bano2',       label: 'Baño 2',             area: 'Baño 2',          icon: '🚿', freq: 'semanal', day: 5, cat: 'bano' },
  // Closets
  { id: 'closet1',     label: 'Closet 1',           area: 'Closet 1',        icon: '👕', freq: 'semanal', day: 6, cat: 'orden' },
  { id: 'closet2',     label: 'Closet 2',           area: 'Closet 2',        icon: '👕', freq: 'semanal', day: 6, cat: 'orden' },
  // Exteriores / servicio
  { id: 'cochera',     label: 'La cochera',         area: 'Cochera',         icon: '🚗', freq: 'semanal', day: 6, cat: 'exterior' },
  { id: 'pilas',       label: 'Cuarto de pilas',    area: 'Cuarto de pilas', icon: '🧺', freq: 'semanal', day: 3, cat: 'exterior' },
  { id: 'patio',       label: 'Patio de atrás',     area: 'Patio',           icon: '🌿', freq: 'semanal', day: 5, cat: 'exterior' },
  // ---- Frecuencias más espaciadas (sistema sostenible) ----
  { id: 'mercado',     label: 'Mercado grande',     area: 'Compras',         icon: '🛒', freq: 'quincenal', cat: 'compras' },
  { id: 'nevera',      label: 'Organizar la nevera',area: 'Cocina',          icon: '🧊', freq: 'quincenal', cat: 'cocina' },
  { id: 'estantes',    label: 'Estantes de comida', area: 'Despensa',        icon: '🥫', freq: 'quincenal', cat: 'cocina' },
  { id: 'alfombras',   label: 'Lavar las alfombras',area: 'Casa',            icon: '🧶', freq: 'quincenal', cat: 'social' },
  { id: 'profunda',    label: 'Limpieza profunda por zonas', area: 'Casa',   icon: '🧽', freq: 'mensual', cat: 'mantenimiento' },
  { id: 'revzapatos',  label: 'Revisión de zapatos',area: 'Entrada',         icon: '👟', freq: 'mensual', cat: 'orden' },
  { id: 'depurar',     label: 'Depuración de objetos', area: 'Casa',         icon: '📦', freq: 'mensual', cat: 'orden' },
  { id: 'reponer',     label: 'Reposición de productos', area: 'Despensa',   icon: '🧴', freq: 'mensual', cat: 'compras' },
  { id: 'bombillos',   label: 'Revisar bombillos',  area: 'Casa',            icon: '💡', freq: 'trimestral', cat: 'mantenimiento' },
  { id: 'humedad',     label: 'Revisar la humedad', area: 'Casa',            icon: '💧', freq: 'trimestral', cat: 'mantenimiento' },
  { id: 'donaciones',  label: 'Donaciones',         area: 'Casa',            icon: '🎁', freq: 'trimestral', cat: 'orden' },
  { id: 'plagas',      label: 'Revisar plagas',     area: 'Cocina / lavandería', icon: '🪳', freq: 'semanal', day: 6, cat: 'mantenimiento' },
  { id: 'docs',        label: 'Organización documental', area: 'Oficina',    icon: '🗂️', freq: 'anual', cat: 'oficina' },
  { id: 'electro',     label: 'Revisar electrodomésticos', area: 'Casa',     icon: '🔌', freq: 'anual', cat: 'mantenimiento' },
  // ---- Sistema de guardianes (solo en "Plan por zonas") ----
  { id: 'z_basura',    label: 'Sacar basura y reciclaje', area: 'Exteriores',icon: '🗑️', freq: 'diario', cat: 'exterior' },
  { id: 'z_barrido',   label: 'Barrido rápido nocturno', area: 'Casa',       icon: '🧹', freq: 'diario', cat: 'social' },
  { id: 'z_entrada',   label: 'Entrada japonesa (zapatos)', area: 'Entrada', icon: '🚪', freq: 'diario', cat: 'orden' },
  { id: 'z_zapatos',   label: 'Zapatera familiar',  area: 'Entrada',         icon: '👟', freq: 'diario', cat: 'orden' },
  { id: 'z_mochilas',  label: 'Mochilas en su lugar', area: 'Entrada',       icon: '🎒', freq: 'diario', cat: 'orden' },
  { id: 'z_piso',      label: 'Recoger objetos del piso', area: 'Casa',      icon: '🧺', freq: 'diario', cat: 'orden' },
  { id: 'z_estudio',   label: 'Zona de estudio',    area: 'Oficina niños',   icon: '📖', freq: 'diario', cat: 'oficina' },
  { id: 'z_biblioteca',label: 'Biblioteca infantil',area: 'Oficina niños',   icon: '📚', freq: 'semanal', day: 3, cat: 'oficina' },
  { id: 'z_lavanderia',label: 'Apoyo en lavandería',area: 'Lavandería',      icon: '🧺', freq: 'semanal', day: 2, cat: 'orden' },
  { id: 'z_juguetes',  label: 'Guardar los juguetes', area: 'Sala',          icon: '🧩', freq: 'diario', cat: 'cuarto' },
  { id: 'z_cesta',     label: 'Llevar la ropa a la cesta', area: 'Casa',     icon: '🧦', freq: 'diario', cat: 'orden' },
  { id: 'z_cocina',    label: 'Cocina organizada',  area: 'Cocina',          icon: '🍳', freq: 'diario', cat: 'cocina' },
  { id: 'z_despensa',  label: 'Revisar la despensa',area: 'Despensa',        icon: '🥫', freq: 'semanal', day: 4, cat: 'cocina' },
  { id: 'z_super',     label: 'Supervisar los sistemas', area: 'Casa',       icon: '📋', freq: 'diario', cat: 'gestion' },
  { id: 'z_plan',      label: 'Planificación semanal', area: 'Casa',         icon: '🗓️', freq: 'semanal', day: 0, cat: 'gestion' },
];

window.TASK = id => window.TASKS.find(t => t.id === id);

/* ---- TAREAS PERSONALES (rutinas, no áreas de la casa) ----
   Se suman SIEMPRE, sin importar la distribución. Cada una = 10 pts.
*/
window.PERSONAL_DEFS = [
  // escuela (Taylor y Emmeth)
  { id: 'bolso',     label: 'Alistar el bolso',        icon: '🎒', freq: 'diario', cat: 'escuela' },
  { id: 'uniforme',  label: 'Alistar el uniforme',     icon: '👔', freq: 'diario', cat: 'escuela' },
  { id: 'tarea',     label: 'Hacer la tarea',          icon: '📚', freq: 'diario', cat: 'escuela' },
  // rutina de la bebé (Rachel)
  { id: 'panal',     label: 'Cambio de pañal',         icon: '🧷', freq: 'diario', cat: 'bebe' },
  { id: 'desayuno',  label: 'Desayuno',                icon: '🥣', freq: 'diario', cat: 'bebe' },
  { id: 'merienda1', label: 'Merienda de la mañana',   icon: '🍎', freq: 'diario', cat: 'bebe' },
  { id: 'almuerzo',  label: 'Almuerzo',                icon: '🍲', freq: 'diario', cat: 'bebe' },
  { id: 'merienda2', label: 'Merienda de la tarde',    icon: '🍓', freq: 'diario', cat: 'bebe' },
  { id: 'cena',      label: 'Cena',                    icon: '🍽️', freq: 'diario', cat: 'bebe' },
  { id: 'ducha',     label: 'La ducha',                icon: '🛁', freq: 'diario', cat: 'bebe' },
  // domingo para todos
  { id: 'iglesia',   label: 'Ordenar la ropa para la iglesia', icon: '⛪', freq: 'semanal', day: 0, cat: 'orden' },
];
window.PDEF = id => (window.PERSONAL_DEFS || []).find(t => t.id === id);

/* Qué tareas personales tiene cada quien (aplica en ambas distribuciones) */
window.PERSONAL = {
  mama:        ['iglesia'],
  papa:        ['iglesia'],
  taylor:      ['bolso', 'uniforme', 'tarea', 'iglesia'],
  emmeth:      ['bolso', 'uniforme', 'tarea', 'iglesia'],
  christopher: ['iglesia'],
  rachel:      ['panal', 'desayuno', 'merienda1', 'almuerzo', 'merienda2', 'cena', 'ducha', 'iglesia'],
};

/* ---- DISTRIBUCIONES ----
   Cada distribución asigna cada tarea a una persona (o lista, para compartidas).
*/
window.DISTRIBUTIONS = {
  actual: {
    label: 'Cómo está hoy',
    sub: 'El reparto actual de la casa',
    assign: {
      taylor:      ['sala1', 'cuartonin', 'bano1'],
      emmeth:      ['oficina1', 'comedor'],
      christopher: [],
      papa:        ['cocinar', 'platos'],
      mama:        ['cocina1', 'cocina2', 'oficina2', 'sala2', 'cuartopral',
                    'bano2', 'closet1', 'closet2', 'cochera', 'pilas', 'patio'],
      bebeTurnos:  ['mama'],
    },
  },
  equitativo: {
    label: 'Propuesta equitativa',
    sub: 'Repartida por edad y capacidad de cada quien',
    assign: {
      taylor:      ['sala1', 'cuartonin', 'bano1'],
      emmeth:      ['oficina1', 'comedor'],
      christopher: ['juguetes'],
      papa:        ['cocinar', 'platos', 'cocina1', 'cochera', 'patio', 'pilas'],
      mama:        ['cocina2', 'oficina2', 'sala2', 'cuartopral', 'bano2', 'closet1', 'closet2'],
      bebeTurnos:  ['mama', 'papa', 'taylor', 'emmeth'],
    },
  },
  zonas: {
    label: 'Plan por zonas',
    sub: 'Por cargos y territorios — cada quien es guardián de su zona',
    assign: {
      mama:        ['z_cocina', 'z_super', 'z_despensa', 'z_plan', 'cocinar', 'oficina2'],
      papa:        ['z_basura', 'z_barrido', 'z_lavanderia', 'plagas', 'bombillos', 'cochera'],
      taylor:      ['z_estudio', 'z_biblioteca', 'sala1'],
      emmeth:      ['z_entrada', 'z_zapatos', 'z_mochilas', 'z_piso'],
      christopher: ['z_juguetes', 'z_cesta'],
      bebeTurnos:  ['mama', 'papa', 'taylor', 'emmeth'],
    },
  },
};

/* ---- ZONAS / TERRITORIOS (responsable + ayudantes) ----
   Para mostrar el sistema de guardianes en el panel y el documento.
*/
window.ZONES = [
  { zone: 'Entrada japonesa', icon: '🚪', resp: 'emmeth', helps: ['taylor'] },
  { zone: 'Cocina',          icon: '🍳', resp: 'mama',   helps: ['papa', 'taylor'] },
  { zone: 'Sala',            icon: '🛋️', resp: 'taylor', helps: ['christopher'] },
  { zone: 'Oficina de los niños', icon: '📖', resp: 'taylor', helps: ['emmeth'] },
  { zone: 'Oficina de los padres', icon: '💻', resp: 'mama',  helps: ['papa'] },
  { zone: 'Lavandería',       icon: '🧺', resp: 'papa',   helps: ['mama', 'taylor'] },
];

/* ---- RECOMPENSAS PARA LAS MASCOTAS ----
   Se desbloquean por puntos acumulados del niño.
*/
window.REWARDS = [
  { at: 30,  icon: '🦴', label: 'Snack favorito' },
  { at: 60,  icon: '🎀', label: 'Accesorio nuevo' },
  { at: 100, icon: '🏠', label: 'Casita de lujo' },
  { at: 150, icon: '🧸', label: 'Juguete especial' },
  { at: 220, icon: '👑', label: 'Corona de la semana' },
];

/* ---- ESTADOS DE ÁNIMO DE LA MASCOTA según felicidad % ---- */
window.MOODS = [
  { min: 85, label: '¡Súper feliz!', face: '🤩' },
  { min: 60, label: 'Contento',      face: '😺' },
  { min: 35, label: 'Tranquilo',     face: '🙂' },
  { min: 1,  label: 'Con hambre',    face: '🥺' },
  { min: 0,  label: 'Esperándote',   face: '😴' },
];

window.DAYS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
window.DAYS_SHORT = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
window.POINTS_PER_TASK = 10;

/* ---- FRECUENCIAS ---- */
window.FREQS = {
  diario:     { label: 'Diario',     short: 'Día',   order: 0 },
  semanal:    { label: 'Semanal',    short: 'Sem',   order: 1 },
  quincenal:  { label: 'Quincenal',  short: '15 d',  order: 2 },
  mensual:    { label: 'Mensual',    short: 'Mes',   order: 3 },
  trimestral: { label: 'Trimestral', short: '3 mes', order: 4 },
  anual:      { label: 'Anual',      short: 'Año',   order: 5 },
};
window.freqLabel = t => {
  if (!t) return '';
  if (t.freq === 'semanal' && t.day != null) return 'Cada ' + window.DAYS[t.day].toLowerCase();
  return (window.FREQS[t.freq] || window.FREQS.diario).label;
};

/* ---- NIVELES SEMANALES ---- */
window.LEVELS = [
  { min: 0,   label: 'Aprendiz',           icon: '🌱' },
  { min: 50,  label: 'Colaborador',        icon: '⭐' },
  { min: 100, label: 'Organizador',        icon: '🌟' },
  { min: 150, label: 'Guardián del Hogar', icon: '🏆' },
  { min: 200, label: 'Maestro del Orden',  icon: '👑' },
];
window.levelFor = pts => {
  let lv = window.LEVELS[0], idx = 0;
  window.LEVELS.forEach((l, i) => { if (pts >= l.min) { lv = l; idx = i; } });
  return { ...lv, idx };
};
window.nextLevel = pts => window.LEVELS.find(l => l.min > pts) || null;

/* ---- BONOS (solo positivos) ---- */
window.BONUSES = [
  { id: 'iniciativa', label: 'Hizo algo sin que se lo pidieran', icon: '✨', pts: 5 },
  { id: 'problema',   label: 'Detectó un problema (fuga, bombillo, basura…)', icon: '🔎', pts: 2 },
  { id: 'ayuda',      label: 'Ayudó a otro miembro de la familia', icon: '🤝', pts: 3 },
];
window.BONUS = id => window.BONUSES.find(b => b.id === id);

/* ===========================================================
   MODELO DE CALIDAD + INSPECCIÓN (compartido por ambas apps)
   marks[pid + ':' + taskId] = { s, o, c }
     s : 'claim' = el niño marcó "listo", espera inspección (0 pts)
         'ok'    = un adulto aprobó → puntos = o + c
     o : orden    (0..5)
     c : limpieza (0..5)
   =========================================================== */
window.MAX_ORDER = 5;
window.MAX_CLEAN = 5;
window.markPoints = m => (m && m.s === 'ok') ? ((m.o || 0) + (m.c || 0)) : 0;
window.markState = m => !m ? 'todo' : (m.s === 'ok' ? 'ok' : 'claim');

/* puntos de bonos de una persona en la semana */
window.bonusPointsFor = (pid, bonus) =>
  (bonus || []).filter(b => b.pid === pid).reduce((s, b) => s + (b.pts || 0), 0);
