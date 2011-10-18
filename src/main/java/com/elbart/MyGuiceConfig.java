package com.elbart;

import com.sun.jersey.guice.JerseyServletModule;
import com.sun.jersey.guice.spi.container.servlet.GuiceContainer;

public class MyGuiceConfig extends JerseyServletModule {

    @Override
    protected void configureServlets() {
        bind(GuiceResource.class);

        serve("/*").with(GuiceContainer.class);
    }
}
