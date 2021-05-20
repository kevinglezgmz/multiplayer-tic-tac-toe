const cells = document.querySelectorAll(".cell");
const btnRestart = document.querySelector(".btn");

const gameState = {
  cells: [],
  nextVal: "X",
};

function initGame() {
  cells.forEach((cell, index) => {
    cell.classList.remove("clicked");
    btnRestart.classList.add("restart");
    cell.addEventListener("click", handleClick);
    cell.setAttribute("data-cell", index);
  });

  gameState.cells = ["", "", "", "", "", "", "", "", ""];
  gameState.nextVal = "X";

  paintCells(gameState);
}

function handleClick(e) {
  clickedCell = e.target;
  const cellIndex = clickedCell.getAttribute("data-cell");
  gameState.cells[cellIndex] = gameState.nextVal;
  paintCells(gameState);
  const winner = hasPlayerWon(gameState);
  if (winner) {
    if (winner === "T") {
      alert("Tie!");
    } else {
      alert(winner + " has won!");
    }
    endGame(gameState);
  }
  gameState.nextVal = gameState.nextVal === "X" ? "O" : "X";
}

function hasPlayerWon(gameState) {
  if (gameState.cells[4] !== "") {
    if (gameState.cells[0] === gameState.cells[4] && gameState.cells[4] === gameState.cells[8]) {
      return gameState.cells[0];
    }
    if (gameState.cells[1] === gameState.cells[4] && gameState.cells[4] === gameState.cells[7]) {
      return gameState.cells[1];
    }
    if (gameState.cells[2] === gameState.cells[4] && gameState.cells[4] === gameState.cells[6]) {
      return gameState.cells[2];
    }
    if (gameState.cells[3] === gameState.cells[4] && gameState.cells[4] === gameState.cells[5]) {
      return gameState.cells[3];
    }
  }
  if (gameState.cells[0] !== "") {
    if (gameState.cells[0] === gameState.cells[1] && gameState.cells[1] === gameState.cells[2]) {
      return gameState.cells[0];
    }

    if (gameState.cells[0] === gameState.cells[3] && gameState.cells[3] === gameState.cells[6]) {
      return gameState.cells[0];
    }
  }
  if (gameState.cells[8] !== "") {
    if (gameState.cells[6] === gameState.cells[7] && gameState.cells[7] === gameState.cells[8]) {
      return gameState.cells[6];
    }
    if (gameState.cells[2] === gameState.cells[5] && gameState.cells[5] === gameState.cells[8]) {
      return gameState.cells[2];
    }
  }

  for (let cell of gameState.cells) {
    if (cell === "") return false;
  }

  return "T";
}

function paintCells(gameState) {
  for (let i = 0; i < cells.length; i++) {
    cells[i].innerText = gameState.cells[i];
    if (gameState.cells[i] !== "") {
      cells[i].classList.add("clicked");
      clickedCell.removeEventListener("click", handleClick);
    }
  }
}

function endGame() {
  cells.forEach((cell) => {
    cell.removeEventListener("click", handleClick);
    cell.classList.add("clicked");
  });
  btnRestart.classList.remove("restart");
}

initGame();
