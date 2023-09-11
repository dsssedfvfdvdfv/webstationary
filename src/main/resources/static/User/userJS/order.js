myapp.controller("ctrlcart", function ($scope, $http) {
    // Khai báo các biến dùng để lưu trữ dữ liệu và thông tin trong phạm vi $scope
    $scope.detail = [];
    $scope.orderdetail = [];
    $scope.itemcart = {};
    $scope.form = {};
    $scope.info = {
        numberphone: "",
        adress: ""
    };

    // Hàm để xem danh sách sản phẩm trong giỏ hàng
    $scope.viewItems = {
        views() {
            // Lấy thông tin người dùng từ giao diện
            var user = $("#usernameCart").text();

            // Gửi yêu cầu GET đến API để lấy thông tin giỏ hàng của người dùng
            $http.get(`http://localhost:8080/CartItem/cartItems/${user}`).then(resitem => {
                $scope.itemcart = resitem.data;

                // Gửi yêu cầu GET đến API để lấy danh sách sản phẩm trong giỏ hàng chi tiết
                $http.get(`http://localhost:8080/CartItem/cartItemDetail/${$scope.itemcart.cartID}`).then(rescartDetail => {
                    $scope.detail = rescartDetail.data;

                    // Tính tổng tiền của giỏ hàng
                    $scope.getTotal = function () {
                        var total = 0;
                        for (var i = 0; i < $scope.detail.length; i++) {
                            var product = $scope.detail[i];
                            total += (product.realPrice * product.quantity);
                        }
                        return total;
                    }
                });
            });
        },
        // Hàm để cập nhật số lượng sản phẩm trong giỏ hàng
        update(cartDetailID) {
            var user = $("#usernameCart").text();
            var number = document.getElementById(cartDetailID).value;

            // Gửi yêu cầu GET đến API để lấy thông tin giỏ hàng của người dùng
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
        },
        // Hàm để thực hiện đặt hàng
        addOrder() {
            // Kiểm tra thông tin nhập vào (địa chỉ và số điện thoại)
            var vnf_regex = /((09|03|07|08|05)+([0-9]{8})\b)/;
            var mobile = $scope.info.numberphone;

            if ($scope.info.adress.length < 9) {
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
            }

            // Nếu thông tin nhập vào hợp lệ, thực hiện đặt hàng
            if ($scope.info.adress.length >= 9 || vnf_regex.test(mobile) == true) {
                var user = $("#usernameCart").text();

                // Gửi yêu cầu GET đến API để lấy thông tin giỏ hàng của người dùng
                $http.get(`http://localhost:8080/CartItem/cartItems/${user}`).then(resitem => {
                    $scope.itemcart = resitem.data;

                    // Gửi yêu cầu GET đến API để lấy danh sách sản phẩm trong giỏ hàng chi tiết
                    $http.get(`http://localhost:8080/CartItem/cartItemDetail/${$scope.itemcart.cartID}`).then(rescartDetail => {
                        $scope.orderdetail = rescartDetail.data;

                        // Tính tổng tiền của đơn hàng
                        $scope.getTotal = function () {
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
                                adress: $scope.info.adress,
                                orderDate: new Date(),
                                phone: $scope.info.numberphone,
                                status: 1,
                                accountoder: $scope.acc
                            }

                            // Gửi yêu cầu POST đến API để đặt hàng
                            $http.post(`http://localhost:8080/order/Order/`, dataOder).then(resOder => {
                                // Hiển thị thông báo thành công
                                Swal.fire(
                                    'Đặt Hàng Thành Công',
                                    'Cảm ơn bạn đã tin tưởng Shop TVTS :)',
                                    'success'
                                );

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

                                // Xóa sản phẩm trong giỏ hàng sau khi đặt hàng thành công
                                for (var i = 0; i < $scope.orderdetail.length; i++) {
                                    $scope.delete($scope.orderdetail[i].cartDetailID)
                                }

                                $scope.viewItems.views();
                            }).catch(error => {
                                console.log(error);
                            });
                        });
                    });
                });
            }
        }
    }

    // Hàm để xóa sản phẩm khỏi giỏ hàng
    $scope.delete = function (cartDetailID) {
        var url = `http://localhost:8080/CartItem/cartItemDetail/${cartDetailID}`;
        $http.delete(url).then(resp => {
            var index = $scope.detail.findIndex(item => item.cartDetailID == cartDetailID);
            $scope.detail.splice(index, 1);
            $scope.viewItems.views();
        }).catch(error => Swal.fire(
            'Error',
            'Xin lỗi, Brand này đang được sử dụng :)',
            'error'
        ));
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

    // Gọi hàm xem danh sách sản phẩm trong giỏ hàng khi trang được tải
    $scope.viewItems.views();
});
