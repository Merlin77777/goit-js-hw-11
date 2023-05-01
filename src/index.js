import Notiflix from 'notiflix';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const lightbox = new SimpleLightbox('.gallery a');

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const guard = document.querySelector('.guard');

const images_per_page = 40;
let totalPages = 0;

async function getImages(query, page) {
  const API_KEY = '35956293-5694f9bae7d2551c230f60579';
  const params = new URLSearchParams({
    key: API_KEY,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: images_per_page,
    page: page,
  });

  const response = await axios.get(`https://pixabay.com/api/?${params}`);
  totalPages = response.data.totalHits / images_per_page;
  return response;
}

let query = '';
let page = 1;

const options = {
  root: null,
  rootMargin: '100px',
  threshold: 0,
};
const observer = new IntersectionObserver(onPagination, options);

form.addEventListener('change', onInput);
form.addEventListener('submit', onSubmit);

function onInput(evt) {
  query = evt.target.value.trim();
  return query;
}

function onSubmit(evt) {
  evt.preventDefault();
  page = 1;
  gallery.innerHTML = '';

  if (!evt.target.elements.searchQuery.value) {
    Notiflix.Notify.failure('Please, enter a search query');
  } else {
    createGallery();
  }
}

async function createGallery() {
  try {
    const response = await getImages(query, page);
    addImages(response);
    if (page !== totalPages) {
      observer.observe(guard);
    }
  } catch (error) {
    console.error(error);
  }
}

function addImages(response) {
  const images = response.data.hits;

  if (!images.length) {
    gallery.innerHTML = '';
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  } else {
    makeGallery(images);
    Notiflix.Notify.success(
      `Hooray! We found ${response.data.totalHits} images.`
    );
    lightbox.refresh();
  }
}

function makeGallery(images) {
  const markup = images
    .map(image => {
      const {
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      } = image;
      return `<a class="gallery__item" target="_self" href="${largeImageURL}">
              <div class="img-container">
                  <img class="gallery__image" src="${webformatURL}" alt="${tags}" loading="lazy"/>
              </div>
              <div class="info">
                  <p class="info-item"><b>Likes</b> <br>${likes}</p>
                  <p class="info-item"><b>Views</b> <br>${views}</p>
                  <p class="info-item"><b>Comments</b> <br>${comments}</p>
                  <p class="info-item"><b>Downloads</b> <br>${downloads}</p>
              </div></a>`;
    })
    .join('');
  gallery.insertAdjacentHTML('beforeend', markup);
}

function onPagination(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      page += 1;
      paginationGallery();
      if (page === totalPages) {
        observer.unobserve(guard);
      }
    }
  });
}

async function paginationGallery() {
  try {
    scroll();
    const response = await getImages(query, page);
    const images = response.data.hits;
    makeGallery(images);
    lightbox.refresh();

    if (page > totalPages) {
      Notiflix.Notify.warning(
        "We're sorry, but you've reached the end of search results."
      );
    }
  } catch (error) {
    console.error(error);
  }
}

function scroll() {
  if (!gallery.firstElementChild) {
    return;
  } else {
    const { height: cardHeight } =
      gallery.firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  }
}
