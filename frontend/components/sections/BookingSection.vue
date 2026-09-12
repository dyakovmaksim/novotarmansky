<template>
  <section class="booking-section">
    <div class="booking-section__container">
      <div class="booking-section__grid">
        <div class="booking-section__form">
          <h2 class="booking-section__title">Бронирование</h2>

          <div class="booking-section__field">
            <label class="field-label">Даты проживания</label>
            <div class="date-picker-group">
              <div
                class="date-picker-item"
                :class="{ 'is-active': selecting === 'checkin' }"
                @click="selecting = 'checkin'"
              >
                <span class="date-picker-item__label">Заезд</span>
                <span class="date-picker-item__value">{{
                  checkin ? formatDate(checkin) : "Выбрать"
                }}</span>
              </div>
              <div class="date-picker-divider"></div>
              <div
                class="date-picker-item"
                :class="{ 'is-active': selecting === 'checkout' }"
                @click="selecting = 'checkout'"
              >
                <span class="date-picker-item__label">Отъезд</span>
                <span class="date-picker-item__value">{{
                  checkout ? formatDate(checkout) : "Выбрать"
                }}</span>
              </div>
            </div>
          </div>

          <div class="booking-section__field" ref="guestsRef">
            <label class="field-label">Количество гостей</label>
            <div
              class="guests-dropdown-trigger"
              @click="showGuests = !showGuests"
            >
              <span class="guests-dropdown-trigger__text">{{
                guestsSummary
              }}</span>
              <svg
                :class="{ 'is-open': showGuests }"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M5 8L10 13L15 8"
                  stroke="#3D2C17"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>

              <transition name="dropdown-fade">
                <div
                  v-if="showGuests"
                  class="guests-dropdown-content"
                  @click.stop
                >
                  <div
                    class="guest-control-row"
                    v-for="type in guestConfigs"
                    :key="type.id"
                  >
                    <div class="guest-control-row__info">
                      <span class="guest-name">{{ type.name }}</span>
                      <span class="guest-desc">{{ type.desc }}</span>
                    </div>
                    <div class="guest-control-row__actions">
                      <button
                        type="button"
                        @click="changeGuestCount(type.id, -1)"
                        :disabled="isLimit(type.id, -1)"
                      >
                        -
                      </button>
                      <span class="guest-count">{{ type.ref.value }}</span>
                      <button
                        type="button"
                        @click="changeGuestCount(type.id, 1)"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </transition>
            </div>
          </div>

          <div class="booking-section__field">
            <label class="field-label">Дополнительно</label>
            <label class="sauna-toggle">
              <input v-model="hasSauna" type="checkbox" />
              <span class="sauna-toggle__text">
                Русская баня к заезду
                <span class="sauna-toggle__price"
                  >+{{ saunaPrice.toLocaleString() }} ₽</span
                >
              </span>
            </label>
          </div>

          <transition name="simple-fade">
            <div v-if="checkin && checkout" class="booking-summary-card">
              <div class="summary-row">
                <span class="summary-row__label"
                  >{{ pricePerNight.toLocaleString() }} ₽ × {{ totalNights }}
                  {{ getNightsWord(totalNights) }}</span
                >
                <span class="summary-row__value"
                  >{{ basePrice.toLocaleString() }} ₽</span
                >
              </div>
              <div v-if="hasSauna" class="summary-row">
                <span class="summary-row__label">Русская баня</span>
                <span class="summary-row__value"
                  >+{{ saunaPrice.toLocaleString() }} ₽</span
                >
              </div>
              <div class="summary-row summary-row--total">
                <span class="summary-row__label">Итого к оплате</span>
                <span class="summary-row__value"
                  >{{ totalPrice.toLocaleString() }} ₽</span
                >
              </div>
            </div>
          </transition>

          <button
            class="booking-submit-btn"
            :disabled="!checkin || !checkout"
            @click="isModalOpen = true"
          >
            Оставить заявку
          </button>
        </div>

        <div class="booking-section__calendar-col">
          <Calendar
            :checkin="checkin"
            :checkout="checkout"
            :selecting="selecting"
            :disabled-dates="occupiedDates"
            @select="onSelectDate"
          />
        </div>
      </div>
    </div>

    <transition name="modal-fade">
      <div
        v-if="isModalOpen"
        class="booking-modal-overlay"
        @click.self="isModalOpen = false"
      >
        <div class="booking-modal-container">
          <button class="booking-modal-close" @click="isModalOpen = false">
            ×
          </button>
          <h3 class="booking-modal-title">Почти готово</h3>
          <p class="booking-modal-subtitle">
            Оставьте контакты для подтверждения брони на
            {{ formatDate(checkin) }}
          </p>

          <div class="booking-modal-inputs">
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

          <div class="booking-modal-price">
            <span>Сумма к оплате:</span>
            <strong>{{ totalPrice.toLocaleString() }} ₽</strong>
          </div>

          <label class="consent">
            <input v-model="consent" type="checkbox" />
            <span>
              Согласен на
              <NuxtLink to="/personal-data" target="_blank"
                >обработку персональных данных</NuxtLink
              >
            </span>
          </label>

          <button
            class="booking-submit-btn"
            :disabled="isSubmitting || !consent"
            @click="handleFinalSubmit"
          >
            {{ isSubmitting ? "Отправляем..." : "Подтвердить бронь" }}
          </button>
        </div>
      </div>
    </transition>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { toast } from "vue-sonner";
