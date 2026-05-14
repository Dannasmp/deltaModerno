export const users = [
  {
    id: 'EMP-001',
    name: 'Andrés Morales',
    email: 'andres.morales@empresa.com',
    password: 'andres123',
    role: 'Gerente de Producto',
    department: 'Producto',
    city: 'Bogotá',
    phone: '+57 301 234 5678',
    age: 34,
    since: '2019-03-15',
    projects: 7,
    tasks: 42,
    rating: 4.8,
    avatarSeed: 'andres',
    bio: 'Apasionado por construir productos digitales que generan impacto real.',
  },
  {
    id: 'EMP-002',
    name: 'Laura Jiménez',
    email: 'laura.jimenez@empresa.com',
    password: 'laura2024',
    role: 'Diseñadora UX',
    department: 'Diseño',
    city: 'Medellín',
    phone: '+57 312 876 5432',
    age: 28,
    since: '2021-07-01',
    projects: 4,
    tasks: 61,
    rating: 4.9,
    avatarSeed: 'laura',
    bio: 'Creo experiencias centradas en el usuario con foco en accesibilidad.',
  },
  {
    id: 'EMP-003',
    name: 'Carlos Rueda',
    email: 'carlos.rueda@empresa.com',
    password: 'carlos456',
    role: 'Desarrollador Senior',
    department: 'Tecnología',
    city: 'Cali',
    phone: '+57 320 555 9900',
    age: 31,
    since: '2020-01-20',
    projects: 9,
    tasks: 38,
    rating: 4.6,
    avatarSeed: 'carlos',
    bio: 'Full-stack developer con 8 años construyendo sistemas escalables.',
  },
  {
    id: 'EMP-004',
    name: 'Sofía Vargas',
    email: 'sofia.vargas@empresa.com',
    password: 'sofia789',
    role: 'Analista de Datos',
    department: 'Inteligencia',
    city: 'Barranquilla',
    phone: '+57 315 443 2211',
    age: 26,
    since: '2022-11-05',
    projects: 3,
    tasks: 55,
    rating: 4.7,
    avatarSeed: 'sofia',
    bio: 'Transformo datos en decisiones con modelos analíticos claros.',
  },
  {
    id: 'EMP-005',
    name: 'Mateo Torres',
    email: 'mateo.torres@empresa.com',
    password: 'mateo321',
    role: 'Director de Ventas',
    department: 'Comercial',
    city: 'Bogotá',
    phone: '+57 317 888 1122',
    age: 40,
    since: '2017-06-12',
    projects: 12,
    tasks: 29,
    rating: 4.5,
    avatarSeed: 'mateo',
    bio: 'Lidero equipos comerciales de alto rendimiento orientados a resultados.',
  },
]

export function getAvatarUrl(seed) {
  return `https://api.dicebear.com/7.x/personas/svg?seed=${seed}&backgroundColor=ffd5dc,ffdfbf,c0aede,d1d4f9,b6e3f4`
}

export function calcDaysSince(dateStr) {
  const d = new Date(dateStr)
  return Math.floor((new Date() - d) / 86400000)
}

export function fmtDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('es-CO', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}