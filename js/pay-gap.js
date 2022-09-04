// This extension is a redesign of the ""Pay Gap by Job: 2017"" data visualization template.

function PayGap() {
  /* Basic Information -------------------------------------------------------------------------*/
  this.name = "Pay Gap by Job (Bubble Chart)";
  this.id = "pay-gap";
  this.title = "Gender Pay Gap by Occupations, UK";
  this.description =
    "*Tips: Click the canvas to make bubbles moving around. Click the canvas again to stop. Hover over each bubble to see its detailed information.";

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
  let bubbles = [];

  this.setup = function () {
    // create canvas
    const canvas = createCanvas(windowWidth * 0.7, windowHeight * 0.7).parent("app");

    if (!this.loaded) throw new Error("Data not yet loaded");

    // Map data to parameters of circles. Check the help function for more details.
    this.mapDataToShape();

    // bubbles is an array of objects. Each object is a circle which represents an occupation.
    bubbles = [];
    this.jobType.forEach((jobType, i) =>
      bubbles.push(
        new Bubble(
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
          bubbles
        )
      )
    );

    // Add some notes
    this.addDOMElements();

    // Click to switch between move and stop
    this.clickSwitch = false;
    canvas.mouseClicked(() => {
      this.clickSwitch = !this.clickSwitch;
    });
  };

  /* Destroy ---------------------------------------------------------------------------------*/
  this.destroy = function () {
    this.inputContainer.remove();
  };

  /* Draw ----------------------------------------------------------------------------------*/
  this.draw = function () {
    noStroke();
    noFill();
    textSize(16);
    textAlign(NORMAL);
    textStyle(NORMAL);

    let hovered = false;

    bubbles.forEach((bubble) => {
      bubble.display(); //Draw the bubbles
      bubble.hover(); // Hover over each bubble to see notes.
      if (this.clickSwitch) bubble.move(); // Click the canvas to make bubbles move around. Click the canvas again to stop.
      if (bubble.hovered) hovered = true;
    });

    if (!hovered) select("h4").html(""); // if no bubble is hovered, do not display any note.
  };

  /* Map data to parameters of circles -----------------------------------------------------------------------*/
  this.mapDataToShape = function () {
    this.jobType = this.data.getColumn("job_subtype");

    // Set ranges for coordinates.
    const margin = 30;

    // X coordinate: percentage of women. The minimum proportion of women is 0%. The maximum proportion of women is 100%. The higher the proportion, the more to the right.
    this.percent = this.data.getColumn("proportion_female");
    const percentMin = 0;
    const percentMax = 100;
    this.xCoordinates = [];
    this.percent.forEach((value) => this.xCoordinates.push(map(value, percentMin, percentMax, margin, width - margin)));

    // Y coordinate: pay gap. The larger the pay gap, the higher.
    this.payGap = this.data.getColumn("pay_gap");
    const payGapMin = -20;
    const payGapMax = 20;
    this.yCoordinates = [];
    this.payGap.forEach((value) =>
      this.yCoordinates.push(map(value, payGapMin, payGapMax, windowHeight * 0.7 - margin, margin))
    );

    // The larger the pay gap, also the redder.
    this.colors = [];
    this.payGap.forEach((value) => {
      this.colors.push(
        value > 16
          ? "#581845be"
          : value > 12
          ? "#900C3Fbe"
          : value > 8
          ? "#C70039be"
          : value > 4
          ? "#FF5733be"
          : value > 0
          ? "#FFC300be"
          : "#2A9D8Fbe"
      );
    });

    // Size of the bubble: number of jobs. More job, larger bubble.
    this.numJobs = this.data.getColumn("num_jobs");
    const numJobsMin = min(this.numJobs);
    const numJobsMax = max(this.numJobs);
    const bubbleSizeMin = min(width * 0.04, windowHeight * 0.7 * 0.06);
    const bubbleSizeMax = min(width * 0.12, windowHeight * 0.7 * 0.18);
    this.sizes = [];
    this.numJobs.forEach((value) => this.sizes.push(map(value, numJobsMin, numJobsMax, bubbleSizeMin, bubbleSizeMax)));
  };

  /* Add notes ------------------------------------------------------------------------*/
  this.addDOMElements = function () {
    // Create the DOM element container
    this.inputContainer = createDiv();
    this.inputContainer.id("input");
    this.inputContainer.parent("app");
    this.inputContainer.style("min-height", "4rem");

    // Create some text, content defined later in draw()
    createElement("h4", "").parent("input");
    select("h4").style("padding", "0 3rem");
  };
}