import Calendar from "../Calendar.vue";

const config = useRuntimeConfig();
const pricePerNight = config.public.house.pricePerNight;
const saunaPrice = config.public.saunaPrice;
const apiBase = config.public.apiBase;

// Без SSR — в Docker hairpin NAT обычно не делается, и обращение из
// контейнера фронта к публичному apiBase зависает до таймаута.
// occupied-dates нужны только для UI календаря, поисковикам они не нужны.
const { data: occupiedDates, refresh: refreshOccupied } = await useFetch(
  `${apiBase}/bookings/occupied-dates`,
  { default: () => [], server: false, lazy: true },
);

const checkin = ref(null);
const checkout = ref(null);
const selecting = ref("checkin");
const showGuests = ref(false);
const adults = ref(1);
const children = ref(0);
const hasSauna = ref(false);
const isModalOpen = ref(false);
const isSubmitting = ref(false);
const userName = ref("");
const userPhone = ref("");
const consent = ref(false);
const guestsRef = ref(null);

const guestConfigs = [
  { id: "adults", name: "Взрослые", desc: "от 12 лет", ref: adults },
  { id: "children", name: "Дети", desc: "до 12 лет", ref: children },
];

const totalNights = computed(() => {
  if (!checkin.value || !checkout.value) return 0;
  return Math.max(
    1,
    Math.ceil((checkout.value - checkin.value) / (1000 * 60 * 60 * 24)),
  );
});

const basePrice = computed(() => totalNights.value * pricePerNight);
const totalPrice = computed(
  () => basePrice.value + (hasSauna.value ? saunaPrice : 0),
);

const guestsSummary = computed(() => {
  let res = `${adults.value} ${adults.value === 1 ? "взрослый" : "взрослых"}`;
  if (children.value > 0)
    res += `, ${children.value} ${children.value === 1 ? "ребенок" : "детей"}`;
  return res;
});

const formatDate = (d) =>
  d.toLocaleDateString("ru-RU", { day: "2-digit", month: "short" });
const getNightsWord = (n) => {
  const r = new Intl.PluralRules("ru-RU").select(n);
  return r === "one" ? "ночь" : r === "few" ? "ночи" : "ночей";
};

const onSelectDate = (date) => {
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
};

const changeGuestCount = (id, val) => {
  if (id === "adults") adults.value = Math.max(1, adults.value + val);
  else children.value = Math.max(0, children.value + val);
};

const isLimit = (id, val) =>
  id === "adults"
    ? adults.value <= 1 && val < 0
    : children.value <= 0 && val < 0;

const onPhoneInput = (e) => {
  let v = e.target.value.replace(/\D/g, "").substring(0, 11);
  if (v.startsWith("7") || v.startsWith("8")) v = v.substring(1);
  let r = "+7 ";
  if (v.length > 0) r += "(" + v.substring(0, 3);
  if (v.length > 3) r += ") " + v.substring(3, 6);
  if (v.length > 6) r += "-" + v.substring(6, 8);
  if (v.length > 8) r += "-" + v.substring(8, 10);
  userPhone.value = r;
};

