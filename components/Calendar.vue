<template>
  <div class="calendar">
    <div class="calendar__header">
      <button class="calendar__nav" @click="prevMonth">&lt;</button>
      <span class="calendar__month">
        {{ monthLabel }}
      </span>
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
          today: isToday(day),
          selected: isSelected(day),
          range: isInRange(day),
          disabled: isDisabled(day),
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

// Props
const props = defineProps({
  checkin: Date,
  checkout: Date,
  selecting: String,
});
const emit = defineEmits(["select"]);

// Локализация
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

// Состояние отображаемого месяца
const today = new Date();
const viewMonth = ref(
  props.checkin ? props.checkin.getMonth() : today.getMonth()
);
const viewYear = ref(
  props.checkin ? props.checkin.getFullYear() : today.getFullYear()
);

// Если изменили дату заезда — перескакиваем на этот месяц
watch(
  () => props.checkin,
  (val) => {
    if (val) {
      viewMonth.value = val.getMonth();
      viewYear.value = val.getFullYear();
    }
  }
);

// Сколько дней в месяце
const daysInMonth = computed(() => {
  return new Date(viewYear.value, viewMonth.value + 1, 0).getDate();
});

// Смещение для первой недели (чтобы месяц всегда с понедельника)
const firstDayOffset = computed(() => {
  const jsDay = new Date(viewYear.value, viewMonth.value, 1).getDay(); // 0-вс, 1-пн...
  return jsDay === 0 ? 6 : jsDay - 1;
});

// Массив дат месяца
const days = computed(() => {
  return Array.from(
    { length: daysInMonth.value },
    (_, i) => new Date(viewYear.value, viewMonth.value, i + 1)
  );
});

// Метки
const monthLabel = computed(
  () => `${monthNames[viewMonth.value]} ${viewYear.value}`
);

// Навигация
function prevMonth() {
  if (viewMonth.value === 0) {
    viewMonth.value = 11;
    viewYear.value--;
  } else {
    viewMonth.value--;
  }
}
function nextMonth() {
  if (viewMonth.value === 11) {
    viewMonth.value = 0;
    viewYear.value++;
  } else {
    viewMonth.value++;
  }
}

// Выделения
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

// Клик по дате
function selectDate(day) {
  emit("select", day);
}
</script>

<style lang="scss" scoped>
.calendar {
  border: 2px solid #d2b28a;
  border-radius: 12px;
  padding: 12px 18px;
  width: 290px;
  background: #fff;
  box-sizing: border-box;
  user-select: none;
  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
    font-size: 1.1rem;
    font-weight: 500;
    color: #a68b6a;
    .calendar__nav {
      background: none;
      border: none;
      font-size: 1.2rem;
      color: #a68b6a;
      cursor: pointer;
      padding: 2px 8px;
      border-radius: 6px;
      transition: background 0.15s;
      &:hover {
        background: #f7f0e6;
      }
    }
  }
  &__month {
    font-weight: 600;
    color: #3d2c17;
  }
  &__grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 2px;
    margin-top: 2px;
  }
  &__weekday {
    color: #b0a79c;
    text-align: center;
    font-size: 0.93rem;
    padding-bottom: 3px;
    font-weight: 500;
  }
  &__empty {
    height: 30px;
  }
  &__day {
    height: 32px;
    width: 32px;
    border: none;
    border-radius: 50%;
    background: none;
    color: #3d2c17;
    font-size: 1rem;
    cursor: pointer;
    margin: 1px;
    transition: background 0.18s, color 0.18s;
    &.today {
      border: 1.5px solid #d2b28a;
    }
    &.selected {
      background: #fff;
      border: 2px solid #d2b28a;
      color: #a68b6a;
      font-weight: 600;
    }
    &.range {
      background: #d2b28a;
      color: #fff;
    }
    &.disabled {
      color: #e5e3df;
      background: none;
      cursor: not-allowed;
    }
  }
}
</style>
