let pokeList = [];
let pokeInfos = '';
let page_id = 1;

function displayPoke(data) {
    pokeInfos += `<div class="pokemon_container"> <div>${data.name}</div>
    <a href="/profile/${data.id}"> <img src="${data.sprites.other["official-artwork"].front_default}"></a></div>`
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

    $("#contents").html(pokeInfos);
}

function pagination(data) {
    pokeList = data.pokemon.map((obj) => {
        return obj.pokemon.name
    })

    if (pokeList.length > 9) {

        pageNumber = Math.ceil(pokeList.length / 9)

        for (var i = 1; i <= pageNumber; i++) {
            $('#pagination').append(`<button id='${i}' class = 'page_num_btn'>${i}</button>`)
        }
    }

    findPokeInfo()
}


function searchByType() {
    $('#pagination').empty()
    $("#contents").empty()
    pokeType = $('#poke_type option:selected').val();
    console.log(pokeType)

    $.ajax({
        url: `https://pokeapi.co/api/v2/type/${pokeType}`,
        type: "GET",
        success: pagination
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
        success: displayPoke
    })

    pokeInfos += '</div>'

    $("#contents").html(pokeInfos);

}

function change_page() {
    page_id = $(this).attr("id");
    findPokeInfo()
}

function setup() {
    $('#poke_type').change(searchByType);
    $("body").on("click", ".page_num_btn", change_page)
}

$(document).ready(setup)