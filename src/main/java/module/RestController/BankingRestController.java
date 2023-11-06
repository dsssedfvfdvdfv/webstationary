package module.RestController;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
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
	
	
	@Transactional
	@PostMapping("/submitOrder")
	public void submidOrder(HttpServletRequest request, HttpServletResponse response) throws IOException {
		  Cookie[] cookies = request.getCookies();
		    int orderTotal = 0; 
		    
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
		    
		    String orderInfo = "thanh toán đơn hàng";
		    String baseUrl = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort();
		    String vnpayUrl = vnpayservice.createOrder(orderTotal, orderInfo, baseUrl);
		   
		    response.sendRedirect(vnpayUrl);
	}

}
