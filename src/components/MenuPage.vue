<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from '../store'; // Import the Pinia store

const router = useRouter();
const store = useStore(); // Access the Pinia store

const gameTime = ref(300); // Default time: 300 seconds (5 minutes)

const startGame = () => {
  // Update the store with the game settings
  store.timeLeft = gameTime.value;
  store.startGame();

  // Navigate to the Periodic Table page with the query parameters
  router.push({
    name: 'MainGame',
  });
};
</script>

<template>
  <div class="p-4 mx-auto max-w-screen-sm text-center">
    <h1 class="mb-6 text-3xl font-bold">Periodic Table Quiz</h1>
    <p class="mb-4 text-lg">Set up your game preferences below:</p>

    <!-- Game Time Dropdown -->
    <div class="mb-4">
      <label for="gameTime" class="block mb-2 font-semibold"
        >Game Time (seconds):</label
      >
      <select
        id="gameTime"
        v-model="gameTime"
        class="p-2 w-full rounded border"
      >
        <option value="100">100 seconds</option>
        <option value="200">200 seconds</option>
        <option value="300" selected>300 seconds</option>
      </select>
    </div>

    <!-- Start Game Button -->
    <button
      @click="startGame"
      class="px-6 py-3 font-bold text-white bg-blue-600 rounded"
    >
      Start Game
    </button>
  </div>
</template>