const handleFinalSubmit = async () => {
  if (!userName.value || userPhone.value.length < 18) {
    toast.error("Заполните имя и телефон полностью.");
    return;
  }
  if (!checkin.value || !checkout.value) return;
  if (!consent.value) {
    toast.error("Необходимо согласие на обработку персональных данных.");
    return;
  }
  if (isSubmitting.value) return;

  isSubmitting.value = true;
  try {
    await $fetch(`${apiBase}/bookings`, {
      method: "POST",
      body: {
        customerName: userName.value,
        phone: userPhone.value,
        startDate: checkin.value.toISOString(),
        endDate: checkout.value.toISOString(),
        adults: adults.value,
        children: children.value,
        hasSauna: hasSauna.value,
      },
    });
    toast.success("Заявка отправлена! Мы свяжемся с вами для подтверждения.");
    isModalOpen.value = false;
    userName.value = "";
    userPhone.value = "";
    consent.value = false;
    hasSauna.value = false;
    checkin.value = null;
    checkout.value = null;
    await refreshOccupied();
  } catch (err) {
    const apiMessage = Array.isArray(err?.data?.message)
      ? err.data.message[0]
      : err?.data?.message;
    toast.error(apiMessage || "Не удалось отправить заявку. Попробуйте ещё раз.");
  } finally {
    isSubmitting.value = false;
  }
};

const handleClickOutside = (e) => {
  if (guestsRef.value && !guestsRef.value.contains(e.target))
    showGuests.value = false;
};
onMounted(() => document.addEventListener("click", handleClickOutside));
onBeforeUnmount(() =>
  document.removeEventListener("click", handleClickOutside),
);
</script>

