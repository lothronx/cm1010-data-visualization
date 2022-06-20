function PayGapByBouncyBubbles() {
  /* Basic Information -------------------------------------------------------------------------*/
  this.name = "Pay Gap by Job (Bouncy Bubbles)";
  this.id = "pay-gap-bouncy-bubbles";
  this.title = "Gender Pay Gap by Occupations, UK";

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
    // Map data to parameters of circles. Check the help function for more details.
    this.mapDatatoShape();

    // Balls is an array of objects. Each object is a circle which represents an occupation.
    balls = [];
    this.jobType.forEach((jobType, i) =>
      balls.push(
        new Ball(
          this.xCoordinates[i],
          this.yCoordinates[i],
          this.sizes[i],
          this.colors[i],
          {
            name: jobType,
            num: this.numJobs[i],
            payGap: this.payGap[i],
            ratio: this.percent[i],
          },
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

    // Draw the balls.
    balls.forEach((ball) => {
      ball.display(); //draw the balls
      ball.mouseOut(mouseX, mouseY); //If the mouse is not on canvas, the balls will move around.
      ball.mouseOver(mouseX, mouseY); // hover on each ball to see detailed information.
    });
  };

  /* Helper Functions -----------------------------------------------------------------------*/
  this.mapDatatoShape = function () {
    this.jobType = this.data.getColumn("job_subtype");

    // Set ranges for axes.
    // X axis: percentage of women. The minimum proportion of women is 0%. The maximum proportion of women is 100%. The higher the proportion, the more to the right.
    this.percent = this.data.getColumn("proportion_female");
    const percentMin = 0;
    const percentMax = 100;
    this.xCoordinates = [];
    this.percent.forEach((value) =>
      this.xCoordinates.push(
        map(value, percentMin, percentMax, this.margin, width - this.margin)
      )
    );

    // Y axis: pay gap. The larger the pay gap, the higher.
    this.payGap = this.data.getColumn("pay_gap");
    const payGapMin = -20;
    const payGapMax = 20;
    this.yCoordinates = [];
    this.payGap.forEach((value) =>
      this.yCoordinates.push(
        map(value, payGapMin, payGapMax, height - this.margin, this.margin)
      )
    );

    // The larger the pay gap, also the redder.
    this.colors = [];
    this.payGap.forEach((value) => {
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
    this.numJobs = this.data.getColumn("num_jobs");
    const numJobsMin = min(this.numJobs);
    const numJobsMax = max(this.numJobs);
    this.sizes = [];
    this.numJobs.forEach((value) =>
      this.sizes.push(
        map(value, numJobsMin, numJobsMax, this.ballSizeMin, this.ballSizeMax)
      )
    );
  };
}
