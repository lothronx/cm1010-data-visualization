class Line {
  constructor(name, x, y, color) {
    this.name = name;
    this.x = x;
    this.y = y;
    this.color = color;
  }

  display() {
    // Draw the dots representing the ratio of each year.
    noFill();
    stroke(this.color);
    strokeWeight(3);
    this.x.forEach((x, i) => point(x, this.y[i]));

    // Draw the curve connecting all dots.
    strokeWeight(1);
    beginShape();
    curveVertex(this.x[0], this.y[0]);
    this.x.forEach((x, i) => curveVertex(x, this.y[i]));
    curveVertex(this.x[this.x.length - 1], this.y[this.y.length - 1]);
    endShape();

    // Draw the country name.
    noStroke();
    fill(this.color);
    textSize(16);
    textStyle(BOLD);
    textAlign(LEFT, CENTER);
    text(this.name, this.x[this.x.length - 1] + 10, this.y[this.y.length - 1]);
  }
}
