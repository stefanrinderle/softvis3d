module.exports = function (target, model) {
    var legend = document.createElement('div');
    legend.setAttribute('id', 'legend_div');
    legend.style['float'] = 'left';
    legend.style['margin'] = '0px';
    legend.style['border-right'] = '1px dashed #555';
    legend.style['border-bottom'] = '1px dashed #555';
    legend.style['padding'] = '5px 0';


    function intToRGB(i){
        var c = (i & 0x00FFFFFF)
            .toString(16)
            .toUpperCase();

        return "00000".substring(0, 6 - c.length) + c;
    }

    function addLegendInfo(legend, tree, depth = 0) {
        if (tree.children.length) {
            var tName = String(tree);
            var color = 0;
            for (var j = 0; j < tName.length; j++) {
               color = tName.charCodeAt(j) + ((color << 5) - color);
            }

            var colorbox = document.createElement('div');
            colorbox.style['float'] = 'left';
            colorbox.style['width'] = '10px';
            colorbox.style['height'] = '10px';
            colorbox.style['margin'] = '3px 5px 0 5px';
            colorbox.style['border'] = '1px solid rgba(0, 0, 0, .2)';
            colorbox.style['background-color'] = '#' + intToRGB(color);

            var entry = document.createElement('div');
            entry.style['padding'] = '1px';
            entry.style['margin-left'] = (2 + (depth * 12)) + 'px';
            entry.style['margin-right'] = '15px';
            if (depth >= 2) {
                entry.style['border-left'] = '1px solid #888';
            }
            entry.appendChild(colorbox);
            entry.appendChild(document.createTextNode(tName));
            legend.appendChild(entry);

            for (var i in tree.children) {
                addLegendInfo(legend, tree.children[i], depth + 1);
            }
        }
    }
    addLegendInfo(legend, model.tree);
    target.appendChild(legend);
}
