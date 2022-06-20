function PayGapByBouncyBubbles() {
  /* Basic Information -------------------------------------------------------------------------*/
  this.name = "Pay Gap by Job: 2017 (Bouncy Bubbles)";
  this.id = "pay-gap-bouncy-bubbles";
  this.title = "Occupation Hourly Pay by Gender 2017";

  /* Layout ----------------------------------------------------------------------------------*/
  this.margin = 40;
  this.ballSizeMin = width * 0.04;
  this.ballSizeMax = width * 0.12;

  /* Load Data -------------------------------------------------------------------------------*/
  this.loaded = false;
  this.preload = function () {
    this.data = loadTable(
      "/data/pay-gap/occupation-hourly-pay-by-gender-2017.csv",
      "csv",
      "header",
      () => (this.loaded = true)
    );
  };

  /* Setup ----------------------------------------------------------------------------------*/
  let balls = [];
  this.setup = function () {
    // Map data to parameters of circles.
    this.mapDatatoShape();

    // Balls is an array of objects. Each object is a circle which represents an occupation.
    this.jobType.forEach((jobType, i) =>
      balls.push(
        new Ball(
          this.xCoordinates[i],
          this.yCoordinates[i],
          this.sizes[i],
          jobType,
          this.colors[i],
          i,
          balls
        )
      )
    );
  };

  /* Destroy ----------------------------------------------------------------------------------*/
  this.destroy = function () {};

  /* Draw ----------------------------------------------------------------------------------*/
  this.draw = function () {
    if (!this.loaded) {
      console.log("Data not yet loaded");
      return;
    }

    // Draw the axes.
    this.drawAxes();

    // Draw the balls.
    balls.forEach((ball) => {
      ball.display();
      ball.click();
    });
  };

  /* Helper Functions -----------------------------------------------------------------------*/
  this.drawAxes = function () {
    stroke(150);
    fill(150);
    // Add vertical axis.
    line(width / 2, this.margin, width / 2, height - this.margin);
    triangle(
      width / 2,
      this.margin,
      width / 2 - 5,
      this.margin + 10,
      width / 2 + 5,
      this.margin + 10
    );
    // Add horizontal axis.
    line(this.margin, height / 2, width - this.margin, height / 2);
    triangle(
      width - this.margin,
      height / 2,
      width - this.margin - 10,
      height / 2 - 5,
      width - this.margin - 10,
      height / 2 + 5
    );
    // Add some text.
    noStroke();
    fill(150);
    textSize(18);
    textStyle(BOLD);
    textAlign(CENTER);
    text("Pay Gap", width / 2, this.margin * 0.8);
    text("% of Female", width - this.margin * 1.5, height / 2 + 20);
  };

  this.mapDatatoShape = function () {
    // Get data from the table object.
    this.jobType = this.data.getColumn("job_subtype");
    const percent = this.data.getColumn("proportion_female");
    const payGap = this.data.getColumn("pay_gap");
    const numJobs = this.data.getColumn("num_jobs");

    // Set ranges for axes.
    // X axis: percentage of women. The minimum proportion of women is 0%. The maximum proportion of women is 100%. The higher the proportion, the more to the right.
    const percentMin = 0;
    const percentMax = 100;
    this.xCoordinates = [];
    percent.forEach((value) =>
      this.xCoordinates.push(
        map(value, percentMin, percentMax, this.margin, width - this.margin)
      )
    );

    // Y axis: pay gap. The larger the pay gap, the higher.
    const payGapMin = -20;
    const payGapMax = 20;
    this.yCoordinates = [];
    payGap.forEach((value) =>
      this.yCoordinates.push(
        map(value, payGapMin, payGapMax, height - this.margin, this.margin)
      )
    );

    // The larger the pay gap, also the redder.
    this.colors = [];
    payGap.forEach((value) => {
      this.colors.push(
        value > 16
          ? "#581845CC"
          : value > 12
          ? "#900C3FCC"
          : value > 8
          ? "#C70039CC"
          : value > 4
          ? "#FF5733CC"
          : value > 0
          ? "#FFC300CC"
          : "#2A9D8FCC"
      );
    });

    // Size of the ball: number of jobs. More job, larger ball.
    const numJobsMin = min(numJobs);
    const numJobsMax = max(numJobs);
    this.sizes = [];
    numJobs.forEach((value) =>
      this.sizes.push(
        map(value, numJobsMin, numJobsMax, this.ballSizeMin, this.ballSizeMax)
      )
    );
  };
}
