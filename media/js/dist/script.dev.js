"use strict";

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

$(document).ready(function () {
  var addtocart = document.querySelectorAll('.addtocart');

  for (var i = 0; i < addtocart.length; i++) {
    addtocart[i].addEventListener('click', function (e) {
      // console.log(e)
      var button = $(this);
      var cart = $("#cart");
      var cartTotal = cart.attr("data-totalitems");
      var newCartTotal = parseInt(cartTotal) + 1;
      button.addClass("sendtocart");
      setTimeout(function () {
        button.removeClass("sendtocart");
        cart.addClass("shake").attr("data-totalitems", newCartTotal);
        setTimeout(function () {
          cart.removeClass("shake");
        }, 500);
      }, 300);
    }, false);
  }
}); // 改寫上面的購物車
// 確認使用者登入後才可以加商品到購物車，購物車上的數字才可以加 1
// 如果沒有登入，購物車上的數字會保持為 0
// $(document).ready(function () {
//   // 取得所有「加入購物車」按鈕
//   let addtocart = document.querySelectorAll('.addtocart');
//   for (var i = 0; i < addtocart.length; i++) {
//     // 監聽每個「加入購物車」按鈕的點擊事件
//     addtocart[i].addEventListener('click', function (e) {
//       // console.log(e);
//       var button = $(this); // 取得點擊的按鈕
//       var cart = $("#cart"); // 取得購物車的元素
//       var cartTotal = cart.attr("data-totalitems"); // 取得購物車中商品的總數
//       var newCartTotal = parseInt(cartTotal) + 1; // 新的購物車商品總數（加 1）
//       button.addClass("sendtocart"); // 加入送出購物車的動畫效果
//       setTimeout(function () {
//         button.removeClass("sendtocart"); // 移除送出購物車的動畫效果
//         cart.addClass("shake").attr("data-totalitems", newCartTotal); // 購物車抖動效果並更新商品總數
//         setTimeout(function () {
//           cart.removeClass("shake"); // 停止購物車抖動效果
//         }, 500);
//       }, 300);
//       // // 從點擊的按鈕的 data 屬性或其他來源取得產品資訊
//       // var productId = button.attr("data-productid"); // 產品 ID
//       // var price = parseFloat(button.attr("data-price")); // 產品價格
//       // var quantity = 1; // 你可以在這裡設定數量，或從其他來源獲取數量（如果需要的話）
//       // // 建立產品資料物件，準備傳送給伺服器
//       // var productData = {
//       //   productId: productId, // 產品 ID
//       //   price: price, // 產品價格
//       //   quantity: quantity, // 產品數量
//       // };
//       // 使用 AJAX 將產品資料傳送給伺服器
//       // $.ajax({
//       //   type: "POST",
//       //   url: "/addToCart", // 伺服器端的處理端點
//       //   data: productData, // 要傳送的產品資料
//       //   success: function (response) {
//       //     console.log(response.message); // 返回的成功訊息
//       //   },
//       //   error: function (error) {
//       //     // 處理錯誤
//       //     console.error("加入購物車時發生錯誤:", error);
//       //   },
//       // });
//     }, false);
//   }
// });
// =============================================
// 導覽列購物車 icon 數字跟著購物車數量變化

function updateCartIconCount(count) {
  $('#cartNumber').text(count);
} // 從後端獲取購物車數量


function getCartCount() {
  $.ajax({
    url: '/cart/count',
    type: 'GET',
    dataType: 'json',
    success: function success(data) {
      var cartCount = data.cartCount;
      updateCartIconCount(cartCount);
    },
    error: function error(_error) {
      console.error('Error fetching cart count:', _error);
    }
  });
} // 加入商品到購物車


$('.addtocart').on('click', function (e) {
  addToCart();
  getCartCount();
}); // 加入商品到購物車

function addToCart() {
  $.ajax({
    url: '/cart/add',
    type: 'POST',
    data: {},
    dataType: 'json',
    success: function success(data) {
      getCartCount();
    },
    error: function error(_error2) {
      console.error('Error adding to cart:', _error2);
    }
  });
} // 初始化時獲取購物車數量


getCartCount(); //------

$(document).ready(function () {
  // 檢查使用者登入狀態的 AJAX 請求
  $.ajax({
    type: 'GET',
    url: '/user/checkLogin',
    dataType: 'json',
    success: function success(data) {
      if (data.loggedIn) {
        // 使用者已登入，隱藏登入按鈕
        $('.signin').hide();
      } else {
        // 使用者尚未登入，隱藏登出按鈕
        $('.dropdown .signout').hide();
      }
    },
    error: function error(err) {
      console.error('無法檢查使用者登入狀態:', err);
    }
  });
});