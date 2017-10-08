export class Ball {
  x: number = 20;
  y: number = 20;
  xSpeed: number = 5;
  ySpeed: number = 5;
  positionBuffer: number[] = [];

  constructor() {}

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
      this.x = 400;
      this.y = 250
    }
    if ((this.x <= 45 && this.x >= 40 && this.y + 5 >= player1.y && this.y - 5 <= player1.y + 100) ||
        (this.x >= 755 && this.x <= 760 && this.y + 5 >= player2.y && this.y - 5 <= player2.y + 100)) {
      this.xSpeed = -this.xSpeed;
    } else if ((this.x >= 20 && this.x <= 40 && this.y + 5 >= player1.y && this.y <= player1.y + 10) ||
               (this.x >= 20 && this.x <= 40 && this.y - 5 <= player1.y + 100 && this.y >= player1.y + 90) ||
               (this.x >= 760 && this.x <= 780 && this.y + 5 >= player2.y && this.y <= player2.y + 10) ||
               (this.x >= 760 && this.x <= 780 && this.y - 5 <= player2.y + 100 && this.y >= player2.y + 90)) {
      this.ySpeed = -this.ySpeed;
    }
  }
}
