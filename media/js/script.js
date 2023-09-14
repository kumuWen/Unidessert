// "use strict";
var offsetTop;
var pagetopposition = $('.page-top-position').offset();
$(window).scroll(function () {
  offsetTop = $(window).scrollTop(); // 捲軸高度>=900，會出現page-top的按鈕

  if (offsetTop >= 200) {
    $('.page-top').addClass('active');
  } else {
    $('.page-top').removeClass('active');
  }
}); //scroll end
// 點按page-top回到最上方

// $('.member_link>a').on('click', function(e){
//   e.preventDefault()
//   $(this).addClass('active')
//   $(this).siblings().removeClass('active')
//   console.log($(this).attr('href'))
//   $( $(this).attr('href') ).addClass('active')
//   $( $(this).attr('href') ).siblings().removeClass('active')
// });//.tab-link>a end

// $('.member_linkleft>a').on('click', function(e){
//   e.preventDefault()
//   $(this).addClass('active')
//   $(this).siblings().removeClass('active')
//   console.log($(this).attr('href'))
//   $( $(this).attr('href') ).addClass('active')
//   $( $(this).attr('href') ).siblings().removeClass('active')
// });//.tab-link>a end

//購物車
// $(document).ready(function () {
//   let addtocart = document.querySelectorAll('.addtocart');

//   for (var i = 0; i < addtocart.length; i++) {
//     addtocart[i].addEventListener('click', function (e) {
//       // console.log(e)
//       var button = $(this);
//       var cart = $("#cart");
//       var cartTotal = cart.attr("data-totalitems");
//       var newCartTotal = parseInt(cartTotal) + 1;

//       button.addClass("sendtocart");
//       setTimeout(function () {
//         button.removeClass("sendtocart");
//         cart.addClass("shake").attr("data-totalitems", newCartTotal);
//         setTimeout(function () {
//           cart.removeClass("shake");
//         }, 500);
//       }, 300);
//     }, false);
//   }
// });
// ===================================

$(document).ready(function () {
  // 導覽列購物車 icon 數字跟著購物車數量變化
  function updateCartIconCount(count) {
    $('#cartNumber').text(count);
  }

  // 從後端獲取購物車數量並更新購物車圖示數字
  function getAndSetCartCount() {
    $.ajax({
      url: '/cart/count',
      type: 'GET',
      dataType: 'json',
      cache: false,
      success: function (data) {
        var cartCount = data.cartCount;
        updateCartIconCount(cartCount);
      },
      error: function (error) {
        console.error('Error fetching cart count:', error);
      },
    });
  }

  // 加入商品到購物車
  function addToCart() {
    $.ajax({
      url: '/cart/add',
      type: 'POST',
      data: {},
      dataType: 'json',
      cache: false,
      success: function () {
        getAndSetCartCount(); // 回傳成功時更新購物車數字
      },
      error: function (error) {
        console.error('Error adding to cart:', error);
      },
    });
  }

  $('.addtocart').on('click', function (e) {
    addToCart();
  });
  $('.addBtn').on('click', function (e) {
    getAndSetCartCount()
  });
  $('.subtractBtn').on('click', function (e) {
    getAndSetCartCount()
  });
  $('.deleteBtn').on('click', function (e) {
    addToCart();
  });

  // 初始化時獲取購物車數量
  getAndSetCartCount();

  // 檢查使用者登入狀態的 AJAX 請求
  $.ajax({
    type: 'GET',
    url: '/user/checkLogin',
    dataType: 'json',
    success: function (data) {
      if (data.loggedIn) {
        // 使用者已登入，隱藏登入按鈕
        $('.signin').hide();
      } else {
        // 使用者尚未登入，隱藏登出按鈕
        $('.dropdown .signout').hide();
      }
    },
    error: function (err) {
      console.error('無法檢查使用者登入狀態:', err);
    },
  });
});
