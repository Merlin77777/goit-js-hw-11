import { gallery } from '../index';

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

export { makeGallery, scroll };
