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
  interpolationInputs = [];
  pendingInputs = []; //Inputs awaiting to be confirmed by the server
  ballSteps = [];

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
    //this.interpolate();
    this.drawCanvas();
  }

  processServerData() {
    this.gameService.getState().subscribe(
      data => {
        // Reconciliation.
        //if (this.clientPlayerNum === 1) {
        //  this.interpolationInputs = data[this.roomNum - 1].inputsP2; // Save inputs of other player for interpolation
        //  let inputs = data[this.roomNum - 1].inputsP1
        //  // Verify that client prediction matches server
        //  for (let i in inputs) {
        //    if (inputs[i].result != this.pendingInputs[i]) {
        //      this.player1.y = data[this.roomNum - 1].player1.y;
        //    }
        //  }
        //  this.pendingInputs = []
        //}
        //if (this.clientPlayerNum === 2) {
        //  this.interpolationInputs = data[this.roomNum - 1].inputsP1; // Save inputs of other player for interpolation
        //  let inputs = data[this.roomNum - 1].inputsP2
        //  // Verify that client prediction matches server
        //  for (let i in inputs) {
        //    if (inputs[i].result != this.pendingInputs[i]) {
        //      this.player2.y = data[this.roomNum - 1].player2.y;
        //    }
        //  }
        //  this.pendingInputs = []
        //}
        this.ballSteps = data[this.roomNum - 1].ballSteps; // Save ball steps for interpolation
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
      //Store the input and the result of the prediction for reconciliation
      this.pendingInputs.push({input: input, predictedPosition: this.player1.y})
    } else {
      this.player2.applyInput(input);
      //Store the input and the result of the prediction for reconciliation
      this.pendingInputs.push({input: input, predictedPosition: this.player2.y})
    }
  }

  interpolate() {
    this.ball.x = this.ballSteps[0].x;
    this.ball.y = this.ballSteps[0].y;
    this.ballSteps.shift();
    if (this.clientPlayerNum === 1) {
      this.player2.applyInput(this.interpolationInputs[0]);
      this.interpolationInputs.shift();
    }
    if (this.clientPlayerNum === 2) {
      this.player1.applyInput(this.interpolationInputs[0]);
      this.interpolationInputs.shift();
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
