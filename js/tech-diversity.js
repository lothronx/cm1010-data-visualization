// This extension is a redesign of the "Tech Diversity: Race" data visualization template.
// This extension is built based on Week 11 course materials.
// Changed are made.

function TechDiversityWaffle() {
  /* Basic Information -------------------------------------------------------------------------*/
  this.name = "Tech Diversity (Waffle Chart)";
  this.id = "tech-diversity-waffle";
  this.title = "Race Diversity in Major Tech Companies";
  this.description =
    "*Tip: Hover over the waffle chart to see the percentage of employees of each race.";

  /* Load Data -------------------------------------------------------------------------------*/
  this.loaded = false;
  this.preload = function () {
    this.data = loadTable(
      "/data/tech-diversity/race-2018.csv",
      "csv",
      "header",
      () => (this.loaded = true)
    );
  };

  /* Setup ----------------------------------------------------------------------------------*/
  this.setup = function () {
    if (!this.loaded) throw new Error("Data not yet loaded");

    this.addDOMElements();
  };

  /* Destroy ---------------------------------------------------------------------------------*/
  this.destroy = function () {
    this.inputContainer.remove();
  };

  /* Draw ----------------------------------------------------------------------------------*/
  this.draw = function () {
    // Get the 2 companies we selected by their names.
    let company1 = this.select1.value();
    let company2 = this.select2.value();

    // Draw the first waffle chart.
    const waffle1 = new Waffle(
      width * 0.05,
      20,
      width * 0.4,
      this.data,
      company1
    );
    waffle1.display();
    waffle1.checkMouse(mouseX, mouseY);

    // Draw the second waffle chart.
    const waffle2 = new Waffle(
      width * 0.55,
      20,
      width * 0.4,
      this.data,
      company2
    );
    waffle2.display();
    waffle2.checkMouse(mouseX, mouseY);

    // some text
    noStroke();
    fill(50);
    textSize(20);
    textAlign(CENTER);
    textStyle(NORMAL);

    text(company1, width * 0.25, 50 + width * 0.4);
    text(company2, width * 0.75, 50 + width * 0.4);
    text("VS", width * 0.5, 20 + width * 0.2);
  };

  /* Resize Canvas ---------------------------------------------------------------------------*/
  this.windowResized = function () {
    resizeCanvas(windowWidth * 0.7, windowHeight * 0.7);
  };

  /* Add DOM Elements ------------------------------------------------------------------------*/
  this.addDOMElements = function () {
    // Create the DOM element container
    this.inputContainer = createDiv();
    this.inputContainer.id("input");
    this.inputContainer.parent("app");

    // Create some text.
    const selectText1 = createElement(
      "h4",
      "Compare employee race diversity between"
    );
    selectText1.parent("input");

    // Create the select DOM element.
    this.select1 = createSelect();
    this.select1.parent("input");

    // Create some text.
    const selectText2 = createElement("h4", "&");
    selectText2.parent("input");

    // Create the select DOM element.
    this.select2 = createSelect();
    this.select2.parent("input");

    // Fill the options with all company names.
    const companyNames = this.data.columns.filter((value) => value != "");
    companyNames.forEach((companyName) => {
      this.select1.option(companyName);
      this.select2.option(companyName);
    });
    this.select1.selected("Apple");
    this.select2.selected("Google");
  };
}
