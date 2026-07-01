/* ============================================================
   📚 BOLSO ESCOLAR — Horario de materias por día
   ------------------------------------------------------------
   Módulo integrado en la app de la familia (misma navegación,
   diseño y almacenamiento). Cada estudiante tiene su horario
   semanal; el módulo detecta el día y muestra las materias que
   hay que guardar en el bolso.
   ============================================================ */
(function () {
  window.BOLSO_STUDENTS = [
    { id: 'emmeth', nombre: 'Emmeth', grado: '1er Grado', emoji: '👦',
      tema: { a: '#2962FF', b: '#5B8CFF', c: '#E2E9FF', ink: '#11235A' } },
    { id: 'taylor', nombre: 'Taylor', grado: '4to Grado', emoji: '👧',
      tema: { a: '#7C3AED', b: '#B69DFF', c: '#EDE4FF', ink: '#3A1D6E' } },
  ];

  // getDay(): 0 Dom … 6 Sáb  →  clave del horario
  window.BOLSO_WEEKDAYS = [null, 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', null];
  window.BOLSO_DAY_LABELS = {
    lunes: 'Lunes', martes: 'Martes', miercoles: 'Miércoles', jueves: 'Jueves', viernes: 'Viernes',
  };

  // Icono por materia (para que sea amigable con los niños)
  window.BOLSO_SUBJECT_ICONS = {
    'Matemáticas': '🔢', 'Español': '📖', 'Ciencias': '🔬', 'Sociales': '🌎',
    'Estudios Sociales': '🌎', 'Inglés': '🇬🇧', 'Francés': '🇫🇷', 'Valores': '💛',
    'Cómputo': '💻', 'Ortografía': '✏️', 'Caligrafía': '🖋️', 'Catequesis': '🙏',
    'Deportiva': '⚽', 'Robótica': '🤖', 'Artes': '🎨', 'Artística': '🎨',
    'Artes Plásticas': '🎨', 'Expresión Artística': '🎭', 'Perseverancia Artística': '🎨',
  };
  window.bolsoIcon = function (materia) { return window.BOLSO_SUBJECT_ICONS[materia] || '📓'; };

  window.HORARIO_ESCOLAR = {
    emmeth: {
      nombre: 'Emmeth',
      grado: '1er Grado',
      lunes: ['Matemáticas', 'Valores', 'Cómputo', 'Ortografía', 'Inglés', 'Expresión Artística'],
      martes: ['Catequesis', 'Español', 'Ciencias', 'Estudios Sociales', 'Expresión Artística'],
      miercoles: ['Deportiva', 'Matemáticas', 'Ciencias', 'Español', 'Inglés'],
      jueves: ['Matemáticas', 'Español', 'Estudios Sociales', 'Inglés'],
      viernes: ['Matemáticas', 'Ciencias', 'Caligrafía', 'Artes Plásticas', 'Robótica'],
    },
    taylor: {
      nombre: 'Taylor',
      grado: '4to Grado',
      lunes: ['Español', 'Matemáticas', 'Sociales', 'Francés', 'Ortografía'],
      martes: ['Inglés', 'Matemáticas', 'Español', 'Perseverancia Artística', 'Artística'],
      miercoles: ['Ciencias', 'Español', 'Matemáticas', 'Deportiva', 'Artes'],
      jueves: ['Inglés', 'Ciencias', 'Valores', 'Español', 'Cómputo'],
      viernes: ['Ortografía', 'Ciencias', 'Matemáticas', 'Robótica', 'Sociales', 'Artes'],
    },
  };

  // Materias de un estudiante en un día (clave 'lunes'..'viernes')
  window.bolsoSubjects = function (studentId, weekdayKey) {
    const h = window.HORARIO_ESCOLAR[studentId];
    return (h && weekdayKey && h[weekdayKey]) ? h[weekdayKey] : [];
  };
})();
