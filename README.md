# @Deprecated

I have decided to stop any work on this project. 
Although all used components are open source, it is difficult 
to get the required data out of the projects.

I will continue my work on 3d software visualization with
a plugin for sonar, which hopefully will do the same as this one.
The crucial advantage is that sonar is used by a lot of people and
also can also deliver all required data.

[Sonar plugin](https://github.com/stefanrinderle/sonar-softviz3d)

## Welcome!

First of all: Visit the project website: http://softviz3d.rinderle.info/

This project started as a master thesis as the National ICT Australia in Sydney. 
Thanks to Franck Cassez and Ralf Huuck for the help during the thesis.

## Installation instructions

### Requirenments:

* Apache Web Server
* MySQL database
* GraphViz package installed (see http://www.graphviz.org/ for further information)
* Optional: PHP_LexerGenerator (pear install PHP_LexerGenerator)

### Get it on :-)

* Get the source code from github: https://github.com/stefanrinderle/DaSViz3d
* Set access rights ./permissionScript.sh
* adjust configuration file in protected/config/main.php
  - Set db connection settings (param array db)
  - Params: 'params'=>array(...)
    - Set dot excecution file in (dotFolder)
    
    
* Import database schema (File schema.sql)
* Install PEAR and Image_GraphViz
  - apt-get install php-pear
  - pear install Image_GraphViz

* Thats it.

### Title: 3D visualization of software structures and dependencies

### Abstract

Software systems are complex, intangible structures, which are hard to understand.
Therefore, visualization of software properties, structure and dependencies
in different views play an important role within the lifecycle of a software system.
Adding a third dimension to the visualization provides new opportunities by the
technical progress of the last year. The software visualization research community
has developed a suite of useful and promising tools. But most of them are not available,
based on obsolete technologies or they require a huge effort to install.
This work presents a tool for 3D visualization of software structures and dependencies
that can be integrated in the software development process. The main
challenge was to and an appropriate representation and layout mechanism for hierarchical
structures including dependencies. The analysis of the existing tools has
shown that the visualization should be platform and language-independent, based
on standard technologies and provide a well-defined input format. One key solution
to meet this requirements is the web-based approach to generate and display 3D
representations of software structures using X3DOM.
The dependency view shows a new approach for visualizing dependencies within
the hierarchical structure of the project. The analysis and subsequent classification
of the input dependencies allows a fine-grained representation. This leads to a clear
overview even for large-scale projects and will help to understand the structure
and dependencies of software for reuse, maintenance, re-engineering and reverse engineering.  