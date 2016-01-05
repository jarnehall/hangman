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
    difficulties = ["easy", "normal", "hard"],
    game = new Object();

game.diff = difficulties[1];
game.diffLow = "";
game.diffHigh = "";

// Run the function that starts a new game
gameBoot();




    /******************************
    *                             *
    *      All my functions       *
    *                             *
    ******************************/


function gameBoot () {
    var buttonNode = document.createElement("button"),
        ulNode = document.createElement("ul"),
        pNode = document.createElement("p"),
        textNode = document.createTextNode("Spela Ordjakten!"),
        pTextNode = document.createTextNode("Välkommen till Ordjakten, spelet som går ut på att lista ut vilket ord spelet tänker på! Vinn flera gånger i rad för att bygga på din High Score!");

    for (var i = 0; i < difficulties.length; i++) {
        var liNode = document.createElement("li"),
            x = difficulties[i];

        liNode.innerHTML = '<h2>' + x + '</h2><p>Du får ' + initiateDiff(x) + ' försök på dig</p>';
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
    if (temp === theWord) { endGame("victory"); }
}

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

    theWordID.innerHTML = temp;
}


// Things to happen when the player presses a letter
function letterPress (thisEl) {
    var correct = guessLetter(thisEl.innerHTML);

    if (correct) {
        rightGuesses.push(thisEl.innerHTML);
        revealLetter(thisEl.innerHTML);
    }
    else {
        timesWrong++;
        attemptsLeftID.innerHTML = "Försök kvar: " + (game.attempts - timesWrong);
        if (timesWrong >= game.attempts) {
            endGame("defeat");
        }
        console.log("Faults: " + timesWrong);
    }

    var liNode = document.createElement("li"),
        textnode = document.createTextNode(thisEl.innerHTML);

    liNode.appendChild(textnode);

    var newCopy = thisEl.parentElement.insertBefore(liNode, thisEl);
    thisEl.parentElement.removeChild(thisEl);

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

    alphabetID.parentElement.removeChild(alphabetID);
    attemptsLeftID.parentElement.removeChild(attemptsLeftID);

    pNode.id = "endScreenID";

    if (state === "victory") {
        score++;
        highScoreID.innerHTML = "Vinster i rad: " + score;
        pTextNode = document.createTextNode("Grattis, du vann!");
    } else {
        score = 0;
        revealLetter ("end");
        pTextNode = document.createTextNode("Du förlorade...");
    }

    console.log("Du kom upp i poängen: " + score);

    revealWord();

    pNode.appendChild(pTextNode);
    buttonNode.appendChild(buttonTextNode);

    cont.appendChild(pNode);
    cont.appendChild(buttonNode);

    buttonNode.addEventListener("click", initiateGame);
}


// Run all the functions and reset varibles to initiate a new game
function initiateGame () {
    cont.innerHTML = "";
    timesWrong = "0";
    rightGuesses = [];

    // theWord contains the word the player is suposed to guess
    theWord = initiateWord(game.diff);
    game.attempts = initiateDiff(game.diff);
    initiateHighScore();
    initiateCounter();
    initiateAlphabet();

    console.log("Ordet är: " + theWord);
}

function initiateDiff (diff) {
    if (diff == "easy") {
        return 12;
    } else if (diff == "hard") {
        return 6;
    } else {
        return 8;
    }
}


// Appends a new <h1> element containing a randomly picked word from the array words[]
function initiateWord () {
    var randomNum = "",
        h1Node = document.createElement("h1"),
        curLength = "",
        spaces = "",
        wordsDiff = [];

    if (game.diff == "easy") {
        game.diffLow = 1;
        game.diffHigh = 6;
    } else if (game.diff == "hard") {
        game.diffLow = 8;
        game.diffHigh = 20;
    } else {
        game.diffLow = 5;
        game.diffHigh = 14;
    }

    for (var i = 0; i < words.length; i++) {
        if (words[i].length >= game.diffLow && words[i].length <= game.diffHigh) {
            wordsDiff.push(words[i]);
        }
    }

    randomNum = getRandomArbitrary(0, wordsDiff.length);
    curLength = wordsDiff[randomNum].length;

    // Give our h1Node the #ID of "theWordID"
    h1Node.id = "theWordID";

    // Add upp as many _ as there is letters in the selected word
    for (var i = 0; i < curLength; i++) {
        spaces += "_"
    }

    // Create a text node of the _ for appending
    var textnode = document.createTextNode(spaces);

    // Append all the _ to the h1Node
    h1Node.appendChild(textnode);
    // Append the h1Node to the document
    cont.appendChild(h1Node);
    theWordEl = document.querySelector("h1");

    // Return the selected word
    return wordsDiff[randomNum];
}


// Function to create a UL list and populate it with one LI for every letter of the alphabet
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

function initiateCounter () {
    var h2Node = document.createElement("h2");

    // Give our h1Node the #ID of "theWordID"
    h2Node.id = "attemptsLeftID";

    // Create a text node of the _ for appending
    var textnode = document.createTextNode("Försök kvar: " + game.attempts);

    // Append all the _ to the h1Node
    h2Node.appendChild(textnode);
    // Append the h1Node to the document
    cont.appendChild(h2Node);
}

function initiateHighScore () {
    var h2Node = document.createElement("h2");

    // Give our h1Node the #ID of "theWordID"
    h2Node.id = "highScoreID";

    // Create a text node of the _ for appending
    var textnode = document.createTextNode("Vinster i rad: " + score);

    // Append all the _ to the h1Node
    h2Node.appendChild(textnode);
    // Append the h1Node to the document
    cont.appendChild(h2Node);
}


// Get a random whole integrer between the numbers min and max
function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}
