function TechDiversityRace() {
  /* Basic Information -------------------------------------------------------------------------*/
  this.name = "Tech Diversity: Race";
  this.id = "tech-diversity-race";
  this.title = "Race Diversity in Major Tech Companies";
  this.description =
    "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Reiciendis nisi tenetur atque blanditiis ad voluptatibus ipsam enim incidunt odio modi assumenda error officia dignissimos cum deserunt optio commodi distinctio quod veniam itaque, cumque delectus! Eveniet architecto officia provident aut minima dolores qui omnis fuga? Voluptatem alias dicta qui voluptatum sunt?";

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

    // Create a select DOM element.
    var inputContainer = createElement("div");
    inputContainer.attribute("id", "input");
    inputContainer.parent("diagram-container");

    this.select = createSelect();
    this.select.parent("input");

    // Fill the options with all company names.
    var companies = this.data.columns;
    // First entry is empty.
    for (let i = 1; i < companies.length; i++) {
      this.select.option(companies[i]);
    }
  };

  /* Destroy ----------------------------------------------------------------------------------*/
  this.destroy = function () {
    this.select.remove();
  };

  /* Draw ----------------------------------------------------------------------------------*/
  // Create a new pie chart object.
  this.pie = new PieChart(width / 2, height / 2, width * 0.4);

  this.draw = function () {
    if (!this.loaded) {
      console.log("Data not yet loaded");
      return;
    }

    // Get the value of the company we're interested in from the
    // select item.
    var companyName = this.select.value();

    // Get the column of raw data for companyName.
    var col = this.data.getColumn(companyName);

    // Convert all data strings to numbers.
    col = stringsToNumbers(col);

    // Copy the row labels from the table (the first item of each row).
    var labels = this.data.getColumn(0);

    // Colour to use for each category.
    var colours = ["blue", "red", "green", "pink", "purple", "yellow"];

    // Make a title.
    var title = "Employee diversity at " + companyName;

    // Draw the pie chart!
    this.pie.draw(col, labels, colours, title);
  };
}
