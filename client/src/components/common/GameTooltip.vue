<template>
  <div class="game-tooltip" @mouseover="updateShowOnHover(true)" @mouseleave="updateShowOnHover(false)">
    <slot name="activator"></slot>
    <div :class="tooltipContentClasses" :style="tooltipContentStyle()">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, PropType, ref, StyleValue, watch } from 'vue';
import { TGameTooltipPosition } from '@/assets/types';

const props = defineProps({
  location: {
    type: String as PropType<TGameTooltipPosition>,
    default: (): TGameTooltipPosition => {
      return 'top';
    }
  },
  modelValue: {
    type: Boolean,
    default: (): boolean => {
      return false;
    }
  },
  openOnHover: {
    type: Boolean,
    default: (): boolean => {
      return true;
    }
  },
  width: {
    type: String,
    default: (): string => {
      return '';
    }
  }
});
const emit = defineEmits(['update:modelValue']);

const show = ref(props.modelValue);

watch(
  () => props.modelValue,
  (val: boolean) => {
    show.value = val;
  }
);

watch(
  () => show.value,
  (val: boolean) => {
    emit('update:modelValue', val);
  }
);

const tooltipContentClasses = computed((): string => {
  const classes = ['game-tooltip-content', `tooltip-content-${props.location}`];

  if (show.value) {
    classes.push('tooltip-content-show');
  } else {
    classes.push('tooltip-content-hidden');
  }

  return classes.join(' ');
});

function tooltipContentStyle(): StyleValue {
  if (props.width) {
    return {
      width: props.width
    };
  }

  return {};
}

function updateShowOnHover(showValue: boolean) {
  if (props.openOnHover) {
    show.value = showValue;
  }
}
</script>

<style scoped>
.game-tooltip {
  position: relative;
}

.game-tooltip .game-tooltip-content {
  position: absolute;
  transition: all 500ms ease 0s;
  z-index: 35;
}

.game-tooltip .tooltip-content-show {
  visibility: visible;
  opacity: 1;
}

.game-tooltip .tooltip-content-hidden {
  visibility: hidden;
  opacity: 0;
}

.game-tooltip .tooltip-content-top {
  bottom: calc(100% + 5px);
}

.game-tooltip .tooltip-content-left {
  top: 50%;
  right: calc(100% + 5px);
}

.game-tooltip .tooltip-content-right {
  top: 50%;
  left: calc(100% + 5px);
}

.game-tooltip .tooltip-content-bottom {
  top: calc(100% + 5px);
}
</style>
