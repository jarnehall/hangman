// Created by Alexander Järnehall





    /******************************
    *                             *
    *   Stuff done on page load   *
    *                             *
    ******************************/


var cont = document.querySelector(".container"),
    words = ["t","hej","Maja","Slalombana"],
    theWord = "";

// theWord contains the word the player is suposed to guess
theWord = initiateWord()
initiateAlphabet();

console.log("The word is: " + theWord);





    /******************************
    *                             *
    *      All my functions       *
    *                             *
    ******************************/


function guessLetter (theLetter) {
    console.log("function guessLetter(" + theLetter + ") called.");

    if (theWord.indexOf(theLetter) > -1) {
        // The guessed letter was found in the word
        return true;
    } else {
        // The guessed letter was NOT found in the word
        return false;
    }
}


// Appends a new <h1> element containing a randomly picked word from the array words[]
function initiateWord () {
    console.log("function initiateWord() called.");

    var randomNum = getRandomArbitrary(0, words.length),
        h1Node = document.createElement("h1"),
        curLength = words[randomNum].length,
        spaces = "";

    // Add upp as many _ as there is letters in the selected word
    for (var i = 0; i < curLength; i++) {
        spaces += "_ "
    }

    // Create a text node of the _ for appending
    var textnode = document.createTextNode(spaces);

    // Append all the _ to the h1Node
    h1Node.appendChild(textnode);
    // Append the h1Node to the document
    cont.appendChild(h1Node);

    // Return the selected word
    return words[randomNum];
}


// Function to create a UL list and populate it with one LI for every letter of the alphabet
function initiateAlphabet () {
    console.log("function initiateAlphabet() called.");

    var textnode = "",
        alphabetList = document.createElement("ul"),
        alphabet = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","å","ä","ö"];

    for (var i = 0; i < alphabet.length; i++) {
        var liNode = document.createElement("li"),
            curLetter = alphabet[i];

        textnode = document.createTextNode(alphabet[i]);

        liNode.appendChild(textnode);

        liNode.addEventListener("click", function(){
            console.log("clicked: " + this.innerHTML);
        }, false);

        alphabetList.appendChild(liNode);
    }

    cont.appendChild(alphabetList);
}


// Returns a random integrer between min (inclusive) and max (exclusive)
function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}
