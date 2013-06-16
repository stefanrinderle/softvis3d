package de.rinderle.softviz3d.layout.interfaces;

import java.util.List;

public interface SourceObject {

	Integer getIdentifier();
	
	String getName();
	
	List<? extends SourceObject> getChildrenNodes();
	
	List<? extends SourceObject> getChildrenLeaves();
	
	List<Integer> getChildrenIds();

	Integer getDepth();
}
