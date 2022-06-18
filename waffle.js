function Waffle(x, y, size, table, columnHeading) {
  const boxesEachLine = 10;

  // Get information from the table to prepare for the categories.
  const labels = table.getColumn(0).filter((value) => value != "");
  let data = table.getColumn(columnHeading);
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
      number: round(data[i]),
      color: colors[i],
    };
  });

  // Boxes is a 2D array of boxes
  let boxes = [];
  const boxSize = size / boxesEachLine;




  let currentCategory = 0;
  let currentCategoryBox = 0;
  for (var i = 0; i < boxesEachLine; i++) {
    boxes.push([]);
    for (var j = 0; j < boxesEachLine; j++) {
      if (currentCategoryBox == categories[currentCategory]) {
        currentCategoryBox = 0;
        currentCategory++;
      }
      boxes[i].push(
        new Box(
          x + j * boxSize,
          y + i * boxSize,
          boxSize,
          categories[currentCategory]
        )
      );
      currentCategoryBox++;
    }
  }



  
  // Draw the waffle chart
  this.draw = function () {};
}

function Box(x, y, size, category) {
  this.category = category;
  this.draw = function () {
    noStroke();
    fill(category.color);
    square(x, y, size, side / 4);
  };
}
