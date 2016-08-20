angular.module("bloodonateApp").controller("DonorFindController",
function($scope, $http, $routeParams) {
  $http.get("api/donor/find/" + $routeParams.id)
    .success(function(response) {
      // Show unique link to patient
      $scope.data = response
    })
    .error(function(response) {
      $scope.error = "Unable to get donor information"
    })
})