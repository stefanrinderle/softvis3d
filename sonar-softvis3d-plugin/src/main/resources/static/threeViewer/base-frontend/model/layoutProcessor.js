/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2016 Stefan Rinderle
 * stefan@rinderle.info
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02
 */
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
