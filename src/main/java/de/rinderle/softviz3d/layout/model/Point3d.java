package de.rinderle.softviz3d.layout.model;

public class Point3d {

	private double x;
	private double y;
	private double z;
	
	public Point3d(double x, double y, double z) {
		super();
		this.x = x;
		this.y = y;
		this.z = z;
	}

	// format "x, y, z"
	public Point3d(String values) {
		String [] spittedString = values.split(",");
		this.x = Double.valueOf(spittedString[0]);
		this.y = Double.valueOf(spittedString[1]);
		this.z = Double.valueOf(spittedString[2]);
	}
	
	public double getX() {
		return x;
	}

	public void setX(double x) {
		this.x = x;
	}

	public double getY() {
		return y;
	}

	public void setY(double y) {
		this.y = y;
	}

	public double getZ() {
		return z;
	}

	public void setZ(double z) {
		this.z = z;
	}

	@Override
	public String toString() {
		return x + "," + y + "," + z;
	}
	
	
}
