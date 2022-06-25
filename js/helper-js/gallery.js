class Gallery {
  constructor() {
    this.visuals = [];
    this.selectedVisual = null;
  }

  // Add a new visualization to the navigation bar.
  addVisual(vis) {
    // Check that the vis object has an id and name.
    if (!vis.hasOwnProperty("id") && !vis.hasOwnProperty("name"))
      throw new Error("Make sure your visualization has an id and name!");

    // Check that the vis object has a unique id.
    if (this.findVisIndex(vis.id) != null)
      throw new Error(`Vis '${vis.name}' has a duplicate id: '${vis.id}'`);

    // If there is no error, push the new visualization to the visuals array.
    this.visuals.push(vis);

    // Create menu item.
    const menuItem = createElement("li", vis.name);
    menuItem.addClass("menu-item");
    menuItem.id(vis.id);
    menuItem.parent(select("#visuals-menu"));

    // Menu item interactivity
    menuItem.mouseOver((e) => select("#" + e.srcElement.id).addClass("hover"));
    menuItem.mouseOut((e) =>
      select("#" + e.srcElement.id).removeClass("hover")
    );

    menuItem.mouseClicked((e) => {
      selectAll(".menu-item").forEach((menuItem) =>
        menuItem.removeClass("selected")
      );
      select("#" + e.srcElement.id).addClass("selected");
      this.selectVisual(e.srcElement.id);
    });

    // Create title and description.
    const title = createElement("h1", vis.title);
    title.id(vis.id);
    title.parent("title");

    const description = createP(vis.description);
    description.id(vis.id);
    description.parent("title");

    // Hide title and description by default.
    select("header").hide();

    // Preload data if necessary.
    if (vis.hasOwnProperty("preload")) vis.preload();
  }

  findVisIndex(visId) {
    // Search through the visualizations looking for one with the id matching visId.
    for (let i = 0; i < this.visuals.length; i++) {
      if (this.visuals[i].id == visId) return i;
    }

    // Visualization not found.
    return null;
  }

  selectVisual(visId) {
    const visIndex = this.findVisIndex(visId);

    if (visIndex != null) {
      // If the current visualization has a deselect method run it.
      if (
        this.selectedVisual != null &&
        this.selectedVisual.hasOwnProperty("destroy")
      )
        this.selectedVisual.destroy();

      // Select the visualization in the gallery.
      this.selectedVisual = this.visuals[visIndex];

      // Initialize visualization if necessary.
      if (this.selectedVisual.hasOwnProperty("setup"))
        this.selectedVisual.setup();

      if (this.selectedVisual.hasOwnProperty("windowResized"))
        this.selectedVisual.windowResized();

      // Only display the selected title and description.
      select("header").show();
      selectAll("h1", "header").forEach((a) => a.hide());
      selectAll("p", "header").forEach((a) => a.hide());
      selectAll("#" + this.selectedVisual.id, "header").forEach((a) =>
        a.show()
      );

      // Enable animation in case it has been paused by the current visualization.
      loop();
    }
  }
}
