<template>
  <section :id="id" class="booking-experience" aria-label="Бронирование дома">
    <header class="booking-intro">
      <div v-if="!standalone">
        <h2>Спланируйте свой отдых</h2>
        <p>Выберите даты — стоимость рассчитается сразу.</p>
      </div>
      <p class="nightly">
        <strong>{{ money(basePrice) }}</strong> / ночь за дом
      </p>
    </header>
    <div v-if="sent" class="booking-success" role="status">
      <h3>Заявка отправлена</h3>
      <p>
        Хозяин свяжется с вами по указанному телефону, чтобы подтвердить даты и
        условия. Бронь считается подтверждённой после согласования.
      </p>
      <button
        type="button"
        class="button button--secondary"
        @click="sent = false"
      >
        Спланировать ещё одну поездку
      </button>
    </div>
    <div v-else class="stay-grid">
      <div class="stay-dates panel">
        <h3>Даты поездки</h3>
        <div class="stay-date-fields">
          <button
            type="button"
            :disabled="submitting"
            :class="{ active: selecting === 'checkin' }"
            @click="selecting = 'checkin'"
          >
            <span>Заезд · после 15:00</span
            ><strong>{{ format(checkin) || "Выберите дату" }}</strong>
          </button>
          <button
            type="button"
            :disabled="submitting"
            :class="{ active: selecting === 'checkout' }"
            @click="selecting = checkin ? 'checkout' : 'checkin'"
          >
            <span>Выезд · до 12:00</span
            ><strong>{{ format(checkout) || "Выберите дату" }}</strong>
          </button>
        </div>
        <div v-if="availabilityError" class="form-error" role="alert">
          Не удалось проверить свободные даты.
          <button type="button" class="text-button" @click="refresh()">
            Повторить проверку
          </button>
          или <a :href="CONTACT.phone.href">позвонить хозяину</a>.
        </div>
        <StayCalendar
          :checkin="checkin"
          :checkout="checkout"
          :selecting="selecting"
          :disabled-dates="occupied"
          :loading="status === 'pending' || status === 'idle'"
          :blocked="!!availabilityError || submitting"
          @select="selectDate"
        />
        <div class="date-summary">
          <span aria-live="polite">{{
            nights
              ? nights + " " + nightWord(nights)
              : "Сначала заезд, затем выезд"
          }}</span
          ><button
            type="button"
            class="text-button"
            :disabled="submitting || !checkin"
            @click="clearDates"
          >
            Сбросить даты
          </button>
        </div>
        <p v-if="dateError" role="alert" class="form-error">{{ dateError }}</p>
      </div>
      <div class="stay-settings panel">
        <h3>Гости и услуги</h3>
        <div v-for="kind in guestKinds" :key="kind.key" class="guest-setting">
          <div>
            <strong>{{ kind.label }}</strong
            ><small>{{ kind.detail }}</small>
          </div>
          <div class="guest-counter">
            <button
              type="button"
              :aria-label="'Уменьшить: ' + kind.label"
              :disabled="submitting || stay[kind.key] <= kind.min"
              @click="stay[kind.key]--"
            >
              −
            </button>
            <output :aria-label="kind.label">{{ stay[kind.key] }}</output>
            <button
              type="button"
              :aria-label="'Увеличить: ' + kind.label"
              :disabled="submitting || stay.adults + stay.children >= 8"
              @click="stay[kind.key]++"
            >
              +
            </button>
          </div>
        </div>
        <p class="small-note">
          Не больше 8 гостей, включая детей. Дом целиком для вашей компании.
        </p>
        <label class="sauna-option"
          ><input
            v-model="stay.hasSauna"
            type="checkbox"
            :disabled="submitting"
          ><span
            ><strong>Добавить русскую баню</strong
            ><small>Подготовим к вашему заезду</small></span
          ><strong>+{{ money(saunaPrice) }}</strong></label
        >
        <div class="stay-total" aria-live="polite">
          <template v-if="nights">
            <div>
              <span
                >{{ money(basePrice) }} × {{ nights }}
                {{ nightWord(nights) }}</span
              ><span>{{ money(nights * basePrice) }}</span>
            </div>
            <div v-if="stay.hasSauna">
              <span>Баня к заезду</span><span>{{ money(saunaPrice) }}</span>
            </div>
            <div class="total-line">
              <strong>Стоимость поездки</strong
              ><strong>{{ money(total) }}</strong>
            </div>
          </template>
          <p v-else>Выберите даты, чтобы увидеть стоимость всей поездки.</p>
        </div>
        <p class="small-note">
          Расчёт по базовому тарифу. Акции и окончательные условия хозяин
          подтвердит при согласовании. Оплата на сайте не требуется.
        </p>
        <button
          type="button"
          class="button"
          :disabled="submitting || !validDates"
          @click="openContact"
        >
          Продолжить с этими датами
        </button>
        <p class="booking-hint">
          {{
            validDates
              ? "Следующий шаг — имя и телефон"
              : "Для продолжения выберите свободные даты заезда и выезда"
          }}
        </p>
      </div>
      <form
        v-if="showContact"
        ref="contactForm"
        class="contact-step panel"
        @submit.prevent="submit"
      >
        <div>
          <h3>Как с вами связаться?</h3>
          <p>
            Заявка на {{ format(checkin) }} — {{ format(checkout) }} ·
            {{ money(total) }}. Позвоним для подтверждения.
          </p>
        </div>
        <div class="contact-fields">
          <label
            >Ваше имя<input
              v-model="name"
              name="name"
              autocomplete="given-name"
              required
              minlength="2"
              maxlength="100"
              placeholder="Как к вам обращаться"
              :disabled="submitting"
          ></label>
          <label
            >Телефон<input
              v-model="phone"
              name="tel"
              type="tel"
              inputmode="tel"
              autocomplete="tel"
              required
              maxlength="24"
              placeholder="+7 999 123-45-67"
              :disabled="submitting"
          ></label>
        </div>
        <label class="booking-consent"
          ><input
            v-model="consent"
            type="checkbox"
            required
            :disabled="submitting"
          ><span
            >Согласен на
            <NuxtLink to="/personal-data" target="_blank"
              >обработку персональных данных</NuxtLink
            >
            и ознакомлен с
            <NuxtLink to="/privacy" target="_blank"
              >политикой конфиденциальности</NuxtLink
            >.</span
          ></label
        >
        <p v-if="submitError" role="alert" class="form-error">
          {{ submitError }}
        </p>
        <button
          type="submit"
          class="button"
          :disabled="submitting || !validDates"
        >
          {{
            submitting
              ? "Отправляем заявку…"
              : "Отправить заявку · " + money(total)
          }}
        </button>
        <p class="small-note">
          Это заявка, а не автоматическое подтверждение брони.
        </p>
      </form>
    </div>
  </section>
