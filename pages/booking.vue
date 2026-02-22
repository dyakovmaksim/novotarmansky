<template>
  <div class="booking-app-wrapper">
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
                  <span class="trigger-text">{{ guestsText }}</span>
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

                <transition name="dropdown-slide">
                  <div v-if="showGuests" class="guests-dropdown">
                    <div
                      class="guest-row"
                      v-for="item in guestSettings"
                      :key="item.type"
                    >
                      <div class="guest-info">
                        <strong>{{ item.title }}</strong>
                        <span>{{ item.sub }}</span>
                      </div>
                      <div class="counter">
                        <button @click.stop="updateGuestCount(item.type, -1)">
                          -
                        </button>
                        <span>{{ item.ref.value }}</span>
                        <button @click.stop="updateGuestCount(item.type, 1)">
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </transition>
              </div>

              <div class="extra-services">
                <label class="checkbox-container">
                  <input type="checkbox" v-model="hasSauna" />
                  <span class="checkmark"></span>
                  <span class="text"
                    >Русская баня к заезду (+{{
                      saunaPrice.toLocaleString()
                    }}
                    ₽)</span
                  >
                </label>
              </div>

              <div class="price-details-card" v-if="checkin && checkout">
                <div class="price-row">
                  <span
                    >{{ basePrice.toLocaleString() }} ₽ × {{ nightsCount }}
                    {{ getNightsWord(nightsCount) }}</span
                  >
                  <span
                    >{{ (basePrice * nightsCount).toLocaleString() }} ₽</span
                  >
                </div>
                <div class="price-row" v-if="hasSauna">
                  <span>Подготовка бани</span>
                  <span>{{ saunaPrice.toLocaleString() }} ₽</span>
                </div>
                <div class="price-total">
                  <span>Итого к оплате</span>
                  <span class="total-amount"
                    >{{ totalPrice.toLocaleString() }} ₽</span
                  >
                </div>
              </div>

              <div class="booking-footer">
                <button
                  class="btn-primary-booking"
                  :disabled="!checkin || !checkout"
                  @click="isModalOpen = true"
                >
                  Оформить бронирование
                </button>
                <p class="hint">Быстрое подтверждение через Telegram</p>
              </div>
            </div>
          </section>
        </div>
      </div>

      <transition name="modal-zoom">
        <div
          v-if="isModalOpen"
          class="modal-overlay"
          @click.self="isModalOpen = false"
        >
          <div class="modal-container">
            <button class="modal-close" @click="isModalOpen = false">×</button>
            <h3 class="modal-title">Подтверждение</h3>
            <p class="modal-subtitle">
              Оставьте данные, и мы мгновенно свяжемся с вами
            </p>

            <div class="modal-form">
              <input
                v-model="userName"
                type="text"
                placeholder="Ваше имя"
                class="custom-input"
              />
              <input
                :value="userPhone"
                @input="onPhoneInput"
                type="tel"
                placeholder="+7 (___) ___-__-__"
                class="custom-input"
              />
            </div>

            <div class="modal-check-summary">
              <div class="check-item">
                <span>Даты:</span>
                <strong
                  >{{ formatDate(checkin) }} —
                  {{ formatDate(checkout) }}</strong
                >
              </div>
              <div class="check-item">
                <span>Гости:</span>
                <strong>{{ guestsText }}</strong>
              </div>
              <div class="check-item final">
                <span>К оплате:</span>
                <strong class="gold"
                  >{{ totalPrice.toLocaleString() }} ₽</strong
                >
              </div>
            </div>

            <button class="btn-primary-booking" @click="confirmBooking">
              Отправить заявку
            </button>
          </div>
        </div>
      </transition>
    </main>

    <LayoutsFooterSection />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import Calendar from "@/components/Calendar.vue";

// ЦЕНОВАЯ ПОЛИТИКА
const basePrice = 8500; // Цена за ночь
const saunaPrice = 3000; // Разовая услуга

const checkin = ref(null);
const checkout = ref(null);
const selecting = ref("checkin");
const showGuests = ref(false);
const adults = ref(1);
const children = ref(0);
const hasSauna = ref(false);
const guestsRef = ref(null);
const isModalOpen = ref(false);
const userName = ref("");
const userPhone = ref("");

const guestSettings = [
  { type: "adults", title: "Взрослые", sub: "От 12 лет", ref: adults },
  { type: "children", title: "Дети", sub: "До 12 лет", ref: children },
];

