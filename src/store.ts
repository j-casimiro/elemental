import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { elements } from './utils/elements';

export const useStore = defineStore('store', () => {
  const revealedElements = ref<Set<string>>(new Set());
  const userInput = ref('');
  const totalElements = elements.length;
  const timeLeft = ref(300); // Default time: 5 minutes
  const streak = ref(0);
  const maxStreak = ref(0);
  const hintsLeft = ref(3); // Default hints
  const gameStarted = ref(false);
  const showFinalModal = ref(false);
  const timerId = ref<NodeJS.Timeout | null>(null);

  const score = computed(
    () => `${revealedElements.value.size}/${totalElements}`
  );
  const hintsUsed = computed(() => 3 - hintsLeft.value);

  const checkInput = () => {
    if (!gameStarted.value) return;

    const inputName = userInput.value.trim().toLowerCase();
    const element = elements.find((el) => el.name.toLowerCase() === inputName);

    if (element && !revealedElements.value.has(element.name)) {
      revealedElements.value.add(element.name);
      streak.value++;
      maxStreak.value = Math.max(maxStreak.value, streak.value);
    } else {
      streak.value = 0; // Reset streak if the answer is wrong
    }
    userInput.value = '';

    saveGameState();
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
    localStorage.removeItem('gameState');
    localStorage.removeItem('startTime');
    localStorage.removeItem('revealedElements');

    gameStarted.value = false;
    revealedElements.value.clear();
    streak.value = 0;
    maxStreak.value = 0;
    hintsLeft.value = 3;
    showFinalModal.value = false;
  };

  const startGame = () => {
    resetGame(); // Reset before starting a new game
    gameStarted.value = true;

    const currentTime = Date.now(); // Get the current timestamp
    localStorage.setItem('startTime', currentTime.toString());
    localStorage.setItem(
      'gameState',
      JSON.stringify({
        gameStarted: gameStarted.value,
        timeLeft: timeLeft.value,
        streak: streak.value,
        maxStreak: maxStreak.value,
        hintsLeft: hintsLeft.value,
      })
    );
    localStorage.setItem(
      'revealedElements',
      JSON.stringify(Array.from(revealedElements.value))
    );

    if (gameStarted.value) {
      if (timerId.value) clearInterval(timerId.value);
      timerId.value = setInterval(() => {
        if (timeLeft.value > 0 && gameStarted.value) {
          timeLeft.value--;
        } else {
          clearInterval(timerId.value!);
          gameStarted.value = false;
          showFinalModal.value = true; // Show the final modal when game ends
        }
      }, 1000);
    }
  };

  const saveGameState = () => {
    localStorage.setItem(
      'gameState',
      JSON.stringify({
        gameStarted: gameStarted.value,
        timeLeft: timeLeft.value,
        streak: streak.value,
        maxStreak: maxStreak.value,
        hintsLeft: hintsLeft.value,
        revealedElements: Array.from(revealedElements.value),
      })
    );
    console.log('Game state saved');
  };

  const startTimer = () => {
    if (timerId.value) return; // Prevent multiple timers

    timerId.value = setInterval(() => {
      if (timeLeft.value > 0) {
        timeLeft.value--;
      } else {
        stopTimer(); // Stop the timer when time runs out
        gameStarted.value = false;
        showFinalModal.value = true; // Show the final modal
      }
    }, 1000);
  };

  const stopTimer = () => {
    if (timerId.value) {
      clearInterval(timerId.value);
      timerId.value = null;
    }
  };

  const resetTimer = () => {
    stopTimer();
    timeLeft.value = 300; // Reset to default time
  };

  const endGame = () => {
    stopTimer(); // Stop the timer
    gameStarted.value = false;
    showFinalModal.value = true;
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
    saveGameState,
    startTimer,
    stopTimer,
    resetTimer,
    endGame,
  };
});