</template>
<script setup>
import { computed, ref, nextTick } from "vue";
import {
  dateKey,
  dateFromKey,
  stayNights,
  rangeUnavailable,
  houseToday,
} from "~/utils/bookingDates";
defineProps({ id: { type: String, default: undefined }, standalone: Boolean });
const config = useRuntimeConfig();
const basePrice = Number(config.public.house.pricePerNight);
const saunaPrice = Number(config.public.saunaPrice);
const stay = useState("house-stay", () => ({
  start: "",
  end: "",
  adults: 2,
  children: 0,
  hasSauna: false,
}));
const checkin = computed(() => dateFromKey(stay.value.start));
const checkout = computed(() => dateFromKey(stay.value.end));
const selecting = ref("checkin");
const {
  data: occupied,
  status,
  error: availabilityError,
  refresh,
} = useFetch(config.public.apiBase + "/bookings/occupied-dates", {
  server: false,
  lazy: true,
  timeout: 10000,
  default: () => [],
  transform: (value) => {
    if (
      !Array.isArray(value) ||
      !value.every(
        (d) => typeof d === "string" && /^\d{4}-\d{2}-\d{2}$/.test(d),
      )
    )
      throw new Error("Invalid availability");
    return value;
  },
});
const nights = computed(() =>
  checkin.value && checkout.value
    ? stayNights(checkin.value, checkout.value)
    : 0,
);
const total = computed(
  () => nights.value * basePrice + (stay.value.hasSauna ? saunaPrice : 0),
);
const validDates = computed(
  () =>
    status.value === "success" &&
    !availabilityError.value &&
    nights.value > 0 &&
    checkin.value >= houseToday() &&
    !rangeUnavailable(checkin.value, checkout.value, occupied.value),
);
const dateError = ref(""),
  showContact = ref(false),
  contactForm = ref(null),
  name = ref(""),
  phone = ref(""),
  consent = ref(false),
  submitting = ref(false),
  submitError = ref(""),
  sent = ref(false);
