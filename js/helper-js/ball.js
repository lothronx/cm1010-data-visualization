// This file is build upon by p5.js example "Bouncy Bubbles". Changes are made.
// You can find the original code here: https://p5js.org/examples/motion-bouncy-bubbles.html
class Ball {
  constructor(x, y, size, color, label, index, others) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.size = size;
    this.color = color;
    this.label = label;
    this.id = index;
    this.others = others;
    this.speed = 0.03; //the default velocity of the ball
    this.bounce = -0.001; //how hard should the ball bounce back from the edges.
    this.spring = 0.05; // how hard should the balls bounce away from each other once they collide
  }

  display() {
    noStroke();
    fill(this.color);
    circle(this.x, this.y, this.size);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(this.size * 0.25);
    this._payGap = Number(this.label.payGap).toFixed(1);
    text(this._payGap + "%", this.x, this.y);
  }

  mouseOver(mouseX, mouseY) {
    if (
      mouseX > this.x - this.size / 2 &&
      mouseX < this.x + this.size / 2 &&
      mouseY > this.y - this.size / 2 &&
      mouseY < this.y + this.size / 2
    ) {
      push();
      textAlign(CENTER, CENTER);
      textStyle(NORMAL);
      textSize(14);
      fill(50);
      text(
        `In UK, ${this.label.num} thousand workers work as ${this.label.name}. ${round(this.label.ratio)}% of them are women.
On average, each woman earns ${this._payGap}% less than man.`,
        width / 2,
        height - 20
      );
      pop();
    }
  }

  mouseOut(mouseX, mouseY) {
    if (mouseX < 1 || mouseX > width || mouseY < 1 || mouseY > height) {
      // By default, every ball tends to move towards the center of the canvas.
      // Due to the collision check mechanism, they will keep moving for a very long time.
      this.x > width / 2 ? (this.vx -= this.speed) : (this.vx += this.speed);
      this.y > height / 2 ? (this.vy -= this.speed) : (this.vy += this.speed);
      this.x += this.vx;
      this.y += this.vy;

      // If the ball reaches the edge of the canvas, it bounces back.
      if (this.x + this.size / 2 > width) {
        this.x = width - this.size / 2;
        this.vx *= this.bounce;
      } else if (this.x - this.size / 2 < 0) {
        this.x = this.size / 2;
        this.vx *= this.bounce;
      }
      if (this.y + this.size / 2 > height - 60) { // Leave some blank space on the bottom for text.
        this.y = height - 60 - this.size / 2;
        this.vy *= this.bounce;
      } else if (this.y - this.size / 2 < 0) {
        this.y = this.size / 2;
        this.vy *= this.bounce;
      }

      // If two balls collide, they will spring against each other.
      for (let i = this.id + 1; i < this.others.length; i++) {
        let dx = this.others[i].x - this.x;
        let dy = this.others[i].y - this.y;
        let distance = sqrt(dx * dx + dy * dy);
        let minDist = this.others[i].size / 2 + this.size / 2;
        if (distance < minDist) {
          let angle = atan2(dy, dx);
          let targetX = this.x + cos(angle) * minDist;
          let targetY = this.y + sin(angle) * minDist;
          let ax = (targetX - this.others[i].x) * this.spring;
          let ay = (targetY - this.others[i].y) * this.spring;
          this.vx -= ax;
          this.vy -= ay;
          this.others[i].vx += ax;
          this.others[i].vy += ay;
        }
      }
    }
  }
}
