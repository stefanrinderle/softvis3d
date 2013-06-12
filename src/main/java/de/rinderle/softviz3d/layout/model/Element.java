package de.rinderle.softviz3d.layout.model;

public class Element {

	private String identifier;
	
	private Double posX;
	private Double posY;
	private Double width;
	private Double height;
	
	public Element(String identifier, Double width, Double height) {
		super();
		this.identifier = identifier;
		this.width = width;
		this.height = height;
	}
	
	public String getIdentifier() {
		return this.identifier;
	}
	
	public Double getWidth() {
		return width;
	}

	public Double getHeight() {
		return height;
	}
	
	public Double getPosX() {
		return posX;
	}

	public Double getPosY() {
		return posY;
	}

	public void setPosX(Double posX) {
		this.posX = posX;
	}

	public void setPosY(Double posY) {
		this.posY = posY;
	}

	@Override
	public String toString() {
		return "Element [posX=" + posX + ", posY=" + posY + ", width=" + width
				+ ", height=" + height + "]";
	}
	
}
