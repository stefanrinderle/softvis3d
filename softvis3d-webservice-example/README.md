# SoftVis3D - Webservice example package

This is a example project to show the use of the softvis3d visualization with other tools than SonarQube.

### ! Currently not maintained and does not work !

Will be reactivated and refactored to the new structure with [https://github.com/stefanrinderle/softvis3d/issues/15](github issue #15)

## Build and run

mvn clean install -pl softvis3d-webservice-example/ -am

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

Steps to reproduce (like i did it):

* Clone https://github.com/buschmais/spring-petclinic.git (jqassistant example project)
* mvn clean install on that project
* mvn jqassistant:server --> neo4j server runs at http://localhost:7474/

The following cypher query is used as example and can be changed using the text box:

MATCH (t:Type)-[:DECLARES]->(m:Method) RETURN t.fqn AS Type, count(t) AS DeclaredMethods

But it should work for any other neo4j server / project as long as the given cypher query returns any results.

A row of the query result must contain the following columns:

1. Building: The name of the building (e.g. a class name)
2. Hierarchy (optional): Array of names representing the path to the building (e.g. package hierarchy containing the class)
3. Height: Integer value representing the height of the building (e.g. the count of declared methods of the class)

"MATCH ... RETURN ... as Building, ... as Hierarchy, ... as Height"
