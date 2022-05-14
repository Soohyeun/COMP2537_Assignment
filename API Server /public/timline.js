function loadEventsToMainDiv() {
    $('main').empty()
    $.ajax({
        url: "http://localhost:5002/timeline/getAllEvents",
        type: "get",
        success: (r)=>{
            console.log(r)

            for(i=0; i<r.length; i++){
                $('main').append(`<div class="timelinerecords">
                <p> Event Text: ${r[i].text}</p>
                <p> Event Time: ${r[i].time}</p>
                <p> Event hits: ${r[i].hits}</p>
                <button class="btn btn-secondary likeButtons" id="${r[i]["_id"]}"> Like 👍 </button>
                <button class="btn btn-secondary deleteButtons" value="${r[i]["_id"]}"> Delete</button>
                </div>`)
            }
        }
    })
}

function increaseHits() {
    x = this.id;
    $.ajax({
        url: `http://localhost:5002/timeline/increaseHits/${x}`,
        type: "get",
        success: function(x){
            console.log(x)
        }
    })

    loadEventsToMainDiv()
}

function deleteData() {
    y = this.value;
    console.log(y)
    $.ajax({
        url: `http://localhost:5002/timeline/delete/${y}`,
        type: "get",
        success: function(y){
            console.log(y)
        }
    })

    loadEventsToMainDiv()
}




function setup(){
    loadEventsToMainDiv();
    $("body").on("click", ".likeButtons", increaseHits)
    $("body").on("click", ".deleteButtons", deleteData)
}

$(document).ready(setup)