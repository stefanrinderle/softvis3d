# SoftVis3D - Software visualization in 3D

Visualize your project in SonarQube. Please take a look at http://softvis3d.com for further details, screenshots and live demo.

## SonarQube version matrix

| 4.2  | 4.3 | 4.4 | 4.5 | 4.5.1 and follow <br> minor versions | 5.0 | 5.1 | 5.1.1 and follow <br> minor versions | 5.2 | 
| ---- | --- | --- | --- | ------------------------------- | --- | --- | ------------------------------- | --- | 
| OK   | OK  | OK  | Not working<br>([SONAR-5699](https://jira.codehaus.org/browse/SONAR-5699)) | OK  | OK | Not working<br>[SONAR-6425](https://jira.codehaus.org/browse/SONAR-6425) | OK | Not working<br>[See my blog <br> for details](http://softvis3d.com/#/blog)|  

##License

Licensed under the GNU Lesser General Public License, Version 3.0: http://www.gnu.org/licenses/lgpl.txt

## Benefits

- Two different views: city and dependency
- Any metric from SonarSource can be used
- Easily navigate through the 3D visualisation
- WebGL technology to support all browsers
- Helps you analyze your software quality easily

## Code city

The "code city" view provides a visualization for the hierarchical structure of the project. Folders or packages are shown as districts, files as buildings. The building footprint and height are dependent on two arbitrary sonar metrics.

## Dependency view

This view is focused on the dependencies within the given structure. The basic 3D layout for the structure is build downwards. The dependencies have been aggregated and can be explored easily without overloading the visualisation.

## Requirenments

SoftVis3DPlugin requires the graphviz software to be installed. It should be easily available for your linux or windows server instance. Please take a look at graphviz install page (http://www.graphviz.org/Download.php) for details.

## Install

1. Install Graphiz (http://www.graphviz.org/Download.php)
2. Download plugin jar file (http://softvis3d.com/#/download)
3. Copy to [your SonarQube base path]/extensions/downloads
4. Restart your sonar server
5. Go to SonarQube "Settings" -> "System" -> "General settings" -> "Softviz3d" and define the path to your graphviz installation.
6. On any project in your SonarQube instance, click on "SoftVis3D Viewer" in the navigation section on the left.

Explore your project in 3D city and dependency view!