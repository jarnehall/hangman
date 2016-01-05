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
    words = ["mahrez", "betatestare", "ringmuskel", "promiskuös", "lammkött", "handklovar", "carnitas", "olivolja", "rakhyvel", "helikoptern", "övertid", "sjukgymnast", "kaffesug", "rivjärn", "tuggummi", "diskmaskin", "knäckebröd", "chromecast", "plexserver"],
    theWord = "",
    timesWrong = "0",
    lastGuess = "",
    rightGuesses = [];

// Run the function that starts a new game
initiateGame();




    /******************************
    *                             *
    *      All my functions       *
    *                             *
    ******************************/


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


// Things to happen when the player presses a letter
function letterPress (thisEl) {
    var correct = guessLetter(thisEl.innerHTML);

    if (correct) {
        rightGuesses.push(thisEl.innerHTML);
        revealLetter(thisEl.innerHTML);
    }
    else {
        timesWrong++;
        attemptsLeftID.innerHTML = "Försök kvar: " + (10 - timesWrong);
        if (timesWrong >= 10) {
            endGame("defeat");
        }
        console.log("Faults: " + timesWrong);
    }

    var liNode = document.createElement("li"),
        textnode = document.createTextNode(thisEl.innerHTML);

    liNode.appendChild(textnode);

    var newCopy = thisEl.parentElement.insertBefore(liNode, thisEl);
    thisEl.parentElement.removeChild(thisEl);

    newCopy.className = "used";
}


// The game is over, the parameter state declares either victory or defeat
function endGame (state) {
    var pNode1 = document.createElement("p"),
        pNode2 = document.createElement("p"),
        textnode1 = "",
        textnode2 = "";

    theWordID.className += " " + state;
    alphabetID.parentElement.removeChild(alphabetID);
    attemptsLeftID.parentElement.removeChild(attemptsLeftID);

    pNode1.id = "endScreenID1";
    pNode2.id = "endScreenID2";

    if (state === "victory") {
        textnode1 = document.createTextNode("Grattis, du vann!");
        textnode2 = document.createTextNode("Du hade " + (10 - timesWrong) + " försök till godo.");
    } else {
        textnode1 = document.createTextNode("Du förlorade.");
        textnode2 = document.createTextNode("Det rätta ordet var " + theWord + ".");
    }

    pNode1.appendChild(textnode1);
    pNode2.appendChild(textnode2);

    cont.appendChild(pNode1);
    cont.appendChild(pNode2);
}


// Run all the functions and reset varibles to initiate a new game
function initiateGame () {
    cont.innerHTML = "";
    timesWrong = "0";
    rightGuesses = [];

    // theWord contains the word the player is suposed to guess
    theWord = initiateWord()
    initiateCounter();
    initiateAlphabet();

    console.log("Ordet är: " + theWord);
}


// Appends a new <h1> element containing a randomly picked word from the array words[]
function initiateWord () {
    var randomNum = getRandomArbitrary(0, words.length),
        h1Node = document.createElement("h1"),
        curLength = words[randomNum].length,
        spaces = "";

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
    return words[randomNum];
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
    var textnode = document.createTextNode("Försök kvar: 10");

    // Append all the _ to the h1Node
    h2Node.appendChild(textnode);
    // Append the h1Node to the document
    cont.appendChild(h2Node);
}


// Get a random whole integrer between the numbers min and max
function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}
