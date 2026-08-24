export const WHATSAPP_NUMBER = '573142318040'
export const PHONE_DISPLAY = '+57 314 231 8040'
export const EMAIL = 'coordinacionarauca2026@gmail.com'

const BASE = import.meta.env.BASE_URL

export const NAV_LINKS = [
  { label: 'Nosotros', href: '#nosotros' },
  { label: 'Servicios', href: '#servicios' },
  { label: 'PQRS', href: '#pqrs' },
  { label: 'Trabaja Con Nosotros', href: '#trabaja' },
  { label: 'Contáctanos', href: '#contacto' },
]

export const STATS = [
  { value: '7', label: 'ÁREAS ASISTENCIALES' },
  { value: '2029', label: 'META IPS REFERENTE' },
  { value: 'L–V', label: '8AM–12M / 2PM–6PM' },
]

export const DESTACADOS = [
  {
    icon: 'heartPulse',
    img: `${BASE}img/cuidado-avanzado.jpg`,
    alt: 'Equipo de salud cuidando a un paciente en casa',
    title: 'Cuidado avanzado del paciente',
    text: 'Modelo interdisciplinario que optimiza la recuperación en casa con logística de suministros de alta respuesta.',
    items: ['Equipo interdisciplinario calificado', 'Logística de suministros de alta respuesta', 'Seguimiento continuo del paciente'],
    cta: { label: 'Agendar cita', href: '#contacto' },
  },
  {
    icon: 'stethoscope',
    img: `${BASE}img/medicina-domiciliaria.jpg`,
    alt: 'Médico realizando valoración a un paciente',
    title: 'Medicina domiciliaria',
    text: 'Valoración, diagnóstico, tratamiento y seguimiento médico sin salir del hogar.',
    items: ['Consulta médica en casa', 'Formulación y seguimiento', 'Remisiones cuando sean necesarias'],
    cta: { label: 'Ver servicios', href: '#servicios' },
  },
  {
    icon: 'user-check',
    img: `${BASE}img/enfermeria.jpg`,
    alt: 'Profesional de enfermería atendiendo a un paciente',
    title: 'Enfermería y cuidado diario',
    text: 'Profesionales y auxiliares que garantizan el cuidado experto de su familiar todos los días.',
    items: ['Administración de medicamentos', 'Curaciones y manejo de heridas', 'Educación al paciente y familia'],
    cta: { label: 'Ver servicios', href: '#servicios' },
  },
  {
    icon: 'activity',
    img: `${BASE}img/cronico.jpg`,
    alt: 'Acompañamiento a un paciente con enfermedad crónica',
    title: 'Atención integral al crónico',
    text: 'Seguimiento continuo a pacientes con enfermedades de larga duración para prevenir complicaciones.',
    items: ['Hipertensión · Diabetes · EPOC', 'Enfermedad cardiovascular y renal', 'Cuidados paliativos'],
    cta: { label: 'Ver servicios', href: '#servicios' },
  },
  {
    icon: 'pill',
    img: `${BASE}img/farmaceutico.jpg`,
    alt: 'Medicamentos e insumos del servicio farmacéutico',
    title: 'Servicio farmacéutico',
    text: 'Acceso seguro y oportuno a medicamentos e insumos, con educación sobre su uso adecuado.',
    items: ['Dispensación de medicamentos', 'Seguimiento farmacoterapéutico', 'Control de adherencia'],
    cta: { label: 'Contáctanos', href: '#contacto' },
  },
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

export const PQRS_TIPOS = ['Petición', 'Queja', 'Reclamo', 'Sugerencia', 'Felicitación']

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
  'Sistemas',
]

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