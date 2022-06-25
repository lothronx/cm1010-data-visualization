// This extension is a redesign of the ""Pay Gap by Job: 2017"" data visualization template.

function PayGapByBouncyBubbles() {
  /* Basic Information -------------------------------------------------------------------------*/
  this.name = "Pay Gap by Job (Bouncy Bubbles)";
  this.id = "pay-gap-bouncy-bubbles";
  this.title = "Gender Pay Gap by Occupations, UK";
  this.description =
    "*Tips: Click the canvas to make balls moving around. Click the canvas again to stop. Hover over each ball to see its detailed information.";

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
    if (!this.loaded) throw new Error("Data not yet loaded");

    // Map data to parameters of circles. Check the help function for more details.
    this.mapDataToShape();

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

  /* Draw ----------------------------------------------------------------------------------*/
  this.draw = function () {
    resizeCanvas(windowWidth * 0.7, windowHeight * 0.7);
    noStroke();
    noFill();
    textSize(16);
    textAlign(NORMAL);
    textStyle(NORMAL);
    balls.forEach((ball) => {
      ball.display(); //Draw the balls
      ball.hover(mouseX, mouseY); // Hover over each ball to see detailed information.
      if (clickSwitch) ball.move(); // Click the canvas to make balls move around. Click the canvas again to stop.
    });
  };

  /* Click the mouse to switch between move and stop--------------------------------------------*/
  let clickSwitch = false;
  this.mouseClicked = function (mouseX, mouseY) {
    if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height)
      clickSwitch ? (clickSwitch = false) : (clickSwitch = true);
  };

  /* Resize Canvas ----------------------------------------------------------------------------*/
  this.windowResized = function () {
    resizeCanvas(windowWidth * 0.7, windowHeight * 0.7);
  };

  /* Helper Functions -----------------------------------------------------------------------*/
  this.mapDataToShape = function () {
    this.jobType = this.data.getColumn("job_subtype");

    // Set ranges for coordinates.
    const margin = 30;

    // X coordinate: percentage of women. The minimum proportion of women is 0%. The maximum proportion of women is 100%. The higher the proportion, the more to the right.
    this.percent = this.data.getColumn("proportion_female");
    const percentMin = 0;
    const percentMax = 100;
    this.xCoordinates = [];
    this.percent.forEach((value) =>
      this.xCoordinates.push(
        map(value, percentMin, percentMax, margin, width - margin)
      )
    );

    // Y coordinate: pay gap. The larger the pay gap, the higher.
    this.payGap = this.data.getColumn("pay_gap");
    const payGapMin = -20;
    const payGapMax = 20;
    this.yCoordinates = [];
    this.payGap.forEach((value) =>
      this.yCoordinates.push(
        map(value, payGapMin, payGapMax, height - margin, margin)
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
    const ballSizeMin = min(width * 0.04, height * 0.06);
    const ballSizeMax = min(width * 0.12, height * 0.18);
    this.sizes = [];
    this.numJobs.forEach((value) =>
      this.sizes.push(
        map(value, numJobsMin, numJobsMax, ballSizeMin, ballSizeMax)
      )
    );
  };
}
