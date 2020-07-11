import './scss/style.scss';
import './css/css-style.css';
import './js/app';

// core version + navigation, pagination modules:
import Swiper, { Navigation, Pagination } from 'swiper';

// import Swiper styles
import 'swiper/swiper-bundle.css';

// configure Swiper to use modules
Swiper.use([Navigation, Pagination]);

var mySwiper = new Swiper('.swiper-container', {
  // Optional parameters
  direction: 'horizontal',
  loop: true,

  // If we need pagination
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },

  // Navigation arrows
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },

  // // And if we need scrollbar
  // scrollbar: {
  //   el: '.swiper-scrollbar',
  // },
})
