const back_colors = {
    fire: '#FDDFDF',
    grass: '#DEFDE0',
    electric: '#FCF7DE',
    water: '#DEF3FD',
    ground: '#f4e7da',
    rock: '#d5d5d4',
    fairy: '#fceaff',
    poison: '#98d7a5',
    bug: '#f8d5a3',
    dragon: '#97b3e6',
    psychic: '#eceda1',
    flying: '#F5F5F5',
    fighting: '#E6E0D4',
    normal: '#F5F5F5',
    dark: '#A9A9A9',
    ghost: '#DCDCDC',
    ice: '#F5FFFA',
    steel: '#708090'
}

// dropdown menu
function myFunction_t() {
    document.getElementById("TypeDropdown").classList.toggle("show_t");
}

function myFunction_c() {
    document.getElementById("ColourDropdown").classList.toggle("show_c");
}

function myFunction_n() {
    document.getElementById("NameHistory").classList.toggle("show_n");
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function (event) {
    if (!event.target.matches('#dropbtnType')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show_t')) {
                openDropdown.classList.remove('show_t');
            }
        }
    }
    if (!event.target.matches('#dropbtnColour')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show_c')) {
                openDropdown.classList.remove('show_c');
            }
        }
    }
    if (!event.target.matches('#input_name')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show_n')) {
                openDropdown.classList.remove('show_n');
            }
        }
    }
}


//Check user in
async function checkUser() {
    await $.ajax({
        type: "GET",
        url: "http://localhost:5002/checkuser",
        success: function(data){
            console.log(data)
            if(data){
                $("#login").html(`<button onclick="logoutRecord()" class="dropbtn"> Logout </button>`)
                if (data.usertype == 'admin') {
                    $('#goAdmin').css('display','inline')
                }
            }else {
                $("#login").html(`<button onclick="window.open('/login', 'Login', 'width=300, height=400, left=400, top=200;')" class="dropbtn"> Login </button>`)
            }
        }
    })
}


//logout
async function logout() {
    await $.ajax({
        type: "GET",
        url: "http://localhost:5002/logout",
        success: function(data){
            if(data.result == "Succeeded"){
                $("#login").html(`<button onclick="window.open('/login', 'profilePopUp', 'width=300, height=400, left=400, top=200;')" class="dropbtn"> Login </button>`)
                location.reload()
            }else {
                alert("Logout Failed")
            }
        }
    })

}




poke_img = '';

// check profile
function goProfile(dataID) {
    window.open(`/profile/${dataID}`, "profilePopUp", "width=500, height=700, left=300, top=300;");
}




// index.html, random 9 pokemon
function processPokeResp(data) {
    // console.log(data)
    let thisType = data.types[0].type.name;
    // console.log(thisType)
    poke_img += `<div class="pokemon_container" style="background-color: ${back_colors[thisType]}">
    <button onclick = "goProfile(${data.id})" type="submit"><img src="${data.sprites.other["official-artwork"].front_default}"></button>
    <h4>${data.name}</h4>
    </div>`
}

async function popPokemon() {
    for (k = 1; k <= 3; k++) {
        poke_img += '<div class="pokemon_group">'
        for (j = 1; j <= 3; j++) {
            let random_number = Math.floor(Math.random() * 800) + 1
            // console.log(random_number)

            await $.ajax({
                type: "GET",
                url: `https://pokeapi.co/api/v2/pokemon/${random_number}/`,
                success: processPokeResp
            })
        }
        poke_img += '</div>'
    }

    $('main').html(poke_img)
}




//history
let num = 1;

function clickHistory(src) {
    $('#input_name').val(src.value);
    searchByName()
}

function deleteThis(src) {
    let key = src.id
    localStorage.removeItem(`${key}`);
    writeHistory();
}

function writeHistory() {
    console.log(localStorage)
    let historyList = '';
    for (key in localStorage) {
        if (isNaN(key) == false) {
            historyList += `<div class="historydrop"><input type="button" onclick="clickHistory(this)" value=${localStorage[key]}><input type="button" value="X" id ="${key}" onclick="deleteThis(this)"></div>`
        }
    }
    historyList += '<button onclick="deleteAllHistory()">Delete all</button>';

    $("#NameHistory").html(historyList);
}

function saveHistory(pokeName) {
    localStorage.setItem(`${num}`, pokeName);
    num++;

    writeHistory();
}

