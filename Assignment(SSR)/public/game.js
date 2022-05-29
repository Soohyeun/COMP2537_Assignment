let hasFlippedCard = 0;
let firstCard;
let secondCard;
let count = 0;
var outcome = '';

let pokeNum = 0;
var row = 0;
var column = 0;

// Check user in
async function checkUser() {
    await $.ajax({
        type: "GET",
        url: "http://localhost:5002/checkuser",
        success: function (data) {
            console.log(data)
            if (!data) {
                window.open('/login', 'Login', 'width=300, height=400, left=400, top=200;')
                location.assign('/')
            }
        }
    })
}

async function load_history() {
    $("#game_grid").empty()
    $("#result").empty()
    await $.ajax({
        url: "http://localhost:5002/loadGameResult",
        type: "get",
        success: (res) => {
            console.log(res)
            for(i=0; i<res.length; i++) {
                $("#result").append(`<div>Time: ${res[i].time}</div><div>${res[i].result}</div>`)
            }
        }
    })
}

function makeGrid() {
    $("#game_grid").empty()
    $("#result").empty()
    
    // Make a list contains correct number of pokemon id
    let pokemonList = [];
    let i = 1;
    let j = 1;
    while (i <= row * column / 2) {
        pokemonList.push(j * 4)
        pokemonList.push(j * 4)
        i++;
        if (j == pokeNum) {
            j = 1;
        } else {
            j++;
        }
    }

    // shuffle list
    var newList = [];
    while (newList.length < row * column) {
        var movenum = pokemonList.splice(Math.floor(Math.random() * pokemonList.length), 1)[0]
        newList.push(movenum)
    }

    // Append pokemon cards on screen
    newList.forEach((pokeID) => $("#game_grid").append(`<div class="card">
            <img class="front_card"
                src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokeID}.png">
            <img class="back_card" src="https://cdn.discordapp.com/attachments/979077554000527500/979146971736596490/unknown.png">
        </div>`))

    $(".card").css("width", `calc(${100/column}% - 10px)`)
}

function startGame() {
    count = 0;
    hasFlippedCard = 0;
    row = $('#row').val();
    column = $('#column').val();
    pokeNum = $('#pokeNumber').val();

    if (2 <= row && row <= 4 && 2 <= column && column <= 4 && 2 <= pokeNum && pokeNum <= 4) {
        if (pokeNum <= (row * column / 2)) {
            if ((row * column) % 2 == 0) {
                makeGrid();
            } else {
                alert("Row * Column must be even number.")
            }
        } else {
            alert(`Pokemon number must be less than ${row * column / 2}`);
        }
    } else {
        alert("Please enter the number between 2 and 4.");
    }

    //set timer
    var time = 49;
    var timer = setInterval(function () {
        $('#timer').html(time);
        time--;

        if (time < 0) {
            clearInterval(timer);
            DecideOutcome();
        }
    }, 1000)
}

async function DecideOutcome() {
    if (count == row * column / 2) {
        outcome = 'win';
    } else {
        outcome = 'lose';
    }

    var now = new Date(Date.now());

    await $.ajax({
        url: "http://localhost:5002/saveGameResult",
        type: "put",
        data: {
            result: outcome,
            time: now
        },
        success: (res) => {
            console.log(res)
            alert(`You ${outcome}`);
            location.reload();
        }
    })
}

function matchCards() {
    firstCard.css("pointer-events", "none");
    secondCard.css("pointer-events", "none");

    count++;
    if (count == row * column / 2) {
        DecideOutcome();
    }
    hasFlippedCard = 0;

}

function unmatchCard() {
    setTimeout(function () {
        firstCard.toggleClass("flip");
        secondCard.toggleClass("flip");
        firstCard.css("pointer-events", "auto");
        secondCard.css("pointer-events", "auto");
        hasFlippedCard = 0;
    }, 500);
}

function saveCardInfo() {
    if (hasFlippedCard == 0) {
        hasFlippedCard = 1;

        $(this).toggleClass("flip");
        firstCard = $(this);
        // console.log(firstCard.find(".front_card")[0].src)
        firstCard.css("pointer-events", "none");

    } else if (hasFlippedCard == 1) {
        hasFlippedCard = 2;

        $(this).toggleClass("flip");
        secondCard = $(this);
        secondCard.css("pointer-events", "none");

        // check two cards
        if (firstCard.find(".front_card")[0].src == secondCard.find(".front_card")[0].src) {
            matchCards();
        } else {
            unmatchCard();
        }
    }
}

function setup() {
    checkUser()
    $("body").on("click", ".card", saveCardInfo)
}

$(document).ready(setup)