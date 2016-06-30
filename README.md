# SoftVis3D project

Software visualization for your source code. Project page [http://softvis3d.com](http://softvis3d.com).

Currently, the main project is the SoftVis3D-SonarQube-Plugin - see the corresponding module for further details.

# Modules

We are currently workong on a refactoring of the whole visualization project with two main goals:
* Get rid of the graphviz backend dependency and create the layout in the frontend
* Refactor the frontend code structure

Please take a look at the github issues page for details.

## Base

Base java classes used by the visualization - independent from SonarQube.

## Layout webservice example

### ! Currently not maintained and does not work !

Will be reactivated and refactored to the new structure with [https://github.com/stefanrinderle/softvis3d/issues/15](github issue #15)

### Description / Goal

This is a example project to show the use of the softvis3d visualization with other tools than SonarQube.

Implemented example is based on dynamic neo4j requests.

For details, see README file of the module. 

## SoftVis3d SonarQube plugin

See module for details.

## License

GNU LESSER GENERAL PUBLIC LICENSE Version 3

# TravisCI status

[![Build Status](https://travis-ci.org/stefanrinderle/softvis3d.svg?branch=master)](https://travis-ci.org/stefanrinderle/softvis3d)