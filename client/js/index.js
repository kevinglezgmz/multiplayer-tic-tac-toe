const cells = document.querySelectorAll(".cell");
const loader = document.querySelector(".loader");
const lblGameStatus = document.getElementById("lblGameStatus");
const lblGameCode = document.getElementById("lblGameCode");
const btnCreateGame = document.getElementById("btnCreateGame");
const btnJoinGame = document.getElementById("btnJoinGame");
const inputGameCode = document.getElementById("inputGameCode");
const landingContainer = document.querySelector(".landingContainer");
const cellContainer = document.querySelector(".cellContainer");

const socket = io("https://tic-server.herokuapp.com/");

let player;

socket.on("game-init", handleGameInit);
socket.on("game-update", handleGameUpdate);
socket.on("game-end", handleGameEnd);
socket.on("unknown-code", handleUnknownCode);
socket.on("too-many-players", handleTooManyPlayers);
socket.on("game-code", handleGameCode);

function handleGameCode(gameCode) {
  lblGameCode.innerText = "Game code: " + gameCode + ".";
  lblGameCode.style.display = "block";
  loader.style.display = "block";
  lblGameStatus.innerText = "Waiting for a second player to join.";
}

function handleUnknownCode() {
  alert("Unknown code");
}

function handleTooManyPlayers() {
  alert("Too many players");
}

function handleGameInit(playerNumber) {
  cells.forEach((cell, index) => {
    cell.classList.remove("clicked");
    cell.setAttribute("data-cell", index);
  });

  player = playerNumber;

  cellContainer.style.display = "grid";
  landingContainer.style.display = "none";
}

function handleCellClick(e) {
  clickedCell = e.target;
  const cellIndex = clickedCell.getAttribute("data-cell");
  socket.emit("clicked-cell", cellIndex);
}

function handleGameUpdate(gameState, playerNumber) {
  gameState = JSON.parse(gameState);
  for (let i = 0; i < cells.length; i++) {
    cells[i].innerText = gameState.cells[i];
    if (gameState.cells[i] !== "" || player != playerNumber) {
      cells[i].classList.add("clicked");
      cells[i].removeEventListener("click", handleCellClick);
    } else {
      cells[i].classList.remove("clicked");
      cells[i].addEventListener("click", handleCellClick);
    }
  }
  if (player === playerNumber) {
    lblGameStatus.innerText = "It's your turn. Make a move!";
  } else {
    lblGameStatus.innerText = "It's your opponent's turn. Please wait!";
  }
  loader.style.display = "none";
}

function handleGameEnd(message) {
  alert(message);
  cells.forEach((cell) => {
    cell.removeEventListener("click", handleCellClick);
    cell.classList.add("clicked");
  });
}

btnCreateGame.addEventListener("click", (e) => {
  socket.emit("create-new-game");
});

btnJoinGame.addEventListener("click", (e) => {
  socket.emit("join-game", inputGameCode.value);
  lblGameCode.innerText = "Game code: " + inputGameCode.value + ".";
  lblGameCode.style.display = "block";
});
