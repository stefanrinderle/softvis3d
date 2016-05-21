var Illustrator = require("./layout/illustrator/evostreet.js");

class LayoutProcessor {

    constructor() {
    };

    getIllustration(model, version) {
      /* Step 2: Generate a CodeCity from Model
       * - Configure Illustrator Layout (Options)
       * - Decide on Metrics to use (Rules)
       * - Draw a specific Version of the City
       */
      var options = {
        'highway.color': 0x186f9a,
        'street.color': 0x156289,
        'house.margin': 2,
        'evostreet.options': {
          'spacer.initial': 20,
          'spacer.conclusive': 0,
          'spacer.branches': 20,
          'house.container': require("./layout/illustrator/container/lightmap.js"),
          'house.distribution': 'left',
          'house.segmentation': 'versions.first'
        }
      };

      var illustrator = new Illustrator(model, options);

      illustrator.addRule(require('./layout/illustrator/rules/loc-to-height.js')());
      illustrator.addRule(require('./layout/illustrator/rules/editor-to-width.js')());
      illustrator.addRule(require('./layout/illustrator/rules/package-to-color.js')());
      illustrator.addRule(require('./layout/illustrator/rules/save-first-version.js')());
      illustrator.addRule(require('./layout/illustrator/rules/opacity-if-not-in-version.js')());

      return illustrator.draw(version);
    }

}

module.exports = LayoutProcessor;
