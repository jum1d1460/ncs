/**
 * Servicio de Supabase para almacenamiento de submissions
 */

import { createClient } from '@supabase/supabase-js';
import { TIMEOUTS } from '../config/constants.js';

/**
 * Crea un cliente de Supabase con las credenciales del worker
 * @param {Object} env - Variables de entorno
 * @returns {Object} Cliente de Supabase
 */
function getSupabaseClient(env) {
  const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = env;

  if (!SUPABASE_URL) {
    throw new Error('SUPABASE_URL no configurado');
  }
  if (!SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY no configurado');
  }

  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    global: {
      headers: {
        'x-worker-client': 'contact-form-worker',
      },
    },
  });
}

/**
 * Inserta una submission en la base de datos
 * @param {Object} contactData - Datos del formulario validados
 * @param {Object} metadata - Metadata (IP, user agent)
 * @param {Object} env - Variables de entorno
 * @returns {Promise<Object>} Resultado de la inserción
 */
export async function insertSubmission(contactData, metadata, env) {
  try {
    // Crear cliente
    const supabase = getSupabaseClient(env);

    // Preparar datos para inserción
    const insertData = {
      name: contactData.name,
      email: contactData.email,
      phone: contactData.phone || null,
      topic: contactData.topic || null,
      subject: contactData.subject,
      message: contactData.message,
      preference: contactData.preference,
      ip_address: metadata.ip || null,
      user_agent: metadata.userAgent || null,
      status: 'new',
    };

    // Insertar con timeout
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Timeout al guardar en base de datos')), TIMEOUTS.DATABASE);
    });

    const insertPromise = supabase
      .from('contact_submissions')
      .insert(insertData)
      .select('id')
      .single();

    const { data, error } = await Promise.race([insertPromise, timeoutPromise]);

    if (error) {
      console.error('Error de Supabase:', error);
      throw new Error(error.message || 'Error al guardar en base de datos');
    }

    return {
      success: true,
      id: data.id,
    };

  } catch (error) {
    console.error('Error insertando submission:', error);
    throw error;
  }
}

/**
 * Obtiene las últimas submissions (útil para debugging)
 * @param {Object} env - Variables de entorno
 * @param {number} limit - Número de submissions a obtener
 * @returns {Promise<Array>} Array de submissions
 */
export async function getRecentSubmissions(env, limit = 10) {
  try {
    const supabase = getSupabaseClient(env);

    const { data, error } = await supabase
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(error.message);
    }

    return data;

  } catch (error) {
    console.error('Error obteniendo submissions:', error);
    throw error;
  }
}

