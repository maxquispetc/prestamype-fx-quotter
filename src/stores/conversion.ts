import { defineStore } from "pinia";
import { ref, computed, watch } from "vue";
import { penToUsd, usdToPen } from "@/services/conversion";
import { toNumberSafe, clampMin } from "@/services/number";
import { ConversionMode } from "@/types/rates";
import { useRatesStore } from "./rates";

export const useConversionStore = defineStore("conversion", () => {
  // Store de tasas para obtener purchase_price y sale_price
  const ratesStore = useRatesStore();

  // State
  const mode = ref<ConversionMode>("PEN_TO_USD");
  const penInput = ref<string>("");
  const usdInput = ref<string>("");
  const decimals = ref<number>(2);
  const ratesUpdated = ref<boolean>(false); // Para mostrar notificación

  // Getters
  /**
   * Calcula el resultado de conversión basado en el modo actual y las tasas disponibles
   * Endurecido: entradas vacías/no numéricas → 0, no negativos, manejo de errores
   */
  const result = computed<number>(() => {
    if (!ratesStore.hasRates) return 0;

    try {
      if (mode.value === "PEN_TO_USD") {
        const penAmount = clampMin(toNumberSafe(penInput.value));
        if (penAmount === 0) return 0; // Entrada vacía/no numérica
        return penToUsd(penAmount, ratesStore.sale_price, decimals.value);
      } else {
        const usdAmount = clampMin(toNumberSafe(usdInput.value));
        if (usdAmount === 0) return 0; // Entrada vacía/no numérica
        return usdToPen(usdAmount, ratesStore.purchase_price, decimals.value);
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.warn("[ConversionStore] Error calculating result:", error);
      }
      return 0;
    }
  });

  /**
   * Indica si hay un resultado válido para mostrar
   */
  const hasResult = computed<boolean>(() => {
    if (!ratesStore.hasRates) return false;

    const currentInput =
      mode.value === "PEN_TO_USD" ? penInput.value : usdInput.value;
    const amount = toNumberSafe(currentInput);
    return amount > 0 && isFinite(result.value);
  });

  /**
   * Obtiene el input actual según el modo
   */
  const currentInput = computed<string>(() => {
    return mode.value === "PEN_TO_USD" ? penInput.value : usdInput.value;
  });

  /**
   * Obtiene el input opuesto según el modo
   */
  const oppositeInput = computed<string>(() => {
    return mode.value === "PEN_TO_USD" ? usdInput.value : penInput.value;
  });

  /**
   * Indica si se debe mostrar la notificación de tasas actualizadas
   */
  const showRatesUpdated = computed<boolean>(() => ratesUpdated.value);

  /**
   * Indica si hay tasas inválidas (≤ 0)
   */
  const hasInvalidRates = computed<boolean>(() => {
    return (
      ratesStore.hasRates &&
      (ratesStore.purchase_price <= 0 || ratesStore.sale_price <= 0)
    );
  });

  /**
   * Mensaje de error para tasas inválidas
   */
  const ratesErrorMessage = computed<string>(() => {
    if (!hasInvalidRates.value) return "";

    const errors = [];
    if (ratesStore.purchase_price <= 0) {
      errors.push("Precio de compra inválido");
    }
    if (ratesStore.sale_price <= 0) {
      errors.push("Precio de venta inválido");
    }

    return errors.join(", ");
  });

  // Actions
  /**
   * Cambia el modo de conversión
   */
  function setMode(newMode: ConversionMode): void {
    mode.value = newMode;
  }

  /**
   * Establece el valor del input de PEN
   */
  function setPenInput(value: string): void {
    penInput.value = value;
  }

  /**
   * Establece el valor del input de USD
   */
  function setUsdInput(value: string): void {
    usdInput.value = value;
  }

  /**
   * Sincroniza los inputs con las tasas actuales
   * Actualiza el input opuesto basado en el resultado calculado
   */
  function syncWithRates(): void {
    if (!ratesStore.hasRates || !hasResult.value) return;

    try {
      const formattedResult = result.value.toFixed(decimals.value);

      if (mode.value === "PEN_TO_USD") {
        setUsdInput(formattedResult);
      } else {
        setPenInput(formattedResult);
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.warn("[ConversionStore] Error syncing with rates:", error);
      }
    }
  }

  /**
   * Intercambia el modo de conversión y sincroniza los valores
   */
  function swapMode(): void {
    const newMode: ConversionMode =
      mode.value === "PEN_TO_USD" ? "USD_TO_PEN" : "PEN_TO_USD";
    setMode(newMode);

    // Intercambiar valores de los inputs
    const tempPen = penInput.value;
    const tempUsd = usdInput.value;

    setPenInput(tempUsd);
    setUsdInput(tempPen);

    // Sincronizar con las nuevas tasas
    syncWithRates();
  }

  /**
   * Limpia todos los inputs
   */
  function clearInputs(): void {
    penInput.value = "";
    usdInput.value = "";
  }

  /**
   * Establece la precisión decimal
   */
  function setDecimals(newDecimals: number): void {
    decimals.value = Math.max(0, Math.min(10, newDecimals)); // Limitar entre 0 y 10
  }

  /**
   * Muestra la notificación de tasas actualizadas por 1.5 segundos
   */
  function showRatesUpdatedNotification(): void {
    ratesUpdated.value = true;
    setTimeout(() => {
      ratesUpdated.value = false;
    }, 1500);
  }

  // Watchers para reaccionar a cambios en las tasas
  // Solo actualiza el resultado calculado, NO modifica los inputs del usuario
  watch(
    () => ratesStore.purchase_price,
    (newPrice, oldPrice) => {
      // Solo mostrar notificación si hay un cambio real y las tasas están disponibles
      if (
        ratesStore.hasRates &&
        newPrice !== oldPrice &&
        oldPrice !== undefined
      ) {
        if (import.meta.env.DEV) {
          console.log("[ConversionStore] Purchase price updated:", newPrice);
        }
        showRatesUpdatedNotification();
      }
    }
  );

  watch(
    () => ratesStore.sale_price,
    (newPrice, oldPrice) => {
      // Solo mostrar notificación si hay un cambio real y las tasas están disponibles
      if (
        ratesStore.hasRates &&
        newPrice !== oldPrice &&
        oldPrice !== undefined
      ) {
        if (import.meta.env.DEV) {
          console.log("[ConversionStore] Sale price updated:", newPrice);
        }
        showRatesUpdatedNotification();
      }
    }
  );

  watch(
    () => ratesStore.hasRates,
    (hasRates) => {
      if (hasRates) {
        if (import.meta.env.DEV) {
          console.log("[ConversionStore] Rates are now available");
        }
      } else {
        if (import.meta.env.DEV) {
          console.log("[ConversionStore] Rates are not available");
        }
      }
    }
  );

  return {
    // State
    mode,
    penInput,
    usdInput,
    decimals,

    // Getters
    result,
    hasResult,
    currentInput,
    oppositeInput,
    showRatesUpdated,
    hasInvalidRates,
    ratesErrorMessage,

    // Actions
    setMode,
    setPenInput,
    setUsdInput,
    syncWithRates,
    swapMode,
    clearInputs,
    setDecimals,
  };
});
