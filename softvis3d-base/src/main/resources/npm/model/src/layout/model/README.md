# A Model for Evolving Software Systems
For the independent representation of the Attributes and Structure of the Software, the '_Model for Evolving Software Systems_' is used.
It was introduced in "Consistent Software Cities" by Frank Steinbrückner in 2012. [Source][ConsitentCitiesPaper]

## Short Explanation
The Model consists of the 5-tuple _(G, T, R, fe, A)_.
 * G  = Directed Graph (representing the dependencies/relationship between classes)
 * T  = Hierarchy Tree (representing the containment hierarchy of packages and classes)
 * R  = Ordered List of available software versions
 * fe = A function, confirming the existence of a node in a version (or its absence)
 * A  = Property function (Maps the properties of a node to a version)


# Representation in CCV
Since this academic Model is still quite abstract, it needs to be augment for it's usage. All functions accept the key, as well as the complete object, if a Node or Version is requested.
For a simple Example see the [DummyModel][ZooExample].

## Directed Graph (G)
A List of the graphs edges (Software Dependencies).
```JS
model.graph = [
  new Dependency('node1key', 'node2key'),
  new Dependency('node1key', 'node3key')
]
```
> Please note: Every node (target or source) has to be a leaf node in the Tree (T)

## Hierarchy Tree (T)
A Tree, consisting of [TreeNode][TreeNodeFile]-Objects. The Elements of the software are only represented by their identifiers (or keys).

 * The Root-Node embodies the complete Software
 * Subsequent (non-leaf) Nodes represent Packages of the Software
 * Leaf-Nodes represent Classes
```JS
var rootNode = new TreeNode('root');
rootNode.add('child1');
model.tree = rootNode;
```

## List of Software-Versions (R)
An ordered List of all Versions. A Version consists of an unique `key`, it's `label` and the order-value.
```JS
model.versions = [
  new Version('hashV1key', 'v0.1', 1462060800), // Created on 2016-05-01 (Timestamp)
  new Version('hashV2key', 'v0.2', 1463216400)  // Created on 2016-05-14 (Timestamp)
]
```

## Existence Function (fe)
A Function, taking node-object and version-object as parameters. It will return a boolean value:
```JS
model.exists(node2, version1); // returns false
model.exists(node2, version2); // returns true 
// because node2 as added in Version 2
```

## Property function (A)
A Function, mapping the node-object and the version-object to the nodes attributes in the version.
```JS
model.attributes(node2, version1); // returns null
model.attributes(node2, version2); // Returns an Attribute Object
```


# Model Extension in CCV
```
@TODO
 * Liste für Messungen/Attribute + Label
 * Welche Messungen/Attribute sind Pflicht?
 * Prüfen: Kann die Visualisierung "unabhängig" mit den restlichen Attributen arbeiten?
```

[//]: #
   [ConsitentCitiesPaper]: <https://opus4.kobv.de/opus4-btu/frontdoor/index/index/docId/1681>
   [TreeNodeFile]: <components/treenode.js>
   [ZooExample]: <dummy.js>
