package module.RestController;

import java.io.IOException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import module.DAO.OrderDAO;
import module.Domain.Order;
import module.Services.VNPayService;

@CrossOrigin("*")
@RestController
@RequestMapping("restBank")
public class BankingRestController {
	@Autowired
	VNPayService vnpayservice;
	
	@Autowired
	OrderDAO oDao;
	
	@PostMapping("/submitOrder")
	public void submidOrder(
	        HttpServletRequest request,
	        HttpServletResponse response) throws IOException {
	    int orderTotal = 200000;
	    String orderInfo = "thanh toán đơn hàng";
	    String baseUrl = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort();
	    String vnpayUrl = vnpayservice.createOrder(orderTotal, orderInfo, baseUrl);  
	    Order order= new Order();
	    
	    response.sendRedirect(vnpayUrl);
	}
	
}
