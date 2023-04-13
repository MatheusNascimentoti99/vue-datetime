<template>
  <div class="vdatetime-year-picker">
    <div ref="yearList" class="vdatetime-year-picker__list vdatetime-year-picker__list">
      <div
        v-for="yearElement in years"
        :key="yearElement"
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
import { yearsGenerator, yearIsDisabled, type TimeElement } from './util';

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
    emits('change', parseInt(year.number as string, 10));
  }
};
</script>

<style>
.vdatetime-year-picker {
  box-sizing: border-box;
}

.vdatetime-year-picker::after {
  content: '';
  display: table;
  clear: both;
}

.vdatetime-year-picker * {
  box-sizing: border-box;
}

.vdatetime-year-picker__list {
  float: left;
  width: 100%;
  height: 305px;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
}

.vdatetime-year-picker__list::-webkit-scrollbar {
  width: 3px;
}

.vdatetime-year-picker__list::-webkit-scrollbar-track {
  background: #efefef;
}

.vdatetime-year-picker__list::-webkit-scrollbar-thumb {
  background: #ccc;
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
  color: #3f51b5;
  font-size: 32px;
}

.vdatetime-year-picker__item--disabled {
  opacity: 0.4;
  cursor: default;
}

.vdatetime-year-picker__item--disabled:hover {
  color: inherit;
  background: transparent;
}
</style>
