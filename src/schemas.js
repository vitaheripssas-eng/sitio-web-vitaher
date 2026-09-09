import { z } from 'zod'

const nombreSchema = z.string().trim().min(3, 'Mínimo 3 caracteres').max(80, 'Máximo 80 caracteres')
const telefonoSchema = z.string().trim().min(7, 'Teléfono inválido').max(20, 'Máximo 20 caracteres')
const correoSchema = z.string().trim().email('Correo inválido').max(100, 'Máximo 100 caracteres')
const correoOpcionalSchema = z.string().trim().max(100).optional().or(z.literal(''))
const requerido = (msg = 'Campo requerido') => z.string().trim().min(1, msg)

export const trabajaSchema = z.object({
  nombre: nombreSchema,
  correo: correoSchema,
  telefono: telefonoSchema,
  ciudad: z.string().trim().max(60).optional().or(z.literal('')),
  cargo: requerido('Selecciona un cargo'),
  formacion: z.string().trim().min(1).optional().or(z.literal('')),
  experiencia: z.string().trim().max(2000).optional().or(z.literal('')),
})

export const contactoSchema = z.object({
  nombre: nombreSchema,
  telefono: telefonoSchema,
  correo: correoOpcionalSchema,
  servicio: z.string().trim().min(1).optional().or(z.literal('')),
  mensaje: z.string().trim().min(10, 'Mínimo 10 caracteres').max(2000, 'Máximo 2000 caracteres'),
})

export const pqrsSchema = z.object({
  nombre: z.string().trim().max(80).optional().or(z.literal('')),
  tipoDoc: z.string().trim().optional().or(z.literal('')),
  numDoc: z.string().trim().max(20).optional().or(z.literal('')),
  telefono: z.string().trim().max(20).optional().or(z.literal('')),
  correo: correoOpcionalSchema,
  municipio: z.string().trim().max(60).optional().or(z.literal('')),
  direccion: z.string().trim().max(120).optional().or(z.literal('')),
  tipoSolicitud: requerido('Selecciona un tipo'),
  servicio: z.string().trim().optional().or(z.literal('')),
  fecha: z.string().trim().optional().or(z.literal('')),
  descripcion: z.string().trim().min(10, 'Mínimo 10 caracteres').max(2000, 'Máximo 2000 caracteres'),
})

export function formatZodErrors(error) {
  const map = {}
  for (const issue of error.issues) {
    const key = issue.path[0]
    if (!map[key]) map[key] = issue.message
  }
  return map
}
