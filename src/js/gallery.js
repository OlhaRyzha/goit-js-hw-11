// https://unsplash.com/
import { PixabayAPI } from './pixabay_api.js';
import { createGalleryCards } from './create_card.js';
import 'notiflix/dist/notiflix-3.2.6.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';

import 'simplelightbox/dist/simple-lightbox.min.css';

const btnForSearchEl = document.querySelector('button[ type="submit"]');
const formForSearchImg = document.querySelector('#search-form');
const btnForOpeningNewImg = document.querySelector('.load-more');
const galleryEl = document.querySelector('.gallery');
const cardEl = document.querySelector('.photo-card');

const pixabayAPI = new PixabayAPI();

const onSearchFormSubmit = async event => {
  event.preventDefault();

  btnForSearchEl.disabled = false;

  pixabayAPI.query = event.target.elements.searchQuery.value;
  pixabayAPI.page = 1;
  

  try {
    const data = await pixabayAPI.fetchPhotosByQuery();
    const { hits, totalHits } = data;

    if (pixabayAPI.query.length === 0) {
      Notify.failure('You have not entered anything in the field!');
      event.target.reset();
      galleryEl.innerHTML = '';
      btnForOpeningNewImg.classList.add('is-hidden');
      return;
    }
    if (hits.length === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      event.target.reset();
      galleryEl.innerHTML = '';
      btnForOpeningNewImg.classList.add('is-hidden');
      return;
    }

    if (data.totalHits / pixabayAPI.per_page > 1) {
      btnForOpeningNewImg.classList.remove('is-hidden');
    } else {
      btnForOpeningNewImg.classList.add('is-hidden');
    }
    Notify.info(`Hooray! We found ${totalHits} images.`);
    galleryEl.innerHTML = createGalleryCards(hits);

    galleryEl.addEventListener('click', onLinkClick);
    function onLinkClick(event) {
      event.preventDefault();
      if (event.target.nodeName !== 'IMG') {
        return;
      }
    }
    var lightbox = new SimpleLightbox('.photo-card a');
  } catch (error) {
    console.log(error.message);
  }
};

const onLoadMoreBtnClick = async event => {
  event.target.disabled = true;
  pixabayAPI.page += 1;
  event.target.disabled = false;
  try {
    const data = await pixabayAPI.fetchPhotosByQuery();
    galleryEl.insertAdjacentHTML('beforeend', createGalleryCards(data.hits));

    galleryEl.addEventListener('click', onLinkClick);

    function onLinkClick(event) {
      event.preventDefault();
      if (event.target.nodeName !== 'IMG') {
        return;
      }
    }
    var lightbox = new SimpleLightbox('.photo-card a');

    lightbox.refresh();

    const { height: cardHeight } =
      galleryEl.firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
    if (
      Number((data.totalHits / pixabayAPI.per_page).toFixed()) ===
      pixabayAPI.page
    ) {
      btnForOpeningNewImg.classList.add('is-hidden');
      Notify.info("We're sorry, but you've reached the end of search results.");
    }
  } catch (error) {
    console.log(error.message);
  }
};

formForSearchImg.addEventListener('submit', onSearchFormSubmit);
btnForOpeningNewImg.addEventListener('click', onLoadMoreBtnClick);
