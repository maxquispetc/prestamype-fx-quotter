/**
 * Utilidades puras para manejo de números
 */

/**
 * Convierte de forma segura un string o número a número
 * Maneja comas y puntos como separadores decimales
 * @param value - Valor a convertir (string o number)
 * @returns Número convertido o 0 si no es válido
 */
export function toNumberSafe(value: string | number): number {
  if (typeof value === "number") {
    return isFinite(value) ? value : 0;
  }

  if (typeof value === "string") {
    // Normalizar: convertir comas a puntos
    const normalizedValue = value.replace(/,/g, ".");
    const parsed = parseFloat(normalizedValue);
    return isFinite(parsed) ? parsed : 0;
  }

  return 0;
}

/**
 * Limita un valor a un mínimo especificado
 * @param value - Valor a limitar
 * @param min - Valor mínimo (por defecto 0)
 * @returns Valor limitado al mínimo
 */
export function clampMin(value: number, min: number = 0): number {
  if (!isFinite(value)) return min;
  return Math.max(value, min);
}

/**
 * Formatea un número como cantidad monetaria usando formato peruano
 * @param value - Valor a formatear
 * @param decimals - Número de decimales (por defecto 2)
 * @returns String formateado según locale peruano
 */
export function formatAmount(value: number, decimals: number = 2): string {
  if (!isFinite(value)) return "0.00";

  return new Intl.NumberFormat("es-PE", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}
