<template>
  <div
    class="bg-white rounded-xl shadow-lg p-8 w-full max-w-md mx-auto md:mx-0"
  >
    <!-- Header de tasas -->
    <div class="mb-8">
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

      <!-- Tasas normales -->
      <div v-else class="flex justify-between items-center">
        <!-- Dólar compra (activo) -->
        <div class="text-center flex-1">
          <p class="text-sm text-gray-600 mb-2">Dólar compra</p>
          <div class="relative">
            <p class="text-2xl font-bold text-[#653fd9]">
              {{ formatRate(purchase_price) }}
            </p>
            <div
              class="absolute bottom-0 left-0 right-0 h-0.5 bg-[#653fd9]"
            ></div>
          </div>
        </div>

        <!-- Dólar venta (inactivo) -->
        <div class="text-center flex-1">
          <p class="text-sm text-gray-600 mb-2">Dólar venta</p>
          <p class="text-2xl font-bold text-gray-400">
            {{ formatRate(sale_price) }}
          </p>
        </div>
      </div>
    </div>

    <!-- Inputs de conversión -->
    <div class="space-y-6 mb-8">
      <!-- Dólares -->
      <div class="flex items-center justify-between bg-gray-50 rounded-xl p-4">
        <div class="bg-gray-100 px-4 py-2 rounded-full">
          <label for="dollars-input" class="text-sm font-medium text-gray-700"
            >Dólares</label
          >
        </div>
        <div class="text-right flex-1 ml-4">
          <p class="text-xs text-gray-500 mb-1">Envías</p>
          <input
            id="dollars-input"
            v-model="dollarsAmount"
            type="text"
            inputmode="decimal"
            placeholder="0.0000"
            class="text-xl font-bold text-gray-900 bg-transparent border-none outline-none w-full text-right"
            :class="{ 'text-red-500': !isValidAmount(dollarsAmount) }"
            :aria-invalid="!isValidAmount(dollarsAmount)"
            aria-label="Cantidad en dólares"
            @input="normalizeInput"
          />
        </div>
      </div>

      <!-- Soles -->
      <div class="flex items-center justify-between bg-gray-50 rounded-xl p-4">
        <div class="bg-gray-100 px-4 py-2 rounded-full">
          <label for="soles-input" class="text-sm font-medium text-gray-700"
            >Soles</label
          >
        </div>
        <div class="text-right flex-1 ml-4">
          <p class="text-xs text-gray-500 mb-1">Recibes</p>
          <input
            id="soles-input"
            v-model="solesAmount"
            type="text"
            inputmode="decimal"
            placeholder="0.0000"
            class="text-xl font-bold text-gray-900 bg-transparent border-none outline-none w-full text-right"
            :class="{ 'text-red-500': !isValidAmount(solesAmount) }"
            :aria-invalid="!isValidAmount(solesAmount)"
            aria-label="Cantidad en soles"
            @input="normalizeInput"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useRatesStore } from "@/stores/rates";

// Store de tasas
const ratesStore = useRatesStore();
const { purchase_price, sale_price, loading, error } = storeToRefs(ratesStore);

// Estados de los inputs
const dollarsAmount = ref("");
const solesAmount = ref("");

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

// Normalizar input: convertir comas a puntos
function normalizeInput(event: Event): void {
  const target = event.target as HTMLInputElement;
  const value = target.value.replace(/,/g, ".");

  if (target.id === "dollars-input") {
    dollarsAmount.value = value;
  } else if (target.id === "soles-input") {
    solesAmount.value = value;
  }
}
</script>