const guestKinds = [
  { key: "adults", label: "Взрослые", detail: "От 12 лет", min: 1 },
  { key: "children", label: "Дети", detail: "До 12 лет", min: 0 },
];
const money = (n) => Number(n).toLocaleString("ru-RU") + " ₽";
const format = (d) =>
  d?.toLocaleDateString("ru-RU", { day: "numeric", month: "short" }) || "";
function nightWord(n) {
  return { one: "ночь", few: "ночи", many: "ночей", other: "ночей" }[
    new Intl.PluralRules("ru").select(n)
  ];
}
function clearDates() {
  stay.value.start = "";
  stay.value.end = "";
  selecting.value = "checkin";
  dateError.value = "";
  showContact.value = false;
}
function selectDate(day) {
  if (status.value !== "success" || availabilityError.value) return;
  dateError.value = "";
  showContact.value = false;
  if (
    selecting.value !== "checkout" ||
    !checkin.value ||
    day <= checkin.value
  ) {
    stay.value.start = dateKey(day);
    stay.value.end = "";
    selecting.value = "checkout";
    return;
  }
  if (rangeUnavailable(checkin.value, day, occupied.value)) {
    dateError.value =
      "В этом промежутке есть занятые даты. Выберите другой выезд.";
    return;
  }
  stay.value.end = dateKey(day);
  selecting.value = "";
}

