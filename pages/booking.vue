<template>
  <div>
    <LayoutsNavBar />

    <main class="booking-page">
      <div class="container">
        <div class="page-header">
          <h1 class="page-title">Забронировать отдых</h1>
          <p class="page-subtitle">
            Выберите даты заезда, выезда и количество гостей
          </p>
        </div>

        <section class="booking-section">
          <div class="booking-section__content">
            <div class="booking-form">
              <h2>Параметры бронирования</h2>

              <div class="booking-form__dates">
                <button
                  class="booking-form__input"
                  :class="{ active: selecting === 'checkin' }"
                  @click="selecting = 'checkin'"
                >
                  <span class="label">Заезд</span>
                  {{ checkin ? formatDate(checkin) : "—" }}
                </button>
                <button
                  class="booking-form__input"
                  :class="{ active: selecting === 'checkout' }"
                  @click="selecting = 'checkout'"
                >
                  <span class="label">Отъезд</span>
                  {{ checkout ? formatDate(checkout) : "—" }}
                </button>
              </div>

              <div class="booking-form__guests" ref="guestsRef">
                <div
                  class="booking-form__guests-trigger"
                  @click="showGuests = !showGuests"
                >
                  <input
                    class="booking-form__input"
                    type="text"
                    :value="guestsText"
                    readonly
                  />
                  <svg
                    class="arrow-icon"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <path
                      d="M5 8L10 13L15 8"
                      stroke="#a68b6a"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>

                <div v-if="showGuests" class="booking-form__guests-dropdown">
                  <div class="guest-row">
                    <span>Взрослые</span>
                    <div class="counter">
                      <button @click="adults = Math.max(1, adults - 1)">
                        -
                      </button>
                      <span class="count">{{ adults }}</span>
                      <button @click="adults++">+</button>
                    </div>
                  </div>
                  <div class="guest-row">
                    <span>Дети</span>
                    <div class="counter">
                      <button @click="children = Math.max(0, children - 1)">
                        -
                      </button>
                      <span class="count">{{ children }}</span>
                      <button @click="children++">+</button>
                    </div>
                  </div>
                </div>
              </div>

              <button
                class="booking-form__submit"
                @click="submit"
                :disabled="!checkin || !checkout"
              >
                Проверить свободные даты
              </button>
            </div>

            <div class="booking-calendar">
              <Calendar
                :checkin="checkin"
                :checkout="checkout"
                :selecting="selecting"
                @select="onSelectDate"
              />
            </div>
          </div>
        </section>
      </div>
    </main>

    <LayoutsFooterSection />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
// Убедитесь, что файл Calendar.vue лежит в папке components
import Calendar from "@/components/Calendar.vue";

const checkin = ref(null);
const checkout = ref(null);
const selecting = ref("checkin");
const showGuests = ref(false);
const adults = ref(1);
const children = ref(0);
const guestsRef = ref(null);

const guestsText = computed(() => {
  let text = `${adults.value} взросл${adults.value === 1 ? "ый" : "ых"}`;
  if (children.value > 0) {
    text += `, ${children.value} дет${children.value === 1 ? "я" : "ей"}`;
  }
  return text;
});

function formatDate(date) {
  return date
    ? date.toLocaleDateString("ru-RU", { day: "2-digit", month: "short" })
    : "";
}

function onSelectDate(date) {
  if (selecting.value === "checkin") {
    checkin.value = date;
    if (checkout.value && checkout.value < date) checkout.value = null;
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
  if (!checkin.value || !checkout.value) return;
  alert(
    `Бронирование:\n${formatDate(checkin.value)} - ${formatDate(
      checkout.value
    )}\nГости: ${guestsText.value}`
  );
}

const handleClickOutside = (event) => {
  if (guestsRef.value && !guestsRef.value.contains(event.target)) {
    showGuests.value = false;
  }
};

onMounted(() => document.addEventListener("mousedown", handleClickOutside));
onBeforeUnmount(() =>
  document.removeEventListener("mousedown", handleClickOutside)
);
</script>

<style lang="scss" scoped>
// Используем ваши переменные из проекта
:root {
  --primary: #d8b48b;
  --dark: #5e4e3b;
}

.booking-page {
  padding: 60px 0;
  background-color: #fdfaf7;
  min-height: 90vh;
}

.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 20px;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
  h1 {
    color: #5e4e3b;
    font-size: 32px;
    margin-bottom: 10px;
  }
  p {
    color: #a68b6a;
  }
}

.booking-section {
  background: white;
  border: 2px solid #d8b48b;
  border-radius: 30px;
  padding: 40px;
  box-shadow: 0 10px 40px rgba(94, 78, 59, 0.05);

  &__content {
    display: flex;
    gap: 50px;
    justify-content: center;
    align-items: flex-start;
    flex-wrap: wrap;
  }
}

.booking-form {
  flex: 1;
  min-width: 300px;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 20px;

  h2 {
    font-size: 22px;
    color: #5e4e3b;
    margin-bottom: 5px;
  }

  &__dates {
    display: flex;
    gap: 10px;
  }

  &__input {
    background: #fff;
    border: 1px solid #d8b48b;
    border-radius: 12px;
    padding: 12px 15px;
    font-size: 16px;
    width: 100%;
    cursor: pointer;
    text-align: left;
    display: flex;
    flex-direction: column;
    transition: 0.3s;

    .label {
      font-size: 11px;
      text-transform: uppercase;
      color: #a68b6a;
      margin-bottom: 4px;
    }

    &.active {
      background: #fdf5eb;
      border-color: #5e4e3b;
    }
  }

  &__guests {
    position: relative;

    &-trigger {
      position: relative;
      input {
        cursor: pointer;
        border: 1px solid #d8b48b;
        border-radius: 12px;
        padding: 15px;
        width: 100%;
        outline: none;
      }
      .arrow-icon {
        position: absolute;
        right: 15px;
        top: 50%;
        transform: translateY(-50%);
        pointer-events: none;
      }
    }

    &-dropdown {
      position: absolute;
      top: calc(100% + 5px);
      left: 0;
      right: 0;
      background: white;
      border: 1px solid #d8b48b;
      border-radius: 12px;
      padding: 15px;
      z-index: 100;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);

      .guest-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 0;
        &:not(:last-child) {
          border-bottom: 1px solid #f5f5f5;
        }

        .counter {
          display: flex;
          align-items: center;
          gap: 15px;
          button {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            border: 1px solid #d8b48b;
            background: none;
            cursor: pointer;
          }
          .count {
            font-weight: 600;
            min-width: 15px;
            text-align: center;
          }
        }
      }
    }
  }

  &__submit {
    background: #5e4e3b;
    color: white;
    border: none;
    border-radius: 12px;
    padding: 18px;
    font-size: 18px;
    font-weight: 600;
    cursor: pointer;
    transition: 0.3s;
    &:disabled {
      background: #ccc;
      cursor: not-allowed;
    }
    &:hover:not(:disabled) {
      background: #d8b48b;
    }
  }
}

@media (max-width: 800px) {
  .booking-section {
    padding: 20px;
  }
  .booking-section__content {
    gap: 30px;
  }
}
</style>
