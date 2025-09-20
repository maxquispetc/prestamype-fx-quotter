import { defineStore } from "pinia";
import { watchRatesDoc } from "@/services/ratesService";
import { getRatesDocumentPath } from "@/services/firebase";
import type { ExchangeRates } from "@/types/rates";
import type { Unsubscribe } from "firebase/firestore";

interface RatesState {
  /** Precio de compra (USD a PEN) */
  purchase_price: number;
  /** Precio de venta (PEN a USD) */
  sale_price: number;
  /** Fecha de última actualización */
  lastUpdated: Date | null;
  /** Estado de carga */
  loading: boolean;
  /** Mensaje de error */
  error: string | null;
  /** Suscripción activa (privada) */
  _unsub: Unsubscribe | null;
}

export const useRatesStore = defineStore("rates", {
  state: (): RatesState => ({
    purchase_price: 0,
    sale_price: 0,
    lastUpdated: null,
    loading: false,
    error: null,
    _unsub: null,
  }),

  getters: {
    /**
     * Verifica si hay una suscripción activa
     */
    isSubscribed: (state): boolean => state._unsub !== null,

    /**
     * Verifica si las tasas están disponibles
     */
    hasRates: (state): boolean =>
      state.purchase_price > 0 && state.sale_price > 0,

    /**
     * Formatea la fecha de última actualización
     */
    formattedLastUpdated: (state): string => {
      if (!state.lastUpdated) return "Nunca";
      return state.lastUpdated.toLocaleString("es-ES");
    },
  },

  actions: {
    /**
     * Inicia la suscripción a las tasas de cambio en tiempo real
     */
    async start(): Promise<void> {
      // Si ya hay una suscripción activa, cerrarla primero para evitar múltiples suscripciones
      if (this.isSubscribed) {
        if (import.meta.env.DEV) {
          console.log(
            "[RatesStore] Cerrando suscripción anterior antes de iniciar nueva"
          );
        }
        this.stop();
      }

      try {
        this.loading = true;
        this.error = null;

        // Obtener la ruta del documento desde variables de entorno
        const docPath = getRatesDocumentPath();

        // Iniciar suscripción
        this._unsub = watchRatesDoc(
          docPath,
          (rates: ExchangeRates) => {
            // Actualizar estado con los datos recibidos
            this.purchase_price = rates.purchase_price;
            this.sale_price = rates.sale_price;
            this.lastUpdated = rates.updatedAt || new Date();
            this.loading = false;
            this.error = null;
          },
          (error: Error) => {
            // Manejar errores
            this.error = error.message;
            this.loading = false;
            if (import.meta.env.DEV) {
              console.error(
                "[RatesStore] Error en suscripción:",
                error.message
              );
            }
          }
        );

        if (import.meta.env.DEV) {
          console.log("[RatesStore] Suscripción iniciada para:", docPath);
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Error desconocido";
        this.error = errorMessage;
        this.loading = false;
        if (import.meta.env.DEV) {
          console.error(
            "[RatesStore] Error al iniciar suscripción:",
            errorMessage
          );
        }
      }
    },

    /**
     * Detiene la suscripción y limpia el estado
     */
    stop(): void {
      if (this._unsub) {
        this._unsub();
        this._unsub = null;
        if (import.meta.env.DEV) {
          console.log("[RatesStore] Suscripción detenida");
        }
      }

      // Limpiar estado
      this.loading = false;
      this.error = null;
    },

    /**
     * Reinicia la suscripción (stop + start)
     */
    async restart(): Promise<void> {
      this.stop();
      await this.start();
    },

    /**
     * Limpia el estado de error
     */
    clearError(): void {
      this.error = null;
    },

    /**
     * Actualiza manualmente las tasas (para testing)
     */
    setRates(rates: Partial<ExchangeRates>): void {
      if (rates.purchase_price !== undefined) {
        this.purchase_price = rates.purchase_price;
      }
      if (rates.sale_price !== undefined) {
        this.sale_price = rates.sale_price;
      }
      if (rates.updatedAt !== undefined) {
        this.lastUpdated = rates.updatedAt;
      }
    },
  },
});
