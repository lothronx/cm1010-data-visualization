class Dumbbell {
  constructor(province, numUrban, numTown, numRUral) {

  }

  display() {
    noStroke();
    fill(this.color);
    circle(this.x, this.y, this.size);
  }

  mouseOver(mouseX, mouseY) {
    if (
      mouseX > this.x - this.size / 2 &&
      mouseX < this.x + this.size / 2 &&
      mouseY > this.y - this.size / 2 &&
      mouseY < this.y + this.size / 2
    ) {
      push();
      fill(245);
      rect(0, height - 40, width, 40, 8);
      textAlign(CENTER, CENTER);
      textStyle(NORMAL);
      textSize(14);
      fill(50);
      text(
        `In UK, ${this.label.num} thousand workers work as ${
          this.label.name
        }. ${round(this.label.ratio)}% of them are women.
On average, each woman earns ${this._payGap}% less than man.`,
        width / 2,
        height - 20
      );
      pop();
    }
  }
}
