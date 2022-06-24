class Line {
  constructor(name, x, y, color, others) {
    this.name = name;
    this.x = x;
    this.y = y;
    this.color = color;
    this.colorBackup = color;
    this.others = others;
    this.lineWeight = 1;
  }

  display() {
    // Draw the dots representing the ratio of each year.
    noFill();
    stroke(this.color);
    strokeWeight(3);
    this.x.forEach((x, i) => point(x, this.y[i]));

    // Draw a curved line connecting all dots.
    strokeWeight(this.lineWeight);
    beginShape();
    curveVertex(this.x[0], this.y[0]);
    this.x.forEach((x, i) => curveVertex(x, this.y[i]));
    curveVertex(this.x[this.x.length - 1], this.y[this.y.length - 1]);
    endShape();

    // Draw the country name tag.
    noStroke();
    fill(this.color);
    textSize(14);
    textStyle(BOLD);
    textAlign(LEFT, CENTER);
    text(this.name, this.x[this.x.length - 1] + 10, this.y[this.y.length - 1]);
  }

  // When the mouse hovers over the country name tags, highlight the current country while make other countries transparent.
  hover(mouseX, mouseY) {
    if (
      mouseX > this.x[this.x.length - 1] + 10 &&
      mouseX < this.x[this.x.length - 1] + 10 + textWidth(this.name) &&
      mouseY > this.y[this.y.length - 1] - 7 &&
      mouseY < this.y[this.y.length - 1] + 7
    ) {
      this.others.forEach((line) => (line.color = color(176, 153, 119, 10)));
      this.color = this.colorBackup;
      this.lineWeight = 3;
    } else {
      this.color = this.colorBackup;
      this.lineWeight = 1;
    }
  }
}
