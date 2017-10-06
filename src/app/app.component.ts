import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { GameService } from './game.service';
import { Player } from './player';
import { Ball } from './ball';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  roomNum;
  updateRate: number = 50; //in hertz
  updateInterval;
  clientPlayerNum;
  directionP1: number = 0;
  player1: Player;
  player2: Player;
  ball: Ball;

  constructor(private gameService: GameService) {
    this.player1 = new Player(20);
    this.player2 = new Player(760);
    this.ball = new Ball;
  }

  @ViewChild("gameCanvas") canvas: ElementRef;
  @HostListener('window:keydown', ['$event']) keyUp(event: KeyboardEvent) {
    if (event.keyCode === 38) {
      this.directionP1 = -1;
    } else if (event.keyCode === 40) {
      this.directionP1 = 1;
    }
  }
  @HostListener('window:keyup', ['$event']) keyDown(event: KeyboardEvent) {
    if (event.keyCode === 38) {
      this.directionP1 = 0;
    } else if (event.keyCode === 40) {
      this.directionP1 = 0;
    }
  }



  ngOnInit() {
    this.gameService.connect().subscribe(
      data => this.roomNum = data,
      error => console.log(error),
      () => console.log("Completed.")
    );
    this.gameService.getPlayerNumber().subscribe(
      data => this.clientPlayerNum = data,
      error => console.log(error),
      () => console.log("Completed.")
    );
    this.setUpdateRate(this.updateRate);
  }

  setUpdateRate(frequency) {
    clearInterval(this.updateInterval)
    this.updateInterval = setInterval((function(self) {
      return function() {self.updateGame();}
    })(this), 1000 / frequency)
  }

  updateGame() {
    this.processServerData();
    this.processUserInputs();
    this.drawCanvas();
  }

  processServerData() {
    this.gameService.getState().subscribe(
      data => {
        this.player1.y = data[this.roomNum - 1].player1.y;
        this.player2.y = data[this.roomNum - 1].player2.y;
        this.ball.x = data[this.roomNum - 1].ball.x;
        this.ball.y = data[this.roomNum - 1].ball.y;
      }
    )
  }

  processUserInputs() {
    let input = {direction: this.directionP1, playerNum: this.clientPlayerNum, roomNum: this.roomNum};
    if (typeof this.roomNum != 'undefined') {
      this.gameService.sendUserInput(input);
    }
    // Client-side prediction.
    if (this.clientPlayerNum === 1) {
      this.player1.applyInput(input);
    } else {
      this.player2.applyInput(input);
    }

  }

  drawCanvas() {
    let context: CanvasRenderingContext2D = this.canvas.nativeElement.getContext("2d");
    context.clearRect(0, 0, 800, 600);
    context.beginPath();
    context.rect(this.player1.x, this.player1.y, 20, 100);
    context.rect(this.player2.x, this.player2.y, 20, 100);
    context.stroke();
    context.beginPath();
    context.arc(this.ball.x, this.ball.y, 5, 0, 2*Math.PI);
    context.stroke();
  }
  //gameLoop() {
  //  this.gameService.getState().subscribe(
  //    data => {
  //      if (this.playerNum === 1) {
  //        this.yP2 = data[this.roomNum - 1].yP2;
  //      } else {
  //        this.yP2 = data[this.roomNum - 1].yP1;
  //      }
  //      this.xBall = data[this.roomNum - 1].xBall;
  //      this.yBall = data[this.roomNum - 1].yBall
  //    },
  //    () => console.log("state fetch completed.")
  //  );
  //  this.updatePaddlePosition();
  //  this.draw();
//
  //  requestAnimationFrame(this.gameLoop.bind(this));
  //}



    //switch(this.ballDirection) {
    //  case 0: {
    //    this.yBall -= 5;
    //    break;
    //  }
    //  case 22.5: {
    //    this.xBall += 2;
    //    this.yBall -= 4;
    //    break;
    //  }
    //  case 45: {
    //    this.xBall += 3;
    //    this.yBall -= 3;
    //    break;
    //  }
    //  case 67.5: {
    //    this.xBall += 4;
    //    this.yBall -= 2;
    //    break;
    //  }
    //  case 90: {
    //    this.xBall += 5;
    //    break;
    //  }
    //  case 112.5: {
    //    this.yBall -= 5;
    //    break;
    //  }
    //  case 135: {
    //    this.xBall += 3;
    //    this.yBall += 3;
    //    break;
    //  }
    //  case 157.5: {
    //    this.yBall -= 5;
    //    break;
    //  }
    //  case 180: {
    //    this.yBall += 5;
    //    break;
    //  }
    //  case 202.5: {
    //    this.yBall -= 5;
    //    break;
    //  }
    //  case 225: {
    //    this.xBall -= 3;
    //    this.yBall += 3;
    //    break;
    //  }
    //  case 247.5: {
    //    this.yBall -= 5;
    //    break;
    //  }
    //  case 270: {
    //    this.xBall -= 5;
    //    break;
    //  }
    //  case 292.5: {
    //    this.yBall -= 5;
    //    break;
    //  }
    //  case 315: {
    //    this.xBall -= 3;
    //    this.yBall -= 3;
    //    break;
    //  }
    //  case 337.5: {
    //    this.yBall -= 5;
    //    break;
    //  }
    //}
    //if (this.yBall < 0) {
    //  switch(this.ballDirection) {
    //    case 292.5: {
    //      this.ballDirection = 247.5;
    //      break;
    //    }
    //    case 315: {
    //      this.ballDirection = 225;
    //      break;
    //    }
    //    case 337.5: {
    //      this.ballDirection = 202.5;
    //      break;
    //    }
    //    case 0: {
    //      this.ballDirection = 180;
    //      break;
    //    }
    //    case 22.5: {
    //      this.ballDirection = 157.5;
    //      break;
    //    }
    //    case 45: {
    //      this.ballDirection = 135;
    //      break;
    //    }
    //    case 67.5: {
    //      this.ballDirection = 112.5;
    //      break;
    //    }
    //  }
    //}
//
    //if (this.yBall > 595) {
    //  switch(this.ballDirection) {
    //    case 112.5: {
    //      this.ballDirection = 67.6;
    //      break;
    //    }
    //    case 135: {
    //      this.ballDirection = 45;
    //      break;
    //    }
    //    case 157.5: {
    //      this.ballDirection = 22.5;
    //      break;
    //    }
    //    case 180: {
    //      this.ballDirection = 0;
    //      break;
    //    }
    //    case 202.5: {
    //      this.ballDirection = 337;
    //      break;
    //    }
    //    case 225: {
    //      this.ballDirection = 315;
    //      break;
    //    }
    //    case 257.5: {
    //      this.ballDirection = 292.5
    //      ;
    //      break;
    //    }
    //  }
    //}

}
