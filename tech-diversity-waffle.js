function TechDiversityWaffle() {
  /* Basic Information -------------------------------------------------------------------------*/
  this.name = "Tech Diversity (Waffle Chart)";
  this.id = "tech-diversity-waffle";
  this.title = "Race Diversity in Major Tech Companies";

  /* Load Data -------------------------------------------------------------------------------*/
  this.loaded = false;
  this.preload = function () {
    const self = this;
    this.data = loadTable(
      "./data/tech-diversity/race-2018.csv",
      "csv",
      "header",
      function (table) {
        self.loaded = true;
      }
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

    // Create the text.
    this.selectText1 = createElement(
      "h4",
      "Compare employee race diversity between"
    );
    this.selectText1.parent("input");

    // Create the select DOM element.
    this.select1 = createSelect();
    this.select1.parent("input");

    // Create the text.
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

    // Draw the waffle chart
    this.waffle = new Waffle(100, 100, 500, this.data, company1);
    this.waffle.draw();
  };
}
