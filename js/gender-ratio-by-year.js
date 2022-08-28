// Data collected from National Bureau of Statistics http://www.stats.gov.cn/tjsj/ndsj/
// Work in progress...

function GenderRatioByYear() {
  /* Basic Information -------------------------------------------------------------------------*/
  this.name = "Gender Ratio in China: 1998-2020 (Map)";
  this.id = "gender-ratio-by-year";
  this.title = "The Missing Women: Gender Ratio in China (1998-2020)";
  this.description = `Where did our missing sisters go? Statistics show that the gender ratio in China has grown particularly skewed in the past three decades, as a result of decommunization, agricultural decollectivization, the rise of cultural conservatism, and the development of gender selective technologies. We cannot go back in time, but what kind of future are we looking into?`;

  /* Load Data -------------------------------------------------------------------------------*/
  this.loaded = false;
  this.preload = function () {
    this.data = loadTable(
      "/data/china-gender-ratio/china-gender-ratio-1998-2020.csv",
      "csv",
      "header",
      () => (this.loaded = true)
    );
  };

  /* Setup ----------------------------------------------------------------------------------*/
  this.setup = function () {
    // remove the canvas
    noCanvas();
    // import the map as an HTML <object>
    this.map = document.createElement("object");
    this.map.setAttribute("type", "image/svg+xml");
    this.map.setAttribute("data", "data/china-gender-ratio/chinaLow.svg");
    document.querySelector("#app").appendChild(this.map);

    // Make sure data is loaded
    if (!this.loaded) throw new Error("Data not yet loaded");

    // Find the max gender ratio by putting all data (filtering province names out) in an one dimensional array.
    const allData = this.data.getArray().reduce((a, c) => a.concat(c));
    const filteredData = allData.filter((data) => data >= 0);
    this.maxRatio = ceil(max(filteredData));

    this.addDOMElements();
  };

  /* Destroy ---------------------------------------------------------------------------------*/
  this.destroy = function () {
    this.map.remove();
    this.inputContainer.remove();
  };

  /* Draw ----------------------------------------------------------------------------------*/
  this.draw = function () {
    // mapSVG is the svg HTML DOM element. Each province is a path.
    const mapSVG = document.querySelector("object").contentDocument;

    // make sure mapSVG is fully loaded before doing anything
    // check whether mapSVG is fully loaded by check whether it contains an element named "Beijing"
    if (mapSVG.getElementById("Beijing")) {
      // by default, the whole map is gray with white outline.
      const lands = mapSVG.querySelectorAll(".land");
      lands.forEach((land) => {
        land.setAttribute("fill", "#cccccc");
        land.setAttribute("stroke", "#ffffff");
        land.setAttribute("stroke-width", "0.5");
      });

      // prepare the date of the current year
      this.findCurrentYear();

      this.dataOfCurrentYear.forEach((data) => {
        // divide the gender ratio into 6 classes: 5 over 100, represented by warm colors; 1 below 100, represented by green.
        const ratioGap = (this.maxRatio - 100) / 5;

        // color each province according to its gender ratio class.
        let province = mapSVG.getElementById(data.name);
        data.ratio > this.maxRatio - ratioGap
          ? province.setAttribute("fill", "#581845")
          : data.ratio > this.maxRatio - ratioGap * 2
          ? province.setAttribute("fill", "#900C3F")
          : data.ratio > this.maxRatio - ratioGap * 3
          ? province.setAttribute("fill", "#C70039")
          : data.ratio > this.maxRatio - ratioGap * 4
          ? province.setAttribute("fill", "#FF5733")
          : data.ratio > 100
          ? province.setAttribute("fill", "#FFC300")
          : province.setAttribute("fill", "#2A9D8F");
      });
    }
  };

  /* Add DOM Elements ------------------------------------------------------------------------*/
  this.addDOMElements = function () {
    // Create the DOM element container
    this.inputContainer = createDiv();
    this.inputContainer.id("input");
    this.inputContainer.parent("app");

    // Create some text, content defined later in draw()
    createElement("h4", "").parent("input");

    // Create the slider DOM element.
    this.slider = createSlider(1998, 2020, 2020, 1);
    this.slider.parent("input");
  };

  /* prepare the data of current year -----------------------------------------------------------------------*/
  this.findCurrentYear = function () {
    // the current year is the selected year
    const currentYear = this.slider.value();

    // show the current year in the control panel text
    document.querySelector("h4").innerHTML = `Gender ratio in year ${currentYear}`;

    // prepare the data of current year.
    // the data of current year is an array of objects with two properties: name and ratio.
    const provinces = this.data.getColumn("Province");
    let ratios = null;
    this.data.columns.forEach((column) => {
      if (column == currentYear) {
        ratios = this.data.getColumn(column);
      }
    });

    this.dataOfCurrentYear = provinces.map((province, i) => {
      return {
        name: province,
        ratio: ratios[i],
      };
    });
  };
}
