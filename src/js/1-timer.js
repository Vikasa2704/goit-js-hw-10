import '../css/timer.css';
import '../css/styles.css';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const inputDate = document.querySelector(`#datetime-picker`);
const buttonStart = document.querySelector(`.btn-start`);
const daysValue = document.querySelector(`span[data-days]`);
const hoursValue = document.querySelector(`span[data-hours]`);
const minutesValue = document.querySelector(`span[data-minutes]`);
const secondsValue = document.querySelector(`span[data-seconds]`);

// Початково вимикаємо кнопку "Старт"
buttonStart.dataset.start = 'disabled';

let timerId = null;
let chosenDate = null;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose,
};

flatpickr(inputDate, options);
function onClose(selectedDates) {
  chosenDate = selectedDates[0];

  if (!chosenDate || chosenDate < Date.now()) {
    // Вимикаємо кнопку "Старт", якщо дата не обрана або обрана в минулому
    buttonStart.dataset.start = 'disabled';
    iziToast.error({
      title: 'Error',
      message: 'Please choose a date in the future',
    });
  } else {
    // Увімкнення кнопки "Старт", якщо обрана дата в майбутньому
    buttonStart.dataset.start = 'enabled';
  }
}

buttonStart.addEventListener(`click`, onClick);

function onClick() {
  // Перевіряємо, чи обрана дата, перед тим як запускати таймер
  if (!chosenDate) {
    return;
  }

  // Перевіряємо атрибут data-start, щоб визначити, чи має бути увімкнено кнопку "Старт"
  if (buttonStart.dataset.start === 'disabled') {
    return;
  }

  // Вимикаємо кнопку "Старт" і вимикаємо поле вводу після натискання кнопки "Старт"
  buttonStart.dataset.start = 'disabled';
  inputDate.disabled = true;

  timerId = setInterval(() => {
    const currentTime = Date.now();
    const differenceTime = chosenDate - currentTime;

    if (differenceTime <= 0) {
      clearInterval(timerId);
      inputDate.disabled = false;
      iziToast.success('Timer expired');
      return;
    }

    const { days, hours, minutes, seconds } = convertMs(differenceTime);
    formatTimer({ days, hours, minutes, seconds });
  }, 1000);
}

function formatTimer({ days, hours, minutes, seconds }) {
  daysValue.textContent = pad(days);
  hoursValue.textContent = pad(hours);
  minutesValue.textContent = pad(minutes);
  secondsValue.textContent = pad(seconds);
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = pad(Math.floor(ms / day));
  // Remaining hours
  const hours = pad(Math.floor((ms % day) / hour));
  // Remaining minutes
  const minutes = pad(Math.floor(((ms % day) % hour) / minute));
  // Remaining seconds
  const seconds = pad(Math.floor((((ms % day) % hour) % minute) / second));

  return { days, hours, minutes, seconds };
}

function pad(value) {
  return String(value).padStart(2, '0');
}
