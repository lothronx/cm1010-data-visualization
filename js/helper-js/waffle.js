class Waffle {
  constructor(x, y, size, table, columnHeading) {
    const boxesEachLine = 10;

    /* Get necessary data from the table.------------------------------------------------*/
    const labels = table.getColumn(0).filter((value) => value != "");
    let percentages = table.getColumn(columnHeading);
    const colors = [
      color(150, 110, 172), //purple
      color(245, 189, 66), //yellow
      color(176, 153, 119), //khaki
      color(130, 119, 117), //brown
      color(241, 199, 221), //pink
      color(230, 230, 230), //gray
    ];

    /* Categories is an array of objects made from the information above. ----------------------*/
    let categories = labels.map((label, i) => {
      return {
        label: label,
        number: round(percentages[i]),
        color: colors[i],
      };
    });

    /* Boxes is a 2D array of all boxes. -------------------------------------------------------*/
    this.boxes = [];
    const self = this;
    function addBoxes() {
      let categoryIndex = 0;
      let boxesEachCategory = 0;
      const boxSize = size / boxesEachLine;

      for (let i = 0; i < boxesEachLine; i++) {
        self.boxes.push([]);
        for (let j = 0; j < boxesEachLine; j++) {
          if (boxesEachCategory == categories[categoryIndex].number) {
            boxesEachCategory = 0;
            categoryIndex++;
          }
          self.boxes[i].push(
            new Box(
              x + j * boxSize,
              y + i * boxSize,
              boxSize,
              categories[categoryIndex]
            )
          );
          boxesEachCategory++;
        }
      }
    }

    addBoxes();
  }

  /* Draw the waffle chart -------------------------------------------------------------------*/
  draw() {
    this.boxes.forEach((boxes) => {
      boxes.forEach((box) => box.draw());
    });
  }

  /* Interactivity ---------------------------------------------------------------------------*/
  checkMouse(mouseX, mouseY) {
    for (let i = 0; i < this.boxes.length; i++) {
      for (let j = 0; j < this.boxes[i].length; j++) {
        let mouseOver = this.boxes[i][j].mouseOver(mouseX, mouseY);
        if (mouseOver) {
          push();
          fill(120);
          textSize(14);
          textAlign(LEFT, TOP);
          rect(mouseX, mouseY, textWidth(mouseOver.label) + 20, -40, 8);
          fill(255);
          text(mouseOver.label, mouseX + 10, mouseY - 35);
          text(mouseOver.number + "%", mouseX + 10, mouseY - 19);
          pop();
          break;
        }
      }
    }
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

  mouseOver(mouseX, mouseY) {
    if (
      mouseX > this.x &&
      mouseX < this.x + this.size &&
      mouseY > this.y &&
      mouseY < this.y + this.size
    ) {
      return this.category;
    }
    return false;
  }

  draw() {
    noStroke();
    fill(this.category.color);
    square(this.x, this.y, this.size, this.size / 2.5);
  }
}
