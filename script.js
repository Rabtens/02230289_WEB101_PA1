// I initialize a variable to keep track of how many Pokémon are currently loaded.
let currentLoaded = 100;
// I set a constant for the maximum number of Pokémon available.
const maxPokemons = 898;
// I store sets of seen and caught Pokémon, retrieving initial values from local storage if available.
const seenPokemons = new Set(JSON.parse(localStorage.getItem('seenPokemons') || '[]'));
const caughtPokemons = new Set(JSON.parse(localStorage.getItem('caughtPokemons') || '[]'));
// I use a set to keep track of all Pokémon ids for filtering purposes.
const allPokemons = new Set(); 

// This function constructs the URL to fetch a specific Pokémon's data using its id.
const getPokemonUrl = id => `https://pokeapi.co/api/v2/pokemon/${id}`;
// This function generates promises to fetch Pokémon data starting from a certain id for a count of Pokémon.
const generatePokemonPromises = (start, count) => Array.from({length: count}, (_, index) => fetch(getPokemonUrl(start + index + 1)).then(response => response.json()));

// This function inserts Pokémon data into the DOM.
function insertPokemons(pokemons) {
    const ul = document.querySelector('[data-js="pokedex"]');
    pokemons.forEach(pokemon => {
        allPokemons.add(pokemon.id.toString()); 
        const elementTypes = pokemon.types.map(typeInfo => typeInfo.type.name);
        const seen = seenPokemons.has(pokemon.id.toString());
        const caught = caughtPokemons.has(pokemon.id.toString());
        ul.innerHTML += `
            <li class="card ${elementTypes[0]} ${seen ? 'seen' : ''} ${caught ? 'caught' : ''}" onclick="pokeShow(${pokemon.id})">
                <img class="card-image" alt="${pokemon.name}" src="${pokemon.sprites.front_default}"/>
                <h2 class="card-title">${pokemon.id}. ${pokemon.name}</h2>
                <p class="card-subtitle">${elementTypes.join(' & ')}</p>
            </li>`;
    });
}

// When the document is fully loaded, I fetch and display an initial set of Pokémon.
document.addEventListener("DOMContentLoaded", () => {
    const pokemonPromises = generatePokemonPromises(0, currentLoaded);
    Promise.all(pokemonPromises)
        .then(insertPokemons);
});

// This function searches for Pokémon based on the name typed into the search input.
function search() {
    const pokeName = document.querySelector('.search').value.toLowerCase();
    fetchPokemonData(pokeName);
}

// This function fetches and displays a single Pokémon's data or alerts the user if the Pokémon is not found.
function fetchPokemonData(pokeName) {
    fetch(getPokemonUrl(pokeName))
        .then(response => response.json())
        .then(pokemon => {
            const ul = document.querySelector('[data-js="pokedex"]');
            ul.innerHTML = '';
            insertPokemons([pokemon]);
            updateSeenPokemons(pokemon.id.toString());
        })
        .catch(error => {
            console.error('Error:', error);
            alert("Pokémon not found!");
        });
}

// This function updates the list of seen Pokémon in local storage.
function updateSeenPokemons(pokemonId) {
    seenPokemons.add(pokemonId);
    localStorage.setItem('seenPokemons', JSON.stringify([...seenPokemons]));
}

// This function updates the list of caught Pokémon in local storage.
function updateCaughtPokemons(pokemonId) {
    caughtPokemons.add(pokemonId);
    localStorage.setItem('caughtPokemons', JSON.stringify([...caughtPokemons]));
}

