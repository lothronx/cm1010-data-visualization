// Data collected from The World Bank - Global sex ratio at birth (male births per female births) https://data.worldbank.org/indicator/SP.POP.BRTH.MF?view=map

function SexRatioAtBirth() {
  /* Basic Information ----------------------------------------------------------------------*/
  this.name = "Global Sex Ratio at Birth (Line Chart Series)";
  this.id = "sex-ratio-at-birth";
  this.title = "Sex Ratio At Birth in Top 10 Most Populated Countries";
  this.description = `Without human interference, the natural sex ratio at birth should be around 105 boys per 100 girls. Skewed sex ratio at birth is clear evidence of gender selection through prenatal sex determination and gender selective abortion. It's time to end sexism. *Tip: Hover over the country name to show that country only.`;
  const xAxisLabel = "Year";
  const yAxisLabel = "Male births per 100 female births";
  const numXTickLabels = 6;
  const numYTickLabels = 7;
  const margin = 60;
  const colors = [
    color(0, 0, 0),
    color(227, 51, 126), //red
    color(240, 81, 41), //orange
    color(220, 149, 170), //pink
    color(130, 119, 117), //brown
    color(245, 189, 66), //yellow
    color(176, 153, 119), //khaki
    color(150, 110, 172), //purple
    color(123, 203, 192), //cyan
    color(11, 50, 107), //blue
    color(183, 204, 148), //green
  ];

  let lines = [];

  /* Load Data ------------------------------------------------------------------------------*/
  this.loaded = false;
  this.preload = function () {
    this.data = loadTable(
      "/data/global-sex-ratio/global-sex-ratio-1962-2020.csv",
      "csv",
      "header",
      () => (this.loaded = true)
    );
  };

  /* Setup ----------------------------------------------------------------------------------*/

  this.setup = function () {
    if (!this.loaded) throw new Error("Data not yet loaded");

    // Get data from the table.
    const countries = this.data.getRows();

    // Find the beginning and the end year. This will be used for x-axis coordinates.
    this.startYear = Number(this.data.columns[1]);
    this.endYear = Number(this.data.columns[this.data.columns.length - 1]);

    // Find the biggest and the smallest ratio number by putting all data from the table in an one-dimensional array and filtering the country names (which are not numbers) out. This will be used for y-axis coordinates.
    const allData = this.data.getArray().reduce((a, c) => a.concat(c));
    const filteredData = allData.filter((data) => data >= 0);
    this.minRatio = floor(min(filteredData));
    this.maxRatio = ceil(max(filteredData)) + 1;

    // Push data to lines. Each line represents one country.
    lines = [];
    countries.forEach((country, i) => {
      let name = country.arr[0];

      // Map years to x coordinates
      let x = [];
      let years = this.data.columns.filter((value) => value != "");
      years.forEach((year) => x.push(this.mapYearToWidth(year)));

      // Map ratios to y coordinates
      let y = [];
      let ratios = country.arr.filter((value) => value > 0);
      ratios.forEach((ratio) => y.push(this.mapRatioToHeight(ratio)));

      lines.push(new Line(name, x, y, colors[i], lines));
    });
  };

  /* Draw ----------------------------------------------------------------------------------*/
  this.draw = function () {
    resizeCanvas(windowWidth * 0.7, windowHeight * 0.7);

    drawAxis();
    drawLabels();
    this.drawXLabels();
    this.drawYLabels();
    lines.forEach((line) => {
      line.display();
      line.hover(mouseX, mouseY);
    });
  };

  /* Helper Functions -----------------------------------------------------------------------*/
  this.mapYearToWidth = function (value) {
    return map(
      value,
      this.startYear,
      this.endYear,
      margin, // Draw left-to-right from margin.
      width - margin * 2
    );
  };

  this.mapRatioToHeight = function (value) {
    return map(
      value,
      this.minRatio,
      this.maxRatio,
      height - margin, // Lower Ratio at bottom.
      margin / 2 // Higher Ratio at top.
    );
  };

  // Draw x and y axis.
  let drawAxis = function () {
    stroke(50);
    strokeWeight(1);
    line(margin, height - margin, width - margin, height - margin); // x-axis
    line(margin, margin / 2, margin, height - margin); // y-axis
  };

  // Draw x and y axis labels.
  let drawLabels = function () {
    noStroke();
    fill(50);
    textSize(16);
    textAlign(CENTER, CENTER);
    textStyle(NORMAL);
    // x-axis label
    text(xAxisLabel, width / 2, height - margin * 0.1);
    // y-axis label
    push();
    translate(margin * 0.1, height / 2);
    rotate(-PI / 2);
    text(yAxisLabel, 0, 0);
    pop();
  };

  // Draw all x-axis labels.
  this.drawXLabels = function () {
    textSize(14);
    textAlign(CENTER, TOP);
    const numYears = this.endYear - this.startYear;
    const yearGap = ceil(numYears / numXTickLabels);
    const yearLabels = this.data.columns.filter(
      (year) => (year - this.startYear) % yearGap == 0 || year == this.endYear
    );
    yearLabels.forEach((yearLabel) => {
      let x = this.mapYearToWidth(yearLabel);
      noStroke();
      text(yearLabel, x, height - margin * 0.8);
      stroke(200);
      line(x, margin / 2, x, height - margin);
    });
  };

  // Draw all y-axis labels.
  this.drawYLabels = function () {
    textSize(14);
    textAlign(RIGHT, BOTTOM);
    const ratioRange = this.maxRatio - this.minRatio;
    const ratioCommonDifference = round(ratioRange / numYTickLabels);
    for (let i = 0; i < numYTickLabels; i++) {
      let ratioLabel = this.minRatio + ratioCommonDifference * i;
      let y = this.mapRatioToHeight(ratioLabel);
      noStroke();
      text(ratioLabel, margin * 0.8, y);
      stroke(200);
      line(margin, y, width - margin, y);
    }
  };
}
