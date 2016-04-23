# SoftVis3D - Software visualization in 3D

Visualize your project in SonarQube. Please take a look at http://softvis3d.com for further details, screenshots and live demo.

## SonarQube version info

This version of the plugin works with SonarQube version >= 5.5. If you're lookking for the old LTS version plugin for SonarQube 4.2 - 5.1.x, please visit the old git repo [here - SoftVis3D 0.3.x](https://github.com/stefanrinderle/sonar-softvis3d-plugin).

##License

Licensed under the GNU Lesser General Public License, Version 3.0: http://www.gnu.org/licenses/lgpl.txt

## Benefits

- Any metric from SonarSource can be used
- Easily navigate through the 3D visualisation
- WebGL technology to support all browsers
- Helps you analyze your software quality easily

## Code city

The "code city" view provides a visualization for the hierarchical structure of the project. Folders or packages are shown as districts, files as buildings. The building footprint and height are dependent on two arbitrary sonar metrics.

## Requirenments

### SonarQube 5.5

### graphviz

SoftVis3DPlugin requires the graphviz software to be installed. It should be easily available for your linux or windows server instance. Please take a look at graphviz install page (http://www.graphviz.org/Download.php) for details.

### Java 7 runtime required

## Install

1. Install Graphiz (http://www.graphviz.org/Download.php)
2. Download plugin jar file (http://softvis3d.com/#/download)
3. Copy to [your SonarQube base path]/extensions/downloads
4. Restart your sonar server
5. Go to SonarQube "Settings" -> "System" -> "General settings" -> "SoftVis3d" and define the path to your graphviz installation.
6. On any project in your SonarQube instance, click on "SoftVis3D Viewer" in the navigation section on the left.

Explore your project in 3D city  view!
