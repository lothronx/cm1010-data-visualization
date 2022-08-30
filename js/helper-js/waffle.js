class Waffle {
  constructor(x, y, size, table, columnHeading) {
    // Each waffle has 5 properties: x, y, size, categories, and boxes.
    this.x = x;
    this.y = y;
    this.size = size;

    // "Categories" is an array of encapsulated table data.
    this.categories = [];
    const labels = table.getColumn(0).filter((value) => value != "");
    const percentages = table.getColumn(columnHeading);
    const colors = [
      color(150, 110, 172), //purple
      color(245, 189, 66), //yellow
      color(176, 153, 119), //khaki
      color(130, 119, 117), //brown
      color(241, 199, 221), //pink
      color(230, 230, 230), //gray
    ];
    labels.forEach((label, i) => {
      this.categories.push({
        label: label,
        number: round(percentages[i]),
        color: colors[i],
      });
    });

    // "Boxes" is an array of the little boxes that makes up the waffle chart.
    this.boxes = [];
    this.boxGenerator();
  }

  boxGenerator() {
    const boxesEachLine = 10;
    const boxSize = this.size / boxesEachLine;
    let categoryIndex = 0;
    let boxesEachCategory = 0;

    for (let i = 0; i < boxesEachLine; i++) {
      this.boxes.push([]);
      for (let j = 0; j < boxesEachLine; j++) {
        if (boxesEachCategory == this.categories[categoryIndex].number) {
          boxesEachCategory = 0;
          categoryIndex++;
        }
        this.boxes[i].push(
          new Box(this.x + j * boxSize, this.y + i * boxSize, boxSize, this.categories[categoryIndex])
        );
        boxesEachCategory++;
      }
    }
  }

  // Draw the waffle chart
  display() {
    this.boxes.forEach((boxes) => {
      boxes.forEach((box) => box.display());
    });
  }

  // Interactivity
  checkMouse(mouseX, mouseY) {
    this.boxes.forEach((boxes) => {
      let currentCategory = null;
      boxes.forEach((box) => {
        currentCategory = box.hover(mouseX, mouseY);
        if (currentCategory) {
          push();
          fill(120);
          textSize(14);
          textAlign(LEFT, TOP);
          rect(mouseX, mouseY, textWidth(box.category.label) + 20, -40, 8);
          fill(255);
          text(box.category.label, mouseX + 10, mouseY - 35);
          text(box.category.number + "%", mouseX + 10, mouseY - 19);
          pop();
        }
      });
      boxes.forEach((box) => {
        if (currentCategory == box.category) {
          console.log(box.category);
          box.displayAlt();
        }
      });
    });
  }
}

/* Box Class ------------------------------------------------------------------*/
class Box {
  constructor(x, y, size, category) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.category = category;
  }

  display() {
    noStroke();
    fill(this.category.color);
    square(this.x, this.y, this.size, this.size / 2.5);
  }

  displayAlt() {
    noStroke();
    fill(this.category.color);
    square(this.x, this.y, this.size);
  }

  hover(mouseX, mouseY) {
    if (mouseX > this.x && mouseX < this.x + this.size && mouseY > this.y && mouseY < this.y + this.size) {
      return this.category;
    }
    return false;
  }
}
