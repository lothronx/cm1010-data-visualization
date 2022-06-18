function Waffle(x, y, size, table, columnHeading) {
  const boxesEachLine = 10;

  // Get information from the table to prepare for the categories.
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

  // Categories is an array of objects made from the information above.
  let categories = labels.map((label, i) => {
    return {
      label: label,
      number: round(percentage[i]),
      color: colors[i],
    };
  });

  // Boxes is an array of all boxes.
  const boxSize = size / boxesEachLine;
  const boxAmount = pow(boxesEachLine, 2); // The total amount of boxes is 100 in this case.
  // Make 100 empty boxes first.
  const boxes = Array.from(Array(boxAmount), () => new Box(0, 0, boxSize, {}));
  // Give value to each box.
  boxes.forEach((box, i) => {
    box.x = x + boxSize * (i % boxesEachLine);
    box.y = y + boxSize * floor(i / boxesEachLine);
  });
  for (i = 0; i < boxAmount; i++) {
    let categoryIndex = 0;
    let boxesInCategory = 0;
    if (boxesInCategory == categories[categoryIndex].number) {
      boxesInCategory = 0;
      categoryIndex++;
    }
    boxes[i].category = categories[categoryIndex];
    boxesInCategory++;
  }

  console.log(boxes);

  // Draw the waffle chart
  this.draw = function () {};
}

function Box(x, y, size, category) {
  this.x = x;
  this.y = y;
  this.category = category;
  this.draw = function () {
    noStroke();
    fill(category.color);
    square(x, y, size, side / 4);
  };
}
