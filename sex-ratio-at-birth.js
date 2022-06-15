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
  var marginSize = 30;
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
    numYTickLabels: 8,
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

    // Set min and max years: assumes data is sorted by date.
    this.startYear = Number(this.data.columns[1]);
    this.endYear = Number(this.data.columns[this.data.columns.length - 1]);

    // Find min and max percentage for mapping to canvas height.
    this.minPercentage = 100;
    this.maxPercentage = 120;
  };

  /* Destroy ----------------------------------------------------------------------------------*/
  this.destroy = function () {};

  /* Draw ----------------------------------------------------------------------------------*/
  this.draw = function () {
    if (!this.loaded) {
      console.log("Data not yet loaded");
      return;
    }

    // Draw all y-axis labels.
    drawYAxisTickLabels(
      this.minPercentage,
      this.maxPercentage,
      this.layout,
      this.mapPercentageToHeight.bind(this),
      0
    );

    // Draw x and y axis.
    drawAxis(this.layout);

    // Draw x and y axis labels.
    drawAxisLabels(this.xAxisLabel, this.yAxisLabel, this.layout);

    // Plot all percentages between startYear and endYear using the width of the canvas minus margins.
    var previous;
    var numYears = this.endYear - this.startYear;

    // Loop over all rows and draw a line from the previous value to
    // the current.
    for (var i = 0; i < this.data.getRowCount(); i++) {
      // Create an object to store data for the current year.
      var current = {
        // Convert strings to numbers.
        year: this.data.getNum(i, "year"),
        Percentage: this.data.getNum(i, "pay_gap"),
      };

      if (previous != null) {
        // Draw line segment connecting previous year to current
        // year percentage.
        stroke(0);
        line(
          this.mapYearToWidth(previous.year),
          this.mapPercentageToHeight(previous.Percentage),
          this.mapYearToWidth(current.year),
          this.mapPercentageToHeight(current.Percentage)
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

  this.mapYearToWidth = function (value) {
    return map(
      value,
      this.startYear,
      this.endYear,
      this.layout.leftMargin, // Draw left-to-right from margin.
      this.layout.rightMargin
    );
  };

  this.mapPercentageToHeight = function (value) {
    return map(
      value,
      this.minPercentage,
      this.maxPercentage,
      this.layout.bottomMargin, // Lower percentage at bottom.
      this.layout.topMargin // Higher percentage at top.
    );
  };
}
