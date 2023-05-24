<template>
  <div class="vdatetime-year-picker">
    <div ref="yearList" class="vdatetime-year-picker__list vdatetime-year-picker__list">
      <div
        v-for="yearElement in years"
        :key="yearElement.number"
        class="vdatetime-year-picker__item"
        :class="{
          'vdatetime-year-picker__item--selected': yearElement.selected,
          'vdatetime-year-picker__item--disabled': yearElement.disabled,
        }"
        @click="select(yearElement)"
      >
        {{ yearElement.number }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { DateTime } from 'luxon';
import { computed, PropType, ref } from 'vue';

import useListScroller from './composables/ListScroller';
import type { TimeElement } from './namespace';
import { yearIsDisabled } from './utils/datetime';
import { yearsGenerator } from './utils/generators';

const props = defineProps({
  year: {
    type: Number,
    required: true,
  },
  minDate: {
    type: Object as PropType<DateTime>,
    default: null,
  },
  maxDate: {
    type: Object as PropType<DateTime>,
    default: null,
  },
});

const years = computed<TimeElement[]>(() => (yearsGenerator(props.year.valueOf()).map((year: number): TimeElement => ({
  number: year,
  selected: year === props.year.valueOf(),
  disabled: !year || yearIsDisabled(props.minDate, props.maxDate, year),
}))));

const yearList = ref<HTMLElement | null>(null);

useListScroller(yearList, '.vdatetime-year-picker__item--selected');

const emits = defineEmits(['change']);

const select = (year: TimeElement) => {
  if (!year.disabled) {
    emits('change', year.number, 10);
  }
};
</script>

<style lang="scss">
.vdatetime-year-picker {
  box-sizing: border-box;

  &::after {
    content: '';
    display: table;
    clear: both;
  }

  & * {
    box-sizing: border-box;
  }
}

.vdatetime-year-picker__list {
  float: left;
  width: 100%;
  height: 305px;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    width: 3px;
  }

  &::-webkit-scrollbar-track {
    background: #efefef;
  }

  &::-webkit-scrollbar-thumb {
    background: #ccc;
  }
}

.vdatetime-year-picker__item {
  padding: 10px 0;
  font-size: 20px;
  text-align: center;
  cursor: pointer;
  transition: font-size .3s;
}

.vdatetime-year-picker__item:hover {
  font-size: 32px;
}

.vdatetime-year-picker__item--selected {
  color: var(--primary-color);
  font-size: 32px;
}

.vdatetime-year-picker__item--disabled {
  opacity: 0.4;
  cursor: default;

  &:hover {
    color: inherit;
    background: transparent;
  }
}
</style>
