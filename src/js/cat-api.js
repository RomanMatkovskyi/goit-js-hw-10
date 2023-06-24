import Notiflix from 'notiflix';
import SlimSelect from 'slim-select';
import 'slim-select/dist/slimselect.css';

let apiKey;
const selectEl = document.querySelector('.breed-select');
const errorEl = document.querySelector('.error');
const ploadEl = document.querySelector('.load');
const titleEl = document.querySelector('.main-title');

const formEl = document.getElementById('api');
const formInput = document.querySelector('.api-input');
const loaderFormEl = document.querySelector('.loader-form');
loaderFormEl.classList.add('visually-hidden');
const backDropEl = document.querySelector('.backdrop');

const divCatInfoEl = document.querySelector('.cat-info');
errorEl.style.display = 'none';

window.addEventListener('load', checkApiKey);
function checkApiKey() {
  selectEl.classList.add('visually-hidden');
  titleEl.classList.add('visually-hidden');
  if (localStorage.getItem('apiKey') !== null) {
    apiKey = localStorage.getItem('apiKey');
    backDropEl.classList.toggle('visually-hidden');
    selectEl.classList.remove('visually-hidden');
    titleEl.classList.remove('visually-hidden');
  }
}

formEl.addEventListener('submit', getApiKey);

function getApiKey(event) {
  event.preventDefault();
  apiKey = formInput.value;
  formInput.value = '';
  loaderFormEl.classList.toggle('visually-hidden');
  fetch(`https://api.thecatapi.com/v1/images/search?limit=15`, {
    headers: {
      'x-api-key': apiKey,
    },
  })
    .then(response => response.json())
    .then(data => {
      loaderFormEl.classList.toggle('visually-hidden');
      if (data.length === 15) {
        localStorage.setItem('apiKey', apiKey);
        backDropEl.classList.toggle('visually-hidden');
      } else {
        loaderFormEl.classList.add('visually-hidden');
        Notiflix.Notify.failure('Upppsss, your key is wrong :(');
      }
      selectEl.classList.remove('visually-hidden');
      titleEl.classList.remove('visually-hidden');
    })
    .catch(error => Notiflix.Notify.failure('Please enter valid key'));
}

function fetchBreeds() {
  ploadEl.classList.toggle('loader');
  fetch('https://api.thecatapi.com/v1/breeds')
    .then(response => response.json())
    .then(data => {
      ploadEl.classList.toggle('loader');
      const breedListId = data.map(({ id, name }) => ({ id, name }));
      breedListId.forEach(id => {
        const optionEl = document.createElement('option');
        optionEl.value = id.id;
        optionEl.textContent = id.name;
        selectEl.appendChild(optionEl);
      });
      new SlimSelect({
        select: '#single',
      });
    })
    .catch(error => (errorEl.style.display = 'block'));
}

selectEl.addEventListener('change', selectedBreed);
function selectedBreed() {
  let selectedCatId = selectEl.value;
  ploadEl.classList.toggle('loader');
  fetchCatByBreed(selectedCatId);
}

function fetchCatByBreed(breedId) {
  divCatInfoEl.innerHTML = '';
  fetch(`https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}`, {
    headers: {
      'x-api-key': apiKey,
    },
  })
    .then(data => data.json())
    .then(id => {
      ploadEl.classList.toggle('loader');
      let catInfo = id[0];
      let breedInfo = catInfo.breeds[0];
      let catDescription = `
    <img src="${catInfo.url}" alt="" height="300" class="cat-foto">
    <div class="descrition-wrap">
      <h2 class="cat-name">${breedInfo.name}</h2>
      <p class="cat-description">${breedInfo.description}</p>
      <p class="cat-temperament"><span class="tempword-wrap">Temperament</span>: ${breedInfo.temperament}</p>
      </div>`;
      divCatInfoEl.insertAdjacentHTML('beforeend', catDescription);
    });
}

fetchBreeds();
