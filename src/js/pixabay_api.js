'use strict';
import axios from "axios";

export class PixabayAPI {
  static BASE_URL = 'https://pixabay.com/api/';
  static API_KEY = '32830040-7bce44f963d1f6b8a44f1755d';

  constructor() {
    this.page = 1;
    this.query = '';
    this.per_page = 40;
  }

  async fetchPhotosByQuery() {
    const searchParams = new URLSearchParams({
      q: this.query,
      page: this.page,
      image_type: 'photo',
      orientation: 'horizontal',
      key: PixabayAPI.API_KEY,
      per_page: this.per_page
    });

    try {
      const response = await fetch(`${PixabayAPI.BASE_URL}?${searchParams}`);
     return await response.json();
    } catch (error) {
      console.log(error.message);
    }
  }
}