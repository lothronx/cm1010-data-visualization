class Dumbbell {
  constructor(tag, xUrban, xTown, xRural, xTotal, y) {
    this.tag = tag;
    this.xUrban = xUrban;
    this.xTown = xTown;
    this.xRural = xRural;
    this.xTotal = xTotal;
    this.y = y;
    this.textStyle = NORMAL;
    this.dotSize = 8;
  }

  display() {
    this.xMin = min(this.xUrban, this.xTown, this.xRural, this.xTotal);
    this.xMax = max(this.xUrban, this.xTown, this.xRural, this.xTotal);

    // Draw the province name
    noStroke();
    fill(50);
    textSize(14);
    textAlign(LEFT, CENTER);
    textStyle(this.textStyle);
    text(this.tag, this.xMax + 15, this.y);

    // Draw the dumbbell handle
    stroke(130, 119, 117);
    strokeWeight(1);
    line(this.xMin, this.y, this.xMax, this.y);

    // Draw the dots representing total, urban, town, and rural gender ratio respectively.
    noStroke();
    fill(11, 50, 107);
    square(this.xTotal - 4, this.y - 4, this.dotSize);
    fill(123, 203, 192);
    circle(this.xUrban, this.y, this.dotSize);
    fill(245, 189, 66);
    circle(this.xTown, this.y, this.dotSize);
    fill(240, 81, 41);
    circle(this.xRural, this.y, this.dotSize);
  }

  hover(mouseX, mouseY) {
    if (
      mouseX > this.xMin &&
      mouseX < this.xMax + 15 + textWidth(this.tag) &&
      mouseY > this.y - 7 &&
      mouseY < this.y + 7
    ) {
      this.textStyle = BOLD;
      this.dotSize = 9;
    } else {
      this.textStyle = NORMAL;
      this.dotSize = 8;
    }
  }
}
