<template>
  <div>
    <LayoutsNavBar />

    <main class="booking-page">
      <div class="container">
        <header class="page-header reveal">
          <h1 class="page-title">Забронировать <span>отдых</span></h1>
          <p class="page-subtitle">
            Ваш идеальный побег от городской суеты начинается здесь
          </p>
        </header>

        <div class="booking-grid">
          <section class="calendar-wrapper reveal">
            <div class="card-label">1. Выберите даты</div>
            <div class="calendar-container">
              <Calendar
                :checkin="checkin"
                :checkout="checkout"
                :selecting="selecting"
                @select="onSelectDate"
              />
            </div>
            <div class="calendar-legend">
              <span class="legend-item"
                ><i class="dot available"></i> Свободно</span
              >
              <span class="legend-item"
                ><i class="dot selected"></i> Ваш выбор</span
              >
            </div>
          </section>

          <section class="details-wrapper reveal">
            <div class="booking-card">
              <div class="card-label">2. Детали проживания</div>
              <div class="date-display">
                <div
                  class="date-box"
                  :class="{ active: selecting === 'checkin' }"
                  @click="selecting = 'checkin'"
                >
                  <span class="type">Заезд</span>
                  <span class="value">{{
                    checkin ? formatDate(checkin) : "Выберите дату"
                  }}</span>
                </div>
                <div
                  class="date-box"
                  :class="{ active: selecting === 'checkout' }"
                  @click="selecting = 'checkout'"
                >
                  <span class="type">Выезд</span>
                  <span class="value">{{
                    checkout ? formatDate(checkout) : "Выберите дату"
                  }}</span>
                </div>
              </div>

              <div class="guests-picker" ref="guestsRef">
                <label>Количество гостей</label>
                <div class="picker-trigger" @click="showGuests = !showGuests">
                  <span>{{ guestsText }}</span>
                  <svg
                    :class="{ rotated: showGuests }"
                    width="12"
                    height="8"
                    viewBox="0 0 12 8"
                    fill="none"
                  >
                    <path
                      d="M1 1L6 6L11 1"
                      stroke="#a68b6a"
                      stroke-width="2"
                      stroke-linecap="round"
                    />
                  </svg>
                </div>

                <transition name="fade-slide">
                  <div v-if="showGuests" class="guests-dropdown">
                    <div class="guest-row">
                      <div class="guest-info">
                        <strong>Взрослые</strong>
                        <span>от 12 лет</span>
                      </div>
                      <div class="counter">
                        <button @click.stop="adults = Math.max(1, adults - 1)">
                          -
                        </button>
                        <span>{{ adults }}</span>
                        <button @click.stop="adults++">+</button>
                      </div>
                    </div>
                    <div class="guest-row">
                      <div class="guest-info">
                        <strong>Дети</strong>
                        <span>до 12 лет</span>
                      </div>
                      <div class="counter">
                        <button
                          @click.stop="children = Math.max(0, children - 1)"
                        >
                          -
                        </button>
                        <span>{{ children }}</span>
                        <button @click.stop="children++">+</button>
                      </div>
                    </div>
                  </div>
                </transition>
              </div>

              <div class="extra-services">
                <label class="checkbox-container">
                  <input type="checkbox" v-model="hasSauna" />
                  <span class="checkmark"></span>
                  <span class="text">Подготовить русскую баню к заезду</span>
                </label>
              </div>

              <hr class="divider" />

              <div class="booking-summary">
                <div class="summary-line" v-if="checkin && checkout">
                  <span>Длительность:</span>
                  <strong
                    >{{ nightsCount }} {{ getNightsWord(nightsCount) }}</strong
                  >
                </div>
                <button
                  class="btn-primary-booking"
                  :disabled="!checkin || !checkout"
                  @click="submit"
                >
                  Забронировать сейчас
                </button>
                <p class="hint">
                  * Подтверждение бронирования придет в telegram
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>

    <LayoutsFooterSection />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import Calendar from "@/components/Calendar.vue";

const checkin = ref(null);
const checkout = ref(null);
const selecting = ref("checkin");
const showGuests = ref(false);
const adults = ref(1);
const children = ref(2); // Для примера как на скрине
const hasSauna = ref(false);
const guestsRef = ref(null);

