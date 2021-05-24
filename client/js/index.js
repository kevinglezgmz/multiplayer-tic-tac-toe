const cells = document.querySelectorAll(".cell");
const loader = document.querySelector(".loader");
const lblGameStatus = document.getElementById("lblGameStatus");
const lblGameCode = document.getElementById("lblGameCode");
const btnCreateGame = document.getElementById("btnCreateGame");
const btnJoinGame = document.getElementById("btnJoinGame");
const inputGameCode = document.getElementById("inputGameCode");
const landingContainer = document.querySelector(".landingContainer");
const cellContainer = document.querySelector(".cellContainer");
const winningBar = document.querySelector(".winningBar");

const socket = io("http://localhost:5000/");

let player;

socket.on("game-init", handleGameInit);
socket.on("game-update", handleGameUpdate);
socket.on("game-end", handleGameEnd);
socket.on("unknown-code", handleUnknownCode);
socket.on("too-many-players", handleTooManyPlayers);
socket.on("game-code", handleGameCode);

function handleGameCode(gameCode) {
  inputGameCode.value = gameCode;
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
  lblGameCode.innerText = "Game code: " + inputGameCode.value + ".";
  lblGameCode.style.display = "block";

  window.location.hash = "#lets_play";

  setInterval(function () {
    if (window.location.hash !== "#lets_play") {
      location.reload();
    }
  }, 100);
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

function handleGameEnd(message, winningLine) {
  cells.forEach((cell) => {
    cell.removeEventListener("click", handleCellClick);
    cell.classList.add("clicked");
  });

  if (winningLine[0] === "d") {
    winningBar.style.setProperty("--rotation-winning-bar", winningLine[1] === "1" ? "-45deg" : "45deg");
    winningBar.style.setProperty("--top-winning-bar", "-19%");
    winningBar.style.setProperty("--left-winning-bar", "50%");
    winningBar.style.setProperty("--width-winning-bar", "2%");
    winningBar.style.setProperty("--height-winning-bar", "138%");
  } else if (winningLine[0] === "h") {
    winningBar.style.setProperty("--left-winning-bar", "0");
    winningBar.style.setProperty(
      "--top-winning-bar",
      "calc(16.67% * " + getDisplacementFactor(winningLine) + " - 1% " + getPixelAdjustment(winningLine) + ")"
    );
    winningBar.style.setProperty("--width-winning-bar", "100%");
    winningBar.style.setProperty("--height-winning-bar", "2%");
  } else if (winningLine[0] === "v") {
    winningBar.style.setProperty("--top-winning-bar", "0%");
    winningBar.style.setProperty(
      "--left-winning-bar",
      "calc(16.67% * " + getDisplacementFactor(winningLine) + " - 1% " + getPixelAdjustment(winningLine) + ")"
    );
    winningBar.style.setProperty("--width-winning-bar", "2%");
    winningBar.style.setProperty("--height-winning-bar", "100%");
  }

  winningBar.style.display = "block";
  winningBar.classList.add("winningBarAnimation");
}

function getDisplacementFactor(winningLine) {
  if (winningLine[1] === "1") {
    return "1";
  } else if (winningLine[1] === "2") {
    return "3";
  } else {
    return "5";
  }
}

function getPixelAdjustment(winningLine) {
  if (winningLine[1] === "1") {
    return "- 3px";
  } else if (winningLine[1] === "2") {
    return "";
  } else {
    return "+ 3px";
  }
}

btnCreateGame.addEventListener("click", (e) => {
  inputGameCode.value = "";
  socket.emit("create-new-game");
});

btnJoinGame.addEventListener("click", (e) => {
  socket.emit("join-game", inputGameCode.value);
});
