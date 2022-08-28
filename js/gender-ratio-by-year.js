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

    // Create the DOM element container
    this.inputContainer = createDiv();
    this.inputContainer.id("input");
    this.inputContainer.parent("app");

    // Create some text, content defined later in draw()
    createElement("h4", "").parent("input");

    // Create the slider DOM element.
    this.slider = createSlider(1998, 2020, 2020, 1);
    this.slider.parent("input");

    // Find the max gender ratio by putting all data (filtering province names out) in an one dimensional array.
    const allData = this.data.getArray().reduce((a, c) => a.concat(c));
    const filteredData = allData.filter((data) => data >= 0);
    this.maxRatio = ceil(max(filteredData));
  };

  this.destroy = function () {
    this.map.remove();
    this.inputContainer.remove();
  };

  this.draw = function () {
    // mapSVG is the svg HTML DOM element. Each province is a path.
    const mapSVG = document.querySelector("object").contentDocument;

    // make sure mapSVG is fully loaded before doing anything
    // check whether mapSVG is fully loaded by check whether it contains an element named "Beijing"
    if (mapSVG.getElementById("Beijing")) {
      // by default, the whole map is gray
      const lands = mapSVG.querySelectorAll(".land");
      lands.forEach((land) => land.setAttribute("fill", "#cccccc"));

      // find the current year
      this.year = this.slider.value();

      // show the control panel text
      document.querySelector("h4").innerHTML = `Gender ratio in year ${this.year}`;

      // find the data of current year.
      // the data of current year is an array of objects with two properties: name and ratio.
      const provinces = this.data.getColumn("Province");
      let ratios = null;
      this.data.columns.forEach((column) => {
        if (column == this.year) {
          ratios = this.data.getColumn(column);
        }
      });
      const dataOfCurrentYear = provinces.map((province, i) => {
        return {
          name: province,
          ratio: ratios[i],
        };
      });

      dataOfCurrentYear.forEach((data) => {
        // divide the gender ratio into 6 classes: 5 over 100, represented by yellow and red; 1 below 100, represented by green.
        const ratioGap = (this.maxRatio - 100) / 5;

        data.ratio > this.maxRatio - ratioGap
          ? mapSVG.getElementById(data.name).setAttribute("fill", "#581845")
          : data.ratio > this.maxRatio - ratioGap * 2
          ? mapSVG.getElementById(data.name).setAttribute("fill", "#900C3F")
          : data.ratio > this.maxRatio - ratioGap * 3
          ? mapSVG.getElementById(data.name).setAttribute("fill", "#C70039")
          : data.ratio > this.maxRatio - ratioGap * 4
          ? mapSVG.getElementById(data.name).setAttribute("fill", "#FF5733")
          : data.ratio > 100
          ? mapSVG.getElementById(data.name).setAttribute("fill", "#FFC300")
          : mapSVG.getElementById(data.name).setAttribute("fill", "#2A9D8F");
      });
    }
  };
}
