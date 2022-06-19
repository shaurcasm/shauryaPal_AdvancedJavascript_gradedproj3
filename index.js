//'use strict';

const textToType = [
    'Click on the area below to start the game.',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer tristique quam in nibh iaculis, vitae pulvinar quam consectetur. Sed fermentum efficitur commodo. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Fusce turpis felis, dapibus sit amet mattis eget, malesuada ac diam. Praesent ut sem nec leo fermentum mollis. Aliquam blandit dignissim nisl. Proin leo lectus, vestibulum sed velit ac, finibus placerat eros. Suspendisse lacinia, massa et venenatis tincidunt, neque nisi consectetur lacus, nec tempus dolor lectus in lectus. Donec bibendum aliquam leo, vel aliquam nunc luctus at.',
    'A journey of a thousand miles starts with a single step.'
];

const times = {
    FIVE_SECONDS: 5 * 1000,
    ONE_MINUTE: 1 * 60 * 1000,
    FIVE_MINUTES: 5 * 60 * 1000,
};

let selectedTime = times.ONE_MINUTE;
let currentTime = selectedTime;   // This countsdown from selected duration

const textInput = document.getElementById('text-input');
textInput.addEventListener('click', startGame);

const resetBtn = document.getElementById('reset-btn');
resetBtn.addEventListener('click', resetGame);

const textCard = document.querySelector('.text-card');

const timeCard = document.querySelector('#time .info');
const errorCard = document.querySelector('#errors .info');
const accuracyCard = document.querySelector('#accuracy .info');

let intervalRef;
let text = textToType[2];
let words = 0;
let characters = 0;

function startGame(event) {
    console.log(intervalRef);
    if (currentTime <= 0 || intervalRef)
        return;

    textCard.innerText = text;
    textInput.style.height = textCard.scrollHeight + 'px';
    textInput.style.width = textCard.scrollWidth + 'px';

    textInput.addEventListener('input', playGame);
    intervalRef = setInterval(countdownToZero, 1000);

    resetBtn.classList.remove('invisible');
}

function playGame(event) {
    const character = event.data;
    const value = event.target.value;
    const textLength = value.length;
    let textValue = textCard.innerText;
    let errors = 0;  
    let accuracy = 100;

    if (!value) {
        errors = 0;
    }

    if (!character)
        return;

    let htmlText = textValue.substring(0, textLength);
    words = htmlText.split(' ').length;

    htmlText = htmlText.split('');
    characters = htmlText.length;

    htmlText = htmlText.map((char, index) => {
        if (char.toLowerCase() !== value[index].toLowerCase()) {
            errors += 1;
            return `<span class='wrong'>${char}</span>`;
        }

        return `<span class='correct'>${char}</span>`;
    });

    accuracy = Math.round(((textLength - errors) / textLength) * 100);

    htmlText = htmlText.join("");
    textValue = htmlText + textValue.substring(textLength);

    textCard.innerHTML = textValue;
    errorCard.innerText = errors;
    accuracyCard.innerText = accuracy;
}

function countdownToZero() {
    currentTime -= 1000;
    let timeDisplay = Math.floor(currentTime / 1000);
    timeCard.innerText = timeDisplay;

    if (currentTime <= 0) {
        clearInterval(intervalRef);
        intervalRef = null;
        finishGame();
    }
}

function finishGame() {
    textCard.innerText = `WPM = ${words}; CPM = ${characters}
    Click on Reset to start a New Game`;
    textInput.disabled = true;
}

function resetGame() {
    currentTime = selectedTime;
    textCard.innerText = textToType[0];
    errorCard.innerText = '0';
    accuracyCard.innerText = '100';
    textInput.value = '';
    
    textInput.disabled = false;

    clearInterval(intervalRef);
    intervalRef = null;

    resetBtn.classList.add('invisible');
}
