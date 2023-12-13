package module.Domain;

import java.io.Serializable;
import java.util.Set;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import org.hibernate.annotations.Cascade;
import org.hibernate.annotations.CascadeType;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import com.fasterxml.jackson.annotation.JsonIgnore;

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

    @JsonIgnore
    @OneToMany(mappedBy = "cartItem", fetch = FetchType.LAZY) 
    @Cascade(value = { CascadeType.SAVE_UPDATE, CascadeType.DELETE })
    @OnDelete(action = OnDeleteAction.CASCADE)
    Set<CartItemDetail> cartItemDetails;
}
