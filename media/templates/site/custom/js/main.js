$(document).ready(function () {
  // function toggler(block){
  //   $(document).mouseup(function (e){
  //     if (!block.is(e.target)
  //         && block.has(e.target).length === 0) {
  //       block.removeClass('active');
  //     } else {
  //       block.toggleClass('active');
  //     }
  //   });
  // }
  // toggler($('.header .catalog'));

  // $(document).mouseup(function (e){
  //   if (!$('.header .catalog').is(e.target) && !$('.cat-wrapper').is(e.target) 
  //         && $('.header .catalog').has(e.target).length === 0) {
  //       $('.header .catalog').removeClass('active');
  //       $('.cat-wrapper').hide()
  //     } else {
  //       $('.header .catalog').toggleClass('active');
  //       $('.cat-wrapper').toggle()
  //     }
  // });

  const menuBtn = $('.show-cat-menu'),
    menu = $('.cat-wrapper');
  menuBtn.on('click', function (e) {
    e.stopPropagation();
    if ($(this).hasClass('active')) {
      $(this).removeClass('active');
      menu.fadeOut();
    } else {
      $(this).addClass('active');
      menu.fadeIn();
      if (jQuery(window).innerWidth() <= 1300) {

        $('.jshop_ajaxsearch').slideUp()
      }
    }
  });


  $(document).click(function (e) {
    if (!menuBtn.is(e.target) && !menu.is(e.target) && menu.has(e.target).length === 0) {
      menu.fadeOut();
      menuBtn.removeClass('active');
    };
  });
  $(document).click(function (e) {
    if (!$('#cartajaxCartModal').is(e.target)) {
      const modal = document.querySelector('#cartajaxCartModal');
      const bsModal = bootstrap.Modal.getInstance(modal) || new bootstrap.Modal(modal);
      bsModal.hide();
    };
  });
  $(document).click(function (e) {
    if (!$('#cartajaxWishlistModal').is(e.target)) {
      const modal = document.querySelector('#cartajaxWishlistModal');
      const bsModal = bootstrap.Modal.getInstance(modal) || new bootstrap.Modal(modal);
      bsModal.hide();
    };
  });
  $('.show-search').click(function (e) {
    e.preventDefault();
    $(this).toggleClass('open');
    $('.header-search').slideToggle();
  });
  $('.cat-wrapper .nav > li:first-child').addClass('hover');
  $('.cat-wrapper .nav > li').mouseenter(function () {
    $('.cat-wrapper .nav > li').removeClass('hover');
    $(this).addClass('hover');
  });
  const toTopLink = $("#toTop");
  if (toTopLink.length) {
    const backToTop = function () {
      const scrollTrigger = 400;
      let scrollTop = $(window).scrollTop();
      if (scrollTop > scrollTrigger) {
        toTopLink.addClass("show");
      } else {
        toTopLink.removeClass("show");
      }
    };
    backToTop();
    $(window).on("scroll", function () {
      backToTop();
    });
    toTopLink.on("click", function (e) {
      e.preventDefault;
      $("html, body").animate({ scrollTop: 0 }, 1200);
    });
  }
  // $('.button_buy, .button-buy').click(function (e) {
  //   $('.buy-caption-success').addClass('open')
  //   setTimeout(function () {
  //     $('.buy-caption-success').removeClass('open');
  //   }, 3000);
  // })
  // $('.buy-caption-success .close').click(function (e) {
  //   $('.buy-caption-success').removeClass('open');
  // })

  $('.burger-menu').click(function (e) {
    e.stopPropagation()
    $(this).toggleClass('active')
    if ($(this).hasClass("active")) {
      $('.mobile-menu').addClass('active')
      $('.mobile-menu .first').addClass('open')
      $('.show-search').removeClass('open')
      $('.jshop_ajaxsearch').slideUp()
      $("html, .body-wrapper").css("overflow", "hidden")
    } else {
      $('.mobile-menu').removeClass('open')
      $('.mobile-menu .first').removeClass('open')
      $("html, .body-wrapper").css("overflow", "auto")
    }
  });
  $('.show-cat-mobile').click(function (e) {
    e.stopPropagation()
    $('.mobile-menu .first').removeClass('open')
    $('.mobile-menu .mob-cat-menu').addClass('open')
  });
  $('.mobile-menu .close').click(function (e) {
    e.stopPropagation()
    $('.burger-menu').removeClass('active')
    $('.mobile-menu').removeClass('active')
    $('.mobile-menu .inner').removeClass('open')
    $("html, .body-wrapper").css("overflow", "auto")
  })
  $('.mobile-menu .show-subcat').click(function (e) {
    e.preventDefault()
    e.stopPropagation()
    $('.mobile-menu .inner').removeClass('open')
    $(this).parents('.parent').find('.mod-menu__sub').addClass('open')
  })
  $('.mobile-menu .cat-back').click(function (e) {
    e.preventDefault()
    e.stopPropagation()
    $('.mobile-menu .inner').removeClass('open')
    $('.mobile-menu .mob-cat-menu').addClass('open')
  })

  $(".scroll").on("click", function (e) {
    e.preventDefault();
    const id = $(this).attr("href"),
      top = $(id).offset().top - 100;
    $("body,html").animate({ scrollTop: top }, 1500);
  });

  // $(window).scroll(function () {
  //   if ($(window).scrollTop() > 150) {
  //     $(".header, .mobile-menu").addClass("sticky");
  //     $("body").addClass("header-sticky");
  //   } else if (!($(window).scrollTop() + $(window).height() >= $(document).height())) {
  //     $(".header, .mobile-menu").removeClass("sticky");
  //     $("body").removeClass("header-sticky");
  //   }
  // });
  $(document).on('click', '.quantity .quantity-plus, .quantity .quantity-minus', function () {
    console.log('click');
    var $btn = jQuery(this);
    var $input = $btn.siblings('.ca_qty_input').find('.quan-input');
    var currentVal = parseInt($input.val()) || 1;
    if ($btn.hasClass('quantity-minus')) {
      if (currentVal > 1) {
        $input.val(currentVal - 1).trigger('change');
      }
    } else {
      $input.val(currentVal + 1).trigger('change');
    }
    $('.cart_reload').trigger('click');
  });

  $("#tel, .login-page #phone").mask("+38(999) 999-99-99")

  function setSelectionRange(input, selectionStart, selectionEnd) {
    if (input.setSelectionRange) {
      input.focus();
      input.setSelectionRange(selectionStart, selectionEnd);
    }
    else if (input.createTextRange) {
      var range = input.createTextRange();
      range.collapse(true);
      range.moveEnd('character', selectionEnd);
      range.moveStart('character', selectionStart);
      range.select();
    }
  }

  function setCaretToPos(input, pos) {
    setSelectionRange(input, pos, pos);
  }

  $("#tel, .login-page #phone").click(function () {
    var $id = $(this).attr('id');
    setCaretToPos(document.getElementById($id), 4);
  });

  const myorders_list = document.querySelector('.myorders_list');
  if (myorders_list) {
    const order_item = myorders_list.querySelectorAll('.myorders_block_info');

    if (order_item) {
      order_item.forEach(element => {
        const top = element.querySelector('.top');
        top.addEventListener('click', function () {
          element.classList.toggle('active');
        })
      });
    }
  }


  const swiper_reviews = new Swiper('.swiper-reviews', {
    spaceBetween: 8,
    // autoplay: {
    //   delay: 5000,
    // },
    // loop: true,
    speed: 800,
    slidesPerView: 1,
  });

  const mainSlider = new Swiper('.main-slider', {
    // navigation: {
    //   nextEl: '.main-slider-next',
    //   prevEl: '.main-slider-prev',
    // },
    spaceBetween: 8,
    autoplay: {
      delay: 5000,
    },
    loop: true,
    pagination: {
      el: ".main-slider-pagination",
      clickable: true,
    },
    speed: 800,
  });
  const catsSlider = new Swiper('.main-cats-slider .swiper-container', {
    navigation: {
      nextEl: '.main-cats-next',
      prevEl: '.main-cats-prev',
    },
    autoplay: {
      delay: 5000,
    },
    loop: true,
    breakpoints: {
      0: {
        slidesPerView: 2,
      },
      768: {
        slidesPerView: 3,
      },
      1200: {
        slidesPerView: 4,
      },
      1500: {
        slidesPerView: 5,
      },
      1700: {
        slidesPerView: 6,
      },
    },
  });
  const resSlider = new Swiper('.recently-slider', {
    navigation: {
      nextEl: '.recently-viewed-next',
      prevEl: '.recently-viewed-prev',
    },

    breakpoints: {
      0: {
        slidesPerView: 2,
        spaceBetween: 10,
      },
      768: {
        slidesPerView: 3,
      },
      1200: {
        slidesPerView: 4,
      },
      1700: {
        slidesPerView: 5,
      },
    },
  });
  var productTumbsSlider = new Swiper('.product-thumbs-slider', {
    slidesPerView: 'auto',
    spaceBetween: 16,
  });
  var productImgSlider = new Swiper('.product-img-slider', {
    slidesPerView: 1,
    spaceBetween: 10,
    speed: 500,
    navigation: {
      prevEl: ".product-img-slider-prev",
      nextEl: ".product-img-next",
    },
    effect: "coverflow",
    coverflowEffect: {
      rotate: 80,
      slideShadows: false,
    },
    thumbs: {
      swiper: productTumbsSlider,
    },
  });
  productImgSlider.on('slideChange', function (swiper) {
    productTumbsSlider.slideTo(this.activeIndex);
  });
  $('.product-img-slider .swiper-wrapper').lightGallery({
    share: false,
    download: false,
    thumbnail: false
  });
  $('.productfull .single-image').lightGallery({
    share: false,
    download: false,
    thumbnail: false
  });

  const jshop_prod_cart = document.querySelector('.jshop_prod_cart');
  if (jshop_prod_cart) {
    const qtyInputs = document.querySelectorAll('.quan-input');

    qtyInputs.forEach(function (input) {
      input.addEventListener('blur', function () {
        const cartReload = document.querySelector('.cart_reload');
        if (cartReload) {
          cartReload.click();
        }
      });
    });
  }
  const btn_filter_mob = document.querySelector('.btn_filter_mob');
  const filter = document.querySelector('.filter_block');
  if (btn_filter_mob) {
    btn_filter_mob.addEventListener('click', function () {
      filter.classList.toggle('active');
      const close = filter.querySelector('.close');
      close.addEventListener('click', function () {
        filter.classList.remove('active');
      });
    });
  }
  const subcategory_slider = new Swiper('.subcategory-slider', {
    speed: 1000,
    spaceBetween: 20,
    slidesPerView: 'auto',
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  });

});