function SexRatioAtBirth() {
  /* Basic Information ----------------------------------------------------------------------*/
  this.name = "Global Sex Ratio at Birth";
  this.id = "sex-ratio-at-birth";
  this.title = "Sex Ratio At Birth in Top 10 Most Populated Countries";
  this.xAxisLabel = "year";
  this.yAxisLabel = "Male births per 100 female births";

  /* Load Data ------------------------------------------------------------------------------*/
  this.loaded = false;
  this.preload = function () {
    var self = this;
    this.data = loadTable(
      "./data/global-sex-ratio/global-sex-ratio-1962-2020.csv",
      "csv",
      "header",
      function (table) {
        self.loaded = true;
      }
    );
  };

  /* Layout ---------------------------------------------------------------------------------*/
  const marginSize = 30;
  this.layout = {
    marginSize: marginSize,
    leftMargin: marginSize * 2,
    rightMargin: width - marginSize,
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
  this.setup = function () {
    textSize(14);

    // Find start and end years.
    this.startYear = Number(this.data.columns[1]);
    this.endYear = Number(this.data.columns[this.data.columns.length - 1]);

    // Find min and max Ratio for mapping to canvas height.
    const allData = [];
    for (let i = 0; i < this.data.rows.length; i++) {
      for (let j = 1; j < this.data.columns.length; j++) {
        allData.push(this.data.getNum(i, j));
      }
    }
    this.minRatio = floor(min(allData));
    this.maxRatio = ceil(max(allData)) + 1;
  };

  /* Destroy --------------------------------------------------------------------------------*/
  this.destroy = function () {};

  /* Draw ----------------------------------------------------------------------------------*/
  this.draw = function () {
    if (!this.loaded) {
      console.log("Data not yet loaded");
      return;
    }

    // Draw x and y axis.
    drawAxis(this.layout);

    // Draw x and y axis labels.
    drawAxisLabels(this.xAxisLabel, this.yAxisLabel, this.layout);

    // Draw all x-axis labels.
    var numYears = this.endYear - this.startYear;
    var yearGap = ceil(numYears / this.layout.numXTickLabels);
    for (let i = 0; i < this.data.columns.length; i++) {
      for (let j = 0; j < this.data.columns.length; j++)
        if (
          this.data.columns[i] == this.startYear + yearGap * j ||
          this.data.columns[i] == this.endYear
        ) {
          drawXAxisTickLabel(
            Number(this.data.columns[i]),
            this.layout,
            this.mapYearToWidth.bind(this)
          );
        }
    }

    // Draw all y-axis labels.
    drawYAxisTickLabels(
      this.minRatio,
      this.maxRatio,
      this.layout,
      this.mapRatioToHeight.bind(this),
      0
    );

    // Loop over all rows. In each row draw a line from the previous value to the current.
    for (let i = 0; i < this.data.rows.length; i++) {
      var previous = null;
      var country = this.data.getRow(i);

      for (var j = 1; j < this.data.columns.length; j++) {
        // Create an object to store data for the current year.
        var current = {
          year: Number(this.data.columns[j]),
          Ratio: country.getNum(j),
        };

        // Draw line segment connecting previous year's data to current year's.
        if (previous != null) {
          stroke(0);
          line(
            this.mapYearToWidth(previous.year),
            this.mapRatioToHeight(previous.Ratio),
            this.mapYearToWidth(current.year),
            this.mapRatioToHeight(current.Ratio)
          );
        }

        // Draw dots representing each data.
        strokeWeight(3);
        point(
          this.mapYearToWidth(current.year),
          this.mapRatioToHeight(current.Ratio)
        );
        strokeWeight(1);

        previous = current;
      }
    }
  };

  /* Helper Functions -----------------------------------------------------------------------*/
  this.mapYearToWidth = function (value) {
    return map(
      value,
      this.startYear,
      this.endYear,
      this.layout.leftMargin, // Draw left-to-right from margin.
      this.layout.rightMargin
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
