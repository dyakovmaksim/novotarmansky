<template>
  <section class="booking">
    <div class="booking__container">
      <div class="booking__grid">
        <div class="booking__form">
          <h2 class="booking__title">Бронирование</h2>

          <div class="booking__field-group">
            <label class="booking__label">Даты проживания</label>
            <div class="booking__dates">
              <button
                type="button"
                class="booking__date-btn"
                :class="{ 'is-active': selecting === 'checkin' }"
                @click="selecting = 'checkin'"
              >
                <span class="booking__date-label">Заезд</span>
                <span class="booking__date-value">{{
                  checkin ? formatDate(checkin) : "Выбрать"
                }}</span>
              </button>

              <div class="booking__dates-separator"></div>

              <button
                type="button"
                class="booking__date-btn"
                :class="{ 'is-active': selecting === 'checkout' }"
                @click="selecting = 'checkout'"
              >
                <span class="booking__date-label">Отъезд</span>
                <span class="booking__date-value">{{
                  checkout ? formatDate(checkout) : "Выбрать"
                }}</span>
              </button>
            </div>
          </div>

          <div class="booking__field-group" ref="guestsRef">
            <label class="booking__label">Количество гостей</label>
            <div class="booking__guests">
              <button
                type="button"
                class="booking__guests-trigger"
                @click="showGuests = !showGuests"
              >
                <span class="booking__guests-text">{{ guestsSummary }}</span>
                <svg
                  :class="{ 'is-open': showGuests }"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path
                    d="M5 8L10 13L15 8"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>

              <transition name="fade-slide">
                <div v-if="showGuests" class="booking__guests-dropdown">
                  <div class="guest-control">
                    <div class="guest-control__info">
                      <span class="guest-control__name">Взрослые</span>
                      <span class="guest-control__desc">от 12 лет</span>
                    </div>
                    <div class="guest-control__counter">
                      <button
                        @click="adults = Math.max(1, adults - 1)"
                        :disabled="adults <= 1"
                      >
                        -
                      </button>
                      <span>{{ adults }}</span>
                      <button @click="adults++">+</button>
                    </div>
                  </div>

                  <div class="guest-control">
                    <div class="guest-control__info">
                      <span class="guest-control__name">Дети</span>
                      <span class="guest-control__desc">до 12 лет</span>
                    </div>
                    <div class="guest-control__counter">
                      <button
                        @click="children = Math.max(0, children - 1)"
                        :disabled="children <= 0"
                      >
                        -
                      </button>
                      <span>{{ children }}</span>
                      <button @click="children++">+</button>
                    </div>
                  </div>
                </div>
              </transition>
            </div>
          </div>

          <button
            class="booking__submit"
            :disabled="!checkin || !checkout"
            @click="submit"
          >
            Оставить заявку
          </button>
        </div>

        <div class="booking__calendar-wrapper">
          <Calendar
            :checkin="checkin"
            :checkout="checkout"
            :selecting="selecting"
            @select="onSelectDate"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import Calendar from "../Calendar.vue";

const checkin = ref(null);
const checkout = ref(null);
const selecting = ref("checkin");
const showGuests = ref(false);
const adults = ref(1);
const children = ref(0);
const guestsRef = ref(null);

const guestsSummary = computed(() => {
  const aText = `${adults.value} ${adults.value === 1 ? "взрослый" : "взрослых"}`;
  const cText =
    children.value > 0
      ? `, ${children.value} ${children.value === 1 ? "ребенок" : "детей"}`
      : "";
  return aText + cText;
});

function formatDate(date) {
  return date.toLocaleDateString("ru-RU", { day: "2-digit", month: "short" });
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
  console.log("Submit:", {
    checkin: checkin.value,
    checkout: checkout.value,
    guests: guestsSummary.value,
  });
  alert("Заявка успешно создана!");
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
.booking {
  padding: 40px 0;

  &__container {
    background: #fff;
    border: 1px solid #e8e1d9;
    border-radius: 40px;
    padding: 40px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.03);
  }

  &__grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 60px;
    align-items: start;
  }

  &__title {
    font-size: 32px;
    margin-bottom: 30px;
    color: #3d2c17;
  }

  &__field-group {
    margin-bottom: 24px;
    position: relative;
  }

  &__label {
    display: block;
    font-size: 14px;
    color: #b0a79c;
    margin-bottom: 8px;
    font-weight: 500;
  }

  &__dates {
    display: flex;
    align-items: center;
    border: 2px solid #eee4d8;
    border-radius: 16px;
    overflow: hidden;
    transition: border-color 0.3s;

    &:has(.is-active) {
      border-color: var(--primary);
    }
  }

  &__date-btn {
    flex: 1;
    background: none;
    border: none;
    padding: 12px 20px;
    text-align: left;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    transition: background 0.2s;

    &.is-active {
      background: #fdfaf7;
    }

    .booking__date-label {
      font-size: 12px;
      color: #b0a79c;
    }

    .booking__date-value {
      font-size: 18px;
      font-weight: 600;
      color: #3d2c17;
    }
  }

  &__dates-separator {
    width: 2px;
    height: 30px;
    background: #eee4d8;
  }

  &__guests {
    position: relative;
  }

  &__guests-trigger {
    width: 100%;
    padding: 18px 20px;
    border: 2px solid #eee4d8;
    border-radius: 16px;
    background: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    font-size: 18px;
    font-weight: 600;
    color: #3d2c17;
    transition: 0.3s;

    &:hover {
      border-color: var(--primary);
    }

    svg {
      color: var(--primary);
      transition: transform 0.3s;
      &.is-open {
        transform: rotate(180deg);
      }
    }
  }

  &__guests-dropdown {
    position: absolute;
    top: calc(100% + 10px);
    left: 0;
    right: 0;
    background: #fff;
    border: 1px solid #e8e1d9;
    border-radius: 20px;
    padding: 20px;
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
    z-index: 100;
  }

  &__submit {
    width: 100%;
    padding: 20px;
    background: var(--primary, #bd9e7e);
    color: #fff;
    border: none;
    border-radius: 16px;
    font-size: 18px;
    font-weight: 700;
    cursor: pointer;
    transition:
      transform 0.2s,
      background 0.3s;

    &:hover:not(:disabled) {
      background: #a68b6a;
      transform: translateY(-2px);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
}

.guest-control {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;

  &:not(:last-child) {
    border-bottom: 1px solid #f8f5f2;
  }

  &__name {
    display: block;
    font-weight: 600;
    color: #3d2c17;
  }
  &__desc {
    font-size: 12px;
    color: #b0a79c;
  }

  &__counter {
    display: flex;
    align-items: center;
    gap: 15px;

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
      font-size: 18px;

      &:hover:not(:disabled) {
        background: #fdfaf7;
        border-color: var(--primary);
      }
      &:disabled {
        opacity: 0.3;
      }
    }

    span {
      font-weight: 600;
      min-width: 20px;
      text-align: center;
    }
  }
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@media (max-width: 992px) {
  .booking__grid {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  .booking__container {
    padding: 30px;
  }
}

@media (max-width: 480px) {
  .booking__container {
    border-radius: 0;
    border: none;
    padding: 20px;
  }
  .booking__title {
    font-size: 24px;
  }
  .booking__date-value {
    font-size: 16px;
  }
  .booking__guests-trigger {
    font-size: 16px;
  }
}
</style>
