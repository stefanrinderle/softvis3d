package de.rinderle.softviz3d.layout.dot;

public interface ExecuteCommand {

    String executeCommand(String command, String inputGraph) throws DotExcecutorException;
    
}