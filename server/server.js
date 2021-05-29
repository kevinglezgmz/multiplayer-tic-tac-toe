const PORT = process.env.PORT || 5000;

const io = require("socket.io")(PORT, {
  cors: {
    origin: "*",
  },
});

const { createGameState, hasPlayerWon } = require("./game");

const globalState = {};
const clientRooms = {};

function makeid(length) {
  var result = "";
  var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return globalState[result] ? makeid(5) : result;
}

io.on("connection", (socket) => {
  socket.on("clicked-cell", handleClickedCell);
  socket.on("create-new-game", handleCreateNewGame);
  socket.on("join-game", handleJoinGame);
  socket.on("request-rematch", handleRequestRematch);
  socket.on("accept-rematch", handleAcceptRematch);
  socket.on("disconnect", handleDisconnect);

  function handleDisconnect() {
    const roomName = clientRooms[socket.id];
    if (roomName) {
      socket.to(roomName).emit("player-disconnected");
      delete clientRooms[socket.id];
      if (Object.keys(clientRooms).filter((id) => clientRooms[id] === roomName).length === 0) {
        delete globalState[roomName];
      }
    }
  }

  function handleAcceptRematch() {
    const roomName = clientRooms[socket.id];
    globalState[roomName] = createGameState();
    io.to(roomName).emit("rematch-accepted");
    io.to(roomName).emit("game-update", JSON.stringify(globalState[roomName]), 1);
  }

  function handleRequestRematch(roomName) {
    socket.to(roomName).emit("rematch-request");
  }

  function handleCreateNewGame() {
    let roomName = makeid(5);
    clientRooms[socket.id] = roomName;
    socket.emit("game-code", roomName);

    globalState[roomName] = createGameState();

    socket.join(roomName);
    socket.playerNumber = 1;
    socket.emit("game-init", socket.playerNumber);
  }

  function handleJoinGame(roomName) {
    const room = io.sockets.adapter.rooms.get(roomName);

    let numClients = room ? room.size : 0;

    if (numClients === 0) {
      socket.emit("unknown-code");
      return;
    } else if (numClients > 1) {
      socket.emit("too-many-players");
      return;
    }

    clientRooms[socket.id] = roomName;

    socket.join(roomName);
    socket.playerNumber = 2;
    socket.emit("game-init", socket.playerNumber);
    io.to(roomName).emit("game-update", JSON.stringify(globalState[roomName]), 1);
  }

  function handleClickedCell(clickedCellIndex) {
    const roomName = clientRooms[socket.id];
    if (!roomName) return;
    const gameState = globalState[roomName];
    gameState.cells[clickedCellIndex] = gameState.nextVal;
    gameState.nextVal = gameState.nextVal === "X" ? "O" : "X";
    const nextPlayerTurn = gameState.nextVal === "X" ? 1 : 2;
    const { winner, winningLine } = hasPlayerWon(gameState);
    io.to(roomName).emit("game-update", JSON.stringify(gameState), winner ? 3 : nextPlayerTurn);
    if (winner) {
      io.to(roomName).emit("game-end", winner, winningLine);
    }
  }
});
