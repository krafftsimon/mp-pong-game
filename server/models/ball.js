class Ball {

  constructor(x) {
    this.x = x;
    this.y = 300;
    this.xSpeed = 10;
    this.ySpeed = 0;
    this.positionBuffer = [];
  }

  move(player1, player2) {
    let portionP1 = player1.length / 7;
    let portionP2 = player2.length / 7;
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
      if (this.y >= player1.y - 10 && this.y <= player1.y + (portionP1 * 1)) {
        this.xSpeed = 4;
        this.ySpeed = -9;
      } else if (this.y > player1.y + (portionP1 * 1) && this.y <= player1.y + (portionP1 * 2)) {
        this.xSpeed = 7;
        this.ySpeed = -7;
      } else if (this.y > player1.y + (portionP1 * 2) && this.y <= player1.y + (portionP1 * 3)) {
        this.xSpeed = 9;
        this.ySpeed = -4;
      } else if (this.y > player1.y + (portionP1 * 3) && this.y <= player1.y +(portionP1 * 4)) {
        this.xSpeed = 10;
        this.ySpeed = 0;
      } else if (this.y > player1.y + (portionP1 * 4) && this.y <= player1.y + (portionP1 * 5)) {
        this.xSpeed = 9;
        this.ySpeed = 4;
      } else if (this.y > player1.y + (portionP1 * 5) && this.y <= player1.y + (portionP1 * 6)) {
        this.xSpeed = 7;
        this.ySpeed = 7;
      } else if (this.y > player1.y + (portionP1 * 6) && this.y <= player1.y + (portionP1 * 7) + 10) {
        this.xSpeed = 4;
        this.ySpeed = 9;
      }
    } else if (this.x >= 750) {
      if (this.y >= player2.y - 10 && this.y <= player2.y + (portionP1 * 1)) {
        this.xSpeed = -4;
        this.ySpeed = -9;
      } else if (this.y > player2.y + (portionP2 * 1) && this.y <= player2.y + (portionP2 * 2)) {
        this.xSpeed = -7;
        this.ySpeed = -7;
      } else if (this.y > player2.y + (portionP2 * 2) && this.y <= player2.y + (portionP2 * 3)) {
        this.xSpeed = -9;
        this.ySpeed = -4;
      } else if (this.y > player2.y + (portionP2 * 3) && this.y <= player2.y + (portionP2 * 4)) {
        this.xSpeed = -10;
        this.ySpeed = 0;
      } else if (this.y > player2.y + (portionP2 * 4) && this.y <= player2.y + (portionP2 * 5)) {
        this.xSpeed = -9;
        this.ySpeed = 4;
      } else if (this.y > player2.y + (portionP2 * 5) && this.y <= player2.y + (portionP2 * 6)) {
        this.xSpeed = -7;
        this.ySpeed = 7;
      } else if (this.y > player2.y + (portionP2 * 6) && this.y <= player2.y + (portionP2 * 7) + 10) {
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
