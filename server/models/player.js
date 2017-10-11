class Player {

  constructor(x, id) {
    this.id = id;
    this.x = x;
    this.y = 250;
    this.speed = 10;
    this.positionBuffer = [];
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
module.exports = Player;
