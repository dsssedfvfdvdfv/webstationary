package module.DAO;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import module.Domain.Category;


@Repository
public interface CategoryDAO extends JpaRepository<Category, Integer>{

	@Query(value = "select * from categories where status=1 ", nativeQuery = true)
	List<Category> findAllCategory();
}
