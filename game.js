// game.js
document.addEventListener('DOMContentLoaded', function() {
    // Game elements
    const guessInput = document.getElementById('guess-input');
    const guessButton = document.getElementById('guess-button');
    const newGameButton = document.getElementById('new-game-button');
    const feedbackArea = document.getElementById('feedback-area');
    const attemptCount = document.getElementById('attempts-count');
    const guessesList = document.getElementById('guesses-list');
    
    // Game variables
    let gameActive = true;
    let attempts = 0;
    let maxAttempts = 10;
    let secretNumber;
    let previousGuesses = [];
    
    // Initialize the game
    initGame();
    
    // Set up event listeners
    guessButton.addEventListener('click', handleGuess);
    newGameButton.addEventListener('click', initGame);
    guessInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleGuess();
        }
    });
    
    // Initialize new game
    function initGame() {
        gameActive = true;
        attempts = 0;
        previousGuesses = [];
        secretNumber = Math.floor(Math.random() * 100) + 1;
        
        // Reset UI
        guessInput.value = '';
        guessInput.disabled = false;
        guessButton.style.display = 'block';
        newGameButton.style.display = 'none';
        feedbackArea.innerHTML = "<p>Let's begin!</p>";
        attemptCount.textContent = '0';
        guessesList.innerHTML = '';
        
        // Focus on input
        guessInput.focus();
        
        console.log("Secret number (for testing):", secretNumber);
    }
    
    // Handle user guess
    function handleGuess() {
        if (!gameActive) return;
        
        const guess = parseInt(guessInput.value);
        
        // Validate input
        if (isNaN(guess) || guess < 1 || guess > 100) {
            feedbackArea.innerHTML = "<p>Please enter a valid number between 1 and 100.</p>";
            guessInput.value = '';
            guessInput.focus();
            return;
        }
        
        // Process guess
        attempts++;
        previousGuesses.push(guess);
        attemptCount.textContent = attempts;
        guessInput.value = '';
        
        // Add to guesses list
        const listItem = document.createElement('li');
        listItem.textContent = guess;
        
        // Style based on how close the guess is
        const distance = Math.abs(secretNumber - guess);
        if (distance === 0) {
            listItem.classList.add('correct');
        } else if (distance <= 5) {
            listItem.classList.add('close');
        } else if (distance >= 30) {
            listItem.classList.add('far');
        }
        
        guessesList.appendChild(listItem);
        
        // Check if correct
        if (guess === secretNumber) {
            handleGameEnd(true);
            return;
        }
        
        // Check if out of attempts
        if (attempts >= maxAttempts) {
            handleGameEnd(false);
            return;
        }
        
        // Generate hints
        feedbackArea.innerHTML = generateHints(guess);
        guessInput.focus();
    }
    
    // Generate hints based on the guess
    function generateHints(guess) {
        let hints = [`<p>Attempt ${attempts}/${maxAttempts}: You guessed ${guess}. That's not correct.</p>`];
        
        // Higher or lower hint
        if (guess < secretNumber) {
            hints.push("<p>The secret number is higher.</p>");
        } else {
            hints.push("<p>The secret number is lower.</p>");
        }
        
        // Distance hint
        const distance = Math.abs(secretNumber - guess);
        if (distance <= 5) {
            hints.push("<p>You're very close!</p>");
        } else if (distance <= 15) {
            hints.push("<p>You're getting closer.</p>");
        } else {
            hints.push("<p>You're still quite far away.</p>");
        }
        
        // Even/odd hint
        if (attempts >= 3) {
            if (secretNumber % 2 === 0) {
                hints.push("<p>The secret number is even.</p>");
            } else {
                hints.push("<p>The secret number is odd.</p>");
            }
        }
        
        // Divisibility hint
        if (attempts >= 5) {
            if (secretNumber % 5 === 0) {
                hints.push("<p>The secret number is divisible by 5.</p>");
            } else {
                hints.push("<p>The secret number is not divisible by 5.</p>");
            }
        }
        
        // Digit sum hint
        if (attempts >= 7) {
            const digitSum = String(secretNumber).split('').reduce((sum, digit) => sum + parseInt(digit), 0);
            hints.push(`<p>The sum of the digits in the secret number is ${digitSum}.</p>`);
        }
        
        return hints.join('');
    }
    
    // Handle game end (win or lose)
    function handleGameEnd(win) {
        gameActive = false;
        guessInput.disabled = true;
        guessButton.style.display = 'none';
        newGameButton.style.display = 'block';
        
        if (win) {
            feedbackArea.innerHTML = `<p>Congratulations! You guessed the number ${secretNumber} in ${attempts} attempts!</p>`;
        } else {
            feedbackArea.innerHTML = `<p>Game over! You've used all ${maxAttempts} attempts. The number was ${secretNumber}.</p>`;
        }
    }
});
