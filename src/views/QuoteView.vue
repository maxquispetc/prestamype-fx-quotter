<template>
  <div class="min-h-screen bg-[#5531c0] flex flex-col md:flex-row">
    <!-- Sección izquierda - Mensaje de marketing -->
    <div class="flex-1 flex items-center justify-center p-8 md:p-12">
      <div class="text-white text-center md:text-left">
        <h1 class="text-4xl md:text-6xl font-bold mb-4">
          El mejor<br />
          tipo de cambio
        </h1>
        <p class="text-xl md:text-2xl font-light">
          para cambiar dólares y soles<br />
          online en Perú
        </p>
      </div>
    </div>

    <!-- Sección derecha - QuoteCard -->
    <div class="flex-1 flex items-center justify-center p-8 md:p-12">
      <QuoteCard />
    </div>
  </div>
</template>

<script setup lang="ts">
import QuoteCard from "@/components/QuoteCard.vue";
</script>
