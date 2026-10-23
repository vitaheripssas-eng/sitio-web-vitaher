export const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER ?? '573142318040'
export const PHONE_DISPLAY = '+57 314 231 8040'
export const EMAIL = import.meta.env.VITE_EMAIL ?? 'coordinacionarauca2026@gmail.com'

export const FORM_ENDPOINT = import.meta.env.VITE_FORM_ENDPOINT ?? 'https://vitaherips.com/enviar.php'

// Los endpoints de radicado y seguimiento viven junto a enviar.php.
const FORM_BASE = FORM_ENDPOINT.replace(/[^/]*$/, '')
export const TRACKING_ENDPOINT =
  import.meta.env.VITE_TRACKING_ENDPOINT ?? `${FORM_BASE}gestion.php`
export const REGISTRO_ENDPOINT =
  import.meta.env.VITE_REGISTRO_ENDPOINT ?? `${FORM_BASE}registrar.php`

export const NAV_LINKS = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Servicios', href: '#servicios' },
  { label: 'Nosotros', href: '#nosotros' },
  { label: 'Trabaja Con Nosotros', href: '#trabaja' },
  { label: 'PQRS', href: '#pqrs' },
  { label: 'Contáctanos', href: '#contacto' },
]

export const STATS = [
  { value: '7', label: 'ÁREAS ASISTENCIALES' },
  { value: '2029', label: 'META IPS REFERENTE' },
  { value: 'L–V', label: '8AM–12M / 2PM–6PM' },
]

export const CUIDADO_STEPS = [
  {
    title: 'Valoración médica en casa',
    text: 'Diagnóstico, formulación y seguimiento',
  },
  {
    title: 'Enfermería y cuidado diario',
    text: 'Curaciones, medicación, signos vitales',
  },
  {
    title: 'Apoyo interdisciplinario',
    text: 'Psicología, nutrición, trabajo social, terapias',
  },
  {
    title: 'Bienestar sostenible',
    text: 'Del paciente y su entorno familiar',
  },
]

export const VALORES = [
  {
    num: '01',
    title: 'Excelencia',
    text: 'Calidad, responsabilidad y mejora continua en cada proceso clínico y administrativo.',
  },
  {
    num: '02',
    title: 'Humanidad',
    text: 'Atención con empatía, calidez y respeto por la dignidad de cada persona.',
  },
  {
    num: '03',
    title: 'Integridad',
    text: 'Honestidad, transparencia y ética en cada decisión que tomamos.',
  },
  {
    num: '04',
    title: 'Trabajo en equipo',
    text: 'Colaboración interdisciplinaria y comunicación efectiva entre profesionales.',
  },
]

export const ELIGENOS = [
  'Atención Humanizada',
  'Profesionales Calificados',
  'Calidad en el Servicio',
  'Atención Oportuna',
  'Seguridad del Paciente',
  'Mejora Continua',
  'Atención Integral',
]

