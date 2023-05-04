import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
import { getImages, totalPages } from './js/tobackend';
import { makeGallery, scroll } from './js/makehtml';

const lightbox = new SimpleLightbox('.gallery a');

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const guard = document.querySelector('.guard');

let query = '';
let cur_page = 1;

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
  gallery.innerHTML = '';
  observer.unobserve(guard);

  if (!evt.target.elements.searchQuery.value) {
    Notiflix.Notify.failure('Please, enter a search query');
  } else {
    cur_page = 1;
    createGallery();
  }
}

async function createGallery() {
  try {
    const response = await getImages(query, cur_page);
    addImages(response);
    if (cur_page !== totalPages) {
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

function onPagination(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      cur_page += 1;
      paginationGallery();
      if (cur_page === totalPages) {
        observer.unobserve(guard);
      }
    }
  });
}

async function paginationGallery() {
  try {
    scroll();
    const response = await getImages(query, cur_page);
    const images = response.data.hits;
    makeGallery(images);
    lightbox.refresh();
    if (cur_page > totalPages) {
      Notiflix.Notify.warning(
        "We're sorry, but you've reached the end of search results."
      );
    }
  } catch (error) {
    console.error(error);
  }
}

export { gallery };