function deleteAllHistory() {
    localStorage.clear();
    num = 1;
    writeHistory();
}


//timeline
async function logoutRecord() {
    var realtime = new Date(Date.now());

    await $.ajax({
        url: "http://localhost:5002/timeline/logoutrecord",
        type: "put",
        data: {
            text: 'has logged out.',
            hits: 1,
            time: realtime
        },
        success: (res) => {
            console.log(res)
        }
    })

    logout()
}

function addNewEvent(pokeType, criteria) {
    var now = new Date(Date.now());

    $.ajax({
        url: "http://localhost:5002/timeline/insert",
        type: "put",
        data: {
            text: ` has searched '${criteria}' for ${pokeType}`,
            hits: 1,
            time: now
        },
        success: (res) => {
            console.log(res)
        }
    })
}


//search
let pokeList = [];
let pokeInfos = '';
let page_id = 1;

function displayPoke(data) {
    let poketype = data.types[0].type.name;

    pokeInfos += `<div class="pokemon_container" style="background-color: ${back_colors[poketype]}">
    <button onclick = "goProfile(${data.id})" type="submit"><img src="${data.sprites.other["official-artwork"].front_default}"></button>
    <h4>${data.name}</h4>
</div>`
}

async function findPokeInfo() {
    pokeInfos = ''

    console.log(pokeList)

    for (i = 0; i < 3; i++) {
        pokeInfos += '<div class="pokemon_group">'

        let order = (page_id - 1) * 9 + (i * 3);
        for (j = order;
            (j < order + 3) && (j < pokeList.length); j++) {
            await $.ajax({
                url: `https://pokeapi.co/api/v2/pokemon/${pokeList[j]}`,
                type: "GET",
                success: displayPoke
            })
        }

        pokeInfos += '</div>'
    }

    $('main').html(pokeInfos);
}

function paginationType(data) {
    pokeList = data.pokemon.map((obj) => {
        return obj.pokemon.name
    })

    if (pokeList.length > 9) {

        pageNumber = Math.ceil(pokeList.length / 9)

        for (var i = 1; i <= pageNumber; i++) {
            $('#pagination').append(`<span style="padding:0 2px"><button type="button" id='${i}' class = 'page_num_btn btn btn-outline-secondary'>${i}</button></span>`)
        }
    }

    findPokeInfo()
}

function searchByType(src) {
    page_id = 1
    $('#pagination').empty()
    $("#contents").empty()
    pokeType = src.value;
    console.log(pokeType)

    addNewEvent(pokeType, "type")

    $.ajax({
        url: `https://pokeapi.co/api/v2/type/${pokeType}`,
        type: "GET",
        success: paginationType
    })

}

function paginationColour(data) {
    pokeList = data.pokemon_species.map((obj) => {
        return obj.name
    })

    if (pokeList.length > 9) {

        pageNumber = Math.ceil(pokeList.length / 9)

        for (var i = 1; i <= pageNumber; i++) {
            $('#pagination').append(`<span style="padding:0 2px"><button type="button" id='${i}' class = 'page_num_btn btn btn-outline-secondary'>${i}</button></span>`)
        }
    }

    findPokeInfo()
}

function searchByColour(src) {
    page_id = 1
    $('#pagination').empty()
    $("#contents").empty()
    pokeColour = src.value;
    console.log(pokeColour)

    addNewEvent(pokeColour, "colour")

    $.ajax({
        url: `https://pokeapi.co/api/v2/pokemon-color/${pokeColour}`,
        type: "GET",
        success: paginationColour
    })

}

async function searchByName() {
    page_id = 1
    $('#pagination').empty()
    $("#contents").empty()
    pokeName = $('#input_name').val();
    console.log(pokeName)

    addNewEvent(pokeName, "name")

    pokeInfos = ''

    pokeInfos += '<div class="pokemon_group">'

    await $.ajax({
        url: `https://pokeapi.co/api/v2/pokemon/${pokeName}`,
        type: "GET",
        success: displayPoke,
        error: function (pokeName) {
            alert(`Nonexistent pokemon. Please enter again.`)
        },
    })

    pokeInfos += '</div>'

    $('main').html(pokeInfos);

    saveHistory(pokeName)
}

function change_page() {
    page_id = $(this).attr("id");
    findPokeInfo()
}

function setup() {
    checkUser()
    popPokemon()
    writeHistory()
    $("body").on("click", ".page_num_btn", change_page)

}

$(document).ready(setup)