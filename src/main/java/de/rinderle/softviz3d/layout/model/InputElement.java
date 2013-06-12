package de.rinderle.softviz3d.layout.model;

public class InputElement {

	private InputElementType type;
	
	private String identifier;
	
	private Integer snapshotId;
	
	private Double width;
	private Double height;
	
	public InputElement(InputElementType type, String identifier, Integer snapshotId, Double width, Double height) {
		super();
		this.type = type;
		this.identifier = identifier;
		this.snapshotId = snapshotId;
		this.width = width;
		this.height = height;
	}
	
	public InputElementType getElementType() {
		return this.type;
	}
	
	public String getIdentifier() {
		return this.identifier;
	}
	
	public Integer getSnapshotId() {
		return snapshotId;
	}
	
	public Double getWidth() {
		return width;
	}

	public Double getHeight() {
		return height;
	}

	@Override
	public String toString() {
		return "InputElement [type=" + type + ", identifier=" + identifier
				+ ", snapshotId=" + snapshotId + ", width=" + width
				+ ", height=" + height + "]";
	}

}
