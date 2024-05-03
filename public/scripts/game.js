document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('gameBoard');
    const livesCountEl = document.getElementById('livesCount');
    let symbols = ['🌀', '⚛️', '🔥', '🌟']; 
    let currentSymbols = []; 
    let flippedCards = [];
    let matchedCards = 0;
    let currentLevel = 1;
    let lives = 5;

    // Initializes the game
    function initializeGame() {
        gameBoard.innerHTML = '';
        document.getElementById('gameBoard').style.display = 'block';
        configureGameLevel();
        livesCountEl.textContent = lives;
        matchedCards = 0;
        flippedCards = [];
        createCards();
    }

    // Configures the game based on the current level
    function configureGameLevel() {
        if (currentLevel === 1) {
            currentSymbols = [...symbols, ...symbols]; // Duplicate each symbol to ensure pairs
            shuffleSymbols();
            lives = 5;
        } else if (currentLevel === 2) {
            // Add additional symbols for more complexity in level 2
            currentSymbols = [...symbols, '💠', , ...symbols, '💠',];
            shuffleSymbols();
            lives = 5; 
        }
    }

    // Shuffles the symbols array to randomize the board
    function shuffleSymbols() {
        for (let i = currentSymbols.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [currentSymbols[i], currentSymbols[j]] = [currentSymbols[j], currentSymbols[i]];
        }
    }

    // Creates the cards, each with a symbol
    function createCards() {
        currentSymbols.forEach(symbol => {
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

    // When the user presses on a card, the card flips
    function flipCard(card) {
        card.classList.add('flipped');
        card.textContent = card.dataset.symbol;
        flippedCards.push(card);
        if (flippedCards.length === 2) {
            setTimeout(checkForMatch, 1000);
        }
    }

    // Checks for the card match
    function checkForMatch() {
        const [card1, card2] = flippedCards;
        if (card1.dataset.symbol === card2.dataset.symbol) {
            handleMatch();
        } else {
            handleNoMatch();
        }
    }

    // Handles a successful match
    function handleMatch() {
        matchedCards += 2;
        flippedCards.forEach(card => card.classList.add('match'));
        flippedCards = [];
        if (matchedCards === currentSymbols.length) {
            alert(`Level ${currentLevel} completed!`);
            currentLevel++;
            initializeGame();
        }
    }

    // Handles an unsuccessful match
    function handleNoMatch() {
        flippedCards.forEach(card => {
            card.classList.remove('flipped', 'match');
            card.textContent = '';
        });
        flippedCards = [];
        loseLife();
    }

    // Decreases the lives count and checks for game over
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

    initializeGame();
});