<style lang="scss" scoped>
.booking-section {
  padding: 60px 0;
  background: #fff;
  font-family: "Unageo", sans-serif !important;
  -webkit-font-smoothing: antialiased;

  :deep(*) {
    font-family: "Unageo", sans-serif !important;
    box-sizing: border-box;
  }

  &__container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
  }

  &__grid {
    display: grid;
    grid-template-columns: 1.1fr 0.9fr;
    gap: 60px;
    align-items: start;

    @media (max-width: 992px) {
      grid-template-columns: 1fr;
      gap: 40px;
    }
  }

  &__title {
    font-size: 32px;
    font-weight: 600;
    color: #3d2c17;
    margin-bottom: 32px;
    letter-spacing: -0.01em;
  }

  &__field {
    margin-bottom: 24px;
    position: relative;
    .field-label {
      display: block;
      font-size: 12px;
      font-weight: 600;
      color: #b0a79c;
      text-transform: uppercase;
      margin-bottom: 8px;
      letter-spacing: 0.04em;
    }
  }

  .date-picker-group {
    display: flex;
    background: #f8f5f2;
    border: 1px solid #eee4d8;
    border-radius: 16px;
    padding: 6px;
  }

  .date-picker-item {
    flex: 1;
    padding: 10px 16px;
    cursor: pointer;
    border-radius: 12px;
    transition: 0.3s ease;
    &.is-active {
      background: #fff;
      box-shadow: 0 4px 12px rgba(61, 44, 23, 0.06);
    }
    &__label {
      display: block;
      font-size: 11px;
      color: #a68b6a;
      margin-bottom: 2px;
    }
    &__value {
      font-size: 16px;
      font-weight: 600;
      color: #3d2c17;
    }
  }

  .date-picker-divider {
    width: 1px;
    background: #eee4d8;
    margin: 8px 0;
  }

  .guests-dropdown-trigger {
    background: #f8f5f2;
    border: 1px solid #eee4d8;
    border-radius: 16px;
    padding: 18px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    position: relative;
    &__text {
      font-size: 16px;
      font-weight: 500;
      color: #3d2c17;
    }
    svg {
      transition: 0.3s;
      &.is-open {
        transform: rotate(180deg);
      }
    }
  }

  .guests-dropdown-content {
    position: absolute;
    top: calc(100% + 8px);
    left: 0;
    right: 0;
    background: #fff;
    border: 1px solid #eee4d8;
    border-radius: 18px;
    padding: 16px;
    z-index: 50;
    box-shadow: 0 10px 30px rgba(61, 44, 23, 0.1);
  }

  .guest-control-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
    &:not(:last-child) {
      border-bottom: 1px solid #f8f5f2;
    }
    .guest-name {
      font-weight: 600;
      color: #3d2c17;
      display: block;
    }
    .guest-desc {
      font-size: 12px;
      color: #a68b6a;
    }
    &__actions {
      display: flex;
      align-items: center;
      gap: 12px;
      button {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: 1px solid #eee4d8;
        background: #fff;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        &:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      }
      .guest-count {
        font-weight: 600;
        min-width: 15px;
        text-align: center;
      }
    }
  }

  .booking-summary-card {
    background: #fdfbfa;
    border: 1px solid #eee4d8;
    border-radius: 20px;
    padding: 24px;
    margin: 32px 0;
  }

  .summary-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;
    &__label {
      color: #8c7d6d;
      font-size: 15px;
    }
    &__value {
      font-weight: 600;
      color: #3d2c17;
    }
    &--total {
      margin-top: 16px;
      padding-top: 16px;
      border-top: 1px dashed #d9d0c7;
      .summary-row__label {
        font-size: 17px;
        font-weight: 600;
        color: #3d2c17;
      }
      .summary-row__value {
        font-size: 24px;
        font-weight: 600;
        color: #bd9e7e;
      }
    }
  }

  .consent {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 16px 0 18px;
    font-size: 13px;
    color: #6b5a45;
    cursor: pointer;
    input[type="checkbox"] {
      width: 18px;
      height: 18px;
      accent-color: #6b5a45;
      cursor: pointer;
      flex-shrink: 0;
    }
    a {
      color: #6b5a45;
      text-decoration: underline;
    }
  }

  .sauna-toggle {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 20px;
    background: #f8f5f2;
    border: 1px solid #eee4d8;
    border-radius: 16px;
    cursor: pointer;
    transition: 0.3s;
    &:hover {
      border-color: #d9c9b5;
    }
    input[type="checkbox"] {
      width: 20px;
      height: 20px;
      accent-color: #6b5a45;
      cursor: pointer;
      flex-shrink: 0;
    }
    &__text {
      font-size: 15px;
      font-weight: 500;
      color: #3d2c17;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    &__price {
      color: #bd9e7e;
      font-weight: 600;
    }
  }

  .booking-submit-btn {
    width: 100%;
    padding: 20px;
    background: #6b5a45;
    color: #fff;
    border: none;
    border-radius: 16px;
    font-size: 17px;
    font-weight: 600;
    cursor: pointer;
    transition: 0.3s;
    &:hover:not(:disabled) {
      background: #5a4b39;
      transform: translateY(-1px);
    }
    &:disabled {
      background: #d9d0c7;
      cursor: not-allowed;
    }
  }

  .booking-modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(30, 20, 10, 0.5);
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 20px;
  }

  .booking-modal-container {
    background: #fff;
    width: 100%;
    max-width: 420px;
    border-radius: 24px;
    padding: 40px;
    position: relative;
    .booking-modal-close {
      position: absolute;
      top: 16px;
      right: 16px;
      border: none;
      background: none;
      font-size: 24px;
      color: #b0a79c;
      cursor: pointer;
    }
    .booking-modal-title {
      font-size: 22px;
      font-weight: 600;
      text-align: center;
      margin-bottom: 8px;
      color: #3d2c17;
    }
    .booking-modal-subtitle {
      font-size: 14px;
      text-align: center;
      color: #8c7d6d;
      margin-bottom: 24px;
    }
    .booking-modal-inputs {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-bottom: 24px;
    }
    .custom-input {
      width: 100%;
      padding: 16px;
      background: #f8f5f2;
      border: 1px solid #eee4d8;
      border-radius: 12px;
      font-size: 15px;
      outline: none;
      transition: 0.3s;
      &:focus {
        border-color: #bd9e7e;
        background: #fff;
      }
    }
    .booking-modal-price {
      display: flex;
      justify-content: space-between;
      margin-bottom: 24px;
      font-size: 15px;
      strong {
        color: #bd9e7e;
        font-size: 20px;
      }
    }
  }
}

.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
  transition: 0.2s ease;
}
.dropdown-fade-enter-from,
.dropdown-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: 0.3s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
