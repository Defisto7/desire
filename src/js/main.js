$(function () {

  $('.header__btn').on('click', function() {
    $('.rightside-menu').removeClass('rightside-menu--close')
  });
  $('.rightside-menu__clouse').on('click', function() {
    $('.rightside-menu').addClass('rightside-menu--close')
  });

  $('.header__btn-menu').on('click', function() {
    $('.menu').toggleClass('menu--open')
  });

  $('.top__slider').slick({
    dots: true,
    arrows: false,
    fade: true,
    autoplay: true
  });

  $('.contact-slider').slick({
    slidesToShow: 10,
    slidesToScroll: 10,
    dots: true,
    arrows: false,
  });

  $('.article-slider__box').slick({
    prevArrow: '<button type="button" class="article-slider__arrow article-slider__arrowleft"><img src="img/arrow-left.svg" alt="arrow left"></button>',
    nextArrow: '<button type="button" class="article-slider__arrow article-slider__arrowright"><img src="img/arrow-right.svg" alt="arrow right"></button>'
  });
  

  let mixer = mixitup('.gallery__inner', {
    load: {
      filter: '.living'
    }
  });

})