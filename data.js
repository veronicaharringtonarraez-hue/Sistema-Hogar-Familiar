/* ============================================================
   DATOS DE LA FAMILIA — Tabla de Tareas Familiares
   Todo editable: nombres de mascotas, colores, áreas, etc.
   ============================================================ */

/* ---- PIN del Panel de Padres ----
   Para entrar al Panel de Padres desde la app de los niños se pide este PIN.
   Cámbialo por el número que quieras (puede ser de 4 o más dígitos).        */
window.PARENT_PIN = '181215';

/* ---- PERFILES ---- */
window.FAMILY = [
  {
    id: 'mama', name: 'Yue', short: 'Yue', realName: 'Verónica', age: null, role: 'adulto', title: 'Directora Estratégica',
    note: 'Trabaja desde casa · horario flexible',
    colors: { a: '#7C5CFF', b: '#B69DFF', c: '#E9E2FF', ink: '#3A2D7A' },
    emoji: '💜', isKid: false, caresBaby: true,
    pet: {
      name: 'Luna', species: 'Buhito con lentes · ENTJ', img: window.IMG.mama,
      kind: 'ave', face: '🦉', food: '🐭', toy: '🪶', dir: 'luna',
      persona: {
        btn: '🦉 Sabiduría de Luna',
        idle: [
          "Agenda de hoy: dominar el día. Punto uno: existir con estilo. 🦉",
          "No procrastino, priorizo. Ahora toca observar majestuosamente. 👓",
          "Un búho ENTJ no espera el momento: lo agenda.",
          "Lidero con la mirada; creen que solo parpadeo. 😏",
        ],
        carino: [
          "Cariño aprobado. Lo agendé en mi cronograma de afecto. 🦉",
          "Acepta mi gratitud ejecutiva: un asentimiento solemne. 👌",
        ],
        comida: [
          "Excelente logística de alimentos. Te ascenderé… mentalmente. 🍽️",
          "Combustible recibido. La directora opera a máxima eficiencia.",
        ],
        jugar: [
          "Jugar es networking con alas. Hagámoslo estratégico. 🪶",
          "Cinco minutos de juego: óptimos para la productividad.",
        ],
        casa: [
          "A la oficina-nido: desde aquí superviso el imperio. 🏠",
          "Vuelvo a mi cuartel general a planear el mañana. 🌙",
        ],
        phrases: [
          [0,    "Plan maestro: ser sabia y verme bien haciéndolo. 🦉"],
          [40,   "Delego todo… menos verme adorable. Eso lo hago yo."],
          [90,   "Mis lentes no son para ver: son para juzgar con precisión. 👓"],
          [150,  "Liderazgo es 10% visión y 90% no despeinarse."],
          [250,  "Si no está en la agenda, no existe. Tu siesta tampoco."],
          [400,  "Tomo decisiones rápidas: ya decidí que tengo razón."],
          [600,  "Eficiencia búho: giro la cabeza y superviso en 360°."],
          [850,  "El fracaso no es opción; el plan B también es mío."],
          [1150, "Construyo imperios… y un nido muy bien decorado."],
          [1500, "Conclusión ejecutiva: nací para liderar (y dormir de día). 🌙"],
        ],
      },
    }, petCared: true,
  },
  {
    id: 'papa', name: 'Max', short: 'Max', age: null, role: 'adulto', title: 'Director de Mantenimiento',
    note: 'Trabaja 5am–2pm · oficina 2 días/semana', realName: 'Maykol',
    colors: { a: '#1FB6A6', b: '#5FD3C6', c: '#D7F4F0', ink: '#0C5A52' },
    emoji: '💚', isKid: false, caresBaby: true,
    pet: {
      name: 'Croqueta', species: 'Bulldog inglés · chef ENTP', img: window.IMG.papa,
      kind: 'perro', face: '🐶', food: '🦴', toy: '🍳', dir: 'brutus',
      persona: {
        btn: '🎤 Frase del chef',
        idle: [
          "El chef está horizontal: descanso creativo. 🛋️",
          "Bulldog ENTP: mil ideas geniales y cero ganas de correr. 💡",
          "Hoy el especial de la casa es sarcasmo a la plancha. 🍳",
          "Ronco fuerte, pero lo registro como ambiente de cocina. 😤",
        ],
        carino: [
          "No soy de abrazos… bueno, uno. Y no le cuentes a la parrilla. 🤫",
          "Acaríciame como a un buen corte: con respeto. 😎",
        ],
        comida: [
          "¡Servido! El chef se da cinco estrellas a sí mismo. ⭐⭐⭐⭐⭐",
          "Hueso recibido. Lo marido con una siesta de campeón. 😴",
        ],
        jugar: [
          "Corro 3 metros y pido descanso sindical. 🐾",
          "Juego con la elegancia de un grumete tras el banquete. 🚢",
        ],
        casa: [
          "A mi casita-restaurante. Mesa para uno: yo. 🏠",
          "Entro a supervisar la cocina… o sea, a roncar cerca. 😅",
        ],
        phrases: [
          [0,    "Soy bulldog: ronco como motor diésel y lo llamo ambiente. 😤"],
          [40,   "¿Dieta? Yo solo creo en la mise en place de las croquetas. 🥐"],
          [90,   "De grumete a chef ejecutivo… del tazón. 🍲"],
          [150,  "Mi cara de malo es puro marketing; por dentro soy un flan. 🍮"],
          [250,  "Teoría: si babeo el plato, técnicamente ya es salsa. 🤤"],
          [400,  "Te debato una hora por qué el hueso va antes que la sopa. 🦴"],
          [600,  "Plan de negocios: food truck. Producto estrella: yo, durmiendo. 🚚"],
          [850,  "Soy rudo, pero lloro cortando cebolla. ¡Es la cebolla! 🧅"],
          [1150, "Cocina de barco: si se cae al piso, es estilo rústico. 🚢"],
          [1500, "Conclusión del chef: trabajo por aplausos… y por chuletón. 👏🥩"],
        ],
      },
    }, petCared: true,
  },
  {
    id: 'taylor', name: 'Tay-Yay', short: 'Tay-Yay', realName: 'Taylor', age: 10, role: 'hija', title: 'Guardiana del Orden',
    note: 'Sakura · anime · gimnasia artística',
    tree: '🌸', treeName: 'Sakura',
    colors: { a: '#42BDEE', b: '#B98FE8', c: '#FBC4DA', ink: '#5A3E7A' },
    palette: ['#42BDEE', '#B98FE8', '#FBC4DA'],
    emoji: '🌸', isKid: true, caresBaby: true, petCared: true,
    pet: {
      name: 'Mochi', species: 'Perrito mini toy · ENFJ', img: window.IMG.taylor,
      kind: 'perro', face: '🐶', food: '🦴', toy: '🎾', dir: 'mochi',
      anim: ['assets/mochi/anim/1.mp4', 'assets/mochi/anim/2.mp4', 'assets/mochi/anim/3.mp4', 'assets/mochi/anim/4.mp4', 'assets/mochi/anim/5.mp4'],
      persona: {
        btn: '🌸 Ánimo de Mochi',
        idle: [
          "¡Hoy vas a brillar! Y yo voy a aplaudirte sin parar. 🌟",
          "Creo en ti más que en mi propia colita esponjosa. 💛",
          "Un buen líder anima a su equipo. ¡Equipo, eres increíble!",
          "Estoy aquí para ti, siempre. (Y para las galletas.) 🍪",
        ],
        carino: [
          "¡Gracias por tu cariño! Me llenas el corazón. 💞",
          "Tú cuidas de mí y yo creo en ti. ¡Buen trato! 🥰",
        ],
        comida: [
          "¡Qué detalle! Como con el alma, igual que tú haces todo. 🌸",
          "Gracias por alimentarme; eres pura bondad. 💛",
        ],
        jugar: [
          "¡Equipo en acción! Jugar contigo es lo máximo. 🎉",
          "Cada salto es para celebrarte a ti. ✨",
        ],
        casa: [
          "A casita, donde el cariño nunca se acaba. 🏠",
          "Hogar dulce hogar… porque tú estás cerca. 💛",
        ],
        phrases: [
          [0,    "Tú puedes con todo. Yo te lo recuerdo con la cola. 🐶"],
          [40,   "Cuidarnos es querernos. ¡Qué buen equipo somos!"],
          [90,   "Hoy alguien necesita una sonrisa. Spoiler: eres tú. 😊"],
          [150,  "Lidero con el corazón… y con muchas lamiditas."],
          [250,  "Tus tareas de hoy son tu superpoder de mañana. 💪"],
          [400,  "Creo en ti incluso los lunes. Eso es amor real."],
          [600,  "Un abrazo arregla casi todo. El resto, dos abrazos."],
          [850,  "Eres más fuerte de lo que crees. Palabra de Mochi."],
          [1150, "Juntos llegamos lejos; separados, te extraño. 🥺"],
          [1500, "Mi misión: que sepas lo valioso que eres. ✨"],
        ],
      },
    },
    quota: 3,
  },
  {
    id: 'emmeth', name: 'Dondo', short: 'Dondo', realName: 'Emmeth', age: 7, role: 'hijo', title: 'Guardián de los Zapatos',
    note: 'Pino · dinosaurios · Pokémon',
    tree: '🌲', treeName: 'Pino',
    colors: { a: '#2962FF', b: '#E53935', c: '#E2E9FF', ink: '#11235A' },
    palette: ['#2962FF', '#E53935', '#111111'],
    emoji: '⚡', isKid: true, caresBaby: true, petCared: true,
    pet: {
      name: 'Rayo', species: 'Gato atigrado · ENFP', img: window.IMG.emmeth,
      kind: 'gato', face: '🐱', food: '🐟', toy: '🧶', dir: 'rayo',
      persona: {
        btn: '⚡ Idea de Rayo',
        idle: [
          "¡Tengo 47 ideas nuevas y todas son geniales! ⚡",
          "¿Y si la caja es una nave espacial? ¡VAMOS! 🚀",
          "Me distraje persiguiendo un sueño… y una mosca. 🦋",
          "¡Hoy será el mejor día! Otra vez. ¡Como ayer!",
        ],
        carino: [
          "¡SÍ! ¡Mimos! Mi parte favorita… ¡junto con todo! 🥰",
          "Me cargaste de energía. ¡Aventura activada! ⚡",
        ],
        comida: [
          "¡Comida sorpresa! ¡La mejor trama del día! 🐟",
          "¡Ñam! Ahora tengo energía para mil travesuras. 🎉",
        ],
        jugar: [
          "¡JUGAR! ¡Mi deporte favorito del universo! 🤸",
          "¡Persigo la pelota como si fuera un tesoro legendario! ✨",
        ],
        casa: [
          "A casa… ¡pero corriendo y dando una vuelta extra! 🏠",
          "Mi casita es la base secreta de mis aventuras. 🚀",
        ],
        phrases: [
          [0,    "¡Soñar es gratis y yo sueño en grande! 🌈"],
          [40,   "Empiezo mil cosas… ¡todas emocionantes! 🎉"],
          [90,   "¿Plan? ¡El plan es la diversión! ⚡"],
          [150,  "Cada caja es un portal secreto. ¡Confía en mí! 📦"],
          [250,  "Me emociono con TODO. ¿Viste eso? ¿¡VISTE!? 👀"],
          [400,  "Tengo amigos imaginarios y los presento a todos."],
          [600,  "Si me aburro, invento un juego nuevo en 3 segundos."],
          [850,  "La curiosidad no asustó al gato: lo hizo famoso. 😼"],
          [1150, "Hoy descubrí que el mundo es ENORME. ¡Vamos! 🌍"],
          [1500, "Conclusión: la vida es una aventura y tú vienes conmigo. 🚀"],
        ],
      },
    },
    quota: 2,
  },
  {
    id: 'christopher', name: 'Misifu', short: 'Misifu', realName: 'Christopher', age: 4, role: 'hijo', title: 'Guardián de los Juguetes',
    note: 'Araguaney · Octonautas · los Kratts',
    tree: '🌳', treeName: 'Araguaney',
    colors: { a: '#F5B500', b: '#5CB85C', c: '#E8D5A8', ink: '#6B5410' },
    palette: ['#FFC107', '#5CB85C', '#E8D5A8'],
    emoji: '🌻', isKid: true, caresBaby: false, petCared: true,
    pet: {
      name: 'Oreo', species: 'Gato blanco y negro · ESTP', img: window.IMG.christopher,
      kind: 'gato', face: '🐱', food: '🐟', toy: '🧶', dir: 'oreo',
      persona: {
        btn: '🎮 Reto de Oreo',
        idle: [
          "Todo en su lugar. Incluyéndome a mí, en el sofá. 😼",
          "Reglas claras, siesta segura. Así funciona esto. 📋",
          "Soy el jefe del orden. Mi oficina: la caja. 📦",
          "Inspección sorpresa: ¿guardaste los juguetes? 👀",
        ],
        carino: [
          "Cariño correcto, en el horario correcto. Aprobado. 👌",
          "Bien hecho. El cariño organizado es el mejor cariño.",
        ],
        comida: [
          "Comida puntual. Así me gusta: con orden. 🐟",
          "Ración correcta a la hora correcta. ¡Buena gestión!",
        ],
        jugar: [
          "Jugamos 10 minutos. Lo anoté en el reglamento. 🧶",
          "Orden primero, diversión después. ¡Ahora a jugar!",
        ],
        casa: [
          "A casa, que es donde todo está en su sitio. 🏠",
          "Mi casita: ordenada, puntual y sin desorden. 👌",
        ],
        phrases: [
          [0,    "Una cosa a la vez, y bien hecha. 😼"],
          [40,   "Las reglas existen por algo. Yo las escribí. 📋"],
          [90,   "Si no está guardado, no está terminado. 📦"],
          [150,  "Puntualidad es respeto. Llega a tiempo a mi siesta."],
          [250,  "Ordeno los juguetes por tamaño, color y ronroneo."],
          [400,  "Plan, lista y a ejecutar. Así se hacen las cosas. ✅"],
          [600,  "El desorden me da escalofríos en los bigotes."],
          [850,  "Liderar es dar el ejemplo… y vigilar que cumplas."],
          [1150, "Tradición: cena, orden, siesta. No se negocia."],
          [1500, "Conclusión: una casa ordenada es una casa feliz. 👌"],
        ],
      },
    },
    quota: 1,
  },
  {
    id: 'rachel', name: 'Che-Che', short: 'Che-Che', realName: 'Rachel', age: 1, role: 'bebé', title: 'Jefa de Ternura',
    note: 'Arce japonés · flor morada',
    tree: '🍁', treeName: 'Arce japonés',
    colors: { a: '#F48FB1', b: '#CE93D8', c: '#F8E7F3', ink: '#7A4A6A' },
    palette: ['#F48FB1', '#CE93D8', '#F3E5F5'],
    emoji: '🌷', isKid: false, isBaby: true, caresBaby: false, petCared: true,
    pet: {
      name: 'Nube', species: 'Gato blanco peludo · ESFJ', img: window.IMG.rachel,
      kind: 'gato', face: '🐱', food: '🐟', toy: '🧶', dir: 'nube',
      persona: {
        btn: '🤗 Cariño de Nube',
        idle: [
          "Cuido a Che-Che en silencio, como un angelito. ☁️",
          "Me gusta que estemos todos juntos y a salvo. 💛",
          "Soy tímida, pero mi corazón es enorme. 🤍",
          "Acomodo la cobijita y vigilo que nadie tenga frío.",
        ],
        carino: [
          "Gracias… me pongo feliz y un poquito tímida. 🥺",
          "Tu cariño me hace sentir en casa. 🤍",
        ],
        comida: [
          "Gracias por cuidarme. Comparto con quien lo necesite. 🐟",
          "Comidita rica. Ahora a cuidar a la bebé. 💛",
        ],
        jugar: [
          "Juego suavecito, no vaya a despertar a Che-Che. 🧶",
          "Me gusta jugar tranquila, cerquita de la familia.",
        ],
        casa: [
          "A casita, calientita y segura para todos. 🏠",
          "Mi lugar favorito: el regazo de la familia. 🤍",
        ],
        phrases: [
          [0,    "Cuidar a los que amo es lo que más me gusta. 🤍"],
          [40,   "Si alguien está triste, yo llego en silencio. ☁️"],
          [90,   "Recuerdo cómo le gusta su cobijita a cada quien. 💛"],
          [150,  "No hago ruido, pero siempre estoy para ti. 🥺"],
          [250,  "La familia unida me hace ronronear de paz. 😌"],
          [400,  "Guardo los detallitos que a otros se les olvidan."],
          [600,  "Un hogar tranquilo es mi mayor tesoro. 🏠"],
          [850,  "Te protejo aunque sea chiquita y peludita. 🤍"],
          [1150, "Mi amor es calladito, pero nunca se acaba. 💞"],
          [1500, "Conclusión: mientras nos cuidemos, todo está bien. ☁️"],
        ],
      },
    },
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
  // autocuidado diario (para todos) — 1 punto
  { id: 'sc_banar',     label: 'Bañarse',                          icon: '🛁', freq: 'diario', cat: 'autocuidado', pts: 1 },
  { id: 'sc_dientes_m', label: 'Cepillarse los dientes (mañana)',  icon: '🪥', freq: 'diario', cat: 'autocuidado', pts: 1 },
  { id: 'sc_dientes_t', label: 'Cepillarse los dientes (mediodía)', icon: '🪥', freq: 'diario', cat: 'autocuidado', pts: 1 },
  { id: 'sc_dientes_n', label: 'Cepillarse los dientes (noche)',   icon: '🪥', freq: 'diario', cat: 'autocuidado', pts: 1 },
  { id: 'sc_vestir',    label: 'Vestirse',                         icon: '👕', freq: 'diario', cat: 'autocuidado', pts: 1 },
  { id: 'sc_ropa',      label: 'Alistar la ropa',                  icon: '🧺', freq: 'diario', cat: 'autocuidado', pts: 1 },
  { id: 'sc_estudiar',  label: 'Hacer tarea / estudiar',           icon: '📚', freq: 'diario', cat: 'autocuidado', pts: 1 },
  // responsabilidades personales (1 punto)
  { id: 'p_plato_des',  label: 'Lavar su plato (desayuno)',        icon: '🍽️', freq: 'diario', cat: 'autocuidado', pts: 1 },
  { id: 'p_plato_alm',  label: 'Lavar su plato (almuerzo)',        icon: '🍽️', freq: 'diario', cat: 'autocuidado', pts: 1 },
  { id: 'p_plato_cen',  label: 'Lavar su plato (cena)',            icon: '🍽️', freq: 'diario', cat: 'autocuidado', pts: 1 },
  { id: 'p_cama',       label: 'Arreglar su cama',                 icon: '🛏️', freq: 'diario', cat: 'autocuidado', pts: 1 },
  { id: 'p_cuarto',     label: 'Limpiar su cuarto',                icon: '🧹', freq: 'diario', cat: 'autocuidado', pts: 1 },
  { id: 'p_juguetes',   label: 'Recoger sus juguetes',             icon: '🧸', freq: 'diario', cat: 'autocuidado', pts: 1 },
  // higiene semanal — los sábados (1 punto)
  { id: 'sc_peinar',     label: 'Peinarse el cabello',     icon: '💇', freq: 'semanal', day: 6, cat: 'autocuidado', pts: 1 },
  { id: 'sc_bloqueador', label: 'Ponerse bloqueador solar', icon: '🧴', freq: 'semanal', day: 6, cat: 'autocuidado', pts: 1 },
  { id: 'sc_unas',       label: 'Cortarse las uñas',        icon: '💅', freq: 'semanal', day: 6, cat: 'autocuidado', pts: 1 },
  // escuela (1 punto)
  { id: 'bolso',     label: 'Alistar el bolso',        icon: '🎒', freq: 'diario', cat: 'escuela', pts: 1 },
  { id: 'uniforme',  label: 'Alistar el uniforme',     icon: '👔', freq: 'diario', cat: 'escuela', pts: 1 },
  { id: 'tarea',     label: 'Hacer la tarea',          icon: '📚', freq: 'diario', cat: 'escuela', pts: 1 },
  // rutina de la bebé (Che-Che) — 1 punto
  { id: 'panal',     label: 'Cambio de pañal',         icon: '🧷', freq: 'diario', cat: 'bebe', pts: 1 },
  { id: 'desayuno',  label: 'Desayuno',                icon: '🥣', freq: 'diario', cat: 'bebe', pts: 1 },
  { id: 'merienda1', label: 'Merienda de la mañana',   icon: '🍎', freq: 'diario', cat: 'bebe', pts: 1 },
  { id: 'almuerzo',  label: 'Almuerzo',                icon: '🍲', freq: 'diario', cat: 'bebe', pts: 1 },
  { id: 'merienda2', label: 'Merienda de la tarde',    icon: '🍓', freq: 'diario', cat: 'bebe', pts: 1 },
  { id: 'cena',      label: 'Cena',                    icon: '🍽️', freq: 'diario', cat: 'bebe', pts: 1 },
  { id: 'ducha',     label: 'La ducha',                icon: '🛁', freq: 'diario', cat: 'bebe', pts: 1 },
  // domingo para todos — 1 punto
  { id: 'iglesia',   label: 'Ordenar la ropa para la iglesia', icon: '⛪', freq: 'semanal', day: 0, cat: 'orden', pts: 1 },
];
window.PDEF = id => (window.PERSONAL_DEFS || []).find(t => t.id === id);

/* Qué tareas personales tiene cada quien (1 punto c/u).
   Autocuidado + responsabilidades personales según la edad. */
const SC_DIENTES = ['sc_dientes_m', 'sc_dientes_t', 'sc_dientes_n'];
const P_PLATOS   = ['p_plato_des', 'p_plato_alm', 'p_plato_cen'];
const HIGIENE_SAB = ['sc_peinar', 'sc_bloqueador', 'sc_unas'];
window.PERSONAL = {
  mama:        ['sc_banar', ...SC_DIENTES, 'sc_vestir', 'sc_ropa', 'sc_estudiar', ...P_PLATOS, 'p_cama', 'p_cuarto', ...HIGIENE_SAB, 'iglesia'],
  papa:        ['sc_banar', ...SC_DIENTES, 'sc_vestir', 'sc_ropa', 'sc_estudiar', ...P_PLATOS, 'p_cama', 'p_cuarto', ...HIGIENE_SAB, 'iglesia'],
  taylor:      ['sc_banar', ...SC_DIENTES, 'sc_vestir', 'sc_ropa', 'sc_estudiar', ...P_PLATOS, 'p_cama', 'p_cuarto', ...HIGIENE_SAB, 'bolso', 'uniforme', 'iglesia'],
  emmeth:      ['sc_banar', ...SC_DIENTES, 'sc_vestir', 'sc_ropa', 'sc_estudiar', ...P_PLATOS, 'p_cama', 'p_juguetes', ...HIGIENE_SAB, 'bolso', 'uniforme', 'iglesia'],
  christopher: ['sc_banar', ...SC_DIENTES, 'sc_vestir', ...P_PLATOS, 'p_cama', 'p_juguetes', ...HIGIENE_SAB, 'iglesia'],
  rachel:      ['panal', 'desayuno', 'merienda1', 'almuerzo', 'merienda2', 'cena', 'ducha'],
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
    sub: '3–4 áreas de la casa por persona, según su edad',
    assign: {
      mama:        ['cocinar', 'cocina1', 'oficina2', 'sala2'],   // 4 áreas (adulta)
      papa:        ['platos', 'cochera', 'patio', 'pilas'],       // 4 áreas (adulto)
      taylor:      ['sala1', 'bano1', 'closet2'],                 // 3 áreas (10 años)
      emmeth:      ['cuartonin', 'oficina1', 'closet1'],          // 3 áreas (7 años)
      christopher: ['juguetes', 'comedor'],                       // 2 áreas (4 años)
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
