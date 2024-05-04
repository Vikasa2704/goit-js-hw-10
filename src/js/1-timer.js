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

buttonStart.setAttribute('disabled', 'disabled');

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

  if (chosenDate < Date.now()) {
    iziToast.error({
      title: 'Error',
      message: 'Please choose a date in the future',
    });
  } else {
    buttonStart.removeAttribute('disabled');
  }
}

buttonStart.addEventListener(`click`, onClick);

function onClick() {
  timerId = setInterval(() => {
    buttonStart.setAttribute('disabled', 'disabled');
    inputDate.setAttribute('disabled', 'disabled');

    const currentTime = Date.now();
    const differenceTime = chosenDate - currentTime;
    console.log(differenceTime, chosenDate, currentTime);

    if (differenceTime < 1000) {
      clearInterval(timerId);
      inputDate.removeAttribute('disabled');
    }

    const { days, hours, minutes, seconds } = convertMs(differenceTime);
    formatTimer({ days, hours, minutes, seconds });
  }, 1000);
}

function formatTimer({ days, hours, minutes, seconds }) {
  daysValue.textContent = days;
  hoursValue.textContent = hours;
  minutesValue.textContent = minutes;
  secondsValue.textContent = seconds;
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
