document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('gameBoard');
    const colorSequenceBoard = document.getElementById('colorSequence');
    const startColorGameButton = document.getElementById('startColorGame');
    const livesCountEl = document.getElementById('livesCount');
    const colors = ['red', 'blue', 'green', 'yellow'];
    let symbols = ['🌀', '🌀', '⚛️', '⚛️', '🔥', '🔥', '🌟', '🌟'];
    let sequence = [];
    let flippedCards = [];
    let matchedCards = 0;
    let currentLevel = 1;
    let lives = 5;
    // initializes the game
    function initializeGame() {
        gameBoard.innerHTML = '';
        colorSequenceBoard.innerHTML = '';
        document.getElementById('colorGame').style.display = 'none';
        document.getElementById('gameBoard').style.display = 'block';
        symbols = symbols.slice(0, 8);
        symbols.sort(() => 0.5 - Math.random());
        lives = 5;
        livesCountEl.textContent = lives;
        matchedCards = 0;
        flippedCards = [];
        createCards();
        if (currentLevel > 1) {
            startColorGame();
        }
    }
    // creates the cards, each with a symbol
    function createCards() {
        symbols.forEach(symbol => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.symbol = symbol;
            card.addEventListener('click', () => {
                if (flippedCards.length < 2 && !card.classList.contains('flipped')) {
                    flipCard(card);
                }
            });
            gameBoard.appendChild(card);
        });
    }
    // when the user presses on a card, the card flips
    function flipCard(card) {
        card.classList.add('flipped');
        card.textContent = card.dataset.symbol;
        flippedCards.push(card);
        if (flippedCards.length === 2) {
            checkForMatch();
        }
    }
    // checks for the card match
    function checkForMatch() {
        const [card1, card2] = flippedCards;
        if (card1.dataset.symbol === card2.dataset.symbol) {
            handleMatch();
        } else {
            setTimeout(() => handleNoMatch(card1, card2), 1000);
        }
    }
    // the user has to match 2 of the same symbol cards
    function handleMatch() {
        matchedCards += 2;
        flippedCards.forEach(card => card.classList.add('match'));
        flippedCards = [];
        if (matchedCards === symbols.length) {
            alert(`Level ${currentLevel} completed!`);
            currentLevel++;
            initializeGame();
        }
    }
    // if the cards flipped match, they stay flipped, however if they do not, the user loses a life
    function handleNoMatch(card1, card2) {
        card1.classList.remove('flipped', 'match');
        card2.classList.remove('flipped', 'match');
        card1.textContent = '';
        card2.textContent = '';
        flippedCards = [];
        loseLife();
    }
    // if all lives are lost, the user is given to option to restart the game from the first level
    function loseLife() {
        lives--;
        livesCountEl.textContent = lives;
        if (lives === 0) {
            if (confirm('Game Over! You ran out of lives. Would you like to restart the game?')) {
                currentLevel = 1;
                initializeGame();
            }
        }
    }
        //second game starts, colour recall game
    function startColorGame() {
        document.getElementById('gameBoard').style.display = 'none';
        document.getElementById('colorGame').style.display = 'block';
        addColorToSequence();
    }
    //make sure the start game button works
    startColorGameButton.addEventListener('click', startColorGame);


        //sequence of colours
    function addColorToSequence() {
        sequence.push(colors[Math.floor(Math.random() * colors.length)]);
        flashColors(sequence);
    }

    function flashColors(sequence) {
        colorSequenceBoard.innerHTML = '';  
        sequence.forEach((color, index) => {
            setTimeout(() => {
                const colorDiv = document.createElement('div');
                colorDiv.className = 'color';
                colorDiv.style.backgroundColor = color;
                colorDiv.dataset.color = color;
                colorSequenceBoard.appendChild(colorDiv);
                setTimeout(() => colorDiv.remove(), 500);
            }, 1000 * index);
        });
    }

    colorSequenceBoard.addEventListener('click', (e) => {
        const colorClicked = e.target.dataset.color;
        if (colorClicked === sequence[sequence.length - 1]) {
            alert('Correct sequence! Next level starting.');
            addColorToSequence();
        } else {
            loseLife();
        }
    });

    initializeGame();
});
