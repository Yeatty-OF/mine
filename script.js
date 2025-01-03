let balance = 1000;
let betAmount = 10;
let mines = 5;
let multiplier = 1;
let gameStarted = false;
let betPlaced = false;

document.getElementById("start-btn").addEventListener("click", startGame);
document.getElementById("cash-out-btn").addEventListener("click", cashOut);

// Create all boxes on page load
window.onload = function() {
  generateBoard();
}

function startGame() {
  betAmount = parseInt(document.getElementById("bet").value);
  mines = parseInt(document.getElementById("mines").value);

  if (betAmount <= 0 || betAmount > balance || mines < 1 || mines > 25) {
    alert("Invalid bet amount or number of mines!");
    return;
  }

  balance -= betAmount;
  updateBalance();

  multiplier = 1;
  gameStarted = true;
  betPlaced = true;  // Mark that the bet has been placed
  document.getElementById("cash-out-btn").disabled = false;

  resetBoard();
  enableGameBoard();  // Enable board for clicks
  placeMines();  // Place mines after enabling game board
  updateMultiplierDisplay();
  document.getElementById("game-message").textContent = ""; // Clear any previous messages
}

function resetBoard() {
  const board = document.getElementById("game-board");
  const cells = Array.from(board.children);
  cells.forEach(cell => {
    cell.classList.remove('clicked', 'mine', 'safe');
    cell.dataset.mine = "false";
  });
}

function generateBoard() {
  const board = document.getElementById("game-board");

  // Render all boxes initially
  for (let i = 0; i < 25; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell", "disabled"); // Initially disable the cells
    cell.addEventListener("click", () => handleCellClick(cell));
    board.appendChild(cell);
  }
}

function enableGameBoard() {
  const cells = Array.from(document.getElementById("game-board").children);
  cells.forEach(cell => cell.classList.remove('disabled'));  // Remove the disabled class
}

function placeMines() {
  const minePositions = new Set();
  // Randomly place mines based on the user input for mines
  while (minePositions.size < mines) {
    const randomIndex = Math.floor(Math.random() * 25); // 25 cells in the 5x5 grid
    minePositions.add(randomIndex);
  }

  const cells = Array.from(document.getElementById("game-board").children);
  cells.forEach((cell, index) => {
    if (minePositions.has(index)) {
      cell.dataset.mine = "true";  // Mark this cell as containing a mine
    }
  });
}

function handleCellClick(cell) {
  if (!gameStarted || cell.classList.contains('clicked') || cell.classList.contains('disabled')) return;

  cell.classList.add('clicked');

  if (cell.dataset.mine === "true") {
    cell.classList.add('mine');
    document.getElementById("game-message").textContent = "You chose the mine!";
    document.getElementById("game-message").classList.add("mine-message");  // Red text for mine hit
    setTimeout(() => {
      resetBoard();  // Reset the board after 2 seconds
      gameStarted = false;
      document.getElementById("cash-out-btn").disabled = true;
    }, 2000);

    // Deduct balance only once after the bomb is clicked
    if (betPlaced) {
      balance -= betAmount;  // Deduct balance only once
      betPlaced = false;  // Ensure balance deduction does not repeat
      updateBalance();
    }

    return;
  }

  multiplier += 0.1;
  updateMultiplierDisplay();
  cell.classList.add('safe');
}

function updateMultiplierDisplay() {
  document.getElementById("multiplier-display").textContent = `Multiplier: ${multiplier.toFixed(2)}x`;
}

function cashOut() {
  if (!gameStarted) {
    alert("Start a game first!");
    return;
  }

  const winnings = betAmount * multiplier;
  balance += winnings;
  updateBalance();
  document.getElementById("game-message").textContent = `You cashed out with ${winnings.toFixed(2)} World Locks!`;
  document.getElementById("game-message").classList.add("cash-out-message");  // Green text for cash-out
  resetBoard();
  gameStarted = false;
  document.getElementById("cash-out-btn").disabled = true;
}

function updateBalance() {
  document.getElementById("balance").innerHTML = `<img src="https://vignette3.wikia.nocookie.net/growtopia/images/8/85/Worldlockacess.gif/revision/latest?cb=20130718211202" alt="coin"> Balance: ${balance}`;
}