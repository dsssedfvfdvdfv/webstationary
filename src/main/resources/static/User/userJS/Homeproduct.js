var myapp = angular.module("app", []);
let hostHome = "http://localhost:8080/restProduct/products";

myapp.controller("ctrlHome", function($scope, $http) {
	// Khởi tạo các biến dữ liệu
	$scope.items = [];
	$scope.itemss = [];
	$scope.itemcate = [];
	$scope.cartItems = [];
	$scope.show = {};
	/*Hàm load_all để tải danh sách sản phẩm:
	$scope.load_all = function() {
		$http.get(`${hostHome}`).then(resp => {
			$scope.items = resp.data; // Gán dữ liệu sản phẩm từ phản hồi server vào biến $scope.items
			$scope.items.forEach(item => {
				item.enteredDate = new Date(item.enteredDate); // Chuyển đổi định dạng ngày thành đối tượng ngày
			});
		});
	}
	*/
	$scope.load_all = function() {
		$http.get(`http://localhost:8080/restProduct/productstrue`).then(resp => {
			$scope.items = resp.data; // Gán dữ liệu sản phẩm từ phản hồi server vào biến $scope.items

			/*$scope.itemss.forEach(item => {
				item.enteredDate = new Date(item.enteredDate); 
			});
			*/
		});
	}

	$scope.feature = function() {
		$http.get(`http://localhost:8080/restProduct/productsfeature`).then(resp => {
			$scope.itemss = resp.data; // Gán dữ liệu sản phẩm từ phản hồi server vào biến $scope.items

			/*$scope.itemss.forEach(item => {
				item.enteredDate = new Date(item.enteredDate); 
			});
			*/
		});
	}
	/* Hàm getAmount để tính giá sau khi giảm giá:*/
	$scope.getAmount = function(unitPrice, discount) {
		return unitPrice * ((100 - discount) / 100); 
	}


	/*Sử dụng thư viện SweetAlert2 trong JavaScript cho thông báo toast:*/
	const Toast = Swal.mixin({
		toast: true,
		position: 'bottom-end',
		showConfirmButton: false,
		timer: 1500,
		timerProgressBar: true,
		didOpen: (toast) => {
			toast.addEventListener('mouseenter', Swal.stopTimer)
			toast.addEventListener('mouseleave', Swal.resumeTimer)
		}
	})

	/*Hàm views để xem thông tin sản phẩm:*/
	$scope.views = function(productID) {
		var url = `${hostHome}/${productID}`;
		$http.get(url).then(resp => {
			$scope.show = resp.data;	
			/* 		
			window.location.href = '/productdetail';
			localStorage.setItem('showData', JSON.stringify($scope.show));
			*/
		}).catch(error => console.log("Error", error));
	}



	/*Hàm loadcate để tải danh sách danh mục sản phẩm:*/
	$scope.loadcate = function() {
		var url = `http://localhost:8080/categoryRest/categoriestrue`
		$http.get(url).then(resp => {
			$scope.itemcate = resp.data; 

		}).catch(error => {

		});
	}

	/*Hàm productincate để tải sản phẩm trong một danh mục:*/
	$scope.productincate = function(categoryID) {
		var url = `http://localhost:8080/restProduct/category/${categoryID}`
		$http.get(url).then(resp => {
			$scope.items = resp.data; 
		}).catch(error => {

		});
	}

	$scope.cart = {
		add(productID) {
			//cart items
			var user = $("#username").text();
			var urlcartitems = "http://localhost:8080/CartItem/cartItems";

			if (user) {
				$http.get(`${urlcartitems}/${user}`).then(resitem => {
					$scope.itemcart = resitem.data;
					console.log($scope.itemcart);
					var urlproduct = `${hostHome}/${productID}`;

					$http.get(urlproduct).then(resproduct => {

						$scope.product = resproduct.data;
						console.log($scope.product)
						//cart
						var urlpost = `http://localhost:8080/CartItem/cartItemDetail`;
						var data = {
							cartDetailID: 1,
							quantity: 1,
							realPrice: $scope.getAmount($scope.product.unitPrice, $scope.product.discount),
							products: $scope.product,
							cartItems: $scope.itemcart
						}
						
						
						var check = false;
						$http.get(`http://localhost:8080/CartItem/cartItemDetail/${data.cartItems.cartID}`).then(resitem => {
							$scope.checkProduct = resitem.data;
							for (var i = 0; i < $scope.checkProduct.length; i++) {
								console.log($scope.checkProduct[i].products);
								if ($scope.product.productID == $scope.checkProduct[i].products.productID) {
									check = true;
								}
							}
							if (check == true) {
								Toast.fire({
									icon: 'warning',
									title: 'Sản phẩm: ' + $scope.product.name + ' đã có trong giỏ hàng của bạn!',
								})
							}
							else {
								$http.post(urlpost, data).then(function(res) {
									Toast.fire({
										icon: 'success',
										title: 'Đã thêm sản phẩm ' + $scope.product.name,
									})
									console.log(data.cartItems.cartID);

								}, function(error) {
									Swal.fire(
										'Error',
										'Thêm thất bại, Bạn hãy điền đúng thông tin nhé :(',
										'error'
									)
								})
							}
						})
						
					});
				});
				
			} else {
				var urlproduct = `${hostHome}/${productID}`;
				$http.get(urlproduct).then(resproduct => {
					$scope.product = resproduct.data;


					var cartItems = JSON.parse(sessionStorage.getItem('cartItems')) || [];

					// Kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng chưa
					var isProductInCart = false;
					for (var i = 0; i < cartItems.length; i++) {
						if (cartItems[i].products.productID === $scope.product.productID) {
							isProductInCart = true;
							break;
						}
					}
					var maxCartDetailID = 0;
					for (var i = 0; i < cartItems.length; i++) {
						if (cartItems[i].cartDetailID > maxCartDetailID) {
							maxCartDetailID = cartItems[i].cartDetailID;
						}
					}

					// Tạo mã cartDetailID mới bằng cách tăng mã lớn nhất lên 1
					var newCartDetailID = maxCartDetailID + 1;
					if (!isProductInCart) {
						var data = {
							cartDetailID: newCartDetailID,
							quantity: 1,
							realPrice: $scope.getAmount($scope.product.unitPrice, $scope.product.discount),
							products: $scope.product,
							cartItems: $scope.itemcarts
						};
						cartItems.push(data);
						$scope.cartItems = cartItems;
						sessionStorage.setItem('cartItems', JSON.stringify(cartItems));

						Toast.fire({
							icon: 'success',
							title: 'Đã thêm sản phẩm ' + $scope.product.name,
						});
					} else {
						// Hiển thị thông báo hoặc thực hiện các hành động cần thiết để cho biết sản phẩm đã có trong giỏ hàng.
						Toast.fire({
							icon: 'warning',
							title: 'Sản phẩm ' + $scope.product.name + ' đã có trong giỏ hàng.',
						});
					}
				})

			}

		}
	}
	
	
	//hàm quản lý wishlist sản phẩm
	           $scope.wishList = {

                 add(productID){
					  console.log("chạy wishlist thành công");
                 //wishList items
                var user = $("#username").text();
                  console.log("chạy tới dòng 257");
                   console.log("user tại dòng 257 là "+user);
                var urlwishLists = "http://localhost:8080/wishList/wishLists";
                console.log("user tại dòng 259 là "+user);
                $http.get(`${urlwishLists}/${user}`).then(resitem => {
					console.log("user tại dòng 261 là "+user);
                $scope.itemwishList = resitem.data;
                console.log($scope.itemwishList);
                   console.log("lay user thành công");
                //product
                var urlproduct= `${hostHome}/${productID}`;

                $http.get(urlproduct).then(resproduct => {
          
                    $scope.product = resproduct.data;
                    console.log($scope.product);
//wishlist
                var urlpost = `http://localhost:8080/wishList/wishListDetail`;
                var data = {
                  wishlist_detailid:0,
                
                  realPrice: $scope.getAmount($scope.product.unitPrice,$scope.product.discount),
                  products:  $scope.product,
                  wishListItems:  $scope.itemwishList
                }
                  console.log(data)
                  var check =false;
                  $http.get(`http://localhost:8080/wishList/wishListDetail/${data.wishListItems.wishlist_id}`).then(resitem => {
                         $scope.checkProduct = resitem.data;
                         for(var i =0; i<$scope.checkProduct.length; i++){
                         console.log($scope.checkProduct[i].products);
                         if($scope.product.productID == $scope.checkProduct[i].products.productID){
                         check =true;
                        }
                     }
                  if(check ==true){
                     Toast.fire({
                      icon: 'warning',
                     title: 'Sản phẩm: ' + $scope.product.name +' đã được thêm vào mục yêu thích!',
                     })
                }
                  else{
					  console.log(data)
                     $http.post(urlpost,data).then(function(res){
                         Toast.fire({
                             icon: 'success',
                             title: 'Đã thêm sản phẩm yêu thích thành công ' + $scope.product.name,
                         })
                         console.log($scope.product);
                      
                    },function(error){
                      Swal.fire(
                          'Error',
                          'Thêm thất bại, Bạn hãy điền đúng thông tin nhé :(',
                          'error'
                        )
                      })
                      }
                 })
             });
         });
    }
}
	/*Phân trang danh sách sản phẩm:*/
	$scope.page = {
		page: 0,
		size: 8,
		get items() {
			var start = this.page * this.size;
			return $scope.items.slice(start, start + this.size); // Trả về danh sách sản phẩm theo trang hiện tại
		},
		get count() {
			return Math.ceil(1.0 * $scope.items.length / this.size); // Tính số lượng trang
		},
		loadmore() {
			this.size += 8; // Tăng số lượng sản phẩm trên mỗi trang
			$scope.load_all(); // Tải lại danh sách sản phẩm
		}
	}


	$scope.pages = {
		page: 0,
		size: 4,
		get itemss() {
			var start = this.page * this.size;
			return $scope.itemss.slice(start, start + this.size); // Trả về danh sách sản phẩm theo trang hiện tại
		},
		get count() {
			return Math.ceil(1.0 * $scope.itemss.length / this.size); // Tính số lượng trang
		},
		loadmore() {
			this.size += 4; // Tăng số lượng sản phẩm trên mỗi trang
			$scope.load_all(); // Tải lại danh sách sản phẩm
		},
		first() {
			this.page = 0;
		},
		prev() {
			this.page--;
			if (this.page < 0) {
				this.last();
			}
		},
		next() {
			this.page++;
			if (this.page >= this.count) {
				this.first();
			}
		},
		last() {
			this.page = this.count - 1;
		}
	}
	/*Gọi hàm để tải dữ liệu ban đầu:*/
	$scope.loadcate(); // Tải danh mục sản phẩm ban đầu
	$scope.load_all(); // Tải danh sách sản phẩm ban đầu
	$scope.feature();

});