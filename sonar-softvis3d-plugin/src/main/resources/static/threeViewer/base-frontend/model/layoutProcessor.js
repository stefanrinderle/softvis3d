var CodeCityVis = require('codecity-visualizer');

var Illustrator = CodeCityVis.illustrators.evostreet;

class LayoutProcessor {

    constructor() {
    }

    getIllustration(model, version) {
      /* Step 2: Generate a CodeCity from Model
       * - Configure Illustrator Layout (Options)
       * - Decide on Metrics to use (Rules)
       * - Draw a specific Version of the City
       */
      var options = {
        'highway.color': 0x186f9a,
        'street.color': 0x156289,
        'house.margin': 4,
        'evostreet.options': {
          'spacer.initial': 20,
          'spacer.conclusive': 0,
          'spacer.branches': 20,
          'house.container': CodeCityVis.containers.lightmap,
          'house.distribution': 'left'
        }
      };

      var illustrator = new Illustrator(model, options);
      
      illustrator.addRule(CodeCityVis.rules['editor-to-width']());
      illustrator.addRule(CodeCityVis.rules['lighten-platform-with-level']());
      illustrator.addRule(CodeCityVis.rules['loc-to-height']({'logsbase': 2.4}));
      illustrator.addRule(CodeCityVis.rules['opacity-if-not-in-version']());
      illustrator.addRule(CodeCityVis.rules['package-to-color']());
      illustrator.addRule(CodeCityVis.rules['save-first-version']());

      return illustrator.draw(version);
    }

}

module.exports = LayoutProcessor;
