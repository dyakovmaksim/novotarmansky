<template>
  <section class="booking-section">
    <div class="booking-section__content">
      <div class="booking-form">
        <h2>Бронирование</h2>
        <div class="booking-form__dates">
          <button
            class="booking-form__input"
            :class="{ active: selecting === 'checkin' }"
            @click="selecting = 'checkin'"
          >
            {{ checkin ? formatDate(checkin) : "Заезд" }}
          </button>
          <button
            class="booking-form__input"
            :class="{ active: selecting === 'checkout' }"
            @click="selecting = 'checkout'"
          >
            {{ checkout ? formatDate(checkout) : "Отъезд" }}
          </button>
        </div>
        <div class="booking-form__guests">
          <input
            class="booking-form__input"
            type="text"
            v-model="guestsText"
            readonly
            @click="showGuests = !showGuests"
          />
          <div v-if="showGuests" class="booking-form__guests-dropdown">
            <div>
              <span>Взрослые:</span>
              <button @click="adults = Math.max(1, adults - 1)">-</button>
              <span>{{ adults }}</span>
              <button @click="adults++">+</button>
            </div>
            <div>
              <span>Дети:</span>
              <button @click="children = Math.max(0, children - 1)">-</button>
              <span>{{ children }}</span>
              <button @click="children++">+</button>
            </div>
          </div>
        </div>
        <button class="booking-form__submit" @click="submit">
          Оставить заявку
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
</template>

<script setup>
import { ref, computed } from "vue";
import Calendar from "../Calendar.vue";

// Состояния формы
const checkin = ref(null);
const checkout = ref(null);
const selecting = ref("checkin");
const showGuests = ref(false);
const adults = ref(1);
const children = ref(0);

const guestsText = computed(
  () =>
    `${adults.value} взрослый${adults.value > 1 ? "х" : ""}` +
    (children.value ? `, ${children.value} детей` : " без детей")
);

function formatDate(date) {
  return date
    ? date.toLocaleDateString("ru-RU", { day: "2-digit", month: "short" })
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
  alert(
    `Заявка отправлена:\nЗаезд: ${formatDate(
      checkin.value
    )}\nОтъезд: ${formatDate(checkout.value)}\nГостей: ${guestsText.value}`
  );
}
</script>

<style lang="scss" scoped>
.booking-section {
  border: 4px solid var(--primary);
  border-radius: 30px;
  padding: 24px;
  display: flex;
  justify-content: center;
  margin-bottom: 40px;

  &__content {
    display: flex;
    gap: 48px;
    justify-content: center;
    align-items: start;
  }
}

.booking-form {
  width: 325px;
  display: flex;
  flex-direction: column;
  gap: 16px;

  h2 {
    font-size: 24px;
    font-weight: 500;
  }

  &__dates {
    display: flex;
    gap: 16px;
    width: 100%;
  }

  &__input {
    background: #fff;
    border: 2px solid var(--primary);
    border-radius: 10px;
    padding: 10px 18px;
    font-size: 20px;
    width: 100%;
    cursor: pointer;
    outline: none;
    transition: 0.3s;

    &.active {
      border-color: var(--primary);
      background: #f7f0e6;
    }
  }

  &__guests {
    position: relative;

    input.booking-form__input {
      cursor: pointer;
      user-select: none;
    }

    &-dropdown {
      position: absolute;
      left: 0;
      top: 55px;
      background: #fff;
      border: 2px solid var(--primary);
      border-radius: 12px;
      padding: 12px 18px;
      z-index: 10;
      width: 325px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);

      div {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        margin-bottom: 6px;

        &:last-child {
          margin-bottom: 0;
        }

        span {
          flex: 1;
          font-weight: 500;
          font-size: 1rem;
        }

        button {
          background: #eee;
          border: none;
          border-radius: 5px;
          width: 26px;
          height: 26px;
          font-size: 1.1rem;
          line-height: 1;
          cursor: pointer;
          user-select: none;
          transition: background-color 0.2s;

          &:hover {
            background: var(--primary);
            color: #fff;
          }
        }
      }
    }
  }

  &__submit {
    background: var(--primary);
    color: #fff;
    border: none;
    border-radius: 10px;
    padding: 12px 0;
    font-size: 20px;
    font-weight: 600;
    cursor: pointer;
    margin-top: 4px;
    transition: 0.3s;

    &:hover {
      background: #a68b6a;
    }
  }
}

.booking-calendar {
  min-width: 320px;
}
</style>
