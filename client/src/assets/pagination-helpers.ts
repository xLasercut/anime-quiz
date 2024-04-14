import { TLocalStorageConstant } from '@/assets/types';
import { ref } from 'vue';
import { getLocalStorageNumber } from '@/assets/game-helpers';

function usePagination(localStorageKey: TLocalStorageConstant) {
  const currentPage = ref(1);
  const itemsPerPage = ref(getLocalStorageNumber(localStorageKey, 15));

  return {
    currentPage,
    itemsPerPage
  };
}

export { usePagination };
