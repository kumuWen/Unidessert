function selectTab(tabIndex) {
    //Hide All Tabs
    document.getElementById("tab1Content").style.display = "none";
    document.getElementById("tab2Content").style.display = "none";
    //Show the Selected Tab
    document.getElementById("tab" + tabIndex + "Content").style.display = "block";
}
function selectTabStyle(tabIndex) {
    document.getElementById("tab1").style.borderBottom = "none";
    document.getElementById("tab2").style.borderBottom = "none";
    document.getElementById("tab" + tabIndex).style.borderBottom = "5px solid #b44a60";
}
function changeImg(i) {
    var side_pic = document.getElementById('sidePic' + i);
    var attrSrc = side_pic.getAttribute('src');
    document.getElementById('mainPic').setAttribute('src', attrSrc);

}
function plus() {
    // var product_quantity = 1;
    let product_quantity = parseInt(document.getElementById('productCount').innerHTML);
    var sum = product_quantity + 1
    document.getElementById('productCount').innerHTML = sum;
    document.getElementById('productCount_input').value = sum
}
function minus() {
    let product_quantity = parseInt(document.getElementById('productCount').innerHTML);
    let sum;
    if (product_quantity === 1) {
        sum = 1;
    } else {
        sum = product_quantity - 1;
    }
    document.getElementById('productCount').innerHTML = sum;
    document.getElementById('productCount_input').value = sum
}
$(document).ready(function () {
    let count = 1
    document.getElementById('productCount').innerHTML = count
    document.getElementById('productCount_input').value = count
    let product_Title = document.getElementById('p_title').innerText
    let productPrice = parseInt(document.getElementById('p_price').innerHTML.substring(4))
    
    $("#addtocart").on('click', function(e) {
        e.preventDefault();
        let quantity = document.getElementById('productCount_input').value
        let total_price = document.getElementById('productCount_input').value * productPrice
        let data = {
                "uid": "1",
                "deliever_fee": "150",
                "product_Title": product_Title,
                "quantity": quantity,
                "productPrice": productPrice,
                "order_total": total_price,
                "status": "購物車"
            }
        $.ajax({
            url: "http://localhost:5678/product/productInfo",
            method: "post",
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function(res) {
                if(res.status === 1 ) {
                    alert('請先登入後再進行此操作')
                    location.href='/user';
                }
            },
            error: function(res) {
                console.log('fail')
            } 
            
        })
    })
})

