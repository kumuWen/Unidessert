$(function () {
    $(".add_to_cart_button").on('click', function (e) {
        let target_id = e.target.id.substr(18)

        let p_name = document.getElementById(`p_name${target_id}`).innerHTML

        let p_price = parseInt(document.getElementById(`product_price${target_id}`).innerHTML.substring(3))

        let quantity = 1
        let order_total = p_price * quantity
        console.log(order_total)
        // e.preventDefault();
        let p_type = "single"
        let data = {
            "pid": target_id,
            "quantity": quantity,
            "p_name": p_name,
            "p_price": p_price,
            "order_total": order_total,
            "p_type": p_type
        }
        $.post({
            url: "http://localhost:5678/product/single",
            method: "post",
            contentType: "application/json",
            data: JSON.stringify(data),
            cache: false,
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