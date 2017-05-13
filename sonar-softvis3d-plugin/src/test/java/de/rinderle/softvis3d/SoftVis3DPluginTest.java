package de.rinderle.softvis3d;

import org.junit.Test;
import org.sonar.api.Plugin;

import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

public class SoftVis3DPluginTest {

    @Test
    public void define() {
        final SoftVis3DPlugin underTest = new SoftVis3DPlugin();

        final Plugin.Context context = mock(Plugin.Context.class);
        underTest.define(context);

        verify(context).addExtension(eq(SoftVis3DPageDefinition.class));
    }

}