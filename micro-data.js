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
    { moment:'hogar', group:'Manías', type:'area', icon:'🍳', freq:'diario', micro:[
      'Limpiar cocina','Limpiar utensilios','Barrer y coletear','Preparar la logística del día',
      'Hacer mercado','Botar la basura',
    ]},
    { moment:'hogar', group:'Lavandería (lava: mar · vie · sáb)', type:'task', freq:'semanal', days:[2,5,6], items:[
      ['Separar ropa blanca','⚪'], ['Separar ropa de color','🌈'], ['Cargar lavadora','🧺'],
      ['Pasar ropa a secadora','🌀'], ['Llevar ropa limpia a la sala para doblar','🛋️'],
    ]},
    { moment:'hogar', group:'Qué lavar el martes', freq:'semanal', days:[2], items:[
      ['Paños de cocina','🧽'], ['Manteles','🍽️'], ['Delantales','🥽'], ['Bayetas','🧼'],
    ]},
    { moment:'hogar', group:'Qué lavar el viernes', freq:'semanal', days:[5], items:[
      ['Uniformes de fútbol (Emmeth y Christopher)','⚽'], ['Ropa deportiva','👟'], ['Ropa oscura','🌑'],
    ]},
    { moment:'hogar', group:'Qué lavar el sábado', freq:'semanal', days:[6], items:[
      ['Ropa de iglesia','⛪'], ['Sábanas o edredones (según calendario)','🛏️'],
    ]},
    { moment:'hogar', group:'Basura (martes)', freq:'semanal', days:[2], items:[
      ['Sacar basura de cocina','🗑️'], ['Sacar basura de baños','🚮'],
      ['Sacar basura de oficinas y cuartos','🧺'], ['Sacar reciclaje','♻️'],
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
    { moment:'hogar', group:'Lavandería (doblar)', freq:'diario', items:[
      ['Doblar ropa','🧺'], ['Guardar ropa doblada','🗄️'],
    ]},
    { moment:'hogar', group:'Lavandería (lava: lun · mié · jue)', type:'task', freq:'semanal', days:[1,3,4], items:[
      ['Separar ropa blanca','⚪'], ['Separar ropa de color','🌈'], ['Cargar lavadora','🧺'], ['Pasar ropa a secadora','🌀'],
    ]},
    { moment:'hogar', group:'Qué lavar el lunes', freq:'semanal', days:[1], items:[
      ['Uniformes escolares','👔'], ['Ropa blanca','⚪'], ['Ropa interior','🩲'],
    ]},
    { moment:'hogar', group:'Qué lavar el miércoles', freq:'semanal', days:[3], items:[
      ['Carga ligera si hace falta','🧺'], ['Ropa del bebé (prioridad)','👶'],
    ]},
    { moment:'hogar', group:'Qué lavar el jueves', freq:'semanal', days:[4], items:[
      ['Ropa de gimnasia de Taylor','🤸'], ['Toallas de baño','🛁'],
    ]},
    { moment:'hogar', group:'Basura (viernes)', freq:'semanal', days:[5], items:[
      ['Sacar basura de cocina','🗑️'], ['Sacar basura de baños','🚮'],
      ['Sacar basura de oficinas y cuartos','🧺'], ['Sacar reciclaje','♻️'],
    ]},
    /* ---- Limpiezas profundas de Verónica (por día y semana del mes) ---- */
    { moment:'hogar', group:'Dormitorios · profunda', type:'area', icon:'🛏️', freq:'semanal', days:[1], micro:[
      'Cambiar sábanas y fundas','Lavar edredón cuando corresponda','Aspirar y rotar colchón',
      'Limpiar mesas de noche y cabecera','Limpiar muebles por dentro/fuera y detrás',
      'Sacudir lámparas','Limpiar ventiladores','Aspirar debajo de la cama','Vaciar deshumidificador',
    ]},
    { moment:'hogar', group:'Cocina · profunda', type:'area', icon:'🍳', freq:'semanal', days:[2], weeks:[1,3], micro:[
      'Horno por dentro','Desengrasar campana extractora','Parrillas y quemadores','Interior del microondas',
      'Desinfectar cafetera, licuadora, freidora y olla','Gabinetes: puertas, interiores y encima',
      'Destapar drenajes preventivamente','Detrás y debajo de electrodomésticos','Juntas de azulejos',
    ]},
    { moment:'hogar', group:'Despensa · profunda', type:'area', icon:'🥫', freq:'semanal', days:[2], weeks:[2,4], micro:[
      'Vaciar completamente los estantes','Limpiar y desinfectar superficies','Revisar fechas de vencimiento',
      'Desechar productos vencidos','Reorganizar por categorías y aplicar FIFO','Etiquetar recipientes',
      'Revisar signos de plagas','Limpiar recipientes herméticos por fuera',
    ]},
    { moment:'hogar', group:'Oficina · profunda', type:'area', icon:'💼', freq:'semanal', days:[2], weeks:[2], micro:[
      'Limpiar monitor, teclado y mouse','Limpiar impresora','Desinfectar audífonos',
      'Organizar y archivar documentos','Eliminar documentos innecesarios','Limpiar cables','Limpiar libreros',
    ]},
    { moment:'hogar', group:'Refrigerador · profunda', type:'area', icon:'❄️', freq:'semanal', days:[2], weeks:[4], micro:[
      'Vaciar completamente','Desechar alimentos vencidos','Limpiar repisas y cajones','Limpiar sellos de goma',
      'Desinfectar superficies internas','Reorganizar usando FIFO','Registrar productos próximos a vencer',
    ]},
    { moment:'hogar', group:'Área de Rachel · profunda', type:'area', icon:'👶', freq:'semanal', days:[3], micro:[
      'Desinfectar juguetes','Limpiar cambiador','Revisar stock de pañales y toallitas',
      'Revisar fechas de productos de higiene','Lavar mantitas y baberos',
      'Desinfectar accesorios de alimentación','Reorganizar el almacenamiento',
    ]},
    { moment:'hogar', group:'Baño · profunda', type:'area', icon:'🚿', freq:'semanal', days:[4], micro:[
      'Desinfectar inodoro, tanque y desincrustar sarro','Lavamanos: desagüe y pulir grifería',
      'Ducha: paredes, juntas, moho, puertas y desagüe','Vaciar y limpiar muebles y debajo del lavamanos',
      'Revisar y desechar productos vencidos','Limpiar espejo y desinfectar dispensadores','Limpiar extractor o ventilación',
    ]},
    { moment:'hogar', group:'Sala · profunda', type:'area', icon:'🛋️', freq:'semanal', days:[5], weeks:[1,3], micro:[
      'Sacudir lámparas y pantallas','Limpiar cuadros, marcos e interruptores','Limpiar puertas, manijas y zócalos',
      'Limpiar mesas por debajo','Mueble del TV por dentro y detrás','Pantalla del TV con producto adecuado',
      'Aspirar el sofá y debajo de los cojines','Mover muebles y limpiar detrás/debajo','Aspirar o lavar alfombras',
    ]},
    { moment:'hogar', group:'Comedor · profunda', type:'area', icon:'🍽️', freq:'semanal', days:[5], weeks:[1,3], micro:[
      'Limpiar patas y base de la mesa','Limpiar sillas completas (asiento, respaldo, patas)',
      'Lavar o cambiar el mantel','Limpiar centro de mesa y decoración','Zócalos y esquinas','Mover la mesa y limpiar debajo',
    ]},
    { moment:'hogar', group:'Lavandería · mantenimiento', type:'area', icon:'🧺', freq:'semanal', days:[5], weeks:[2,4], micro:[
      'Limpiar interior de la lavadora','Limpiar filtro de la lavadora','Limpiar filtro de pelusas de la secadora',
      'Limpiar detrás de los equipos','Limpiar estantes','Revisar productos y organizar suministros',
    ]},
    { moment:'hogar', group:'Cochera · profunda', type:'area', icon:'🚗', freq:'semanal', days:[6], weeks:[1], micro:[
      'Eliminar telarañas','Limpiar portón','Limpiar estanterías y herramientas','Limpiar esquinas',
      'Revisar humedad','Revisar posibles refugios de plagas',
    ]},
    { moment:'hogar', group:'Patio o jardín · profunda', type:'area', icon:'🌿', freq:'semanal', days:[6], weeks:[1], micro:[
      'Podar plantas','Retirar maleza','Limpiar muebles exteriores','Revisar drenajes','Limpiar macetas','Revisar agua estancada',
    ]},
    { moment:'hogar', group:'Ventanas · profunda', type:'area', icon:'🪟', freq:'semanal', days:[6], weeks:[2], micro:[
      'Cristales interiores y exteriores','Limpiar marcos','Limpiar rieles','Limpiar persianas','Limpiar mosquiteros',
    ]},
    { moment:'hogar', group:'Closet · trimestral', type:'area', icon:'👕', freq:'semanal', days:[6], weeks:[3], micro:[
      'Revisar tallas y probar ropa a los niños','Separar dañada, para donar y para vender',
      'Rotar ropa por temporada','Revisar zapatos, mochilas y accesorios',
      'Limpiar cajas organizadoras','Limpiar estantes y paredes internas','Revisar humedad o moho',
    ]},
    { moment:'hogar', group:'Vehículo familiar · profunda', type:'area', icon:'🚙', freq:'semanal', days:[6], weeks:[3], micro:[
      'Aspirar alfombras y tapicería','Limpiar asientos, tablero, consola y compartimentos','Vidrios interiores',
      'Lavar carrocería, llantas y rines','Vidrios exteriores','Revisar presión de neumáticos',
      'Revisar niveles de aceite y líquidos','Revisar fecha de mantenimiento',
    ]},
    { moment:'hogar', group:'Control de plagas', type:'area', icon:'🐜', freq:'semanal', days:[6], weeks:[4], micro:[
      'Mover muebles y electrodomésticos y aspirar detrás/debajo','Revisar trampas adhesivas y cambiar cebos',
      'Sellar grietas detectadas','Revisar drenajes y humedad','Eliminar cajas de cartón innecesarias',
      'Inspeccionar puntos de ingreso de insectos',
    ]},
    { moment:'hogar', group:'Manías', type:'area', icon:'🍳', freq:'diario', micro:[
      'Limpiar nevera','Limpiar mesa de trabajo','Hacer inventario',
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
    let n = 0, wrot = 0; // wrot reparte las semanales sin día fijo (Lun-Sáb)
    (window.PLAN[pid] || []).forEach(blk => {
      let days = blk.days || null;
      // Semanal sin día (ni semana del mes): se le asigna un día fijo de la
      // semana para que SOLO aparezca ese día (no todos los días).
      if (blk.freq === 'semanal' && !days && !blk.weeks) { days = [1 + (wrot % 6)]; wrot++; }
      const base = {
        pid, moment: blk.moment, group: blk.group,
        freq: blk.freq || 'diario', days: days, weeks: blk.weeks || null,
      };
      if (blk.type === 'area') {
        out.push(Object.assign({}, base, {
          id: pid + '-' + (n++), type: 'area',
          label: blk.group, icon: blk.icon || '🧹',
          micro: (blk.micro || []).slice(), pts: 10,
        }));
      } else {
        // Tarea diaria = 10 pts. Tarea semanal = 15 pts (premio de oro).
        const val = (blk.freq === 'semanal') ? 15 : 10;
        (blk.items || []).forEach(it => {
          out.push(Object.assign({}, base, {
            id: pid + '-' + (n++), type: 'task',
            label: it[0], icon: it[1] || '•', pts: val,
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

/* semana del mes: 1 (días 1-7) … 5 */
window.weekOfMonth = (d = new Date()) => Math.ceil(d.getDate() / 7);

/* ¿la tarea aplica en una fecha?
   - days  → solo esos días de la semana
   - weeks → solo esas semanas del mes (para rotaciones mensuales)
   - resto → siempre visible */
window.appliesToday = (t, d = new Date()) => {
  if (t.days && t.days.length && !t.days.includes(d.getDay())) return false;
  if (t.weeks && t.weeks.length && !t.weeks.includes(window.weekOfMonth(d))) return false;
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
  return (typeof m.pts === 'number') ? m.pts : (t && t.pts ? t.pts : window.MICRO_POINTS);
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

/* ============================================================
   PRIVILEGIOS POR MÉRITO
   ------------------------------------------------------------
   Se desbloquean con los PUNTOS OBTENIDOS en el período (esfuerzo),
   nunca con el saldo. Comparan lo ganado vs. lo posible (las tareas
   asignadas ese día / esa semana).
   ============================================================ */
window.PRIV_DEFAULTS = {
  screen: {
    enabled: true,
    kids: ['taylor', 'emmeth'],     // quiénes participan
    minPct: 70,                     // % mínimo del día para desbloquear
    max: 120,                       // minutos máximos absolutos
    // [porcentaje alcanzado, minutos]
    tiers: [[70, 30], [80, 60], [90, 90], [100, 120]],
    days: [1, 2, 3, 4, 5],          // Lun..Vie
  },
  titos: {
    enabled: true,
    kids: ['taylor', 'emmeth'],
    minPct: 70,                     // % de Lun..Vie
    days: [1, 2, 3, 4, 5],
    evalDay: 5,                     // viernes
    phone: '+506 7231 2428',
    message: 'Hola Tita ❤️\n\nSoy {nombre}.\n\n¡Ya cumplí con todas mis responsabilidades de esta semana y obtuve los puntos necesarios para ganar mi premio! 🥳\n\n¿Puedo ir a pasar tiempo de calidad contigo este viernes? Me emociona mucho compartir contigo, ir a la piscina y jugar juntos.\n\n¡Te quiero mucho! 💕',
  },
  pets: {
    enabled: true,
    weeklyMin: 500,                 // puntos de la semana para desbloquear
  },
};

/* configuración efectiva = defaults + lo guardado por los padres */
window.getPrivCfg = (store) => {
  const d = window.PRIV_DEFAULTS;
  const c = (store && store.privCfg) || {};
  return {
    screen: Object.assign({}, d.screen, c.screen),
    titos: Object.assign({}, d.titos, c.titos),
    pets: Object.assign({}, d.pets, c.pets),
  };
};

/* puntos POSIBLES de un día = nº de tareas asignadas ese día × 10 */
window.possiblePointsForDay = (pid, d = new Date()) =>
  window.routinesFor(pid).filter(t => window.appliesToday(t, d)).length * window.MICRO_POINTS;

/* puntos POSIBLES en un rango de días [from..to] (timestamps ms) */
window.possibleInRange = (pid, from, to) => {
  let s = 0;
  const d = new Date(from); d.setHours(0, 0, 0, 0);
  const end = new Date(to);
  while (d <= end) { s += window.possiblePointsForDay(pid, d); d.setDate(d.getDate() + 1); }
  return s;
};

/* puntos GANADOS (aprobados) en un rango [from..to] (timestamps ms).
   Se leen del LEDGER permanente (cada aprobación quedó registrada con su fecha). */
window.earnedInRange = (pid, store, from, to) => {
  let s = 0;
  (store && store.ledger || []).forEach(e => {
    if (e && e.pid === pid && typeof e.pts === 'number' && e.at >= from && e.at <= to) s += e.pts;
  });
  return s;
};

/* límites de un día (de 00:00 a 23:59:59.999) */
window.dayBounds = (d = new Date()) => {
  const a = new Date(d); a.setHours(0, 0, 0, 0);
  const b = new Date(d); b.setHours(23, 59, 59, 999);
  return { from: a.getTime(), to: b.getTime() };
};
/* lunes 00:00 y viernes 23:59 de la semana de la fecha dada */
window.weekMonFri = (d = new Date()) => {
  const day = d.getDay();                 // 0=Dom..6=Sáb
  const diff = (day === 0 ? -6 : 1 - day); // hasta el lunes
  const mon = new Date(d); mon.setDate(d.getDate() + diff); mon.setHours(0, 0, 0, 0);
  const fri = new Date(mon); fri.setDate(mon.getDate() + 4); fri.setHours(23, 59, 59, 999);
  return { mon: mon.getTime(), fri: fri.getTime() };
};

/* minutos de pantalla según el % alcanzado (entero 0..100+) */
window.screenMinutes = (cfg, pct) => {
  const sc = cfg.screen;
  if (pct < sc.minPct) return 0;
  let min = 0;
  (sc.tiers || []).forEach(([th, m]) => { if (pct >= th) min = m; });
  return Math.min(min, sc.max);
};

/* mensaje para los Titos con el nombre del niño */
window.titosMessage = (cfg, name) => (cfg.titos.message || '').replace(/\{nombre\}/g, name);
window.titosWaLink = (cfg, name) => {
  const phone = String(cfg.titos.phone || '').replace(/[^0-9]/g, '');
  return 'https://wa.me/' + phone + '?text=' + encodeURIComponent(window.titosMessage(cfg, name));
};
