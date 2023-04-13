<template>
  <div class="vdatetime-calendar">
    <div class="vdatetime-calendar__navigation">
      <div class="vdatetime-calendar__navigation--previous" @click="previousMonth">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 61.3 102.8">
          <path fill="none" stroke="#444" stroke-width="14" stroke-miterlimit="10" d="M56.3 97.8L9.9 51.4 56.3 5"/>
        </svg>
      </div>
      <div class="vdatetime-calendar__current--month">{{ monthName }} {{ newYear }}</div>
      <div class="vdatetime-calendar__navigation--next" @click="nextMonth">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 61.3 102.8">
          <path fill="none" stroke="#444" stroke-width="14" stroke-miterlimit="10" d="M56.3 97.8L9.9 51.4 56.3 5"/>
        </svg>
      </div>
    </div>
    <div class="vdatetime-calendar__month">
      <div
        v-for="weekday in weekdays"
        :key="weekday"
        class="vdatetime-calendar__month__weekday"
      >
        {{ weekday }}
      </div>
      <div
        v-for="dayElement in days"
        :key="dayElement"
        class="vdatetime-calendar__month__day"
        :class="{
          'vdatetime-calendar__month__day--selected': dayElement.selected,
          'vdatetime-calendar__month__day--disabled': dayElement.disabled,
        }"
        @click="selectDay(dayElement)"
      >
        <span>
          <span>
            {{ dayElement.number }}
          </span>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { DateTime } from 'luxon';
import { computed, PropType, ref } from 'vue';

import { monthDayIsDisabled, monthDays, monthsGenerator, type TimeElement, weekdaysGenerator } from './util';

const props = defineProps({
  year: {
    type: Number,
    required: true,
  },
  month: {
    type: Number,
    required: true,
  },
  day: {
    type: Number,
    default: null,
  },
  disabled: { type: Array, default: () => [] },
  minDate: {
    type: Object as PropType<DateTime>,
    default: null,
  },
  maxDate: {
    type: Object as PropType<DateTime>,
    default: null,
  },
  weekStart: {
    type: Number,
    default: 1,
  },
});

const emits = defineEmits(['change']);

const newDate = ref<DateTime>(
  DateTime.fromObject({ year: props.year.valueOf(), month: props.month.valueOf() }, { zone: 'UTC' }),
);
const weekdays = weekdaysGenerator(props.weekStart.valueOf());
const months = monthsGenerator();

const newYear = computed<number>(() => newDate.value.year);
const newMonth = computed<number>(() => newDate.value.month);
const monthName = computed<string>(() => months[newMonth.value - 1]);
const days = computed<TimeElement[]>(() => monthDays(newYear.value, newMonth.value, props.weekStart.valueOf())
  .map((day: number | null): TimeElement => ({
    number: day,
    selected: !!day && props.year.valueOf() === newYear.value &&
      props.month.valueOf() === newMonth.value && props.day?.valueOf() === day,
    disabled: !day || monthDayIsDisabled(props.minDate, props.maxDate, newYear.value, newMonth.value, day),
  })));

const selectDay = (day: TimeElement) => {
  if (!day.disabled) {
    emits('change', newYear.value, newMonth.value, day.number);
  }
};
const previousMonth = () => {
  newDate.value = newDate.value.minus({ month: 1 });
};
const nextMonth = () => {
  newDate.value = newDate.value.plus({ month: 1 });
};
</script>

<style>
.vdatetime-calendar__navigation,
.vdatetime-calendar__navigation * {
  box-sizing: border-box;
}

.vdatetime-calendar__navigation {
  position: relative;
  margin: 15px 0;
  padding: 0 30px;
  width: 100%;
}

.vdatetime-calendar__navigation--previous,
.vdatetime-calendar__navigation--next {
  position: absolute;
  top: 0;
  padding: 0 5px;
  width: 18px;
  cursor: pointer;
}

.vdatetime-calendar__navigation--previous svg,
.vdatetime-calendar__navigation--next svg {
  width: 8px;
  height: 13px;
}

.vdatetime-calendar__navigation--previous svg path,
.vdatetime-calendar__navigation--next svg path {
  transition: stroke .3s;
}

.vdatetime-calendar__navigation--previous:hover svg path,
.vdatetime-calendar__navigation--next:hover svg path {
  stroke: #888;
}

.vdatetime-calendar__navigation--previous {
  left: 25px;
}

.vdatetime-calendar__navigation--next {
  right: 25px;
  transform: scaleX(-1);
}

.vdatetime-calendar__current--month {
  text-align: center;
  text-transform: capitalize;
}

.vdatetime-calendar__month {
  padding: 0 20px;
  transition: height .2s;
}

.vdatetime-calendar__month__weekday,
.vdatetime-calendar__month__day {
  display: inline-block;
  width: calc(100% / 7);
  line-height: 36px;
  text-align: center;
  font-size: 15px;
  font-weight: 300;
  cursor: pointer;
}

.vdatetime-calendar__month__weekday > span,
.vdatetime-calendar__month__day > span {
  display: block;
  width: 100%;
  position: relative;
  height: 0;
  padding: 0 0 100%;
  overflow: hidden;
}

.vdatetime-calendar__month__weekday > span > span,
.vdatetime-calendar__month__day > span > span {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  border: 0;
  border-radius: 50%;
  transition: background-color .3s, color .3s;
}

.vdatetime-calendar__month__weekday {
  font-weight: bold;
}

.vdatetime-calendar__month__day:hover > span > span {
  background: #eee;
}

.vdatetime-calendar__month__day--selected span > span,
.vdatetime-calendar__month__day--selected:hover > span > span {
  color: #fff;
  background: #3f51b5;
}

.vdatetime-calendar__month__day--disabled {
  opacity: 0.4;
  cursor: default;
}

.vdatetime-calendar__month__day--disabled:hover > span > span {
  color: inherit;
  background: transparent;
}
</style>
