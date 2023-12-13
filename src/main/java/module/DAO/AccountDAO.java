package module.DAO;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import module.Domain.Account;


@Repository
public interface AccountDAO extends JpaRepository<Account, String>{
	@Query(value = "select * from accounts inner join account_roles on accounts.email=account_roles.username",nativeQuery = true)	
	List<Object[]> Role();

	
	@Query(value = "select * from accounts inner join account_roles on accounts.email=account_roles.username where accounts.email=:name",nativeQuery = true)	
	List<Object[]> findAccountRole(@Param("name")String name);
	
	

}
