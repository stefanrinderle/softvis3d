package de.rinderle.softviz3d.layout.model;

public class X3dBoxElement {
	private String id;
	
	private Integer snapshotId;
	
	// format: [x] [y] [z]
	private double [] translation;
	
	// format: [r] [g] [b]
	// float between 0 and 1
	private double [] color;
	
	// float between 0 and 1
	private double transparency;
	
	/**
	 * 2D rectangle only width and length
	 * format: [width] [length]
	 * others width, length, height
	 * format: [width] [length] [height]
	 */
	private double [] size;

	
	
	public X3dBoxElement(String id, Integer snapshotId, double[] translation,
			double[] color, double transparency, double[] size) {
		super();
		this.id = id;
		this.snapshotId = snapshotId;
		this.translation = translation;
		this.color = color;
		this.transparency = transparency;
		this.size = size;
	}

	public String getId() {
		return id;
	}

	public Integer getSnapshotId() {
		return snapshotId;
	}

	public double[] getTranslation() {
		return translation;
	}

	public double[] getColor() {
		return color;
	}

	public double getTransparency() {
		return transparency;
	}

	public double[] getSize() {
		return size;
	}

}
