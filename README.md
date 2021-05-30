# Multiplayer Tic-Tac-Toe

This is the traditional Tic-Tac-Toe game (sometimes called Noughts and Crosses) which you can play online with a friend.

You can play it clicking [here.](https://multiplayer-tic-tac-toe.netlify.app/ "Multiplayer Tic-Tac-Toe")

## Why did i choose to build this game?

### Simple and easy to understand

Tic-Tac-Toe is globally played and there is no language nor any other specific barrier to play it.

### It helped me learn about layout structure using both HTML and CSS

I have built other sites using bootstrap, but using this framework sometimes limits the amount of things that you can learn about both HTML and CSS.

#### These are some of the things i learned while building the game:

- Making a minimalistic and straight-foward home menu for the game. 
![Home menu](https://i.ibb.co/KNk317p/Captura-de-pantalla-2021-05-29-150416.png "Home menu")

- Designing and animating popup messages for the user. 
![Popups](https://i.ibb.co/1nmT59B/popup-messages.png "Popup messages")

- Creating a 3x3 grid with animations for both new movements and winning lines using CSS.
![3x3 grid](https://i.ibb.co/rGRHCMH/grid.png "Game grid")

- Designing and animating a tooltip.
![Tooltips](https://i.ibb.co/MS03vSQ/tooltip.png "Tooltips")

- Designing and animating an overlay/modal for the end of the game.
![Overlay](https://i.ibb.co/J5yJM5X/overlay.png "Overlay")

### It helped me to grow as a developer

While building the site i was able to understand the importance of implementing good practices such as dividing the site into components (like the menu, the game grid, the popup messages, the overlay/modal and the tooltips) and writing clean code to help better the code management.

Im still learning about best practices and how to improve while writing, but im now a step closer to achieve my goals.

### It helped me learn about websockets and real-time communication using the socket.io library

Socket.io real time communication is possible by establishing a TCP socket connection between the client and the server. Then, by the use of events, communication can flow fast and easy between client and server.

Understanding how to use socket.io to communicate the client with server using websockets is really simple, these are the few steps you need to make to start communicating clients with the server.

#### To use the socket.io library in the server's side:

- Install socket.io using npm.

      $ npm install socket.io

- Require socket.io and call the imported function with an available port to start listening on that port.

  ```javascript
  const io = require("socket.io")(PORT);
  ```

- Create a listener callback function for the "connection" event (which occurs when a client socket first establishes a connection).

  ```javascript
  io.on("connection", (socket) => { /* Define events */}
  ```

- That's it! This is how you would send a "connected" event with some data to a client that just made a connection with the server while using socket.io.

  ```javascript
  io.on("connection", (socket) => {
    socket.emit("connected", {data: "Hello World"});
  }
  ```

#### To use the socket.io library in the client's side:

- Import the socket.io's CDN script to be used by the browser.

  ```html
  <script
    src="https://cdn.socket.io/3.1.3/socket.io.min.js"
    integrity="sha384-cPwlPLvBTa3sKAgddT6krw0cJat7egBga3DJepJyrLl4Q9/5WLra3rrnMcyTyOnh"
    crossorigin="anonymous"
  ></script>
  ```

- `io` will now be registered as a global variable. Which you can initialize with the server's url to establish a connection.

  ```javascript
  const socket = io("URL");
  ```

- Thats it! You can now listen and emit events with the server. This is how you would listen to the "connected" event we defined earlier.

  ```javascript
  socket.on("connected", (data) => {
    console.log(data);
  });
  ```

###
