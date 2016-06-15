/**
 * softvis3d-webservice-example
 * Copyright (C) 2016 Stefan Rinderle
 * stefan@rinderle.info
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02
 */
package de.rinderle.softvis3d.service;

import com.google.inject.Inject;
import de.rinderle.softvis3d.base.domain.SnapshotTreeResult;
import de.rinderle.softvis3d.base.domain.tree.RootTreeNode;
import de.rinderle.softvis3d.neo.Neo4jClient;
import de.rinderle.softvis3d.neo.Neo4jParser;
import de.rinderle.softvis3d.neoresult.Data;
import de.rinderle.softvis3d.neoresult.Neo4jAnswer;
import de.rinderle.softvis3d.preprocessing.PathWalker;
import de.rinderle.softvis3d.preprocessing.PathWalkerDataTransformer;

/**
 * Created by stefanrinderle on 05.12.15.
 */
public class NeoService {

  @Inject
  private Neo4jClient neo4jClient;
  @Inject
  private Neo4jParser neo4jParser;
  @Inject
  private PathWalkerDataTransformer pathWalkerDataTransformer;

  public SnapshotTreeResult getNeoTree(String cypher) throws Exception {
    final String jsonResult = neo4jClient.dynamic(cypher);
    return transformToSnapshotTreeResult(jsonResult);
  }

