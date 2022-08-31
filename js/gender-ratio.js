// Data collected from National Bureau of Statistics http://www.stats.gov.cn/tjsj/ndsj/

function GenderRatio() {
  /* Basic Information -------------------------------------------------------------------------*/
  this.name = "Gender Ratio in China (Dumbbell Plot)";
  this.id = "gender-ratio";
  this.title = "The Missing Women: Gender Ratio in Urban, Town, and Rural China 2020";
  this.description = `In China, there are 104.8 men for every 100 women. The phenomenon of "missing women" is especially acute in rural regions. Studies suggest that the reasons behind include gender-selective abortion, female infanticide, inadequate healthcare and nutrition for female children, and rural to urban migration. While most news and media focus themselves on metropolitan trends, the rural voice needs to be heard. (Unit: men per 100 women) *Tip: Hover over each dumbbell to enlarge it slightly.`;
  const margin = 60;
  let dumbbells = [];

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
  this.setup = function () {
    //this figure needs at least 800px height to prevent shapes from overlapping.
    createCanvas(windowWidth * 0.7, max(windowHeight * 0.7, 800)).parent("app");

    if (!this.loaded) throw new Error("Data not yet loaded");

    // Get data from the table.
    const provinces = this.data.getRows();

    // Find the vertical layout.
    const numProvinces = this.data.getRowCount();
    this.verticalSpacing = round((max(windowHeight * 0.7, 800) - margin * 2) / (numProvinces - 1));

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
          margin + this.verticalSpacing * i
        )
      )
    );

    this.addDOMElements();
  };

  /* Destroy ---------------------------------------------------------------------------------*/
  this.destroy = function () {
    this.inputContainer.remove();
  };

  /* Draw ----------------------------------------------------------------------------------*/
  this.draw = function () {
    this.drawReferenceLines();

    // When radio option is selected, sort dumbbells accordingly.
    let val = this.radio.value();
    this.options.forEach((option) => {
      if (val == option) {
        dumbbells.sort(function (a, b) {
          //National dumbbell should always be on top above provincial dumbbells.
          //The two lines below copied from https://stackoverflow.com/questions/17254537/javascript-sorting-with-exception
          if ((a.tag === "National") != (b.tag === "National")) return a.tag === "National" ? -1 : 1;
          return a[option] > b[option] ? 1 : a[option] < b[option] ? -1 : 0;
        });
      }
    });

    // Let each dumbbell move to its newly sorted position by changing its y coordinate, with some animation effect.
    dumbbells.forEach((dumbbell, i) => {
      dumbbell.yNew = margin + this.verticalSpacing * i;
      if (dumbbell.y > dumbbell.yNew) {
        dumbbell.y -= this.verticalSpacing / 4;
      } else if (dumbbell.y < dumbbell.yNew) {
        dumbbell.y += this.verticalSpacing / 4;
      }
    });

    // Draw the dumbbells
    dumbbells.forEach((dumbbell) => {
      dumbbell.display();
      dumbbell.hover();
    });
  };

  /* Add DOM Elements ------------------------------------------------------------------------*/
  this.addDOMElements = function () {
    // Create the DOM element container
    this.inputContainer = createDiv();
    this.inputContainer.id("input");
    this.inputContainer.parent("app");
    this.inputContainer.style("font-weight", "700");

    // Create some text.
    createElement("h4", "Sort by").parent("input");

    // Create the radio DOM element.
    this.radio = createRadio();
    this.radio.parent("input");
    this.options = this.data.columns.filter((value) => value != "Province");
    this.options.forEach((value) => {
      let x = this.radio.option(value);
      x.id = value;
    });

    // Create some more text.
    createElement("h4", "gender ratio").parent("input");
  };

  /* Helper Functions -----------------------------------------------------------------------*/
  this.mapRatioToWidth = function (value) {
    return map(value, this.minRatio, this.maxRatio, margin, width - margin);
  };

  this.drawReferenceLines = function () {
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
  };
}
