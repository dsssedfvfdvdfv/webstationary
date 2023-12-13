myapp.controller("ctrlwishlist", function($scope, $http) {
	$scope.detail = [];
	$scope.orderdetail = [];
	$scope.itemwishlist = {};
	$scope.form = {};
	$scope.info = {
		numberphone: "",
		adress: ""

	};
	$scope.viewItems = {
		views() {
			var user = $("#usernameCart").text();
			$http.get(`http://localhost:8080/wishList/wishLists/${user}`).then(resitem => {
				$scope.itemwishlist = resitem.data;
				$http.get(`http://localhost:8080/wishList/wishListDetail/${$scope.itemwishlist.wishlist_id}`).then(reswishListDetail => {
					$scope.detail = reswishListDetail.data;
					console.log($scope.detail);
				});

			});
		},
	}

	$scope.delete = function(wishListid) {
		var user = $("#usernameCart").text();
		console.log(user);
		if (user) {
			var url = `http://localhost:8080/wishList/wishListDetail/${wishListid}`;
			$http.delete(url).then(resp => {
				var index = $scope.detail.findIndex(item => item.wishListid == wishListid);
				$scope.detail.splice(index, 1);
				$scope.viewItems.views();
				Swal.fire({
					icon: 'success', // Sử dụng biểu tượng thành công (dấu tích)
					title: 'Success',
					text: 'Xóa khỏi doanh sách yêu thích',
				});

			}).catch(error => Swal.fire(
				'Error',
				'Xin lỗi,Không xóa được :)',
				'error'
			));
		}

	}

	$scope.pagewishlist = {
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
});