myapp.controller("ctrlcart", function($scope, $http) {
	// Khai báo các biến dùng để lưu trữ dữ liệu và thông tin trong phạm vi $scope
	$scope.detail = [];
	$scope.orderdetail = [];
	$scope.itemcart = {};
	$scope.form = {};
	$scope.cities = {};
	$scope.districts = {};
	$scope.ward = {};

	$scope.info = {
		numberphone: "",
		adress: "",
		city: "",
		disctric: "",
		commune: "",
		street: "",
		firstname: "",
		lastname: "",
		message: "",
		district: "",
		ward: "",
		email: "",
		message: "",
		paymentmethod: "true",
		paymentstatus: ""
	};

	// Hàm để xem danh sách sản phẩm trong giỏ hàng
	$scope.viewItems = {
		views() {
			// Lấy thông tin người dùng từ giao diện
			var user = $("#usernameCart").text();
			if (user) {
				$http.get(`http://localhost:8080/CartItem/cartItems/${user}`).then(resitem => {
					$scope.itemcart = resitem.data;

					// Gửi yêu cầu GET đến API để lấy danh sách sản phẩm trong giỏ hàng chi tiết
					$http.get(`http://localhost:8080/CartItem/cartItemDetail/${$scope.itemcart.cartID}`).then(rescartDetail => {
						$scope.detail = rescartDetail.data;

						// Tính tổng tiền của giỏ hàng
						$scope.getTotal = function() {
							var total = 0;
							for (var i = 0; i < $scope.detail.length; i++) {
								var product = $scope.detail[i];
								total += (product.realPrice * product.quantity);
							}
							return total;
						}
					});
				});
			} else {
				var cartItems = sessionStorage.getItem('cartItems');

				if (cartItems) {
					$scope.detail = JSON.parse(cartItems);

				} else {
					console.log("Không tìm thấy sản phẩm nào trong sessionStorage");
				}
				$scope.getTotal = function() {
					var total = 0;
					for (var i = 0; i < $scope.detail.length; i++) {
						var product = $scope.detail[i];
						total += (product.realPrice * product.quantity);
					}
					return total;
				}
			}
			// Gửi yêu cầu GET đến API để lấy thông tin giỏ hàng của người dùng

		},

		// Hàm để cập nhật số lượng sản phẩm trong giỏ hàng
		update(cartDetailID) {
			var user = $("#usernameCart").text();
			var number = document.getElementById(cartDetailID).value;

			if (user) {
				$http.get(`http://localhost:8080/CartItem/cartItems/${user}`).then(resitem => {
					$scope.itemcart = resitem.data;

					// Gửi yêu cầu GET đến API để lấy thông tin sản phẩm trong giỏ hàng chi tiết
					$http.get(`http://localhost:8080/CartItem/cartItemDetail/${$scope.itemcart.cartID}/${cartDetailID}`).then(rescartDetail => {
						$scope.form = rescartDetail.data;

						// Chuẩn bị dữ liệu để gửi yêu cầu PUT đến API để cập nhật số lượng sản phẩm trong giỏ hàng
						var data = {
							cartDetailID: cartDetailID,
							cartItems: $scope.itemcart,
							products: $scope.form.products,
							quantity: number,
							realPrice: $scope.form.realPrice,
						}
						var url = `http://localhost:8080/CartItem/cartItemDetail/${cartDetailID}`;
						$http.put(url, data).then(resp => {
							$scope.viewItems.views();
						}).catch(error => {
						});
					});
				});
			} else {

				var cartItems = sessionStorage.getItem('cartItems');
				var parsedCartItems = JSON.parse(cartItems);

				if (Array.isArray(parsedCartItems) && parsedCartItems.length > 0) {
					parsedCartItems.forEach(function(item) {
						if (item.cartDetailID === cartDetailID) {
							item.quantity = parseInt(number);
							// Cập nhật sản phẩm và tiếp tục với các sản phẩm khác nếu cần
						}
					});

					sessionStorage.setItem('cartItems', JSON.stringify(parsedCartItems));
				}
			}
			// Gửi yêu cầu GET đến API để lấy thông tin giỏ hàng của người dùng

		},
		// Hàm để thực hiện đặt hàng
		addOrder() {
			// Kiểm tra thông tin nhập vào (địa chỉ và số điện thoại)
			var vnf_regex = /((09|03|07|08|05)+([0-9]{8})\b)/;
			var mobile = $scope.info.numberphone;
			var emailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
			var email = $scope.info.email;
			if ($scope.info.street.length < 9) {
				return Swal.fire(
					'Error',
					'Điền đúng địa chỉ để có thể nhận hàng nhanh hơn nhé :)',
					'error'
				);
			}
			if (vnf_regex.test(mobile) == false) {
				return Swal.fire(
					'Error',
					'Nhập đúng SDT để mình gọi chốt đơn nhé :)',
					'error'
				);
			} else if (!emailPattern.test(email)) {
				return Swal.fire(
					'Error',
					'Nhập đúng định dạng email :)',
					'error'
				);
			}

			// Nếu thông tin nhập vào hợp lệ, thực hiện đặt hàng
			if ($scope.info.adress.length >= 9 || vnf_regex.test(mobile) == true) {
				var user = $("#usernameCart").text();
				if (user) {
					$http.get(`http://localhost:8080/CartItem/cartItems/${user}`).then(resitem => {
						$scope.itemcart = resitem.data;

						// Gửi yêu cầu GET đến API để lấy danh sách sản phẩm trong giỏ hàng chi tiết
						$http.get(`http://localhost:8080/CartItem/cartItemDetail/${$scope.itemcart.cartID}`).then(rescartDetail => {
							$scope.orderdetail = rescartDetail.data;

							// Tính tổng tiền của đơn hàng
							$scope.getTotal = function() {
								var total = 0;
								for (var i = 0; i < $scope.orderdetail.length; i++) {
									var product = $scope.orderdetail[i];
									total += (product.realPrice * product.quantity);
								}
								return total;
							}

							// Lấy thông tin tài khoản người dùng
							$http.get(`http://localhost:8080/restAccount/accounts/${user}`).then(resaccout => {
								$scope.acc = resaccout.data;

								// Chuẩn bị dữ liệu để gửi yêu cầu POST đến API để đặt hàng
								var dataOder = {
									orderID: 0,
									amount: $scope.getTotal(),
									firstname: $scope.info.firstname,
									lastname: $scope.info.lastname,
									message: $scope.info.message,
									city: $scope.info.ct,
									district: $scope.info.district,
									ward: $scope.info.ward,
									email: $scope.info.email,
									street: $scope.info.street,
									orderDate: new Date(),
									phone: $scope.info.numberphone,
									status: 1,
									accountoder: $scope.acc
								}

								// Gửi yêu cầu POST đến API để đặt hàng
								$http.post(`http://localhost:8080/order/Order/`, dataOder).then(resOder => {
									sessionStorage.setItem('orderid', resOder.data.orderID);
									var amountElement = document.querySelector(".total");
									var amountValue = parseFloat(amountElement.textContent.replace(/\D/g, ""));
									document.cookie = 'total=' + amountValue;
									document.cookie = 'id=' + resOder.data.orderID;
									window.location.href = "/payment"

									$scope.infoOrder = resOder.data;
									var dataallDetail = []

									// Chuẩn bị dữ liệu để gửi yêu cầu POST đến API để đặt hàng chi tiết
									for (var i = 0; i < $scope.orderdetail.length; i++) {
										var product = $scope.orderdetail[i];
										var dataDetail = {
											orderDetailID: 0,
											quantity: product.quantity,
											unitPrice: (product.realPrice * product.quantity),
											orders: resOder.data,
											productOrder: $scope.orderdetail[i].products,
										}
										dataallDetail.push(dataDetail)
									}

									// Gửi yêu cầu POST đến API để đặt hàng chi tiết
									$http.post(`http://localhost:8080/orderDetail/OrderDetailUser`, dataallDetail).then(resOderDetail => {
										var datasend = resOder.data;

										// Gửi yêu cầu POST đến API để gửi thông báo về đơn hàng
										$http.post(`http://localhost:8080/send/orders`, datasend).then(ressendOder => {
											console.log(ressendOder)
										}).catch(error => {
											console.log(error);
											alert("that bai");
										});
									}).catch(error => {
										console.log(error);
									});

									/*
									for (var i = 0; i < $scope.orderdetail.length; i++) {
										$scope.delete($scope.orderdetail[i].cartDetailID)
									}
									*/
									$scope.viewItems.views();
								}).catch(error => {
									console.log(error);
								});
							});
						});
					});
				} else {

					var dataOder = {
						orderID: 0,
						firstname: $scope.info.firstname,
						lastname: $scope.info.lastname,
						message: $scope.info.message,
						city: $scope.info.ct,
						district: $scope.info.district,
						ward: $scope.info.ward,
						email: $scope.info.email,
						street: $scope.info.street,
						orderDate: new Date(),
						phone: $scope.info.numberphone,
						paymentstatus: false,
						status: 1,
					}
					var amountElement = document.querySelector(".total");
					var amountValue = parseFloat(amountElement.textContent.replace(/\D/g, ""));
					$http.post(`http://localhost:8080/order/Order/`, dataOder).then(resOder => {
						window.location.href = "/payment";
						sessionStorage.setItem('orderid', JSON.stringify(resOder));
						sessionStorage.setItem('total', JSON.stringify(amountValue));
						document.cookie = 'total=' + amountValue;
						document.cookie = 'id=' + resOder.data.orderID;
						var cartItems = sessionStorage.getItem('cartItems');
						if (cartItems) {
							$scope.detail = JSON.parse(cartItems);
						}
						var dataallDetail = []
						// Chuẩn bị dữ liệu để gửi yêu cầu POST đến API để đặt hàng chi tiết
						for (var i = 0; i < $scope.detail.length; i++) {
							var product = $scope.detail[i];
							var dataDetail = {
								orderDetailID: 0,
								quantity: product.quantity,
								unitPrice: (product.realPrice * product.quantity),
								orders: resOder.data,
								productOrder: $scope.detail[i].products,
							}
							dataallDetail.push(dataDetail)
						}
						$http.post(`http://localhost:8080/orderDetail/OrderDetailUser`, dataallDetail).then(resOderDetail => {
							var datasend = resOder.data;


						}).catch(error => {
							console.log(error);
						});



						$scope.viewItems.views();
					}).catch(error => {
						console.log(error);
					});
				}
				// Gửi yêu cầu GET đến API để lấy thông tin giỏ hàng của người dùng

			}
		}
	}
	function getCookie(name) {
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].trim();
        if (cookie.indexOf(name + '=') === 0) {
            return cookie.substring(name.length + 1, cookie.length);
        }
    }
    return null;
}

	$scope.addPayment = function(orderid) {
		var user = $("#usernameCart").text();
		var amountElement = document.querySelector(".total");
		var amountValue = parseFloat(amountElement.textContent.replace(/\D/g, ""));
		var order = getCookie('id');
		var orders = JSON.parse(order);
	
		var dataOrder = {
			orderid: orders, // Lấy orderID từ đối tượng orders
			paymentmethod: $scope.info.paymentmethod,
			paymentstatus: true,
			amount:amountValue,
			status: 1
		};

		console.log(dataOrder);
		// Gửi yêu cầu PUT để cập nhật đơn hàng
	
		$http.put(`http://localhost:8080/order/Orderupdate/${orders}`, dataOrder).then(response => {
			Swal.fire(
				'Đặt Hàng Thành Công',
				'Cảm ơn bạn đã tin tưởng Shop TVTS :)',
				'success'
			);
			setTimeout(function() {
				window.location.href = "/";
			}, 2000); // Chuyển trang sau 2 giây

		}).catch(error => {
			console.log("Lỗi khi cập nhật đơn hàng:", error);
		});

	
	}
	// Hàm để xóa sản phẩm khỏi giỏ hàng
	$scope.delete = function(cartDetailID) {
		var user = $("#usernameCart").text();
		console.log(user);
		if (user) {
			var url = `http://localhost:8080/CartItem/cartItemDetail/${cartDetailID}`;
			$http.delete(url).then(resp => {
				var index = $scope.detail.findIndex(item => item.cartDetailID == cartDetailID);
				$scope.detail.splice(index, 1);
				$scope.viewItems.views();
				console.log(user);
			}).catch(error => Swal.fire(
				'Error',
				'Xin lỗi, Brand này đang được sử dụng :)',
				'error'
			));
		} else {
			var index = $scope.detail.findIndex(item => item.cartDetailID == cartDetailID);
			if (index !== -1) {
				var product = $scope.detail.splice(index, 1)[0]; // Lấy sản phẩm đã xóa
				var cartItems = JSON.parse(sessionStorage.getItem('cartItems')) || [];
				console.log(user);
				// Tìm index của sản phẩm trong mảng cartItems
				var cartIndex = cartItems.findIndex(item => item.cartDetailID == cartDetailID);
				if (cartIndex !== -1) {
					cartItems.splice(cartIndex, 1); // Xóa sản phẩm khỏi mảng cartItems
				}

				// Lưu mảng cartItems trở lại vào sessionStorage
				sessionStorage.setItem('cartItems', JSON.stringify(cartItems));

				$scope.viewItems.views();
			}


		}

	}

	// Phân trang cho sản phẩm trong giỏ hàng
	$scope.pagecartItem = {
		page: 0,
		size: 3,
		get items() {
			var start = this.page * this.size;
			return $scope.detail.slice(start, start + this.size);
		},
		get count() {
			return Math.ceil(1.0 * $scope.detail.length / this.size);
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
	$scope.viewItems.views();


	var token = '0da3fb68-638c-11ee-b394-8ac29577e80e';


	function getCities(id) {
		if (!id) {
			$http({
				method: 'GET',
				url: 'https://online-gateway.ghn.vn/shiip/public-api/master-data/province',
				headers: {
					'Token': token
				}
			}).then(function(response) {
				$scope.cities = response.data;
				getDistricts(id);
			}, function(error) {
				console.log('Error:', error);
			});
		} else {

		}

	}


	function getDistricts(cityId) {
		if (cityId) {
			$http({
				method: 'GET',
				url: 'https://online-gateway.ghn.vn/shiip/public-api/master-data/district',
				headers: {
					'Token': token
				},
				params: {
					province_id: cityId
				}
			}).then(function(response) {
				$scope.districts = response.data;
				getWards(id);
			}, function(error) {
				console.log('Error:', error);
			});
		}

	}
	function getWards(id) {
		if (id) {
			$http({
				method: 'GET',
				url: 'https://online-gateway.ghn.vn/shiip/public-api/master-data/ward',
				headers: {
					'Token': token
				}, params: {
					district_id: id
				}
			}).then(function(response) {
				$scope.ward = response.data;
				getDistricts(id);
			}, function(error) {
				console.log('Error:', error);
			});
		}

	}




	getDistricts();
	getCities();

	$scope.$watch('info.ct', function(newCityName) {
		if (newCityName) {
			var selectedCity = $scope.cities.data.find(function(city) {
				return city.ProvinceName === newCityName;
			});
			if (selectedCity) {
				$scope.info.city = selectedCity.ProvinceID;
			}
			getDistricts(selectedCity.ProvinceID);
		} else {
			$scope.info.city = "";
			$scope.info.disctric = "";
		}
	});

	$scope.$watch('info.district', function(newDistrictName) {
		if (newDistrictName) {
			var selectedDistrict = $scope.districts.data.find(function(district) {
				return district.DistrictName === newDistrictName;
			});

			if (selectedDistrict) {
				$scope.info.city = selectedDistrict.ProvinceID;
				// Gọi hàm để lấy danh sách xã/phường dựa trên quận/huyện đã chọn
				getWards(selectedDistrict.DistrictID);
			}
		} else {
			$scope.info.city = "";
			$scope.info.disctric = "";
		}
	});

});



