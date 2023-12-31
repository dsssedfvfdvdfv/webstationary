
app.controller("ctrlorder", function($scope, $http,$window) {
	$scope.confirm = [];

	$scope.load_all = function() {
		$http.get(`http://localhost:8080/statistical/confirm`).then(res => {
			$scope.confirm = res.data;
		}).catch(error => {
			console.log("Error", error)
		});
	}
	$scope.loaddelivered = function() {
		$http.get(`http://localhost:8080/statistical/confirmss`).then(res => {
			$scope.confirmss = res.data;

		}).catch(error => {
			console.log("Error", error)
		});
	}
	$scope.load = function() {
		$http.get(`http://localhost:8080/statistical/confirms`).then(res => {
			$scope.confirms = res.data;

		}).catch(error => {
			console.log("Error", error)
		});
	}
	$scope.xacnhan = function(orderid) {
    $http.get(`http://localhost:8080/statistical/confirm/${orderid}`).then(resp => {
        $scope.form = resp.data;
        var item = $scope.form;
        item.status = 2;
        if(item.paymentmethod==1){
				item.paymentstatus=0;		
        $http.put(`http://localhost:8080/statistical/confirm/${orderid}`, item).then(resp => {
            Swal.fire("Hệ Thống", "Xác nhận đơn hàng thành công!!", "success");

            // Cập nhật trạng thái trong dữ liệu $scope thay vì tải lại trang
            item.status = 2;
			item.paymentstatus=0;
            // Thực hiện các hành động cập nhật khác mà bạn muốn
            $http.post(`http://localhost:8080/send/orders`, item).then(ressendOder => {
                console.log(ressendOder)
            }).catch(error => {
                console.log(error);
                alert("that bai");
            });

            $scope.load();
            $scope.load_all();
            $scope.loaddelivered();
        }).catch(error => Swal.fire(
            'Error',
            'Hình như là mình hết hàng rồi :(',
            'error'
        ));
		}else{
				item.paymentstatus=1;		
        $http.put(`http://localhost:8080/statistical/confirm/${orderid}`, item).then(resp => {
            Swal.fire("Hệ Thống", "Xác nhận đơn hàng thành công!!", "success");

            // Cập nhật trạng thái trong dữ liệu $scope thay vì tải lại trang
            item.status = 2;
			item.paymentstatus=0;
            // Thực hiện các hành động cập nhật khác mà bạn muốn
            $http.post(`http://localhost:8080/send/orders`, item).then(ressendOder => {
                console.log(ressendOder)
            }).catch(error => {
                console.log(error);
                alert("that bai");
            });

            $scope.load();
            $scope.load_all();
            $scope.loaddelivered();
        }).catch(error => Swal.fire(
            'Error',
            'Hình như là mình hết hàng rồi :(',
            'error'
        ));
		}
       

    }).catch(error => console.log("Error", error));
}
$scope.danhanhang = function(orderid) {
    $http.get(`http://localhost:8080/statistical/confirm/${orderid}`).then(resp => {
        $scope.form = resp.data;
        var item = $scope.form;
        item.status = 4;
       	item.paymentstatus=1;

        $http.put(`http://localhost:8080/statistical/confirm/${orderid}`, item).then(resp => {
            Swal.fire("Hệ Thống", "Đơn hàng đã được giao!!", "success");

            // Cập nhật trạng thái trong dữ liệu $scope thay vì tải lại trang
           	item.paymentstatus=1;

            // Thực hiện các hành động cập nhật khác mà bạn muốn
            $http.post(`http://localhost:8080/send/orders`, item).then(ressendOder => {
                console.log(ressendOder)
            }).catch(error => {
                console.log(error);
                alert("that bai");
            });
			$scope.loaddelivered();
            $scope.load();
            $scope.load_all();
        }).catch(error => Swal.fire(
            'Error',
            'Hình như là mình hết hàng rồi :(',
            'error'
        ));

    }).catch(error => console.log("Error", error));
}
$scope.huydon = function(orderid) {
    $http.get(`http://localhost:8080/statistical/confirm/${orderid}`).then(resp => {
        $scope.form = resp.data;
        var item = $scope.form;
        item.status = 3;
		item.paymentstatus=0;
        $http.put(`http://localhost:8080/statistical/confirm/${orderid}`, item).then(resp => {
            Swal.fire("Hệ Thống", "Đơn Hàng đã được hủy!", "success");
            item.status = 3;

            // Thực hiện các hành động cập nhật khác mà bạn muốn
            $http.post(`http://localhost:8080/send/orders`, item).then(ressendOder => {
                console.log(ressendOder)
            }).catch(error => {
                console.log(error);
                alert("that bai");
            });
			$scope.loaddelivered();
            $scope.load();
            $scope.load_all();
        }).catch(error => Swal.fire(
            'Error',
            'Xác nhận rồi mà :(',
            'error'
        ));

    }).catch(error => console.log("Error", error));
}


	$scope.info = function(orderid) {
		$http.get(`http://localhost:8080/statistical/infoDetail/${orderid}`).then(resp => {
			$scope.items = resp.data;
			console.log($scope.items);
		}).catch(error => console.log("Error", error));

	}


	$scope.listConfirm = {
		page: 0,
		size: 3,
		get items() {
			var start = this.page * this.size;
			return $scope.confirm.slice(start, start + this.size);
		},
		get count() {
			return Math.ceil(1.0 * $scope.confirm.length / this.size);
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

	$scope.Confirms = {
		page: 0,
		size: 5,
		get items() {
			var start = this.page * this.size;
			return $scope.confirms.slice(start, start + this.size);
		},
		get count() {
			return Math.ceil(1.0 * $scope.confirms.length / this.size);
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


	$scope.Confirmss = {
		page: 0,
		size: 5,
		get items() {
			var start = this.page * this.size;
			return $scope.confirmss.slice(start, start + this.size);
		},
		get count() {
			return Math.ceil(1.0 * $scope.confirmss.length / this.size);
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

	$scope.load_all();
	$scope.load();
	$scope.loaddelivered();
	
});