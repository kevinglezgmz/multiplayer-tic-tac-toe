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
const gameEndPopup = document.getElementById("gameEndPopup");
const disconnectPopup = document.getElementById("disconnectPopup");
const btnRematch = document.getElementById("btnRematch");

const socket = io("https://tic-server.herokuapp.com/");

let player;
let gameStatus;

socket.on("game-init", handleGameInit);
socket.on("game-update", handleGameUpdate);
socket.on("game-end", handleGameEnd);
socket.on("unknown-code", handleUnknownCode);
socket.on("too-many-players", handleTooManyPlayers);
socket.on("game-code", handleGameCode);
socket.on("rematch-request", handleRematchRequest);
socket.on("rematch-accepted", handleRematchAccepted);
socket.on("player-disconnected", handlePlayerDisconnect);

function handleGameCode(gameCode) {
  inputGameCode.value = gameCode;
  loader.style.display = "block";
  lblGameStatus.innerText = "Waiting for a second player to join.";
}

function handleUnknownCode() {
  createMessageDialog("Wrong code", "Invalid code. Please try again.");
}

function handleTooManyPlayers() {
  createMessageDialog("Game in progress", "Room's full. Create a new game.");
}

function handleGameInit(playerNumber) {
  cells.forEach((cell, index) => {
    cell.classList.remove("clicked");
    cell.setAttribute("data-cell", index);
  });

  player = playerNumber;

  cellContainer.style.display = "grid";
  landingContainer.style.display = "none";
  const gameCode = document.getElementById("gameCode");
  gameCode.innerText = inputGameCode.value + ".";
  gameCode.addEventListener("click", (e) => {
    if (!navigator.clipboard) {
      const tempInput = document.createElement("input");
      tempInput.style.height = "0";
      tempInput.style.padding = "0";
      document.body.append(tempInput);
      tempInput.setAttribute("value", inputGameCode.value);
      tempInput.select();
      document.execCommand("copy");
      tempInput.remove();
      createMessageDialog("Copied!", "Game code " + inputGameCode.value + " has been copied to the clipboard!");
    } else {
      navigator.clipboard
        .writeText(inputGameCode.value)
        .then(() => {
          createMessageDialog("Copied!", "Game code " + inputGameCode.value + " has been copied to the clipboard!");
        })
        .catch((err) => {
          createMessageDialog("Error", "Could not copy to clipboard");
        });
    }
  });
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
  gameStatus = "running";
  gameState = JSON.parse(gameState);
  for (let i = 0; i < cells.length; i++) {
    if (gameState.cells[i] !== "") {
      const iconIndex = gameState.cells[i] === "X" ? 1 : 0;
      cells[i].children[iconIndex].classList.add("visible-icon");
    } else {
      cells[i].children[0].classList.remove("visible-icon");
      cells[i].children[1].classList.remove("visible-icon");
    }

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
    createMessageDialog("Your turn!", "Make a move!.");
  } else if (playerNumber === 3) {
    lblGameStatus.innerText = "Game over!";
  } else {
    lblGameStatus.innerText = "It's your opponent's turn. Please wait!";
  }
  loader.style.display = "none";
}

function handleGameEnd(winner, winningLine) {
  gameStatus = "ended";

  cells.forEach((cell) => {
    cell.removeEventListener("click", handleCellClick);
    cell.classList.add("clicked");
  });

  if (winner === "T") {
    popupContent.innerText = "There has been a tie!";
  } else if ((player === 1 && winner === "X") || (player === 2 && winner === "O")) {
    popupContent.innerText = "Congratulations! You won!";
  } else {
    popupContent.innerText = "You lose! Better luck next time!";
  }

  // default winning line is horizontal
  if (winningLine) {
    let [rotationBarVar, rotationBarVal] = ["--rotation-winning-bar", "0"];
    let [topBarVar, topBarVal] = [
      "--top-winning-bar",
      "calc(16.67% * " + getDisplacementFactor(winningLine) + " - 1% " + ")",
    ];
    let [leftBarVar, leftBarVal] = ["--left-winning-bar", "0"];
    let [widthBarVar, widthBarVal] = ["--width-winning-bar", "100%"];
    let [heightBarVar, heightBarVal] = ["--height-winning-bar", "2%"];

    if (winningLine[0] === "d") {
      rotationBarVal = winningLine[1] === "1" ? "-45deg" : "45deg";
      topBarVal = winningLine[1] === "1" ? "-18.3%" : "-19.8%";
      leftBarVal = "50%";
      widthBarVal = "2%";
      heightBarVal = "138%";
    } else if (winningLine[0] === "v") {
      topBarVal = "0";
      leftBarVal = "calc(16.67% * " + getDisplacementFactor(winningLine) + " - 1%" + ")";
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
  }

  setTimeout(() => {
    btnRematch.style.display = "block";
    btnRematch.addEventListener("click", handleRematchBtn);
    openPopup();
  }, 1000);
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

function openPopup() {
  gameEndPopup.setAttribute("data-target", "true");
}

function closePopup() {
  gameEndPopup.setAttribute("data-target", "false");
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
  createMessageDialog("Your opponent wants play again!", "Press rematch to accept.");
  btnRematch.removeEventListener("click", handleRematchBtn);
  btnRematch.addEventListener("click", handleAcceptRematchBtn);
}

function handleAcceptRematchBtn(e) {
  btnRematch.removeEventListener("click", handleAcceptRematchBtn);
  socket.emit("accept-rematch");
}

function handlePlayerDisconnect() {
  if (gameStatus === "running") {
    disconnectPopup.setAttribute("data-target", "true");
  } else if (gameStatus === "ended") {
    gameEndPopup.setAttribute("data-target", "true");
    btnRematch.setAttribute("disabled", "true");
    btnRematch.innerText = "Rematch not available";
    createMessageDialog("Player left", "Woops! Your opponent left, please go home.");
  }
}

btnCreateGame.addEventListener("click", (e) => {
  inputGameCode.value = "";
  socket.emit("create-new-game");
});

btnJoinGame.addEventListener("click", (e) => {
  socket.emit("join-game", inputGameCode.value);
});

inputGameCode.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    socket.emit("join-game", inputGameCode.value);
  }
});

inputGameCode.addEventListener("input", (e) => {
  inputGameCode.value = inputGameCode.value.toUpperCase();
});

const messagesContainer = document.getElementById("messagesContainer");
const messagesWrapper = document.getElementById("messagesWrapper");

function createMessageDialog(titleText, messageText) {
  const newMessage = document.createElement("div");
  newMessage.classList.add("message");
  const title = document.createElement("h3");
  title.innerText = titleText;
  const messageContent = document.createElement("div");
  messageContent.classList.add("content");
  messageContent.innerText = messageText;
  newMessage.appendChild(title);
  newMessage.appendChild(messageContent);
  newMessage.addEventListener("click", (ev) => {
    destroyMessageDialog(newMessage, 0);
  });
  messagesContainer.appendChild(newMessage);
  setTimeout(() => {
    newMessage.setAttribute("data-hidden", "false");
  }, 0);
  messagesWrapper.scrollTop = messagesWrapper.scrollHeight;
  destroyMessageDialog(newMessage, 3500);
}

function destroyMessageDialog(messageElement, delay) {
  setTimeout(() => {
    messageElement.setAttribute("data-hidden", "true");
    setTimeout(() => {
      messageElement.remove();
    }, 550);
  }, delay);
}
