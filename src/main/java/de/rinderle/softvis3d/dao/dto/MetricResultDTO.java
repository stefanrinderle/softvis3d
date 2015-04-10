/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 - Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
package de.rinderle.softvis3d.dao.dto;

public class MetricResultDTO<K> {

    private final int id;
    private final K value;

    public MetricResultDTO(int id, K value) {
        this.id = id;
        this.value = value;
    }

    public int getId() {
        return id;
    }

    public K getValue() {
        return value;
    }
}
