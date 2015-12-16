package de.rinderle.softvis3d.neoresult;

import java.util.List;

/**
 * Created by stefanrinderle on 14.12.15.
 */
public class Results {

  private List<String> columns;

  private List<Data> data;

  public List<String> getColumns() {
    return columns;
  }

  public List<Data> getData() {
    return data;
  }

  @Override
  public String toString() {
    return "Results{" +
        "columns=" + columns +
        ", data=" + data +
        '}';
  }
}
