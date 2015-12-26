package de.rinderle.softvis3d.preprocessing;

import com.google.gson.Gson;
import de.rinderle.softvis3d.neoresult.Neo4jAnswer;
import org.junit.Test;

/**
 * Created by stefanrinderle on 14.12.15.
 */
public class Neo4jClientTest {

  @Test
  public void testTest1() throws Exception {

    final String json = "{\"results\":[{\"columns\":[\"Type\",\"DeclaredMethods\"],\"data\":[{\"row\":[\"org.springframework.samples.petclinic.model.Owner\",21]},{\"row\":[\"org.springframework.samples.petclinic.model.Pet\",16]},{\"row\":[\"org.springframework.samples.petclinic.service.AbstractClinicServiceTests\",11]},{\"row\":[\"org.springframework.samples.petclinic.repository.jdbc.JdbcPet\",11]},{\"row\":[\"org.springframework.samples.petclinic.model.Visit\",10]},{\"row\":[\"org.springframework.samples.petclinic.web.OwnerController\",9]},{\"row\":[\"org.springframework.samples.petclinic.web.PetController\",9]},{\"row\":[\"org.springframework.samples.petclinic.service.ClinicServiceImpl\",9]},{\"row\":[\"org.springframework.samples.petclinic.service.ClinicService\",8]},{\"row\":[\"org.springframework.samples.petclinic.model.Vet\",8]},{\"row\":[\"org.springframework.samples.petclinic.repository.jdbc.JdbcOwnerRepositoryImpl\",7]},{\"row\":[\"java.lang.StringBuilder\",7]},{\"row\":[\"org.springframework.samples.petclinic.repository.jdbc.JdbcPetVisitExtractor\",7]},{\"row\":[\"org.springframework.samples.petclinic.util.CallMonitoringAspect\",7]},{\"row\":[\"org.assertj.core.api.Assertions\",6]},{\"row\":[\"org.springframework.samples.petclinic.web.VisitController\",6]},{\"row\":[\"java.util.Collection\",5]},{\"row\":[\"org.springframework.samples.petclinic.web.PetTypeFormatter\",5]},{\"row\":[\"org.springframework.samples.petclinic.repository.jdbc.JdbcPetRepositoryImpl\",5]},{\"row\":[\"java.sql.ResultSet\",5]}]}],\"errors\":[]}";

    final Gson gson = new Gson();
    final Neo4jAnswer answer = gson.fromJson(json, Neo4jAnswer.class);

    System.out.println(answer);

  }
}