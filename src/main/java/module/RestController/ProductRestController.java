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

import module.DAO.ProductDAO;
import module.Domain.Products;

@CrossOrigin("*")
@RestController
@RequestMapping("restProduct")
public class ProductRestController {
	@Autowired
	ProductDAO pDao;

	@GetMapping("/products")
	public ResponseEntity<List<Products>> getAll() {
		return ResponseEntity.ok(pDao.findAll());
	}
	@GetMapping("/productstrue")
	public ResponseEntity<List<Products>> getAllTrue() {
		return ResponseEntity.ok(pDao.findAllTrue());
	}
	
	@GetMapping("/productsfeature")
	public ResponseEntity<List<Products>> getAllFeatur() {
		return ResponseEntity.ok(pDao.findAllfeature());
	}

	@GetMapping("/category/{categoryid}")
	public ResponseEntity<List<Products>> getproductcate(@PathVariable("categoryid") Integer categoryid) {
		return ResponseEntity.ok(pDao.findByCategory(categoryid));
	}


	
	@GetMapping("/products/{productID}")
	public ResponseEntity<Products> getOne(@PathVariable("productID") Integer productID) {
		if (!pDao.existsById(productID)) {
			return ResponseEntity.notFound().build();
		}
		return ResponseEntity.ok(pDao.findById(productID).get());
	}

	@PostMapping("/products")
	public ResponseEntity<Products> Post(@RequestBody Products product) {
		if (pDao.existsById(product.getProductID())) {
			return ResponseEntity.badRequest().build();
		}
		System.out.print(product);
		pDao.save(product);
		return ResponseEntity.ok(product);
	}

	@PutMapping("/products/{productID}")
	public ResponseEntity<Products> Put(@PathVariable("productID") Integer productID, @RequestBody Products product) {
		if (!pDao.existsById(productID)) {
			return ResponseEntity.notFound().build();
		}
		System.out.print(product);
		pDao.save(product);
		return ResponseEntity.ok(product);
	}

	@DeleteMapping("/products/{productID}")
	public ResponseEntity<Void> Delete(@PathVariable("productID") Integer productID) {
		if (!pDao.existsById(productID)) {
			return ResponseEntity.notFound().build();
		}
		pDao.deleteById(productID);
		return ResponseEntity.ok().build();
	}
}
