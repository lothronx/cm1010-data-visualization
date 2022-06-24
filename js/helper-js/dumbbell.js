class Dumbbell {
  constructor(tag, xUrban, xTown, xRural, xTotal, y) {
    this.tag = tag;
    this.xUrban = xUrban;
    this.xTown = xTown;
    this.xRural = xRural;
    this.xTotal = xTotal;
    this.y = y;
  }

  display() {
    const xMin = min(this.xUrban, this.xTown, this.xRural, this.xTotal);
    const xMax = max(this.xUrban, this.xTown, this.xRural, this.xTotal);

    // Draw the province name
    noStroke();
    fill(50);
    textSize(14);
    textAlign(LEFT, CENTER);
    textStyle(NORMAL);
    text(this.tag, xMax + 15, this.y);

    // Draw the dumbbell handle
    stroke(130, 119, 117);
    strokeWeight(1);
    line(xMin, this.y, xMax, this.y);

    // Draw the dots representing total, urban, town, and rural gender ratio respectively.
    noStroke();
    fill(11, 50, 107);
    square(this.xTotal - 4, this.y - 4, 8);
    fill(123, 203, 192);
    circle(this.xUrban, this.y, 8);
    fill(245, 189, 66);
    circle(this.xTown, this.y, 8);
    fill(240, 81, 41);
    circle(this.xRural, this.y, 8);
  }

  hover(mouseX, mouseY) {}
}
