import { apiKey } from './apiKey';

const selectEl = document.querySelector('.breed-select');
const errorEl = document.querySelector('.error');
const ploadEl = document.querySelector('.loader');
const divCatInfo = document.querySelector('.cat-info');
errorEl.style.display = 'none';
function fetchBreeds() {
  fetch('https://api.thecatapi.com/v1/breeds')
    .then(response => response.json())
    .then(data => {
      const breedListId = data.map(({ id, name }) => ({ id, name }));
      breedListId.forEach(id => {
        const optionEl = document.createElement('option');
        optionEl.value = id.id;
        optionEl.textContent = id.name;
        selectEl.appendChild(optionEl);
      });
    })
    .catch(error => (errorEl.style.display = 'block'));
}

selectEl.addEventListener('change', selectedBreed);
function selectedBreed() {
  let selectedCatId = selectEl.value;
  fetchCatByBreed(selectedCatId);
}

function fetchCatByBreed(breedId) {
  fetch(`https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}`, {
    headers: {
      'x-api-key': apiKey,
    },
  }).then(data => {
    console.log(data);
  });
}

fetchBreeds();
