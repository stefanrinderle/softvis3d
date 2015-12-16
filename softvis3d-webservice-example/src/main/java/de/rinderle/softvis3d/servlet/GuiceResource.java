package de.rinderle.softvis3d.servlet;

import com.google.gson.Gson;
import com.google.inject.Inject;
import com.google.inject.servlet.RequestScoped;
import de.rinderle.softvis3d.base.domain.graph.ResultPlatform;
import de.rinderle.softvis3d.service.LayoutExampleService;
import de.rinderle.softvis3d.service.NeoService;
import java.util.Map;
import javax.ws.rs.GET;
import javax.ws.rs.OPTIONS;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

@Path("/")
@RequestScoped
public class GuiceResource {

  @Inject
  private NeoService neoService;
  @Inject
  private LayoutExampleService layoutExampleService;

  @GET
  @Path("/example")
  @Produces(MediaType.APPLICATION_JSON)
  public String getExample() {

    final Map<Integer, ResultPlatform> result;
    try {
      result = layoutExampleService.getExampleResult();
      return new Gson().toJson(result);
    } catch (Exception e) {
      return new Gson().toJson(e);
    }

  }

  @GET
  @Path("/neo")
  @Produces(MediaType.APPLICATION_JSON)
  public String getNeo() {
    final Map<Integer, ResultPlatform> result;
    try {
      result = neoService.getNeoResult();
      return new Gson().toJson(result);
    } catch (Exception e) {
      return new Gson().toJson(e);
    }

  }

  @OPTIONS
  @Path("/example")
  @Produces(MediaType.APPLICATION_XML)
  public String getSupportedOperations() {
    return "<operations>GET, POST</operations>";
  }

}
