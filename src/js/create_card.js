'use strict';

export 
function createGalleryCards(info){
  return  info.map(el =>{
const galleryCardsArr =
`<div class="photo-card">
<a class="gallery__item" href="${el.largeImageURL}">
  <img src="${el.webformatURL}" alt="${el.tags}" loading="lazy" />
  </a>
  <div class="info">
    <p class="info-item">
      <b>Likes: </b> ${el.likes}
    </p>
    <p class="info-item">
      <b>Views: </b> ${el.views}
    </p>
    <p class="info-item">
      <b>Comments: </b> ${el.comments}
    </p>
    <p class="info-item">
      <b>Downloads:</b>  ${el.downloads}
    </p>
  </div>
</div>`

return galleryCardsArr

}).join('');

}


