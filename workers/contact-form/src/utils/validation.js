/**
 * Validación de datos del formulario con Zod
 */

import { z } from 'zod';

/**
 * Schema de validación para el formulario de contacto
 */
export const contactFormSchema = z.object({
  // Nombre: requerido, 2-100 caracteres, solo letras y espacios (incluye acentos españoles)
  name: z
    .string({
      required_error: 'El nombre es requerido',
      invalid_type_error: 'El nombre debe ser texto',
    })
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres')
    .regex(
      /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/,
      'El nombre solo puede contener letras y espacios'
    )
    .transform((val) => val.trim()),

  // Email: requerido, formato válido
  email: z
    .string({
      required_error: 'El email es requerido',
      invalid_type_error: 'El email debe ser texto',
    })
    .email('Formato de email inválido')
    .max(255, 'El email no puede exceder 255 caracteres')
    .toLowerCase()
    .transform((val) => val.trim()),

  // Teléfono: opcional, formato internacional
  phone: z
    .string()
    .regex(
      /^[\+]?[0-9\s\-\(\)]{9,15}$/,
      'Formato de teléfono inválido (debe tener 9-15 dígitos)'
    )
    .transform((val) => val.trim())
    .optional()
    .or(z.literal('')),

  // Topic: opcional, máximo 100 caracteres
  topic: z
    .string()
    .max(100, 'El tema no puede exceder 100 caracteres')
    .transform((val) => val.trim())
    .optional()
    .or(z.literal('')),

  // Asunto: requerido, 5-200 caracteres
  subject: z
    .string({
      required_error: 'El asunto es requerido',
      invalid_type_error: 'El asunto debe ser texto',
    })
    .min(5, 'El asunto debe tener al menos 5 caracteres')
    .max(200, 'El asunto no puede exceder 200 caracteres')
    .transform((val) => val.trim()),

  // Mensaje: requerido, 10-2000 caracteres
  message: z
    .string({
      required_error: 'El mensaje es requerido',
      invalid_type_error: 'El mensaje debe ser texto',
    })
    .min(10, 'El mensaje debe tener al menos 10 caracteres')
    .max(2000, 'El mensaje no puede exceder 2000 caracteres')
    .transform((val) => val.trim()),

  // Preferencia de contacto: requerido, enum
  preference: z.enum(['email', 'phone', 'any'], {
    required_error: 'La preferencia de contacto es requerida',
    invalid_type_error: 'Preferencia de contacto inválida (debe ser: email, phone, o any)',
  }),
});

/**
 * Valida los datos del formulario de contacto
 * @param {Object} data - Datos a validar
 * @returns {Object} Resultado de la validación
 * @returns {boolean} result.success - Si la validación fue exitosa
 * @returns {Object} result.data - Datos validados y sanitizados (si success es true)
 * @returns {Object} result.errors - Errores de validación (si success es false)
 */
export function validateContactForm(data) {
  try {
    const validatedData = contactFormSchema.parse(data);
    
    return {
      success: true,
      data: validatedData,
    };
  } catch (error) {
    // Si es un error de Zod, formatear los errores
    if (error instanceof z.ZodError) {
      const formattedErrors = {};
      
      error.errors.forEach((err) => {
        const field = err.path[0];
        if (!formattedErrors[field]) {
          formattedErrors[field] = err.message;
        }
      });
      
      return {
        success: false,
        errors: formattedErrors,
      };
    }
    
    // Error inesperado
    throw error;
  }
}

/**
 * Sanitiza un string removiendo HTML tags y caracteres peligrosos
 * @param {string} str - String a sanitizar
 * @returns {string} String sanitizado
 */
export function sanitizeString(str) {
  if (typeof str !== 'string') return '';
  
  return str
    // Remover HTML tags
    .replace(/<[^>]*>/g, '')
    // Remover caracteres de control
    .replace(/[\x00-\x1F\x7F]/g, '')
    // Trim whitespace
    .trim();
}

/**
 * Sanitiza todos los campos de un objeto de datos del formulario
 * @param {Object} data - Datos a sanitizar
 * @returns {Object} Datos sanitizados
 */
export function sanitizeContactData(data) {
  const sanitized = {};
  
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeString(value);
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
}

