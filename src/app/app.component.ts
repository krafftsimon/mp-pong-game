import { Component, OnInit, ViewChild, ElementRef, Renderer2, HostListener } from '@angular/core';
import { GameService } from './game.service';
import { Player } from './player';
import { Ball } from './ball';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  roomNum;
  updateRate: number = 50; //in hertz
  updateInterval;
  clientPlayerNum;
  direction: number = 0;
  player1: Player;
  player2: Player;
  ball: Ball;
  ball2: Ball;
  previousBallX: number;
  previousBallY: number;
  currentBallX: number;
  currentBallY: number;
  ballMovementCounter: number = 0;
  interpolationInputs = [];
  pendingInputs = []; //Inputs awaiting to be confirmed by the server
  ballSteps = [];
  inputNumber: number = 0;
  serverData;
  serverlastProcessedInput;
  canvasCtx: CanvasRenderingContext2D;
  menuScreen: boolean = true;
  connectBtnX: number = 300;
  connectBtnY: number = 300;
  connectBtnWidth: number = 100;
  connectBtnLength: number = 200;
  countDown: string = "3";
  countDownStarted: boolean = false;
  pointsP1: string = "0";
  pointsP2: string = "0";

 /* powerups :
 -small Paddles
 -large Paddles
 -ball speed
*/
  constructor(private gameService: GameService, private renderer: Renderer2) {
    this.player1 = new Player(20);
    this.player2 = new Player(760);
    this.ball = new Ball;
    this.ball2 = new Ball;
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
    let simple = this.renderer.listen(this.canvas.nativeElement, 'click', (e) => {
      if (this.menuScreen) {
        if (e.layerX >= this.connectBtnX &&
            e.layerY >= this.connectBtnY &&
            e.layerX <= this.connectBtnX + this.connectBtnLength &&
            e.layerY <= this.connectBtnX + this.connectBtnWidth) {
              this.menuScreen = false;
              this.startGame();
        }
      }
    });
  }


  ngAfterViewInit() {
    this.canvasCtx = this.canvas.nativeElement.getContext("2d");
    this.drawMenu();
  }

  startGame() {
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
    if (this.serverData.gameState === "starting" && !this.countDownStarted) {
      this.startCountDown();
      this.countDownStarted = true;
    }
    if (this.serverData.gameState === "started") {
      this.processServerData();
      this.processUserInputs();
      this.interpolate();
    }
    this.drawGame();
  }

  subscribeToServer() {
    this.gameService.getState().subscribe(
      data => {this.serverData = data[this.roomNum - 1]; this.ballMovementCounter = 0;},
      error => console.log(error),
      () => console.log("Completed.")
    );
  }

  processServerData() {
    // Reconciliation.
    if (this.clientPlayerNum === 1) {
      this.player1.y = this.serverData.player1.y
      this.interpolationInputs = this.serverData.inputsP2; // Save inputs of other player for interpolation
      let i = 0;
      while (i < this.pendingInputs.length) {
        if (this.pendingInputs[i].inputNumber <= this.serverData.lastProcessedInputP1) {
          this.pendingInputs.splice(i, 1);
        } else {
          this.player1.applyInput(this.pendingInputs[i]);
          i++;
        }
      }
    } else if (this.clientPlayerNum === 2) {
      this.player2.y = this.serverData.player2.y
      this.interpolationInputs = this.serverData.inputsP1; // Save inputs of other player for interpolation
      let i = 0;
      while (i < this.pendingInputs.length) {
        if (this.pendingInputs[i].inputNumber <= this.serverData.lastProcessedInputP2) {
          this.pendingInputs.splice(i, 1);
        } else {
          this.player2.applyInput(this.pendingInputs[i]);
          i++
        }
      }
    }
    //this.ballSteps = this.serverData.ballSteps; // Save ball steps for interpolation
  }

  processUserInputs() {
    // Client-side prediction for the ball. Based on the position and speed of the server-side ball.
    this.ball.x = this.serverData.ball.x //+ this.ballMovementCounter * this.serverData.ball.xSpeed;
    this.ball.y = this.serverData.ball.y //+ this.ballMovementCounter * this.serverData.ball.ySpeed;
    //this.ballMovementCounter++;
    //this.ball2.x = this.serverData.ball2.x
    //this.ball2.y = this.serverData.ball2.y

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
    // Client-side prediction for the paddle.
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
    //if (this.ballSteps.length > 0) {
    //  this.ball.x = this.ballSteps[0].x;
    //  this.ball.y = this.ballSteps[0].y;
    //  this.ballSteps.shift();
    //}


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

  startCountDown() {
    setTimeout(function() {
      this.countDown = "2";
    }.bind(this), 1000);
    setTimeout(function() {
      this.countDown = "1";
    }.bind(this), 2000);
    setTimeout(function() {
      this.countDown = "3";
      this.countDownStarted = false;
    }.bind(this), 3000);
  }

  drawGame() {
    this.canvasCtx.clearRect(0, 0, 800, 600);
    // Background color.
    let grd=this.canvasCtx.createRadialGradient(400,300,80,400,300,600);
    grd.addColorStop(0,"#e5e5e5");
    grd.addColorStop(1,"#b2b2b2");
    this.canvasCtx.fillStyle=grd;
    this.canvasCtx.fillRect(0, 0, 800, 600);

    // Line.
    this.canvasCtx.shadowBlur=0;
    this.canvasCtx.shadowOffsetY=0;
    this.canvasCtx.shadowOffsetX=0;
    this.canvasCtx.shadowColor="grey";
    this.canvasCtx.beginPath();
    this.canvasCtx.moveTo(400, 0);
    this.canvasCtx.lineTo(400, 600);
    this.canvasCtx.stroke();

    if (this.serverData.gameState === "waitingForPlayer") {
      this.canvasCtx.fillStyle="black";
      this.canvasCtx.font = "30px Comic Sans MS";
      this.canvasCtx.fillText("Waiting for an opponent.", 220, 300);
    }
    if (this.serverData.gameState === "starting") {
      this.canvasCtx.fillStyle="black";
      this.canvasCtx.font = "60px Comic Sans MS";
      this.canvasCtx.fillText(this.countDown, 380, 300);
    }

    // Paddles and Ball shadow.
    this.canvasCtx.shadowBlur=10;
    this.canvasCtx.shadowOffsetY=10;
    this.canvasCtx.shadowOffsetX=10;
    this.canvasCtx.shadowColor="grey";

    // Ball.
    this.canvasCtx.beginPath();
    this.canvasCtx.fillStyle="#68EFAD";
    this.canvasCtx.lineWidth=1;
    this.canvasCtx.strokeStyle="grey";
    this.canvasCtx.arc(this.ball.x, this.ball.y, 10, 0, 2*Math.PI);
    //this.canvasCtx.arc(this.ball2.x, this.ball2.y, 10, 0, 2*Math.PI);
    this.canvasCtx.fill();
    this.canvasCtx.stroke();

    // Score.
    this.canvasCtx.font = "40px Comic Sans MS";
    this.canvasCtx.fillText(this.serverData.pointsP1, 300, 40);
    this.canvasCtx.fillText(this.serverData.pointsP2, 475, 40);


    // Paddles.
    this.canvasCtx.beginPath();
    this.canvasCtx.fillStyle="#691A99";
    this.canvasCtx.lineWidth=2;
    this.canvasCtx.strokeStyle="grey";
    this.canvasCtx.rect(this.player1.x, this.player1.y, 20, 105);
    this.canvasCtx.rect(this.player2.x, this.player2.y, 20, 105);
    this.canvasCtx.fill();
    this.canvasCtx.stroke();

  }

  drawMenu() {
    // Background color.
    this.canvasCtx.fillStyle="#e5e5e5";
    this.canvasCtx.fillRect(0, 0, 800, 600);

    // Text.
    this.canvasCtx.fillStyle="black";
    this.canvasCtx.font = "40px Comic Sans MS";
    this.canvasCtx.fillText("Online Multiplayer Pong Game", 120, 80);
    this.canvasCtx.fillText("Connect", this.connectBtnX + 25, this.connectBtnY + 60);
    this.canvasCtx.rect(this.connectBtnX, this.connectBtnY, this.connectBtnLength, this.connectBtnWidth);
    this.canvasCtx.stroke();
  }
}
