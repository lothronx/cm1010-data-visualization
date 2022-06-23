function SexRatioAtBirth() {
  /* Basic Information ----------------------------------------------------------------------*/
  this.name = "Global Sex Ratio at Birth (Line Chart Series)";
  this.id = "sex-ratio-at-birth";
  this.title = "Sex Ratio At Birth in Top 10 Most Populated Countries";
  this.description =
    "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Reiciendis nisi tenetur atque blanditiis ad voluptatibus ipsam enim incidunt odio modi assumenda error officia dignissimos cum deserunt optio commodi distinctio quod veniam itaque, cumque delectus! Eveniet architecto officia provident aut minima dolores qui omnis fuga? Voluptatem alias dicta qui voluptatum sunt?";
  this.xAxisLabel = "Year";
  this.yAxisLabel = "Male births per 100 female births";

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

  /* Layout ---------------------------------------------------------------------------------*/
  const marginSize = 30;
  this.layout = {
    marginSize: marginSize,
    leftMargin: marginSize * 2,
    rightMargin: width - marginSize * 2,
    topMargin: marginSize,
    bottomMargin: height - marginSize * 2,
    pad: 5,

    plotWidth: function () {
      return this.rightMargin - this.leftMargin;
    },

    plotHeight: function () {
      return this.bottomMargin - this.topMargin;
    },

    grid: true,

    numXTickLabels: 6,
    numYTickLabels: 7,
  };

  /* Setup ----------------------------------------------------------------------------------*/
  let colors = [];
  this.setup = function () {
    textSize(14);
    colors = [
      color(0, 0, 0),
      color(227, 51, 126), //red
      color(240, 81, 41), //orange
      color(241, 199, 221), //pink
      color(130, 119, 117), //brown
      color(245, 189, 66), //yellow
      color(176, 153, 119), //khaki
      color(150, 110, 172), //purple
      color(123, 203, 192), //cyan
      color(11, 50, 107), //blue
      color(183, 204, 148), //green
    ];

    // Find start and end years.
    this.startYear = Number(this.data.columns[1]);
    this.endYear = Number(this.data.columns[this.data.columns.length - 1]);

    // Find min and max Ratio by putting all data (filtering country names out) in an one dimensional array.
    const allData = this.data.getArray().reduce((a, c) => a.concat(c));
    const filteredData = allData.filter((data) => data >= 0);
    this.minRatio = floor(min(filteredData));
    this.maxRatio = ceil(max(filteredData)) + 1;
  };

  /* Destroy --------------------------------------------------------------------------------*/
  this.destroy = function () {};

  /* Draw ----------------------------------------------------------------------------------*/
  this.draw = function () {
    if (!this.loaded) {
      console.log("Data not yet loaded");
      return;
    }

    strokeWeight(1);
    textSize(16);
    textAlign(CENTER);
    textStyle(NORMAL);

    // Draw x and y axis.
    drawAxis(this.layout, 0);

    // Draw x and y axis labels.
    drawAxisLabels(this.xAxisLabel, this.yAxisLabel, this.layout);

    // Draw all x-axis labels.
    textSize(14);
    const numYears = this.endYear - this.startYear;
    const yearGap = ceil(numYears / this.layout.numXTickLabels);
    const yearLabels = this.data.columns.filter(
      (year) => (year - this.startYear) % yearGap == 0 || year == this.endYear
    );
    yearLabels.forEach((yearLabel) =>
      drawXAxisTickLabel(yearLabel, this.layout, this.mapYearToWidth.bind(this))
    );

    // Draw all y-axis labels.
    drawYAxisTickLabels(
      this.minRatio,
      this.maxRatio,
      this.layout,
      this.mapRatioToHeight.bind(this),
      0
    );

    // Loop over all rows (countries). In each row (country) draw a line from the previous value to the current.
    this.data.rows.forEach((country, i) => {
      let previous = null;

      const years = this.data.columns.filter((value) => value != "");
      years.forEach((year, j) => {
        // Create an object to store data for the current year.
        let current = {
          year: year,
          Ratio: country.getNum(j + 1),
        };

        // Draw dots representing each data.
        strokeWeight(4);
        point(
          this.mapYearToWidth(current.year),
          this.mapRatioToHeight(current.Ratio)
        );

        // Draw line segment connecting previous year's data to current year's.
        if (previous != null) {
          stroke(colors[i]);
          strokeWeight(2);
          line(
            this.mapYearToWidth(previous.year),
            this.mapRatioToHeight(previous.Ratio),
            this.mapYearToWidth(current.year),
            this.mapRatioToHeight(current.Ratio)
          );
        }

        // Draw country names.
        let countryName = country.get(0);
        if (current.year == this.endYear) {
          noStroke();
          fill(colors[i]);
          textSize(18);
          textAlign(LEFT);
          textStyle(BOLD);
          text(
            countryName,
            this.mapYearToWidth(current.year) + 10,
            this.mapRatioToHeight(current.Ratio)
          );
        }

        previous = current;
      });
    });
  };

  /* Helper Functions -----------------------------------------------------------------------*/
  this.mapYearToWidth = function (value) {
    return map(
      value,
      this.startYear,
      this.endYear,
      this.layout.leftMargin, // Draw left-to-right from margin.
      this.layout.rightMargin - marginSize * 2
    );
  };

  this.mapRatioToHeight = function (value) {
    return map(
      value,
      this.minRatio,
      this.maxRatio,
      this.layout.bottomMargin, // Lower Ratio at bottom.
      this.layout.topMargin // Higher Ratio at top.
    );
  };
}
