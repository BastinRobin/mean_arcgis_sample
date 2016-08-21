angular.module("bloodonateApp").controller("DonorFindController",
function($scope, $http, $routeParams, $location) {
  $http.get("api/donor/find/" + $routeParams.id)
    .success(function(response) {
      // Show unique link to patient
      $scope.data = response
    })
    .error(function(response) {
      $location.path("/donor/notfound")
    })
})