class Ball {

  constructor() {
    this.x = 20;
    this.y = 20;
    this.xSpeed = 5;
    this.ySpeed = 5;
    this.positionBuffer = [];
  }

  move(player1, player2) {
    this.x += this.xSpeed;
    this.y += this.ySpeed;
    if (this.y > 595) {
      this.ySpeed = -this.ySpeed;
    }
    if (this.x > 795) {
      this.xSpeed = -this.xSpeed;
    }
    if (this.y < 5) {
      this.ySpeed = -this.ySpeed;
    }
    if (this.x < 5) {
      this.xSpeed = -this.xSpeed;
    }
    if ((this.x <= 45 && this.y + 5 >= player1.y && this.y - 5 <= player1.y + 100) ||
        (this.x >= 755 && this.y + 5 >= player2.y && this.y - 5 <= player2.y + 100)) {
      this.xSpeed = -this.xSpeed;
    }
    if ((this.x >= 25 && this.x <= 45 && this.y >= player1.y && this.y <= player1.y + 100) ||
        (this.x >= 25 && this.x <= 45 && this.y <= player1.y + 100 && this.y >= player1.y) {
      this.ySpeed = -this.ySpeed;
    }
  }
}

module.exports = Ball;
