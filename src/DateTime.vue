<template>
  <div class="vdatetime" :class="$attrs.class">
    <slot name="before"/>
    <input
      :id="inputId"
      class="vdatetime-input"
      :class="inputClass"
      :style="inputStyle"
      type="text"
      :value="inputValue"
      v-bind="$attrs"
      @click="open"
      @focus="open"
    >
    <input v-if="hiddenName" type="hidden" :name="hiddenName" :value="modelValue" @input="setValue">
    <slot name="after"/>
    <transition-group name="vdatetime-fade" tag="div">
      <div v-if="isOpen && !hideBackdrop" key="overlay" class="vdatetime-overlay" @click.self="clickOutside"/>
      <datetime-popup
        v-if="isOpen"
        key="popup"
        :type="type"
        :datetime="popupDate"
        :phrases="phrases"
        :use12-hour="use12Hour"
        :hour-step="hourStep"
        :minute-step="minuteStep"
        :min-datetime="popupMinDatetime"
        :max-datetime="popupMaxDatetime"
        :auto="auto"
        :week-start="weekStart"
        :flow="flow"
        :title="title"
        @confirm="confirm"
        @cancel="cancel"
      >
        <template slot="button-cancel__internal" slot-scope="scope">
          <slot name="button-cancel" :step="scope.step">{{ phrases.cancel }}</slot>
        </template>
        <template slot="button-confirm__internal" slot-scope="scope">
          <slot name="button-confirm" :step="scope.step">{{ phrases.ok }}</slot>
        </template>
      </datetime-popup>
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import { DateTime } from 'luxon';
import { computed, onMounted, ref, watch } from 'vue';

import DatetimePopup from './DatetimePopup.vue';
import { datetimeFromISO, startOfDay, calculateWeekStart } from './util';

const props = defineProps({
  modelValue: { type: String, default: '' },
  valueZone: {
    type: String,
    default: 'UTC',
  },
  inputId: {
    type: String,
    default: null,
  },
  inputClass: {
    type: [Object, Array, String],
    default: '',
  },
  inputStyle: {
    type: [Object, Array, String],
    default: '',
  },
  hiddenName: { type: String, default: '' },
  zone: {
    type: String,
    default: 'local',
  },
  format: {
    type: [Object, String],
    default: null,
  },
  type: {
    type: String,
    default: 'date',
  },
  phrases: {
    type: Object,
    default() {
      return {
        cancel: 'Cancel',
        ok: 'Ok',
      };
    },
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
  minDatetime: {
    type: String,
    default: null,
  },
  maxDatetime: {
    type: String,
    default: null,
  },
  auto: {
    type: Boolean,
    default: false,
  },
  weekStart: {
    type: Number,
    default() {
      return calculateWeekStart();
    },
  },
  flow: { type: Array, default: null },
  title: { type: String, default: '' },
  hideBackdrop: {
    type: Boolean,
    default: false,
  },
  backdropClick: {
    type: Boolean,
    default: true,
  },
});

const emits = defineEmits(['input', 'close', 'update:modelValue']);

const isOpen = ref<boolean>(false);
const datetime = computed<DateTime | null>({
  get() { return datetimeFromISO(props.modelValue); },
  set(newValue: DateTime | null) {
    if (newValue) {
      emits('update:modelValue', newValue.toISO());
    }
  },
});

const inputValue = computed(() => {
  let format: string | Object = props.format;

  if (!format) {
    switch (props.type) {
    case 'date':
      format = DateTime.DATE_MED;
      break;
    case 'time':
      format = DateTime.TIME_24_SIMPLE;
      break;
    case 'datetime':
    case 'default':
      format = DateTime.DATETIME_MED;
      break;
    default:
      break;
    }
  }

  if (typeof format === 'string') {
    return datetime.value ? DateTime.fromISO(props.modelValue).setZone(props.zone).toFormat(format) : '';
  }
  return datetime.value ? datetime.value.setZone(props.zone).toLocaleString(format) : '';
});

const popupMinDatetime = computed<DateTime | null>(() => (
  props.minDatetime ? DateTime.fromISO(props.minDatetime).setZone(props.zone) : null
));

const popupMaxDatetime = computed<DateTime | null>(() => (
  props.maxDatetime ? DateTime.fromISO(props.maxDatetime).setZone(props.zone) : null
));

const newPopupDatetime = () => {
  let datetime = DateTime.utc().setZone(props.zone).set({ second: 0, millisecond: 0 });

  if (popupMinDatetime.value && datetime < popupMinDatetime.value) {
    datetime = popupMinDatetime.value.set({ second: 0, millisecond: 0 });
  }

  if (popupMaxDatetime.value && datetime > popupMaxDatetime.value) {
    datetime = popupMaxDatetime.value.set({ second: 0, millisecond: 0 });
  }

  if (props.minuteStep === 1) {
    return datetime;
  }

  const roundedMinute = Math.round(datetime.minute / props.minuteStep) * props.minuteStep;

  if (roundedMinute === 60) {
    return datetime.plus({ hours: 1 }).set({ minute: 0 });
  }

  return datetime.set({ minute: roundedMinute });
};

const popupDate = computed(() => (datetime.value ? datetime.value.setZone(props.zone) : newPopupDatetime()));

const emitInput = () => {
  let innerValue = datetime.value ? datetime.value.setZone(props.valueZone) : null;

  if (innerValue && props.type === 'date') {
    innerValue = startOfDay(innerValue);
  }

  emits('input', innerValue ? innerValue.toISO() : '');
};

onMounted(() => {
  emitInput();
});

const open = (event: any) => {
  event.target.blur();
  isOpen.value = true;
};

const close = () => {
  isOpen.value = false;
  emits('close');
};

const confirm = (newValue: DateTime) => {
  datetime.value = newValue.toUTC();
  emitInput();
  close();
};

const cancel = () => {
  close();
};

const clickOutside = () => {
  if (props.backdropClick === true) { cancel(); }
};

const setValue = (event: any) => {
  datetime.value = datetimeFromISO(event.target.value);
  emitInput();
};

watch(() => props.modelValue, ((value: string) => {
  datetime.value = datetimeFromISO(value);
}));

</script>

<script lang="ts">
export default { inheritAttrs: false };
</script>

<style>
.vdatetime-fade-enter-active,
.vdatetime-fade-leave-active {
  transition: opacity .4s;
}

.vdatetime-fade-enter,
.vdatetime-fade-leave-to {
  opacity: 0;
}

.vdatetime-overlay {
  z-index: 999;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
  transition: opacity .5s;
}
</style>
