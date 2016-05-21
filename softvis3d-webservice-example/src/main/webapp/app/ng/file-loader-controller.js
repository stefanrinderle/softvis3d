/*
 * softvis3d-webservice-example
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
var Detector = require('../lib/Detector.js');

var Illustrator = require("../layout/illustrator/evostreet.js");
var Softvis3dModel = require("./softvis3dModel");

/**
 * Service which initiates the THREE.js scene and
 *  provides methods to interact with that scene
 *
 * @param {angular.$scope} $scope
 * @param {ThreeViewer.MessageBus} MessageBus
 * @param {ThreeViewer.ViewerService} ViewerService
 * @param {ThreeViewer.BackendService} BackendService
 *
 * @constructor
 * @export
 * @ngInject
 */
ThreeViewer.FileLoaderController = function ($scope, MessageBus, ViewerService, BackendService, TreeService) {
  this.scope = $scope;
  this.MessageBus = MessageBus;
  this.ViewerService = ViewerService;
  this.BackendService = BackendService;
  this.TreeService = TreeService;

  /**
   * @type {{city: boolean, dependency: boolean, custom: boolean, info: boolean}}
   */
  this.state = {
    'examples': true, 'neo': false, 'info': false
  };

  this.dynamicNeoQuery = "MATCH "
    + "(t:Type)-[:DECLARES]->(m:Method) "
    + "  RETURN "
    + "t.fqn AS Type, count(t) AS DeclaredMethods";
  this.infoInnerState = "idle";

  this.exceptionMessage;

  this.settings = {
    'metric1': null, 'metric2': null
  };

  this.availableMetrics = [];

  this.configLoaded = false;

  this.BASE_PATH = RESOURCES_BASE_PATH;

  this.init();
};

/**
 * Executes anything after construction.
 */