const nightsCount = computed(() => {
  if (!checkin.value || !checkout.value) return 0;
  return Math.ceil(
    Math.abs(checkout.value - checkin.value) / (1000 * 60 * 60 * 24),
  );
});

const totalPrice = computed(() => {
  let total = nightsCount.value * basePrice;
  if (hasSauna.value) total += saunaPrice;
  return total;
});

const guestsText = computed(() => {
  let text = `${adults.value} взр.`;
  if (children.value > 0) text += `, ${children.value} дет.`;
  return text;
});

function updateGuestCount(type, val) {
  if (type === "adults") adults.value = Math.max(1, adults.value + val);
  else children.value = Math.max(0, children.value + val);
}

function getNightsWord(n) {
  const pr = new Intl.PluralRules("ru-RU");
  const rule = pr.select(n);
  return rule === "one" ? "ночь" : rule === "few" ? "ночи" : "ночей";
}

function formatDate(date) {
  return date
    ? date.toLocaleDateString("ru-RU", { day: "numeric", month: "short" })
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

function onPhoneInput(e) {
  let v = e.target.value.replace(/\D/g, "").substring(0, 11);
  if (v.startsWith("7") || v.startsWith("8")) v = v.substring(1);
  let res = "+7 ";
  if (v.length > 0) res += "(" + v.substring(0, 3);
  if (v.length > 3) res += ") " + v.substring(3, 6);
  if (v.length > 6) res += "-" + v.substring(6, 8);
  if (v.length > 8) res += "-" + v.substring(8, 10);
  userPhone.value = res;
}

function confirmBooking() {
  if (!userName.value || userPhone.value.length < 18)
    return alert("Заполните данные!");
  alert("Заявка принята! Мы скоро свяжемся с вами.");
  isModalOpen.value = false;
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
  padding: 80px 0 120px;
  background: #fdfbf9;
  min-height: 100vh;
  // ПРИНУДИТЕЛЬНЫЙ ИДЕАЛЬНЫЙ ШРИФТ
  font-family: "Unageo", sans-serif !important;
  -webkit-font-smoothing: antialiased;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.page-header {
  text-align: center;
  margin-bottom: 60px;
  .page-title {
    font-size: clamp(36px, 6vw, 56px);
    color: #2c231a;
    font-weight: 300;
    letter-spacing: -0.02em;
    span {
      color: #d8b48b;
      font-weight: 600;
    }
  }
  .page-subtitle {
    color: #8c7d6d;
    font-size: 18px;
    margin-top: 15px;
  }
}

.booking-grid {
  display: grid;
  grid-template-columns: 1.2fr 420px;
  gap: 50px;
  align-items: start;
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 30px;
  }
}

/* КАРТОЧКИ */
.calendar-wrapper,
.booking-card {
  background: #fff;
  padding: 40px;
  border-radius: 40px;
  box-shadow: 0 20px 60px rgba(61, 44, 23, 0.05);
  border: 1px solid rgba(238, 228, 216, 0.6);
}

.card-label {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: #a68b6a;
  margin-bottom: 25px;
  font-weight: 700;
}

/* ДЕТАЛИ ПРАВОЙ ПАНЕЛИ */
.date-display {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  .date-box {
    flex: 1;
    padding: 16px;
    border: 1px solid #f0ede8;
    border-radius: 20px;
    cursor: pointer;
    transition: 0.3s;
    &.active {
      border-color: #d8b48b;
      background: #fdfaf7;
    }
    .type {
      font-size: 10px;
      text-transform: uppercase;
      color: #a68b6a;
      font-weight: 700;
      display: block;
      margin-bottom: 4px;
    }
    .value {
      font-weight: 600;
      font-size: 16px;
      color: #2c231a;
    }
  }
}

.guests-picker {
  position: relative;
  margin-bottom: 24px;
  label {
    font-size: 13px;
    color: #a68b6a;
    margin-bottom: 8px;
    display: block;
    font-weight: 600;
  }
  .picker-trigger {
    padding: 18px 24px;
    border: 1px solid #f0ede8;
    border-radius: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    font-weight: 600;
    color: #2c231a;
    transition: 0.3s;
    &:hover {
      border-color: #d8b48b;
    }
    svg {
      transition: 0.4s;
      &.rotated {
        transform: rotate(180deg);
      }
    }
  }
}

/* ВЫПАДАШКА */
.guests-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #fff;
  z-index: 100;
  margin-top: 10px;
  border-radius: 24px;
  padding: 20px;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.08);
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
  .guest-info strong {
    font-size: 15px;
    color: #2c231a;
    font-weight: 600;
  }
  .guest-info span {
    font-size: 11px;
    color: #a68b6a;
    display: block;
  }
}
.counter {
  display: flex;
  align-items: center;
  gap: 15px;
  button {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    border: 1px solid #e5e0d8;
    background: #fff;
    cursor: pointer;
    transition: 0.2s;
    font-weight: 600;
    &:hover {
      border-color: #d8b48b;
      color: #d8b48b;
    }
  }
  span {
    font-weight: 700;
    color: #2c231a;
    min-width: 15px;
    text-align: center;
  }
}

