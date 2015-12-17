package de.rinderle.softvis3d.neo;

import com.sun.jersey.api.client.Client;
import com.sun.jersey.api.client.ClientResponse;
import com.sun.jersey.api.client.WebResource;
import javax.ws.rs.core.MediaType;

/**
 * Created by stefanrinderle on 14.12.15.
 */
public class Neo4jClient {

  private static final String SERVER_ROOT_URI = "http://localhost:7474/";

  public String test() {
    return sendCypher(getExampleCypher());
  }

  private String sendCypher(final String query) {
    final String txUri = SERVER_ROOT_URI + "db/data/transaction/commit";
    WebResource resource = Client.create().resource(txUri);

    String payload = "{\"statements\" : [ {\"statement\" : \"" + query + "\"} ]}";
    ClientResponse response = resource
      .accept(MediaType.APPLICATION_JSON)
      .type(MediaType.APPLICATION_JSON)
      .entity(payload)
      .post(ClientResponse.class);

    String result = response.getEntity(String.class);

    response.close();

    return result;
  }

  public String getExampleCypher() {
    return "MATCH" +
      "  (t:Type)-[:DECLARES]->(m:Method)" +
      " RETURN" +
      "  t.fqn AS Type, count(t) AS DeclaredMethods";
  }
}
