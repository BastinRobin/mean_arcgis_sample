angular.module("bloodonateApp").controller("DonorCreateController",
function($scope, transfer, restful, $http, $routeParams, $location) {
  // @TODO For debuging purposes only, remove the dummy form data
  var dummy = {
    firstname: "Quick Test",
    lastname: "Auto Fill",
    phone: "00223334444333",
    email: "emirhanozlen@gmail.com",
    bloodtype: "B-" // Hail to my fellow B- mates
  }
  $scope.data = dummy
  // Server side validation errors
  $scope.validation_errors = null
  // Code below runs when donor submits form
  $scope.create = function() {
    // Setup request payload
    var data = $scope.data
    data.geo_x = $routeParams.x
    data.geo_y = $routeParams.y
    // Make API call for to create new donor
    $http.post("api/donor/", data)
      .success(function(response) {
        // Pass the response and let restful service do the rest
        restful.redirect.success(response)
      })
      .error(function(response) {
        $scope.validation_errors = restful.decodeError(response.e)
      })
  }
})