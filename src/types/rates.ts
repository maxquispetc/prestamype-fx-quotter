/**
 * Tipo para las tasas de cambio de divisas
 */
export interface ExchangeRates {
  /** Precio de compra (USD a PEN) */
  purchase_price: number;
  /** Precio de venta (PEN a USD) */
  sale_price: number;
  /** Fecha de última actualización */
  updatedAt?: Date;
}

/**
 * Tipo para los datos raw que vienen de Firestore
 */
export interface FirestoreRatesData {
  purchase_price: number | string;
  sale_price: number | string;
  updatedAt?: any; // Timestamp de Firestore
}

/**
 * Interface simplificada para las tasas de cambio
 */
export interface Rates {
  /** Precio de compra (USD a PEN) */
  purchase_price: number;
  /** Precio de venta (PEN a USD) */
  sale_price: number;
}

/**
 * Modos de conversión disponibles
 */
export type ConversionMode = "PEN_TO_USD" | "USD_TO_PEN";
