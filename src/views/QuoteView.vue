<template>
  <div
    class="min-h-screen bg-gradient-to-b from-[#4d2ab2] to-[#6a43e0] flex flex-col md:flex-row gap-0 md:gap-0"
  >
    <!-- Sección izquierda - Mensaje de marketing -->
    <div
      class="md:flex-1 flex items-center justify-center pt-8 md:pt-12 px-0 md:px-12"
    >
      <div class="text-white text-center md:text-left">
        <h1 class="text-4xl md:text-6xl font-bold mb-4">
          El mejor<br />
          tipo de cambio
        </h1>
        <p class="text-xl md:text-2xl font-light mb-0 md:mb-0">
          para cambiar dólares y soles<br />
          online en Perú
        </p>
      </div>
    </div>

    <!-- Sección derecha - QuoteCard -->
    <div
      class="md:flex-1 flex items-start md:items-center justify-center mt-6 md:mt-0 p-0 md:p-12"
    >
      <QuoteCard />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import QuoteCard from "@/components/QuoteCard.vue";
import { useRatesStore } from "@/stores/rates";

// Stores
const ratesStore = useRatesStore();

// Lifecycle hooks para manejo de suscripción
onMounted(() => {
  ratesStore.start();
});

onUnmounted(() => {
  if (ratesStore.isSubscribed) {
    ratesStore.stop();
  }
});
</script>
