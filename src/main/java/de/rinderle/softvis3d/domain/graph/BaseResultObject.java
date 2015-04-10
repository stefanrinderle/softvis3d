/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 - Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
package de.rinderle.softvis3d.domain.graph;

import de.rinderle.softvis3d.layout.helper.HexaColor;

public abstract class BaseResultObject {

    private double opacity;
    private int height3d;
    private HexaColor color;

    public double getOpacity() {
        return opacity;
    }

    public void setOpacity(double opacity) {
        this.opacity = opacity;
    }

    /**
     * called from view.
     */
    public int getHeight3d() {
        return height3d;
    }

    /**
     * String name for y axis in 3d.
     *
     * I(y) I I ---------- (x) / / (z)
     */
    public void setHeight3d(int height3d) {
        this.height3d = height3d;
    }

    /**
     * Used in view.
     */
    public HexaColor getColor() {
        return color;
    }

    public void setColor(final HexaColor color) {
        this.color = color;
    }

}
