function GenderRatio() {
  /* Basic Information -------------------------------------------------------------------------*/
  this.name = "Gender Ratio in China (Dumbbell Plot)";
  this.id = "gender-ratio";
  this.title =
    "Those Left Behind: Gender Ratio in Urban, Town, and Rural China 2020";
  this.description =
    "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Reiciendis nisi tenetur atque blanditiis ad voluptatibus ipsam enim incidunt odio modi assumenda error officia dignissimos cum deserunt optio commodi distinctio quod veniam itaque, cumque delectus! Eveniet architecto officia provident aut minima dolores qui omnis fuga? Voluptatem alias dicta qui voluptatum sunt?";

  /* Load Data -------------------------------------------------------------------------------*/
  this.loaded = false;
  this.preload = function () {
    this.data = loadTable(
      "/data/china-gender-ratio/china-gender-ratio-2020.csv",
      "csv",
      "header",
      () => (this.loaded = true)
    );
  };

  /* Layout ----------------------------------------------------------------------------------*/
  const marginSize = 30;
  this.layout = {
    marginSize: marginSize,
    leftMargin: marginSize * 2,
    rightMargin: width - marginSize,
    topMargin: marginSize,
    bottomMargin: height - marginSize,
    pad: 5,

    plotWidth: function () {
      return this.rightMargin - this.leftMargin;
    },

    plotHeight: function () {
      return this.bottomMargin - this.topMargin;
    },

    grid: true,

    numXTickLabels: 10,
    numYTickLabels: 9,
  };

  /* Setup ----------------------------------------------------------------------------------*/
  this.setup = function () {
    if (!this.loaded) {
      console.log("Data not yet loaded");
      return;
    }

    // Create the DOM element container
    const inputContainer = createElement("div");
    inputContainer.id("input");
    inputContainer.parent("diagram-container");

    // Create some text.
    this.selectText1 = createElement(
      "h4",
      "Compare employee race diversity between"
    );
    this.selectText1.parent("input");

    // Create the select DOM element.
    this.select1 = createSelect();
    this.select1.parent("input");

    // Create some text.
    this.selectText2 = createElement("h4", "&");
    this.selectText2.parent("input");

    // Create the select DOM element.
    this.select2 = createSelect();
    this.select2.parent("input");

    // Fill the options with all company names.
    const companyNames = this.data.columns.filter((value) => value != "");
    companyNames.forEach((companyName) => {
      this.select1.option(companyName);
      this.select2.option(companyName);
    });
    this.select1.selected("Apple");
    this.select2.selected("Google");
  };

  /* Destroy ---------------------------------------------------------------------------------*/
  this.destroy = function () {
    this.select1.remove();
    this.select2.remove();
    this.selectText1.remove();
    this.selectText2.remove();
  };

  /* Draw ----------------------------------------------------------------------------------*/
  this.draw = function () {
    if (!this.loaded) {
      console.log("Data not yet loaded");
      return;
    }

    // Get the 2 companies we selected by their names.
    let company1 = this.select1.value();
    let company2 = this.select2.value();

    // Draw the first waffle chart.
    this.waffle1 = new Waffle(
      width * 0.05,
      50,
      width * 0.4,
      this.data,
      company1
    );
    this.waffle1.draw();
    this.waffle1.checkMouse(mouseX, mouseY);

    // Draw the second waffle chart.
    this.waffle2 = new Waffle(
      width * 0.55,
      50,
      width * 0.4,
      this.data,
      company2
    );
    this.waffle2.draw();
    this.waffle2.checkMouse(mouseX, mouseY);

    // some text
    fill(50);
    textAlign(CENTER);
    textSize(20);
    text(company1, width * 0.25, 80 + width * 0.4);
    text(company2, width * 0.75, 80 + width * 0.4);
    text("VS", width * 0.5, 50 + width * 0.2);
  };
}
