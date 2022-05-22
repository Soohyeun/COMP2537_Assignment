//Check user in
async function checkUser() {
    await $.ajax({
        type: "GET",
        url: "http://localhost:5002/checkuser",
        success: function(data){
            console.log(data)
            if(data){
                window.location.assign('/timeline.html')
            }
        }
    })
}

function afterLogin(data) {
    if (data == 'no user') {
        $("#message").html("No user info. Please check your email.");
    } else if (data == 'incorrect password') {
        $("#message").html("Incorrect password. Please check your password.");
    } else {
        loginRecord()
        window.opener.location.href="http://localhost:5002/timeline.html";
        window.close();
    }
}

async function loginRecord() {
    var now = new Date(Date.now());

    await $.ajax({
        url: "http://localhost:5002/timeline/loginrecord",
        type: "put",
        data: {
            text: 'has logged in.',
            hits: 1,
            time: now
        },
        success: (res) => {
            console.log(res)
        }
    })
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

function setup() {
    checkUser()
}

$(document).ready(setup)