function PayGapByBouncyBubbles() {
  /* Basic Information -------------------------------------------------------------------------*/
  this.name = "Pay Gap by Job: 2017 (Bouncy Bubbles)";
  this.id = "pay-gap-bouncy-bubbles";
  this.title = "Occupation Hourly Pay by Gender 2017";

  /* Layout ----------------------------------------------------------------------------------*/
  this.margin = 20;
  this.dotSizeMin = 15;
  this.dotSizeMax = 50;

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
    // Get data from the table object.
    var jobType = this.data.getColumn("job_subtype");
    var propFemale = this.data.getColumn("proportion_female");
    var payGap = this.data.getColumn("pay_gap");
    var numJobs = this.data.getColumn("num_jobs");

    // Convert numerical data from strings to numbers.
    propFemale = stringsToNumbers(propFemale);
    payGap = stringsToNumbers(payGap);
    numJobs = stringsToNumbers(numJobs);

    // Set ranges for axes.
    // Use full 100% for x-axis (proportion of women in roles).
    var propFemaleMin = 0;
    var propFemaleMax = 100;

    // For y-axis (pay gap) use a symmetrical axis equal to the
    // largest gap direction so that equal pay (0% pay gap) is in the
    // centre of the canvas. Above the line means men are paid
    // more. Below the line means women are paid more.
    var payGapMin = -20;
    var payGapMax = 20;

    // Find smallest and largest numbers of people across all
    // categories to scale the size of the dots.
    var numJobsMin = min(numJobs);
    var numJobsMax = max(numJobs);

    fill(255);
    stroke(0);
    strokeWeight(1);

    for (i = 0; i < this.data.getRowCount(); i++) {
      // Draw an ellipse for each point.
      // x = propFemale
      // y = payGap
      // size = numJobs
      ellipse(
        map(
          propFemale[i],
          propFemaleMin,
          propFemaleMax,
          this.margin,
          width - this.margin
        ),
        map(payGap[i], payGapMin, payGapMax, height - this.margin, this.margin),
        map(
          numJobs[i],
          numJobsMin,
          numJobsMax,
          this.dotSizeMin,
          this.dotSizeMax
        )
      );
    }

    for (let i = 0; i < numBalls; i++) {
      balls[i] = new Ball(
        random(width),
        random(height),
        random(30, 200),
        i,
        balls
      );
    }
    noStroke();
    fill(255, 204);
  };

  /* Destroy ----------------------------------------------------------------------------------*/
  this.destroy = function () {};

  /* Draw ----------------------------------------------------------------------------------*/
  this.draw = function () {
    if (!this.loaded) {
      console.log("Data not yet loaded");
      return;
    }

    balls.forEach((ball) => {
      ball.collide();
      ball.move();
      ball.display();
    });
  };
}
