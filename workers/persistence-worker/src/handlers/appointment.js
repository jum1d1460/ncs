/**
 * Appointment Handler
 * 
 * Maneja las solicitudes de primera cita
 */

import { validateAppointmentData } from '../utils/validation.js';
import { insertSubmission } from '../services/supabase.js';
import { sendAppointmentEmail } from '../services/email.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { ERROR_CODES } from '../config/constants.js';

/**
 * Manejar solicitudes de primera cita
 */
export async function handleAppointment(request, env) {
  try {
    // Validar método
    if (request.method !== 'POST') {
      return errorResponse('Método no permitido', 405, { method: request.method }, env);
    }

    // Parsear datos del request
    let data;
    try {
      data = await request.json();
    } catch (e) {
      return errorResponse('Datos JSON inválidos', 400, { error: e.message }, env);
    }

    // Validar datos de la cita
    const validationResult = validateAppointmentData(data);
    if (!validationResult.isValid) {
      return errorResponse(
        'Datos de cita inválidos',
        400,
        { errors: validationResult.errors },
        env
      );
    }

    // Preparar datos para Supabase
    const appointmentData = {
      type: 'appointment',
      name: data.name,
      email: data.email,
      phone: data.phone,
      preferred_date: data.preferred_date,
      preferred_time: data.preferred_time,
      reason: data.reason,
      urgency: data.urgency || 'normal',
      source: data.source || 'website',
      created_at: new Date().toISOString(),
      environment: env.ENVIRONMENT
    };

    // Guardar en Supabase
    const supabaseResult = await insertSubmission(appointmentData, metadata, env);
    if (!supabaseResult.success) {
      console.error('Error saving to Supabase:', supabaseResult.error);
      return errorResponse(
        'Error al guardar solicitud de cita',
        500,
        env.ENVIRONMENT === 'development' ? { error: supabaseResult.error } : null,
        env
      );
    }

    // Enviar email de confirmación
    const emailResult = await sendAppointmentEmail(data, env);
    if (!emailResult.success) {
      console.error('Error sending email:', emailResult.error);
      // No fallar la operación si el email falla
    }

    // Respuesta exitosa
    return successResponse({
      message: 'Solicitud de cita enviada exitosamente',
      appointment: {
        id: supabaseResult.data?.id,
        name: data.name,
        email: data.email,
        preferred_date: data.preferred_date,
        email_sent: emailResult.success
      }
    }, 201, env);

  } catch (error) {
    console.error('Appointment handler error:', error);
    return errorResponse(
      'Error interno al procesar solicitud de cita',
      500,
      env.ENVIRONMENT === 'development' ? { message: error.message } : null,
      env
    );
  }
}
