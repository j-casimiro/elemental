import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { elements } from './utils/elements';

export const useStore = defineStore('store', () => {
  const revealedElements = ref<Set<string>>(new Set());
  const userInput = ref('');
  const totalElements = elements.length;
  const timeLeft = ref(300); // 5 minutes
  const streak = ref(0);
  const maxStreak = ref(0);
  const hintsLeft = ref(3);
  const gameStarted = ref(false);
  const showFinalModal = ref(false);

  const score = computed(
    () => `${revealedElements.value.size}/${totalElements}`
  );
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

  return {
    revealedElements,
    userInput,
    totalElements,
    timeLeft,
    streak,
    maxStreak,
    hintsLeft,
    gameStarted,
    showFinalModal,
    score,
    hintsUsed,
    checkInput,
    useHint,
    resetGame,
    startGame,
  };
});
