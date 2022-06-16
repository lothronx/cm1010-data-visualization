function SexRatioAtBirth() {
  /* Basic Information ----------------------------------------------------------------------*/
  this.name = "Global Sex Ratio at Birth";
  this.id = "sex-ratio-at-birth";
  this.title = "Sex Ratio At Birth in Top 10 Most Populated Countries";
  this.description =
    "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Reiciendis nisi tenetur atque blanditiis ad voluptatibus ipsam enim incidunt odio modi assumenda error officia dignissimos cum deserunt optio commodi distinctio quod veniam itaque, cumque delectus! Eveniet architecto officia provident aut minima dolores qui omnis fuga? Voluptatem alias dicta qui voluptatum sunt?";
  this.xAxisLabel = "Year";
  this.yAxisLabel = "Male births per 100 female births";

  /* Load Data ------------------------------------------------------------------------------*/
  this.loaded = false;
  this.preload = function () {
    const self = this;
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
      color(227, 51, 126),
      color(240, 81, 41),
      color(241, 199, 221),
      color(130, 119, 117),
      color(245, 189, 66),
      color(176, 153, 119),
      color(150, 110, 172),
      color(123, 203, 192),
      color(11, 50, 107),
      color(183, 204, 148),
    ];
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
      let previous = null;

      let country = this.data.getRow(i);
      for (let j = 1; j < this.data.columns.length; j++) {
        // Create an object to store data for the current year.
        let current = {
          year: Number(this.data.columns[j]),
          Ratio: country.getNum(j),
        };

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

        // Draw dots representing each data.
        strokeWeight(4);
        point(
          this.mapYearToWidth(current.year),
          this.mapRatioToHeight(current.Ratio)
        );

        // Draw country names.
        let name = country.getString(0);
        if (current.year == this.endYear) {
          noStroke();
          fill(colors[i]);
          textSize(18);
          textAlign(LEFT);
          textStyle(BOLD);
          text(
            name,
            this.mapYearToWidth(current.year) + 10,
            this.mapRatioToHeight(current.Ratio)
          );
        }

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
      this.layout.rightMargin - marginSize * 4
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
