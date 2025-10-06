/**
 * Lead Handler
 * 
 * Maneja los leads obtenidos de formularios de tests
 */

import { validateLeadData } from '../utils/validation.js';
import { insertSubmission } from '../services/supabase.js';
import { sendLeadEmail } from '../services/email.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { ERROR_CODES } from '../config/constants.js';

/**
 * Manejar leads de formularios de tests
 */
export async function handleLead(request, env) {
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

    // Validar datos del lead
    const validationResult = validateLeadData(data);
    if (!validationResult.isValid) {
      return errorResponse(
        'Datos de lead inválidos',
        400,
        { errors: validationResult.errors },
        env
      );
    }

    // Preparar datos para Supabase
    const leadData = {
      type: 'lead',
      name: data.name,
      email: data.email,
      phone: data.phone,
      test_type: data.test_type,
      test_results: data.test_results,
      score: data.score,
      recommendations: data.recommendations,
      source: data.source || 'test_form',
      created_at: new Date().toISOString(),
      environment: env.ENVIRONMENT
    };

    // Guardar en Supabase
    const supabaseResult = await insertSubmission(leadData, metadata, env);
    if (!supabaseResult.success) {
      console.error('Error saving to Supabase:', supabaseResult.error);
      return errorResponse(
        'Error al guardar lead',
        500,
        env.ENVIRONMENT === 'development' ? { error: supabaseResult.error } : null,
        env
      );
    }

    // Enviar email con resultados del test
    const emailResult = await sendLeadEmail(data, env);
    if (!emailResult.success) {
      console.error('Error sending email:', emailResult.error);
      // No fallar la operación si el email falla
    }

    // Respuesta exitosa
    return successResponse({
      message: 'Lead guardado exitosamente',
      lead: {
        id: supabaseResult.data?.id,
        name: data.name,
        email: data.email,
        test_type: data.test_type,
        score: data.score,
        email_sent: emailResult.success
      }
    }, 201, env);

  } catch (error) {
    console.error('Lead handler error:', error);
    return errorResponse(
      'Error interno al procesar lead',
      500,
      env.ENVIRONMENT === 'development' ? { message: error.message } : null,
      env
    );
  }
}
