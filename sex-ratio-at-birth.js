function SexRatioAtBirth() {
  /* Basic Information -------------------------------------------------------------------------*/
  this.name = "Global Sex Ratio at Birth";
  this.id = "sex-ratio-at-birth";
  this.title = "Sex Ratio At Birth in Top 10 Most Populated Countries";
  this.description =
    "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Reiciendis nisi tenetur atque blanditiis ad voluptatibus ipsam enim incidunt odio modi assumenda error officia dignissimos cum deserunt optio commodi distinctio quod veniam itaque, cumque delectus! Eveniet architecto officia provident aut minima dolores qui omnis fuga? Voluptatem alias dicta qui voluptatum sunt?";
  this.xAxisLabel = "year";
  this.yAxisLabel = "Male births per 100 female births";

  /* Layout ----------------------------------------------------------------------------------*/
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

    numXTickLabels: 10,
    numYTickLabels: 9,
  };

  /* Load Data -------------------------------------------------------------------------------*/
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

  /* Setup ----------------------------------------------------------------------------------*/
  this.setup = function () {
    textSize(14);

    // Find start and end years.
    this.startYear = Number(this.data.columns[1]);
    this.endYear = Number(this.data.columns[this.data.columns.length - 1]);

    // Find min and max Ratio for mapping to canvas height.
    this.minRatio = 100; //the minimum sex ratio at birth is 100 male per 100 female.

    const allData = [];
    for (let i = 0; i < this.data.rows.length; i++) {
      for (let j = 1; j < this.data.columns.length; j++) {
        allData.push(this.data.getNum(i, j));
      }
    }
    this.maxRatio = ceil(max(allData)) + 1;
  };

  /* Destroy ----------------------------------------------------------------------------------*/
  this.destroy = function () {};

  /* Draw ------------------------------------------------------------------------------------*/
  this.draw = function () {
    if (!this.loaded) {
      console.log("Data not yet loaded");
      return;
    }

    // Draw x and y axis.
    drawAxis(this.layout);

    // Draw x and y axis labels.
    drawAxisLabels(this.xAxisLabel, this.yAxisLabel, this.layout);

    // Draw all y-axis labels.
    drawYAxisTickLabels(
      this.minRatio,
      this.maxRatio,
      this.layout,
      this.mapRatioToHeight.bind(this),
      0
    );

    // Plot all Ratios between startYear and endYear using the width of the canvas minus margins.
    var previous;
    var numYears = this.endYear - this.startYear;

    // Loop over all rows and draw a line from the previous value to the current.
    for (let i = 0; i < this.data.rows.length; i++) {
      for (var j = 1; j < this.data.columns.length; j++) {
        // Create an object to store data for the current year.
        var current = {
          // Convert strings to numbers.
          year: this.data.getNum(j, "year"),
          Ratio: this.data.getNum(j, "pay_gap"),
        };
      }

      if (previous != null) {
        // Draw line segment connecting previous year to current
        // year Ratio.
        stroke(0);
        line(
          this.mapYearToWidth(previous.year),
          this.mapRatioToHeight(previous.Ratio),
          this.mapYearToWidth(current.year),
          this.mapRatioToHeight(current.Ratio)
        );

        // The number of x-axis labels to skip so that only
        // numXTickLabels are drawn.
        var xLabelSkip = ceil(numYears / this.layout.numXTickLabels);

        // Draw the tick label marking the start of the previous year.
        if (i % xLabelSkip == 0) {
          drawXAxisTickLabel(
            previous.year,
            this.layout,
            this.mapYearToWidth.bind(this)
          );
        }
      }

      previous = current;
    }
  };

  /* Helper Functions -------------------------------------------------------------------------*/
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
