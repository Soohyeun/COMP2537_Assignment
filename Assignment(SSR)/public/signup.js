async function signup() {
    $("#invalidMessage").empty();
    var newEmail = $("#emailInput").val();
    var newName = $("#nameInput").val();
    var newPassword = $("#passwordInput").val();
    var confirmPassword = $("#passwordConfirm").val();

    if (newEmail != '' && newName != '' && newPassword != '') {
        if (newPassword == confirmPassword) {
            await $.ajax({
                url: "http://localhost:5002/api/signup",
                type: "put",
                data: {
                    newName: newName,
                    newPassword: newPassword,
                    newEmail: newEmail
                },
                success: (res) => {
                    if(res){
                    console.log(res)
                    location.assign('/login')
                    }else{
                        $("#invalidMessage").html("Email is already exist. <br>Please use other email.");
                    }
                }
            })
        } else {
            $("#invalidMessage").html("Passwords are not corrected.");
        }
    } else {
        $("#invalidMessage").html("Please fill all blanks");
    }

}