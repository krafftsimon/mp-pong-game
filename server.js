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
let ballUpdateRate = 50;
let inputs = []
let rooms = [{player1: new Player(20), player2: new Player(760), ball: new Ball() , inputsP1: [], inputsP2: [], ballSteps: []}]

// Whenever someone connects this gets executed.
io.on('connection', function(socket) {
  console.log('A user connected.');
  if(io.nsps['/'].adapter.rooms["room-" + roomNum] && io.nsps['/'].adapter.rooms["room-" + roomNum].length > 1) {
     roomNum++;
     playerNum = 1;
     rooms.push({player1: new Player(20), player2: new Player(760), ball: new Ball() , inputsP1: [], inputsP2: [], ballSteps: []});
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
  for (let i in rooms) {
    processInputs(i);
  }
  sendGameState();
}, 1000 / updateRate);

setInterval(function() {
  for (let i in rooms) {
    moveBall(i);
  }
}, 1000 / ballUpdateRate);

function processInputs(i) {
  for (let y in rooms[i].inputsP1) {
    rooms[i].player1.applyInput(rooms[i].inputsP1[y]);
    rooms[i].inputsP1[y].result = rooms[i].player1.y;
  }
  for (let y in rooms[i].inputsP2) {
    rooms[i].player2.applyInput(rooms[i].inputsP2[y]);
    rooms[i].inputsP2[y].result = rooms[i].player2.y;
  }
}

function moveBall(i) {
  // Move the ball.
  rooms[i].ball.move(rooms[i].player1, rooms[i].player2);
  // Save the new position of the ball.
  rooms[i].ballSteps.push({x: rooms[i].ball.x, y: rooms[i].ball.y});
}

function sendGameState() {
  console.log(rooms[0].inputsP1);
  io.sockets.emit('gameState', rooms);
  //clear list of inputs received and ball steps for the next update
  for (let i in rooms) {
    rooms[i].inputsP1 = [];
    rooms[i].inputsP2 = [];
    rooms[i].ballSteps = [];
  }
}

server.listen(port, () => console.log(`Running on localhost:${port}`));
