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
    numYTickLabels: 9,
  };
}
