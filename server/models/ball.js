class Ball {

  constructor() {
    this.x = 20;
    this.y = 20;
    this.xspeed = 10;
    this.yspeed = 10;
    this.positionBuffer = [];
  }

  move() {
      this.x += this.xspeed;
      this.y += this.yspeed;
      if (this.y > 595) {
        this.yspeed = -this.yspeed;
      }
      if (this.x > 795) {
        this.xspeed = -this.xspeed;
      }
      if (this.y < 5) {
        this.yspeed = -this.yspeed;
      }
      if (this.x < 5) {
        this.xspeed = -this.xspeed;
      }
      //if (this.x < 50 && rooms[i].yBall > rooms[i].yP1 && rooms[i].yBall < rooms[i].yP1 + 100) {
      //  rooms[i].dx = -rooms[i].dx;
      //}
  }
}

module.exports = Ball;
