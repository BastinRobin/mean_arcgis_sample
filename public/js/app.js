angular.module("bloodonate", ["ngRoute"])
.config(function($routeProvider, $locationProvider) {
$routeProvider
  .when("/", {
    templateUrl: "main.html",
    controller: "MainCtrl"
  })
  .when("/donor/:id" , {
    templateUrl: "donor.html",
    controller: "DonorCtrl"
  })
  $locationProvider.html5Mode(true);
})
.controller("MainCtrl", function ($scope) {
  $scope.test = "test"
})
.controller("DonorCtrl", function ($scope, $routeParams, $http, $location) {
  var id = $routeParams.id
  var url = "api/donor/" + id
  $http.get(url)
    .success(function(response){
      $scope.data = response
  })
  $scope.delete = function(form) {
    $http.delete(url)
      .success(function() {
        alert("deleted")
      })
  }
  $scope.put = function(form) {
    $http.put(url, $scope.data)
      .success(function() {
        alert('puted')
        $location.path("/")
      })
  }
})