async function openContact() {
  showContact.value = true;
  await nextTick();
  contactForm.value?.scrollIntoView({
    behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "auto"
      : "smooth",
    block: "start",
  });
  contactForm.value?.querySelector("input")?.focus({ preventScroll: true });
}
async function submit() {
  if (submitting.value || !validDates.value) return;
  submitError.value = "";
  const digits = phone.value.replace(/\D/g, "");
  if (
    name.value.trim().length < 2 ||
    !(digits.length === 10 || (digits.length === 11 && /^[78]/.test(digits)))
  ) {
    submitError.value =
      "Укажите имя и российский номер телефона из 10 цифр или 11 цифр с 7/8.";
    return;
  }
  if (!consent.value) return;
  submitting.value = true;
  const payload = {
    customerName: name.value.trim(),
    phone: "+7" + (digits.length === 11 ? digits.slice(1) : digits),
    startDate: stay.value.start + "T00:00:00.000Z",
    endDate: stay.value.end + "T00:00:00.000Z",
    adults: stay.value.adults,
    children: stay.value.children,
    hasSauna: stay.value.hasSauna,
  };
  try {
    await refresh();
    if (!validDates.value) {
      submitError.value =
        "Доступность дат изменилась или не удалось её проверить. Проверьте календарь и попробуйте снова.";
      return;
    }
    await $fetch(config.public.apiBase + "/bookings", {
      method: "POST",
      timeout: 15000,
      body: payload,
    });
    sent.value = true;
    clearDates();
    name.value = "";
    phone.value = "";
    consent.value = false;
    stay.value.hasSauna = false;
    await refresh();
  } catch (err) {
    const message = err?.data?.message;
    submitError.value =
      (Array.isArray(message) ? message[0] : message) ||
      "Не удалось отправить заявку. Попробуйте ещё раз или позвоните хозяину.";
    if (err?.statusCode === 409) await refresh();
  } finally {
    submitting.value = false;
  }
}
</script>
<style scoped>
.booking-experience {
  scroll-margin-top: 100px;
}
.booking-intro {
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 24px;
  margin-bottom: 28px;
}
.booking-intro h2 {
  font-size: clamp(28px, 3vw, 40px);
  line-height: 1.15;
  margin-bottom: 12px;
}
.booking-intro p {
  color: var(--muted);
}
.nightly {
  white-space: nowrap;
}
.nightly strong {
  color: var(--ink);
  font-size: 26px;
}
.stay-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
  gap: 24px;
  align-items: start;
}
.panel {
  padding: 28px;
  background: white;
  border: 1px solid var(--line);
  border-radius: 20px;
  min-width: 0;
}
.panel h3 {
  font-size: 22px;
  margin-bottom: 20px;
}
.stay-date-fields {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-bottom: 24px;
}
.stay-date-fields button {
  text-align: left;
  min-width: 0;
  background: var(--surface);
  padding: 12px;
  border: 1px solid var(--line);
  border-radius: 10px;
  color: var(--ink);
}
.stay-date-fields button.active {
  border-color: var(--accent);
  box-shadow: inset 0 0 0 1px var(--accent);
}
.stay-date-fields span {
  display: block;
  color: var(--muted);
  font-size: 12px;
  margin-bottom: 6px;
}
.stay-date-fields strong {
  font-size: 16px;
}
.date-summary .text-button {
  white-space: nowrap;
}
.date-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  margin-top: 16px;
}
.guest-setting {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  gap: 12px;
}
.guest-setting small,
.sauna-option small {
  display: block;
  color: var(--muted);
  font-size: 14px;
  margin-top: 4px;
}
.guest-counter {
  display: flex;
  align-items: center;
  gap: 12px;
}
.guest-counter button {
  width: 44px;
  height: 44px;
  border: 1px solid var(--line);
  background: white;
  color: var(--ink);
  border-radius: 10px;
  font-size: 22px;
}
.guest-counter button:disabled {
  opacity: 0.4;
  cursor: default;
}
.guest-counter output {
  min-width: 20px;
  text-align: center;
}
.small-note {
  font-size: 14px;
  color: var(--muted);
  line-height: 1.5;
  margin: 14px 0;
}
.sauna-option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px 0;
  margin-top: 12px;
  border-top: 1px solid var(--line);
  cursor: pointer;
  flex-wrap: wrap;
}
.sauna-option > span {
  flex: 1;
  min-width: 130px;
}
.sauna-option > strong {
  font-size: 16px;
  white-space: nowrap;
}
input[type="checkbox"] {
  width: 22px;
  height: 22px;
  flex-shrink: 0;
  accent-color: var(--accent);
}
.stay-total {
  background: var(--surface);
  padding: 20px;
  border-radius: 12px;
}
.stay-total > div {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 12px;
  font-size: 15px;
}
.stay-total > div span:last-child {
  white-space: nowrap;
}
.stay-total .total-line {
  border-top: 1px solid var(--line);
  padding-top: 16px;
  margin-bottom: 0;
  font-size: 20px;
  flex-wrap: wrap;
}
.stay-total p {
  color: var(--muted);
  font-size: 15px;
}
.stay-settings > .button {
  width: 100%;
  margin-top: 8px;
}
.booking-hint {
  font-size: 14px;
  text-align: center;
  color: var(--muted);
  margin-top: 12px;
}
.contact-step {
  grid-column: 1/-1;
  scroll-margin-top: 100px;
}
.contact-step > div > p {
  color: var(--muted);
}
.contact-fields {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin: 24px 0;
}
.contact-fields label {
  font-weight: 600;
  display: grid;
  gap: 8px;
}
.contact-fields input {
  width: 100%;
  padding: 15px;
  border: 1px solid #93897c;
  border-radius: 10px;
  font-size: 16px;
  background: white;
}
.booking-consent {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  font-size: 14px;
  margin-bottom: 24px;
}
.booking-consent a,
.form-error a {
  color: inherit;
  text-decoration: underline;
}
.form-error {
  background: #fff0e9;
  color: #873317;
  padding: 14px;
  border-radius: 10px;
  margin: 12px 0;
  font-size: 14px;
}
.booking-success {
  padding: 32px;
  background: var(--sand);
  border-radius: 16px;
}
.booking-success p {
  margin: 16px 0;
  max-width: 65ch;
}
@media (max-width: 760px) {
  .booking-intro {
    display: block;
  }
  .nightly {
    margin-top: 16px;
  }
  .stay-grid {
    grid-template-columns: 1fr;
  }
  .panel {
    padding: 20px;
  }
  .contact-fields {
    grid-template-columns: 1fr;
  }
  .booking-intro h2 {
    font-size: 30px;
  }
}
@media (max-width: 360px) {
  .panel {
    padding: 14px;
  }
  .stay-date-fields span {
    font-size: 11px;
  }
  .stay-date-fields button {
    padding: 9px;
  }
  .date-summary {
    font-size: 12px;
  }
}
</style>
