class Ball {

  constructor(x) {
    this.x = x;
    this.y = 20;
    this.xSpeed = 7;
    this.ySpeed = 7;
    this.positionBuffer = [];
  }

  move(player1, player2) {
    this.x += this.xSpeed;
    this.y += this.ySpeed;
    if (this.y > 590 && this.y < 600) {
      this.ySpeed = -this.ySpeed;
    }
    if (this.x > 790 && this.y < 800) {
      this.xSpeed = -this.xSpeed;
    }
    if (this.y < 10 && this.y > 0) {
      this.ySpeed = -this.ySpeed;
    }
    if (this.x < 10 && this.y > 0) {
      this.xSpeed = -this.xSpeed;
    }

    if (this.x <= 50) {
      if (this.y >= player1.y - 10 && this.y <= player1.y + 15) {
        this.xSpeed = 4;
        this.ySpeed = -9;
      } else if (this.y > player1.y + 15 && this.y <= player1.y + 30) {
        this.xSpeed = 7;
        this.ySpeed = -7;
      } else if (this.y > player1.y + 30 && this.y <= player1.y + 45) {
        this.xSpeed = 9;
        this.ySpeed = -4;
      } else if (this.y > player1.y + 45 && this.y <= player1.y + 60) {
        this.xSpeed = 10;
        this.ySpeed = 0;
      } else if (this.y > player1.y + 60 && this.y <= player1.y + 75) {
        this.xSpeed = 9;
        this.ySpeed = 4;
      } else if (this.y > player1.y + 75 && this.y <= player1.y + 90) {
        this.xSpeed = 7;
        this.ySpeed = 7;
      } else if (this.y > player1.y + 90 && this.y <= player1.y + 105 + 10) {
        this.xSpeed = 4;
        this.ySpeed = 9;
      }
    } else if (this.x >= 750) {
      if (this.y >= player2.y - 10 && this.y <= player2.y + 15) {
        this.xSpeed = -4;
        this.ySpeed = -9;
      } else if (this.y > player2.y + 15 && this.y <= player2.y + 30) {
        this.xSpeed = -7;
        this.ySpeed = -7;
      } else if (this.y > player2.y + 30 && this.y <= player2.y + 45) {
        this.xSpeed = -9;
        this.ySpeed = -4;
      } else if (this.y > player2.y + 45 && this.y <= player2.y + 60) {
        this.xSpeed = -10;
        this.ySpeed = 0;
      } else if (this.y > player2.y + 60 && this.y <= player2.y + 75) {
        this.xSpeed = -9;
        this.ySpeed = 4;
      } else if (this.y > player2.y + 75 && this.y <= player2.y + 90) {
        this.xSpeed = -7;
        this.ySpeed = 7;
      } else if (this.y > player2.y + 90 && this.y <= player2.y + 105 + 10) {
        this.xSpeed = -4;
        this.ySpeed = 9;
      }
    }
    // if ((this.x <= 40 && this.y + 10 >= player1.y && this.y <= player1.y + 20) ||
    //           (this.x <= 40 && this.y - 10 <= player1.y + 105 && this.y >= player1.y + 85) ||
    //           (this.x >= 760 && this.y + 10 >= player2.y && this.y <= player2.y + 20) ||
    //           (this.x >= 760 && this.y - 10 <= player2.y + 105 && this.y >= player2.y + 85)) {
    //  this.ySpeed = -this.ySpeed;
    //}
  }
}

module.exports = Ball;
