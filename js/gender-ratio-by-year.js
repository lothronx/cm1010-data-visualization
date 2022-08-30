// Data collected from National Bureau of Statistics http://www.stats.gov.cn/tjsj/ndsj/
// Map downloaded from amcharts - SVG map of China https://www.amcharts.com/svg-maps/?map=china

function GenderRatioByYear() {
  /* Basic Information -------------------------------------------------------------------------*/
  this.name = "Gender Ratio in China: 1998-2020 (Map)";
  this.id = "gender-ratio-by-year";
  this.title = "The Missing Women: Gender Ratio in China (1998-2020)";
  this.description = `Where did our missing sisters go? Statistics show that the gender ratio in China has grown particularly skewed in the past three decades, as a result of decommunization, agricultural decollectivization, the rise of cultural conservatism, and the development of gender selective technologies. We cannot go back in time, but what kind of future are we looking into? *Tips: Use the slider to choose year. Hover over each province to see details.`;

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
  };

  /* Destroy ---------------------------------------------------------------------------------*/
  this.destroy = function () {
    this.mapContainer.remove();
    this.inputContainer.remove();
  };

  /* Draw ----------------------------------------------------------------------------------*/
  this.draw = function () {
    // prepare the data of the current year
    this.findCurrentYear();

    // make sure map <svg> is loaded before all else
    if (document.querySelector("svg")) {
      this.dataOfCurrentYear.forEach((data) => {
        let province = document.getElementById(data.name);

        // color each province according to its gender ratio. the more skewed ratio, the redder.
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

        // when the mouse hovers over the province, highlight the province and show detail
        province.addEventListener(
          "mouseover",
          () => {
            province.setAttribute("filter", "opacity(80%) drop-shadow(0 0 4px gray)");
            document.querySelector(
              "#detail"
            ).innerHTML = `Gender ratio in ${data.name} ${this.currentYear} is ${data.ratio} men per 100 women.`;
          },
          { passive: true }
        );

        // when the mouse is out, hide detail
        province.addEventListener(
          "mouseout",
          () => {
            province.setAttribute("filter", "none");
            document.querySelector("#detail").innerHTML = "";
          },
          { passive: true }
        );
      });
    }
  };

  /* Import the map ------------------------------------------------------------------------*/
  this.addMap = function () {
    // Create the map container
    this.mapContainer = createDiv();
    this.mapContainer.id("canvas");
    this.mapContainer.parent("app");

    // load the map
    // JS Promise object code adapted from https://www.w3schools.com/js/js_promise.asp
    new Promise(function (myResolve) {
      let map = new XMLHttpRequest();
      map.open("GET", "data/china-gender-ratio/chinaLow.svg");
      map.onload = function () {
        if (map.status == 200) {
          myResolve(map.response);
        }
      };
      map.send();
    }).then((svg) => {
      // after the map is loaded, import the map to html
      document.getElementById("canvas").innerHTML = svg;

      // set the map height and width
      document.querySelector("svg").style.width = "60vw";
      document.querySelector("svg").style.height = "42vw";

      // by default, the whole map is gray with white outline.
      document.querySelectorAll(".land").forEach((land) => {
        land.setAttribute("fill", "#cccccc");
        land.setAttribute("stroke", "#ffffff");
      });

      // Create the legend container
      createDiv().id("legend").parent("canvas");

      // Create some legend text
      createElement("h5", "■ > 120").style("color", "#581845").parent("legend");
      createElement("h5", "■ 115 - 120").style("color", "#900C3F").parent("legend");
      createElement("h5", "■ 110 - 115").style("color", "#C70039").parent("legend");
      createElement("h5", "■ 105 - 110").style("color", "#FF5733").parent("legend");
      createElement("h5", "■ 100 - 105").style("color", "#FFC300").parent("legend");
      createElement("h5", "■ <= 100").style("color", "#2A9D8F").parent("legend");
    });
  };

  /* Add DOM Elements ------------------------------------------------------------------------*/
  this.addDOMElements = function () {
    // Create the DOM element container
    this.inputContainer = createDiv();
    this.inputContainer.id("input");
    this.inputContainer.parent("app");
    this.inputContainer.style("padding-bottom", "1.5rem");

    // Create some text, content defined later in draw()
    createElement("h4", "").parent("input");

    // Create the slider DOM element.
    this.slider = createSlider(1998, 2020, 2020, 1);
    this.slider.parent("input");

    // Create some more text, content defined later in draw()
    createDiv().id("detail").parent("input");
  };

  /* prepare the data of current year -----------------------------------------------------------------------*/
  this.findCurrentYear = function () {
    // the current year is the selected year
    this.currentYear = this.slider.value();

    // show the current year in the control panel text
    document.querySelector("h4").innerHTML = `Gender ratio in year ${this.currentYear}`;

    // prepare the data of current year.
    // the data of current year is an array of objects with two properties: name and ratio.
    const provinces = this.data.getColumn("Province");
    let ratios = null;
    this.data.columns.forEach((column) => {
      if (column == this.currentYear) {
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
