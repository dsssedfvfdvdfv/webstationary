package module.DAO;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;


import module.Domain.Wishlist;
import module.Domain.WishlistDetail;

@Repository
public interface WishListDetailDAO extends JpaRepository<WishlistDetail, Integer> {
	@Query(value = "select * from wishlist_details where wishlist_id = ?", nativeQuery = true)
	List<WishlistDetail> findByWishListItem(Integer wishlist_id);

	@Query(value = "select * from wishlist_details where wishlist_id = ? and wishlist_detailid = ?", nativeQuery = true)
	WishlistDetail findByWishListItemAndWishListDetailItem(Integer wishlist_id, Integer wishlist_detailid);
}
