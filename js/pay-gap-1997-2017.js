function PayGapTimeSeries() {
  /* Basic Information -------------------------------------------------------------------------*/
  this.name = "Pay Gap: 1997-2017";
  this.id = "pay-gap-timeseries";
  this.title = "Gender Pay Gap: Average difference between male and female pay";
  this.xAxisLabel = "year";
  this.yAxisLabel = "%";

  /* Layout ----------------------------------------------------------------------------------*/
  var marginSize = 35;

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
      "/data/pay-gap/all-employees-hourly-pay-by-gender-1997-2017.csv",
      "csv",
      "header",
      function (table) {
        self.loaded = true;
      }
    );
  };

  /* Setup ----------------------------------------------------------------------------------*/
  this.setup = function () {
    // Font defaults.
    textSize(16);

    // Set min and max years: assumes data is sorted by date.
    this.startYear = this.data.getNum(0, "year");
    this.endYear = this.data.getNum(this.data.getRowCount() - 1, "year");

    // Find min and max pay gap for mapping to canvas height.
    this.minPayGap = 0; // Pay equality (zero pay gap).
    this.maxPayGap = max(this.data.getColumn("pay_gap"));
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
      this.minPayGap,
      this.maxPayGap,
      this.layout,
      this.mapPayGapToHeight.bind(this),
      0
    );

    // Draw x and y axis.
    drawAxis(this.layout);

    // Draw x and y axis labels.
    drawAxisLabels(this.xAxisLabel, this.yAxisLabel, this.layout);

    // Plot all pay gaps between startYear and endYear using the width
    // of the canvas minus margins.
    var previous;
    var numYears = this.endYear - this.startYear;

    // Loop over all rows and draw a line from the previous value to
    // the current.
    for (var i = 0; i < this.data.getRowCount(); i++) {
      // Create an object to store data for the current year.
      var current = {
        // Convert strings to numbers.
        year: this.data.getNum(i, "year"),
        payGap: this.data.getNum(i, "pay_gap"),
      };

      if (previous != null) {
        // Draw line segment connecting previous year to current
        // year pay gap.
        stroke(0);
        line(
          this.mapYearToWidth(previous.year),
          this.mapPayGapToHeight(previous.payGap),
          this.mapYearToWidth(current.year),
          this.mapPayGapToHeight(current.payGap)
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

      // Assign current year to previous year so that it is available
      // during the next iteration of this loop to give us the start
      // position of the next line segment.
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

  this.mapPayGapToHeight = function (value) {
    return map(
      value,
      this.minPayGap,
      this.maxPayGap,
      this.layout.bottomMargin, // Smaller pay gap at bottom.
      this.layout.topMargin
    ); // Bigger pay gap at top.
  };
}
