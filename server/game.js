function createGameState() {
  return {
    cells: ["", "", "", "", "", "", "", "", ""],
    nextVal: "X",
  };
}

function hasPlayerWon(gameState) {
  if (gameState.cells[4] !== "") {
    if (gameState.cells[0] === gameState.cells[4] && gameState.cells[4] === gameState.cells[8]) {
      return { winner: gameState.cells[0], winningLine: "d1" };
    }
    if (gameState.cells[1] === gameState.cells[4] && gameState.cells[4] === gameState.cells[7]) {
      return { winner: gameState.cells[1], winningLine: "v2" };
    }
    if (gameState.cells[2] === gameState.cells[4] && gameState.cells[4] === gameState.cells[6]) {
      return { winner: gameState.cells[2], winningLine: "d2" };
    }
    if (gameState.cells[3] === gameState.cells[4] && gameState.cells[4] === gameState.cells[5]) {
      return { winner: gameState.cells[3], winningLine: "h2" };
    }
  }
  if (gameState.cells[0] !== "") {
    if (gameState.cells[0] === gameState.cells[1] && gameState.cells[1] === gameState.cells[2]) {
      return { winner: gameState.cells[0], winningLine: "h1" };
    }

    if (gameState.cells[0] === gameState.cells[3] && gameState.cells[3] === gameState.cells[6]) {
      return { winner: gameState.cells[0], winningLine: "v1" };
    }
  }
  if (gameState.cells[8] !== "") {
    if (gameState.cells[6] === gameState.cells[7] && gameState.cells[7] === gameState.cells[8]) {
      return { winner: gameState.cells[6], winningLine: "h3" };
    }
    if (gameState.cells[2] === gameState.cells[5] && gameState.cells[5] === gameState.cells[8]) {
      return { winner: gameState.cells[2], winningLine: "v3" };
    }
  }

  for (let cell of gameState.cells) {
    if (cell === "") return {};
  }

  return { winner: "T" };
}

module.exports = {
  createGameState,
  hasPlayerWon,
};
