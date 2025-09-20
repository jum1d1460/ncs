/**
 * Utilidades para formateo de fechas en español
 */

/**
 * Formatea una fecha en formato español completo
 * @param dateString - String de fecha en formato ISO
 * @returns Fecha formateada en español (ej: "15 de enero de 2024")
 */
export const formatDateSpanish = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

/**
 * Formatea una fecha en formato español corto
 * @param dateString - String de fecha en formato ISO
 * @returns Fecha formateada en español corto (ej: "15/01/2024")
 */
export const formatDateSpanishShort = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
};

/**
 * Formatea una fecha en formato español con día de la semana
 * @param dateString - String de fecha en formato ISO
 * @returns Fecha formateada con día de la semana (ej: "lunes, 15 de enero de 2024")
 */
export const formatDateSpanishWithWeekday = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};
