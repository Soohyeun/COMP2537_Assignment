//Check user in
// async function checkUser() {
//     await $.ajax({
//         type: "GET",
//         url: "http://localhost:5002/checkuser",
//         success: function (data) {
//             console.log(data)
//             if (data) {

//             } else {
//                 window.open('/login', 'Login', 'width=300, height=400, left=400, top=200;')
//             }
//         }
//     })
// }


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
                    <button class="btn btn-outline-success downButtons" id="${data[i].itemname}"> ↓ </button>
                    ${data[i].quantity}
                    <button class="btn btn-outline-success upButtons" id="${data[i].itemname}"> ↑ </button>
                </td>
                <td>${data[i].itemhp}</td>
                <td>${data[i].quantity * data[i].itemhp}</td>
                <td><button class="btn btn-outline-danger deleteButtons" value="${data[i].itemname}"> X</button></td>
            </tr>`
            }

            cartTable += `<tr>
            <td class="item_info" colspan="2">Total</td><td>${totalQTT}
            </td><td> - </td><td>${totalHP}</td><td>- </td></tr>`;

            $('table').html(cartTable)
        }
    })
}

async function increaseHits() {
    x = this.id;
    await $.ajax({
        url: `http://localhost:5002/timeline/increaseHits/${x}`,
        type: "get",
        success: function (x) {
            console.log(x)
        }
    })

    loadEventsToMainDiv()
}

async function deleteData() {
    y = this.value;
    console.log(y)
    await $.ajax({
        url: `http://localhost:5002/timeline/delete/${y}`,
        type: "get",
        success: function (y) {
            console.log(y)
        }
    })

    loadEventsToMainDiv()
}




function setup() {
    // checkUser();
    loadUsersCart()
    // $("body").on("click", ".upButtons", increaseQuantity)
    // $("body").on("click", ".downButtons", decreaseQuantity)
    // $("body").on("click", "#checkOutBtn", checkout)
}

$(document).ready(setup)