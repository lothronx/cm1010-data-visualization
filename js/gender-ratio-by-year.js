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
    // Make sure data is loaded
    if (!this.loaded) throw new Error("Data not yet loaded");

    // Remove the canvas
    noCanvas();

    // Import the map
    this.addMap();

    // Add the control panel
    this.addDOMElements();

    // Add the legend
    this.addLegend();
  };

  /* Destroy ---------------------------------------------------------------------------------*/
  this.destroy = function () {
    this.mapContainer.remove();
    this.inputContainer.remove();
    this.legendContainer.remove();
  };

  /* Draw ----------------------------------------------------------------------------------*/
  this.draw = function () {
    // mapSVG is the svg HTML DOM element. Each province on the map is a path.
    const mapSVG = document.querySelector("object").contentDocument;

    // make sure mapSVG is fully loaded before doing anything
    // check whether mapSVG is fully loaded by checking whether it contains an element named "Beijing"
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

      // color each province according to its gender ratio. the more skewed ratio, the redder.
      this.dataOfCurrentYear.forEach((data) => {
        let province = mapSVG.getElementById(data.name);
        data.ratio > 120
          ? province.setAttribute("fill", "#581845")
          : data.ratio > 115
          ? province.setAttribute("fill", "#900C3F")
          : data.ratio > 110
          ? province.setAttribute("fill", "#C70039")
          : data.ratio > 105
          ? province.setAttribute("fill", "#FF5733")
          : data.ratio > 100
          ? province.setAttribute("fill", "#FFC300")
          : province.setAttribute("fill", "#2A9D8F");
      });
    }
  };

  /* Import the map ------------------------------------------------------------------------*/
  this.addMap = function () {
    // Create the map container
    this.mapContainer = createDiv();
    this.mapContainer.id("canvas");
    this.mapContainer.parent("app");

    // import the map as an HTML <object>, <object> is 70% windowWidth * 70% windowHeight
    const map = document.createElement("object");
    map.setAttribute("type", "image/svg+xml");
    map.setAttribute("data", "data/china-gender-ratio/chinaLow.svg");
    map.style.width = "70vw";
    map.style.height = "70vh";
    document.querySelector("#canvas").appendChild(map);
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

  /* Add legend ------------------------------------------------------------------------*/
  this.addLegend = function () {
    // Create the legend container
    this.legendContainer = createDiv();
    this.legendContainer.id("legend");
    this.legendContainer.parent("canvas");

    // Create some text
    createElement("h5", "■ > 120").style("color", "#581845").parent("legend");
    createElement("h5", "■ 115 - 120").style("color", "#900C3F").parent("legend");
    createElement("h5", "■ 110 - 115").style("color", "#C70039").parent("legend");
    createElement("h5", "■ 105 - 110").style("color", "#FF5733").parent("legend");
    createElement("h5", "■ 100 - 105").style("color", "#FFC300").parent("legend");
    createElement("h5", "■ <= 100").style("color", "#2A9D8F").parent("legend");
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
