sonar-softviz3d-plugin
=========================

3d visualization for projects in Sonar

This project is based on my master thesis at NICTA in Sydney 2012 ([Project page](http://softviz3d.rinderle.info/index.php?r=site/index))

### Current status:

 - **The Alpha release is not ready yet.** In addition, I will be on vacation in July. Further work will be done in august.
 - But it works (see known defects and issues) basically.

Compiling and Installing the plugin:
---------------------------------------

### Dependency to Graphviz:

 - This plugin needs the dot executable out of the graphviz package in order to calculate the layouts. 
 - Install the graphviz package on the same machine as your sonar installation (http://www.graphviz.org/)

### Compile and install

 - Install maven
 - Clone the repository
 - Compile the code, then generate the jar: 
   -> run "mvn clean install" command in your terminal
 - copy the jar (in the new generated target folder) in <path_to_your_sonar_install>/extensions/plugins folder,
 - restart sonar

### Settings

 - Set the path to the dot executable in Settings -> System -> General settings -> Softviz3d

Known Defects and issues
---------------------------------------
 - You have to move the camera (mouse interaction) to view the visualization in the first step
 - Some selectable metrics causes errors (i.e. Complexity / Class)
 - It seems like there is only one depth in the visualization


Roadmap
---------------------------------------

### Alpha release

This will be the first release, tested by a small group of friendly developers.

 - (done) Metrics are selectable within the visualization window
 - Only metrics with available values for that snapshot are selectable (file metrics)
 - Select objects (buildings) and show details about it

### Beta release

Accessible for anybody who is interested.

 - Align development to the sonarsource coding guidelines
 - Refactor JS and ruby template code
 - Catch exeptions and display error messages for
   - Dot executable not accessible
   - Dot parser error
   - Database exeption

### First minor release - 0.1

Sonar update center release

 - Integrate plugin in the sonarsource environment (Jira, Cloudbees, Nemo, Wiki)

### Future releases

 - Show dependencies as explained [here](http://softviz3d.rinderle.info/index.php?r=site/page&view=dependencies)
 - Release dependency on graphviz layout package (check GraphStream API as replacement)
