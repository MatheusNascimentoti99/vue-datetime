<template>
  <div class="vdatetime-month-picker">
    <div ref="monthList" class="vdatetime-month-picker__list vdatetime-month-picker__list">
      <div
        v-for="monthElement in months"
        :key="monthElement"
        class="vdatetime-month-picker__item"
        :class="{
          'vdatetime-month-picker__item--selected': monthElement.selected,
          'vdatetime-month-picker__item--disabled': monthElement.disabled,
        }"
        @click="select(monthElement)"
      >
        {{ monthElement.label }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { DateTime } from 'luxon';
import { computed, PropType, ref } from 'vue';

import useListScroller from './composables/ListScroller';
import { monthIsDisabled, monthsGenerator, TimeElement } from './util';

const props = defineProps({
  year: {
    type: Number,
    required: true,
  },
  month: {
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

const months = computed<TimeElement[]>(() => (
  monthsGenerator().map((month: string, index: number): TimeElement => ({
    // eslint-disable-next-line no-param-reassign
    number: ++index,
    label: month,
    selected: index === props.month.valueOf(),
    disabled: !(index + 1) || monthIsDisabled(props.minDate, props.maxDate, props.year.valueOf(), index),
  }))
));

const monthList = ref<HTMLElement | null>(null);

useListScroller(monthList, '.vdatetime-month-picker__item--selected');

const emits = defineEmits(['change']);

const select = (month: TimeElement) => {
  if (!month.disabled) {
    emits('change', parseInt(month.number as string, 10));
  }
};
</script>

<style>
.vdatetime-month-picker {
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

.vdatetime-month-picker__list {
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

.vdatetime-month-picker__item {
  padding: 10px 0;
  font-size: 20px;
  text-align: center;
  cursor: pointer;
  transition: font-size .3s;
}

.vdatetime-month-picker__item:hover {
  font-size: 32px;
}

.vdatetime-month-picker__item--selected {
  color: #3f51b5;
  font-size: 32px;
}

.vdatetime-month-picker__item--disabled {
  opacity: 0.4;
  cursor: default;

  &:hover {
    color: inherit;
    background: transparent;
  }
}
</style>