export const SERVICIOS = [
  {
    icon: 'stethoscope',
    title: 'Medicina Domiciliaria',
    text: 'Valoración, diagnóstico, tratamiento y seguimiento en casa.',
    items: [
      'Consulta médica domiciliaria',
      'Formulación médica',
      'Seguimiento del tratamiento',
      'Remisiones cuando sean necesarias',
    ],
  },
  {
    icon: 'heart',
    title: 'Enfermería',
    text: 'Personal profesional para el cuidado en el hogar.',
    items: [
      'Administración de medicamentos',
      'Curaciones y manejo de heridas',
      'Cambio de sondas · Retiro de puntos',
      'Educación al paciente y familia',
    ],
  },
  {
    icon: 'user-check',
    title: 'Auxiliar de Enfermería',
    text: 'Apoyo permanente en el cuidado diario del paciente.',
    items: [
      'Higiene del paciente',
      'Toma de signos vitales',
      'Apoyo en movilización',
      'Acompañamiento domiciliario',
    ],
  },
  {
    icon: 'brain',
    title: 'Psicología',
    text: 'Bienestar emocional individual y familiar.',
    items: [
      'Ansiedad · Depresión · Estrés',
      'Duelo',
      'Adaptación a enfermedades',
      'Orientación familiar',
    ],
  },
  {
    icon: 'handshake',
    title: 'Trabajo Social',
    text: 'Acompañamiento social al entorno familiar.',
    items: [
      'Valoración sociofamiliar',
      'Redes de apoyo',
      'Gestión social',
      'Acompañamiento al cuidador',
    ],
  },
  {
    icon: 'apple',
    title: 'Nutricionista',
    text: 'Planes alimentarios según condición clínica.',
    items: [
      'Diabetes · Hipertensión · Obesidad',
      'Desnutrición',
      'Paciente renal',
      'Nutrición clínica del adulto mayor',
    ],
  },
  {
    icon: 'activity',
    title: 'Terapias de Rehabilitación',
    text: 'Recuperación funcional personalizada.',
    items: [
      'Terapia física',
      'Terapia ocupacional',
      'Terapia respiratoria',
      'Fonoaudiología',
    ],
  },
  {
    icon: 'home',
    title: 'Servicio de Cuidador',
    text: 'Acompañamiento permanente a pacientes dependientes.',
    items: [
      'Higiene y alimentación',
      'Movilización',
      'Administración de medicamentos',
      'Vigilancia permanente',
    ],
  },
  {
    icon: 'pill',
    title: 'Servicio Farmacéutico',
    text: 'Acceso seguro y oportuno a medicamentos e insumos.',
    items: [
      'Dispensación de medicamentos',
      'Educación sobre uso adecuado',
      'Seguimiento farmacoterapéutico',
      'Control de adherencia',
    ],
  },
]

export const CRONICOS = [
  'Hipertensión',
  'Diabetes',
  'EPOC',
  'Enf. cardiovascular',
  'Enf. renal',
  'Cuidados paliativos',
]

export const AGUDO = [
  'Valoración médica',
  'Seguimiento clínico',
  'Manejo farmacológico',
  'Coordinación interdisciplinaria',
]

export const PQRS_TIPOS = [
  {
    value: 'Petición',
    letra: 'P',
    title: 'Petición',
    text: 'Solicitud respetuosa o requerimiento de información.',
  },
  {
    value: 'Queja',
    letra: 'Q',
    title: 'Queja',
    text: 'Inconformidad frente a la atención recibida.',
  },
  {
    value: 'Reclamo',
    letra: 'R',
    title: 'Reclamo',
    text: 'Un servicio no fue prestado adecuadamente.',
  },
  {
    value: 'Sugerencia',
    letra: 'S',
    title: 'Sugerencia',
    text: 'Propuesta para mejorar procesos y servicios.',
  },
  {
    value: 'Felicitación',
    letra: 'F',
    title: 'Felicitación',
    text: 'Reconocimiento al buen servicio recibido.',
  },
]

export const MUNICIPIOS_ARAUCA = [
  'Arauca',
  'Arauquita',
  'Cravo Norte',
  'Fortul',
  'Puerto Rondón',
  'Saravena',
  'Tame',
]

export const PERFILES = [
  'Médico General',
  'Profesional de Enfermería',
  'Auxiliar de Enfermería',
  'Psicólogo',
  'Nutricionista',
  'Trabajador Social',
  'Terapeuta Físico',
  'Terapeuta Respiratorio',
  'Terapeuta Ocupacional',
  'Regente/Auxiliar de Farmacia',
  'Cuidadores',
  'Personal Administrativo',
  'Servicios Generales',
  'Sistemas',
  'Dermatología',
  'Medicina Interna',
  'Pediatría',
  'Intensivista',
]

