// Check user in
async function checkUser() {
    await $.ajax({
        type: "GET",
        url: "http://localhost:5002/checkuser",
        success: function (data) {
            console.log(data)
            if (data) {
                loadUsersCart()
            } else {
                window.open('/login', 'Login', 'width=300, height=400, left=400, top=200;')
            }
        }
    })
}


//Populate user's cart
function loadUsersCart() {

    $.ajax({
        url: "http://localhost:5002/addcart/getcart",
        type: "get",
        success: (data) => {
            console.log(data)
            let totalQTT = 0;
            let totalHP = 0;
            let cartTable = `<tr><th>Item</th><th>Item Name</th><th>Quantity</th><th>HP (Price)</th><th>Total HP</th>
            <th> Remove </th></tr>`

            for (i = 0; i < data.length; i++) {
                totalQTT += data[i].quantity;
                totalHP += data[i].quantity * data[i].itemhp;

                cartTable += `<tr>
                <td class="item_info">
                        <img src="${data[i].itemimg}" class="item_img">
                </td>
                <td>${data[i].itemname}</td>
                <td>
                    <button class="btn btn-outline-success downButtons" id="${data[i].itemname}" value="${data[i].quantity}"> ↓ </button>
                    ${data[i].quantity}
                    <button class="btn btn-outline-success upButtons" id="${data[i].itemname}"> ↑ </button>
                </td>
                <td>${data[i].itemhp}</td>
                <td>${data[i].quantity * data[i].itemhp}</td>
                <td><button class="btn btn-outline-danger deleteButtons" id="${data[i].itemname}"> X</button></td>
            </tr>`
            }

            cartTable += `<tr>
            <td class="item_info" colspan="2">Total</td><td>${totalQTT}
            </td><td> - </td><td>${totalHP}</td><td>- </td></tr>`;

            $('table').html(cartTable)
        }
    })
}

async function increaseQuantity() {
    var itemName = this.id;
    await $.ajax({
        url: `http://localhost:5002/addcart/increaseQtt/${itemName}`,
        type: "get",
        success: function (x) {
            console.log(x)
        }
    })

    loadUsersCart()
}

async function decreaseQuantity() {
    var itemName = this.id;
    var qtt = this.value;

    if (qtt > 1) {
        await $.ajax({
            url: `http://localhost:5002/addcart/decreaseQtt/${itemName}`,
            type: "get",
            success: function (x) {
                console.log(x)
            }
        })

        loadUsersCart()
    } else {
        alert("Cannot decrease. Please use remove button.")
    }
}

async function deleteitem() {
    var itemName = this.id;

    await $.ajax({
        url: `http://localhost:5002/addcart/delete/${itemName}`,
        type: "get",
        success: function (y) {
            console.log(y)
        }
    })
    loadUsersCart()

}

async function checkout() {
    var now = new Date(Date.now());

    $.ajax({
        url: "http://localhost:5002/addcart/checkout",
        type: "put",
        data: {
            time: now
        },
        success: (res) => {
            console.log(res)
        }
    })

    alert("Order has been successfully placed!")
    // location.assign('/timeline.html')
}




function setup() {
    checkUser();
    $("body").on("click", ".upButtons", increaseQuantity)
    $("body").on("click", ".downButtons", decreaseQuantity)
    $("body").on("click", ".deleteButtons", deleteitem)
}

$(document).ready(setup)