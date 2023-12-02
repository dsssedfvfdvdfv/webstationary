var myapp = angular.module("app", []);

myapp.controller("ctrldetailproduct", function($scope) {
	
	$scope .form=[];
	$scope.load=function(){
		var data = JSON.parse(localStorage.getItem('showData'));
		console.log(data);
		$scope.form=data;
	}
	$scope.load();
});