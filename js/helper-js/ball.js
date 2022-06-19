// This file is build upon by p5.js example "Bouncy Bubbles". You can find the original code here: https://p5js.org/examples/motion-bouncy-bubbles.html
class Ball {
  constructor(x, y, size, label, color, index, others) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.size = size;
    this.id = index;
    this.others = others;
    this.label = label;
    this.color = color;
    this.spring = 0.05;
    this.gravity = 0.03;
    this.friction = -0.9;
    this.numBalls = 13;
  }

  collide() {
    for (let i = this.id + 1; i < this.numBalls; i++) {
      // console.log(others[i]);
      let dx = this.others[i].x - this.x;
      let dy = this.others[i].y - this.y;
      let distance = sqrt(dx * dx + dy * dy);
      let minDist = this.others[i].size / 2 + this.size / 2;
      //   console.log(distance);
      //console.log(minDist);
      if (distance < minDist) {
        //console.log("2");
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

  move() {
    this.vy += this.gravity;
    this.x += this.vx;
    this.y += this.vy;
    if (this.x + this.size / 2 > width) {
      this.x = width - this.size / 2;
      this.vx *= this.friction;
    } else if (this.x - this.size / 2 < 0) {
      this.x = this.size / 2;
      this.vx *= this.friction;
    }
    if (this.y + this.size / 2 > height) {
      this.y = height - this.size / 2;
      this.vy *= this.friction;
    } else if (this.y - this.size / 2 < 0) {
      this.y = this.size / 2;
      this.vy *= this.friction;
    }
  }

  display() {
    noStroke();
    fill(this.color);
    circle(this.x, this.y, this.size);
  }

  hover() {}
}
