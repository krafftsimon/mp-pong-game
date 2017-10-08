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
  direction: number = 0;
  player1: Player;
  player2: Player;
  ball: Ball;
  interpolationInputs = [];
  pendingInputs = []; //Inputs awaiting to be confirmed by the server
  ballSteps = [];
  inputNumber: number = 0;
  gameState;
  serverlastProcessedInput;


  constructor(private gameService: GameService) {
    this.player1 = new Player(20);
    this.player2 = new Player(760);
    this.ball = new Ball;
  }

  @ViewChild("gameCanvas") canvas: ElementRef;
  @HostListener('window:keydown', ['$event']) keyUp(event: KeyboardEvent) {
    if (event.keyCode === 38) {
      this.direction = -1;
    } else if (event.keyCode === 40) {
      this.direction = 1;
    }
  }
  @HostListener('window:keyup', ['$event']) keyDown(event: KeyboardEvent) {
    if (event.keyCode === 38) {
      this.direction = 0;
    } else if (event.keyCode === 40) {
      this.direction = 0;
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
    this.subscribeToServer();
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
    this.interpolate();
    this.drawCanvas();
  }

  subscribeToServer() {
    this.gameService.getState().subscribe(
      data => this.gameState = data[this.roomNum - 1],
      error => console.log(error),
      () => console.log("Completed.")
    );
  }

  processServerData() {
    // Reconciliation.
    if (this.clientPlayerNum === 1) {
      this.player1.y = this.gameState.player1.y
      this.interpolationInputs = this.gameState.inputsP2; // Save inputs of other player for interpolation
      let i = 0;
      while (i < this.pendingInputs.length) {
        if (this.pendingInputs[i].inputNumber <= this.gameState.lastProcessedInputP1) {
          this.pendingInputs.splice(i, 1);
        } else {
          this.player1.applyInput(this.pendingInputs[i]);
          i++;
        }
      }
    } else if (this.clientPlayerNum === 2) {
      this.player2.y = this.gameState.player2.y
      this.interpolationInputs = this.gameState.inputsP1; // Save inputs of other player for interpolation
      let i = 0;
      while (i < this.pendingInputs.length) {
        if (this.pendingInputs[i].inputNumber <= this.gameState.lastProcessedInputP2) {
          this.pendingInputs.splice(i, 1);
        } else {
          this.player2.applyInput(this.pendingInputs[i]);
          i++
        }
      }
    }
    this.ballSteps = this.gameState.ballSteps; // Save ball steps for interpolation
  }

  processUserInputs() {
    //this.ball.move(this.player1, this.player2);
    if (this.direction === 0) {
      return
    }
    let input = {direction: this.direction,
                 inputNumber: this.inputNumber++,
                 playerNum: this.clientPlayerNum,
                 roomNum: this.roomNum};
    if (typeof this.roomNum != 'undefined') {
      this.gameService.sendUserInput(input);
    }
    // Client-side prediction.
    if (this.clientPlayerNum === 1) {
      this.player1.applyInput(input);
      //Store the input and the result of the prediction for reconciliation
      this.pendingInputs.push(input)
    } else {
      this.player2.applyInput(input);
      //Store the input and the result of the prediction for reconciliation
      this.pendingInputs.push(input)
    }
  }

  interpolate() {
    if (this.ballSteps.length > 0) {
      this.ball.x = this.ballSteps[0].x;
      this.ball.y = this.ballSteps[0].y;
      this.ballSteps.shift();
    }
    if (this.interpolationInputs.length > 0) {
      if (this.clientPlayerNum === 1) {
        this.player2.applyInput(this.interpolationInputs[0]);
        this.interpolationInputs.shift();
      } else if (this.clientPlayerNum === 2) {
        this.player1.applyInput(this.interpolationInputs[0]);
        this.interpolationInputs.shift();
      }
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
}
