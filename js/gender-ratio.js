// Data collected from National Bureau of Statistics http://www.stats.gov.cn/tjsj/ndsj/

function GenderRatio() {
  /* Basic Information -------------------------------------------------------------------------*/
  this.name = "Gender Ratio in China (Dumbbell Plot)";
  this.id = "gender-ratio";
  this.title =
    "The Missing Women: Gender Ratio in Urban, Town, and Rural China 2020";
  this.description = `In China, there are 104.8 men for every 100 women. The phenomenon of "missing women" is especially acute in rural regions. Studies suggest that the reasons behind include gender-selective abortion, female infanticide, inadequate healthcare and nutrition for female children, and rural to urban migration. While most news and media focus themselves on metropolitan trends, the rural story needs to be told.`;

  /* Load Data -------------------------------------------------------------------------------*/
  this.loaded = false;
  this.preload = function () {
    this.data = loadTable(
      "/data/china-gender-ratio/china-gender-ratio-2020.csv",
      "csv",
      "header",
      () => (this.loaded = true)
    );
  };

  /* Setup ----------------------------------------------------------------------------------*/
  const margin = 80;
  let dumbbells = [];

  this.setup = function () {
    if (!this.loaded) throw new Error("Data not yet loaded");

    // This diagram needs minimum 700px height.
    resizeCanvas(windowWidth * 0.7, max(windowHeight * 0.8, 700));

    // Get data from the table.
    const provinces = this.data.getRows();

    // Find the vertical layout.
    const numProvinces = this.data.getRowCount();
    const verticalSpacing = (height - margin * 2) / (numProvinces - 1);

    // Find min and max Ratio by putting all data (filtering province names out) in an one dimensional array.
    // This is to prepare for horizontal layout.
    const allData = this.data.getArray().reduce((a, c) => a.concat(c));
    const filteredData = allData.filter((data) => data >= 0);
    this.minRatio = floor(min(filteredData)) - 10;
    this.maxRatio = ceil(max(filteredData)) + 5;

    // Push all data to dumbbells. Each dumbbell represents one province.
    dumbbells = [];
    provinces.forEach((province, i) =>
      dumbbells.push(
        new Dumbbell(
          province.obj.Province,
          this.mapRatioToWidth(province.obj.Urban),
          this.mapRatioToWidth(province.obj.Town),
          this.mapRatioToWidth(province.obj.Rural),
          this.mapRatioToWidth(province.obj.Total),
          margin + verticalSpacing * i
        )
      )
    );

    // Create the DOM element container
    this.inputContainer = createDiv();
    this.inputContainer.id("input");
    this.inputContainer.parent("diagram-container");
    this.inputContainer.style("font-weight", "700");

    // Create the checkbox DOM element.
    const checkbox1 = createCheckbox("Urban");
    checkbox1.style("color", "rgb(123, 203, 192)");
    checkbox1.parent("input");
    checkbox1.changed(this.displayUrban);

    const checkbox2 = createCheckbox("Town");
    checkbox2.style("color", "rgb(245, 189, 66)");
    checkbox2.parent("input");
    checkbox2.changed(this.displayTown);

    const checkbox3 = createCheckbox("Rural");
    checkbox3.style("color", "rgb(240, 81, 41)");
    checkbox3.parent("input");
    checkbox3.changed(this.displayRural);

    const checkbox4 = createCheckbox("Total");
    checkbox4.style("color", "rgb(11, 50, 107)");
    checkbox4.parent("input");
    checkbox4.changed(this.displayTotal);
  };

  /* Destroy ---------------------------------------------------------------------------------*/
  this.destroy = function () {
    this.inputContainer.remove();
  };

  /* Draw ----------------------------------------------------------------------------------*/
  this.draw = function () {
    //Draw the reference lines where gender ratio = 90, 100, 110, 120, and 130.
    textSize(14);
    textAlign(CENTER);
    const referenceLines = [90, 100, 110, 120, 130];
    referenceLines.forEach((value) => {
      let x = this.mapRatioToWidth(value);
      noStroke();
      fill(230);
      text(value, x, margin - 30);
      stroke(230);
      line(x, margin - 20, x, height - margin + 20);
    });

    // Draw the dumbbells
    dumbbells.forEach((dumbbell) => {
      dumbbell.display();
      dumbbell.hover();
    });
  };

  /* Helper Functions -----------------------------------------------------------------------*/
  this.displayUrban = function () {
    if (this.checked()) {
      print("urban checked");
    }
  };

  this.displayTown = function () {
    if (this.checked()) {
      print("town checked");
    }
  };

  this.displayRural = function () {
    if (this.checked()) {
      print("rural checked");
    }
  };

  this.displayTotal = function () {
    if (this.checked()) {
      print("total checked");
    }
  };

  this.mapRatioToWidth = function (value) {
    return map(value, this.minRatio, this.maxRatio, 0, width);
  };
}
