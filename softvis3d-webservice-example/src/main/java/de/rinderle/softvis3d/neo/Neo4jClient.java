/*
 * softvis3d-webservice-example
 * Copyright (C) 2015 Stefan Rinderle
 * stefan@rinderle.info
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02
 */
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
    final WebResource resource = Client.create().resource(txUri);

    final String payload = "{\"statements\" : [ {\"statement\" : \"" + query + "\"} ]}";
    final ClientResponse response = resource
      .accept(MediaType.APPLICATION_JSON)
      .type(MediaType.APPLICATION_JSON)
      .entity(payload)
      .post(ClientResponse.class);

    final String result = response.getEntity(String.class);

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
