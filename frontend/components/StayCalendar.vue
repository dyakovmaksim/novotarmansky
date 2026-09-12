<template>
  <div class="stay-calendar" :aria-busy="loading">
    <div class="stay-calendar__heading">
      <button
        type="button"
        class="calendar-arrow"
        aria-label="Предыдущий месяц"
        :disabled="atFirstMonth || loading"
        @click="move(-1)"
      >
        ‹
      </button>
      <strong aria-live="polite">{{ monthLabel }}</strong>
      <button
        type="button"
        class="calendar-arrow"
        aria-label="Следующий месяц"
        :disabled="loading"
        @click="move(1)"
      >
        ›
      </button>
    </div>
    <p class="calendar-instruction" aria-live="polite">
      {{
        loading
          ? "Проверяем свободные даты…"
          : selecting === "checkout" && checkin
            ? "Теперь выберите день выезда"
            : checkout
              ? "Даты выбраны. Можно выбрать новый заезд"
              : "Выберите день заезда"
      }}
    </p>
    <div class="stay-calendar__grid">
      <span v-for="name in weekDays" :key="name" class="weekday">{{
        name
      }}</span>
      <span v-for="n in offset" :key="'empty' + n" aria-hidden="true" />
      <button
        v-for="day in days"
        :key="dateKey(day)"
        type="button"
        class="calendar-day"
        :data-date="dateKey(day)"
        :class="{
          endpoint: selected(day),
          between: inRange(day),
          today: dateKey(day) === dateKey(today),
          occupied: occupied(day),
        }"
        :disabled="unavailable(day)"
        :aria-label="label(day)"
        :aria-pressed="!!selected(day)"
        :aria-current="dateKey(day) === dateKey(today) ? 'date' : undefined"
        @click="$emit('select', day)"
        @keydown="navigateKeys($event, day)"
      >
        {{ day.getDate() }}
      </button>
    </div>
    <div class="calendar-legend">
      <span><i class="legend-free" />Свободно</span
      ><span><i class="legend-busy" />Недоступно</span
      ><span><i class="legend-selected" />Ваши даты</span>
    </div>
  </div>
</template>
<script setup>
import { computed, ref, nextTick, watch } from "vue";
import { dateKey, rangeUnavailable, houseToday } from "~/utils/bookingDates";
const props = defineProps({
  checkin: Date,
  checkout: Date,
  selecting: { type: String, default: "checkin" },
  disabledDates: { type: Array, default: () => [] },
  loading: Boolean,
  blocked: Boolean,
});
defineEmits(["select"]);
const today = houseToday();
const view = ref(
  new Date(
    (props.checkin || today).getFullYear(),
    (props.checkin || today).getMonth(),
    1,
  ),
);
const weekDays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
const monthLabel = computed(() =>
  view.value.toLocaleDateString("ru-RU", { month: "long", year: "numeric" }),
);
const offset = computed(() => (view.value.getDay() + 6) % 7);
const days = computed(() =>
  Array.from(
    {
      length: new Date(
        view.value.getFullYear(),
        view.value.getMonth() + 1,
        0,
      ).getDate(),
    },
    (_, i) => new Date(view.value.getFullYear(), view.value.getMonth(), i + 1),
  ),
);
const atFirstMonth = computed(
  () =>
    view.value.getFullYear() === today.getFullYear() &&
    view.value.getMonth() === today.getMonth(),
);
watch(
  () => props.checkin,
  (day) => {
    if (day) view.value = new Date(day.getFullYear(), day.getMonth(), 1);
  },
);
function move(amount) {
  view.value = new Date(
    view.value.getFullYear(),
    view.value.getMonth() + amount,
    1,
  );
}
function occupied(day) {
  return props.disabledDates.includes(dateKey(day));
}
function unavailable(day) {
  return (
    props.loading ||
    props.blocked ||
    day < today ||
    occupied(day) ||
    (props.selecting === "checkout" &&
      props.checkin &&
      day > props.checkin &&
      rangeUnavailable(props.checkin, day, props.disabledDates))
  );
}
function selected(day) {
  return (
    (props.checkin && dateKey(day) === dateKey(props.checkin)) ||
    (props.checkout && dateKey(day) === dateKey(props.checkout))
  );
}
function inRange(day) {
  return (
    props.checkin &&
    props.checkout &&
    day > props.checkin &&
    day < props.checkout
  );
}
function label(day) {
  return (
    day.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }) +
    (occupied(day) ? ", недоступно" : "") +
    (props.checkin && dateKey(day) === dateKey(props.checkin)
      ? ", заезд"
      : "") +
    (props.checkout && dateKey(day) === dateKey(props.checkout)
      ? ", выезд"
      : "")
  );
}
async function navigateKeys(event, day) {
  const shifts = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
  if (!(event.key in shifts)) return;
  event.preventDefault();
  const target = new Date(day);
  target.setDate(target.getDate() + shifts[event.key]);
  if (target < today) return;
  view.value = new Date(target.getFullYear(), target.getMonth(), 1);
  await nextTick();
  event.target
    .closest(".stay-calendar")
    .querySelector('[data-date="' + dateKey(target) + '"]:not(:disabled)')
    ?.focus();
}
</script>
<style scoped>
.stay-calendar {
  width: 100%;
  min-width: 0;
  background: #fff;
}
.stay-calendar__heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}
.stay-calendar__heading strong {
  font-size: 18px;
  text-transform: capitalize;
}
.calendar-arrow {
  width: 44px;
  height: 44px;
  border: 1px solid var(--line);
  border-radius: 12px;
  background: white;
  color: var(--ink);
  font-size: 28px;
  line-height: 1;
}
.calendar-arrow:disabled {
  opacity: 0.35;
  cursor: default;
}
.calendar-instruction {
  font-size: 14px;
  color: var(--muted);
  margin: 16px 0 20px;
  min-height: 22px;
}
.stay-calendar__grid {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 4px 0;
}
.weekday {
  text-align: center;
  color: var(--muted);
  font-size: 13px;
  padding-bottom: 12px;
}
.calendar-day {
  height: 48px;
  min-width: 0;
  background: white;
  border-radius: 8px;
  color: var(--ink);
  font-size: 16px;
  font-weight: 500;
}
.calendar-day:hover:not(:disabled) {
  background: var(--sand);
}
.calendar-day:disabled {
  color: #817a72;
  cursor: not-allowed;
  background: #f5f4f1;
}
.calendar-day.occupied {
  text-decoration: line-through;
}
.calendar-day.today:not(.endpoint) {
  box-shadow: inset 0 0 0 1px var(--accent);
}
.calendar-day.between {
  background: var(--sand);
  border-radius: 0;
}
.calendar-day.endpoint,
.calendar-day.endpoint:hover {
  background: var(--accent);
  color: white;
}
.calendar-legend {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  padding-top: 20px;
  margin-top: 16px;
  border-top: 1px solid var(--line);
  font-size: 12px;
  color: var(--muted);
}
.calendar-legend span {
  display: flex;
  align-items: center;
  gap: 5px;
}
.calendar-legend i {
  width: 10px;
  height: 10px;
  border-radius: 3px;
  border: 1px solid #a29a90;
}
.legend-free {
  background: #fff;
}
.legend-busy {
  background: #e2dfda;
}
.legend-selected {
  background: var(--accent);
}
@media (max-width: 360px) {
  .calendar-day {
    height: 44px;
  }
  .calendar-legend {
    gap: 8px;
    font-size: 11px;
  }
}
</style>
