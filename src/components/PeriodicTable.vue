<script setup lang="ts">
import { elements } from '../utils/elements';
import FinalScore from './FinalScore.vue';
import { onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from '../store';

const router = useRouter();
const store = useStore();

onMounted(() => {
  const savedGameState = localStorage.getItem('gameState');
  const startTime = localStorage.getItem('startTime');

  if (savedGameState && startTime) {
    const state = JSON.parse(savedGameState);
    const startTimestamp = parseInt(startTime);

    console.log(state);

    const elapsedTime = Math.floor((Date.now() - startTimestamp) / 1000);
    const remainingTime = state.timeLeft - elapsedTime;

    store.gameStarted = state.gameStarted;
    store.timeLeft = Math.max(remainingTime, 0);
    store.streak = state.streak;
    store.maxStreak = state.maxStreak;
    store.hintsLeft = state.hintsLeft;
    store.revealedElements = new Set(state.revealedElements);

    // Resume the game if applicable
    if (store.gameStarted && store.timeLeft > 0) {
      store.startTimer(); // Use the store's timer
    }
  } else {
    router.push({ name: 'Menu' });
  }
});

// Stop timer when leaving the component
onUnmounted(() => {
  store.stopTimer();
});
</script>

<template>
  <div class="p-4 mx-auto max-w-screen-xl">
    <!-- Game Info -->
    <div
      v-if="store.gameStarted"
      class="flex justify-between items-center mb-4"
    >
      <div class="text-lg font-bold">Score: {{ store.score }}</div>
      <div class="text-lg font-bold">Time Left: {{ store.timeLeft }}s</div>
      <div class="text-lg font-bold">
        Streak: {{ store.streak }} (Max: {{ store.maxStreak }})
      </div>
      <div class="text-lg font-bold">Hints Left: {{ store.hintsLeft }}</div>
    </div>

    <!-- Periodic Table -->
    <div
      class="grid relative gap-1 grid-cols-18"
      :class="{ 'opacity-50 pointer-events-none': !store.gameStarted }"
    >
      <div
        v-for="element in elements"
        :key="element.atomicNumber"
        :style="{
          gridColumnStart: element.colStart,
          gridRowStart: element.rowStart,
        }"
        :class="[
          'border rounded p-4 text-center text-xs relative cursor-default',
          element.group === 'nonmetal'
            ? 'bg-blue-500 hover:bg-blue-600 transition-all text-white'
            : element.group === 'alkaliMetal'
            ? 'bg-green-500 hover:bg-green-600 transition-all text-white'
            : element.group === 'alkalineEarth'
            ? 'bg-purple-500 hover:bg-purple-600 transition-all text-white'
            : element.group === 'metalloid'
            ? 'bg-yellow-500 hover:bg-yellow-600 transition-all text-black'
            : element.group === 'halogen'
            ? 'bg-pink-500 hover:bg-pink-600 transition-all text-white'
            : element.group === 'nobleGas'
            ? 'bg-orange-500 hover:bg-orange-600 transition-all text-white'
            : 'bg-gray-200 hover:bg-gray-300 transition-all',
        ]"
      >
        <div v-if="store.revealedElements.has(element.name)">
          <div class="absolute top-0 left-1 text-[10px] font-bold">
            {{ element.atomicNumber }}
          </div>
          <div
            class="flex justify-center items-center h-full text-xl font-bold"
          >
            {{ element.symbol }}
          </div>
          <div
            class="absolute bottom-1 left-1/2 transform -translate-x-1/2 text-[7px] font-semibold w-full text-center break-words"
          >
            {{ element.name }}
          </div>
        </div>
        <div v-else class="p-[14px]"></div>
      </div>
    </div>

    <!-- Input Section -->
    <div v-if="store.gameStarted" class="flex justify-center mt-8">
      <input
        v-model="store.userInput"
        @keydown.enter="
          () => {
            store.checkInput();
            store.saveGameState();
          }
        "
        type="text"
        placeholder="Enter element name..."
        class="p-2 w-96 rounded border"
      />
      <button
        @click="
          () => {
            store.saveGameState();
            store.checkInput();
          }
        "
        class="px-4 py-2 ml-2 text-white bg-blue-700 rounded"
      >
        Submit
      </button>
      <button
        @click="
          () => {
            store.useHint();
            store.saveGameState();
          }
        "
        class="px-4 py-2 ml-2 text-white bg-orange-500 rounded"
        :disabled="store.hintsLeft === 0"
      >
        Use Hint
      </button>
      <button
        @click="
          () => {
            store.endGame();
            store.saveGameState();
          }
        "
        class="px-4 py-2 ml-2 text-white bg-red-500 rounded"
      >
        End Game
      </button>
    </div>

    <!-- Final Score Modal -->
    <div
      v-if="store.showFinalModal"
      class="flex fixed inset-0 z-50 justify-center items-center text-center bg-black bg-opacity-50"
    >
      <FinalScore
        :score="store.score"
        :maxStreak="store.maxStreak"
        :hintsUsed="store.hintsUsed"
      />
    </div>
  </div>
</template>
