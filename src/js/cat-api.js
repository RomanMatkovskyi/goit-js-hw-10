import Notiflix from 'notiflix';
import SlimSelect from 'slim-select';
import 'slim-select/dist/slimselect.css';

let apiKey =
  'live_DWB9YOTTAWTO0XhjpJdiI3Mf6Xmq9nWpwsLyrXjJYVic892MnSZDNBbJV1Nkb2kp';
const selectEl = document.querySelector('.breed-select');
const errorEl = document.querySelector('.error');
const ploadEl = document.querySelector('.load');
const titleEl = document.querySelector('.main-title');
const divCatInfoEl = document.querySelector('.cat-info');
errorEl.style.display = 'none';

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
      let catInfoArray = [breedInfo.name, breedInfo.description, breedInfo.temperament]
      catInfoArray = catInfoArray.map((element) => {
        if (element === undefined) {
          return '';
        } else {
          return element;
        }
      });
      let tempSpan = 'Temperament:'
      if (catInfoArray[2] === '') {
        tempSpan = '';
      }

      let catDescription = `
    <img src="${catInfo.url}" alt="" height="300" class="cat-foto">
    <div class="descrition-wrap">
      <h2 class="cat-name">${catInfoArray[0]}</h2>
      <p class="cat-description">${catInfoArray[1]}</p>
      <p class="cat-temperament"><span class="tempword-wrap">${tempSpan}</span> ${catInfoArray[2]}</p>
      </div>`;
      divCatInfoEl.insertAdjacentHTML('beforeend', catDescription);
    })
    .catch(error => {
      Notiflix.Notify.failure('Uuupsss, it seems like this cat, is go for a walk');
    });
}

fetchBreeds();
