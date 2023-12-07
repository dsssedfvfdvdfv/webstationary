package module.RestController;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import module.DAO.WishListDAO;
import module.DAO.WishListDetailDAO;
import module.Domain.Wishlist;
import module.Domain.WishlistDetail;



@CrossOrigin("*")
@RestController
@RequestMapping("wishList")
public class WishListRestController {

	@Autowired
	WishListDetailDAO dDao;
	@Autowired
	WishListDAO Dao;

	@GetMapping("wishListDetail")
	public ResponseEntity<List<WishlistDetail>> getAllDetail() {
		return ResponseEntity.ok(dDao.findAll());
	}

	@GetMapping("wishListDetail/{wishListid}")
	public ResponseEntity<List<WishlistDetail>> getDetailbyItem(@PathVariable("wishListid") Integer wishListid) {
		return ResponseEntity.ok(dDao.findByWishListItem(wishListid));
	}

	@GetMapping("wishListDetail/{wishListid}/{wishList_detailid}")
	public ResponseEntity<WishlistDetail> getDetailbyItem(@PathVariable("wishListid") Integer wishListid,
			@PathVariable("wishList_detailid") Integer wishList_detailid) {
		return ResponseEntity.ok(dDao.findByWishListItemAndWishListDetailItem(wishListid, wishList_detailid));
	}

	@GetMapping("wishLists")
	public ResponseEntity<List<Wishlist>> getAll() {
		return ResponseEntity.ok(Dao.findAll());
	}

	/**
	 * @param username
	 * @return
	 */
	@GetMapping("wishLists/{username}")
	public ResponseEntity<Wishlist> getbyUser(@PathVariable("username") String username) {
		System.out.println("12312312312312312");
		return ResponseEntity.ok(Dao.findByUsername(username));
	}

	@PostMapping("wishLists")
	public ResponseEntity<Wishlist> PostItem(@RequestBody Wishlist WishList) {

		if (Dao.existsById(WishList.getWishlist_id())) {
			return ResponseEntity.badRequest().build();
		}
	
		Dao.save(WishList);

		return ResponseEntity.ok(WishList);
	}

	@PostMapping("wishListDetail")
	public ResponseEntity<WishlistDetail> PostDetail(@RequestBody WishlistDetail WishListDetail) {
		System.out.println(WishListDetail);
		if (dDao.existsById(WishListDetail.getWishlist_detailid())) {
			return ResponseEntity.badRequest().build();
		}
		dDao.save(WishListDetail);
		return ResponseEntity.ok(WishListDetail);
	}

	@PutMapping("/wishListDetail/{wishListDetailID}")
	public ResponseEntity<WishlistDetail> Put(@PathVariable("wishListDetailID") Integer wishListDetail,
			@RequestBody WishlistDetail detail) {
		if (!dDao.existsById(wishListDetail)) {
			return ResponseEntity.notFound().build();
		}
		dDao.save(detail);
		return ResponseEntity.ok(detail);
	}

	@PutMapping("/wishLists/{wishListID}")
	public ResponseEntity<Wishlist> Put(@PathVariable("wishListID") Integer wishListID, @RequestBody Wishlist item) {
		if (!Dao.existsById(wishListID)) {
			return ResponseEntity.notFound().build();
		}
		Dao.save(item);
		return ResponseEntity.ok(item);
	}

	@DeleteMapping("/wishListDetail/{wishListDetailID}")
	public ResponseEntity<Void> Delete(@PathVariable("cartDetailID") Integer wishListID) {
		if (!dDao.existsById(wishListID)) {
			return ResponseEntity.notFound().build();
		}
		dDao.deleteById(wishListID);
		return ResponseEntity.ok().build();
	}
}
