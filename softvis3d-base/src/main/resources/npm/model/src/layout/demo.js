var SoftwareModel = require("./model/dummy.js");
var Illustrator   = require("./illustrator/evostreet.js");

console.clear();

 var model = new SoftwareModel();

document.body.style.margin = '0px';

require('./demo/legend.js')(document.body, model);
var DemoControlls = require('./demo/controlls.js');
var controlls = new DemoControlls(document.body, model.versions, render);

var Renderer = require('./demo/threejs-scene.js');
var renderer = new Renderer(document.body);

function render(options, rules, version) {
    var illustrator = new Illustrator(model, options);
    for (var r of rules) {
        illustrator.addRule(r);
    }
    var illustration = illustrator.draw(version);
    renderer.renderIllustration(illustration);
}

// Initial Render
window.setTimeout(function() {
    document.getElementById('draw').click();
}, 100);
