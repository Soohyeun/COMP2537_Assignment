var thisUser = '';
// Check user in / admin
async function checkUser() {
    await $.ajax({
        type: "GET",
        url: "http://localhost:5002/checkuser",
        success: function (data) {
            if (data) {
                if (data.usertype == 'admin') {
                    thisUser = data.useremail;
                    console.log(thisUser)
                    loadUsers();
                    loadAdmins();
                } else {
                    document.location = '/';
                    alert("You are not admin");
                }
            } else {
                window.open('/login', 'Login', 'width=300, height=400, left=400, top=200;');
                document.location = '/';
            }
        }
    })
}

//Populate admin info
function loadAdmins() {
    $("#adminList").empty();
    $.ajax({
        url: "http://localhost:5002/adminsinfo",
        type: "get",
        success: (data) => {
            console.log(data)
            data.forEach((admin) => {
                $("#adminList").append(`<div class="admin">
                <div>
                    Name: ${admin.username}
                </div>
                <div>
                    ID: ${admin.useremail}
                </div>
                <button value="${admin.useremail}" onclick="removeUser(this)">Remove</button>
            </div>`)
            });
        }
    })
}

//Populate user info
function loadUsers() {
    $("#userList").empty();
    $.ajax({
        url: "http://localhost:5002/usersinfo",
        type: "get",
        success: (data) => {
            console.log(data)
            data.forEach((user) => {
                $("#userList").append(`<div class="user">
                <div>
                    Name: ${user.username}
                </div>
                <div>
                    ID: ${user.useremail}
                </div>
                <button value="${user.useremail}" onclick="updateUser(this)">update</button>
                <button value="${user.useremail}" onclick="removeUser(this)">Remove</button>
            </div>`)
            });
        }
    })
}

// Remove user
async function removeUser(src) {
    if (src.value == thisUser) {
        alert("You cannot remove yourself!")
    } else {
        if (confirm("Do you want to delete user?")) {
            await $.ajax({
                url: "http://localhost:5002/deleteUser",
                type: "put",
                data: {
                    userEmail: src.value
                },
                success: (res) => {
                    location.reload();
                }
            })
        }
    }
}

async function updateUser(src) {
    console.log(src.value)
    if (confirm("Do you want to update user?")) {
        await $.ajax({
            url: "http://localhost:5002/updateUser",
            type: "put",
            data: {
                userEmail: src.value
            },
            success: (res) => {
                location.reload();
            }
        })
    }
}

async function signUp() {
    $("#invalidMessage").empty();
    var newEmail = $("#emailInput").val();
    var newName = $("#nameInput").val();
    var newPassword = $("#passwordInput").val();
    var newUserType = $("#userType").val();

    if (newEmail != '' && newName != '' && newPassword != '') {
        await $.ajax({
            url: "http://localhost:5002/signupbyadmin",
            type: "put",
            data: {
                newName: newName,
                newPassword: newPassword,
                newEmail: newEmail,
                newUserType: newUserType
            },
            success: (res) => {
                if (res) {
                    alert('User has added!');
                    location.reload();
                } else {
                    $("#invalidMessage").html("Email is already exist. <br>Please use other email.");
                }
            }
        })
    } else {
        $("#invalidMessage").html("Please fill all blanks");
    }

}

function setup() {
    checkUser()
}

$(document).ready(setup)