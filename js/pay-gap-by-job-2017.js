function PayGapByJob2017() {
  /* Basic Information -------------------------------------------------------------------------*/
  this.name = "Pay Gap by Job: 2017";
  this.id = "pay-gap-by-job-2017";
  this.title = "Occupation Hourly Pay by Gender 2017";
  
  /* Layout ----------------------------------------------------------------------------------*/
  this.pad = 20;
  this.dotSizeMin = 15;
  this.dotSizeMax = 40;

  /* Load Data -------------------------------------------------------------------------------*/
  this.loaded = false;
  this.preload = function () {
    var self = this;
    this.data = loadTable(
      "/data/pay-gap/occupation-hourly-pay-by-gender-2017.csv",
      "csv",
      "header",
      function (table) {
        self.loaded = true;
      }
    );
  };

  /* Setup ----------------------------------------------------------------------------------*/
  this.setup = function () {};

  /* Destroy ----------------------------------------------------------------------------------*/
  this.destroy = function () {};

  /* Draw ----------------------------------------------------------------------------------*/
  this.draw = function () {
    if (!this.loaded) {
      console.log("Data not yet loaded");
      return;
    }

    // Draw the axes.
    this.addAxes();

    // Get data from the table object.
    var jobs = this.data.getColumn("job_subtype");
    var propFemale = this.data.getColumn("proportion_female");
    var payGap = this.data.getColumn("pay_gap");
    var numJobs = this.data.getColumn("num_jobs");

    // Convert numerical data from strings to numbers.
    propFemale = stringsToNumbers(propFemale);
    payGap = stringsToNumbers(payGap);
    numJobs = stringsToNumbers(numJobs);

    // Set ranges for axes.
    //
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
          this.pad,
          width - this.pad
        ),
        map(payGap[i], payGapMin, payGapMax, height - this.pad, this.pad),
        map(
          numJobs[i],
          numJobsMin,
          numJobsMax,
          this.dotSizeMin,
          this.dotSizeMax
        )
      );
    }
  };

  this.addAxes = function () {
    stroke(200);

    // Add vertical line.
    line(width / 2, 0 + this.pad, width / 2, height - this.pad);

    // Add horizontal line.
    line(0 + this.pad, height / 2, width - this.pad, height / 2);
  };
}
