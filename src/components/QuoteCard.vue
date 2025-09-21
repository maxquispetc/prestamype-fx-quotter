<template>
  <div
    class="bg-white rounded-xl shadow-lg p-8 w-full max-w-md mx-auto md:mx-0"
  >
    <!-- Header de tasas -->
    <div>
      <!-- Estados de loading/error -->
      <div v-if="loading" class="animate-pulse">
        <div class="flex justify-between items-center">
          <div class="text-center flex-1">
            <div class="h-4 bg-gray-200 rounded mb-2"></div>
            <div class="h-8 bg-gray-200 rounded"></div>
          </div>
          <div class="text-center flex-1">
            <div class="h-4 bg-gray-200 rounded mb-2"></div>
            <div class="h-8 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>

      <!-- Estado de error -->
      <div
        v-else-if="error"
        class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg"
      >
        <p class="text-red-600 text-sm mb-2">{{ error }}</p>
        <button
          @click="ratesStore.start()"
          class="text-red-600 text-sm underline hover:no-underline"
        >
          Reintentar
        </button>
      </div>

      <!-- Notificación de tasas actualizadas -->
      <div
        v-if="showRatesUpdated"
        class="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-center"
      >
        <p class="text-green-600 text-sm font-medium">Tasas actualizadas</p>
      </div>

      <!-- Tasas normales -->
      <div v-else class="flex justify-between items-center">
        <!-- Dólar compra (activo cuando mode === 'USD_TO_PEN') -->
        <div class="text-center flex-1">
          <p
            class="text-sm mb-0"
            :class="mode === 'USD_TO_PEN' ? 'text-[#653fd9]' : 'text-gray-600'"
          >
            Dólar compra
          </p>
          <div class="relative">
            <p
              class="text-l font-bold pb-1.5"
              :class="
                mode === 'USD_TO_PEN' ? 'text-[#653fd9]' : 'text-gray-400'
              "
            >
              {{ formatRate(purchase_price) }}
            </p>
            <div
              v-if="mode === 'USD_TO_PEN'"
              class="absolute bottom-0 left-0 right-0 mx-auto w-1/2 h-0.5 bg-[#653fd9]"
            ></div>
          </div>
        </div>

        <!-- Dólar venta (activo cuando mode === 'PEN_TO_USD') -->
        <div class="text-center flex-1">
          <p
            class="text-sm mb-0"
            :class="mode === 'PEN_TO_USD' ? 'text-[#653fd9]' : 'text-gray-600'"
          >
            Dólar venta
          </p>
          <div class="relative">
            <p
              class="text-l font-bold pb-1.5"
              :class="
                mode === 'PEN_TO_USD' ? 'text-[#653fd9]' : 'text-gray-400'
              "
            >
              {{ formatRate(sale_price) }}
            </p>
            <div
              v-if="mode === 'PEN_TO_USD'"
              class="absolute bottom-0 left-0 right-0 mx-auto w-1/2 h-0.5 bg-[#653fd9]"
            ></div>
          </div>
        </div>
      </div>

      <!-- Aviso helper-text para tasas inválidas -->
      <div
        v-if="hasInvalidRates"
        class="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
      >
        <p class="text-yellow-700 text-sm">
          ⚠️ {{ ratesErrorMessage }}. Las conversiones pueden no ser precisas.
        </p>
      </div>
    </div>

    <!-- Línea divisoria -->
    <div class="h-px bg-gray-200 mb-8 -mx-8 mt-0"></div>

    <!-- Inputs de conversión -->
    <div class="relative mt-12 mb-14 max-w-[340px] w-full mx-auto">
      <!-- Input principal según el modo -->
      <div
        class="flex items-center bg-white rounded-xl mb-4 border border-[#6E46E6] overflow-hidden"
      >
        <div
          class="bg-gray-100 px-4 py-3 rounded-l-xl flex items-center justify-center w-2/5"
        >
          <label
            :for="mode === 'PEN_TO_USD' ? 'soles-input' : 'dollars-input'"
            class="text-l font-medium text-[#653fd9]"
          >
            {{ mode === "PEN_TO_USD" ? "Soles" : "Dólares" }}
          </label>
        </div>

        <div class="text-right flex-1 px-4 min-w-0">
          <p class="text-xs text-gray-500 mb-1">Envías</p>

          <div
            class="flex items-center justify-end gap-0 min-w-0 whitespace-nowrap"
          >
            <span
              class="text-xl font-bold text-gray-900 font-mono tabular-nums"
            >
              {{ mode === "PEN_TO_USD" ? "S/" : "$" }}
            </span>

            <input
              :ref="mode === 'PEN_TO_USD' ? 'solesInput' : 'dollarsInput'"
              :id="mode === 'PEN_TO_USD' ? 'soles-input' : 'dollars-input'"
              v-model="currentInputValue"
              type="text"
              inputmode="decimal"
              placeholder="0.00"
              :size="inputSizeTight"
              class="flex-none inline-block text-xl font-bold font-mono tabular-nums bg-transparent border-0 outline-none text-right placeholder-gray-400 p-0 m-0 leading-none"
              :class="{ 'text-red-500': !isValidAmount(currentInputValue) }"
              :aria-invalid="!isValidAmount(currentInputValue)"
              :aria-label="`Cantidad en ${
                mode === 'PEN_TO_USD' ? 'soles' : 'dólares'
              }`"
              @input="handleInputChange"
            />
          </div>
        </div>
      </div>

      <!-- Input de salida (solo lectura) -->
      <div
        class="flex items-center bg-white rounded-xl mt-4 border border-[#6E46E6] overflow-hidden"
      >
        <div
          class="bg-gray-100 px-4 py-3 rounded-l-xl flex items-center justify-center w-2/5"
        >
          <label
            :for="mode === 'PEN_TO_USD' ? 'dollars-output' : 'soles-output'"
            class="text-l font-medium text-[#653fd9]"
          >
            {{ mode === "PEN_TO_USD" ? "Dólares" : "Soles" }}
          </label>
        </div>

        <div class="text-right flex-1 px-4 min-w-0">
          <p class="text-xs text-gray-500 mb-1">Recibes</p>

          <div class="flex items-center justify-end gap-1 min-w-0">
            <span class="text-xl font-bold text-gray-900">
              {{ mode === "PEN_TO_USD" ? "$" : "S/" }}
            </span>

            <div
              :id="mode === 'PEN_TO_USD' ? 'dollars-output' : 'soles-output'"
              class="text-xl font-bold text-gray-900 text-right truncate"
            >
              {{ formattedResult }}
            </div>
          </div>
        </div>
      </div>

      <!-- Swap Button -->
      <div
        class="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20"
      >
        <button
          ref="swapButton"
          @click="handleSwap"
          @keydown.enter="handleSwap"
          @keydown.space.prevent="handleSwap"
          class="w-12 h-12 bg-[#653fd9] rounded-full flex items-center justify-center shadow-lg hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-[#653fd9] focus:ring-offset-2 transition-all duration-200 hover:scale-105"
          aria-label="Intercambiar monedas"
        >
          <svg
            class="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2.5"
              d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
            ></path>
          </svg>
        </button>
      </div>
    </div>

    <!-- Botón "Iniciar operación" -->
    <button
      class="w-full max-w-[340px] mx-auto block bg-[#653fd9] text-white rounded-lg shadow-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-[#653fd9] focus:ring-offset-2 transition-colors"
      style="
        font-weight: 400;
        font-size: 16px;
        line-height: 24px;
        letter-spacing: 0%;
        text-align: center;
        padding: 8px 16px 8px 16px;
      "
    >
      Iniciar operación
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { storeToRefs } from "pinia";
import { useRatesStore } from "@/stores/rates";
import { useConversionStore } from "@/stores/conversion";
import { formatAmount } from "@/services/number";

const inputSizeTight = computed(() => {
  const txt = (currentInputValue.value || "0.00").toString();
  return Math.min(18, Math.max(3, txt.length));
});

// Stores
const ratesStore = useRatesStore();
const conversionStore = useConversionStore();
const { purchase_price, sale_price, loading, error } = storeToRefs(ratesStore);
const {
  mode,
  penInput,
  usdInput,
  result,
  hasResult,
  showRatesUpdated,
  hasInvalidRates,
  ratesErrorMessage,
} = storeToRefs(conversionStore);

// Referencias para manejo de foco
const dollarsInput = ref<HTMLInputElement>();
const solesInput = ref<HTMLInputElement>();
const swapButton = ref<HTMLButtonElement>();

// Debounce timer optimizado
let debounceTimer: NodeJS.Timeout | null = null;
let lastInputValue = ""; // Cache para evitar recomputos redundantes

// Computed properties optimizados
const currentInputValue = computed({
  get: () => (mode.value === "PEN_TO_USD" ? penInput.value : usdInput.value),
  set: (value: string) => {
    // Solo actualizar si el valor realmente cambió
    if (value !== lastInputValue) {
      lastInputValue = value;
      if (mode.value === "PEN_TO_USD") {
        conversionStore.setPenInput(value);
      } else {
        conversionStore.setUsdInput(value);
      }
    }
  },
});

const formattedResult = computed(() => {
  if (!hasResult.value) return "0.00"; // Siempre 2 decimales por defecto
  return formatAmount(result.value, conversionStore.decimals);
});

// Lifecycle hooks para manejo de suscripción
onMounted(() => {
  ratesStore.start();
});

onUnmounted(() => {
  if (ratesStore.isSubscribed) {
    ratesStore.stop();
  }
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }
});

// Formatear tasa a 4 decimales
function formatRate(rate: number): string {
  if (!rate || rate === 0) return "0.0000";
  return rate.toFixed(4);
}

// Validar formato de número (hasta 4 decimales)
function isValidAmount(value: string): boolean {
  if (!value || value.trim() === "") return true; // Vacío es válido

  // Regex: números opcionales + punto + hasta 4 decimales
  const regex = /^\d*\.?\d{0,4}$/;
  return regex.test(value);
}

// Manejar cambios en el input con debounce optimizado
function handleInputChange(event: Event): void {
  const target = event.target as HTMLInputElement;
  const value = target.value.replace(/,/g, ".");

  // Solo procesar si el valor realmente cambió
  if (value === lastInputValue) return;

  // Actualizar inmediatamente para UI responsiva
  currentInputValue.value = value;

  // Debounce optimizado para evitar recomputos excesivos
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }

  debounceTimer = setTimeout(() => {
    // Solo sincronizar si hay un valor válido y tasas disponibles
    if (value && ratesStore.hasRates && !hasInvalidRates.value) {
      conversionStore.syncWithRates();
    }
  }, 150); // Reducido a 150ms para mejor responsividad
}

// Manejar intercambio de monedas
function handleSwap(): void {
  conversionStore.swapMode();

  // Preparar manejo de foco tras el swap
  setTimeout(() => {
    const activeInput =
      mode.value === "PEN_TO_USD" ? solesInput.value : dollarsInput.value;
    activeInput?.focus();
  }, 100);
}

// Los watchers de tasas están en el store de conversión
// La vista solo lee getters, no fuerza v-model ni modifica inputs del usuario
</script>
