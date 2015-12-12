package de.rinderle.softvis3d.servlet;

import com.sun.jersey.guice.JerseyServletModule;
import com.sun.jersey.guice.spi.container.servlet.GuiceContainer;

public class SoftVis3DConfig extends JerseyServletModule {

    @Override
    protected void configureServlets() {
        bind(GuiceResource.class);

        serve("/*").with(GuiceContainer.class);
    }
}
