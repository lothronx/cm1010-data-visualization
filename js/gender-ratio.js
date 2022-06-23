function GenderRatio() {
  /* Basic Information -------------------------------------------------------------------------*/
  this.name = "Gender Ratio in China (Dumbbell Plot)";
  this.id = "gender-ratio";
  this.title =
    "Those Left Behind: Gender Ratio in Urban, Town, and Rural China 2020";
  this.description =
    "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Reiciendis nisi tenetur atque blanditiis ad voluptatibus.";

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
  const margin = 40;
  let dumbbells = [];

  this.setup = function () {
    if (!this.loaded) {
      console.log("Data not yet loaded");
      return;
    }

    resizeCanvas(windowWidth * 0.7, max(windowHeight * 0.8, 700));

    // Get data from the table.
    const provinces = this.data.getRows();

    // Find the number of provinces.
    const numProvinces = this.data.getRowCount();
    const verticalSpacing = (height - margin * 2) / (numProvinces - 1);

    // Find min and max Ratio by putting all data (filtering province names out) in an one dimensional array.
    const allData = this.data.getArray().reduce((a, c) => a.concat(c));
    const filteredData = allData.filter((data) => data >= 0);
    this.minRatio = floor(min(filteredData)) - 10;
    this.maxRatio = ceil(max(filteredData)) + 10;

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

    // Create the checkbox DOM element.
    this.checkbox1 = createCheckbox("Urban Area", true);
    this.checkbox1.parent("input");
    this.checkbox1.changed(this.display);

    this.checkbox2 = createCheckbox("Town", true);
    this.checkbox2.parent("input");
    this.checkbox2.changed(this.display);

    this.checkbox3 = createCheckbox("Rural Area", true);
    this.checkbox3.parent("input");
    this.checkbox3.changed(this.display);

    this.checkbox4 = createCheckbox("Total", true);
    this.checkbox4.parent("input");
    this.checkbox4.changed(this.display);
  };

  /* Destroy ---------------------------------------------------------------------------------*/
  this.destroy = function () {
    this.inputContainer.remove();
  };

  /* Draw ----------------------------------------------------------------------------------*/
  this.draw = function () {
    if (!this.loaded) {
      console.log("Data not yet loaded");
      return;
    }

    dumbbells.forEach((dumbbell) => dumbbell.display());
  };

  /* Helper Functions -----------------------------------------------------------------------*/
  this.display = function () {
    if (this.checked()) {
      print("checked");
      fill(100);
    } else {
      fill(200);
    }
  };

  this.mapRatioToWidth = function (value) {
    return map(value, this.minRatio, this.maxRatio, 0, width);
  };
}
