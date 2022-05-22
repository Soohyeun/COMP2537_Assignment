function afterLogin(data) {
    if (data == 'no user') {
        $("#message").html("No user info. Please check your email.");
    } else if (data == 'incorrect password') {
        $("#message").html("Incorrect password. Please check your password.");
    } else {
        opener.location.reload();
        window.close();
    }
}

async function login() {

    await $.ajax({
        url: "http://localhost:5002/api/login",
        type: "POST",
        data: {
            "useremail": $('#email').val(),
            "userpw": $('#password').val()
        },
        success: afterLogin
    })


}

function setup() {}

$(document).ready(setup)