  public SnapshotTreeResult getNeoTreeStatic() {
    final String staticResult = "{\"results\":[{\"columns\":[\"Type\",\"DeclaredMethods\"],\"data\":[{\"row\":[\"org.springframework.samples.petclinic.model.Owner\",21]},{\"row\":[\"org.springframework.samples.petclinic.model.Pet\",16]},{\"row\":[\"org.springframework.samples.petclinic.service.AbstractClinicServiceTests\",11]},{\"row\":[\"org.springframework.samples.petclinic.repository.jdbc.JdbcPet\",11]},{\"row\":[\"org.springframework.samples.petclinic.model.Visit\",10]},{\"row\":[\"org.springframework.samples.petclinic.web.OwnerController\",9]},{\"row\":[\"org.springframework.samples.petclinic.web.PetController\",9]},{\"row\":[\"org.springframework.samples.petclinic.service.ClinicServiceImpl\",9]},{\"row\":[\"org.springframework.samples.petclinic.service.ClinicService\",8]},{\"row\":[\"org.springframework.samples.petclinic.model.Vet\",8]},{\"row\":[\"org.springframework.samples.petclinic.repository.jdbc.JdbcOwnerRepositoryImpl\",7]},{\"row\":[\"org.springframework.samples.petclinic.util.CallMonitoringAspect\",7]},{\"row\":[\"org.springframework.samples.petclinic.repository.jdbc.JdbcPetVisitExtractor\",7]},{\"row\":[\"java.lang.StringBuilder\",7]},{\"row\":[\"org.assertj.core.api.Assertions\",6]},{\"row\":[\"org.springframework.samples.petclinic.web.VisitController\",6]},{\"row\":[\"java.util.Collection\",5]},{\"row\":[\"org.springframework.samples.petclinic.model.Person\",5]},{\"row\":[\"org.springframework.samples.petclinic.web.PetTypeFormatter\",5]},{\"row\":[\"org.springframework.samples.petclinic.repository.jdbc.JdbcPetRepositoryImpl\",5]},{\"row\":[\"org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate\",5]},{\"row\":[\"java.util.Set\",5]},{\"row\":[\"java.sql.ResultSet\",5]},{\"row\":[\"org.springframework.jdbc.core.simple.SimpleJdbcInsert\",4]},{\"row\":[\"org.springframework.util.StopWatch\",4]},{\"row\":[\"java.util.List\",4]},{\"row\":[\"org.springframework.samples.petclinic.repository.jdbc.JdbcVisitRepositoryImpl\",4]},{\"row\":[\"org.springframework.samples.petclinic.model.BaseEntity\",4]},{\"row\":[\"java.lang.Integer\",4]},{\"row\":[\"org.springframework.samples.petclinic.model.NamedEntity\",4]},{\"row\":[\"javax.persistence.EntityManager\",4]},{\"row\":[\"org.springframework.core.style.ToStringCreator\",4]},{\"row\":[\"org.springframework.samples.petclinic.repository.jpa.JpaPetRepositoryImpl\",4]},{\"row\":[\"org.joda.time.LocalDate\",4]},{\"row\":[\"org.springframework.samples.petclinic.repository.jpa.JpaOwnerRepositoryImpl\",4]},{\"row\":[\"org.springframework.samples.petclinic.web.PetValidator\",3]},{\"row\":[\"org.springframework.samples.petclinic.model.ValidatorTests\",3]},{\"row\":[\"org.springframework.samples.petclinic.web.VetControllerTests\",3]},{\"row\":[\"org.springframework.samples.petclinic.web.VetController\",3]},{\"row\":[\"org.springframework.samples.petclinic.repository.jdbc.JdbcPetRowMapper\",3]},{\"row\":[\"javax.persistence.Query\",3]},{\"row\":[\"org.springframework.samples.petclinic.repository.jpa.JpaVisitRepositoryImpl\",3]},{\"row\":[\"org.springframework.samples.petclinic.repository.OwnerRepository\",3]},{\"row\":[\"org.springframework.samples.petclinic.repository.PetRepository\",3]},{\"row\":[\"java.util.Iterator\",3]},{\"row\":[\"org.springframework.samples.petclinic.repository.jdbc.JdbcVisitRowMapper\",3]},{\"row\":[\"java.lang.Object\",3]},{\"row\":[\"org.springframework.test.web.servlet.result.MockMvcResultMatchers\",3]},{\"row\":[\"org.springframework.samples.petclinic.model.PetType\",3]},{\"row\":[\"org.springframework.samples.petclinic.repository.jdbc.JdbcVetRepositoryImpl$1\",3]},{\"row\":[\"org.springframework.jdbc.core.JdbcTemplate\",3]},{\"row\":[\"org.springframework.samples.petclinic.util.EntityUtils\",2]},{\"row\":[\"org.assertj.core.api.AbstractCharSequenceAssert\",2]},{\"row\":[\"java.util.ArrayList\",2]},{\"row\":[\"java.lang.String\",2]},{\"row\":[\"org.springframework.validation.beanvalidation.LocalValidatorFactoryBean\",2]},{\"row\":[\"org.springframework.web.servlet.ModelAndView\",2]},{\"row\":[\"org.springframework.jdbc.core.BeanPropertyRowMapper\",2]},{\"row\":[\"org.springframework.jdbc.core.namedparam.MapSqlParameterSource\",2]},{\"row\":[\"org.springframework.samples.petclinic.repository.jdbc.JdbcVetRepositoryImpl\",2]},{\"row\":[\"org.assertj.core.api.AbstractIntegerAssert\",2]},{\"row\":[\"org.springframework.validation.BindingResult\",2]},{\"row\":[\"org.springframework.samples.petclinic.model.Vets\",2]},{\"row\":[\"org.aspectj.lang.ProceedingJoinPoint\",2]},{\"row\":[\"java.lang.Class\",2]},{\"row\":[\"org.springframework.samples.petclinic.model.Specialty\",2]},{\"row\":[\"org.springframework.samples.petclinic.web.CrashController\",2]},{\"row\":[\"org.springframework.samples.petclinic.repository.jpa.JpaVetRepositoryImpl\",2]},{\"row\":[\"javax.validation.ConstraintViolation\",2]},{\"row\":[\"org.springframework.samples.petclinic.repository.VisitRepository\",2]},{\"row\":[\"org.springframework.samples.petclinic.repository.springdatajpa.SpringDataOwnerRepository\",2]},{\"row\":[\"org.springframework.web.bind.WebDataBinder\",2]},{\"row\":[\"org.springframework.samples.petclinic.service.ClinicServiceSpringDataJpaTests\",1]},{\"row\":[\"org.springframework.test.web.servlet.request.MockMvcRequestBuilders\",1]},{\"row\":[\"org.springframework.orm.ObjectRetrievalFailureException\",1]},{\"row\":[\"org.springframework.test.web.servlet.result.StatusResultMatchers\",1]},{\"row\":[\"org.springframework.samples.petclinic.service.ClinicServiceJpaTests\",1]},{\"row\":[\"java.lang.Number\",1]},{\"row\":[\"java.util.HashMap\",1]},{\"row\":[\"java.text.ParseException\",1]},{\"row\":[\"org.springframework.beans.support.PropertyComparator\",1]},{\"row\":[\"org.springframework.ui.ModelMap\",1]},{\"row\":[\"org.springframework.samples.petclinic.repository.springdatajpa.SpringDataPetRepository\",1]},{\"row\":[\"org.springframework.test.web.servlet.result.JsonPathResultMatchers\",1]},{\"row\":[\"java.util.Map\",1]},{\"row\":[\"org.springframework.test.web.servlet.result.ContentResultMatchers\",1]},{\"row\":[\"org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder\",1]},{\"row\":[\"org.springframework.context.i18n.LocaleContextHolder\",1]},{\"row\":[\"java.util.HashSet\",1]},{\"row\":[\"org.springframework.data.jdbc.core.OneToManyResultSetExtractor\",1]},{\"row\":[\"java.lang.RuntimeException\",1]},{\"row\":[\"org.springframework.test.web.servlet.ResultActions\",1]},{\"row\":[\"org.springframework.beans.support.MutableSortDefinition\",1]},{\"row\":[\"org.springframework.jdbc.core.namedparam.BeanPropertySqlParameterSource\",1]},{\"row\":[\"java.lang.UnsupportedOperationException\",1]},{\"row\":[\"org.assertj.core.api.AbstractObjectAssert\",1]},{\"row\":[\"org.springframework.ui.Model\",1]},{\"row\":[\"org.springframework.test.web.servlet.MockMvc\",1]},{\"row\":[\"org.springframework.test.web.servlet.setup.StandaloneMockMvcBuilder\",1]},{\"row\":[\"org.springframework.test.web.servlet.setup.MockMvcBuilders\",1]},{\"row\":[\"org.springframework.samples.petclinic.repository.VetRepository\",1]},{\"row\":[\"javax.validation.Validator\",1]},{\"row\":[\"org.springframework.samples.petclinic.service.ClinicServiceJdbcTests\",1]},{\"row\":[\"java.util.Collections\",1]},{\"row\":[\"org.springframework.util.StringUtils\",1]},{\"row\":[\"org.assertj.core.api.AbstractLongAssert\",1]},{\"row\":[\"org.springframework.validation.Errors\",1]}]}],\"errors\":[]}";
    return transformToSnapshotTreeResult(staticResult);
  }

  private SnapshotTreeResult transformToSnapshotTreeResult(String staticResult) {
    final Neo4jAnswer neoAnswer = neo4jParser.parseNeoJson(staticResult);

    final RootTreeNode tree = transformLayoutInput(neoAnswer);

    return new SnapshotTreeResult(tree);
  }

  private RootTreeNode transformLayoutInput(final Neo4jAnswer neoAnswer) {
    final PathWalker pathWalker = new PathWalker("1");

    for (final Data data : neoAnswer.getResults().get(0).getData()) {
      pathWalker.addPath(pathWalkerDataTransformer.transform(data));
    }

    return pathWalker.getTree();
  }
}
