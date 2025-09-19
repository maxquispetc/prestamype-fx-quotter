/**
 * Utilidades puras para conversión de divisas
 */

/**
 * Redondea un número al número de decimales especificado
 * @param value - Valor a redondear
 * @param decimals - Número de decimales (por defecto 2)
 * @returns Valor redondeado
 */
export function roundToDecimals(value: number, decimals: number = 2): number {
  if (!isFinite(value)) return 0;

  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

/**
 * Convierte PEN a USD usando el precio de venta
 * @param pen - Cantidad en soles peruanos
 * @param sale - Precio de venta (PEN → USD)
 * @param decimals - Número de decimales para el resultado (por defecto 2)
 * @returns Cantidad en dólares estadounidenses
 * @throws Error si sale <= 0
 */
export function penToUsd(
  pen: number,
  sale: number,
  decimals: number = 2
): number {
  // Validar que sale sea un número positivo
  if (sale <= 0) {
    throw new Error("El precio de venta debe ser mayor a 0");
  }

  // Manejar valores no finitos
  if (!isFinite(pen)) return 0;
  if (!isFinite(sale)) {
    throw new Error("El precio de venta debe ser un número válido");
  }

  const result = pen / sale;
  return roundToDecimals(result, decimals);
}

/**
 * Convierte USD a PEN usando el precio de compra
 * @param usd - Cantidad en dólares estadounidenses
 * @param purchase - Precio de compra (USD → PEN)
 * @param decimals - Número de decimales para el resultado (por defecto 2)
 * @returns Cantidad en soles peruanos
 * @throws Error si purchase <= 0
 */
export function usdToPen(
  usd: number,
  purchase: number,
  decimals: number = 2
): number {
  // Validar que purchase sea un número positivo
  if (purchase <= 0) {
    throw new Error("El precio de compra debe ser mayor a 0");
  }

  // Manejar valores no finitos
  if (!isFinite(usd)) return 0;
  if (!isFinite(purchase)) {
    throw new Error("El precio de compra debe ser un número válido");
  }

  const result = usd * purchase;
  return roundToDecimals(result, decimals);
}