// This function is called when a Pokémon card is clicked, displaying detailed Pokémon information.
function pokeShow(id) {
    fetch(getPokemonUrl(id))
        .then(response => response.json())
        .then(pokemon => {
            updateCaughtPokemons(pokemon.id.toString());
            const page = document.querySelector('main');
            const types = pokemon.types.map(type => type.type.name).join(', ');
            const abilities = pokemon.abilities.map(ability => ability.ability.name).join(', ');

            // Fetch additional species data
            fetch(pokemon.species.url)
                .then(response => response.json())
                .then(speciesData => {
                    const speciesName = speciesData.genera.find(genus => genus.language.name === "en").genus;

                    page.innerHTML = `
                        <div class="pokemon-details">
                            <div class="pokemon-header">
                                <h1>${pokemon.name}</h1>
                                <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
                            </div>
                            <div class="pokemon-info-tabs">
                                <button onclick="showTab('about', ${pokemon.id})">About</button>
                                <button onclick="showTab('stats', ${pokemon.id})">Stats</button>
                                <button onclick="showTab('moves', ${pokemon.id})">Moves</button>
                            </div>
                            <div id="pokemon-info-content">
                                <div id="about">
                                    <h3>About</h3>
                                    <p>Height: ${pokemon.height}</p>
                                    <p>Weight: ${pokemon.weight}</p>
                                    <p>Type: ${types}</p>
                                    <p>Abilities: ${abilities}</p>
                                    <p>Species: ${speciesName}</p>
                                </div>
                                <div id="stats" style="display:none;">
                                    <h3>Stats</h3>
                                    ${pokemon.stats.map(stat => `<p>${stat.stat.name}: ${stat.base_stat}</p>`).join('')}
                                </div>
                                <div id="moves" style="display:none;">
                                    <h3>Moves</h3>
                                    <ul>
                                        ${pokemon.moves.map(move => `<li>${move.move.name}</li>`).join('')}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    `;
                });
        });
}

// This function controls which tab of Pokémon details to display.
function showTab(tabName, id) {
    const tabs = document.querySelectorAll('#pokemon-info-content > div');
    tabs.forEach(tab => {
        if (tab.id === tabName) {
            tab.style.display = 'block';
        } else {
            tab.style.display = 'none';
        }
    });
}

// This function reloads the page to return to the main view.
function backHome() {
    window.location.reload();
}

// This function scrolls the page back to the top.
function backTop() {
    document.documentElement.scrollTop = 0;
}

// This event listener triggers loading more Pokémon when scrolling near the bottom of the page.
window.addEventListener('scroll', () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 5 && currentLoaded < maxPokemons) {
        showLoading();
    }
});

// This function handles the loading indicator and fetching additional Pokémon as the user scrolls.
function showLoading() {
    const loading = document.getElementById('pokeball-loading');
    loading.style.display = 'block';
    let increment = 20;
    let nextToLoad = currentLoaded + increment > maxPokemons ? maxPokemons - currentLoaded : increment;
    const pokemonPromises = generatePokemonPromises(currentLoaded, nextToLoad);
    Promise.all(pokemonPromises)
        .then(pokemons => {
            insertPokemons(pokemons);
            currentLoaded += nextToLoad;
            loading.style.display = 'none';
        });
}

// This function triggers a search for a Pokémon based on an uploaded image file name.
function searchByImage() {
    const fileInput = document.getElementById('imageUpload');
    if (fileInput.files.length > 0) {
        const fileName = fileInput.files[0].name;
        const pokemonName = fileName.split('.')[0]; 
        fetchPokemonData(pokemonName.toLowerCase());
    } else {
        alert("Please upload an image file.");
    }
}

// This function filters and displays Pokémon based on their seen, caught, or not seen status.
function displayByStatus(status) {
    const ul = document.querySelector('[data-js="pokedex"]');
    ul.innerHTML = ''; 
    allPokemons.forEach(pokemonId => {
        const isSeen = seenPokemons.has(pokemonId);
        const isCaught = caughtPokemons.has(pokemonId);
        const isNotSeen = !isSeen && !isCaught;

        if ((status === 'seen' && isSeen) || (status === 'caught' && isCaught) || (status === 'notSeen' && isNotSeen)) {
            fetch(getPokemonUrl(pokemonId))
                .then(response => response.json())
                .then(pokemon => insertPokemons([pokemon]));
        }
    });
}
