<script setup lang="ts">
import { useStore } from '../store';
import { useRouter } from 'vue-router';

const store = useStore();
const router = useRouter();

const handlePlayAgain = () => {
  store.resetGame(); // Reset the game state
  router.push({ name: 'Menu' }); // Navigate to the menu
};
</script>

<template>
  <div class="p-6 w-96 bg-white rounded shadow-lg">
    <h2 class="mb-4 text-xl font-bold text-center">Game Over!</h2>
    <p class="mb-2 text-lg">Final Score: {{ store.score }}</p>
    <p class="mb-2 text-lg">Longest Streak: {{ store.maxStreak }}</p>
    <p class="mb-4 text-lg">Hints Used: {{ store.hintsUsed }}</p>
    <div class="flex justify-center">
      <button
        @click="handlePlayAgain"
        class="px-6 py-3 text-lg font-bold text-white bg-blue-500 rounded"
      >
        Play Again
      </button>
    </div>
  </div>
</template>
