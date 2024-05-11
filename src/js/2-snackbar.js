import '../css/snackbar.css';
import '../css/styles.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('.form');
form.addEventListener('submit', onSubmit);
function onSubmit(event) {
  event.preventDefault();

  // Отримання обраного значення затримки
  const delayInput = document.querySelector('input[name="delay"]');
  const delay = parseInt(delayInput.value);

  // Отримання обраного значення стану
  const stateInput = document.querySelector('input[name="state"]:checked');
  const state = stateInput ? stateInput.value : '';

  // Створення промісу
  const promise = new Promise((resolve, reject) => {
    // Вирішення або відхилення промісу згідно обраного стану
    const action = state === 'fulfilled' ? resolve : reject;
    setTimeout(() => action(delay), delay);
  });

  // Обробка промісу
  promise
    .then(delay => {
      iziToast.success({
        message: `✅ Fulfilled promise in ${delay}ms`,
      });
    })
    .catch(delay => {
      iziToast.error({
        message: `❌ Rejected promise in ${delay}ms`,
      });
    });

  form.reset();
}
