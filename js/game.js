// Created by Alexander Järnehall


    /******************************
    *                             *
    *   Stuff done on page load   *
    *                             *
    ******************************/


// Declare some varibles that are needed in the global scope
var cont = document.querySelector(".container"),
    resetBtn = document.querySelector(".reset-btn"),
    theWordEl = "",
    // All the words that the game can choose from
    words = ["matta", "tåg", "betatestare", "promiskuös", "kött", "pensel", "olivolja", "rakhyvel", "helikopter", "övertid", "sjukgymnast", "kaffesug", "rivjärn", "tuggummi", "diskmaskin", "knäckebröd", "bil", "server"],
    theWord = "",
    timesWrong = "0",
    score = "0",
    rightGuesses = [],
    difficulties = ["Nybörjare", "Standard", "Expert"],
    game = new Object();

// Set the default difficulty to "Standard"
game.diff = difficulties[1];

// Declared in global scope for later use
game.diffLow = "";
game.diffHigh = "";

// Run the function that starts a new game
gameBoot();




    /******************************
    *                             *
    *      All my functions       *
    *                             *
    ******************************/


// A rather long function that sets up the whole intro screen of the game, where the player can select difficulty and start a match
function gameBoot () {
    var buttonNode = document.createElement("button"),
        ulNode = document.createElement("ul"),
        pNode = document.createElement("p"),
        textNode = document.createTextNode("Spela Ordjakten!"),
        pTextNode = document.createTextNode("Välkommen till Ordjakten, spelet som går ut på att lista ut ord! Klicka på en bokstav för att gissa på att den finns med i ordet. Gissa fram tills du löst ut hela ordet eller använt upp alla dina gissningar.");

    // This loop creates and appends the different difficulty options
    for (var i = 0; i < difficulties.length; i++) {
        var liNode = document.createElement("li"),
            x = difficulties[i],
            howHardAreTheWords;

        if (x == difficulties[0]) {
            howHardAreTheWords = "enkla";
        } else if (x == difficulties[2]) {
            howHardAreTheWords = "långa";
        } else {
            howHardAreTheWords = "blandade"
        }

        liNode.innerHTML = '<h2>' + x + '</h2><p>' + initiateDiff(x) + ' försök med ' + howHardAreTheWords + ' ord</p>';
        liNode.className = x;

        if (difficulties[i] === game.diff) {
            liNode.className += " selected";
        }

        ulNode.appendChild(liNode);

        liNode.addEventListener("click", function(){ changeDiff(this); });
    }

    buttonNode.appendChild(textNode);
    pNode.appendChild(pTextNode);

    ulNode.className = "diff";
    pNode.className = "intro-text";

    cont.appendChild(pNode);
    cont.appendChild(ulNode);
    cont.appendChild(buttonNode);

    buttonNode.addEventListener("click", initiateGame);
}


// A function that changes the difficulty of the game
function changeDiff (el) {
    var ulList = document.querySelector(".diff");

    for (var i = 0; i < ulList.childNodes.length; i++) {
        var elChild = ulList.childNodes[i],
            classes = ulList.childNodes[i].className;

        elChild.className = classes.replace(" selected", "");

        if (elChild === el) {
            game.diff = elChild.className;
            console.log("Vald svårighetsgrad: " + game.diff);
            elChild.className += " selected";
        }
    }
}


// Check if the letter the player guessed is correct or not, and act accordingly
function guessLetter (theLetter) {
    if (theWord.indexOf(theLetter) > -1) {
        // The guessed letter was found in the word
        return true;
    } else {
        // The guessed letter was NOT found in the word
        return false;
    }
}


// The player guessed a letter correctly, time to reveal it in the <h1> element
function revealLetter (theLetter) {
    var temp = "",
        theWordArray = theWord.split("");

    // A loop that goes through each letter of the word, and checks if the player has guessed that letter or not
    for (var i = 0; i < theWordArray.length; i++) {
        var correct = false;
        for (var x = 0; x < rightGuesses.length; x++) {
            if (theWordArray[i].indexOf(rightGuesses[x]) > -1) {
                temp += theWordArray[i];
                correct = true;
            }
        }
        if (correct == false) { temp += "_"; }
    }

    theWordID.innerHTML = temp;
    // If the temp word this function created is the same as the correct word, trigger win condition
    if (temp === theWord) { endGame("victory"); }
}


// A function that reveals the correct word to the player and gives each letter a class depending on the player guessed it or not
function revealWord () {
    var temp = "",
        theWordArray = theWord.split("");

    for (var i = 0; i < theWordArray.length; i++) {
        var correct = false;
        for (var x = 0; x < rightGuesses.length; x++) {
            if (theWordArray[i].indexOf(rightGuesses[x]) > -1) {
                temp += '<span class="playerCor">' + theWordArray[i] + '</span>';
                correct = true;
            }
        }
        if (correct == false) { temp += '<span class="playerWro">' + theWordArray[i] + '</span>'; }
    }

    // Set the word on the game board to the temp one this function created
    theWordID.innerHTML = temp;
}


