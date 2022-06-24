// Global variable to store the gallery object. The gallery object is a container for all the visualizations.
var gallery;

function setup() {
  // Create a canvas to fill the content div from index.html.
  canvasContainer = select("#app");
  var c = createCanvas(windowWidth * 0.7, windowHeight * 0.7);
  c.parent("app");

  // Create a new gallery object.
  gallery = new Gallery();

  // Add the visualization objects here.
  gallery.addVisual(new PayGapByBouncyBubbles());
  gallery.addVisual(new TechDiversityWaffle());
  gallery.addVisual(new SexRatioAtBirth());
  gallery.addVisual(new GenderRatio());
  gallery.addVisual(new GenderRatioByYear());
}

function draw() {
  background(255);
  if (gallery.selectedVisual != null) {
    gallery.selectedVisual.draw();
  }
}

function mouseClicked() {
  gallery.selectedVisual.mouseClicked(mouseX, mouseY);
}

function windowResized() {
  gallery.selectedVisual.windowResized();
}