/* ЧЕКБОКС */
.extra-services {
  margin-bottom: 30px;
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
      width: 24px;
      height: 24px;
      background: #f0ede8;
      border-radius: 8px;
      margin-right: 14px;
      position: relative;
      transition: 0.3s;
    }
    input:checked ~ .checkmark {
      background: #d8b48b;
    }
    .checkmark:after {
      content: "";
      position: absolute;
      display: none;
      left: 9px;
      top: 5px;
      width: 6px;
      height: 11px;
      border: solid #fff;
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
    }
    input:checked ~ .checkmark:after {
      display: block;
    }
    .text {
      font-weight: 500;
      color: #2c231a;
    }
  }
}

/* КАРТОЧКА ЦЕНЫ  */
.price-details-card {
  background: #fdfaf7;
  border-radius: 24px;
  padding: 25px;
  margin-bottom: 30px;
  .price-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;
    font-size: 15px;
    color: #8c7d6d;
    span:last-child {
      color: #2c231a;
      font-weight: 600;
    }
  }
  .price-total {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 18px;
    padding-top: 18px;
    border-top: 1px dashed #d8c8b4;
    span:first-child {
      font-weight: 700;
      color: #2c231a;
      font-size: 17px;
    }
    .total-amount {
      font-size: 26px;
      font-weight: 700;
      color: #d8b48b;
    }
  }
}

/* КНОПКА */
.btn-primary-booking {
  width: 100%;
  padding: 22px;
  background: #6b5a45;
  color: #fff;
  border: none;
  border-radius: 20px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
  &:disabled {
    background: #e0ddd8;
    cursor: not-allowed;
  }
  &:hover:not(:disabled) {
    background: #4d4031;
    transform: translateY(-3px);
    box-shadow: 0 10px 25px rgba(107, 90, 69, 0.2);
  }
}

.hint {
  font-size: 11px;
  color: #a68b6a;
  text-align: center;
  margin-top: 15px;
  font-weight: 600;
}

/* МОДАЛЬНОЕ ОКНО */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(30, 24, 18, 0.7);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}
.modal-container {
  background: #fff;
  width: 100%;
  max-width: 480px;
  border-radius: 40px;
  padding: 50px;
  position: relative;
  text-align: center;
  .modal-close {
    position: absolute;
    top: 25px;
    right: 25px;
    border: none;
    background: none;
    font-size: 30px;
    color: #a68b6a;
    cursor: pointer;
  }
  .modal-title {
    font-size: 28px;
    font-weight: 700;
    color: #2c231a;
    margin-bottom: 12px;
  }
  .modal-subtitle {
    color: #8c7d6d;
    font-size: 15px;
    margin-bottom: 35px;
  }
}
.modal-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 30px;
  .custom-input {
    width: 100%;
    padding: 20px;
    background: #f8f5f2;
    border: 1px solid #eee4d8;
    border-radius: 18px;
    font-size: 16px;
    outline: none;
    transition: 0.3s;
    &:focus {
      border-color: #d8b48b;
      background: #fff;
    }
  }
}
.modal-check-summary {
  background: #fdfaf7;
  border-radius: 20px;
  padding: 20px;
  margin-bottom: 35px;
  .check-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    font-size: 14px;
    &.final {
      margin-top: 15px;
      padding-top: 15px;
      border-top: 1px solid #eee4d8;
      font-size: 18px;
    }
    .gold {
      color: #d8b48b;
      font-weight: 800;
    }
  }
}

/* АНИМАЦИИ */
.dropdown-slide-enter-active,
.dropdown-slide-leave-active {
  transition: 0.3s ease;
}
.dropdown-slide-enter-from,
.dropdown-slide-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}

.modal-zoom-enter-active,
.modal-zoom-leave-active {
  transition: 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.modal-zoom-enter-from,
.modal-zoom-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.dot.booked {
  background: #e5e0d8;
  text-decoration: line-through;
}
</style>
