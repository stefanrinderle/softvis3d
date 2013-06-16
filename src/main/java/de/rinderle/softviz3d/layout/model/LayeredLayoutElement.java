package de.rinderle.softviz3d.layout.model;

public class LayeredLayoutElement {

	public enum Type {
		NODE, LEAF 
	}
	
	private Type type;
	
	private Integer id;
	
	private String name;
	
	private Double width;
	private Double height;
	
	public LayeredLayoutElement(Type type, Integer id, String name, Double width, Double height) {
		super();
		this.type = type;
		this.id = id;
		this.name = name;
		this.width = width;
		this.height = height;
	}
	
	public Type getElementType() {
		return this.type;
	}
	
	public Integer getId() {
		return id;
	}
	
	public String getName() {
		return this.name;
	}
	
	public Double getWidth() {
		return width;
	}

	public Double getHeight() {
		return height;
	}

	@Override
	public String toString() {
		return "InputElement [type=" + type + ", identifier=" + name
				+ ", id=" + id + ", width=" + width
				+ ", height=" + height + "]";
	}

	
}
