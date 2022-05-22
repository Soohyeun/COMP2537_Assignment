//Check user in
async function checkUser() {
    await $.ajax({
        type: "GET",
        url: "http://localhost:5002/checkuser",
        success: function (data) {
            console.log(data)
            if (data) {
                showProfile(data);
                loadEventsToMainDiv(data);
            } else {
                window.open('/login', 'Login', 'width=300, height=400, left=400, top=200;')
            }
        }
    })
}

function showProfile(data) {
    $("#name").html(data.username)
    $("#email").html(data.useremail)
}

function loadEventsToMainDiv(data) {
    $('#timelineList').empty();

    $.ajax({
        url: "http://localhost:5002/timeline/getAllEvents",
        type: "get",
        success: (r) => {
            console.log(r)

            for (i = 0; i < r.length; i++) {
                let newtime = r[i].time.split("G")[0]

                $('#timelineList').append(`
                <li>
                    <h5> ${r[i].text}</h5>
                    <div class="timelinerecords">
                        <div>
                            <div> ${newtime}</div>
                            <div> ${r[i].hits} likes</div>
                        </div>
                        
                        <div id="timeline_btns">
                            <button class="btn btn-outline-danger deleteButtons" value="${r[i]._id}"> X</button>
                            <button class="btn btn-outline-success likeButtons" id="${r[i]._id}"> 👍 </button>
                        </div>
                    </div>
                </li>`)
            }
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
    checkUser();
    $("body").on("click", ".likeButtons", increaseHits)
    $("body").on("click", ".deleteButtons", deleteData)
}

$(document).ready(setup)