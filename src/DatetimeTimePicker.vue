<template>
  <div :class="{ 'vdatetime-time-picker': true, 'vdatetime-time-picker__with-suffix': use12Hour }">
    <div ref="hourList" class="vdatetime-time-picker__list vdatetime-time-picker__list--hours">
      <div
        v-for="hourElement in hours"
        :key="hourElement"
        class="vdatetime-time-picker__item"
        :class="{
          'vdatetime-time-picker__item--selected': hourElement.selected,
          'vdatetime-time-picker__item--disabled': hourElement.disabled,
        }"
        @click="selectHour(hourElement)"
      >
        {{ formatHour(hourElement.number) }}
      </div>
    </div>
    <div ref="minuteList" class="vdatetime-time-picker__list vdatetime-time-picker__list--minutes">
      <div
        v-for="minuteElement in minutes"
        :key="minuteElement"
        class="vdatetime-time-picker__item"
        :class="{
          'vdatetime-time-picker__item--selected': minuteElement.selected,
          'vdatetime-time-picker__item--disabled': minuteElement.disabled,
        }"
        @click="selectMinute(minuteElement)"
      >
        {{ minuteElement.number }}
      </div>
    </div>
    <div v-if="use12Hour" ref="suffixList" class="vdatetime-time-picker__list vdatetime-time-picker__list--suffix">
      <div
        class="vdatetime-time-picker__item"
        :class="{ 'vdatetime-time-picker__item--selected': hour < 12 }"
        @click="selectSuffix('am')"
      >
        am
      </div>
      <div
        class="vdatetime-time-picker__item"
        :class="{ 'vdatetime-time-picker__item--selected': hour >= 12 }"
        @click="selectSuffix('pm')"
      >
        pm
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

import useListScroller from './composables/ListScroller';
import { hoursGenerator, minutesGenerator, pad, timeComponentIsDisabled } from './util';
import type { TimeElement } from './util';

const props = defineProps({
  hour: {
    type: Number,
    required: true,
  },
  minute: {
    type: Number,
    required: true,
  },
  use12Hour: {
    type: Boolean,
    default: false,
  },
  hourStep: {
    type: Number,
    default: 1,
  },
  minuteStep: {
    type: Number,
    default: 1,
  },
  minTime: {
    type: String,
    default: null,
  },
  maxTime: {
    type: String,
    default: null,
  },
});

const minHour = computed<number | null>(() => (props.minTime ? parseInt(props.minTime.split(':')[0], 10) : null));
const maxHour = computed<number | null>(() => (props.maxTime ? parseInt(props.maxTime.split(':')[0], 10) : null));

const hours = computed<TimeElement[]>(() => hoursGenerator(props.hourStep).filter((hour: number) => {
  if (!props.use12Hour) {
    return true;
  } if (props.hour < 12) {
    return hour < 12;
  }
  return hour >= 12;
}).map((hour: number): TimeElement => ({
  number: hour,
  label: pad(hour),
  selected: hour === props.hour.valueOf(),
  disabled: timeComponentIsDisabled(minHour.value, maxHour.value, hour),
})));

const minMinute = computed<number | null>(
  () => (props.minTime && minHour.value === props.hour.valueOf() ? parseInt(props.minTime.split(':')[1], 10) : null),
);
const maxMinute = computed<number | null>(
  () => (props.maxTime && maxHour.value === props.hour.valueOf() ? parseInt(props.maxTime.split(':')[1], 10) : null),
);

const minutes = computed<TimeElement[]>(() => minutesGenerator(props.minuteStep).map((minute: number): TimeElement => ({
  number: minute,
  label: pad(minute),
  selected: minute === props.minute.valueOf(),
  disabled: timeComponentIsDisabled(minMinute.value, maxMinute.value, minute),
})));

const hourList = ref<HTMLInputElement | null>(null);
const minuteList = ref<HTMLInputElement | null>(null);

useListScroller(hourList, '.vdatetime-time-picker__item--selected');
useListScroller(minuteList, '.vdatetime-time-picker__item--selected');

const emits = defineEmits(['change']);

const selectHour = (hour: TimeElement) => {
  if (!hour.disabled) {
    emits('change', { hour: hour.number });
  }
};

const selectMinute = (minute: TimeElement) => {
  if (!minute.disabled) {
    emits('change', { minute: minute.number });
  }
};

const selectSuffix = (suffix: 'am' | 'pm') => {
  if (suffix === 'am') {
    if (props.hour >= 12) {
      emits('change', { hour: props.hour - 12, suffixTouched: true });
    }
  }
  if (suffix === 'pm') {
    if (props.hour < 12) {
      emits('change', { hour: props.hour + 12, suffixTouched: true });
    }
  }
};

const formatHour = (hour: number) => {
  if (props.use12Hour) {
    return hour % 12 ? hour % 12 : 12;
  }
  return hour;
};
</script>

<style type="text/css">
.vdatetime-time-picker {
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

.vdatetime-time-picker__list {
  float: left;
  width: 50%;
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

.vdatetime-time-picker__with-suffix .vdatetime-time-picker__list {
  width: 33.3%;
}

.vdatetime-time-picker__item {
  padding: 10px 0;
  font-size: 20px;
  text-align: center;
  cursor: pointer;
  transition: font-size .3s;
}

.vdatetime-time-picker__item:hover {
  font-size: 32px;
}

.vdatetime-time-picker__item--selected {
  color: #3f51b5;
  font-size: 32px;
}

.vdatetime-time-picker__item--disabled {
  opacity: 0.4;
  cursor: default;
  font-size: 20px !important;
}
</style>
