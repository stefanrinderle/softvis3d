package com.elbart;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;

import com.google.inject.servlet.RequestScoped;

@Path("/job")
@RequestScoped
public class GuiceResource {

    @QueryParam("x")
    String x;

    @GET
    @Produces("text/plain")
    public String getIt() {
        return "Hello From Guice: " + x;
    }
}
