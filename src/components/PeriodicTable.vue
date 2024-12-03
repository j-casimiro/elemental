<script setup lang="ts">
import { ref, computed } from 'vue';
import { elements } from '../utils/elements';

const revealedElements = ref<Set<string>>(new Set());
const userInput = ref('');
const totalElements = elements.length;
const timeLeft = ref(300); // 5 minutes
const streak = ref(0);
const maxStreak = ref(0);
const hintsLeft = ref(3);
const gameStarted = ref(false);
const showFinalModal = ref(false);

const score = computed(() => `${revealedElements.value.size}/${totalElements}`);
const hintsUsed = computed(() => 3 - hintsLeft.value);

const checkInput = () => {
  if (!gameStarted.value) return;

  const inputName = userInput.value.trim();
  const element = elements.find(
    (el) => el.name.toLowerCase() === inputName.toLowerCase()
  );

  if (element && !revealedElements.value.has(element.name)) {
    revealedElements.value.add(element.name);
    streak.value++;
    maxStreak.value = Math.max(maxStreak.value, streak.value);
  } else {
    streak.value = 0; // Reset streak if the answer is wrong
  }
  userInput.value = '';
};

const useHint = () => {
  if (!gameStarted.value || hintsLeft.value <= 0) return;

  const hiddenElements = elements.filter(
    (el) => !revealedElements.value.has(el.name)
  );
  if (hiddenElements.length > 0) {
    const randomHint =
      hiddenElements[Math.floor(Math.random() * hiddenElements.length)];
    revealedElements.value.add(randomHint.name);
    hintsLeft.value--;
  }
};

const resetGame = () => {
  gameStarted.value = false;
  revealedElements.value.clear();
  streak.value = 0;
  maxStreak.value = 0;
  timeLeft.value = 300;
  hintsLeft.value = 3;
  showFinalModal.value = false;
};

const startGame = () => {
  resetGame();
  gameStarted.value = true;

  // Start the timer
  const timer = setInterval(() => {
    if (timeLeft.value > 0 && gameStarted.value) {
      timeLeft.value--;
    } else {
      clearInterval(timer);
      if (gameStarted.value) {
        gameStarted.value = false;
        showFinalModal.value = true; // Show modal when the game ends
      }
    }
  }, 1000);
};
</script>

<template>
  <div class="p-4 mx-auto max-w-screen-xl">
    <!-- Start Button -->
    <div v-if="!gameStarted" class="flex justify-center my-8">
      <button
        @click="startGame"
        class="px-6 py-3 bg-green-600 text-white rounded text-lg font-bold"
      >
        Start Game
      </button>
    </div>

    <!-- Game Info -->
    <div v-if="gameStarted" class="flex justify-between items-center mb-4">
      <div class="text-lg font-bold">Score: {{ score }}</div>
      <div class="text-lg font-bold">Time Left: {{ timeLeft }}s</div>
      <div class="text-lg font-bold">
        Streak: {{ streak }} (Max: {{ maxStreak }})
      </div>
      <div class="text-lg font-bold">Hints Left: {{ hintsLeft }}</div>
    </div>

    <!-- Periodic Table -->
    <div
      class="grid relative gap-1 grid-cols-18"
      :class="{ 'opacity-50 pointer-events-none': !gameStarted }"
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
        <div v-if="revealedElements.has(element.name)">
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
    <div v-if="gameStarted" class="mt-8 flex justify-center">
      <input
        v-model="userInput"
        @keydown.enter="checkInput"
        type="text"
        placeholder="Enter element name..."
        class="p-2 border rounded w-96"
      />
      <button
        @click="checkInput"
        class="ml-2 px-4 py-2 bg-blue-700 text-white rounded"
      >
        Submit
      </button>
      <button
        @click="useHint"
        class="ml-2 px-4 py-2 bg-yellow-500 text-white rounded"
        :disabled="hintsLeft === 0"
      >
        Use Hint
      </button>
      <button
        @click="resetGame"
        class="ml-2 px-4 py-2 bg-red-500 text-white rounded"
      >
        Reset
      </button>
    </div>

    <!-- Final Score Modal -->
    <div
      v-if="showFinalModal"
      class="fixed inset-0 flex text-center justify-center items-center bg-black bg-opacity-50 z-50"
    >
      <div class="bg-white p-6 rounded shadow-lg w-96">
        <h2 class="text-xl font-bold mb-4 text-center">Game Over!</h2>
        <p class="text-lg mb-2">Final Score: {{ score }}</p>
        <p class="text-lg mb-2">Longest Streak: {{ maxStreak }}</p>
        <p class="text-lg mb-4">Hints Used: {{ hintsUsed }}</p>
        <div class="flex justify-center">
          <button
            @click="resetGame"
            class="px-6 py-3 bg-blue-500 text-white rounded text-lg font-bold"
          >
            Play Again
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
