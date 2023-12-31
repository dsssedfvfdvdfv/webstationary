package module.RestController;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import module.DAO.AccountDAO;
import module.DAO.AccountRoleDAO;
import module.DAO.RoleDAO;
import module.Domain.Account;
import module.Domain.AccountRoles;
import module.Domain.Order;
import module.Domain.Role;

@CrossOrigin("*")
@RestController
@RequestMapping("restAccount")
public class AccountRestController {
	@Autowired
	BCryptPasswordEncoder bCryptPasswordEncoder;
	@Autowired
	AccountDAO aDao;
	@Autowired
	AccountRoleDAO Dao;
	@Autowired
	RoleDAO roleDao;

	@GetMapping("/accounts")
	public ResponseEntity<List<Account>> getAll() {
		return ResponseEntity.ok(aDao.findAll());
	}
	@GetMapping("/account/role")
	public ResponseEntity<List<Object[]>> getAlls() {
		return ResponseEntity.ok(aDao.Role());
	}
	@GetMapping("/accountRole")
	public ResponseEntity<List<AccountRoles>> getAllAccRole() {

		return ResponseEntity.ok(Dao.findAll());
	}

	@GetMapping("/Role")
	public ResponseEntity<List<Role>> getRole() {
		return ResponseEntity.ok(roleDao.findAll());
	}


	
	@GetMapping("/account/role/{username}")
	public ResponseEntity<List<Object[]>> getOneRole(@PathVariable("username") String username) {
		if (!aDao.existsById(username)) {
			return ResponseEntity.notFound().build();
		}
		aDao.findById(username).get().setPassword(bCryptPasswordEncoder.encode(aDao.findById(username).get().getPassword()));
		return ResponseEntity.ok(aDao.findAccountRole(username));
	}
	@GetMapping("/account/{username}")
	public ResponseEntity<Account> getOneAccounts(@PathVariable("username") String username) {
		if (!aDao.existsById(username)) {
			return ResponseEntity.notFound().build();
		}
		
		return ResponseEntity.ok(aDao.findById(username).get());
	}
	@GetMapping("/accounts/{username}")
	public ResponseEntity<Account> getOne(@PathVariable("username") String username) {
		if (!aDao.existsById(username)) {
			return ResponseEntity.notFound().build();
		}
		aDao.findById(username).get().setPassword(bCryptPasswordEncoder.encode(aDao.findById(username).get().getPassword()));
		return ResponseEntity.ok(aDao.findById(username).get());
	}
	@GetMapping("/accountss/{username}")
	public ResponseEntity<Account> getOneAccount(@PathVariable("username") String username) {
		if (!aDao.existsById(username)) {
			return ResponseEntity.notFound().build();
		}
		
		return ResponseEntity.ok(aDao.findById(username).get());
	}
	@GetMapping("/accountsss/{username}")
	public ResponseEntity<Role> getOneAccountRole(@PathVariable("username") Integer username) {
		if (!Dao.existsById(username)) {
			return ResponseEntity.notFound().build();
		}
		return ResponseEntity.ok(Dao.findById(username).get().getRole());
	}
	@PutMapping("/accountsss/{username}")
	public ResponseEntity<AccountRoles> updateAccountRole(@PathVariable("username") Integer username, @RequestBody Role newRole) {
	    Optional<AccountRoles> accountRolesOptional = Dao.findById(username);

	    if (accountRolesOptional.isEmpty()) {
	        return ResponseEntity.notFound().build();
	    }

	    AccountRoles accountRoles = accountRolesOptional.get();
	    accountRoles.setRole(newRole);
	    Dao.save(accountRoles);	 
	    return ResponseEntity.ok(accountRoles);
	}
	@GetMapping("/Role/USER")
	public ResponseEntity<Role> getOneRole() {
		return ResponseEntity.ok(roleDao.findById("USER").get());
	}

	@PostMapping("/accounts")
	public ResponseEntity<Account> Post(@RequestBody Account account) {
		if (aDao.existsById(account.getEmail())) {
			return ResponseEntity.badRequest().build();
		}
		System.out.print(account);
		aDao.save(account);

		return ResponseEntity.ok(account);
	}

	@PostMapping("/accountRole")
	public ResponseEntity<AccountRoles> PostAccRole(@RequestBody AccountRoles accountRole) {
		Dao.save(accountRole);
		return ResponseEntity.ok(accountRole);
	}

	@PutMapping("/accounts/{username}")
	public ResponseEntity<Account> Put(@PathVariable("username") String username, @RequestBody Account account) {
		if (!aDao.existsById(username)) {
			return ResponseEntity.notFound().build();
		}
		aDao.save(account);
		return ResponseEntity.ok(account);
	}
	

	@DeleteMapping("/accounts/{username}")
	public ResponseEntity<Void> Delete(@PathVariable("username") String username) {
		if (!aDao.existsById(username)) {
			return ResponseEntity.notFound().build();
		}
		aDao.deleteById(username);
		return ResponseEntity.ok().build();
	}

	@DeleteMapping("/accountRole/{id}")
	public ResponseEntity<Void> DeleteAccRole(@PathVariable("id") Integer id) {
		if (!Dao.existsById(id)) {
			return ResponseEntity.notFound().build();
		}
		Dao.deleteById(id);
		return ResponseEntity.ok().build();
	}

}
