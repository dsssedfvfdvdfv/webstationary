package module.Domain;

import java.io.Serializable;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import org.hibernate.annotations.Cascade;
import org.hibernate.annotations.CascadeType;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@SuppressWarnings("serial")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "CartItems")
public class CartItem implements Serializable {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Cascade(value = { CascadeType.SAVE_UPDATE })
	@OnDelete(action = OnDeleteAction.CASCADE)
	private Integer cartID;

	@ManyToOne
	@JoinColumn(name = "username")
	private Account accountCart;

}
