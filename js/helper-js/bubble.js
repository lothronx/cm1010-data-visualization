// This constructor function is built on the base of the p5.js example "Bouncy Bubbles". You can find the original code here: https://p5js.org/examples/motion-bouncy-bubbles.html
// Most code is newly added, adapted, or modified, except for the collision mechanism. The full credit of the collision mechanism belongs to the original code.

class Bubble {
  // the private properties:
  #speed;
  #bounce;
  #spring;
  #margin;

  constructor(x, y, size, color, label, index, others) {
    // the public properties:
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.size = size;
    this.color = color;
    this.label = label;
    this.id = index;
    this.others = others;
    this.hovered = false;

    // the private properties:
    this.#speed = 0.02; //the default velocity of the bubble
    this.#bounce = -1; //how hard should the bubble bounce back from the edges. -1 means bouncing back at original speed.
    this.#spring = 0.03; // how hard should the bubbles bounce away from each other once they collide
    this.#margin = 30;
  }

  /* the public methods -----------------------------------------------------------------------*/
  display() {
    // Draw the bubble.
    noStroke();
    fill(this.color);
    this.hovered ? circle(this.x, this.y, this.size * 1.1) : circle(this.x, this.y, this.size);

    // Draw the pay gap % on the center of the bubble.
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(this.size * 0.3);
    this._payGap = Number(this.label.payGap).toFixed(1);
    text(this._payGap + "%", this.x, this.y);
  }

  // When the mouse hovers over the bubble, show the bubble's notes in the notes area.
  hover() {
    if (dist(this.x, this.y, mouseX, mouseY) <= this.size / 2) {
      this.hovered = true;
      select("h4").html(
        `In UK, ${this.label.num} thousand workers work as ${this.label.name}. ${round(
          this.label.ratio
        )}% of them are women. On average, each woman earns ${this._payGap}% less than man.`
      );
    } else {
      this.hovered = false;
    }
  }

  // When the canvas is clicked, call this function.
  move() {
    this.#gravity();
    this.#bounceBack();
    this.#collisionDetection();
  }

  /* the private methods -----------------------------------------------------------------------*/
  // By default, every bubble tends to move towards the center of the canvas.
  // Due to the collision mechanism, they can keep moving for a very long time.
  #gravity() {
    this.x > width / 2 ? (this.vx -= this.#speed) : (this.vx += this.#speed);
    this.y > height / 2 ? (this.vy -= this.#speed) : (this.vy += this.#speed);
    this.x += this.vx;
    this.y += this.vy;
  }

  // If the bubble reaches the edge of the canvas (margin considered), it bounces back.
  #bounceBack() {
    if (this.x + this.size / 2 > width - this.#margin) {
      this.x = width - this.#margin - this.size / 2;
      this.vx *= this.#bounce;
    } else if (this.x - this.size / 2 < this.#margin) {
      this.x = this.size / 2 + this.#margin;
      this.vx *= this.#bounce;
    }
    if (this.y + this.size / 2 > height - this.#margin) {
      this.y = height - this.#margin - this.size / 2;
      this.vy *= this.#bounce;
    } else if (this.y - this.size / 2 < this.#margin) {
      this.y = this.size / 2 + this.#margin;
      this.vy *= this.#bounce;
    }
  }

  // Collision mechanism: If two bubbles collide, they will spring against each other.
  // This part of the code is directly copied from the code source without modification.
  #collisionDetection() {
    for (let i = this.id + 1; i < this.others.length; i++) {
      let dx = this.others[i].x - this.x;
      let dy = this.others[i].y - this.y;
      let distance = sqrt(dx * dx + dy * dy);
      let minDist = this.others[i].size / 2 + this.size / 2;
      if (distance < minDist) {
        let angle = atan2(dy, dx);
        let targetX = this.x + cos(angle) * minDist;
        let targetY = this.y + sin(angle) * minDist;
        let ax = (targetX - this.others[i].x) * this.#spring;
        let ay = (targetY - this.others[i].y) * this.#spring;
        this.vx -= ax;
        this.vy -= ay;
        this.others[i].vx += ax;
        this.others[i].vy += ay;
      }
    }
  }
}
