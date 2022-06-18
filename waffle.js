function Waffle(x,y,width,table,columnHeading){
    this.x = x;
    this.y = y;
    this.width = width;
    const boxesNumEachRow = 10;
    const boxesNumEachColumn = 10;

    // Get information from the table and prepare for the categories.
    let data=stringsToNumbers(table.getColumn(columnHeading));
    const labels = table.getColumn(0).filter((value) => value != "");
    const colors = [
      color(11, 50, 107), //blue
      color(245, 189, 66), //yellow
      color(176, 153, 119), //khaki
      color(130, 119, 117), //brown
      color(241, 199, 221), //pink
      color(123, 203, 192), //cyan
    ];

    // Categories will be an array of objects
    let categories = [];
    labels.forEach(label=>categories.push({}))
    // Draw the waffle chart
    this.draw=function(){}
}

function Box(x, y, width,category) {
    this.x = x;
    this.y = y;
    this.width=width;
    this.category=category;
    this.mouseOver(mouseX,mouseY) = function () {};
    this.draw = function () {
        fill(category.color);
        rect(x,y,50,50);
    };
}
