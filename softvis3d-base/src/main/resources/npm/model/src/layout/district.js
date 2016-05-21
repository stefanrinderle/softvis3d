var SoftwareModel = require("./model/dummy.js");
var Illustrator   = require("./illustrator/district.js");
console.clear();

/* Step 1: Create the Model
 *  - Get Data from DataSource
 *  - Create a Model with the collected Data
 */
 var model = new SoftwareModel();

/* Step 2: Generate a CodeCity from Model
 * - Configure Illustrator Layout (Options)
 * - Decide on Metrics to use (Rules)
 * - Draw a specific Version of the City
 */
var options = {

    'district.options' : {
        'spacer.margin': 20,
        'spacer.padding': 10,
        // 'district.container': require("./illustrator/container/grid.js"),
        // 'houses.container': require("./illustrator/container/grid.js")
    }
};

var illustrator = new Illustrator(model, options);

illustrator.addRule(require('./illustrator/rules/loc-to-height.js')());
illustrator.addRule(require('./illustrator/rules/editor-to-width.js')());
illustrator.addRule(require('./illustrator/rules/package-to-color.js')());
illustrator.addRule(require('./illustrator/rules/save-first-version.js')());
illustrator.addRule(require('./illustrator/rules/opacity-if-not-in-version.js')());
illustrator.addRule(require('./illustrator/rules/lighten-platform-with-level.js')({
    lighten: 0x202020,
    maxsteps: 8
}));

var versionToDraw = model.versions[1];
var illustration = illustrator.draw(versionToDraw);


/* Step 3: Draw the Illustration
 * - Just do it
 */

document.body.style.margin = '0px';
require('./demo/legend.js')(document.body, model);

var renderer = new (require('./demo/threejs-scene.js'))(document.body);
renderer.renderIllustration(illustration);
