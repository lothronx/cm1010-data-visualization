function TechDiversityWaffle() {
  /* Basic Information -------------------------------------------------------------------------*/
  this.name = "Tech Diversity (Waffle Chart)";
  this.id = "tech-diversity-waffle";
  this.title = "Race Diversity in Major Tech Companies";

  /* Load Data -------------------------------------------------------------------------------*/
  this.loaded = false;
  this.preload = function () {
    var self = this;
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

    this.colors = [
      color(11, 50, 107), //blue
      color(245, 189, 66), //yellow
      color(176, 153, 119), //khaki
      color(130, 119, 117), //brown
      color(241, 199, 221), //pink
      color(123, 203, 192), //cyan
    ];

    // Create the DOM element container
    var inputContainer = createElement("div");
    inputContainer.attribute("id", "input");
    inputContainer.parent("diagram-container");

    // Create the text.
    this.selectText = createElement("h4", "Employee diversity at");
    this.selectText.parent("input");

    // Create the select DOM element.
    this.select = createSelect();
    this.select.parent("input");

    // Fill the options with all company names.
    var companyNames = this.data.columns.filter((value) => value != "");
    companyNames.forEach((companyName) => this.select.option(companyName));
  };

  /* Destroy ---------------------------------------------------------------------------------*/
  this.destroy = function () {
    this.select.remove();
    this.selectText.remove();
  };

  /* Draw ----------------------------------------------------------------------------------*/
  this.draw = function () {
    if (!this.loaded) {
      console.log("Data not yet loaded");
      return;
    }

    // Get the value of the company we're interested in from the select item.
    var companyName = this.select.value();

    // Get the column of raw data for companyName.
    var col = this.data.getColumn(companyName);

    // Convert all data strings to numbers.
    col = stringsToNumbers(col);

    // Copy the row labels from the table (the first item of each row).
    var labels = this.data.getColumn(0);
  };
}
