
app.controller("ctrlstatistical", function($scope, $http,$window) {
	$scope.confirm = [];
		

	

	$scope.top5item = function() {
		$http.get(`http://localhost:8080/statistical/top5items`).then(resp => {
			$scope.top5item = resp.data;
		}).catch(error => console.log("Error", error));
	}

	$scope.top5buyer = function() {
		$http.get(`http://localhost:8080/statistical/top5buyer`).then(resp => {
			$scope.top5buyer = resp.data;
		}).catch(error => console.log("Error", error));
	}

	$scope.turnover = function() {
		$http.get(`http://localhost:8080/statistical/turnoverday`).then(resp => {
			$scope.itemTurnover = resp.data;
		}).catch(error => console.log("Error", error));

	}

	$scope.turnovermonth = function() {
		$http.get(`http://localhost:8080/statistical/turnovermonth`).then(resp => {
			$scope.itemTurnover = resp.data;
		}).catch(error => console.log("Error", error));

	}

	$scope.turnoveryear = function() {
		$http.get(`http://localhost:8080/statistical/turnoveryear`).then(resp => {
			$scope.itemTurnover = resp.data;
		}).catch(error => console.log("Error", error));

	}
	$scope.turnovers = {
		page: 0,
		size: 5,
		get items() {
			var start = this.page * this.size;
			return $scope.itemTurnover.slice(start, start + this.size);
		},
		get count() {
			return Math.ceil(1.0 * $scope.itemTurnover.length / this.size);
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


	$scope.turnover();
	$scope.top5item();
	$scope.top5buyer();
});