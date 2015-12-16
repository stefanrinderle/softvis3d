package de.rinderle.softvis3d.neoresult;

import java.util.List;

/**
 * Created by stefanrinderle on 14.12.15.
 */
public class Neo4jAnswer {

  private List<Results> results;

  public List<Results> getResults() {
    return results;
  }

  @Override
  public String toString() {
    return "Neo4jAnswer{" +
        "results=" + results +
        '}';
  }
}
