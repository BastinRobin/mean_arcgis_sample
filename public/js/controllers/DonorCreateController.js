angular.module("bloodonateApp").controller("DonorCreateController",
function($scope, transfer, restful, $http, $routeParams, $location) {
  // @TODO For debuging purposes only
  // If you planning to remove this in the future please be aware that
  // create donor form is being initialized by ng-repeat on $scope.data
  // So that you should at least pass empty string version of dummy below
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
    //
    // What is this hack? JSON JSON JASON
    // http://stackoverflow.com/a/5344074/5917087
    var data = JSON.parse(JSON.stringify($scope.data))
    data.geo_x = $routeParams.x
    data.geo_y = $routeParams.y
    // Make API call for to create new donor
    $http.post("api/donor/", data)
      .success(function(response) {
        // Pass the response and let restful service do the rest
        restful.redirectInfo("success", response)
      })
      .error(function(response) {
        $scope.errors = restful.decodeError(response.e)
      })
  }
})