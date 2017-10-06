const express = require('express');
const path = require ('path');
const http = require('http');
const app = express();
const Player = require('./server/models/player');
const Ball = require('./server/models/ball');
// Serve static files
app.use(express.static(path.join(__dirname, 'dist')));

// Return other routes to Angular index file..
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

// Set port.
const port = process.env.PORT || '4400';
app.set('port', port);

// Create the HTTP Server.
const server = http.createServer(app);


const io = require('socket.io')(server);

//variables
let roomNum = 1;
let playerNum = 1;
let updateRate = 10;
let inputs = []
let rooms = [{player1: new Player(20), player2: new Player(760), ball: new Ball() , inputsP1: [], inputsP2: []}]

// Whenever someone connects this gets executed.
io.on('connection', function(socket) {
  console.log('A user connected.');
  if(io.nsps['/'].adapter.rooms["room-" + roomNum] && io.nsps['/'].adapter.rooms["room-" + roomNum].length > 1) {
     roomNum++;
     playerNum = 1;
     rooms.push({player1: new Player(20), player2: new Player(760), ball: new Ball() , inputsP1: [], inputsP2: []});
  }
  socket.join("room-" + roomNum);
  // Send this event to everyone in the room.
  io.sockets.in("room-" + roomNum).emit('connectToRoom', roomNum);
  io.to(socket.id).emit('playerNumber', playerNum);
  playerNum = 2;

  // Whenever a player moves.
  socket.on('userInput', function(input) {
    let roomNum = input.roomNum - 1;
    if (input.playerNum === 1) {
      rooms[roomNum].inputsP1.push(input);
    } else {
      rooms[roomNum].inputsP2.push(input);
    }
   });

   // Whenever someone disconnects, this piece of code is executed.
   socket.on('disconnect', function () {
     playerNum = 1;
     console.log('A user disconnected.');
   });
});

//game physics loop
setInterval(function() {
  for (i in rooms) {
    processInputs(i)
    moveBall(i)
  }
  sendGameState()
}, 1000 / updateRate);

function processInputs(i) {
  for (y in rooms[i].inputsP1) {
    rooms[i].player1.applyInput(rooms[i].inputsP1[y])
  }
  for (y in rooms[i].inputsP2) {
    rooms[i].player2.applyInput(rooms[i].inputsP2[y])
  }
  rooms[i].inputsP1 = [];
  rooms[i].inputsP2 = [];
}

function moveBall(i) {
  rooms[i].ball.move();
}

function sendGameState() {
  io.sockets.emit('gameState', rooms);
}

server.listen(port, () => console.log(`Running on localhost:${port}`));
