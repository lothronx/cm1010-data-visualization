class Line {
  constructor(name, x, y, color) {
    this.name = name;
    this.x = x;
    this.y = y;
    this.color = color;
  }

  display() {
    let previous = null;

    this.x.forEach((x, i) => {
      // Create an object to store data for the current year.
      let current = {
        x: x,
        y: this.y[i],
      };

      // Draw dots representing each data.
      stroke(this.color);
      strokeWeight(4);
      point(current.x, current.y);

      // Draw line segment connecting previous year's data to current year's.
      if (previous != null) {
        strokeWeight(1);
        line(previous.x, previous.y, current.x, current.y);
      }

      previous = current;
    });

    // Draw the country name.
    noStroke();
    fill(this.color);
    textSize(16);
    textStyle(BOLD);
    textAlign(LEFT, CENTER);
    text(this.name, this.x[this.x.length - 1] + 10, this.y[this.y.length - 1]);
  }
}
