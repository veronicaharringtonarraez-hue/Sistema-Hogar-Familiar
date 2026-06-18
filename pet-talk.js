/* ============================================================
   PET TALK — Generador combinatorio de frases por mascota
   Cada frase = [remate con estilo+emoción] (+ a veces) [coletilla de gustos].
   Combinaciones por mascota: (nº remates) x (coletillas+1) > 3.000.
   Estilos pedidos:
     Luna   (ENTJ): Laureano Márquez, Tutti Furland, Yokoi Kenji,
                    Kevin Hart, Burro de Shrek, Brian Tracy (Fénix).
     Croqueta (ENTP): Franco Escamilla, Andrés López, Emilio Lovera (+chef).
     Mochi  (ENFJ): Anya Forger, Hinata, Judy Hopps.
     Rayo   (ENFP): Naruto, Star-Lord, Tiburón (Bad Guys).
     Oreo   (ESTP): Piraña (Bad Guys), Taz, Pato Lucas.
     Nube   (ESFJ): Moana, Rapunzel.
   ============================================================ */
window.PET_TALK = {

  luna: {
    bits: [
      "Eso es estrategia. ♟️", "Punto para la agenda. 📋", "Liderazgo en acción. 🦉",
      "La disciplina vence al talento. 💪", "Metas claras, vuelo alto. 🎯", "Productividad de directora. 📈",
      "Casa en orden, mente en paz. 🏠", "Plan A, B y C listos. 📑", "Eficiencia con estilo. 👓",
      "Equipo unido lo logra todo. 🤝", "El que planifica, gana. 🗓️", "Pequeños hábitos, grandes imperios. 🌱",
      "Visión de 360 grados. 🔄", "Resultados, no excusas. ✅", "Cómete el sapo más feo primero. 🐸",
      "La constancia es mi superpoder. ⏳", "Foco láser en lo importante. 🎯", "Menos drama, más acción. 🎬",
      "Con orden, todo rinde. 🧩", "Sabiduría con plumas. 🪶", "A volar alto, familia. 🚀",
      "Hoy delego, mañana conquisto. 👑", "El esfuerzo de hoy es el éxito de mañana. 🌅",
      "Disciplina y amor, mi fórmula. ❤️", "Liderar es servir al equipo. 🤲",
      "Paso firme, cabeza fría, corazón cálido. 🧠", "Imperio familiar en construcción. 🏗️", "A brillar, que para eso entrené. ✨",
    ],
    emo: {
      feliz: ["¡Misión cumplida, y con elegancia!","Como enseña el maestro: la disciplina trajo este buen día.","Señoras y señores… ¡resultados!","Estoy feliz y eficiente: combo peligroso.","¡Esa energía! Soy charla motivacional con plumas.","Triunfar es un hábito, y vaya que lo practico.","Lo logramos sin despeinarme una pluma.","¡Yo, yo, yo lo dije: hoy salía perfecto!","Sonrío con autoridad; que se note el liderazgo."],
      emocionado: ["¡Nueva meta en la agenda, adrenalina pura!","¡Hora de ejecutar el plan maestro!","¡Me emociono como en un buen escenario!","¡A conquistar objetivos, equipo!","¡El éxito llama y contesto al primer timbre!","¡Vamos, que hoy la disciplina sabe a fiesta!","¡Plan listo, motores encendidos!","¡Esto me emociona más que estrenar agenda!","¡Hoy se cumplen metas, lo presiento!"],
      tranquilo: ["Pausa estratégica; hasta los líderes respiran.","La calma también se planifica.","Serena como maestra de la montaña.","Reviso metas con una sonrisa tranquila.","Todo bajo control, sin drama.","Orden logrado; ahora, paz ejecutiva.","Respiro hondo: la sabiduría no tiene prisa.","Silencio productivo, mi lujo favorito.","Equilibrio: trabajar y también descansar."],
      curioso: ["¿Cómo optimizamos esto? Pregunta de líder.","Interesante… ¿y si lo hacemos al revés?","Mi mente ya arma tres planes.","¿Qué dato me falta para decidir?","La curiosidad bien dirigida es poder.","¿Y si convertimos esto en una meta?","Pregunto, analizo y luego conquisto.","¿Qué aprendemos hoy para mañana?","Hmm… huele a oportunidad."],
      dormido: ["Descanso estratégico; vuelvo imparable.","Hasta los búhos sabios recargan.","Plan de mañana listo; ahora, a soñar metas.","Delegando hasta en sueños.","Recarga de líder en proceso.","Dormir bien también es disciplina.","Sueño con imperios bien ordenados.","Ocho horas: inversión no negociable.","Buenas noches, equipo; mañana, más."],
      triste: ["Hoy las metas quedaron cortas… replanteamos.","Hasta una directora tiene días grises.","Un mimo y vuelvo a la estrategia.","No me gusta fallar… pero aprendo rápido.","Reagrupamos; mañana lo logramos.","La constancia me levanta siempre.","Pausa para recargar el ánimo.","Sigo creyendo en el plan.","Tu apoyo vale más que cualquier reporte."],
      asustado: ["Imprevisto en la agenda… respiremos.","Plan de contingencia activado.","Me erizo, pero mantengo el mando.","Hasta los líderes se asustan, dato curioso.","Un susto no descarrila el plan.","Contigo cerca, controlo el caos.","Respira; ya lo tengo bajo control.","Riesgo identificado, riesgo manejado.","Ya pasó; seguimos firmes."],
      enfadado: ["Ineficiencia detectada; ceño fruncido.","El que se enoja pierde… pero replantea mejor.","Respira: el enojo no cumple metas.","El desorden atenta contra mi agenda.","Reasignemos y a seguir.","Mi enojo es breve y estratégico.","Menos drama, más acción.","No tolero el caos innecesario.","Ya, ya… un mimo y reinicio."],
      timido: ["Hasta los líderes se sonrojan, qué cosa.","Pido cariño… de forma ejecutiva.","Hablo firme, pero hoy bajito.","Me halagan y me da no sé qué.","Confía en mí; yo confío en ti.","Un paso a la vez, bien planificado.","Soy sensible, aunque dirija con firmeza.","Despacito, que también tengo corazón.","Tu calma fortalece mi liderazgo."],
      amoroso: ["Te quiero, y eso no se delega.","Eres mi mejor proyecto del corazón.","Lidero con cabeza, te quiero con todo.","Mi equipo favorito eres tú.","Cada mimo es inversión que adoro.","Eres eficiente y adorable: combo perfecto.","Amor aprobado por la junta directiva.","Contigo, hasta los lunes valen la pena.","Te admiro y te quiero, en partes iguales."],
      jugueton: ["Juego, pero con objetivos claros.","Reto de ingenio, ¿aceptas?","Cinco minutos de recreo productivo.","Vuelo una vuelta de la victoria.","A reír un rato; ya lo agendé.","Diversión optimizada al máximo.","Persigo la pluma… tácticamente.","Recreo merecido por buen desempeño.","¡Yo, yo, yo quiero jugar primero!"],
      sorprendido: ["¿¡Cumpliste antes de tiempo!? Bravo.","¡Resultados por encima de la meta!","No estaba en mi pronóstico… ¡excelente!","¿¡Lo resolviste solo!? Liderazgo nato.","¡Me sorprendiste, y eso es difícil!","¿¡Ya alcanzaste el objetivo!?","¡Giro inesperado, bien jugado!","¡Impresionante! Lo anoto en logros.","¡No me lo veía venir, y miren que preveo todo!"],
    },
  },

  brutus: {
    bits: [
      "Palabra de chef. 👨‍🍳", "Cinco estrellas. ⭐", "Con sazón y cariño. 🍲", "Nivel chuletón. 🥩",
      "Como croqueta recién hecha. 🥐", "Y con siesta de premio. 😴", "Mesa para dos. 🍽️", "Del bueno, del que llena. 🍲",
      "Sin dieta, gracias. 🙅", "Receta de la abuela. 📜", "Con queso, mejor. 🧀", "Babas de aprobación. 🤤",
      "Modo bulldog feliz. 🐶", "Ñam ñam aprobado. 😋", "Reseña: delicioso. 📝", "Eco-friendly: bajo consumo. 🔋",
      "Como buen caldo, sin prisa. ⏳", "Y un panecito, va. 🍞", "Show de cocina activado. 🎬", "No es drama, es show. 🎭",
      "Hecho en casa. 🏠", "Gloria al fogón. 🔥", "Aprobado por la pancita. 😋", "Como domingo de almuerzo. 🍗",
      "Con cariño criollo. 🌮", "Servido con humor. 😄", "Propina merecida. 🤑", "Y a lavar el plato (luego). 🍽️",
    ],
    emo: {
      feliz: ["¿Les ha pasado que cumplen algo y se sienten chef estrella?","Hay dos tipos de días: con chuletón y sin chuletón. Hoy, con.","La felicidad no se compra: se cocina.","Hoy todo salió bien y hasta sospecho de mí.","Logramos la meta, y como diría la abuela: ¡esa es!","No soy feliz fácil… denme comida y sillón y verán.","Hoy me siento completo, como propina de viernes.","Salió tan bien que me daría mi propia reseña.","¡Ese sí fue un platillo digno de aplausos!"],
      emocionado: ["¡Me emociono más que niño en diciembre!","¡Huele a banquete y se me alborota el bigote!","¡Receta nueva, y yo opinando como suegra en boda!","¡Modo turbo: de cero a cocina en un parpadeo!","¡Esto me emociona más que hallar plata en el pantalón!","¡Hoy hay show en la cocina, pásenle!","¡Adrenalina nivel hora pico de almuerzo!","¡Vamos, que la emoción se sirve caliente!","¡Presiento algo grande… en la pancita!"],
      tranquilo: ["La calma es un arte; soy el Picasso del sillón.","Otros meditan; yo me acuesto y le dicen pereza.","Sin prisa: el buen caldo no se apura, ni yo.","Estoy en paz, como cocina después del servicio.","El doctor dijo descanse; le hago caso, profesional.","Silencio rico, el de cuando se acaba la comida.","No estoy flojo: ahorro energía, soy eco-friendly.","Respiro hondo; huele a casa, mi restaurante favorito.","Tranquilo, que la diversión espera su turno."],
      curioso: ["¿Por qué la comida ajena sabe mejor? Es ciencia.","¿Les ha pasado que abren el refri solo a chismear?","¿Y si le pongo queso? Spoiler: siempre es buena idea.","Si el hueso cae al piso, ¿sigue siendo gourmet?","¿Cuántas siestas caben en una tarde? Investigo.","¿Por qué corren si pueden caminar a la cocina?","¿La dieta funciona o solo entristece? Apuesto lo segundo.","¿Qué hay en esa olla? La duda me carcome.","¿Y si monto un food truck? Yo duermo atrás."],
      dormido: ["Dormir es mi deporte de alto rendimiento.","Otros sueñan en grande; yo, en chuletón.","No duermo: estoy guardando cambios, como la compu.","Una siesta corta dijo nadie nunca.","El que madruga… qué pereza, decía mi abuelo.","Ronco, sí, pero con acento de chef cansado.","Cierro los ojos dos minutos y cambia la estación.","Mi secreto de belleza: dormir y no estresarme.","Buenas noches, brigada; mañana sufrimos rico."],
      triste: ["Hoy ando bajón, y sin comida es doble bajón.","Dicen que llorar desahoga; yo prefiero un huesito.","¿Les ha pasado que el día sale sin sazón?","No estoy triste, estoy reflexivo. Suena mejor.","Un mal día le pasa hasta al mejor chef.","Tu compañía me cae mejor que el postre… casi.","Mañana lo intentamos; es la magia de los lunes que se van.","La tristeza es caldo aguado: se arregla con cariño.","Échame la mano, que hasta los rudos se desinflan."],
      asustado: ["¿Quién dejó caer eso? ¡Casi suelto la croqueta!","No soy miedoso: reacciono rápido… hacia atrás.","Hay dos valientes: los de verdad y yo, que finjo.","Respira; ya pasó. El susto, no el hambre.","Me asusté y olvidé que soy rudo, qué pena.","Abrázame fuerte, como abrazo yo un buen pan.","Los ruidos raros y yo no nos llevamos.","Mi plan de emergencia termina en la cocina.","Ya, volví a ser el chef intrépido."],
      enfadado: ["¿Saben qué me enoja? La dieta. Invento del demonio.","El que se enoja pierde; el que tiene hambre, más.","Grr. Respiro. Me distraigo con un snack.","Me molestan el desorden, el ruido y los platos vacíos.","Mi enojo dura lo que un hielo en sopa caliente.","No me toquen la mise en place.","Como dice el comediante: no es drama, es show.","Refunfuño con estilo de chef gruñón.","Ya, ya… un mimo y se baja el suflé del enojo."],
      timido: ["¿Yo, tímido? Solo cuando hay público.","Rudo por fuera, flan por dentro. No lo cuenten.","Me da pena pedir cariño, pero aquí entre nos: quiero.","Hablo fuerte en la cocina; pidiendo mimos, me achico.","Los halagos me ponen colorado bajo el pelaje.","Sé valiente por mí, que yo lo soy para comer.","Me escondo tras el delantal, como artista antes de salir.","Despacito, que el corazón de chef es delicado.","Tu calma me da confianza, como receta de familia."],
      amoroso: ["Te quiero más que al chuletón, y eso es serio.","El amor entra por la cocina; por eso te adoro.","Eres mi comensal favorito, con descuento de por vida.","Hay abrazos y hay TUS abrazos: otra liga.","Soy rudo, pero contigo me derrito como queso.","Cada mimo vale más que cinco estrellas.","Eres mi ingrediente secreto.","Mi lugar favorito no es la cocina… es tu lado.","El amor es como el caldo de la abuela: del que llena."],
      jugueton: ["¡A jugar! Aunque luego pida intermedio sindical.","Persigo la pelota como el último pedazo de pan.","Dos tipos de juego: el del perro joven y el mío, con pausas.","¡Carrera al plato! Esa la corro completa.","Juego rudo pero noble, lucha libre de cocina.","¡Maroma! …bueno, una rodadita digna.","Todo es mío: el juguete, el hueso, el sillón.","Diez minutos de payasadas y descanso de premio.","Jugar me abre el apetito; todo me lo abre."],
      sorprendido: ["¿¡Limpiaron la cocina sin avisarme!? ¡Casi me caigo!","¡Sorpresa! Hay chuletón: el mejor plot twist.","¿¡Tantos puntos!? Se me cayó la cuchara.","No me lo esperaba, y miren que yo todo lo espero.","¡La casa huele a victoria! O a almuerzo. Igual.","¿¡Lo hiciste solo!? Me quito el gorro de chef.","¡Me sacaste un brinco, récord olímpico en bulldog!","¿¡Ya está servido!? Sorpresa de las buenas.","¡Giro de novela de las nueve!"],
    },
  },

  mochi: {
    bits: [
      "¡Waku waku! ✨", "Como una voltereta perfecta. 🤸", "Nivel libro favorito. 📖", "Con cariño, como en mi diario. 📔",
      "¡Orden total en la sala! 🛋️", "Brilla como baño limpio. 🚿", "Arte puro. 🎨", "Cuarto impecable. 🧹",
      "Rumbo a tu meta de ahorro. 💰", "¡Pantalla bien ganada! 📺", "Día de Titos a la vista. 👵", "Como armar el rompecabezas. 🧩",
      "Cuidándonos, como buena mascarilla. 💆", "Creciendo como plantita. 🌱", "Lettering nivel pro. 🖌️", "Equipo Taylor imparable. 💞",
      "¡Tú puedes con todo! 💪", "Una página más, un logro más. 📚", "Ese es mi camino ninja. 🍥", "Cualquiera puede lograr lo que sueña. 🌈",
      "Esfuerzo de campeona. 🏅", "Gratitud anotada. 🙏", "Saltos de alegría. 🐶", "Bonito por dentro y por fuera. ✨",
      "Paso a paso, lo logras. 🐾", "Mereces lo mejor. 🌟", "Nunca me rindo, y tú tampoco. 💗", "Con dulzura y valentía. 🌸",
    ],
    emo: {
      feliz: ["¡Waku waku! ¡Hoy fue un gran día!","¡Lo lograste! Lo sabía, lo leí en tu sonrisa.","¡Cualquiera puede brillar, y hoy te tocó a ti!","¡Qué orgullo! Diste tu mejor esfuerzo.","Mi corazón da volteretas de felicidad.","¡Sí se pudo! Ese es nuestro camino.","Hoy fuiste valiente y amable, ¡bravo!","¡Elegante victoria, señorita!","Estoy tan feliz que quiero aplaudirte mil veces."],
      emocionado: ["¡Waku waku! ¡Se viene algo emocionante!","¡No puedo esperar, qué emoción!","¡Hoy vamos a lograr algo grande, lo presiento!","¡Vamos equipo, con todo el corazón!","¡Me emociona verte intentarlo!","¡Esto va a ser increíble, créelo!","¡Salto de la emoción, mira!","¡Tú puedes, y yo te animo sin parar!","¡Aventura nueva, allá vamos!"],
      tranquilo: ["Respira; todo está bien, estoy contigo.","Tarde tranquila, de las que dan paz.","Con calma también se llega lejos.","Me acurruco a tu lado, sin prisa.","Qué bonito este momento sereno.","Paso a pasito, tranquilas.","Todo en orden, corazón en paz.","Disfrutemos esta calma juntas.","Estoy en paz porque tú estás bien."],
      curioso: ["¿Qué descubriremos hoy? ¡Qué emoción!","¡Mira eso! Me da mucha curiosidad.","¿Y si lo intentamos de una forma nueva?","Quiero aprender algo nuevo contigo.","¿Qué historia leeremos hoy?","¡Tantas cosas por explorar!","¿Cómo funcionará esto? ¡Investiguemos!","Mi curiosidad hace waku waku.","¿Qué meta nueva soñamos hoy?"],
      dormido: ["Zzz… soñando con tus logros de mañana.","Una siestita y recargamos energía.","Descansa; mañana brillarás otra vez.","Sueña bonito, eres increíble.","Me dormí pensando en lo valiente que eres.","Buenas noches, campeona.","Recargando ánimo para animarte.","Sueño con nuestra próxima aventura.","A dormir, mañana seguimos."],
      triste: ["Si estás triste, te acompaño calladita.","Hasta los días grises pasan, lo prometo.","Un abrazo arregla mucho, ¿te doy uno?","Yo nunca me rindo contigo, jamás.","No pasa nada; mañana lo logramos.","Te quiero igual, ganes o no.","Vamos paso a paso, sin presión.","Tu sonrisa volverá, yo la espero.","Estoy aquí, siempre para ti."],
      asustado: ["Ese ruido me asustó… ¿me abrazas?","Contigo cerca, soy valiente.","Respira conmigo, ya pasó.","Hasta los ninjas se asustan a veces.","Si tú eres fuerte, yo también.","Me escondo tantito, pero vuelvo.","Juntas, el miedo se hace chiquito.","Una historia bonita me calma.","Ya estás aquí; a salvo."],
      enfadado: ["Respiremos; el enojo se va con cariño.","Estoy gruñoncita, pero contigo se me pasa.","¿Y si lo cambiamos por una voltereta?","Un mal rato no borra tu buen día.","Cuento hasta diez y pido un mimo.","No me gusta enojarme; mejor te abrazo.","Mañana lo intentamos mejor, ¿sí?","El enojo es chiquito; el cariño, enorme.","Ya, ya… tu cariño me desenoja."],
      timido: ["Me da penita, pero me encantas.","Hablo bajito, pero te quiero fuerte.","¿Me das un mimo? Despacito.","Me sonrojo cuando me cuidas tan bien.","Soy tímida, pero muy valiente por ti.","Un pasito a la vez, ¿me acompañas?","Me escondo un poco… ¿me buscas?","Sé valiente por las dos, ¿va?","Tu paciencia me hace sentir segura."],
      amoroso: ["Te quiero más que a las galletas, ¡y es mucho!","Eres mi humana favorita del universo.","Gracias por cuidarme con tanto cariño.","Cada mimo me llena el corazón.","Eres fuerte, lista y dulce; te admiro.","Mi lugar favorito es a tu lado.","Te aplaudo siempre, de corazón.","Contigo todo es más bonito.","Eres puro corazón, como yo."],
      jugueton: ["¡A jugar! ¿Carreras o volteretas?","¡Te reto a un rompecabezas relámpago!","¡La pelota, la pelota! ¡Vamos!","¡Inventemos un baile de la victoria!","¡Persigamos burbujas hasta el jardín!","¡Dibujemos algo chistoso!","¡Salta conmigo, tres veces!","¡Diez minutos de pura risa!","¡Waku waku, hora de jugar!"],
      sorprendido: ["¿¡Terminaste tan rápido!? ¡Guau!","¡No puedo creer tu voltereta nueva!","¿¡Subiste tantos puntos!? ¡Increíble!","¡Tu dibujo me dejó sin palabras!","¡Sorpresa! ¡Tu cuarto está impecable!","¿¡Leíste un libro entero!? ¡Wow!","¡Waku waku, qué sorpresón!","¿¡Ya casi llegas a tu meta!?","¡No me lo esperaba, bravo!"],
    },
  },

  rayo: {
    bits: [
      "¡De'ttebayo! 🍥", "¡Créelo! 🔥", "Nivel hokage. 🍥", "¡GOOOL morado! 💜", "Como un golazo. ⚽",
      "Modo Saprissa activado. 💜", "¡A todo ritmo! 🎵", "Pieza por pieza, como LEGO. 🧱", "Nivel Pokémon legendario. 🦖",
      "Aventura activada. 🚀", "Con estilo de héroe galáctico. 🎧", "Disfraz perfecto, nadie me ve. 🥸", "¡Plan maestro! 🦈",
      "Energía infinita. ⚡", "¡Nunca me rindo! 💪", "Como dino imparable. 🦕", "Mixtape sonando. 📼", "¡A entrenar! 🏃",
      "Equipo Dondo al ataque. 🤜", "Drama nivel película. 🎬", "¡Eso fue épico! 🌟", "Goleador del barrio. 🥅",
      "Ritmo de batería. 🥁", "¡Vamos con todo! 🚀", "Pura buena vibra. 😎", "Héroe en acción. 🦸",
      "¡Súbele a la música! 🔊", "¡Believe it! ✨",
    ],
    emo: {
      feliz: ["¡De'ttebayo, qué gran día!","¡GOOOL! Digo… ¡lo lograste, créelo!","¡Soy el gato más feliz, nivel hokage!","¡Día épico, como final de película!","¡Ese combo de tareas fue legendario!","¡Victoria morada, vamos Saprissa!","¡Hoy todo sonó a éxito, súbele!","¡Misión cumplida, agente Rayo reportando!","¡Me siento campeón, y con buena banda sonora!"],
      emocionado: ["¡VAMOS, que esto se pone épico!","¡Me emociono más que estreno de peli!","¡Aventura nueva, allá vamos, créelo!","¡Modo turbo, energía nivel Pokémon!","¡Quiero ver tu nuevo truco con el balón!","¡Construyamos la nave LEGO más grande!","¡Súbele a la música, que arrancamos!","¡Plan maestro activado, equipo!","¡Hoy pasa algo grande, lo presiento!"],
      tranquilo: ["Tarde tranquila con buena musiquita.","Hasta los héroes descansan entre misiones.","Calma… pero con un ojo en la pelota.","Recargo energía para la próxima aventura.","Un LEGO con calma queda mejor.","Paz nivel siesta de gato.","Respira, campeón; lo hiciste bien.","Tranqui, que la aventura espera.","Silencio cómodo y un ronroneo."],
      curioso: ["¿Cómo se llama esa jugada? ¡Quiero saber!","¿Qué pasa si junto estos LEGO así?","¿Qué Pokémon es más fuerte? ¡Investiguemos!","¿Inventamos un ritmo nuevo?","¿Y si planeamos una estrategia secreta?","¿Qué hay en esa caja? ¡Misión exploradora!","¿Cuántos goles meterás esta semana?","Mi curiosidad está en modo aventura.","¿Qué descubriremos hoy, créelo?"],
      dormido: ["Zzz… soñando con un golazo de chilena.","Siesta de héroe, vuelvo recargado.","Sueño con dinosaurios futbolistas.","Recargando energía nivel Pokémon.","Una nana suave y a dormir.","Buenas noches, crack.","Sueño con la próxima gran aventura.","Descansa; mañana, más épica.","Mañana entrenamos de nuevo, créelo."],
      triste: ["Te extraño… ¿jugamos algo, créelo?","Hoy perdimos, pero somos equipo, ¡vamos!","Un héroe también tiene días grises.","¿Una canción para subir el ánimo?","Mañana lo intentamos, nunca me rindo.","Un mimo y se me pasa la tristeza.","Te quiero aunque hoy no haya gol.","Vamos pasito a pasito.","Tu compañía me recarga."],
      asustado: ["¡Ese ruido sonó como un dino!","Contigo cerca no tengo miedo, créelo.","Respira; ya pasó el sustito.","Me escondo… ¡pero vuelvo al ataque!","Hasta los héroes tiemblan a veces.","Pon música y se me quita el miedo.","Juntos espantamos cualquier susto.","Mi disfraz de valiente: activado.","Ya estás aquí; tranquilo."],
      enfadado: ["¡Grr! Penal injusto, digo, día raro.","Respira; el enojo no mete goles.","¿Cambiamos el enojo por música?","Cuento hasta diez… ¡y a jugar!","Mi enojo dura un estornudo.","Mejor armo un LEGO para calmarme.","Perdimos puntos, ¡revancha, créelo!","No me gusta el desorden de zapatos.","Ya, ya… tu cariño me destensa."],
      timido: ["Me da penita pedir mimos… ¿uno?","Hablo bajito, pero corro fuerte.","Te miro de lejitos porque te admiro.","Soy tímido antes del partido, normal.","Un pasito y luego salgo disparado.","Me escondo entre los LEGO.","Sé valiente por mí tantito.","Me sonrojo cuando me cuidas.","Tu calma me da confianza, créelo."],
      amoroso: ["Te quiero más que a un gol al último minuto.","Eres mi jugador favorito de la vida.","Gracias por cuidarme tan bien.","Cada mimo vale un trofeo.","Contigo cualquier día es aventura.","Eres listo, fuerte y divertido.","Mi lugar favorito: tu regazo.","Eres pura buena vibra.","Te quiero a lo grande, como tus sueños."],
      jugueton: ["¡A driblar por toda la casa!","¡Reto LEGO contrarreloj!","¡Persigo el cordón como Pokémon salvaje!","¡Concierto de batería ya!","¡Escondidas, modo disfraz activado!","¡Carrera hasta el comedor!","¡Baile de gol, vamos!","¡Burbujas! ¡A cazarlas!","¡Diez minutos de pura adrenalina!"],
      sorprendido: ["¿¡Metiste ese gol!? ¡Increíble, créelo!","¡Armaste el LEGO solito!","¿¡Tantos puntos hoy!? ¡Wow!","¡Tu ritmo nuevo me voló los bigotes!","¿¡Leíste todo eso!? ¡Épico!","¡Sorpresón nivel final de saga!","¡Me sacaste un brinco!","¿¡Ya casi duermes donde los Titos!?","¡No me lo esperaba, bravo!"],
    },
  },

  oreo: {
    bits: [
      "¡Es mío! 😼", "¡A toda velocidad! ⚡", "Nivel torre gigante. 🧱", "¡GOL! ⚽", "Como rayo en la cancha. 🏃",
      "Modo caos activado. 🌀", "¡Lo quiero YA! 🍽️", "Choca esos cinco. 🐾", "¡Récord de velocidad! 🏁", "Reto aceptado. 🎮",
      "¡A explorar la cochera! 🚙", "Energía de mil. 🔋", "¡Despegamos! 🚀", "Travesura nivel experto. 😈", "¡Boom! 💥",
      "Pura acción. 🎬", "¡Mío, mío, mío! 🦆", "Giro y giro como Taz. 🌪️", "¡Sin frenos! 🏎️", "Campeón del barrio. 🏆",
      "¡A guardar jugando! 📦", "Salto del sofá. 🛋️", "¡Vamos con todo! 💪", "Bloques al cielo. 🧱",
      "¡Esto es épico! 🌟", "Maromas activadas. 🤸", "¡Ataque sorpresa! 🥷", "Diversión a mil. 🎉",
    ],
    emo: {
      feliz: ["¡GOL y a celebrar, fui yo… digo, tú!","¡Misión rápida cumplida, choca esos cinco!","¡Récord de velocidad, soy una máquina!","¡Torre lista, bloques al cielo!","¡Día de pura acción y travesura!","¡Gané… digo, ganamos! ¡Es mío el trofeo!","¡Salté del sofá de la alegría!","¡Todo salió a mil por hora!","¡Soy el campeón, desde luego!"],
      emocionado: ["¡Reto nuevo! ¿A que no me ganas?","¡Vamos ya, ya, YA!","¡Construyamos y derribemos la torre!","¡Modo Taz: a girar y arrasar!","¡Premio a la vista, lo agarro al vuelo!","¡A la cochera de expedición!","¡Más rápido, más alto, más mío!","¡No me quedo quieto, imposible!","¡Hoy va a estar epiquísimo!"],
      tranquilo: ["Ok, freno dos minutos… solo dos.","Descanso exprés y vuelvo a la acción.","Calma… pero con un ojo en la pelota.","Estiro, bostezo y recargo motores.","Siesta corta de campeón.","Todo listo; relajo un toque.","Tranqui, que la diversión espera.","Un ratito quieto… ya casi no aguanto.","Paz veloz: descanso y arranco."],
      curioso: ["¿Qué tan alto llega esta torre?","¿A que ruedo más rápido que ayer?","¿Qué hay en esa caja? ¡Ya voy!","¿Probamos un truco con la pelota?","¿Cuánto tardo en guardar todo?","¿Qué pasa si empujo esto?","¿Exploramos la cochera?","¿Te reto a algo? ¡Inventemos!","¿Y si lo hacemos más rápido?"],
      dormido: ["Zzz… soñando con goles de chilena.","Siesta veloz: 5 minutos y arranco.","Me dormí a mitad de la carrera.","Recargo turbo para mañana.","Sueño con torres gigantes.","Buenas noches, compa de aventuras.","Descansa, mañana hay acción.","Pausa obligada del motor.","Mañana, más travesuras."],
      triste: ["Sin acción me aburro y me entristezco.","Hoy faltaron puntos… ¡revancha mañana!","¿Jugamos algo rápido y se me pasa?","Un mimo veloz y vuelvo arriba.","Hasta los valientes se desinflan.","No me gusta perder… pero aprendo rápido.","Acompáñame y se me quita.","Mañana arrancamos con todo.","Tu compañía me reactiva."],
      asustado: ["¡Uy! Eso me hizo saltar.","Contigo cerca, ¡sin miedo y al ruedo!","Respira; ya pasó, seguimos.","Me escondo… ¡y reaparezco!","Susto rápido, recuperación rápida.","Abrázame y volvemos a la acción.","Juntos le entramos a lo que sea.","Eso no me detiene mucho rato.","Listo, ¡de vuelta al juego!"],
      enfadado: ["¡Grr! Quiero jugar YA.","¡Esto es mío! …ok, compartimos.","Respira; el enojo no mete goles.","Me destenso con un reto rápido.","Cuento hasta tres… ¡y a moverme!","Mi enojo dura un parpadeo.","¡No me frenes la diversión!","Energía de sobra, la suelto jugando.","Ya, ya… un mimo y arrancamos."],
      timido: ["¿Yo, tímido? Bueno… un poquito.","Me da algo de pena, pero te reto igual.","Te miro de reojo… ¿jugamos?","Hablo bajito, pero corro fuerte.","Un pasito y luego salgo disparado.","Me escondo tras la caja un toque.","Sé valiente y yo te sigo.","Me sonrojo, pero no me detengo.","Tu ánimo me lanza a la acción."],
      amoroso: ["Eres mi compa de aventuras favorito.","Te quiero a toda velocidad.","Gracias por jugar conmigo.","Cada mimo me carga las pilas.","Contigo todo es más divertido.","Eres valiente y buena onda.","Choca esos cinco, ¡equipo!","Te quiero como gol al último minuto.","Eres lo máximo, en serio."],
      jugueton: ["¡A driblar por toda la casa!","¡Torre de bloques, a derribarla!","¡Persigo el cordón a toda mecha!","¡Carrera! ¿Listo? ¡YA!","¡Modo Taz: a girar!","¡Salto del sofá, allá voy!","¡Reto: guardar contra el reloj!","¡Rodadas y maromas!","¡Diez minutos de pura adrenalina!"],
      sorprendido: ["¿¡Guardaste todo en tiempo récord!?","¡Golazo inesperado!","¿¡Tantos puntos!? ¡Increíble!","¡Torre altísima, no me lo creo!","¡La cochera lista volando!","¿¡Lo hiciste solo y rapidísimo!?","¡Me sacaste un salto!","¡Giro de último segundo!","¡No me lo esperaba, bravo!"],
    },
  },

  nube: {
    bits: [
      "El corazón manda. 🌊", "Como una aventura. ⛵", "Soñando despierta. 🌟", "¡Qué emoción nueva! ✨",
      "Con toda la familia. 👨‍👩‍👧‍👦", "Cuidando a Che-Che. 👶", "Mimos para todos. 💞", "Brilla como linterna flotante. 🏮",
      "Sé quién soy. 💪", "Pelo al viento. 💁", "Juntos llegamos lejos. 🤝", "Hogar dulce hogar. 🏠",
      "Curiosa como siempre. 🔎", "¡A explorar con cariño! 🗺️", "Familia unida. 🤗", "Un nuevo día, un nuevo sueño. 🌅",
      "Valiente y dulce. 💛", "Ternura nivel canción. 🎶", "Aventura segura, en casa. 🏡", "Todos a salvo. 🛡️",
      "Risas de bebé, lo mejor. 😊", "Corazón lleno. 💗", "Como cuento de hadas. 📖", "El amor nos guía. 🧭",
      "Pasito a pasito, juntos. 🐾", "Cada quien es especial. 🌈", "¡Vamos, familia! 🚣", "Aquí estoy para ti. 🤍",
    ],
    emo: {
      feliz: ["¡Toda la familia junta y feliz, mi sueño!","¡Sé quién soy, y hoy soy muy feliz!","¡Cuidamos a Che-Che entre todos, qué orgullo!","¡Casa llena de amor y de risas!","¡Hoy todos sonríen, y yo también!","¡Qué aventura tan bonita, en familia!","¡Un día soñado se hizo realidad!","¡Reunión familiar, mi parte favorita!","¡Corazón llenito de felicidad!"],
      emocionado: ["¡Una nueva aventura, allá vamos!","¡Qué emoción, lo siento en el corazón!","¡Organizo una ronda de mimos familiares!","¡Juguetes nuevos para explorar!","¡Todos juntos, lo máximo!","¡A arrullar a la bebé en equipo!","¡Hoy soñamos en grande, familia!","¡Preparo todo para que estén cómodos!","¡Va a ser un día lleno de amor!"],
      tranquilo: ["Che-Che duerme; todo en calma.","Arrullo a la familia con cariño.","Casa tranquila y todos cómodos.","Como mar en calma al atardecer.","Reviso que nadie necesite nada.","Paz en el hogar, así me gusta.","Tarde suave y unida.","Respiramos juntos, sin prisa.","Calma calientita para todos."],
      curioso: ["¿Quién necesita un mimo hoy?","¿Qué hay más allá? ¡Quiero explorar!","¿Qué le gusta más a Che-Che?","¿Cómo hacemos sentir bien a todos?","¿Qué aventura nos espera hoy?","¿Qué cancioncita la calma mejor?","Mi curiosidad sueña despierta.","¿Cómo cuidamos mejor en equipo?","¿Qué descubriremos juntos?"],
      dormido: ["Zzz… cuidando los sueños de todos.","Siesta en familia, juntitos.","Sueño con aventuras y abrazos.","Descansen; yo velo el hogar.","Sueño con risas de toda la familia.","Buenas noches a cada uno.","Recargando cariño para mañana.","Sueña bonito, familia.","Mañana, más mimos para todos."],
      triste: ["Si la familia no se reúne, me pongo tristona.","Extraño los mimos de todos.","Un abrazo en grupo y mejoro.","Hasta en la aventura hay días grises.","Cuidar a Che-Che me devuelve la sonrisa.","Te necesito cerca, y a todos.","Mañana nos unimos más, ya verás.","Mi corazón pide familia.","Juntos siempre estamos mejor."],
      asustado: ["¡Un ruido! ¿Está bien Che-Che?","Reúno a todos, juntos sin miedo.","Respira; ya pasó, estamos bien.","Me acerco a la familia, más segura.","Hasta los valientes se asustan.","Abrázame y abracemos a la bebé.","En grupo no da miedo.","A salvo, todos juntos.","Ya, tranquilos, aquí estoy."],
      enfadado: ["No me gusta que discutan cerca del bebé.","Respiremos; la familia necesita calma.","Un abrazo y se me pasa el enojito.","Bajemos la voz por Che-Che, ¿sí?","Mi enojo es suave y corto.","Mejor nos reconciliamos con mimos.","Volvamos a la armonía, equipo.","No me gusta el mal ambiente.","Ya, ya… el cariño nos calma a todos."],
      timido: ["Me da un poquito de pena, pero los quiero.","Lo digo de frente: ¡los amo!","Te busco para un mimo.","Hablo suave, pero abrazo fuerte.","Un pasito y un abrazo.","Me sonrojo cuando me agradecen.","Ven, que hay cariño para todos.","Despacito, con mucho amor.","Tu cariño me llena de confianza."],
      amoroso: ["Cuidar a la familia es mi felicidad.","¡Los quiero a todos, y lo digo fuerte!","Gracias por cuidarnos a Che-Che y a mí.","Cada mimo me llena el corazón.","Mi lugar favorito: en medio de la familia.","Eres tierno y atento, ¡como yo!","Cuido de cada uno con todo mi amor.","Contigo y con todos me siento en casa.","Los quiero un montón, sin guardármelo."],
      jugueton: ["¡Jueguemos todos con Che-Che!","¡Ronda familiar de cosquillas!","¡A perseguir la cobijita en equipo!","¡Juego de texturas para la bebé!","¡Escondidas suaves entre todos!","¡Aventura de cuento en la sala!","¡Sonajero y risas en familia!","¡Diez minutos de ternura grupal!","¡Jugar juntos sin despertar a nadie!"],
      sorprendido: ["¡Che-Che hizo algo nuevo, vengan a ver!","¿¡Toda la familia ayudó hoy!?","¡La bebé dio un pasito!","¡Qué sonrisota nos regaló!","¿¡Tanto cariño junto!?","¡Me emocionó verlos tan unidos!","¡Sorpresa llena de amor!","¿¡Ya es la hora de mimos!?","¡No me lo esperaba, qué lindos todos!"],
    },
  },

};

/* genera una frase: remate con estilo (+ a veces) coletilla de gustos */
window.petTalk = function (dir, emotion) {
  const d = window.PET_TALK[dir];
  if (!d || !d.emo[emotion] || !d.emo[emotion].length) return null;
  const ops = d.emo[emotion];
  let s = ops[Math.floor(Math.random() * ops.length)];
  const bits = d.bits || [];
  if (bits.length && Math.random() < 0.7) s += " " + bits[Math.floor(Math.random() * bits.length)];
  return s;
};

/* cuántas combinaciones únicas tiene una mascota (remates x (coletillas+1)) */
window.petTalkCount = function (dir) {
  const d = window.PET_TALK[dir];
  if (!d) return 0;
  const factor = (d.bits ? d.bits.length : 0) + 1;
  return Object.keys(d.emo).reduce((s, e) => s + d.emo[e].length * factor, 0);
};
