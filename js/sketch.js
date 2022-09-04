// Global variable to store the gallery object. The gallery object is a container for all the visualizations.
let gallery;

function setup() {
  // Create a new gallery object.
  gallery = new Gallery();

  // Add the visualization objects here.
  gallery.addVisual(new PayGap());
  gallery.addVisual(new TechDiversity());
  gallery.addVisual(new SexRatioAtBirth());
  gallery.addVisual(new GenderRatio());
  gallery.addVisual(new GenderRatioByYear());
}

function draw() {
  background(255);
  if (gallery.selectedVisual != null) gallery.selectedVisual.draw();
}