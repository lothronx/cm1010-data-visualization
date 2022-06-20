let cnv;
let d;
function setup() {
  cnv = createCanvas(100, 100);
  console.log("this is" + cnv);
  cnv.mouseOver(changeGray);
  d = 10;
}

function draw() {
  ellipse(width / 2, height / 2, d, d);
}

function changeGray() {
  d = d + 10;
  if (d > 100) {
    d = 0;
  }
}
