export class Ball {
  x: number = 20;
  y: number = 20;
  xspeed: number = 10;
  yspeed: number = 10;
  positionBuffer: number[] = [];

  constructor() {}

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
