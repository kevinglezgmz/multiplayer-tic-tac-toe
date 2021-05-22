function createGameState() {
  return {
    cells: ["", "", "", "", "", "", "", "", ""],
    nextVal: "X",
  };
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

function handleClickedCell(player, clickedCellIndex) {}

module.exports = {
  createGameState,
  hasPlayerWon,
};
