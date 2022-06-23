// Global variable to store the gallery object. The gallery object is
// a container for all the visualisations.
var gallery;

function setup() {
  // Create a canvas to fill the content div from index.html.
  canvasContainer = select("#app");
  var c = createCanvas(windowWidth * 0.7, windowHeight * 0.7);
  c.parent("diagram-container");

  // Create a new gallery object.
  gallery = new Gallery();

  // Add the visualisation objects here.
  gallery.addVisual(new SexRatioAtBirth());
  gallery.addVisual(new TechDiversityWaffle());
  gallery.addVisual(new PayGapByBouncyBubbles());
  gallery.addVisual(new GenderRatio());
  gallery.addVisual(new GenderRatioByYear());
}

function draw() {
  background(255);
  if (gallery.selectedVisual != null) {
    gallery.selectedVisual.draw();
  }
}
function windowResized() {
  resizeCanvas(windowWidth * 0.7, windowHeight * 0.7);
}
