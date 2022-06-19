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
      "./data/pay-gap/occupation-hourly-pay-by-gender-2017.csv",
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
class Ball {
  constructor(xin, yin, din, idin, oin) {
    this.x = xin;
    this.y = yin;
    this.vx = 0;
    this.vy = 0;
    this.diameter = din;
    this.id = idin;
    this.others = oin;
    this.spring = 0.05;
    this.gravity = 0.03;
    this.friction = -0.9;
    this.numBalls = 13;
  }

  collide() {
    for (let i = this.id + 1; i < this.numBalls; i++) {
      // console.log(others[i]);
      let dx = this.others[i].x - this.x;
      let dy = this.others[i].y - this.y;
      let distance = sqrt(dx * dx + dy * dy);
      let minDist = this.others[i].diameter / 2 + this.diameter / 2;
      //   console.log(distance);
      //console.log(minDist);
      if (distance < minDist) {
        //console.log("2");
        let angle = atan2(dy, dx);
        let targetX = this.x + cos(angle) * minDist;
        let targetY = this.y + sin(angle) * minDist;
        let ax = (targetX - this.others[i].x) * this.spring;
        let ay = (targetY - this.others[i].y) * this.spring;
        this.vx -= ax;
        this.vy -= ay;
        this.others[i].vx += ax;
        this.others[i].vy += ay;
      }
    }
  }

  move() {
    this.vy += this.gravity;
    this.x += this.vx;
    this.y += this.vy;
    if (this.x + this.diameter / 2 > width) {
      this.x = width - this.diameter / 2;
      this.vx *= this.friction;
    } else if (this.x - this.diameter / 2 < 0) {
      this.x = this.diameter / 2;
      this.vx *= this.friction;
    }
    if (this.y + this.diameter / 2 > height) {
      this.y = height - this.diameter / 2;
      this.vy *= this.friction;
    } else if (this.y - this.diameter / 2 < 0) {
      this.y = this.diameter / 2;
      this.vy *= this.friction;
    }
  }

  display() {
    ellipse(this.x, this.y, this.diameter, this.diameter);
  }
}
