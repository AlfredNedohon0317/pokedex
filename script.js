const API_URL = 'https://pokeapi.co/api/v2/pokemon';
const MAX_PAGES = 10;

let currentPage = 1;
const inputBar = document.querySelector("#inputBar");
const pokemonHeight = document.querySelector("#pokemonHeight");
const pokemonWeight = document.querySelector("#pokemonWeight");
const searchButton = document.querySelector("#searchButton");





searchButton.addEventListener('click', () => { console.log(`click`)
    const selectedPokemon = inputBar.value.trim().toLowerCase();
    if (selectedPokemon) {
        searchPokemon(selectedPokemon);
    }
});



document.getElementById("prevPage").addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        fetchAndDisplayPokemonData(currentPage);
        updatePaginationButtons();
    }
});


document.getElementById("nextPage").addEventListener('click', () => {
    if (currentPage < MAX_PAGES) {
        currentPage++;
        fetchAndDisplayPokemonData(currentPage);
        updatePaginationButtons();
    }
});

document.querySelectorAll('#typeFilter input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', () => {
        filterPokemon();
    });
});






async function fetchAndDisplayPokemonData(page) {
    try {
        const response = await axios.get(`${API_URL}?offset=${(page - 1) * 20}&limit=20`);
        const data = response.data.results;
        displayPokemonData(data);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

async function searchPokemon(query) {
    try {
        const response = await axios.get(`${API_URL}/${query}`)
        console.log(response.data);
        inputBarDisplayPokemon(response.data);
    } catch (error) {
        console.error("Error fetching Pokemon:", error);
        return null;
    }
}



function displayPokemonData(data) {
  
    clearPokemonList();

    
    data.forEach(async (pokemon) => {
        try {
            const response = await axios.get(pokemon.url);
            const pokemonData = response.data;
            if (matchesSelectedTypes(pokemonData)) {
         
                const pokemonItem = createPokemonElement(pokemonData);
               
                appendPokemonToList(pokemonItem);
            }
        } catch (error) {
            console.error("Error fetching Pokemon data:", error);
        }
    });
}

function inputBarDisplayPokemon(data){
    clearPokemonList();
    const pokemonItem = createPokemonElement(data);
               
    appendPokemonToList(pokemonItem);
}



function matchesSelectedTypes(pokemonData) {
    const selectedTypes = getSelectedTypes();
    if (selectedTypes.length === 0) {
        return true; 
    }
    return pokemonData.types.some(type => selectedTypes.includes(type.type.name.toLowerCase()));
}

function getSelectedTypes() {
    const selectedTypes = [];
    document.querySelectorAll('#typeFilter input[type="checkbox"]:checked').forEach(checkbox => {
        selectedTypes.push(checkbox.id.replace('filter', '').toLowerCase());
    });
    return selectedTypes;
}

function clearPokemonList() {
    const pokemonList = document.querySelector("#pokemonList");
    pokemonList.innerHTML = "";
}

function createPokemonElement(pokemonData) {
    const pokemonItem = document.createElement("div");
    pokemonItem.classList.add("pokemon");

    const pokemonName = document.createElement("h3");
    pokemonName.textContent = pokemonData.name;

    const pokemonImage = document.createElement("img");
    pokemonImage.src = pokemonData.sprites.front_default;

    const pokemonTypes = document.createElement("ul");
    pokemonData.types.forEach((type) => {
        const typeItem = document.createElement("li");
        typeItem.textContent = type.type.name;
        pokemonTypes.appendChild(typeItem);
    });

    const pokemonAbilities = document.createElement("ul");
    pokemonData.abilities.forEach((ability) => {
        const abilityItem = document.createElement("li");
        abilityItem.textContent = ability.ability.name;
        pokemonAbilities.appendChild(abilityItem);
    });

    const pokemonStats = document.createElement("ul");
    pokemonData.stats.forEach((stat) => {
        const statItem = document.createElement("li");
        statItem.textContent = `${stat.stat.name}: ${stat.base_stat}`;
        pokemonStats.appendChild(statItem);
    });

    
    pokemonItem.appendChild(pokemonName);
    pokemonItem.appendChild(pokemonImage);
    pokemonItem.appendChild(pokemonTypes);
    pokemonItem.appendChild(pokemonAbilities);
    pokemonItem.appendChild(pokemonStats);

    return pokemonItem;
}

function appendPokemonToList(pokemonItem) {
    const pokemonList = document.querySelector("#pokemonList");
    pokemonList.appendChild(pokemonItem);
}

function updatePaginationButtons() {
    const prevPageButton = document.getElementById("prevPage");
    const nextPageButton = document.getElementById("nextPage");

    prevPageButton.disabled = currentPage === 1;
    nextPageButton.disabled = currentPage === MAX_PAGES;
}

function filterPokemon() {
    const selectedTypes = getSelectedTypes();
    fetchAndDisplayPokemonData(currentPage);
}





