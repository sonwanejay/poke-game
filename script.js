// 1. Get DOM emlements

const resultElement = document.getElementById("result");
const pokemonImageElement = document.getElementById("pokemonImage");
const optionContainer = document.getElementById("options");
const pointsshown = document.getElementById("pointvalue");
const loadingContainer = document.getElementById("loadingContainer");
const mainContainer = document.getElementsByClassName("container");
const totalCount = document.getElementById("totalCount")

// 8. Initialize Variables 
let usedPokemonIds = [];
let count = 0; // 15.3
let points = 0;
let showLoading = false;


// 2. create a function to fetch one pokemon with an id

async function fetchPokemonById (id) {
    showLoading = true;

    const response = await fetch (`http://pokeapi.co/api/v2/pokemon/${id}`);
    const data = await response.json();
    return data;
}

// // 3. create a test function to see result of 2nd step 
// async function testFetch(){
//     const pokemon = await fetchPokemonWithId
//     (getRandomPokemonId());
//     console.log(pokemon);
// }


// // 4. call test functiom 
// testFetch();


// 6. Function to load question with options 

async function loadQuestionWithOption (){
if (showLoading) {
    showLoadingWindow();
    hidePuzzleWindow(); 
}

    // 7. fetch correct answer first 
    let pokemonId = getRandomPokemonId();

    //8.2 check if correct question has already used 
    while (usedPokemonIds.includes(pokemonId)){
        pokemonId = getRandomPokemonId();
    }

   // 8.3 If pokemon has not displayed yet , it is added to usedPokemonIds .And it is set as new const pokemon.
     usedPokemonIds.push(pokemonId);
     const pokemon = await fetchPokemonById(pokemonId);


// add the log here for the test *****************************
console.log(pokemon);


   // 9 Create option array  
   const options = [pokemon.name];  
   const optionsIds = [pokemon.id];

   //10. Fetch additonal random pokemon names to use as options 
   while (options.length < 4) {
    let randomPokemonId = getRandomPokemonId();

    //10.1 ensurenfetched option does not exist in the option list . create a new random id until it does not exist in optionIds.

    while (optionsIds.includes(randomPokemonId)){
        randomPokemonId = getRandomPokemonId();
    }
        optionsIds.push(randomPokemonId);

        //10.2 Fetching the random pokemon with newly made id and adding it to the option array
        const randomPokemon = await fetchPokemonById(randomPokemonId);
        const randomOption = randomPokemon.name;
        options.push(randomOption);

        //10.3 test
        // console.log(options);
        // console.log(optionsIds); 

        //16.5 Turn of loading if all option have been fetched
        if (options.length === 4) {
            showLoading = false;
        }
   }
   // shuffle the 4 option arrray 
   shuffleArray(options);

   // 13. clear any previous result and update pokemon image to fetch image url form the sprites
   resultElement.textContent = "Who's that Pokemon ?";
   pokemonImageElement.src = pokemon.sprites.other.dream_world.front_default;
   // 14. Create option HTML element from option array in the DOM
   optionContainer.innerHTML = ""; // reset
   options.forEach((options) => {
    const button = document.createElement("button");
    button.textContent = options;
    button.onclick = (event) => checkAnswer (options === pokemon.name, event);
    optionContainer.appendChild(button);
   });

   if(!showLoading) {
    hideLoadingWindow();
    showPuzzleWindow();
    
   }
}
// 11. Initial load 
loadQuestionWithOption();

// 15. Create checkAnswer  funnction
function checkAnswer(isCorrect, event) {

    //15.1 Check if any button is already selected 
    //     if falsy => no element  => null
    const selectedButton = document.querySelector(".selected");
     
    // 15.2 If alredy selected , do nothing , exit function
        if (selectedButton) {
            return;
        }
    //15.4 else marked the click button a selected and incrase the count by 1
        event.target.classList.add("selected");
        count++;
        totalCount.textContent = count; 

        if (isCorrect) {
            // 15.7 call display  function 
            displayResult("Correct answer!", "correct");
            // 15.8 if correct increase the point by 1 
            points++;
            pointsshown.textContent = points; 
            event.target.classList.add("correct");
        } else {
            displayResult("Wrong answer...", "wrong");
            event.target.classList.add("wrong");
        }

        //15.9 Load the next question with a 1s delay for the user to read the result
        setTimeout(() => {
            showLoading = true;
            loadQuestionWithOption(); 
        },1000)
} 





// -- UTILITY FUNCTIONS --
// 5. function to randomize the pokemon

function getRandomPokemonId(){
    return Math.floor(Math.random() * 151) + 1;
}


// 12.1 shuffle the arrey we send it 
function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
}

// 15.5 Function to update result text and class name 
function displayResult(result) {
    resultElement.textContent = result;
}

// 17. hide loading 
function hideLoadingWindow () {
    loadingContainer.classList.add("hide");
}

// // 18. show loading window 
function showLoadingWindow () {
    mainContainer[0].classList.remove("show");
    loadingContainer.classList.remove("hide");
    loadingContainer.classList.add("show");
}

// // 19. show puzzle window 
function showPuzzleWindow() {
    loadingContainer.classList.remove("show");
    mainContainer[0].classList.remove("hide");
    mainContainer[0].classList.add("show");
}


// // 20. Hide puzzle window
function hidePuzzleWindow() {
    mainContainer[0].classList.add("hide");
}








