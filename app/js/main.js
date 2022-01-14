$(function () {

  $('.header__btn').on('click', function() {
    $('.rightside-menu').removeClass('rightside-menu--close')
  });
  $('.rightside-menu__clouse').on('click', function() {
    $('.rightside-menu').addClass('rightside-menu--close')
    
  });
})