ThreeViewer.FileLoaderController.prototype.init = function () {
  var me = this;

  if (!Detector.webgl) {
    this.waitFor(500, 0, function () {
      me.infoInnerState = "error";
      me.exceptionMessage = Detector.getWebGLErrorMessage();
      me.showTab("info");
    });
  } else {
    this.listeners();
    var treeResult = {
      "id": "1",
      "name": "root",
      "isNode": true,
      "children": [
        {
          "id": "2146983730",
          "name": "java",
          "isNode": true,
          "heightMetricValue": 50.0,
          "footprintMetricValue": 50.0,
          "colorMetricValue": 0.0,
          "parentInfo": {
            "id": "1",
            "name": "root",
            "isNode": true,
            "heightMetricValue": 50.0,
            "footprintMetricValue": 50.0,
            "colorMetricValue": 0.0
          },
          "children": [
            {
              "id": "2146983731",
              "name": "lang",
              "isNode": true,
              "heightMetricValue": 50.0,
              "footprintMetricValue": 50.0,
              "colorMetricValue": 0.0,
              "parentInfo": {
                "id": "2146983730",
                "name": "java",
                "isNode": true,
                "heightMetricValue": 50.0,
                "footprintMetricValue": 50.0,
                "colorMetricValue": 0.0
              },
              "children": [
                {
                  "id": "2146983993",
                  "name": "Class",
                  "isNode": false,
                  "heightMetricValue": 50.0,
                  "footprintMetricValue": 2.0,
                  "colorMetricValue": 0.0,
                  "parentInfo": {
                    "id": "2146983731",
                    "name": "lang",
                    "isNode": true,
                    "heightMetricValue": 50.0,
                    "footprintMetricValue": 2.0,
                    "colorMetricValue": 0.0
                  },
                  "children": []
                },
                {
                  "id": "2146983803",
                  "name": "Integer",
                  "isNode": false,
                  "heightMetricValue": 50.0,
                  "footprintMetricValue": 4.0,
                  "colorMetricValue": 0.0,
                  "parentInfo": {
                    "id": "2146983731",
                    "name": "lang",
                    "isNode": true,
                    "heightMetricValue": 50.0,
                    "footprintMetricValue": 4.0,
                    "colorMetricValue": 0.0
                  },
                  "children": []
                },
                {
                  "id": "2146984066",
                  "name": "Number",
                  "isNode": false,
                  "heightMetricValue": 50.0,
                  "footprintMetricValue": 100.0,
                  "colorMetricValue": 0.0,
                  "parentInfo": {
                    "id": "2146983731",
                    "name": "lang",
                    "isNode": true,
                    "heightMetricValue": 50.0,
                    "footprintMetricValue": 100.0,
                    "colorMetricValue": 0.0
                  },
                  "children": []
                },
                {
                  "id": "2146983901",
                  "name": "Object",
                  "isNode": false,
                  "heightMetricValue": 50.0,
                  "footprintMetricValue": 3.0,
                  "colorMetricValue": 0.0,
                  "parentInfo": {
                    "id": "2146983731",
                    "name": "lang",
                    "isNode": true,
                    "heightMetricValue": 50.0,
                    "footprintMetricValue": 3.0,
                    "colorMetricValue": 0.0
                  },
                  "children": []
                },
                {
                  "id": "2146984129",
                  "name": "RuntimeException",
                  "isNode": false,
                  "heightMetricValue": 50.0,
                  "footprintMetricValue": 100.0,
                  "colorMetricValue": 0.0,
                  "parentInfo": {
                    "id": "2146983731",
                    "name": "lang",
                    "isNode": true,
                    "heightMetricValue": 50.0,
                    "footprintMetricValue": 100.0,
                    "colorMetricValue": 0.0
                  },
                  "children": []
                },
                {
                  "id": "2146983943",
                  "name": "String",
                  "isNode": false,
                  "heightMetricValue": 50.0,
                  "footprintMetricValue": 2.0,
                  "colorMetricValue": 0.0,
                  "parentInfo": {
                    "id": "2146983731",
                    "name": "lang",
                    "isNode": true,
                    "heightMetricValue": 50.0,
                    "footprintMetricValue": 2.0,
                    "colorMetricValue": 0.0
                  },
                  "children": []
                },
                {
                  "id": "2146983729",
                  "name": "StringBuilder",
                  "isNode": false,
                  "heightMetricValue": 50.0,
                  "footprintMetricValue": 7.0,
                  "colorMetricValue": 0.0,
                  "parentInfo": {
                    "id": "2146983731",
                    "name": "lang",
                    "isNode": true,
                    "heightMetricValue": 50.0,
                    "footprintMetricValue": 7.0,
                    "colorMetricValue": 0.0
                  },
                  "children": []
                },
                {
                  "id": "2146984149",
                  "name": "UnsupportedOperationException",
                  "isNode": false,
                  "heightMetricValue": 50.0,
                  "footprintMetricValue": 100.0,
                  "colorMetricValue": 0.0,
                  "parentInfo": {
                    "id": "2146983731",
                    "name": "lang",
                    "isNode": true,
                    "heightMetricValue": 50.0,
                    "footprintMetricValue": 100.0,
                    "colorMetricValue": 0.0
                  },
                  "children": []
                }
              ]
            },
            {
              "id": "2146983776",
              "name": "sql",
              "isNode": true,
              "heightMetricValue": 50.0,
              "footprintMetricValue": 50.0,
              "colorMetricValue": 0.0,
              "parentInfo": {
                "id": "2146983730",
                "name": "java",
                "isNode": true,
                "heightMetricValue": 50.0,
                "footprintMetricValue": 50.0,
                "colorMetricValue": 0.0
              },
              "children": [
                {
                  "id": "2146983774",
                  "name": "ResultSet",
                  "isNode": false,
                  "heightMetricValue": 50.0,
                  "footprintMetricValue": 5.0,
                  "colorMetricValue": 0.0,
                  "parentInfo": {
                    "id": "2146983776",
                    "name": "sql",
                    "isNode": true,
                    "heightMetricValue": 50.0,
                    "footprintMetricValue": 5.0,
                    "colorMetricValue": 0.0
                  },
                  "children": []
                }
              ]
            },
            {
              "id": "2146984074",
              "name": "text",
              "isNode": true,
              "heightMetricValue": 50.0,
              "footprintMetricValue": 50.0,
              "colorMetricValue": 0.0,
              "parentInfo": {
                "id": "2146983730",
                "name": "java",
                "isNode": true,
                "heightMetricValue": 50.0,
                "footprintMetricValue": 50.0,
                "colorMetricValue": 0.0
              },
              "children": [
                {
                  "id": "2146984072",
                  "name": "ParseException",
                  "isNode": false,
                  "heightMetricValue": 50.0,
                  "footprintMetricValue": 100.0,
                  "colorMetricValue": 0.0,
                  "parentInfo": {
                    "id": "2146984074",
                    "name": "text",
                    "isNode": true,
                    "heightMetricValue": 50.0,
                    "footprintMetricValue": 100.0,
                    "colorMetricValue": 0.0
                  },
                  "children": []
                }
              ]
            },
            {
              "id": "2146983745",
              "name": "util",
              "isNode": true,
              "heightMetricValue": 50.0,
              "footprintMetricValue": 50.0,
              "colorMetricValue": 0.0,
              "parentInfo": {
                "id": "2146983730",
                "name": "java",
                "isNode": true,
                "heightMetricValue": 50.0,
                "footprintMetricValue": 50.0,
                "colorMetricValue": 0.0
              },
              "children": [
                {
                  "id": "2146983940",
                  "name": "ArrayList",
                  "isNode": false,
                  "heightMetricValue": 50.0,
                  "footprintMetricValue": 2.0,
                  "colorMetricValue": 0.0,
                  "parentInfo": {
                    "id": "2146983745",
                    "name": "util",
                    "isNode": true,
                    "heightMetricValue": 50.0,
                    "footprintMetricValue": 2.0,
                    "colorMetricValue": 0.0
                  },
                  "children": []
                },
                {
                  "id": "2146983743",
                  "name": "Collection",
                  "isNode": false,
                  "heightMetricValue": 50.0,
                  "footprintMetricValue": 5.0,
                  "colorMetricValue": 0.0,
                  "parentInfo": {
                    "id": "2146983745",
                    "name": "util",
                    "isNode": true,
                    "heightMetricValue": 50.0,
                    "footprintMetricValue": 5.0,
                    "colorMetricValue": 0.0
                  },
                  "children": []
                },
                {
                  "id": "2146984196",
                  "name": "Collections",
                  "isNode": false,
                  "heightMetricValue": 50.0,
                  "footprintMetricValue": 100.0,
                  "colorMetricValue": 0.0,
                  "parentInfo": {
                    "id": "2146983745",
                    "name": "util",
                    "isNode": true,
                    "heightMetricValue": 50.0,
                    "footprintMetricValue": 100.0,
                    "colorMetricValue": 0.0
                  },
                  "children": []
                },
                {
                  "id": "2146984069",
                  "name": "HashMap",
                  "isNode": false,
                  "heightMetricValue": 50.0,
                  "footprintMetricValue": 100.0,
                  "colorMetricValue": 0.0,
                  "parentInfo": {
                    "id": "2146983745",
                    "name": "util",
                    "isNode": true,
                    "heightMetricValue": 50.0,
                    "footprintMetricValue": 100.0,
                    "colorMetricValue": 0.0
                  },
                  "children": []
                },
                {
                  "id": "2146984120",
                  "name": "HashSet",
                  "isNode": false,
                  "heightMetricValue": 50.0,
                  "footprintMetricValue": 100.0,
                  "colorMetricValue": 0.0,
                  "parentInfo": {
                    "id": "2146983745",
                    "name": "util",
                    "isNode": true,
                    "heightMetricValue": 50.0,
                    "footprintMetricValue": 100.0,
                    "colorMetricValue": 0.0
                  },
                  "children": []
                },
                {
                  "id": "2146983891",
                  "name": "Iterator",
                  "isNode": false,
                  "heightMetricValue": 50.0,
                  "footprintMetricValue": 3.0,
                  "colorMetricValue": 0.0,
                  "parentInfo": {
                    "id": "2146983745",
                    "name": "util",
                    "isNode": true,
                    "heightMetricValue": 50.0,
                    "footprintMetricValue": 3.0,
                    "colorMetricValue": 0.0
                  },
                  "children": []
                },
                {
                  "id": "2146983787",
                  "name": "List",
                  "isNode": false,
                  "heightMetricValue": 50.0,
                  "footprintMetricValue": 4.0,
                  "colorMetricValue": 0.0,
                  "parentInfo": {
                    "id": "2146983745",
                    "name": "util",
                    "isNode": true,
                    "heightMetricValue": 50.0,
                    "footprintMetricValue": 4.0,
                    "colorMetricValue": 0.0
                  },
                  "children": []
                },
                {
                  "id": "2146984098",
                  "name": "Map",
                  "isNode": false,
                  "heightMetricValue": 50.0,
                  "footprintMetricValue": 100.0,
                  "colorMetricValue": 0.0,
                  "parentInfo": {
                    "id": "2146983745",
                    "name": "util",
                    "isNode": true,
                    "heightMetricValue": 50.0,
                    "footprintMetricValue": 100.0,
                    "colorMetricValue": 0.0
                  },
                  "children": []
                },
                {
                  "id": "2146983771",
                  "name": "Set",
                  "isNode": false,
                  "heightMetricValue": 50.0,
                  "footprintMetricValue": 5.0,
                  "colorMetricValue": 0.0,
                  "parentInfo": {
                    "id": "2146983745",
                    "name": "util",
                    "isNode": true,
                    "heightMetricValue": 50.0,
                    "footprintMetricValue": 5.0,
                    "colorMetricValue": 0.0
                  },
                  "children": []
                }
              ]
            }
          ]
        },
        {
          "id": "2146983813",
          "name": "javax",
          "isNode": true,
          "heightMetricValue": 50.0,
          "footprintMetricValue": 50.0,
          "colorMetricValue": 0.0,
          "parentInfo": {
            "id": "1",
            "name": "root",
            "isNode": true,
            "heightMetricValue": 50.0,
            "footprintMetricValue": 50.0,
            "colorMetricValue": 0.0
          },
          "children": [
            {
              "id": "2146983814",
              "name": "persistence",
              "isNode": true,
              "heightMetricValue": 50.0,
              "footprintMetricValue": 50.0,
              "colorMetricValue": 0.0,
              "parentInfo": {
                "id": "2146983813",
                "name": "javax",
                "isNode": true,
                "heightMetricValue": 50.0,
                "footprintMetricValue": 50.0,
                "colorMetricValue": 0.0
              },
              "children": [
                {
                  "id": "2146983812",
                  "name": "EntityManager",
                  "isNode": false,
                  "heightMetricValue": 50.0,
                  "footprintMetricValue": 4.0,
                  "colorMetricValue": 0.0,
                  "parentInfo": {
                    "id": "2146983814",
                    "name": "persistence",
                    "isNode": true,
                    "heightMetricValue": 50.0,
                    "footprintMetricValue": 4.0,
                    "colorMetricValue": 0.0
                  },
                  "children": []
                },
                {
                  "id": "2146983869",
                  "name": "Query",
                  "isNode": false,
                  "heightMetricValue": 50.0,
                  "footprintMetricValue": 3.0,
                  "colorMetricValue": 0.0,
                  "parentInfo": {
                    "id": "2146983814",
                    "name": "persistence",
                    "isNode": true,
                    "heightMetricValue": 50.0,
                    "footprintMetricValue": 3.0,
                    "colorMetricValue": 0.0
                  },
                  "children": []
                }
              ]
            },
            {
              "id": "2146984017",
              "name": "validation",
              "isNode": true,
              "heightMetricValue": 50.0,
              "footprintMetricValue": 50.0,
              "colorMetricValue": 0.0,
              "parentInfo": {
                "id": "2146983813",
                "name": "javax",
                "isNode": true,
                "heightMetricValue": 50.0,
                "footprintMetricValue": 50.0,
                "colorMetricValue": 0.0
              },
              "children": [
                {
                  "id": "2146984015",
                  "name": "ConstraintViolation",
                  "isNode": false,
                  "heightMetricValue": 50.0,
                  "footprintMetricValue": 2.0,
                  "colorMetricValue": 0.0,
                  "parentInfo": {
                    "id": "2146984017",
                    "name": "validation",
                    "isNode": true,
                    "heightMetricValue": 50.0,
                    "footprintMetricValue": 2.0,
                    "colorMetricValue": 0.0
                  },
                  "children": []
                },
                {
                  "id": "2146984187",
                  "name": "Validator",
                  "isNode": false,
                  "heightMetricValue": 50.0,
                  "footprintMetricValue": 100.0,
                  "colorMetricValue": 0.0,
                  "parentInfo": {
                    "id": "2146984017",
                    "name": "validation",
                    "isNode": true,
                    "heightMetricValue": 50.0,
                    "footprintMetricValue": 100.0,
                    "colorMetricValue": 0.0
                  },
                  "children": []
                }
              ]
            }
          ]
        },
        {
          "id": "2146983649",
          "name": "org",
          "isNode": true,
          "heightMetricValue": 50.0,
          "footprintMetricValue": 50.0,
          "colorMetricValue": 0.0,
          "parentInfo": {
            "id": "1",
            "name": "root",
            "isNode": true,
            "heightMetricValue": 50.0,
            "footprintMetricValue": 50.0,
            "colorMetricValue": 0.0
          },
          "children": [
            {
              "id": "2146983991",
              "name": "aspectj",
              "isNode": true,
              "heightMetricValue": 50.0,
              "footprintMetricValue": 50.0,
              "colorMetricValue": 0.0,
              "parentInfo": {
                "id": "2146983649",
                "name": "org",
                "isNode": true,
                "heightMetricValue": 50.0,
                "footprintMetricValue": 50.0,
                "colorMetricValue": 0.0
              },
              "children": [
                {
                  "id": "2146983992",
                  "name": "lang",
                  "isNode": true,
                  "heightMetricValue": 50.0,
                  "footprintMetricValue": 50.0,
                  "colorMetricValue": 0.0,
                  "parentInfo": {
                    "id": "2146983991",
                    "name": "aspectj",
                    "isNode": true,
                    "heightMetricValue": 50.0,
                    "footprintMetricValue": 50.0,
                    "colorMetricValue": 0.0
                  },
                  "children": [
                    {
                      "id": "2146983989",
                      "name": "ProceedingJoinPoint",
                      "isNode": false,
                      "heightMetricValue": 50.0,
                      "footprintMetricValue": 2.0,
                      "colorMetricValue": 0.0,
                      "parentInfo": {
                        "id": "2146983992",
                        "name": "lang",
                        "isNode": true,
                        "heightMetricValue": 50.0,
                        "footprintMetricValue": 2.0,
                        "colorMetricValue": 0.0
                      },
                      "children": []
                    }
                  ]
                }
              ]
            },
            {
              "id": "2146983734",
              "name": "assertj",
              "isNode": true,
              "heightMetricValue": 50.0,
              "footprintMetricValue": 50.0,
              "colorMetricValue": 0.0,
              "parentInfo": {
                "id": "2146983649",
                "name": "org",
                "isNode": true,
                "heightMetricValue": 50.0,
                "footprintMetricValue": 50.0,
                "colorMetricValue": 0.0
              },
              "children": [
                {
                  "id": "2146983735",
                  "name": "core",
                  "isNode": true,
                  "heightMetricValue": 50.0,
                  "footprintMetricValue": 50.0,
                  "colorMetricValue": 0.0,
                  "parentInfo": {
                    "id": "2146983734",
                    "name": "assertj",
                    "isNode": true,
                    "heightMetricValue": 50.0,
                    "footprintMetricValue": 50.0,
                    "colorMetricValue": 0.0
                  },
                  "children": [
                    {
                      "id": "2146983736",
                      "name": "api",
                      "isNode": true,
                      "heightMetricValue": 50.0,
                      "footprintMetricValue": 50.0,
                      "colorMetricValue": 0.0,
                      "parentInfo": {
                        "id": "2146983735",
                        "name": "core",
                        "isNode": true,
                        "heightMetricValue": 50.0,
                        "footprintMetricValue": 50.0,
                        "colorMetricValue": 0.0
                      },
                      "children": [
                        {
                          "id": "2146983935",
                          "name": "AbstractCharSequenceAssert",
                          "isNode": false,
                          "heightMetricValue": 50.0,
                          "footprintMetricValue": 2.0,
                          "colorMetricValue": 0.0,
                          "parentInfo": {
                            "id": "2146983736",
                            "name": "api",
                            "isNode": true,
                            "heightMetricValue": 50.0,
                            "footprintMetricValue": 2.0,
                            "colorMetricValue": 0.0
                          },
                          "children": []
                        },
                        {
                          "id": "2146983974",
                          "name": "AbstractIntegerAssert",
                          "isNode": false,
                          "heightMetricValue": 50.0,
                          "footprintMetricValue": 2.0,
                          "colorMetricValue": 0.0,
                          "parentInfo": {
                            "id": "2146983736",
                            "name": "api",
                            "isNode": true,
                            "heightMetricValue": 50.0,
                            "footprintMetricValue": 2.0,
                            "colorMetricValue": 0.0
                          },
                          "children": []
                        },
                        {
                          "id": "2146984203",
                          "name": "AbstractLongAssert",
                          "isNode": false,
                          "heightMetricValue": 50.0,
                          "footprintMetricValue": 100.0,
                          "colorMetricValue": 0.0,
                          "parentInfo": {
                            "id": "2146983736",
                            "name": "api",
                            "isNode": true,
                            "heightMetricValue": 50.0,
                            "footprintMetricValue": 100.0,
                            "colorMetricValue": 0.0
                          },
                          "children": []
                        },
                        {
                          "id": "2146984152",
                          "name": "AbstractObjectAssert",
                          "isNode": false,
                          "heightMetricValue": 50.0,
                          "footprintMetricValue": 100.0,
                          "colorMetricValue": 0.0,
                          "parentInfo": {
                            "id": "2146983736",
                            "name": "api",
                            "isNode": true,
                            "heightMetricValue": 50.0,
                            "footprintMetricValue": 100.0,
                            "colorMetricValue": 0.0
                          },
                          "children": []
                        },
                        {
                          "id": "2146983732",
                          "name": "Assertions",
                          "isNode": false,
                          "heightMetricValue": 50.0,
                          "footprintMetricValue": 6.0,
                          "colorMetricValue": 0.0,
                          "parentInfo": {
                            "id": "2146983736",
                            "name": "api",
                            "isNode": true,
                            "heightMetricValue": 50.0,
                            "footprintMetricValue": 6.0,
                            "colorMetricValue": 0.0
                          },
                          "children": []
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              "id": "2146983829",
              "name": "joda",
              "isNode": true,
              "heightMetricValue": 50.0,
              "footprintMetricValue": 50.0,
              "colorMetricValue": 0.0,
              "parentInfo": {
                "id": "2146983649",
                "name": "org",
                "isNode": true,
                "heightMetricValue": 50.0,
                "footprintMetricValue": 50.0,
                "colorMetricValue": 0.0
              },
              "children": [
                {
                  "id": "2146983830",
                  "name": "time",
                  "isNode": true,
                  "heightMetricValue": 50.0,
                  "footprintMetricValue": 50.0,
                  "colorMetricValue": 0.0,
                  "parentInfo": {
                    "id": "2146983829",
                    "name": "joda",
                    "isNode": true,
                    "heightMetricValue": 50.0,
                    "footprintMetricValue": 50.0,
                    "colorMetricValue": 0.0
                  },
                  "children": [
                    {
                      "id": "2146983827",
                      "name": "LocalDate",
                      "isNode": false,
                      "heightMetricValue": 50.0,
                      "footprintMetricValue": 4.0,
                      "colorMetricValue": 0.0,
                      "parentInfo": {
                        "id": "2146983830",
                        "name": "time",
                        "isNode": true,
                        "heightMetricValue": 50.0,
                        "footprintMetricValue": 4.0,
                        "colorMetricValue": 0.0
                      },
                      "children": []
                    }
                  ]
                }
              ]
            },
            {
              "id": "2146983650",
              "name": "springframework",
              "isNode": true,
              "heightMetricValue": 50.0,
              "footprintMetricValue": 50.0,
              "colorMetricValue": 0.0,
              "parentInfo": {
                "id": "2146983649",
                "name": "org",
                "isNode": true,
                "heightMetricValue": 50.0,
                "footprintMetricValue": 50.0,
                "colorMetricValue": 0.0
              },
              "children": [
                {
                  "id": "2146984078",
                  "name": "beans",
                  "isNode": true,
                  "heightMetricValue": 50.0,
                  "footprintMetricValue": 50.0,
                  "colorMetricValue": 0.0,
                  "parentInfo": {
                    "id": "2146983650",
                    "name": "springframework",
                    "isNode": true,
                    "heightMetricValue": 50.0,
                    "footprintMetricValue": 50.0,
                    "colorMetricValue": 0.0
                  },
                  "children": [
                    {
                      "id": "2146984079",
                      "name": "support",
                      "isNode": true,
                      "heightMetricValue": 50.0,
                      "footprintMetricValue": 50.0,
                      "colorMetricValue": 0.0,
                      "parentInfo": {
                        "id": "2146984078",
                        "name": "beans",
                        "isNode": true,
                        "heightMetricValue": 50.0,
                        "footprintMetricValue": 50.0,
                        "colorMetricValue": 0.0
                      },
                      "children": [
                        {
                          "id": "2146984138",
                          "name": "MutableSortDefinition",
                          "isNode": false,
                          "heightMetricValue": 50.0,
                          "footprintMetricValue": 100.0,
                          "colorMetricValue": 0.0,
                          "parentInfo": {
                            "id": "2146984079",
                            "name": "support",
                            "isNode": true,
                            "heightMetricValue": 50.0,
                            "footprintMetricValue": 100.0,
                            "colorMetricValue": 0.0
                          },
                          "children": []
                        },
                        {
                          "id": "2146984075",
                          "name": "PropertyComparator",
                          "isNode": false,
                          "heightMetricValue": 50.0,
                          "footprintMetricValue": 100.0,
                          "colorMetricValue": 0.0,
                          "parentInfo": {
                            "id": "2146984079",
                            "name": "support",
                            "isNode": true,
                            "heightMetricValue": 50.0,
                            "footprintMetricValue": 100.0,
                            "colorMetricValue": 0.0
                          },
                          "children": []
                        }
                      ]
                    }
                  ]
                },
                {
                  "id": "2146984118",
                  "name": "context",
                  "isNode": true,
                  "heightMetricValue": 50.0,
                  "footprintMetricValue": 50.0,
                  "colorMetricValue": 0.0,
                  "parentInfo": {
                    "id": "2146983650",
                    "name": "springframework",
                    "isNode": true,
                    "heightMetricValue": 50.0,
                    "footprintMetricValue": 50.0,
                    "colorMetricValue": 0.0
                  },
                  "children": [
                    {
                      "id": "2146984119",
                      "name": "i18n",
                      "isNode": true,
                      "heightMetricValue": 50.0,
                      "footprintMetricValue": 50.0,
                      "colorMetricValue": 0.0,
                      "parentInfo": {
                        "id": "2146984118",
                        "name": "context",
                        "isNode": true,
                        "heightMetricValue": 50.0,
                        "footprintMetricValue": 50.0,
                        "colorMetricValue": 0.0
                      },
                      "children": [
                        {
                          "id": "2146984115",
                          "name": "LocaleContextHolder",
                          "isNode": false,
                          "heightMetricValue": 50.0,
                          "footprintMetricValue": 100.0,
                          "colorMetricValue": 0.0,
                          "parentInfo": {
                            "id": "2146984119",
                            "name": "i18n",
                            "isNode": true,
                            "heightMetricValue": 50.0,
                            "footprintMetricValue": 100.0,
                            "colorMetricValue": 0.0
                          },
                          "children": []
                        }
                      ]
                    }
                  ]
                },
                {
                  "id": "2146983818",
                  "name": "core",
                  "isNode": true,
                  "heightMetricValue": 50.0,
                  "footprintMetricValue": 50.0,
                  "colorMetricValue": 0.0,
                  "parentInfo": {
                    "id": "2146983650",
                    "name": "springframework",
                    "isNode": true,
                    "heightMetricValue": 50.0,
                    "footprintMetricValue": 50.0,
                    "colorMetricValue": 0.0
                  },
                  "children": [
                    {
                      "id": "2146983819",
                      "name": "style",
                      "isNode": true,
                      "heightMetricValue": 50.0,
                      "footprintMetricValue": 50.0,
                      "colorMetricValue": 0.0,
                      "parentInfo": {
                        "id": "2146983818",
                        "name": "core",
                        "isNode": true,
                        "heightMetricValue": 50.0,
                        "footprintMetricValue": 50.0,
                        "colorMetricValue": 0.0
                      },
                      "children": [
                        {
                          "id": "2146983815",
                          "name": "ToStringCreator",
                          "isNode": false,
                          "heightMetricValue": 50.0,
                          "footprintMetricValue": 4.0,
                          "colorMetricValue": 0.0,
                          "parentInfo": {
                            "id": "2146983819",
                            "name": "style",
                            "isNode": true,
                            "heightMetricValue": 50.0,
                            "footprintMetricValue": 4.0,
                            "colorMetricValue": 0.0
                          },
                          "children": []
                        }
                      ]
                    }
                  ]
                },
                {
                  "id": "2146984126",
                  "name": "data",
                  "isNode": true,
                  "heightMetricValue": 50.0,
                  "footprintMetricValue": 50.0,
                  "colorMetricValue": 0.0,
                  "parentInfo": {
                    "id": "2146983650",
                    "name": "springframework",
                    "isNode": true,
                    "heightMetricValue": 50.0,
                    "footprintMetricValue": 50.0,
                    "colorMetricValue": 0.0
                  },
                  "children": [
                    {
                      "id": "2146984127",
                      "name": "jdbc",
                      "isNode": true,
                      "heightMetricValue": 50.0,
                      "footprintMetricValue": 50.0,
                      "colorMetricValue": 0.0,
                      "parentInfo": {
                        "id": "2146984126",
                        "name": "data",
                        "isNode": true,
                        "heightMetricValue": 50.0,
                        "footprintMetricValue": 50.0,
                        "colorMetricValue": 0.0
                      },
                      "children": [
                        {
                          "id": "2146984128",
                          "name": "core",
                          "isNode": true,
                          "heightMetricValue": 50.0,
                          "footprintMetricValue": 50.0,
                          "colorMetricValue": 0.0,
                          "parentInfo": {
                            "id": "2146984127",
                            "name": "jdbc",
                            "isNode": true,
                            "heightMetricValue": 50.0,
                            "footprintMetricValue": 50.0,
                            "colorMetricValue": 0.0
                          },
                          "children": [
                            {
                              "id": "2146984123",
                              "name": "OneToManyResultSetExtractor",
                              "isNode": false,
                              "heightMetricValue": 50.0,
                              "footprintMetricValue": 100.0,
                              "colorMetricValue": 0.0,
                              "parentInfo": {
                                "id": "2146984128",
                                "name": "core",
                                "isNode": true,
                                "heightMetricValue": 50.0,
                                "footprintMetricValue": 100.0,
                                "colorMetricValue": 0.0
                              },
                              "children": []
                            }
                          ]
                        }
                      ]
                    }
                  ]
                },
                {
                  "id": "2146983768",
                  "name": "jdbc",
                  "isNode": true,
                  "heightMetricValue": 50.0,
                  "footprintMetricValue": 50.0,
                  "colorMetricValue": 0.0,
                  "parentInfo": {
                    "id": "2146983650",
                    "name": "springframework",
                    "isNode": true,
                    "heightMetricValue": 50.0,
                    "footprintMetricValue": 50.0,
                    "colorMetricValue": 0.0
                  },
                  "children": [
                    {
                      "id": "2146983769",
                      "name": "core",
                      "isNode": true,
                      "heightMetricValue": 50.0,
                      "footprintMetricValue": 50.0,
                      "colorMetricValue": 0.0,
                      "parentInfo": {
                        "id": "2146983768",
                        "name": "jdbc",
                        "isNode": true,
                        "heightMetricValue": 50.0,
                        "footprintMetricValue": 50.0,
                        "colorMetricValue": 0.0
                      },
                      "children": [
                        {
                          "id": "2146983770",
                          "name": "namedparam",
                          "isNode": true,
                          "heightMetricValue": 50.0,
                          "footprintMetricValue": 50.0,
                          "colorMetricValue": 0.0,
                          "parentInfo": {
                            "id": "2146983769",
                            "name": "core",
                            "isNode": true,
                            "heightMetricValue": 50.0,
                            "footprintMetricValue": 50.0,
                            "colorMetricValue": 0.0
                          },
                          "children": [
                            {
                              "id": "2146984143",
                              "name": "BeanPropertySqlParameterSource",
                              "isNode": false,
                              "heightMetricValue": 50.0,
                              "footprintMetricValue": 100.0,
                              "colorMetricValue": 0.0,
                              "parentInfo": {
                                "id": "2146983770",
                                "name": "namedparam",
                                "isNode": true,
                                "heightMetricValue": 50.0,
                                "footprintMetricValue": 100.0,
                                "colorMetricValue": 0.0
                              },
                              "children": []
                            },
                            {
                              "id": "2146983961",
                              "name": "MapSqlParameterSource",
                              "isNode": false,
                              "heightMetricValue": 50.0,
                              "footprintMetricValue": 2.0,
                              "colorMetricValue": 0.0,
                              "parentInfo": {
                                "id": "2146983770",
                                "name": "namedparam",
                                "isNode": true,
                                "heightMetricValue": 50.0,
                                "footprintMetricValue": 2.0,
                                "colorMetricValue": 0.0
                              },
                              "children": []
                            },
                            {
                              "id": "2146983765",
                              "name": "NamedParameterJdbcTemplate",
                              "isNode": false,
                              "heightMetricValue": 50.0,
                              "footprintMetricValue": 5.0,
                              "colorMetricValue": 0.0,
                              "parentInfo": {
                                "id": "2146983770",
                                "name": "namedparam",
                                "isNode": true,
                                "heightMetricValue": 50.0,
                                "footprintMetricValue": 5.0,
                                "colorMetricValue": 0.0
                              },
                              "children": []
                            }
                          ]
                        },
                        {
                          "id": "2146983782",
                          "name": "simple",
                          "isNode": true,
                          "heightMetricValue": 50.0,
                          "footprintMetricValue": 50.0,
                          "colorMetricValue": 0.0,
                          "parentInfo": {
                            "id": "2146983769",
                            "name": "core",
                            "isNode": true,
                            "heightMetricValue": 50.0,
                            "footprintMetricValue": 50.0,
                            "colorMetricValue": 0.0
                          },
                          "children": [
                            {
                              "id": "2146983777",
                              "name": "SimpleJdbcInsert",
                              "isNode": false,
                              "heightMetricValue": 50.0,
                              "footprintMetricValue": 4.0,
                              "colorMetricValue": 0.0,
                              "parentInfo": {
                                "id": "2146983782",
                                "name": "simple",
                                "isNode": true,
                                "heightMetricValue": 50.0,
                                "footprintMetricValue": 4.0,
                                "colorMetricValue": 0.0
                              },
                              "children": []
                            }
                          ]
                        },
                        {
                          "id": "2146983956",
                          "name": "BeanPropertyRowMapper",
                          "isNode": false,
                          "heightMetricValue": 50.0,
                          "footprintMetricValue": 2.0,
                          "colorMetricValue": 0.0,
                          "parentInfo": {
                            "id": "2146983769",
                            "name": "core",
                            "isNode": true,
                            "heightMetricValue": 50.0,
                            "footprintMetricValue": 2.0,
                            "colorMetricValue": 0.0
                          },
                          "children": []
                        },
                        {
                          "id": "2146983924",
                          "name": "JdbcTemplate",
                          "isNode": false,
                          "heightMetricValue": 50.0,
                          "footprintMetricValue": 3.0,
                          "colorMetricValue": 0.0,
                          "parentInfo": {
                            "id": "2146983769",
                            "name": "core",
                            "isNode": true,
                            "heightMetricValue": 50.0,
                            "footprintMetricValue": 3.0,
                            "colorMetricValue": 0.0
                          },
                          "children": []
                        }
                      ]
                    }
                  ]
                },
                {
                  "id": "2146984052",
                  "name": "orm",
                  "isNode": true,
                  "heightMetricValue": 50.0,
                  "footprintMetricValue": 50.0,
                  "colorMetricValue": 0.0,
                  "parentInfo": {
                    "id": "2146983650",
                    "name": "springframework",
                    "isNode": true,
                    "heightMetricValue": 50.0,
                    "footprintMetricValue": 50.0,
                    "colorMetricValue": 0.0
                  },
                  "children": [
                    {
                      "id": "2146984049",
                      "name": "ObjectRetrievalFailureException",
                      "isNode": false,
                      "heightMetricValue": 50.0,
                      "footprintMetricValue": 100.0,
                      "colorMetricValue": 0.0,
                      "parentInfo": {
                        "id": "2146984052",
                        "name": "orm",
                        "isNode": true,
                        "heightMetricValue": 50.0,
                        "footprintMetricValue": 100.0,
                        "colorMetricValue": 0.0
                      },
                      "children": []
                    }
                  ]
                },
                {
                  "id": "2146983651",
                  "name": "samples",
                  "isNode": true,
                  "heightMetricValue": 50.0,
                  "footprintMetricValue": 50.0,
                  "colorMetricValue": 0.0,
                  "parentInfo": {
                    "id": "2146983650",
                    "name": "springframework",
                    "isNode": true,
                    "heightMetricValue": 50.0,
                    "footprintMetricValue": 50.0,
                    "colorMetricValue": 0.0
                  },
                  "children": [
                    {
                      "id": "2146983652",
                      "name": "petclinic",
                      "isNode": true,
                      "heightMetricValue": 50.0,
                      "footprintMetricValue": 50.0,
                      "colorMetricValue": 0.0,
                      "parentInfo": {
                        "id": "2146983651",
                        "name": "samples",
                        "isNode": true,
                        "heightMetricValue": 50.0,
                        "footprintMetricValue": 50.0,
                        "colorMetricValue": 0.0
                      },
                      "children": [
                        {
                          "id": "2146983653",
                          "name": "model",
                          "isNode": true,
                          "heightMetricValue": 50.0,
                          "footprintMetricValue": 50.0,
                          "colorMetricValue": 0.0,
                          "parentInfo": {
                            "id": "2146983652",
                            "name": "petclinic",
                            "isNode": true,
                            "heightMetricValue": 50.0,
                            "footprintMetricValue": 50.0,
                            "colorMetricValue": 0.0
                          },
                          "children": [
                            {
                              "id": "2146983797",
                              "name": "BaseEntity",
                              "isNode": false,
                              "heightMetricValue": 50.0,
                              "footprintMetricValue": 4.0,
                              "colorMetricValue": 0.0,
                              "parentInfo": {
                                "id": "2146983653",
                                "name": "model",
                                "isNode": true,
                                "heightMetricValue": 50.0,
                                "footprintMetricValue": 4.0,
                                "colorMetricValue": 0.0
                              },
                              "children": []
                            },
                            {
                              "id": "2146983806",
                              "name": "NamedEntity",
                              "isNode": false,
                              "heightMetricValue": 50.0,
                              "footprintMetricValue": 4.0,
                              "colorMetricValue": 0.0,
                              "parentInfo": {
                                "id": "2146983653",
                                "name": "model",
                                "isNode": true,
                                "heightMetricValue": 50.0,
                                "footprintMetricValue": 4.0,
                                "colorMetricValue": 0.0
                              },
                              "children": []
                            },
                            {
                              "id": "2146983648",
                              "name": "Owner",
                              "isNode": false,
                              "heightMetricValue": 50.0,
                              "footprintMetricValue": 21.0,
                              "colorMetricValue": 0.0,
                              "parentInfo": {
                                "id": "2146983653",
                                "name": "model",
                                "isNode": true,
                                "heightMetricValue": 50.0,
                                "footprintMetricValue": 21.0,
                                "colorMetricValue": 0.0
                              },
                              "children": []
                            },
                            {
                              "id": "2146983746",
                              "name": "Person",
                              "isNode": false,
                              "heightMetricValue": 50.0,
                              "footprintMetricValue": 5.0,
                              "colorMetricValue": 0.0,
                              "parentInfo": {
                                "id": "2146983653",
                                "name": "model",
                                "isNode": true,
                                "heightMetricValue": 50.0,
                                "footprintMetricValue": 5.0,
                                "colorMetricValue": 0.0
                              },
                              "children": []
                            },
                            {
                              "id": "2146983654",
                              "name": "Pet",
                              "isNode": false,
                              "heightMetricValue": 50.0,
                              "footprintMetricValue": 16.0,
                              "colorMetricValue": 0.0,
                              "parentInfo": {
                                "id": "2146983653",
                                "name": "model",
                                "isNode": true,
                                "heightMetricValue": 50.0,
                                "footprintMetricValue": 16.0,
                                "colorMetricValue": 0.0
                              },
                              "children": []
                            },
                            {
                              "id": "2146983911",
                              "name": "PetType",
                              "isNode": false,
                              "heightMetricValue": 50.0,
                              "footprintMetricValue": 3.0,
                              "colorMetricValue": 0.0,
                              "parentInfo": {
                                "id": "2146983653",
                                "name": "model",
                                "isNode": true,
                                "heightMetricValue": 50.0,
                                "footprintMetricValue": 3.0,
                                "colorMetricValue": 0.0
                              },
                              "children": []
                            },
                            {
                              "id": "2146983996",
                              "name": "Specialty",
                              "isNode": false,
                              "heightMetricValue": 50.0,
                              "footprintMetricValue": 2.0,
                              "colorMetricValue": 0.0,
                              "parentInfo": {
                                "id": "2146983653",
                                "name": "model",
                                "isNode": true,
                                "heightMetricValue": 50.0,
                                "footprintMetricValue": 2.0,
                                "colorMetricValue": 0.0
                              },
                              "children": []
                            },
                            {
                              "id": "2146983844",
                              "name": "ValidatorTests",
                              "isNode": false,
                              "heightMetricValue": 50.0,
                              "footprintMetricValue": 3.0,
                              "colorMetricValue": 0.0,
                              "parentInfo": {
                                "id": "2146983653",
                                "name": "model",
                                "isNode": true,
                                "heightMetricValue": 50.0,
                                "footprintMetricValue": 3.0,
                                "colorMetricValue": 0.0
                              },
                              "children": []
                            },
                            {
                              "id": "2146983703",
                              "name": "Vet",
                              "isNode": false,
                              "heightMetricValue": 50.0,
                              "footprintMetricValue": 8.0,
                              "colorMetricValue": 0.0,
                              "parentInfo": {
                                "id": "2146983653",
                                "name": "model",
                                "isNode": true,
                                "heightMetricValue": 50.0,
                                "footprintMetricValue": 8.0,
                                "colorMetricValue": 0.0
                              },
                              "children": []
                            },
                            {
                              "id": "2146983983",
                              "name": "Vets",
                              "isNode": false,
                              "heightMetricValue": 50.0,
                              "footprintMetricValue": 2.0,
                              "colorMetricValue": 0.0,
                              "parentInfo": {
                                "id": "2146983653",
                                "name": "model",
                                "isNode": true,
                                "heightMetricValue": 50.0,
                                "footprintMetricValue": 2.0,
                                "colorMetricValue": 0.0
                              },
                              "children": []
                            },
                            {
                              "id": "2146983673",
                              "name": "Visit",
                              "isNode": false,
                              "heightMetricValue": 50.0,
                              "footprintMetricValue": 10.0,
                              "colorMetricValue": 0.0,
                              "parentInfo": {
                                "id": "2146983653",
                                "name": "model",
                                "isNode": true,
                                "heightMetricValue": 50.0,
                                "footprintMetricValue": 10.0,
                                "colorMetricValue": 0.0
                              },
                              "children": []
                            }
                          ]
                        },
                        {
                          "id": "2146983671",
                          "name": "repository",
                          "isNode": true,
                          "heightMetricValue": 50.0,
                          "footprintMetricValue": 50.0,
                          "colorMetricValue": 0.0,
                          "parentInfo": {
                            "id": "2146983652",
                            "name": "petclinic",
                            "isNode": true,
                            "heightMetricValue": 50.0,
                            "footprintMetricValue": 50.0,
                            "colorMetricValue": 0.0
                          },
                          "children": [
                            {
                              "id": "2146983672",
                              "name": "jdbc",
                              "isNode": true,
                              "heightMetricValue": 50.0,
                              "footprintMetricValue": 50.0,
                              "colorMetricValue": 0.0,
                              "parentInfo": {
                                "id": "2146983671",
                                "name": "repository",
                                "isNode": true,
                                "heightMetricValue": 50.0,
                                "footprintMetricValue": 50.0,
                                "colorMetricValue": 0.0
                              },
                              "children": [
                                {
                                  "id": "2146983709",
                                  "name": "JdbcOwnerRepositoryImpl",
                                  "isNode": false,
                                  "heightMetricValue": 50.0,
                                  "footprintMetricValue": 7.0,
                                  "colorMetricValue": 0.0,
                                  "parentInfo": {
                                    "id": "2146983672",
                                    "name": "jdbc",
                                    "isNode": true,
                                    "heightMetricValue": 50.0,
                                    "footprintMetricValue": 7.0,
                                    "colorMetricValue": 0.0
                                  },
                                  "children": []
                                },
                                {
                                  "id": "2146983666",
                                  "name": "JdbcPet",
                                  "isNode": false,
                                  "heightMetricValue": 50.0,
                                  "footprintMetricValue": 11.0,
                                  "colorMetricValue": 0.0,
                                  "parentInfo": {
                                    "id": "2146983672",
                                    "name": "jdbc",
                                    "isNode": true,
                                    "heightMetricValue": 50.0,
                                    "footprintMetricValue": 11.0,
                                    "colorMetricValue": 0.0
                                  },
                                  "children": []
                                },
                                {
                                  "id": "2146983758",
                                  "name": "JdbcPetRepositoryImpl",
                                  "isNode": false,
                                  "heightMetricValue": 50.0,
                                  "footprintMetricValue": 5.0,
                                  "colorMetricValue": 0.0,
                                  "parentInfo": {
                                    "id": "2146983672",
                                    "name": "jdbc",
                                    "isNode": true,
                                    "heightMetricValue": 50.0,
                                    "footprintMetricValue": 5.0,
                                    "colorMetricValue": 0.0
                                  },
                                  "children": []
                                },
                                {
                                  "id": "2146983862",
                                  "name": "JdbcPetRowMapper",
                                  "isNode": false,
                                  "heightMetricValue": 50.0,
                                  "footprintMetricValue": 3.0,
                                  "colorMetricValue": 0.0,
                                  "parentInfo": {
                                    "id": "2146983672",
                                    "name": "jdbc",
                                    "isNode": true,
                                    "heightMetricValue": 50.0,
                                    "footprintMetricValue": 3.0,
                                    "colorMetricValue": 0.0
                                  },
                                  "children": []
                                },
                                {
                                  "id": "2146983722",
                                  "name": "JdbcPetVisitExtractor",
                                  "isNode": false,
                                  "heightMetricValue": 50.0,
                                  "footprintMetricValue": 7.0,
                                  "colorMetricValue": 0.0,
                                  "parentInfo": {
                                    "id": "2146983672",
                                    "name": "jdbc",
                                    "isNode": true,
                                    "heightMetricValue": 50.0,
                                    "footprintMetricValue": 7.0,
                                    "colorMetricValue": 0.0
                                  },
                                  "children": []
                                },
                                {
                                  "id": "2146983967",
                                  "name": "JdbcVetRepositoryImpl",
                                  "isNode": false,
                                  "heightMetricValue": 50.0,
                                  "footprintMetricValue": 2.0,
                                  "colorMetricValue": 0.0,
                                  "parentInfo": {
                                    "id": "2146983672",
                                    "name": "jdbc",
                                    "isNode": true,
                                    "heightMetricValue": 50.0,
                                    "footprintMetricValue": 2.0,
                                    "colorMetricValue": 0.0
                                  },
                                  "children": []
                                },
                                {
                                  "id": "2146983917",
                                  "name": "JdbcVetRepositoryImpl$1",
                                  "isNode": false,
                                  "heightMetricValue": 50.0,
                                  "footprintMetricValue": 3.0,
                                  "colorMetricValue": 0.0,
                                  "parentInfo": {
                                    "id": "2146983672",
                                    "name": "jdbc",
                                    "isNode": true,
                                    "heightMetricValue": 50.0,
                                    "footprintMetricValue": 3.0,
                                    "colorMetricValue": 0.0
                                  },
                                  "children": []
                                },
                                {
                                  "id": "2146983790",
                                  "name": "JdbcVisitRepositoryImpl",
                                  "isNode": false,
                                  "heightMetricValue": 50.0,
                                  "footprintMetricValue": 4.0,
                                  "colorMetricValue": 0.0,
                                  "parentInfo": {
                                    "id": "2146983672",
                                    "name": "jdbc",
                                    "isNode": true,
                                    "heightMetricValue": 50.0,
                                    "footprintMetricValue": 4.0,
                                    "colorMetricValue": 0.0
                                  },
                                  "children": []
                                },
                                {
                                  "id": "2146983894",
                                  "name": "JdbcVisitRowMapper",
                                  "isNode": false,
                                  "heightMetricValue": 50.0,
                                  "footprintMetricValue": 3.0,
                                  "colorMetricValue": 0.0,
                                  "parentInfo": {
                                    "id": "2146983672",
                                    "name": "jdbc",
                                    "isNode": true,
                                    "heightMetricValue": 50.0,
                                    "footprintMetricValue": 3.0,
                                    "colorMetricValue": 0.0
                                  },
                                  "children": []
                                }
                              ]
                            },
                            {
                              "id": "2146983826",
                              "name": "jpa",
                              "isNode": true,
                              "heightMetricValue": 50.0,
                              "footprintMetricValue": 50.0,
                              "colorMetricValue": 0.0,
                              "parentInfo": {
                                "id": "2146983671",
                                "name": "repository",
                                "isNode": true,
                                "heightMetricValue": 50.0,
                                "footprintMetricValue": 50.0,
                                "colorMetricValue": 0.0
                              },
                              "children": [
                                {
                                  "id": "2146983831",
                                  "name": "JpaOwnerRepositoryImpl",
                                  "isNode": false,
                                  "heightMetricValue": 50.0,
                                  "footprintMetricValue": 4.0,
                                  "colorMetricValue": 0.0,
                                  "parentInfo": {
                                    "id": "2146983826",
                                    "name": "jpa",
                                    "isNode": true,
                                    "heightMetricValue": 50.0,
                                    "footprintMetricValue": 4.0,
                                    "colorMetricValue": 0.0
                                  },
                                  "children": []
                                },
                                {
                                  "id": "2146983820",
                                  "name": "JpaPetRepositoryImpl",
                                  "isNode": false,
                                  "heightMetricValue": 50.0,
                                  "footprintMetricValue": 4.0,
                                  "colorMetricValue": 0.0,
                                  "parentInfo": {
                                    "id": "2146983826",
                                    "name": "jpa",
                                    "isNode": true,
                                    "heightMetricValue": 50.0,
                                    "footprintMetricValue": 4.0,
                                    "colorMetricValue": 0.0
                                  },
                                  "children": []
                                },
                                {
                                  "id": "2146984008",
                                  "name": "JpaVetRepositoryImpl",
                                  "isNode": false,
                                  "heightMetricValue": 50.0,
                                  "footprintMetricValue": 2.0,
                                  "colorMetricValue": 0.0,
                                  "parentInfo": {
                                    "id": "2146983826",
                                    "name": "jpa",
                                    "isNode": true,
                                    "heightMetricValue": 50.0,
                                    "footprintMetricValue": 2.0,
                                    "colorMetricValue": 0.0
                                  },
                                  "children": []
                                },
                                {
                                  "id": "2146983872",
                                  "name": "JpaVisitRepositoryImpl",
                                  "isNode": false,
                                  "heightMetricValue": 50.0,
                                  "footprintMetricValue": 3.0,
                                  "colorMetricValue": 0.0,
                                  "parentInfo": {
                                    "id": "2146983826",
                                    "name": "jpa",
                                    "isNode": true,
                                    "heightMetricValue": 50.0,
                                    "footprintMetricValue": 3.0,
                                    "colorMetricValue": 0.0
                                  },
                                  "children": []
                                }
                              ]
                            },
                            {
                              "id": "2146984030",
                              "name": "springdatajpa",
                              "isNode": true,
                              "heightMetricValue": 50.0,
                              "footprintMetricValue": 50.0,
                              "colorMetricValue": 0.0,
                              "parentInfo": {
                                "id": "2146983671",
                                "name": "repository",
                                "isNode": true,
                                "heightMetricValue": 50.0,
                                "footprintMetricValue": 50.0,
                                "colorMetricValue": 0.0
                              },
                              "children": [
                                {
                                  "id": "2146984024",
                                  "name": "SpringDataOwnerRepository",
                                  "isNode": false,
                                  "heightMetricValue": 50.0,
                                  "footprintMetricValue": 2.0,
                                  "colorMetricValue": 0.0,
                                  "parentInfo": {
                                    "id": "2146984030",
                                    "name": "springdatajpa",
                                    "isNode": true,
                                    "heightMetricValue": 50.0,
                                    "footprintMetricValue": 2.0,
                                    "colorMetricValue": 0.0
                                  },
                                  "children": []
                                },
                                {
                                  "id": "2146984084",
                                  "name": "SpringDataPetRepository",
                                  "isNode": false,
                                  "heightMetricValue": 50.0,
                                  "footprintMetricValue": 100.0,
                                  "colorMetricValue": 0.0,
                                  "parentInfo": {
                                    "id": "2146984030",
                                    "name": "springdatajpa",
                                    "isNode": true,
                                    "heightMetricValue": 50.0,
                                    "footprintMetricValue": 100.0,
                                    "colorMetricValue": 0.0
                                  },
                                  "children": []
                                }
                              ]
                            },
                            {
                              "id": "2146983879",
                              "name": "OwnerRepository",
                              "isNode": false,
                              "heightMetricValue": 50.0,
                              "footprintMetricValue": 3.0,
                              "colorMetricValue": 0.0,
                              "parentInfo": {
                                "id": "2146983671",
                                "name": "repository",
                                "isNode": true,
                                "heightMetricValue": 50.0,
                                "footprintMetricValue": 3.0,
                                "colorMetricValue": 0.0
                              },
                              "children": []
                            },
                            {
                              "id": "2146983885",
                              "name": "PetRepository",
                              "isNode": false,
                              "heightMetricValue": 50.0,
                              "footprintMetricValue": 3.0,
                              "colorMetricValue": 0.0,
                              "parentInfo": {
                                "id": "2146983671",
                                "name": "repository",
                                "isNode": true,
                                "heightMetricValue": 50.0,
                                "footprintMetricValue": 3.0,
                                "colorMetricValue": 0.0
                              },
                              "children": []
                            },
                            {
                              "id": "2146984181",
                              "name": "VetRepository",
                              "isNode": false,
                              "heightMetricValue": 50.0,
                              "footprintMetricValue": 100.0,
                              "colorMetricValue": 0.0,
                              "parentInfo": {
                                "id": "2146983671",
                                "name": "repository",
                                "isNode": true,
                                "heightMetricValue": 50.0,
                                "footprintMetricValue": 100.0,
                                "colorMetricValue": 0.0
                              },
                              "children": []
                            },
                            {
                              "id": "2146984018",
                              "name": "VisitRepository",
                              "isNode": false,
                              "heightMetricValue": 50.0,
                              "footprintMetricValue": 2.0,
                              "colorMetricValue": 0.0,
                              "parentInfo": {
                                "id": "2146983671",
                                "name": "repository",
                                "isNode": true,
                                "heightMetricValue": 50.0,
                                "footprintMetricValue": 2.0,
                                "colorMetricValue": 0.0
                              },
                              "children": []
                            }
                          ]
                        },
                        {
                          "id": "2146983665",
                          "name": "service",
                          "isNode": true,
                          "heightMetricValue": 50.0,
                          "footprintMetricValue": 50.0,
                          "colorMetricValue": 0.0,
                          "parentInfo": {
                            "id": "2146983652",
                            "name": "petclinic",
                            "isNode": true,
                            "heightMetricValue": 50.0,
                            "footprintMetricValue": 50.0,
                            "colorMetricValue": 0.0
                          },
                          "children": [
                            {
                              "id": "2146983660",
                              "name": "AbstractClinicServiceTests",
                              "isNode": false,
                              "heightMetricValue": 50.0,
                              "footprintMetricValue": 11.0,
                              "colorMetricValue": 0.0,
                              "parentInfo": {
                                "id": "2146983665",
                                "name": "service",
                                "isNode": true,
                                "heightMetricValue": 50.0,
                                "footprintMetricValue": 11.0,
                                "colorMetricValue": 0.0
                              },
                              "children": []
                            },
                            {
                              "id": "2146983697",
                              "name": "ClinicService",
                              "isNode": false,
                              "heightMetricValue": 50.0,
                              "footprintMetricValue": 8.0,
                              "colorMetricValue": 0.0,
                              "parentInfo": {
                                "id": "2146983665",
                                "name": "service",
                                "isNode": true,
                                "heightMetricValue": 50.0,
                                "footprintMetricValue": 8.0,
                                "colorMetricValue": 0.0
                              },
                              "children": []
                            },
                            {
                              "id": "2146983691",
                              "name": "ClinicServiceImpl",
                              "isNode": false,
                              "heightMetricValue": 50.0,
                              "footprintMetricValue": 9.0,
                              "colorMetricValue": 0.0,
                              "parentInfo": {
                                "id": "2146983665",
                                "name": "service",
                                "isNode": true,
                                "heightMetricValue": 50.0,
                                "footprintMetricValue": 9.0,
                                "colorMetricValue": 0.0
                              },
                              "children": []
                            },
                            {
                              "id": "2146984190",
                              "name": "ClinicServiceJdbcTests",
                              "isNode": false,
                              "heightMetricValue": 50.0,
                              "footprintMetricValue": 100.0,
                              "colorMetricValue": 0.0,
                              "parentInfo": {
                                "id": "2146983665",
                                "name": "service",
                                "isNode": true,
                                "heightMetricValue": 50.0,
                                "footprintMetricValue": 100.0,
                                "colorMetricValue": 0.0
                              },
                              "children": []
                            },
                            {
                              "id": "2146984060",
                              "name": "ClinicServiceJpaTests",
                              "isNode": false,
                              "heightMetricValue": 50.0,
                              "footprintMetricValue": 100.0,
                              "colorMetricValue": 0.0,
                              "parentInfo": {
                                "id": "2146983665",
                                "name": "service",
                                "isNode": true,
                                "heightMetricValue": 50.0,
                                "footprintMetricValue": 100.0,
                                "colorMetricValue": 0.0
                              },
                              "children": []
                            },
                            {
                              "id": "2146984036",
                              "name": "ClinicServiceSpringDataJpaTests",
                              "isNode": false,
                              "heightMetricValue": 50.0,
                              "footprintMetricValue": 100.0,
                              "colorMetricValue": 0.0,
                              "parentInfo": {
                                "id": "2146983665",
                                "name": "service",
                                "isNode": true,
                                "heightMetricValue": 50.0,
                                "footprintMetricValue": 100.0,
                                "colorMetricValue": 0.0
                              },
                              "children": []
                            }
                          ]
                        },
                        {
                          "id": "2146983721",
                          "name": "util",
                          "isNode": true,
                          "heightMetricValue": 50.0,
                          "footprintMetricValue": 50.0,
                          "colorMetricValue": 0.0,
                          "parentInfo": {
                            "id": "2146983652",
                            "name": "petclinic",
                            "isNode": true,
                            "heightMetricValue": 50.0,
                            "footprintMetricValue": 50.0,
                            "colorMetricValue": 0.0
                          },
                          "children": [
                            {
                              "id": "2146983716",
                              "name": "CallMonitoringAspect",
                              "isNode": false,
                              "heightMetricValue": 50.0,
                              "footprintMetricValue": 7.0,
                              "colorMetricValue": 0.0,
                              "parentInfo": {
                                "id": "2146983721",
                                "name": "util",
                                "isNode": true,
                                "heightMetricValue": 50.0,
                                "footprintMetricValue": 7.0,
                                "colorMetricValue": 0.0
                              },
                              "children": []
                            },
                            {
                              "id": "2146983929",
                              "name": "EntityUtils",
                              "isNode": false,
                              "heightMetricValue": 50.0,
                              "footprintMetricValue": 2.0,
                              "colorMetricValue": 0.0,
                              "parentInfo": {
                                "id": "2146983721",
                                "name": "util",
                                "isNode": true,
                                "heightMetricValue": 50.0,
                                "footprintMetricValue": 2.0,
                                "colorMetricValue": 0.0
                              },
                              "children": []
                            }
                          ]
                        },
                        {
                          "id": "2146983684",
                          "name": "web",
                          "isNode": true,
                          "heightMetricValue": 50.0,
                          "footprintMetricValue": 50.0,
                          "colorMetricValue": 0.0,
                          "parentInfo": {
                            "id": "2146983652",
                            "name": "petclinic",
                            "isNode": true,
                            "heightMetricValue": 50.0,
                            "footprintMetricValue": 50.0,
                            "colorMetricValue": 0.0
                          },
                          "children": [
                            {
                              "id": "2146984002",
                              "name": "CrashController",
                              "isNode": false,
                              "heightMetricValue": 50.0,
                              "footprintMetricValue": 2.0,
                              "colorMetricValue": 0.0,
                              "parentInfo": {
                                "id": "2146983684",
                                "name": "web",
                                "isNode": true,
                                "heightMetricValue": 50.0,
                                "footprintMetricValue": 2.0,
                                "colorMetricValue": 0.0
                              },
                              "children": []
                            },
                            {
                              "id": "2146983679",
                              "name": "OwnerController",
                              "isNode": false,
                              "heightMetricValue": 50.0,
                              "footprintMetricValue": 9.0,
                              "colorMetricValue": 0.0,
                              "parentInfo": {
                                "id": "2146983684",
                                "name": "web",
                                "isNode": true,
                                "heightMetricValue": 50.0,
                                "footprintMetricValue": 9.0,
                                "colorMetricValue": 0.0
                              },
                              "children": []
                            },
                            {
                              "id": "2146983685",
                              "name": "PetController",
                              "isNode": false,
                              "heightMetricValue": 50.0,
                              "footprintMetricValue": 9.0,
                              "colorMetricValue": 0.0,
                              "parentInfo": {
                                "id": "2146983684",
                                "name": "web",
                                "isNode": true,
                                "heightMetricValue": 50.0,
                                "footprintMetricValue": 9.0,
                                "colorMetricValue": 0.0
                              },
                              "children": []
                            },
                            {
                              "id": "2146983752",
                              "name": "PetTypeFormatter",
                              "isNode": false,
                              "heightMetricValue": 50.0,
                              "footprintMetricValue": 5.0,
                              "colorMetricValue": 0.0,
                              "parentInfo": {
                                "id": "2146983684",
                                "name": "web",
                                "isNode": true,
                                "heightMetricValue": 50.0,
                                "footprintMetricValue": 5.0,
                                "colorMetricValue": 0.0
                              },
                              "children": []
                            },
                            {
                              "id": "2146983838",
                              "name": "PetValidator",
                              "isNode": false,
                              "heightMetricValue": 50.0,
                              "footprintMetricValue": 3.0,
                              "colorMetricValue": 0.0,
                              "parentInfo": {
                                "id": "2146983684",
                                "name": "web",
                                "isNode": true,
                                "heightMetricValue": 50.0,
                                "footprintMetricValue": 3.0,
                                "colorMetricValue": 0.0
                              },
                              "children": []
                            },
                            {
                              "id": "2146983856",
                              "name": "VetController",
                              "isNode": false,
                              "heightMetricValue": 50.0,
                              "footprintMetricValue": 3.0,
                              "colorMetricValue": 0.0,
                              "parentInfo": {
                                "id": "2146983684",
                                "name": "web",
                                "isNode": true,
                                "heightMetricValue": 50.0,
                                "footprintMetricValue": 3.0,
                                "colorMetricValue": 0.0
                              },
                              "children": []
                            },
                            {
                              "id": "2146983850",
                              "name": "VetControllerTests",
                              "isNode": false,
                              "heightMetricValue": 50.0,
                              "footprintMetricValue": 3.0,
                              "colorMetricValue": 0.0,
                              "parentInfo": {
                                "id": "2146983684",
                                "name": "web",
                                "isNode": true,
                                "heightMetricValue": 50.0,
                                "footprintMetricValue": 3.0,
                                "colorMetricValue": 0.0
                              },
                              "children": []
                            },
                            {
                              "id": "2146983737",
                              "name": "VisitController",
                              "isNode": false,
                              "heightMetricValue": 50.0,
                              "footprintMetricValue": 6.0,
                              "colorMetricValue": 0.0,
                              "parentInfo": {
                                "id": "2146983684",
                                "name": "web",
                                "isNode": true,
                                "heightMetricValue": 50.0,
                                "footprintMetricValue": 6.0,
                                "colorMetricValue": 0.0
                              },
                              "children": []
                            }
                          ]
                        }
                      ]
                    }
                  ]
                },
                {
                  "id": "2146983907",
                  "name": "test",
                  "isNode": true,
                  "heightMetricValue": 50.0,
                  "footprintMetricValue": 50.0,
                  "colorMetricValue": 0.0,
                  "parentInfo": {
                    "id": "2146983650",
                    "name": "springframework",
                    "isNode": true,
                    "heightMetricValue": 50.0,
                    "footprintMetricValue": 50.0,
                    "colorMetricValue": 0.0
                  },
                  "children": [
                    {
                      "id": "2146983908",
                      "name": "web",
                      "isNode": true,
                      "heightMetricValue": 50.0,
                      "footprintMetricValue": 50.0,
                      "colorMetricValue": 0.0,
                      "parentInfo": {
                        "id": "2146983907",
                        "name": "test",
                        "isNode": true,
                        "heightMetricValue": 50.0,
                        "footprintMetricValue": 50.0,
                        "colorMetricValue": 0.0
                      },
                      "children": [
                        {
                          "id": "2146983909",
                          "name": "servlet",
                          "isNode": true,
                          "heightMetricValue": 50.0,
                          "footprintMetricValue": 50.0,
                          "colorMetricValue": 0.0,
                          "parentInfo": {
                            "id": "2146983908",
                            "name": "web",
                            "isNode": true,
                            "heightMetricValue": 50.0,
                            "footprintMetricValue": 50.0,
                            "colorMetricValue": 0.0
                          },
                          "children": [
                            {
                              "id": "2146984048",
                              "name": "request",
                              "isNode": true,
                              "heightMetricValue": 50.0,
                              "footprintMetricValue": 50.0,
                              "colorMetricValue": 0.0,
                              "parentInfo": {
                                "id": "2146983909",
                                "name": "servlet",
                                "isNode": true,
                                "heightMetricValue": 50.0,
                                "footprintMetricValue": 50.0,
                                "colorMetricValue": 0.0
                              },
                              "children": [
                                {
                                  "id": "2146984108",
                                  "name": "MockHttpServletRequestBuilder",
                                  "isNode": false,
                                  "heightMetricValue": 50.0,
                                  "footprintMetricValue": 100.0,
                                  "colorMetricValue": 0.0,
                                  "parentInfo": {
                                    "id": "2146984048",
                                    "name": "request",
                                    "isNode": true,
                                    "heightMetricValue": 50.0,
                                    "footprintMetricValue": 100.0,
                                    "colorMetricValue": 0.0
                                  },
                                  "children": []
                                },
                                {
                                  "id": "2146984042",
                                  "name": "MockMvcRequestBuilders",
                                  "isNode": false,
                                  "heightMetricValue": 50.0,
                                  "footprintMetricValue": 100.0,
                                  "colorMetricValue": 0.0,
                                  "parentInfo": {
                                    "id": "2146984048",
                                    "name": "request",
                                    "isNode": true,
                                    "heightMetricValue": 50.0,
                                    "footprintMetricValue": 100.0,
                                    "colorMetricValue": 0.0
                                  },
                                  "children": []
                                }
                              ]
                            },
                            {
                              "id": "2146983910",
                              "name": "result",
                              "isNode": true,
                              "heightMetricValue": 50.0,
                              "footprintMetricValue": 50.0,
                              "colorMetricValue": 0.0,
                              "parentInfo": {
                                "id": "2146983909",
                                "name": "servlet",
                                "isNode": true,
                                "heightMetricValue": 50.0,
                                "footprintMetricValue": 50.0,
                                "colorMetricValue": 0.0
                              },
                              "children": [
                                {
                                  "id": "2146984101",
                                  "name": "ContentResultMatchers",
                                  "isNode": false,
                                  "heightMetricValue": 50.0,
                                  "footprintMetricValue": 100.0,
                                  "colorMetricValue": 0.0,
                                  "parentInfo": {
                                    "id": "2146983910",
                                    "name": "result",
                                    "isNode": true,
                                    "heightMetricValue": 50.0,
                                    "footprintMetricValue": 100.0,
                                    "colorMetricValue": 0.0
                                  },
                                  "children": []
                                },
                                {
                                  "id": "2146984091",
                                  "name": "JsonPathResultMatchers",
                                  "isNode": false,
                                  "heightMetricValue": 50.0,
                                  "footprintMetricValue": 100.0,
                                  "colorMetricValue": 0.0,
                                  "parentInfo": {
                                    "id": "2146983910",
                                    "name": "result",
                                    "isNode": true,
                                    "heightMetricValue": 50.0,
                                    "footprintMetricValue": 100.0,
                                    "colorMetricValue": 0.0
                                  },
                                  "children": []
                                },
                                {
                                  "id": "2146983904",
                                  "name": "MockMvcResultMatchers",
                                  "isNode": false,
                                  "heightMetricValue": 50.0,
                                  "footprintMetricValue": 3.0,
                                  "colorMetricValue": 0.0,
                                  "parentInfo": {
                                    "id": "2146983910",
                                    "name": "result",
                                    "isNode": true,
                                    "heightMetricValue": 50.0,
                                    "footprintMetricValue": 3.0,
                                    "colorMetricValue": 0.0
                                  },
                                  "children": []
                                },
                                {
                                  "id": "2146984053",
                                  "name": "StatusResultMatchers",
                                  "isNode": false,
                                  "heightMetricValue": 50.0,
                                  "footprintMetricValue": 100.0,
                                  "colorMetricValue": 0.0,
                                  "parentInfo": {
                                    "id": "2146983910",
                                    "name": "result",
                                    "isNode": true,
                                    "heightMetricValue": 50.0,
                                    "footprintMetricValue": 100.0,
                                    "colorMetricValue": 0.0
                                  },
                                  "children": []
                                }
                              ]
                            },
                            {
                              "id": "2146984173",
                              "name": "setup",
                              "isNode": true,
                              "heightMetricValue": 50.0,
                              "footprintMetricValue": 50.0,
                              "colorMetricValue": 0.0,
                              "parentInfo": {
                                "id": "2146983909",
                                "name": "servlet",
                                "isNode": true,
                                "heightMetricValue": 50.0,
                                "footprintMetricValue": 50.0,
                                "colorMetricValue": 0.0
                              },
                              "children": [
                                {
                                  "id": "2146984174",
                                  "name": "MockMvcBuilders",
                                  "isNode": false,
                                  "heightMetricValue": 50.0,
                                  "footprintMetricValue": 100.0,
                                  "colorMetricValue": 0.0,
                                  "parentInfo": {
                                    "id": "2146984173",
                                    "name": "setup",
                                    "isNode": true,
                                    "heightMetricValue": 50.0,
                                    "footprintMetricValue": 100.0,
                                    "colorMetricValue": 0.0
                                  },
                                  "children": []
                                },
                                {
                                  "id": "2146984167",
                                  "name": "StandaloneMockMvcBuilder",
                                  "isNode": false,
                                  "heightMetricValue": 50.0,
                                  "footprintMetricValue": 100.0,
                                  "colorMetricValue": 0.0,
                                  "parentInfo": {
                                    "id": "2146984173",
                                    "name": "setup",
                                    "isNode": true,
                                    "heightMetricValue": 50.0,
                                    "footprintMetricValue": 100.0,
                                    "colorMetricValue": 0.0
                                  },
                                  "children": []
                                }
                              ]
                            },
                            {
                              "id": "2146984161",
                              "name": "MockMvc",
                              "isNode": false,
                              "heightMetricValue": 50.0,
                              "footprintMetricValue": 100.0,
                              "colorMetricValue": 0.0,
                              "parentInfo": {
                                "id": "2146983909",
                                "name": "servlet",
                                "isNode": true,
                                "heightMetricValue": 50.0,
                                "footprintMetricValue": 100.0,
                                "colorMetricValue": 0.0
                              },
                              "children": []
                            },
                            {
                              "id": "2146984132",
                              "name": "ResultActions",
                              "isNode": false,
                              "heightMetricValue": 50.0,
                              "footprintMetricValue": 100.0,
                              "colorMetricValue": 0.0,
                              "parentInfo": {
                                "id": "2146983909",
                                "name": "servlet",
                                "isNode": true,
                                "heightMetricValue": 50.0,
                                "footprintMetricValue": 100.0,
                                "colorMetricValue": 0.0
                              },
                              "children": []
                            }
                          ]
                        }
                      ]
                    }
                  ]
                },
                {
                  "id": "2146984083",
                  "name": "ui",
                  "isNode": true,
                  "heightMetricValue": 50.0,
                  "footprintMetricValue": 50.0,
                  "colorMetricValue": 0.0,
                  "parentInfo": {
                    "id": "2146983650",
                    "name": "springframework",
                    "isNode": true,
                    "heightMetricValue": 50.0,
                    "footprintMetricValue": 50.0,
                    "colorMetricValue": 0.0
                  },
                  "children": [
                    {
                      "id": "2146984157",
                      "name": "Model",
                      "isNode": false,
                      "heightMetricValue": 50.0,
                      "footprintMetricValue": 100.0,
                      "colorMetricValue": 0.0,
                      "parentInfo": {
                        "id": "2146984083",
                        "name": "ui",
                        "isNode": true,
                        "heightMetricValue": 50.0,
                        "footprintMetricValue": 100.0,
                        "colorMetricValue": 0.0
                      },
                      "children": []
                    },
                    {
                      "id": "2146984080",
                      "name": "ModelMap",
                      "isNode": false,
                      "heightMetricValue": 50.0,
                      "footprintMetricValue": 100.0,
                      "colorMetricValue": 0.0,
                      "parentInfo": {
                        "id": "2146984083",
                        "name": "ui",
                        "isNode": true,
                        "heightMetricValue": 50.0,
                        "footprintMetricValue": 100.0,
                        "colorMetricValue": 0.0
                      },
                      "children": []
                    }
                  ]
                },
                {
                  "id": "2146983786",
                  "name": "util",
                  "isNode": true,
                  "heightMetricValue": 50.0,
                  "footprintMetricValue": 50.0,
                  "colorMetricValue": 0.0,
                  "parentInfo": {
                    "id": "2146983650",
                    "name": "springframework",
                    "isNode": true,
                    "heightMetricValue": 50.0,
                    "footprintMetricValue": 50.0,
                    "colorMetricValue": 0.0
                  },
                  "children": [
                    {
                      "id": "2146983783",
                      "name": "StopWatch",
                      "isNode": false,
                      "heightMetricValue": 50.0,
                      "footprintMetricValue": 4.0,
                      "colorMetricValue": 0.0,
                      "parentInfo": {
                        "id": "2146983786",
                        "name": "util",
                        "isNode": true,
                        "heightMetricValue": 50.0,
                        "footprintMetricValue": 4.0,
                        "colorMetricValue": 0.0
                      },
                      "children": []
                    },
                    {
                      "id": "2146984199",
                      "name": "StringUtils",
                      "isNode": false,
                      "heightMetricValue": 50.0,
                      "footprintMetricValue": 100.0,
                      "colorMetricValue": 0.0,
                      "parentInfo": {
                        "id": "2146983786",
                        "name": "util",
                        "isNode": true,
                        "heightMetricValue": 50.0,
                        "footprintMetricValue": 100.0,
                        "colorMetricValue": 0.0
                      },
                      "children": []
                    }
                  ]
                },
                {
                  "id": "2146983949",
                  "name": "validation",
                  "isNode": true,
                  "heightMetricValue": 50.0,
                  "footprintMetricValue": 50.0,
                  "colorMetricValue": 0.0,
                  "parentInfo": {
                    "id": "2146983650",
                    "name": "springframework",
                    "isNode": true,
                    "heightMetricValue": 50.0,
                    "footprintMetricValue": 50.0,
                    "colorMetricValue": 0.0
                  },
                  "children": [
                    {
                      "id": "2146983950",
                      "name": "beanvalidation",
                      "isNode": true,
                      "heightMetricValue": 50.0,
                      "footprintMetricValue": 50.0,
                      "colorMetricValue": 0.0,
                      "parentInfo": {
                        "id": "2146983949",
                        "name": "validation",
                        "isNode": true,
                        "heightMetricValue": 50.0,
                        "footprintMetricValue": 50.0,
                        "colorMetricValue": 0.0
                      },
                      "children": [
                        {
                          "id": "2146983946",
                          "name": "LocalValidatorFactoryBean",
                          "isNode": false,
                          "heightMetricValue": 50.0,
                          "footprintMetricValue": 2.0,
                          "colorMetricValue": 0.0,
                          "parentInfo": {
                            "id": "2146983950",
                            "name": "beanvalidation",
                            "isNode": true,
                            "heightMetricValue": 50.0,
                            "footprintMetricValue": 2.0,
                            "colorMetricValue": 0.0
                          },
                          "children": []
                        }
                      ]
                    },
                    {
                      "id": "2146983979",
                      "name": "BindingResult",
                      "isNode": false,
                      "heightMetricValue": 50.0,
                      "footprintMetricValue": 2.0,
                      "colorMetricValue": 0.0,
                      "parentInfo": {
                        "id": "2146983949",
                        "name": "validation",
                        "isNode": true,
                        "heightMetricValue": 50.0,
                        "footprintMetricValue": 2.0,
                        "colorMetricValue": 0.0
                      },
                      "children": []
                    },
                    {
                      "id": "2146984208",
                      "name": "Errors",
                      "isNode": false,
                      "heightMetricValue": 50.0,
                      "footprintMetricValue": 100.0,
                      "colorMetricValue": 0.0,
                      "parentInfo": {
                        "id": "2146983949",
                        "name": "validation",
                        "isNode": true,
                        "heightMetricValue": 50.0,
                        "footprintMetricValue": 100.0,
                        "colorMetricValue": 0.0
                      },
                      "children": []
                    }
                  ]
                },
                {
                  "id": "2146983954",
                  "name": "web",
                  "isNode": true,
                  "heightMetricValue": 50.0,
                  "footprintMetricValue": 50.0,
                  "colorMetricValue": 0.0,
                  "parentInfo": {
                    "id": "2146983650",
                    "name": "springframework",
                    "isNode": true,
                    "heightMetricValue": 50.0,
                    "footprintMetricValue": 50.0,
                    "colorMetricValue": 0.0
                  },
                  "children": [
                    {
                      "id": "2146984035",
                      "name": "bind",
                      "isNode": true,
                      "heightMetricValue": 50.0,
                      "footprintMetricValue": 50.0,
                      "colorMetricValue": 0.0,
                      "parentInfo": {
                        "id": "2146983954",
                        "name": "web",
                        "isNode": true,
                        "heightMetricValue": 50.0,
                        "footprintMetricValue": 50.0,
                        "colorMetricValue": 0.0
                      },
                      "children": [
                        {
                          "id": "2146984031",
                          "name": "WebDataBinder",
                          "isNode": false,
                          "heightMetricValue": 50.0,
                          "footprintMetricValue": 2.0,
                          "colorMetricValue": 0.0,
                          "parentInfo": {
                            "id": "2146984035",
                            "name": "bind",
                            "isNode": true,
                            "heightMetricValue": 50.0,
                            "footprintMetricValue": 2.0,
                            "colorMetricValue": 0.0
                          },
                          "children": []
                        }
                      ]
                    },
                    {
                      "id": "2146983955",
                      "name": "servlet",
                      "isNode": true,
                      "heightMetricValue": 50.0,
                      "footprintMetricValue": 50.0,
                      "colorMetricValue": 0.0,
                      "parentInfo": {
                        "id": "2146983954",
                        "name": "web",
                        "isNode": true,
                        "heightMetricValue": 50.0,
                        "footprintMetricValue": 50.0,
                        "colorMetricValue": 0.0
                      },
                      "children": [
                        {
                          "id": "2146983951",
                          "name": "ModelAndView",
                          "isNode": false,
                          "heightMetricValue": 50.0,
                          "footprintMetricValue": 2.0,
                          "colorMetricValue": 0.0,
                          "parentInfo": {
                            "id": "2146983955",
                            "name": "servlet",
                            "isNode": true,
                            "heightMetricValue": 50.0,
                            "footprintMetricValue": 2.0,
                            "colorMetricValue": 0.0
                          },
                          "children": []
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    };

    this.createSampleViewLayout(this.createModel(treeResult));
  }
};

ThreeViewer.FileLoaderController.prototype.createModel = function (treeResult) {
  this.TreeService.setTree(treeResult);

  /* Step 1: Create the Model
   *  - Get Data from DataSource
   *  - Create a Model with the collected Data
   */
  var model = new Softvis3dModel(treeResult);

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
      'house.container': require("../layout/illustrator/container/lightmap.js"),
      'house.distribution': 'left',
      'house.segmentation': 'versions.first'
    }
  };

  var illustrator = new Illustrator(model, options);

  illustrator.addRule(require('../layout/illustrator/rules/loc-to-height.js')());
  illustrator.addRule(require('../layout/illustrator/rules/editor-to-width.js')());
  illustrator.addRule(require('../layout/illustrator/rules/package-to-color.js')());
  illustrator.addRule(require('../layout/illustrator/rules/save-first-version.js')());
  illustrator.addRule(require('../layout/illustrator/rules/opacity-if-not-in-version.js')());

  var versionToDraw = model.versions[1];
  var illustration = illustrator.draw(versionToDraw);

  return illustration;
};

ThreeViewer.FileLoaderController.prototype.createSampleViewLayout = function (illustration) {
  this.ViewerService.loadSoftVis3d(illustration);

  var eventObject = {};
  eventObject.softVis3dId = 1;
  eventObject.metric1Name = "bla";
  eventObject.metric2Name = "bla2";
  eventObject.scmMetricName = "bla3";

  this.MessageBus.trigger('visualizationReady', eventObject);

  this.infoInnerState = "idle";
  this.showTab("example");

  this.MessageBus.trigger('hideLoader');
};

ThreeViewer.FileLoaderController.prototype.listeners = function () {
  this.scope.$on('appReady', function () {
    console.log("app ready");
  }.bind(this));
};

/**
 * Toggles the selected tab
 * @export
 * @param {!string} tab
 */
ThreeViewer.FileLoaderController.prototype.showTab = function (tab) {
  this.state.examples = false;
  this.state.neo = false;
  this.state.info = false;
  this.state[tab] = true;
};

ThreeViewer.FileLoaderController.prototype.loadExampleVisualization = function () {
  var me = this;

  this.infoInnerState = "loading";
  this.showTab("info");
  this.BackendService.getExamleVisualization().then(function (response) {
    me.processSuccessResponse(response);
  }, function (response) {
    me.processErrorResponse(response);
  });
};

ThreeViewer.FileLoaderController.prototype.loadStaticVisualization = function () {
  var me = this;

  this.infoInnerState = "loading";
  this.showTab("info");
  this.BackendService.getStaticVisualization().then(function (response) {
    me.processSuccessResponse(response);
  }, function (response) {
    me.processErrorResponse(response);
  });
};

ThreeViewer.FileLoaderController.prototype.loadDynamicVisualization = function () {
  var me = this;

  this.infoInnerState = "loading";
  this.showTab("info");
  this.BackendService.getDynamicVisualization(this.dynamicNeoQuery).then(function (response) {
    me.processSuccessResponse(response);
  }, function (response) {
    me.processErrorResponse(response);
  });
};

ThreeViewer.FileLoaderController.prototype.processErrorResponse = function (response) {
  this.infoInnerState = "error";
  this.exceptionMessage = response.data.errors[0].msg;
  this.showTab("info");
};

ThreeViewer.FileLoaderController.prototype.processSuccessResponse = function (response) {
  var treeResult = response.data.resultObject[0].treeResult;

  this.createSampleViewLayout(treeResult);
};
