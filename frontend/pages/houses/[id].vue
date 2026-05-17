<template>
  <NuxtLayout name="page-layout">
    <div v-if="pending" class="loading-state">
      <p>Загружаем детали пространства...</p>
    </div>

    <div v-else-if="error" class="error-state">
      <h3>Не удалось загрузить информацию о доме</h3>
      <p>{{ error.message }}</p>
    </div>

    <div v-else-if="house" class="house-detail-page">
      <NuxtLink to="/houses" class="back-link">← Вернуться к каталогу</NuxtLink>

      <div class="detail-grid">
        <div class="image-section reveal">
          <img src="/images/interior-wide.png" :alt="house.title" />
        </div>

        <div class="info-section reveal">
          <div class="card-badge dark">Пространство</div>
          <h1 class="house-title">{{ house.title }}</h1>

          <p class="house-description">{{ house.description }}</p>

          <div class="booking-card">
            <h3>Забронировать это пространство</h3>

            <form @submit.prevent="submitBooking" class="booking-form">
              <div class="input-group">
                <label>Ваше имя</label>
                <input
                  v-model="formData.customerName"
                  type="text"
                  placeholder="Иван Иванов"
                  required
                />
              </div>

              <div class="input-group">
                <label>Телефон</label>
                <input
                  v-model="formData.phone"
                  type="tel"
                  placeholder="+7 (999) 000-00-00"
                  required
                />
              </div>

              <div
                class="input-group calendar-dropdown-wrapper"
                ref="calendarRef"
              >
                <label>Даты проживания</label>
                <div
                  class="fake-input"
                  @click="toggleCalendar"
                  :class="{ 'is-active': isCalendarOpen }"
                >
                  <span v-if="formattedDates">{{ formattedDates }}</span>
                  <span v-else class="placeholder"
                    >Выберите даты заезда и выезда</span
                  >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <rect
                      x="3"
                      y="4"
                      width="18"
                      height="18"
                      rx="2"
                      ry="2"
                    ></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                </div>

                <transition name="fade-scale">
                  <div v-if="isCalendarOpen" class="calendar-popover">
                    <Calendar
                      :checkin="formData.startDate"
                      :checkout="formData.endDate"
                      :disabled-dates="disabledDaysList"
                      @select="handleDateSelect"
                    />
                  </div>
                </transition>
              </div>

              <div class="price-summary">
                <span>Итого за сутки:</span>
                <h2>{{ house.pricePerNight }} ₽</h2>
              </div>

              <button
                type="submit"
                class="btn-booking"
                :disabled="
                  isSubmitting || !formData.startDate || !formData.endDate
                "
              >
                {{ isSubmitting ? "Оформляем..." : "Подтвердить бронирование" }}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from "vue";

const route = useRoute();
const isSubmitting = ref(false);
const isCalendarOpen = ref(false);
const calendarRef = ref(null);

// 1. Асинхронно стягиваем данные о доме
const {
  data: house,
  pending,
  error,
} = await useFetch(`http://localhost:3001/houses/${route.params.id}`);

// 2. Стягиваем данные о существующих бронях для этого дома
const { data: bookings } = await useFetch(
  `http://localhost:3001/bookings/house/${route.params.id}`,
);

// 3. Исправленная реактивная генерация заблокированных дат
const disabledDaysList = computed(() => {
  // Явно указываем Vue следить за изменением bookings.value внутри геттера computed
  const currentBookings = bookings.value;
  if (!currentBookings || !Array.isArray(currentBookings)) return [];

  const disabledSet = new Set();

  currentBookings.forEach((booking) => {
    // Используем чистые даты
    const start = new Date(booking.startDate);
    const end = new Date(booking.endDate);

    const current = new Date(start);
    while (current <= end) {
      const year = current.getFullYear();
      // Защита от таймзон: корректно форматируем месяц и день в локальном виде YYYY-MM-DD
      const month = String(current.getMonth() + 1).padStart(2, "0");
      const dayOfMonth = String(current.getDate()).padStart(2, "0");

      disabledSet.add(`${year}-${month}-${dayOfMonth}`);
      current.setDate(current.getDate() + 1);
    }
  });

  return Array.from(disabledSet);
});

const formData = reactive({
  customerName: "",
  phone: "",
  startDate: null,
  endDate: null,
});

// Красивое форматирование дат для инпута (например: "17 Мая — 19 Мая")
const formattedDates = computed(() => {
  if (!formData.startDate) return "";

  const options = { day: "numeric", month: "short" };
  const start = formData.startDate.toLocaleDateString("ru-RU", options);

  if (!formData.endDate) return `${start} — ...`;

  const end = formData.endDate.toLocaleDateString("ru-RU", options);
  return `${start} — ${end}`;
});

const toggleCalendar = () => {
  isCalendarOpen.value = !isCalendarOpen.value;
};

