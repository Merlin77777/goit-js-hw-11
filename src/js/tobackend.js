import axios from 'axios';

const images_per_page = 40;
let totalPages = 0;

async function getImages(query, num_pages) {
  const API_KEY = '35956293-5694f9bae7d2551c230f60579';
  const params = new URLSearchParams({
    key: API_KEY,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: images_per_page,
    page: num_pages,
  });

  const response = await axios.get(`https://pixabay.com/api/?${params}`);
  totalPages = response.data.totalHits / images_per_page;
  return response;
}

export { getImages, totalPages };
