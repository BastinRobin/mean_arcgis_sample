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
      $location.path("/donor/notfound")
    })
  // Delete permanenty button action
  $scope.delete = function() {
    $http.delete(url)
      .success(function(response) {
        delete response.unique_param
        $location.path("/donor/deleted")
      })
      .error(function(response) {
        $location.path("/donor/notfound")
      })
  }
  // Save changes button action
  $scope.saveMethod = function() {
    // Hard copy scope data
    var body = JSON.parse(JSON.stringify($scope.data))
    delete body.ipv4
    $http.put(url, body)
      .success(function(response) {
        // Pass the response and let restful service do the rest
        restful.redirectInfo("success", response)
      })
      .error(function(response) {
        // Decode the error code and display it under the update form
        $scope.errors = restful.decodeError(response.e)
      })
  }
})