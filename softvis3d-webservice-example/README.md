# SoftVis3D - Webservice example package

This is a example project to show the use of the softvis3d visualization with other tools than SonarQube.

## Build and run

Run with embedded jetty: mvn jetty:run

Goto: http://localhost:9999

## Options for the view

You have 2 options currently - the view is unfortunately still a hack.

First one is based the neostatic, second on the neo webservice endpoint (see below). 

## Webservice endponts

### /api/example

Returns a static example layout structure with 2 nodes. 

### /api/neostatic

Returns a static example layout based on a results from neo4j api.

### /api/neoDynamic

Returns a layout based on a query against a neo4j api endpoint.

Steps to reproduce (like i did it: 

* Clone https://github.com/buschmais/spring-petclinic.git (jqassistant example project)
* mvn clean install on that project
* mvn jqassistant:server --> neo4j server runs at http://localhost:7474/

The following cypher query is used as example and can be changed using the text box:

MATCH (t:Type)-[:DECLARES]->(m:Method) RETURN t.fqn AS Type, count(t) AS DeclaredMethods

But it should work for any other neo4j server / project as long as the given cypher query returns any results.

## TODOs

### Java code

* VisualizationAdditionalInfos created in NeoService are static. They should be based on the result tree.
* Refactor package struture
* PathWalker is nearly a duplicate from the one in the softvis-sonarqube-plugin module - generalize and move to base
* TreeNodeJsonWriter and VisualizationJsonWriter are copies of the one in the softvis-sonarqube-plugin module because of the sonar 
JsonWriter class. This cannot be reused currently because all other modules should not be dependent on any sonarqube package. 
They have to be rewritten - best would be to use google gson for that instead of the JsonWriter from sonar.
   
### Frontent code
   
The view code is just a copy from the softvis-sonarqube-plugin module with some little changes regarding static file paths and backend endpoints.

* Move more frontend code out of the softvis-sonarqube-plugin module and add it to the modules via maven resources plugin.
