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
    if (!this.loaded) {
      console.log("Data not yet loaded");
      return;
    }

    // Create the DOM element container
    const inputContainer = createElement("div");
    inputContainer.attribute("id", "input");
    inputContainer.parent("diagram-container");

    // Create some text.
    this.selectText1 = createElement(
      "h4",
      "Compare employee race diversity between"
    );
    this.selectText1.parent("input");

    // Create the select DOM element.
    this.select1 = createSelect();
    this.select1.parent("input");

    // Create some text.
    this.selectText2 = createElement("h4", "&");
    this.selectText2.parent("input");

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
    this.select1.remove();
    this.select2.remove();
    this.selectText1.remove();
    this.selectText2.remove();
  };

  /* Draw ----------------------------------------------------------------------------------*/
  this.draw = function () {
    if (!this.loaded) {
      console.log("Data not yet loaded");
      return;
    }

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
    this.waffle1.draw();
    this.waffle1.checkMouse(mouseX, mouseY);

    // Draw the second waffle chart.
    this.waffle2 = new Waffle(
      width * 0.55,
      50,
      width * 0.4,
      this.data,
      company2
    );
    this.waffle2.draw();
    this.waffle2.checkMouse(mouseX, mouseY);

    // some text
    fill(50);
    textAlign(CENTER);
    textSize(20);
    text(company1, width * 0.25, 80 + width * 0.4);
    text(company2, width * 0.75, 80 + width * 0.4);
    text("VS", width * 0.5, 50 + width * 0.2);
  };
}
