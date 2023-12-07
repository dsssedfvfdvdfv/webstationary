package module.DAO;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;


import module.Domain.Wishlist;

@Repository
public interface WishListDAO extends JpaRepository<Wishlist, Integer> {
	@Query(value = "select * from wish_list where username = ?", nativeQuery = true)
	Wishlist findByUsername(String username);
}