const CARGOS_GRUPOS_BASE = [
  {
    label: 'Medicina',
    cargos: ['Médico General', 'Dermatología', 'Medicina Interna', 'Pediatría', 'Intensivista'],
  },
  {
    label: 'Enfermería',
    cargos: ['Profesional de Enfermería', 'Auxiliar de Enfermería'],
  },
  {
    label: 'Terapias',
    cargos: ['Terapeuta Físico', 'Terapeuta Respiratorio', 'Terapeuta Ocupacional'],
  },
  {
    label: 'Apoyo clínico',
    cargos: ['Psicólogo', 'Nutricionista', 'Trabajador Social', 'Regente/Auxiliar de Farmacia'],
  },
  {
    label: 'Cuidado y administrativo',
    cargos: ['Cuidadores', 'Personal Administrativo', 'Servicios Generales', 'Sistemas'],
  },
]

// Si algún día se agrega un perfil nuevo a PERFILES, aparece automáticamente en "Otros perfiles".
const cargosAgrupados = CARGOS_GRUPOS_BASE.flatMap((grupo) => grupo.cargos)
const cargosSinGrupo = PERFILES.filter((perfil) => !cargosAgrupados.includes(perfil))

export const CARGO_GRUPOS = cargosSinGrupo.length
  ? [...CARGOS_GRUPOS_BASE, { label: 'Otros perfiles', cargos: cargosSinGrupo }]
  : CARGOS_GRUPOS_BASE

export const SERVICIOS_SELECCION = [
  'Medicina Domiciliaria',
  'Enfermería',
  'Psicología',
  'Nutrición',
  'Terapias',
  'Farmacia',
  'Otro',
]

export const FORMACION_OPCIONES = [
  'Técnico',
  'Tecnólogo',
  'Profesional',
  'Especialista',
  'Posgrado',
]

export const TESTIMONIOS = [
  {
    nombre: 'María G. — Arauca',
    texto: 'La atención en casa fue excelente, el equipo muy humano y puntual. Mi padre se recuperó con tranquilidad.',
    servicio: 'Medicina Domiciliaria',
  },
  {
    nombre: 'Carlos P. — Arauca',
    texto: 'Enfermería muy profesional, curaciones y seguimiento sin tener que desplazarnos. Total confianza.',
    servicio: 'Enfermería',
  },
  {
    nombre: 'Familia R. — Arauca',
    texto: 'Psicología y trabajo social nos acompañaron en un momento difícil. Gracias por la calidez.',
    servicio: 'Psicología',
  },
]

export const FAQ = [
  {
    q: '¿Atienden solo en Arauca?',
    a: 'Sí, nuestra sede está en Arauca y la atención domiciliaria se presta en el municipio y alrededores según cobertura.',
  },
  {
    q: '¿Cómo agendo una cita?',
    a: 'Puedes agendar por el formulario de contacto, por WhatsApp al +57 314 231 8040 o por teléfono. Te orientamos sobre requisitos.',
  },
  {
    q: '¿Qué incluye la medicina domiciliaria?',
    a: 'Valoración médica, formulación, seguimiento y remisiones cuando sean necesarias, sin salir de casa.',
  },
  {
    q: '¿Cómo presento una PQRS?',
    a: 'Usa el formulario PQRS del sitio, indica tipo y descripción; también puedes escribirnos por WhatsApp o correo.',
  },
]

export const BLOG_POSTS = [
  {
    slug: 'cuidado-heridas-en-casa',
    title: '5 claves para el cuidado de heridas en casa',
    excerpt: 'Recomendaciones de enfermería para curaciones seguras y cuándo consultar.',
    date: '2026-08-15',
  },
  {
    slug: 'hipertension-control',
    title: 'Hipertensión: control y prevención',
    excerpt: 'Hábitos, seguimiento y señales de alerta para pacientes crónicos.',
    date: '2026-08-02',
  },
  {
    slug: 'salud-mental-familia',
    title: 'Salud mental y familia durante la recuperación',
    excerpt: 'El rol de la psicología y el acompañamiento familiar en casa.',
    date: '2026-07-20',
  },
]