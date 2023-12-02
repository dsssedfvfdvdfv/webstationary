package module.RestController;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import module.DAO.WishListDAO;
import module.Domain.Products;
import module.Domain.Wishlist;

@Controller
@RequestMapping("wishlist")
public class WishListRestController {
	
	@Autowired
	WishListDAO dao;
	
	@GetMapping("/loadData/{id}")
	public ResponseEntity<Wishlist> getOne(@PathVariable("wishlistid") Integer wishlistID) {
		if (!dao.existsById(wishlistID)) {
			return ResponseEntity.notFound().build();
		}
		return ResponseEntity.ok(dao.findById(wishlistID).get());
	}
 
}
