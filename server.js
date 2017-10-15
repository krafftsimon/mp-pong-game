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

let updateRate = 10;
let ballUpdateRate = 50;
let inputs = [];
let balls = Array(2).fill();
let rooms = Array(2).fill();
for (let i = 0; i < rooms.length; i++) {
  balls[i] = new Ball(400);
  rooms[i] = {playersInRoom: [],
              player1: new Player(20),
              player2: new Player(760),
              inputsP1: [],
              inputsP2: [],
              lastProcessedInputP1: 0,
              lastProcessedInputP2: 0,
              ballSteps: [],
              pointsP1: 0,
              pointsP2: 0,
              gameState: "waitingForPlayer",
              powerupOnBoard: 0,  // 0 - none, 1 - grow, 2 - shrink, 3 - duplicate, 4 - slow, 5 - fast
              powerupsActive:[false, false, false, false, false],
              powerupX: 200,
              powerupY: 200};
}
// Whenever someone connects this gets executed.
io.on('connection', function(socket) {
  joinRoom(socket);

  // Whenever a player moves.
  socket.on('userInput', function(input) {
    let roomNum = input.roomNum - 1;
    if (input.playerNum === 1) {
      rooms[roomNum].inputsP1.push(input);
    } else {
      rooms[roomNum].inputsP2.push(input);
    }
  });

  socket.on('racketCollision', function(collision) {
    let roomNum = collision.roomNum - 1;

  })

  // Whenever a player is disconnecting (hasn't left the room yet)
  socket.on('disconnecting', function(){
    leaveRoom(socket);
  });

   // Whenever someone disconnects, this piece of code is executed.
   socket.on('disconnect', function () {
     //console.log('A user disconnected.');
   });
});

function joinRoom(socket) {
  let i = 0
  // Fine a non-full room.
  while(i < rooms.length) {
    if (rooms[i].playersInRoom.length < 2) {
      socket.join("room-" + (i + 1), () => {
        let room = Object.keys(socket.rooms);
        console.log("A user connected, and joined " + room); // [ <socket.id>, 'room 237' ]
      });
      break;
    }
    i++;
  }

  // Figure out what player joined based on number of players already in the room.
  let nickname;
  if (rooms[i].playersInRoom.length === 0) {
    rooms[i].playersInRoom.push("player1");
    nickname = "player1";
  } else if (rooms[i].playersInRoom[0] === "player1") {
    rooms[i].playersInRoom.push("player2");
    nickname = "player2";
  } else {
    rooms[i].playersInRoom.push("player1");
    nickname = "player2";
  }
  socket.nickname = nickname;
  // Send this event to everyone in the room.
  io.sockets.in("room-" + (i + 1)).emit('connectToRoom', i + 1);
  io.to(socket.id).emit('playerNumber', Number(socket.nickname.charAt(6)));
  // Set game state to starting
  if (rooms[i].playersInRoom.length === 2) {
    countDown(i);
  }
}

function leaveRoom(socket) {
  let room = Object.keys(socket.rooms);
  let roomNumber = room[1].charAt(5);
  console.log(socket.nickname + " left room number " + roomNumber)
  // Get the room object corresponding to the room that was left.
  //let room = io.sockets.adapter.rooms[roomLeft[1]];
  if (rooms[roomNumber - 1].playersInRoom.indexOf(socket.nickname) === 0) {
    rooms[roomNumber - 1].playersInRoom.splice(0, 1);
  } else if (rooms[roomNumber - 1].playersInRoom.indexOf(socket.nickname) === 1) {
    rooms[roomNumber - 1].playersInRoom.splice(1, 1);
  }
}

// Game physics loop for everything except the ball.
setInterval(function() {
  for (let i in rooms) {
    if (rooms[i].gameState === "started") {
      processInputs(i);
      //spawnPowerups(i);
    }
  }
  sendGameState();
}, 1000 / updateRate);


// Loop for ball movements.
setInterval(function() {
  for (let i in rooms) {
    if (rooms[i].gameState === "started") {
      moveBall(i);
      if (balls[i].x <= 10) {
        rooms[i].pointsP2++;
        countDown(i);
      } else if (balls[i].x >= 790) {
        rooms[i].pointsP1++;
        countDown(i);
      }
    }
  }
  sendBallPosition();
}, 1000 / ballUpdateRate);

function processInputs(i) {
  for (let y in rooms[i].inputsP1) {
    rooms[i].player1.applyInput(rooms[i].inputsP1[y]);
    rooms[i].lastProcessedInputP1 = rooms[i].inputsP1[y].inputNumber;
  }
  for (let y in rooms[i].inputsP2) {
    rooms[i].player2.applyInput(rooms[i].inputsP2[y]);
    rooms[i].lastProcessedInputP2 = rooms[i].inputsP2[y].inputNumber;
  }
}

function moveBall(i) {
  // Move the ball.
  balls[i].move(rooms[i].player1, rooms[i].player2);
}

function spawnPowerups(i) {
  // Check if there already is a powerup on the board.
  if (rooms[i].powerupOnBoard === 0) {
    let randomNum = Math.floor((Math.random() * 1000));
    if (randomNum < 10) {
      rooms[i].powerupOnBoard = 1;
    } else if (randomNum < 20) {
      rooms[i].powerupOnBoard = 2;
    } else if (randomNum < 30) {
      rooms[i].powerupOnBoard = 3;
    } else if (randomNum < 40) {
      rooms[i].powerupOnBoard = 4;
    } else if (randomNum < 50) {
      rooms[i].powerupOnBoard = 5;
    }
    rooms[i].powerupX = Math.floor(Math.random() * 700) + 100;
    rooms[i].powerupY = Math.floor(Math.random() * 550) + 50;
  }
}

function sendGameState() {
  io.sockets.emit('gameState', rooms);
  //clear list of inputs received and ball steps for the next update
  for (let i in rooms) {
    rooms[i].inputsP1 = [];
    rooms[i].inputsP2 = [];
    rooms[i].ballSteps = [];
  }
}

function sendBallPosition() {
  io.sockets.emit('ballPosition', balls);
}

function countDown(i) {
  //rooms[i].gameState = "started";
  rooms[i].gameState = "starting";
  // Reset ball position
  balls[i].x = 400;
  balls[i].y = 300;
  setTimeout(function() {
    rooms[i].gameState = "started";
  }, 3000);
}

server.listen(port, () => console.log(`Running on localhost:${port}`));
