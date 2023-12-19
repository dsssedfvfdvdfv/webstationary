
app.controller("ctrlstatistical", function($scope, $http, $window) {
	$scope.confirm = [];




	$scope.top5item = function() {
		$http.get(`http://localhost:8080/statistical/top5items`).then(resp => {
			$scope.top5item = resp.data;
			const data = resp.data;
			updateChart(data);

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

	$scope.getDate = function() {
		var dateString = $scope.selectedDate;
		var dateObject = new Date(dateString);
		var day = dateObject.getDate();
		var month = dateObject.getMonth() + 1;
		var year = dateObject.getFullYear();
		var dateAll = year + '-' + (month < 10 ? '0' : '') + month + '-' + (day < 10 ? '0' : '') + day;
		var url = 'http://localhost:8080/statistical/searchturnoverday';
		$http.get(`${url}/${dateAll}`).then(resp => {
			$scope.itemTurnover = resp.data;
		}).catch(error => console.log("Error", error));
	};

	$scope.getMonth = function() {
		var dateString = $scope.selectedDate;
		var dateObject = new Date(dateString);
		var month = dateObject.getMonth() + 1;
		var year = dateObject.getFullYear();

		var url = 'http://localhost:8080/statistical/searchturnovermonth';
		$http.get(`${url}/${year}/${month}`).then(resp => {
			$scope.itemTurnover = resp.data;
		}).catch(error => console.log("Error", error));
	};


	function updateChart(data) {
		let myChart = document.getElementById('myChart').getContext('2d');
		let labelsArray = data;
		let productNames = [];
		let quantitys = [];
		if (Array.isArray(labelsArray) && labelsArray.length > 1) {
			for (let i = 0; i < labelsArray.length; i++) {
				let productName = labelsArray[i][0];
				

				let quantity = labelsArray[i][2];
				productNames.push(productName);
				quantitys.push(quantity);
			}
		} else {
			console.log("Invalid data format or empty array");
		}

		// Global Options
		Chart.defaults.global.defaultFontFamily = 'Lato';
		Chart.defaults.global.defaultFontSize = 18;
		Chart.defaults.global.defaultFontColor = '#777';

		let massPopChart = new Chart(myChart, {
			type: 'bar', // bar, horizontalBar, pie, line, doughnut, radar, polarArea
			data: {
				labels: productNames,
				datasets: [{
					label: 'Số lượng',
					data: quantitys,
					//backgroundColor:'green',
					backgroundColor: [
						'rgba(255, 99, 132, 0.6)',
						'rgba(54, 162, 235, 0.6)',
						'rgba(255, 206, 86, 0.6)',
						'rgba(75, 192, 192, 0.6)',
						'rgba(153, 102, 255, 0.6)',
						'rgba(255, 159, 64, 0.6)'
					],
					borderWidth: 1,
					borderColor: '#777',
					hoverBorderWidth: 3,
					hoverBorderColor: '#000'
				}]
			},
			options: {
				title: {
					display: true,
					text: 'Thống kê số lượng sản phẩm mua nhiều nhất',
					fontSize: 25
				},
				
				legend: {
					display: true,
					position: 'right',
					labels: {
						fontColor: '#000',
					
					}
				},
				layout: {
					padding: {
						left: 20,
						right: 0,
						bottom: 0,
						top: 0
					}
				},
				tooltips: {
					enabled: true
				},  scales: {
            xAxes: [{
                ticks: {
                    maxRotation: 0,
                    minRotation: 0,
                    fontSize:7,
                   
                },
                 maxTicksLimit: 10,
                autoSkip: false
            }],
            // Các tùy chọn khác của trục x và trục y
        }

			}
		});

	}
	updateChart();
	$scope.turnover();
	$scope.top5item();
	$scope.top5buyer();
});