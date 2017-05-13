# SoftVis3D - Software visualization in 3D

Visualize your project in SonarQube. Please take a look at [softvis3d.com](http://softvis3d.com) for further details, screenshots and a live demo.

## Version overview

### Plugin version 0.3.x

* Github repository [here - SoftVis3D 0.3.x](https://github.com/stefanrinderle/sonar-softvis3d-plugin)
* Needs graphviz to be installed on the server
* Works with SonarQube <= 5.2

### Plugin version 0.4.x

* Needs graphviz to be installed on the server
* Works with SonarQube >= 5.5

### Plugin version 0.5.x (current development)

* Does **NOT** require graphviz to be installed on the server
* New frontend layout
* Works with SonarQube >= 5.5

##License

Licensed under the GNU Lesser General Public License, Version 3.0: http://www.gnu.org/licenses/lgpl.txt

## Benefits

- Any metric from SonarSource can be used
- Easily navigate through the 3D visualisation
- WebGL technology to support all browsers
- Helps you analyse your software quality easily

## Code city layout

The "code city" view provides a visualization for the hierarchical structure of the project. Folders or packages are shown as districts, files as buildings. The building footprint and height are dependent on two arbitrary sonar metrics.

## Evostreets layout

Evostreet is a stable layout for visualizing evolving software systems using the city metaphor.

## Requirements

* SonarQube >= 5.5
* Java 7 runtime required

## Install

1. Download plugin jar file (http://softvis3d.com/#/download)
2. Copy to [your SonarQube base path]/extensions/downloads
3. Restart your sonar server
4. On any project in your SonarQube instance, click on "SoftVis3D Viewer" in the navigation section on the left.

Explore your project in 3D!
