/* ============================================================
   CATÁLOGO DE MICROTAREAS  —  Áreas → Subáreas → Microtareas
   ------------------------------------------------------------
   Sistema nuevo (independiente del de "Tabla de Tareas"):
   cada microtarea vale 1 PUNTO y requiere inspección del adulto.

   - owner:  a quién pertenece el área (reparto por edad/capacidad).
   - shared: true  → se cuida por turnos (la bebé Che-Che).
   - personal:true → área de autocuidado de esa persona.
   - freq:   'diario' | 'semanal' | 'profundo' (por subárea).

   Para cambiar quién hace un área, edita su "owner".
   ============================================================ */

window.MICRO_POINTS = 1;

/* ---- Reparto por edad/capacidad (responsable de cada área) ----
   Yue y Max (adultos) + Tay-Yay (10) llevan las áreas pesadas;
   Dondo (7) áreas livianas; Misifu (4) solo su autocuidado;
   Che-Che (1) se cuida por turnos. */
window.MICRO_AREAS = [
  /* ===================== ÁREAS DE LA CASA ===================== */
  { key:'entrada', area:'Entrada japonesa', icon:'🚪', cat:'Organización', owner:'emmeth', subs:[
    { sub:'Orden', freq:'diario', items:['Guardar zapatos propios','Alinear zapatos familiares','Guardar pantuflas','Vaciar cesta de objetos perdidos','Sacudir felpudo','Organizar mochilas','Organizar bolsos','Colgar llaves'] },
    { sub:'Limpieza', freq:'semanal', items:['Barrer entrada','Trapear entrada','Limpiar espejo','Limpiar zapatero','Limpiar puerta principal'] },
  ]},
  { key:'sala', area:'Sala', icon:'🛋️', cat:'Limpieza', owner:'taylor', subs:[
    { sub:'Orden', freq:'diario', items:['Doblar cobijas','Acomodar cojines','Guardar juguetes','Guardar controles remotos','Organizar mesa central','Organizar juegos de mesa','Guardar cargadores'] },
    { sub:'Limpieza', freq:'semanal', items:['Sacudir muebles','Limpiar televisor','Limpiar mesa central','Limpiar repisas','Barrer piso','Trapear piso','Aspirar sofá','Limpiar debajo del sofá'] },
  ]},
  { key:'comedor', area:'Comedor', icon:'🍴', cat:'Limpieza', owner:'emmeth', subs:[
    { sub:'Orden', freq:'diario', items:['Retirar platos','Retirar vasos','Retirar cubiertos','Organizar centro de mesa','Organizar sillas'] },
    { sub:'Limpieza', freq:'diario', items:['Limpiar mesa','Limpiar sillas','Barrer','Trapear','Limpiar interruptores'] },
  ]},
  { key:'cocina', area:'Cocina', icon:'🍳', cat:'Cocina y Alimentación', owner:'mama', subs:[
    { sub:'Rutina diaria', freq:'diario', items:['Lavar platos desayuno','Lavar platos almuerzo','Lavar platos cena','Guardar platos','Limpiar fregadero','Secar fregadero','Limpiar cocina','Limpiar microondas exterior','Limpiar cafetera','Limpiar air fryer','Limpiar mesón principal','Limpiar área preparación','Barrer cocina','Trapear cocina','Vaciar basura'] },
    { sub:'Organización', freq:'semanal', items:['Guardar alimentos','Etiquetar alimentos','Revisar vencimientos','Organizar especias','Organizar frascos','Organizar despensa'] },
    { sub:'Profundo', freq:'profundo', items:['Limpiar nevera','Revisar alimentos vencidos','Limpiar congelador','Limpiar horno','Limpiar campana','Limpiar debajo cocina','Limpiar detrás nevera'] },
  ]},
  { key:'bano_principal', area:'Baño principal', icon:'🚿', cat:'Limpieza', owner:'mama', subs:[
    { sub:'Orden', freq:'semanal', items:['Reponer papel higiénico','Reponer jabón','Reponer shampoo','Reponer acondicionador','Doblar toallas','Guardar productos'] },
    { sub:'Limpieza', freq:'semanal', items:['Lavar poceta','Lavar asiento','Limpiar tanque','Lavar lavamanos','Limpiar espejo','Limpiar grifería','Lavar ducha','Limpiar paredes ducha','Barrer','Trapear','Vaciar papelera'] },
  ]},
  { key:'bano_comun', area:'Baño común', icon:'🚽', cat:'Limpieza', owner:'taylor', subs:[
    { sub:'Orden', freq:'semanal', items:['Reponer papel higiénico','Reponer jabón','Doblar toallas','Guardar productos'] },
    { sub:'Limpieza', freq:'semanal', items:['Lavar poceta','Lavar asiento','Lavar lavamanos','Limpiar espejo','Limpiar grifería','Lavar ducha','Barrer','Trapear','Vaciar papelera'] },
  ]},
  { key:'cuarto_principal', area:'Cuarto principal', icon:'🛏️', cat:'Organización', owner:'mama', subs:[
    { sub:'Orden', freq:'diario', items:['Hacer cama','Doblar ropa','Guardar ropa','Colgar ropa','Organizar mesas noche','Organizar zapatos'] },
    { sub:'Limpieza', freq:'semanal', items:['Sacudir muebles','Barrer','Trapear','Limpiar cabecera','Limpiar televisor','Limpiar espejo'] },
  ]},
  { key:'closet_principal', area:'Closet principal', icon:'👕', cat:'Organización', owner:'papa', subs:[
    { sub:'Organización', freq:'semanal', items:['Colgar ropa','Doblar ropa','Organizar zapatos','Organizar bolsos','Revisar ropa dañada','Revisar ropa que no se usa'] },
    { sub:'Limpieza', freq:'profundo', items:['Barrer','Trapear','Limpiar repisas','Revisar humedad','Ventilar closet'] },
  ]},
  { key:'cuarto_ninos', area:'Cuarto de los niños', icon:'🧸', cat:'Organización', owner:'taylor', subs:[
    { sub:'Orden', freq:'diario', items:['Hacer cama Tay-Yay','Hacer cama Dondo','Hacer cama Misifu','Guardar juguetes','Guardar libros','Guardar ropa','Guardar zapatos'] },
    { sub:'Limpieza', freq:'semanal', items:['Barrer','Trapear','Sacudir muebles','Limpiar ventanas'] },
  ]},
  { key:'oficina_ninos', area:'Oficina de los niños', icon:'📖', cat:'Organización', owner:'taylor', subs:[
    { sub:'Orden', freq:'diario', items:['Organizar mochilas','Organizar útiles','Organizar cuadernos','Organizar libros','Organizar escritorio'] },
    { sub:'Limpieza', freq:'semanal', items:['Limpiar escritorio','Barrer','Trapear','Sacudir biblioteca'] },
  ]},
  { key:'oficina_padres', area:'Oficina de los padres', icon:'💻', cat:'Organización', owner:'papa', subs:[
    { sub:'Orden', freq:'semanal', items:['Organizar escritorio Yue','Organizar escritorio Max','Organizar cables','Organizar documentos','Organizar libros','Organizar bolsos'] },
    { sub:'Limpieza', freq:'semanal', items:['Limpiar escritorios','Limpiar monitores','Limpiar teclados','Barrer','Trapear','Vaciar basura'] },
  ]},
  { key:'lavanderia', area:'Lavandería', icon:'🧺', cat:'Lavandería', owner:'papa', subs:[
    { sub:'Ropa', freq:'diario', items:['Clasificar ropa','Iniciar lavado','Cambiar a secadora','Tender ropa','Doblar ropa','Guardar ropa'] },
    { sub:'Limpieza', freq:'semanal', items:['Limpiar filtro secadora','Limpiar filtro lavadora','Limpiar área detergentes','Barrer','Trapear'] },
  ]},
  { key:'jardin', area:'Jardín y huerto', icon:'🌿', cat:'Jardinería', owner:'papa', subs:[
    { sub:'Diario', freq:'diario', items:['Regar plantas','Revisar humedad tierra','Revisar plagas'] },
    { sub:'Semanal', freq:'semanal', items:['Podar','Fertilizar','Cosechar','Sembrar'] },
  ]},

  /* ===================== AUTOCUIDADO ===================== */
  { key:'auto_yue', area:'Autocuidado · Yue', icon:'💜', cat:'Cuidado Personal', owner:'mama', personal:true, subs:[
    { sub:'Mañana', freq:'diario', items:['Tomar agua al despertar','Tomar vitaminas','Lavar rostro','Aplicar hidratante','Aplicar protector solar','Cepillar cabello','Preparar ropa del día'] },
    { sub:'Noche', freq:'diario', items:['Desmaquillar (si aplica)','Lavar rostro','Hidratante facial','Cepillar cabello','Preparar ropa siguiente día'] },
    { sub:'Semanal', freq:'semanal', items:['Mascarilla facial','Exfoliación facial','Exfoliación corporal','Baño de crema','Corte uñas manos','Corte uñas pies','Depilación','Cuidado cejas'] },
    { sub:'Salud', freq:'diario', items:['Gimnasio','Cumplir meta de agua','Lactancia programada','Tomar suplementos'] },
  ]},
  { key:'auto_max', area:'Autocuidado · Max', icon:'💚', cat:'Cuidado Personal', owner:'papa', personal:true, subs:[
    { sub:'Diario', freq:'diario', items:['Cepillado mañana','Cepillado tarde','Cepillado noche','Uso hilo dental','Bañarse','Lavarse manos antes de comer','Aplicar desodorante','Peinarse'] },
    { sub:'Salud', freq:'diario', items:['Cumplir meta de agua','Gimnasio'] },
  ]},
  { key:'auto_tay', area:'Autocuidado · Tay-Yay', icon:'🌸', cat:'Cuidado Personal', owner:'taylor', personal:true, subs:[
    { sub:'Diario', freq:'diario', items:['Cepillar dientes mañana','Cepillar dientes tarde','Cepillar dientes noche','Bañarse','Peinar cabello mañana','Peinar cabello noche','Protector solar','Desodorante','Preparar uniforme'] },
    { sub:'Semanal', freq:'semanal', items:['Lavar cepillos cabello','Organizar accesorios cabello','Preparar bolso gimnasia','Guardar uniforme gimnasia'] },
  ]},
  { key:'auto_dondo', area:'Autocuidado · Dondo', icon:'⚡', cat:'Cuidado Personal', owner:'emmeth', personal:true, subs:[
    { sub:'Diario', freq:'diario', items:['Cepillar dientes mañana','Cepillar dientes tarde','Cepillar dientes noche','Bañarse','Peinarse','Preparar uniforme'] },
    { sub:'Fútbol', freq:'semanal', items:['Preparar uniforme','Guardar uniforme','Limpiar zapatos deportivos'] },
  ]},
  { key:'auto_misifu', area:'Autocuidado · Misifu', icon:'🌻', cat:'Cuidado Personal', owner:'christopher', personal:true, subs:[
    { sub:'Diario', freq:'diario', items:['Cepillado mañana','Cepillado noche','Bañarse','Lavarse manos','Peinarse'] },
  ]},

  /* ===================== CUIDADO DE LA BEBÉ (por turnos) ===================== */
  { key:'bebe_chche', area:'Cuidado de Che-Che', icon:'🍼', cat:'Responsabilidades Familiares', shared:true, turns:['mama','papa','taylor','emmeth'], subs:[
    { sub:'Cuidados', freq:'diario', items:['Cambio pañal mañana','Cambio pañal tarde','Cambio pañal noche','Limpieza cara','Limpieza manos','Cambio ropa','Baño','Cepillado cabello','Lactancia','Siesta'] },
  ]},
];

