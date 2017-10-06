export class Player {
  y: number = 250;
  x: number;
  speed: number = 10;
  positionBuffer: number[] = [];

  constructor(x: number) {
    this.x = x;
  }

  applyInput(input) {
    this.y += input.direction * this.speed;

    if (this.y > 500) {
      this.y = 500;
    } else if (this.y < 0) {
      this.y = 0;
    }
  }
}
