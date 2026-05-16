<template>
  <div class="calendar">
    <div class="calendar__header">
      <button class="calendar__nav" @click="prevMonth">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      <div class="calendar__month-wrapper">
        <transition name="slide-fade" mode="out-in">
          <span :key="monthLabel" class="calendar__month">{{
            monthLabel
          }}</span>
        </transition>
      </div>

      <button class="calendar__nav" @click="nextMonth">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>
    </div>

    <div class="calendar__body">
      <transition :name="transitionName" mode="out-in">
        <div :key="monthLabel" class="calendar__grid">
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
              'has-range': props.checkin && props.checkout,
            }"
            :disabled="isDisabled(day)"
            @click="selectDate(day)"
          >
            <span class="calendar__day-number">{{ day.getDate() }}</span>
          </button>
        </div>
      </transition>
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
const weekDays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

const today = new Date();
const viewMonth = ref(
  props.checkin ? props.checkin.getMonth() : today.getMonth(),
);
const viewYear = ref(
  props.checkin ? props.checkin.getFullYear() : today.getFullYear(),
);
const transitionName = ref("slide-next");

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
  transitionName.value = "slide-prev";
  if (viewMonth.value === 0) {
    viewMonth.value = 11;
    viewYear.value--;
  } else {
    viewMonth.value--;
  }
}

function nextMonth() {
  transitionName.value = "slide-next";
  if (viewMonth.value === 11) {
    viewMonth.value = 0;
    viewYear.value++;
  } else {
    viewMonth.value++;
  }
}

function isToday(day) {
  const now = new Date();
  return day.toDateString() === now.toDateString();
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
  border: 1px solid #e8e1d9;
  border-radius: 24px;
  padding: 20px;
  width: 100%;
  max-width: none;
  background: #fff;
  box-sizing: border-box;
  user-select: none;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  &__month-wrapper {
    overflow: hidden;
    height: 24px;
    display: flex;
    align-items: center;
  }

  &__month {
    font-size: 1.1rem;
    font-weight: 600;
    color: #3d2c17;
    display: block;
  }

  &__nav {
    background: #f8f5f2;
    border: none;
    border-radius: 50%;
    width: 36px;
    height: 36px;
    cursor: pointer;
    color: #a68b6a;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;

    &:hover {
      background: #eee4d8;
      color: #3d2c17;
    }
  }

  &__body {
    position: relative;
    overflow: hidden;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    row-gap: 8px;
    width: 100%;
  }

  &__weekday {
    text-align: center;
    color: #b0a79c;
    font-size: 0.8rem;
    font-weight: 600;
    padding-bottom: 12px;
    text-transform: uppercase;
  }

  &__day {
    aspect-ratio: 1 / 1;
    border: none;
    background: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.95rem;
    position: relative;
    color: #3d2c17;
    z-index: 1;
    padding: 0;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

    &-number {
      position: relative;
      z-index: 2;
    }

    &:hover:not(:disabled) {
      color: #fff;
      &::after {
        content: "";
        position: absolute;
        width: 80%;
        height: 80%;
        background: #d2b28a;
        border-radius: 50%;
        z-index: 1;
        animation: pop 0.2s ease-out forwards;
      }
    }

    &.is-selected {
      color: #fff !important;
      &::before {
        content: "";
        position: absolute;
        inset: 0;
        background: var(--primary, #bd9e7e);
        z-index: 1;
      }

      &:not(.has-range) {
        &::before {
          border-radius: 50%;
          transform: scale(0.9);
        }
      }
    }

    &.is-range {
      background-color: rgba(189, 158, 126, 0.2);
      color: #3d2c17;
    }

    &.has-range {
      &.is-checkin::before {
        border-top-left-radius: 50%;
        border-bottom-left-radius: 50%;
      }
      &.is-checkout::before {
        border-top-right-radius: 50%;
        border-bottom-right-radius: 50%;
      }
    }

    &.is-today:not(.is-selected) {
      font-weight: 700;
      color: var(--primary, #bd9e7e);
      &::after {
        content: "";
        position: absolute;
        bottom: 6px;
        width: 4px;
        height: 4px;
        background: currentColor;
        border-radius: 50%;
      }
    }

    &.is-disabled {
      color: #e0e0e0;
      cursor: not-allowed;
    }
  }
}

.slide-next-enter-active,
.slide-next-leave-active,
.slide-prev-enter-active,
.slide-prev-leave-active {
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-next-enter-from {
  opacity: 0;
  transform: translateX(30px);
}
.slide-next-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.slide-prev-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}
.slide-prev-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.25s ease;
}
.slide-fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@keyframes pop {
  0% {
    transform: scale(0.5);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@media (max-width: 400px) {
  .calendar {
    padding: 15px;
    &__day {
      font-size: 0.85rem;
    }
  }
}
</style>
