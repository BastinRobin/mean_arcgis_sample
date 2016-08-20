angular.module("bloodonateApp").controller("DonorUpdateController",
function ($scope, transfer, restful, $routeParams, $http, $location) {
  var id = $routeParams.id
  var url = "api/donor/" + id
  // Retrieve current donor information from server
  $http.get(url)
    .success(function(response){
      response.ipv4 = restful.ipToString(response.ipv4)
      // Bind data to update form
      $scope.data = response
    })
    .error(function(response) {
      // @TODO Redirect 404 page?
      $location.path("/")
    })
  // Delete permanenty button action
  $scope.delete = function() {
    $http.delete(url)
      .success(function(response) {
        // Pass the response and let restful service do the rest
        restful.redirect.success(response)
      })
      .error(function(response) {
        $scope.validation_errors = SERVER_VALIDATION_ERROR(response)
      })
  }
  // Save changes button action
  $scope.update = function() {
    var body = $scope.data
    delete body.ipv4
    $http.put(url, body)
      .success(function(response) {
        // Pass the response and let restful service do the rest
        restful.redirect.success(response)
      })
      .error(function(response) {
        $scope.validation_errors = restful.decodeError(response)
      })
  }
})