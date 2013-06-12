/*
 *  This software may only be used by you under license from AT&T Corp.
 *  ("AT&T").  A copy of AT&T's Source Code Agreement is available at
 *  AT&T's Internet website having the URL:
 *  <http://www.research.att.com/sw/tools/graphviz/license/source.html>
 *  If you received this software without first entering into a license
 *  with AT&T, you have an infringing copy of this software and cannot use
 *  it without violating AT&T's intellectual property rights.
 */
package att.grappa;

import java.util.Iterator;

/**
 * An extension of the Iterator interface specific to iteration of
 * graph elements.
 *
 * @version 1.2, ; Copyright 1996 - 2010 by AT&T Corp.
 * @author  <a href="mailto:john@research.att.com">John Mocenigo</a>, <a href="http://www.research.att.com">Research @ AT&T Labs</a>
 */
public interface GraphIterator extends Iterator
{
  /**
   * Get the root of this Iterator.
   *
   * @return the root subgraph for this Iterator
   */
  public Subgraph getSubgraphRoot();

  /**
   * Get the types of elements possibly contained in this Iterator.
   *
   * @return an indication of the types of elements in this Iterator
   * @see GrappaConstants#NODE
   * @see GrappaConstants#EDGE
   * @see GrappaConstants#SUBGRAPH
   */
  public int getIterationTypes();

  /**
   * A convenience method that should just return a cast
   * of a call to nextElement()
   *
   * @return the next graph element in the Iterator
   * @exception java.util.NoSuchElementException whenever the Iterator has no more
   *                                   elements.
   */
  public Element nextGraphElement() throws java.util.NoSuchElementException;
}
