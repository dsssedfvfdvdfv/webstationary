package module.DAO;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

import module.Domain.Products;

@Repository
public interface ProductDAO extends JpaRepository<Products, Integer> {

	@Query(value = "select * from products where categoryid = ? and status=1 ", nativeQuery = true)
	List<Products> findByCategory(Integer categoryid);
	
	
	@Query(value = "select * from products where status = 1",nativeQuery = true)
	List<Products>findAllTrue();
	
	@Query(value = "select * from products where status = 1 and hot = 1",nativeQuery = true)
	List<Products>findAllfeature();
	
	@Query("SELECT p FROM Products p WHERE p.name LIKE %:name%")
	List<Products> search(@Param("name") String name);

}
