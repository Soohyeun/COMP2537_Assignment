// dropdown menu
function myFunction_t() {
    document.getElementById("TypeDropdown").classList.toggle("show_t");
}

function myFunction_c() {
    document.getElementById("ColourDropdown").classList.toggle("show_c");
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
}


poke_img = ''

// check profile
function goProfile(dataID) {
    window.open(`/profile/${dataID}`, "profilePopUp", "width=500, height=700, left=300, top=300;");
}


// index, random 9 pokemon
function processPokeResp(data) {
    console.log(data)
    poke_img += `<div class="pokemon_container">
    <button onclick = "goProfile(${data.id})" type="submit"><img src="${data.sprites.other["official-artwork"].front_default}"></button>
    <h4>${data.name}</h4>
    </div>`
}

async function popPokemon() {
    for (i = 1; i <= 3; i++) {
        poke_img += '<div class="pokemon_group">'
        for (j = 1; j <= 3; j++) {
            let random_number = Math.floor(Math.random() * 800) + 1
            console.log(random_number)

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

//search
let pokeList = [];
let pokeInfos = '';
let page_id = 1;

function displayPoke(data) {
    pokeInfos += `<div class="pokemon_container">
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
    $('#pagination').empty()
    $("#contents").empty()
    // pokeType = $('#poke_type option:selected').val();
    pokeType = src.value;
    console.log(pokeType)

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
    $('#pagination').empty()
    $("#contents").empty()
    pokeColour = src.value;
    console.log(pokeColour)

    $.ajax({
        url: `https://pokeapi.co/api/v2/pokemon-color/${pokeColour}`,
        type: "GET",
        success: paginationColour
    })

}

async function searchByName() {
    $('#pagination').empty()
    $("#contents").empty()
    pokeName = $('#input_name').val();
    console.log(pokeName)
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

}

function change_page() {
    page_id = $(this).attr("id");
    findPokeInfo()
}

function setup() {
    popPokemon()
    $("body").on("click", ".page_num_btn", change_page)

}

$(document).ready(setup)