package de.rinderle.softvis3d.neo;

import com.google.gson.Gson;
import de.rinderle.softvis3d.neoresult.Neo4jAnswer;

/**
 * Created by stefanrinderle on 15.12.15.
 */
public class Neo4jParser {

  public Neo4jAnswer parseNeoJson(final String neoJson) {
    Gson gson = new Gson();
    return gson.fromJson(neoJson, Neo4jAnswer.class);
  }
}