// Things to happen when the player presses a letter
function letterPress (thisEl) {
    var correct = guessLetter(thisEl.innerHTML),
        liNode = document.createElement("li"),
        textnode = document.createTextNode(thisEl.innerHTML);

    // If the letter is in the word, do some stuff. Otherwise, do some other stuff.
    if (correct) {
        rightGuesses.push(thisEl.innerHTML);
        revealLetter(thisEl.innerHTML);
    } else {
        timesWrong++;
        attemptsLeftID.innerHTML = "Försök kvar: " + (game.attempts - timesWrong);
        if (timesWrong >= game.attempts) {
            endGame("defeat");
        }
    }

    liNode.appendChild(textnode);

    // To get around the problem of removeEventHandler not working with discrete functions, I simply make a copy of the element and remove the original
    var newCopy = thisEl.parentElement.insertBefore(liNode, thisEl);
    thisEl.parentElement.removeChild(thisEl);

    // Sets a class on the <li> containing the letter that was pressed depening on if the letter is in the word or not
    if (correct) {
        newCopy.className = "used correct";
    } else {
        newCopy.className = "used wrong";
    }
}


// The game is over, the parameter state declares either victory or defeat
function endGame (state) {
    var pNode = document.createElement("p"),
        buttonNode = document.createElement("button"),
        pTextNode = "",
        buttonTextNode = document.createTextNode("Ny omgång");

    // Remove some things from the game board
    alphabetID.parentElement.removeChild(alphabetID);
    attemptsLeftID.parentElement.removeChild(attemptsLeftID);

    pNode.id = "endScreenID";

    // If the player won, do this, otherwise do that
    if (state === "victory") {
        score++;
        highScoreID.innerHTML = "Vinster i rad: " + score;
        pTextNode = document.createTextNode("Grattis, du vann!");
    } else {
        score = 0;
        revealLetter ("end");
        pTextNode = document.createTextNode("Du förlorade...");
    }

    // Reveal the correct word to the player
    revealWord();

    pNode.appendChild(pTextNode);
    buttonNode.appendChild(buttonTextNode);
    cont.appendChild(pNode);
    cont.appendChild(buttonNode);

    // Make the "new round" button start a new game when clicked
    buttonNode.addEventListener("click", initiateGame);
}


// Run all the functions and reset varibles to initiate a new game
function initiateGame () {
    // Clear the div.container of all content to reset the game board
    cont.innerHTML = "";

    // Reset some varibles unique to each game
    timesWrong = "0";
    rightGuesses = [];

    // Set the varible theWord to a new random word for the new game
    theWord = initiateWord(game.diff);

    // Use function initiateDiff() to decide how many attempts the player gets (for his or her selected difficulty)
    game.attempts = initiateDiff(game.diff);

    // Call a bunch of functions that creates and appends stuff needed to play
    initiateHighScore();
    initiateCounter();
    initiateAlphabet();

    // Cheat for testing purposes
    console.log("Ordet är: " + theWord);
}


// A function that sets the number of tries the player get for each difficulty
function initiateDiff (diff) {
    if (diff == difficulties[0]) {
        return 12;
    } else if (diff == difficulties[2]) {
        return 6;
    } else {
        return 8;
    }
}


// Appends a new <h1> element containing a randomly picked word from the words array (after the words array has been filtered for difficulty)
function initiateWord () {
    var randomNum = "",
        h1Node = document.createElement("h1"),
        curLength = "",
        spaces = "",
        wordsDiff = [];

    // An IF-statement that sets the min and max length of accepted words depending on the selected difficulty
    if (game.diff == difficulties[0]) {
        game.diffLow = 1;
        game.diffHigh = 5;
    } else if (game.diff == difficulties[2]) {
        game.diffLow = 8;
        game.diffHigh = 20;
    } else {
        game.diffLow = 5;
        game.diffHigh = 14;
    }

    // Filter words of correct length to a new array (that new array is used to select a random word)
    for (var i = 0; i < words.length; i++) {
        if (words[i].length >= game.diffLow && words[i].length <= game.diffHigh) {
            wordsDiff.push(words[i]);
        }
    }

    // Get a random number for word selection
    randomNum = getRandomArbitrary(0, wordsDiff.length);

    curLength = wordsDiff[randomNum].length;
    h1Node.id = "theWordID";

    // Add up as many "_" as there is letters in the selected word
    for (var i = 0; i < curLength; i++) {
        spaces += "_"
    }

    var textnode = document.createTextNode(spaces);
    h1Node.appendChild(textnode);
    cont.appendChild(h1Node);
    theWordEl = document.querySelector("h1");

    // Return the randomly selected word
    return wordsDiff[randomNum];
}


// Create and append a <ul> and populate it with one <li> for every letter of the alphabet (also makes every <li> clickable to call a function)
function initiateAlphabet () {
    var textnode = "",
        alphabetList = document.createElement("ul"),
        alphabet = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","å","ä","ö"];

    for (var i = 0; i < alphabet.length; i++) {
        var liNode = document.createElement("li"),
            curLetter = alphabet[i];

        textnode = document.createTextNode(alphabet[i]);
        liNode.appendChild(textnode);

        liNode.addEventListener("click", function () {
            letterPress(this);
        });

        alphabetList.appendChild(liNode);
    }

    alphabetList.id = "alphabetID";
    cont.appendChild(alphabetList);
}


// Create and append the fault counter (keeps track of how many times the player has guessed wrong)
function initiateCounter () {
    var h2Node = document.createElement("h2");

    h2Node.id = "attemptsLeftID";

    var textnode = document.createTextNode("Försök kvar: " + game.attempts);
    h2Node.appendChild(textnode);
    cont.appendChild(h2Node);
}


// Create and append the score counter
function initiateHighScore () {
    var h2Node = document.createElement("h2");

    h2Node.id = "highScoreID";

    var textnode = document.createTextNode("Vinster i rad: " + score);
    h2Node.appendChild(textnode);
    cont.appendChild(h2Node);
}


// Get a random whole integrer between the min and max numbers specified
function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}