// Логика выбора дат из компонента календаря
const handleDateSelect = (day) => {
  if (!formData.startDate || (formData.startDate && formData.endDate)) {
    formData.startDate = day;
    formData.endDate = null;
  } else if (formData.startDate && !formData.endDate) {
    if (day > formData.startDate) {
      formData.endDate = day;
      isCalendarOpen.value = false; // Автоматически закрываем календарь, когда диапазон выбран
    } else {
      formData.startDate = day;
    }
  }
};

// Клик мимо календаря закрывает его
const handleClickOutside = (event) => {
  if (calendarRef.value && !calendarRef.value.contains(event.target)) {
    isCalendarOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});

const submitBooking = async () => {
  isSubmitting.value = true;
  try {
    const response = await $fetch("http://localhost:3001/bookings", {
      method: "POST",
      body: {
        houseId: route.params.id,
        customerName: formData.customerName,
        phone: formData.phone,
        startDate: formData.startDate.toISOString(),
        endDate: formData.endDate.toISOString(),
      },
    });

    alert(
      `Успех! Дом "${house.value.title}" успешно забронирован. ID брони: ${response.id}`,
    );

    formData.customerName = "";
    formData.phone = "";
    formData.startDate = null;
    formData.endDate = null;

    // Перезапрашиваем бронирования с сервера, чтобы только что забронированные даты мгновенно заблокировались в календаре!
    refreshNuxtData();
  } catch (err) {
    console.error("Полная ошибка:", err);
    const serverMessage =
      err.data?.message || "Произошла ошибка при бронировании.";
    alert(serverMessage);
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style lang="scss" scoped>
.house-detail-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 24px 80px;
}

.back-link {
  display: inline-block;
  color: #666;
  text-decoration: none;
  font-size: 15px;
  margin-bottom: 30px;
  transition: color 0.2s;
  &:hover {
    color: var(--primary);
  }
}

.detail-grid {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 40px;
  @media (max-width: 950px) {
    grid-template-columns: 1fr;
  }
}

.image-section {
  border-radius: 32px;
  overflow: hidden;
  height: 600px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  @media (max-width: 768px) {
    height: 320px;
  }
}

.info-section {
  display: flex;
  flex-direction: column;
  .house-title {
    font-size: clamp(28px, 4vw, 40px);
    color: #333;
    margin: 15px 0 20px;
  }
  .house-description {
    color: #666;
    line-height: 1.7;
    font-size: 16px;
    margin-bottom: 30px;
  }
}

.booking-card {
  background: #f4efe9;
  border-radius: 32px;
  padding: 35px;
  border: 1px solid rgba(0, 0, 0, 0.03);
  h3 {
    color: #333;
    font-size: 22px;
    margin-bottom: 24px;
  }
}

.booking-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;

  label {
    font-size: 13px;
    font-weight: 700;
    color: #555;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  input,
  .fake-input {
    padding: 14px 24px;
    border-radius: 100px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    font-size: 15px;
    background: #fff;
    outline: none;
    box-sizing: border-box;
    transition: all 0.2s ease;
  }

  input:focus,
  .fake-input.is-active {
    border-color: var(--primary, #d8b48b);
    box-shadow: 0 0 0 3px rgba(216, 180, 139, 0.15);
  }
}

.calendar-dropdown-wrapper {
  position: relative;

  .fake-input {
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    color: #333;
    user-select: none;

    .placeholder {
      color: #999;
    }

    svg {
      color: var(--primary, #d8b48b);
      transition: transform 0.2s ease;
    }

    &:hover {
      border-color: var(--primary, #d8b48b);
    }
  }
}

.calendar-popover {
  position: absolute;
  top: 105%;
  left: 0;
  right: 0;
  z-index: 99;
  transform-origin: top center;

  :deep(.calendar) {
    box-shadow: 0 15px 35px rgba(61, 44, 23, 0.12);
    border: 1px solid rgba(216, 180, 139, 0.3);
  }
}

.price-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px 0;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  padding-top: 15px;
  span {
    color: #666;
    font-size: 15px;
  }
  h2 {
    font-size: 28px;
    color: var(--primary, #d8b48b);
  }
}

.btn-booking {
  background: var(--primary, #d8b48b);
  color: white;
  border: none;
  padding: 18px;
  border-radius: 100px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;

  &:hover:not(:disabled) {
    background: #c5a17a;
    transform: translateY(-2px);
  }
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
}

.card-badge {
  background: var(--primary, #d8b48b);
  color: white;
  padding: 6px 16px;
  border-radius: 100px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  width: fit-content;
}

.loading-state,
.error-state {
  text-align: center;
  padding: 100px 24px;
  color: #666;
}

.fade-scale-enter-active,
.fade-scale-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.fade-scale-enter-from {
  opacity: 0;
  transform: translateY(10px) scale(0.98);
}
.fade-scale-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.98);
}
</style>
