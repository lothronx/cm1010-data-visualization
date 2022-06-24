class Line {
  constructor(name, x, y, color) {
    this.name = name;
    this.x = x;
    this.y = y;
    this.color = color;
    this.strokeWeight = 1;
  }

  display() {
    // Draw the dots representing the ratio of each year.
    noFill();
    stroke(this.color);
    strokeWeight(3);
    this.x.forEach((x, i) => point(x, this.y[i]));

    // Draw the curve connecting all dots.
    strokeWeight(this.strokeWeight);
    beginShape();
    curveVertex(this.x[0], this.y[0]);
    this.x.forEach((x, i) => curveVertex(x, this.y[i]));
    curveVertex(this.x[this.x.length - 1], this.y[this.y.length - 1]);
    endShape();

    // Draw the country name.
    noStroke();
    fill(this.color);
    textSize(14);
    textStyle(BOLD);
    textAlign(LEFT, CENTER);
    text(this.name, this.x[this.x.length - 1] + 10, this.y[this.y.length - 1]);
  }

  hover(mouseX, mouseY) {
    if (
      mouseX > this.x[this.x.length - 1] + 10 &&
      mouseX < this.x[this.x.length - 1] + 10 + textWidth(this.name) &&
      mouseY > this.y[this.y.length - 1] - 7 &&
      mouseY < this.y[this.y.length - 1] + 7
    ) {
      this.strokeWeight = 3;
    } else {
      this.strokeWeight = 1;
    }
  }


}
