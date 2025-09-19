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

    <!-- Estructura base del cotizador -->
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useRatesStore } from "@/stores/rates";

// Store de tasas
const ratesStore = useRatesStore();
const { purchase_price, sale_price, loading, error } = storeToRefs(ratesStore);

// Formatear tasa a 4 decimales
function formatRate(rate: number): string {
  if (!rate || rate === 0) return "0.0000";
  return rate.toFixed(4);
}
</script>
