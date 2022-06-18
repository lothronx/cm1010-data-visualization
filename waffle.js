function Waffle(x, y, size, table, columnHeading) {
  const boxesEachLine = 10;

  /* Get necessary information from the table.------------------------------------------------*/
  const labels = table.getColumn(0).filter((value) => value != "");
  let percentage = table.getColumn(columnHeading);
  const colors = [
    color(11, 50, 107), //blue
    color(245, 189, 66), //yellow
    color(176, 153, 119), //khaki
    color(130, 119, 117), //brown
    color(241, 199, 221), //pink
    color(123, 203, 192), //cyan
  ];

  /* Categories is an array of objects made from the information above. ----------------------*/
  let categories = labels.map((label, i) => {
    return {
      label: label,
      number: round(percentage[i]),
      color: colors[i],
    };
  });

  /* Boxes is an array of all boxes. ---------------------------------------------------------*/
  const boxSize = size / boxesEachLine;
  const boxAmount = pow(boxesEachLine, 2); // The total amount of boxes is 100 in this case.
  const boxes = Array.from(Array(boxAmount), () => new Box(x, y, boxSize, {})); // Make 100 empty boxes first.
  assignValueToBoxes();

  function assignValueToBoxes() {
    boxes.forEach((box, i) => {
      box.x = x + boxSize * (i % boxesEachLine);
      box.y = y + boxSize * floor(i / boxesEachLine);
    });

    let categoryIndex = 0;
    let boxesEachCategory = 0;
    for (let i = 0; i < boxAmount; i++) {
      if (boxesEachCategory == categories[categoryIndex].number) {
        boxesEachCategory = 0;
        categoryIndex++;
      }
      boxes[i].category = categories[categoryIndex];
      boxesEachCategory++;
    }
  }

  /* Draw the waffle chart -------------------------------------------------------------------*/
  this.draw = function () {
    for (let i = 0; i < boxAmount; i++) {
      boxes[i].draw();
    }
  };
}

function Box(x, y, size, category) {
  this.draw = function () {
    noStroke();
    fill(category.color);
    square(x, y, size, size / 4);
  };
}