/* ---- Aplanado: lista de microtareas con id único y dueño ----
   id = areaKey-#  |  owner = dueño del área (o turnos para la bebé) */
window.MICRO_TASKS = (function () {
  const out = [];
  window.MICRO_AREAS.forEach(a => {
    let n = 0;
    a.subs.forEach(s => {
      s.items.forEach(label => {
        out.push({
          id: a.key + '-' + (n++),
          label, area: a.area, areaKey: a.key, icon: a.icon,
          cat: a.cat, sub: s.sub, freq: s.freq,
          owner: a.owner || null, shared: !!a.shared, personal: !!a.personal,
          turns: a.turns || null, pts: 1,
        });
      });
    });
  });
  return out;
})();
window.MICRO_TASK = id => window.MICRO_TASKS.find(t => t.id === id);

/* ---- Microtareas que le tocan a una persona ----
   - Áreas normales: las del dueño del área.
   - Áreas por turnos (bebé): a todos los que están en "turns".
   - Autocuidado: solo de esa persona. */
window.microTasksFor = pid =>
  window.MICRO_TASKS.filter(t => t.shared ? (t.turns || []).includes(pid) : t.owner === pid);

/* ---- Bonos (1 punto por acción, salvo los grandes) ---- */
window.MICRO_BONUSES = [
  { id: 'ayuda',      label: 'Ayudar a otro miembro',                 icon: '🤝', pts: 1 },
  { id: 'iniciativa', label: 'Hacer una tarea sin que se la pidan',   icon: '✨', pts: 1 },
  { id: 'reparacion', label: 'Detectar una reparación necesaria',     icon: '🔧', pts: 1 },
  { id: 'dia',        label: 'Completar todas sus tareas del día',    icon: '🌟', pts: 5 },
  { id: 'area',       label: 'Completar toda su área de la semana',   icon: '🏆', pts: 10 },
];
window.MICRO_BONUS = id => window.MICRO_BONUSES.find(b => b.id === id);

/* ---- Modelo de puntos + inspección (1 pt por microtarea aprobada) ----
   mmarks[pid + ':' + microId] = { s }
     s: 'claim' = marcada como lista (espera aprobación, 0 pts)
        'ok'    = aprobada por un adulto  → 1 punto                     */
window.microMarkState  = m => !m ? 'todo' : (m.s === 'ok' ? 'ok' : 'claim');
window.microMarkPoints = m => (m && m.s === 'ok') ? window.MICRO_POINTS : 0;
