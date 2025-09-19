import { doc, onSnapshot, Unsubscribe } from "firebase/firestore";
import { getFirestoreDB } from "@/services/firebase";
import type { ExchangeRates, FirestoreRatesData } from "@/types/rates";

/**
 * Callback para cuando se reciben datos de tasas
 */
type RatesDataCallback = (rates: ExchangeRates) => void;

/**
 * Callback para manejo de errores
 */
type RatesErrorCallback = (error: Error) => void;

/**
 * Convierte y valida un valor a número
 * @param value - Valor a convertir (string o number)
 * @param fieldName - Nombre del campo para mensajes de error
 * @returns Número validado
 * @throws Error si el valor no es válido
 */
function validateAndConvertNumber(
  value: number | string,
  fieldName: string
): number {
  if (typeof value === "number") {
    if (isNaN(value) || !isFinite(value)) {
      throw new Error(`${fieldName} debe ser un número válido`);
    }
    return value;
  }

  if (typeof value === "string") {
    const parsed = parseFloat(value);
    if (isNaN(parsed) || !isFinite(parsed)) {
      throw new Error(`${fieldName} debe ser un número válido`);
    }
    return parsed;
  }

  throw new Error(`${fieldName} debe ser un número o string numérico`);
}

/**
 * Normaliza un timestamp de Firestore a Date
 * @param timestamp - Timestamp de Firestore o Date
 * @returns Date normalizada
 */
function normalizeTimestamp(timestamp: any): Date | undefined {
  if (!timestamp) return undefined;

  // Si ya es una Date
  if (timestamp instanceof Date) {
    return timestamp;
  }

  // Si es un Timestamp de Firestore
  if (timestamp && typeof timestamp.toDate === "function") {
    return timestamp.toDate();
  }

  // Si es un número (timestamp en ms)
  if (typeof timestamp === "number") {
    return new Date(timestamp);
  }

  // Si es un string de fecha
  if (typeof timestamp === "string") {
    const date = new Date(timestamp);
    if (!isNaN(date.getTime())) {
      return date;
    }
  }

  return undefined;
}

/**
 * Se suscribe a cambios en tiempo real del documento de tasas de cambio
 * @param path - Ruta del documento en Firestore
 * @param onData - Callback cuando se reciben datos válidos
 * @param onError - Callback opcional para manejo de errores
 * @returns Función para cancelar la suscripción
 */
export function watchRatesDoc(
  path: string,
  onData: RatesDataCallback,
  onError?: RatesErrorCallback
): Unsubscribe {
  const db = getFirestoreDB();
  const docRef = doc(db, path);

  return onSnapshot(
    docRef,
    (docSnapshot) => {
      try {
        if (!docSnapshot.exists()) {
          const error = new Error(`Documento ${path} no existe`);
          if (onError) {
            onError(error);
          } else {
            console.warn(`[RatesService] ${error.message}`);
          }
          return;
        }

        const data = docSnapshot.data() as FirestoreRatesData;

        // Validar y convertir purchase_price
        const purchase_price = validateAndConvertNumber(
          data.purchase_price,
          "purchase_price"
        );

        // Validar y convertir sale_price
        const sale_price = validateAndConvertNumber(
          data.sale_price,
          "sale_price"
        );

        // Normalizar updatedAt
        const updatedAt = normalizeTimestamp(data.updatedAt);

        // Crear objeto de tasas validado
        const rates: ExchangeRates = {
          purchase_price,
          sale_price,
          updatedAt,
        };

        onData(rates);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Error desconocido";
        if (onError) {
          onError(new Error(errorMessage));
        } else {
          console.warn(
            `[RatesService] Error procesando datos: ${errorMessage}`
          );
        }
      }
    },
    (error) => {
      const errorMessage = `Error en suscripción a ${path}: ${error.message}`;
      if (onError) {
        onError(new Error(errorMessage));
      } else {
        console.warn(`[RatesService] ${errorMessage}`);
      }
    }
  );
}
