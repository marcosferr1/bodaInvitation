// ─────────────────────────────────────────────────────────────
//  DATOS DEL EVENTO — TODO ESTO ES PLACEHOLDER, REEMPLAZAR.
//  Es el único archivo que hay que tocar para personalizar el sitio.
// ─────────────────────────────────────────────────────────────

export const evento = {
  novios: {
    // PLACEHOLDER
    ella: 'Camila',
    el: 'Julian',
    // Se usa en el <title> y en las tarjetas de WhatsApp
    juntos: 'Camila & Julian',
  },

  // Fecha y hora REALES: la cuenta regresiva apunta a la iglesia (18:00).
  // IMPORTANTE: dejar el offset (-03:00 = Argentina). Sin offset, la cuenta
  // regresiva se calcula en la zona horaria de cada invitado.
  fechaISO: '2027-01-16T18:00:00-03:00',
  fechaTexto: '16 de enero de 2027',
  diaSemana: 'Sábado',

  // Iglesia a confirmar. Cuando la tengan: lugar, direccion y mapaQuery
  // (dejar mapaQuery vacío oculta el mapa; con dirección aparece solo).
  ceremonia: {
    lugar: 'Iglesia a confirmar',
    direccion: '',
    hora: '18:00 hs (aprox.)',
    // Dirección tal cual va a la URL del mapa (sin key de Google necesaria)
    mapaQuery: '',
  },

  fiesta: {
    lugar: 'Las Marias Casona de Campo',
    direccion: 'Del Riego 2668 · Córdoba Capital',
    hora: 'Civil y fiesta · 19:00 hs (aprox.)',
    mapaQuery: 'Las Marias Casona de Campo, Del Riego 2668, Córdoba',
  },

  vestimenta: {
    codigo: 'No blanco, no beige',
    detalle: '',
  },

  tarjeta: {
    precios: [
      ['Pagando antes del 4 de diciembre', '$130.000'],
      ['Pagando antes del 4 de enero', '$140.000'],
    ],
    alias: 'Boda.julianycami',
    // Solo dígitos con código de país, sin + ni espacios.
    // (ej: 5493511234567). Vacío oculta el botón.
    whatsapp: '5493576468163',
    whatsappTexto: '+54 9 3576 46-8163',
  },

  // FALTA COMPLETAR — datos bancarios reales.
  // Van vacíos a propósito: un alias o CBU inventado en un sitio que ya tiene
  // los nombres y la fecha reales se lee como verdadero, y una transferencia
  // mal hecha no vuelve.
  regalos: {
    mensaje:
      'Tu presencia es nuestro mejor regalo. Si además querés ayudarnos con la luna de miel, te dejamos nuestros datos.',
    titular: '— completar —',
    alias: '— completar —',
    cbu: '— completar —',
    banco: '— completar —',
  },

  cierre: {
    // PLACEHOLDER
    mensaje: '¡Los esperamos!',
    firma: 'Camila & Julian',
  },

  meta: {
    // Imagen que se ve al compartir el link por WhatsApp (1200×630 px).
    // Recortada del video; reemplazar por otra si preferís.
    ogImage: '/images/og.jpg',
    descripcion:
      'Nos casamos el 16 de enero de 2027. Toda la info de la ceremonia y la fiesta, acá.',
  },
};

// URL del iframe de Google Maps. No necesita API key.
export const mapaUrl = (query) =>
  `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;

export default evento;