const nightsCount = computed(() => {
  if (!checkin.value || !checkout.value) return 0;
  const diffTime = Math.abs(checkout.value - checkin.value);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

const guestsText = computed(() => {
  let text = `${adults.value} взр.`;
  if (children.value > 0) text += `, ${children.value} дет.`;
  return text;
});

function getNightsWord(n) {
  const forms = ["ночь", "ночи", "ночей"];
  const pr = new Intl.PluralRules("ru-RU");
  const rule = pr.select(n);
  if (rule === "one") return forms[0];
  if (rule === "few") return forms[1];
  return forms[2];
}

function formatDate(date) {
  return date
    ? date.toLocaleDateString("ru-RU", { day: "numeric", month: "long" })
    : "";
}

function onSelectDate(date) {
  if (selecting.value === "checkin") {
    checkin.value = date;
    if (checkout.value && checkout.value <= date) checkout.value = null;
    selecting.value = "checkout";
  } else {
    if (checkin.value && date > checkin.value) {
      checkout.value = date;
      selecting.value = "";
    } else {
      checkin.value = date;
      checkout.value = null;
      selecting.value = "checkout";
    }
  }
}

function submit() {
  const message = `Бронирование:\nС ${formatDate(checkin.value)} по ${formatDate(checkout.value)}\nГости: ${guestsText.value}\nБаня: ${hasSauna.value ? "Да" : "Нет"}`;
  alert(message);
}

const handleClickOutside = (e) => {
  if (guestsRef.value && !guestsRef.value.contains(e.target))
    showGuests.value = false;
};

onMounted(() => document.addEventListener("mousedown", handleClickOutside));
onBeforeUnmount(() =>
  document.removeEventListener("mousedown", handleClickOutside),
);
</script>

<style lang="scss" scoped>
.booking-page {
  padding: 60px 0 100px;
  background: #fcfbf9;
  min-height: 100vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.page-header {
  text-align: center;
  margin-bottom: 50px;
  .page-title {
    font-size: clamp(32px, 5vw, 48px);
    color: #2c231a;
    font-weight: 300;
    span {
      color: var(--primary, #d8b48b);
      font-weight: 700;
    }
  }
  .page-subtitle {
    color: #8c7d6d;
    margin-top: 10px;
    font-size: 18px;
  }
}

.booking-grid {
  display: grid;
  // Фиксируем колонки, чтобы не было дыры в центре
  grid-template-columns: minmax(400px, 600px) 420px;
  gap: 40px;
  justify-content: center; // Центрируем всю сетку
  align-items: start;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    max-width: 600px;
    margin: 0 auto;
  }
}

.card-label {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: #a68b6a;
  margin-bottom: 15px;
  font-weight: 700;
}

/* Календарь */
.calendar-wrapper {
  background: white;
  padding: 35px;
  border-radius: 32px;
  box-shadow: 0 15px 45px rgba(94, 78, 59, 0.04);

  .calendar-container {
    width: 100%;
    display: flex;
    justify-content: center;
  }

  .calendar-legend {
    display: flex;
    gap: 20px;
    margin-top: 25px;
    font-size: 13px;
    color: #888;
    .dot {
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      margin-right: 6px;
      &.available {
        background: #f0ede8;
      }
      &.selected {
        background: var(--primary, #d8b48b);
      }
    }
  }
}

/* Карточка деталей */
.booking-card {
  background: white;
  padding: 35px;
  border-radius: 32px;
  box-shadow: 0 15px 45px rgba(94, 78, 59, 0.04);
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.date-display {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  .date-box {
    padding: 14px;
    border: 1px solid #f0ede8;
    border-radius: 16px;
    cursor: pointer;
    transition: all 0.2s ease;
    &.active {
      border-color: var(--primary, #d8b48b);
      background: #fdfaf7;
    }
    .type {
      font-size: 10px;
      text-transform: uppercase;
      color: #a68b6a;
      display: block;
      margin-bottom: 4px;
    }
    .value {
      font-weight: 600;
      font-size: 15px;
      color: #333;
    }
  }
}

.guests-picker {
  position: relative;
  label {
    font-size: 13px;
    color: #a68b6a;
    margin-bottom: 8px;
    display: block;
  }
  .picker-trigger {
    padding: 16px;
    border: 1px solid #f0ede8;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    font-weight: 600;
    svg {
      transition: 0.3s;
      &.rotated {
        transform: rotate(180deg);
      }
    }
  }
}

.guests-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  z-index: 50;
  margin-top: 8px;
  border-radius: 20px;
  padding: 15px 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  border: 1px solid #f0ede8;
}

.guest-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  &:not(:last-child) {
    border-bottom: 1px solid #f8f6f3;
  }
  .guest-info {
    display: flex;
    flex-direction: column;
    strong {
      font-size: 15px;
      color: #333;
    }
    span {
      font-size: 11px;
      color: #999;
    }
  }
}

.counter {
  display: flex;
  align-items: center;
  gap: 12px;
  button {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    border: 1px solid #e5e0d8;
    background: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    &:hover {
      border-color: var(--primary, #d8b48b);
      color: var(--primary, #d8b48b);
    }
  }
  span {
    min-width: 18px;
    text-align: center;
    font-weight: 700;
    color: #333;
  }
}

.checkbox-container {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 14px;
  color: #444;
  input {
    position: absolute;
    opacity: 0;
  }
  .checkmark {
    height: 20px;
    width: 20px;
    background-color: #f0ede8;
    border-radius: 6px;
    margin-right: 12px;
    position: relative;
    transition: 0.2s;
  }
  input:checked ~ .checkmark {
    background-color: var(--primary, #d8b48b);
  }
  .checkmark:after {
    content: "";
    position: absolute;
    display: none;
    left: 7px;
    top: 3px;
    width: 5px;
    height: 10px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
  }
  input:checked ~ .checkmark:after {
    display: block;
  }
}

.btn-primary-booking {
  width: 100%;
  padding: 20px;
  background: var(--primary, #d8b48b);
  color: white;
  border: none;
  border-radius: 18px;
  font-size: 17px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  &:disabled {
    background: #e0ddd8;
    cursor: not-allowed;
  }
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    filter: brightness(1.05);
  }
}

.divider {
  border: 0;
  border-top: 1px solid #f8f6f3;
  margin: 5px 0;
}
.hint {
  font-size: 11px;
  color: #a68b6a;
  text-align: center;
  margin-top: 12px;
}
.summary-line {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  font-size: 15px;
  color: #333;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: 0.2s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
