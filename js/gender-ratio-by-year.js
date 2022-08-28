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
    noCanvas();
    this.map = document.createElement("object");
    this.map.setAttribute("data", "data/china-gender-ratio/chinaLow.svg");
    document.querySelector("#app").appendChild(this.map);
  };

  this.destroy = function () {
    this.map.remove();
  };

  this.draw = function () {};
}
