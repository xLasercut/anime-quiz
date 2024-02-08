<template>
  <v-sheet class="main-game-answer-container hint-answer-container">{{ animeHint() }}</v-sheet>
</template>

<script setup lang="ts">
import { useGameStore } from '@/plugins/store/game';

const gameStore = useGameStore();

function animeHint(): string {
  const nameSplit = gameStore.currentSong.animeName[0].split('');
  const nameLength = nameSplit.length;

  let showCharacterCount = 4;
  if (showCharacterCount >= nameLength) {
    showCharacterCount = Math.floor(nameLength / 2);
  }

  const indexToShow = getIndexToShow(showCharacterCount, nameLength, nameSplit);

  const nameHintSplit = [];

  for (let i = 0; i < nameLength; i++) {
    if (indexToShow.has(i) || nameSplit[i] === ' ') {
      nameHintSplit.push(nameSplit[i]);
      continue;
    }

    nameHintSplit.push('_');
  }

  return nameHintSplit.join('');
}

function getIndexToShow(showCharacterCount: number, nameLength: number, nameSplit: string[]): Set<number> {
  const indexToShow: Set<number> = new Set();
  while (indexToShow.size < showCharacterCount) {
    const randomIndex = Math.floor(Math.random() * nameLength);
    const character = nameSplit[randomIndex];
    if (!indexToShow.has(randomIndex) && character !== ' ') {
      indexToShow.add(randomIndex);
    }
  }
  return indexToShow;
}
</script>

<style scoped>
.hint-answer-container {
  letter-spacing: 2pt;
}
</style>
