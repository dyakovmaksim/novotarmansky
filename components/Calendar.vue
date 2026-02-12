<template>
  <div class="calendar">
    <div class="calendar__header">
      <button class="calendar__nav" @click="prevMonth">&lt;</button>
      <span class="calendar__month">{{ monthLabel }}</span>
      <button class="calendar__nav" @click="nextMonth">&gt;</button>
    </div>
    <div class="calendar__grid">
      <div v-for="d in weekDays" :key="d" class="calendar__weekday">
        {{ d }}
      </div>
      <div
        v-for="n in firstDayOffset"
        :key="'empty' + n"
        class="calendar__empty"
      ></div>
      <button
        v-for="day in days"
        :key="day.getTime()"
        class="calendar__day"
        :class="{
          'is-today': isToday(day),
          'is-selected': isSelected(day),
          'is-range': isInRange(day),
          'is-disabled': isDisabled(day),
          'is-checkin':
            props.checkin && day.getTime() === props.checkin.getTime(),
          'is-checkout':
            props.checkout && day.getTime() === props.checkout.getTime(),
          'has-range': props.checkin && props.checkout, // Флаг: выбраны обе даты
        }"
        :disabled="isDisabled(day)"
        @click="selectDate(day)"
      >
        {{ day.getDate() }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";

const props = defineProps({
  checkin: Date,
  checkout: Date,
});
const emit = defineEmits(["select"]);

const monthNames = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
];
const weekDays = ["S", "M", "T", "W", "T", "F", "S"];

const today = new Date();
const viewMonth = ref(
  props.checkin ? props.checkin.getMonth() : today.getMonth(),
);
const viewYear = ref(
  props.checkin ? props.checkin.getFullYear() : today.getFullYear(),
);

watch(
  () => props.checkin,
  (val) => {
    if (val) {
      viewMonth.value = val.getMonth();
      viewYear.value = val.getFullYear();
    }
  },
);

const daysInMonth = computed(() =>
  new Date(viewYear.value, viewMonth.value + 1, 0).getDate(),
);
const firstDayOffset = computed(() => {
  const jsDay = new Date(viewYear.value, viewMonth.value, 1).getDay();
  return jsDay === 0 ? 6 : jsDay - 1;
});

const days = computed(() => {
  return Array.from(
    { length: daysInMonth.value },
    (_, i) => new Date(viewYear.value, viewMonth.value, i + 1),
  );
});

const monthLabel = computed(
  () => `${monthNames[viewMonth.value]} ${viewYear.value}`,
);

function prevMonth() {
  viewMonth.value === 0
    ? ((viewMonth.value = 11), viewYear.value--)
    : viewMonth.value--;
}
function nextMonth() {
  viewMonth.value === 11
    ? ((viewMonth.value = 0), viewYear.value++)
    : viewMonth.value++;
}

function isToday(day) {
  const now = new Date();
  return (
    day.getDate() === now.getDate() &&
    day.getMonth() === now.getMonth() &&
    day.getFullYear() === now.getFullYear()
  );
}
function isSelected(day) {
  return (
    (props.checkin && day.getTime() === props.checkin.getTime()) ||
    (props.checkout && day.getTime() === props.checkout.getTime())
  );
}
function isInRange(day) {
  return (
    props.checkin &&
    props.checkout &&
    day > props.checkin &&
    day < props.checkout
  );
}
function isDisabled(day) {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return day < now;
}
function selectDate(day) {
  emit("select", day);
}
</script>

<style lang="scss" scoped>
.calendar {
  border: 2px solid #d2b28a;
  border-radius: 12px;
  padding: 12px 15px; // Чуть меньше паддинги по бокам
  width: 100%;        // Резиновая ширина
  max-width: 350px;   // Но не шире 350px, чтобы не растягивался на десктопе
  background: #fff;
  box-sizing: border-box;
  user-select: none;
  margin: 0 auto;     // Центровка

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    font-weight: 600;
    color: #3d2c17;
    
    .calendar__nav {
      background: none;
      border: none;
      cursor: pointer;
      color: #a68b6a;
      font-size: 1.5rem; // Увеличили стрелки для мобилок
      padding: 5px 10px; // Увеличили область клика стрелок
    }
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    column-gap: 0;
    row-gap: 4px;
  }

  &__weekday {
    text-align: center;
    color: #b0a79c;
    font-size: 0.85rem;
    padding-bottom: 8px;
  }

  &__day {
    aspect-ratio: 1 / 1; // Делаем ячейки идеально квадратными!
    width: 100%;
    border: none;
    background: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    position: relative;
    color: #3d2c17;
    z-index: 1;
    padding: 0;

    // --- СОСТОЯНИЕ 1: Выбрана одна точка ---
    &.is-selected:not(.has-range) {
      background-color: #a68b6a;
      color: #fff;
      border-radius: 50%;
      // На мобилках лучше не ограничивать ширину в px, 
      // а использовать scale или небольшие инсеты
      transform: scale(0.9); 
    }

    // --- СОСТОЯНИЕ 2: Выбран диапазон ---
    &.has-range {
      &.is-selected,
      &.is-range {
        background-color: gainsboro;
        color: #fff;
        border-radius: 0;
      }

      &.is-selected {
        background-color: gainsboro;
      }

      &.is-checkin {
        border-top-left-radius: 50%;
        border-bottom-left-radius: 50%;
      }

      &.is-checkout {
        border-top-right-radius: 50%;
        border-bottom-right-radius: 50%;
      }
    }

    &.is-today:not(.is-selected):not(.is-range) {
      border: 1.5px solid #d2b28a;
      border-radius: 50%;
      transform: scale(0.9);
    }

    &.is-disabled {
      color: #ccc;
      cursor: not-allowed;
      background: none !important;
    }
  }
}

/* Корректировка для совсем маленьких экранов (iPhone SE) */
@media (max-width: 350px) {
  .calendar {
    padding: 8px 10px;
    
    &__day {
      font-size: 0.9rem;
    }
    
    &__month {
      font-size: 0.95rem;
    }
  }
}
</style>
