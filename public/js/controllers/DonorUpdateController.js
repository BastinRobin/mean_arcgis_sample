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
      alert('WHAT? @TODO')
    })
  // Delete permanenty button action
  $scope.delete = function() {
    $http.delete(url)
      .success(function(response) {
        // @TODO DRY? DELETE UPDATE delete_donor update_donor
        response.ipv4 = restful.ipToString(response.ipv4)
        // Show deleted data to user after operation
        $scope.transfer.saved_data = response.saved_data
        $scope.transfer.unique_link = undefined;
        $location.path("/")
      })
      .error(function(response) {
        $scope.transfer.validation_errors = SERVER_VALIDATION_ERROR(response)
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
        $scope.transfer.validation_errors = restful.decodeError(response)
      })
  }
})