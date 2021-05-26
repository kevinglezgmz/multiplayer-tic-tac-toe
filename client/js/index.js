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
const popupContent = document.getElementById("popupContent");
const popup = document.getElementById("gameEndPopup");
const btnRematch = document.getElementById("btnRematch");

const socket = io("https://tic-server.herokuapp.com/");

let player;

socket.on("game-init", handleGameInit);
socket.on("game-update", handleGameUpdate);
socket.on("game-end", handleGameEnd);
socket.on("unknown-code", handleUnknownCode);
socket.on("too-many-players", handleTooManyPlayers);
socket.on("game-code", handleGameCode);
socket.on("rematch-request", handleRematchRequest);
socket.on("rematch-accepted", handleRematchAccepted);

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

  const backInterval = setInterval(function () {
    if (window.location.hash !== "#lets_play") {
      location.reload();
      clearInterval(backInterval);
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

function handleGameEnd(winner, winningLine) {
  cells.forEach((cell) => {
    cell.removeEventListener("click", handleCellClick);
    cell.classList.add("clicked");
  });

  // default winning line is horizontal
  let [rotationBarVar, rotationBarVal] = ["--rotation-winning-bar", "0"];
  let [topBarVar, topBarVal] = [
    "--top-winning-bar",
    "calc(16.67% * " + getDisplacementFactor(winningLine) + " - 1% " + getPixelAdjustment(winningLine) + ")",
  ];
  let [leftBarVar, leftBarVal] = ["--left-winning-bar", "0"];
  let [widthBarVar, widthBarVal] = ["--width-winning-bar", "100%"];
  let [heightBarVar, heightBarVal] = ["--height-winning-bar", "2%"];

  if (winningLine[0] === "d") {
    rotationBarVal = winningLine[1] === "1" ? "-45deg" : "45deg";
    topBarVal = "-19%";
    leftBarVal = "50%";
    widthBarVal = "2%";
    heightBarVal = "138%";
  } else if (winningLine[0] === "v") {
    topBarVal = "0";
    leftBarVal = "calc(16.67% * " + getDisplacementFactor(winningLine) + " - 1% " + getPixelAdjustment(winningLine) + ")";
    widthBarVal = "2%";
    heightBarVal = "100%";
  }

  winningBar.style.setProperty(rotationBarVar, rotationBarVal);
  winningBar.style.setProperty(topBarVar, topBarVal);
  winningBar.style.setProperty(leftBarVar, leftBarVal);
  winningBar.style.setProperty(widthBarVar, widthBarVal);
  winningBar.style.setProperty(heightBarVar, heightBarVal);

  winningBar.style.display = "block";
  winningBar.classList.add("winningBarAnimation");

  if (winner === "T") {
    popupContent.innerText = "There has been a tie!";
  } else if ((player === 1 && winner === "X") || (player === 2 && winner === "O")) {
    popupContent.innerText = "Congratulations! You won!";
  } else {
    popupContent.innerText = "You lose! Better luck next time!";
  }

  btnRematch.addEventListener("click", handleRematchBtn);
  openPopup();
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

function openPopup() {
  popup.setAttribute("data-target", "true");
}

function closePopup() {
  popup.setAttribute("data-target", "false");
}

function handleRematchAccepted() {
  closePopup();
  winningBar.style.display = "none";
  winningBar.classList.remove("winningBarAnimation");
}

function handleRematchBtn(e) {
  socket.emit("request-rematch", inputGameCode.value);
}

function handleRematchRequest() {
  popupContent.innerText = "Your opponent wants to play again. Press rematch to accept.";
  btnRematch.removeEventListener("click", handleRematchBtn);
  btnRematch.addEventListener("click", handleAcceptRematchBtn);
}

function handleAcceptRematchBtn(e) {
  btnRematch.removeEventListener("click", handleAcceptRematchBtn);
  socket.emit("accept-rematch");
}

btnCreateGame.addEventListener("click", (e) => {
  inputGameCode.value = "";
  socket.emit("create-new-game");
});

btnJoinGame.addEventListener("click", (e) => {
  socket.emit("join-game", inputGameCode.value);
});
