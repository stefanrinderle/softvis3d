# Creating a City
As there are many different approaches to Code Citys, any of them can be implemented as long as the model supports all the required information.

# Illustrator

## Evostreets
The main focus of the [Evostreet][ConsitentCitiesPaper] approach is long term consistency. All features introduced in the paper are implemented, but as many of these also increase the complexity and impair the general view, they can be configured and disabled (in the StreetContainer).

 * `highway.length` _(Default: `36`)_ <br />
    Length of the main highway in pixels
 * `highway.color` _(Default: `0x156289`)_ <br />
    Color of the main highway in rgb
 * `street.length` _(Default: `18`)_ <br />
    Length of the the roads in pixels
 * `street.color` _(Default: `0x156289`)_ <br />
    Color of the the roads in rgb
 * `house.length` _(Default: `16`)_ <br />
    Length of the the houses in pixels
 * `house.width` _(Default: `16`)_ <br />
    Length of the the houses in pixels
 * `house.height` _(Default: `16`)_ <br />
    Length of the the houses in pixels
 * `house.margin` _(Default: `3`)_ <br />
    Margin around houses in pixels
 * `house.color` _(Default: `0x1A212E`)_ <br />
    Color of the the houses in rgb
 * `evostreet.container` _(Default: `StreetContainer`)_ <br />
    The container to be used. One container will be created for every level of the tree
 * `evostreet.options` _(Default: `{}`)_ <br />
    Every options for every container-instance


## Districts
> Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

# Container
Container-Overview

## Universal Container

### Row
Arranges every shape along the x-axis in the exact order, they were added to the row.
Can be mirrored along the x-axis, so the shapes are *below* the axis. If the container should be mirrored, the `mirrored` flag needs to be `true` on initialisation.

### Grid
Arranges the shapes in a rectangle with the as introduced in the [Strip Treemap Approach][StripTreemaps]. The input order is not changed, therefore it's use of available space can be subpar.
an be mirrored along the x-axis, so the shapes are *below* the axis. If the container should be mirrored, the `mirrored` flag needs to be `true` on initialisation.

### Lightmap
The Lightmap-Approach aims to create a small rectangle with the best aspect ratio, filled with all the shapes. It was introduced to code cities by [Richard Wettel][WettelPub] These shapes will be sorted, so consistency can not be guaranteed.

------------------------

## Layout specific container

### StreetContainer
Evostreet-Container accepts:
 * 1 `Street`-Shape
 * `House`-Shapes
 * `StreetContainer`

<br />

A Single container represents a non-leaf node of the models structure-tree: The node itself is represented by the street, it's children are the houses and container (or the other branching streets). Houses and branches can be configured similarly:
 * `house.container` / `branch.container` _(Default: `RowContainer`)_ <br />
   Houses and branches are not drawn directly, they are first stored in a container. This allows for a configurable positioning of every street-component.
 * `house.distribution` / `branch.distribution` _(Default: `'default'`)_ <br />
   House- and branches-container will be placed on either side of the road, but how the shapes are distributed to these can be configured:
    * `'default'`: Place the shapes alternating into the left and right container
    * `'left'`: Place all shapes in the left container
    * `'right'`: Place all shapes in the right container
    * `function(shape) { return shape.attribute; }`: Place the shapes into the left and right container, alternating by given attribute-order
 * `house.segmentation` / `branch.segmentation` _(Default: `null`)_ <br />
   You are not limited to one element-container on each side of the road. If you want to devide your branches or houses into different segments along the road, just give the desired shape-attribute and a new container will be created for every distinct value.
 * `house.segmentorder` / `branch.segmentorder` _(Default: `null`)_ <br />
   By default the segment-containers are sorted by the shapes value (beginning with the smallest). This can be changed by suppling an alternative [compareFunction][JSCompare].
 * `spacer`
   * `spacer.initial` _(Default: `15`)_ <br />
     Initial Space, before any element/container will be positioned.
   * `spacer.branches` _(Default: `10`)_ <br />
     Don't line branches together, but let them breath
   * `spacer.terranullius` _(Default: `20`)_ <br />
     Space between the last branch- and the first house-container
   * `spacer.conclusive` _(Default: `0`)_ <br />
     Space after the last drawn container at the end of the road


### DistrictContainer
> Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

[//]: #
   [ConsitentCitiesPaper]: <https://opus4.kobv.de/opus4-btu/frontdoor/index/index/docId/1681>
   [StripTreemaps]: <http://hcil2.cs.umd.edu/trs/2001-18/2001-18.html>
   [WettelPub]: <http://wettel.github.io/publications.html>
   [JSCompare]: <http://www.w3schools.com/jsref/jsref_sort.asp>
