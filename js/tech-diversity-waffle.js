// This extension is a redesign of the "Tech Diversity: Race" data visualization template. 
// This extension is built based on Week 11 course materials. 
// Changed are made.

function TechDiversityWaffle() {
  /* Basic Information -------------------------------------------------------------------------*/
  this.name = "Tech Diversity (Waffle Chart)";
  this.id = "tech-diversity-waffle";
  this.title = "Race Diversity in Major Tech Companies";

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

    // Create the DOM element container
    this.inputContainer = createDiv();
    this.inputContainer.id("input");
    this.inputContainer.parent("diagram-container");

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
    this.waffle1 = new Waffle(
      width * 0.05,
      50,
      width * 0.4,
      this.data,
      company1
    );
    this.waffle1.display();
    this.waffle1.checkMouse(mouseX, mouseY);

    // Draw the second waffle chart.
    this.waffle2 = new Waffle(
      width * 0.55,
      50,
      width * 0.4,
      this.data,
      company2
    );
    this.waffle2.display();
    this.waffle2.checkMouse(mouseX, mouseY);

    // some text
    noStroke();
    fill(50);
    textSize(20);
    textAlign(CENTER);
    textStyle(NORMAL);

    text(company1, width * 0.25, 80 + width * 0.4);
    text(company2, width * 0.75, 80 + width * 0.4);
    text("VS", width * 0.5, 50 + width * 0.2);
  };
}
