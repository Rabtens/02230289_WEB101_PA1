## Pokedex Web Application

### Description

This Pokedex web application is a digital encyclopedia for Pokémon. It allows users to search, view, and manage information about different Pokémon species. The application integrates with the PokéAPI to fetch Pokémon data, including details like names, images, abilities, and types. Users can mark Pokémon as "seen" or "caught" and filter Pokémon based on these categories.

### Features
Search Functionality: Users can search for Pokémon by name or ID.

Dynamic Pokémon Listing: Displays a list of Pokémon fetched dynamically from PokéAPI.

Detailed Pokémon View: Clicking on a Pokémon card shows detailed information about that Pokémon, such as stats, moves, and species data.

Image Upload Search: Users can upload an image of a Pokémon to initiate a search based on the file name.

Local Storage: Marks for "seen" and "caught" Pokémon are saved in local storage to persist user data between sessions.

Infinite Scroll: Loads more Pokémon as the user scrolls down, enhancing the user experience by not loading all data at once.

Responsive Design: The application is styled using CSS to be visually appealing and responsive across different devices.

### Technologies Used

HTML

CSS

JavaScript

Local Storage

Fetch API (for consuming PokéAPI)

### How to Run

Clone the repository:

Copy code

git clone https://github.com/your-username/your-repository.git

Navigate to the project directory:

Copy code

cd your-repository

Open the HTML file in a web browser:

Copy code

open index.html

or simply drag and drop the index.html file into your browser.

### Project Structure

index.html: The entry point of the application containing the structural layout.

styles/: Folder containing CSS files for styling the application.

Homepage.css: Styles specific to the home page.

PokemonPage.css: Styles specific to the Pokémon detail pages.

script.js: Contains all the JavaScript logic for API requests, DOM manipulation, and local storage management.

Feel free to submit issues or pull requests if you have improvements or bug fixes. For major changes, please open an issue first to discuss what you would like to change.
