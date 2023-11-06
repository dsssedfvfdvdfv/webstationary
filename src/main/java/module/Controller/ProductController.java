package module.Controller;

import java.util.Optional;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.SessionAttribute;

import module.DAO.CartDetailDAO;
import module.DAO.CartItemDAO;
import module.DAO.OrderDAO;
import module.DAO.ProductDAO;
import module.Domain.Products;

@Controller
public class ProductController {
	@Autowired
	ProductDAO dao;
	@Autowired

	CartDetailDAO cartDao;

	@Autowired
	CartItemDAO itemDao;

	@Autowired
	HttpServletRequest res;

	@Autowired
	OrderDAO oDao;
	@RequestMapping({ "home", "home/user" })
	public String getAll(Model model) {
		return "Usersform/home";
	}

	@RequestMapping("home/{id}")
	public String getDetail(Model model, @PathVariable("id") Integer id) {
		Optional<Products> item = dao.findById(id);
		model.addAttribute("item", item.get());
		return "Usersform/product-details";
	}

	@RequestMapping("about")
	public String about() {
		return "Usersform/about";
	}

	@RequestMapping("blog-details")
	public String blogdetails() {
		return "Usersform/blog-details";
	}

	@RequestMapping("checkout")
	public String checkout() {
		
		return "Usersform/checkout";
	}

	@RequestMapping("contact")
	public String contact() {
		return "Usersform/contact";
	}

	@RequestMapping("customer-review")
	public String customerreview() {
		return "Usersform/customer-review";
	}

	@RequestMapping("portfolio-card-box-2")
	public String portfoliocard() {
		return "Usersform/portfolio-card-box-2";
	}

	@RequestMapping("single-portfolio")
	public String singleportfolio() {
		return "Usersform/single-portfolio";
	}

	@RequestMapping("team")
	public String team() {
		return "Usersform/team";
	}

	@RequestMapping("wishlist")
	public String wishlist() {
		return "Usersform/wishlist";
	}

	@RequestMapping("blog")
	public String blog() {
		return "Usersform/blog";
	}

	@RequestMapping("cart")
	public String cart() {
		return "Usersform/cart";
	}
	@RequestMapping("payment")
	public String payment() {
		return "Usersform/payment";
	}
	@RequestMapping("order")
	public String order() {
		return "Usersform/order";
	}
	@GetMapping("/thank")
	public String thank(HttpServletRequest request) {
		  Cookie[] cookies = request.getCookies();
		    double orderTotal = 0; 
		    
		    if (cookies != null) {
		        for (Cookie cookie : cookies) {
		            if ("total".equals(cookie.getName())) {
		             
		                try {
		                    orderTotal = Integer.parseInt(cookie.getValue());
		                } catch (NumberFormatException e) {
		                   
		                }
		            }
		        }
		    }
		int id=oDao.findMaxOrderId();
		boolean paymentmethod=true;
		boolean paymentstatus=true;
		oDao.updateOrder(orderTotal, paymentmethod, paymentstatus, id);
 	    return "Usersform/thank";
	}
}
