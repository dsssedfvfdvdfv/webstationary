package module.DAO;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


import module.Domain.Wishlist;

@Repository
public interface WishListDAO extends JpaRepository<Wishlist, Integer> {

}
