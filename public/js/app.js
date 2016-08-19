var VALIDATION_MESSAGES = [
  "Success",
  "Firstname",
  "Lastname",
  "Phone",
  "Email",
  "Bloodtype",
  "IP",
  "GEO_X",
  "GEO_Y"
]
// Convert 32 bit ip address to display as string
function INT_TO_STR_IP(int) {
  var part1 = int & 255
  var part2 = ((int >> 8) & 255)
  var part3 = ((int >> 16) & 255)
  var part4 = ((int >> 24) & 255)
  return part4 + "." + part3 + "." + part2 + "." + part1
}
function SERVER_VALIDATION_ERROR(response) {
  // Detect errors
  var error_code = response.e;
  var errors = [];
  // Check for each bit
  for (var i = 0; i != 8; i+=1) {
    if ((error_code >> i) & 1 == 1) {
      // Push the corresponding error to array
      errors.push(VALIDATION_MESSAGES[i+1])
    }
  }
  return errors;
}
angular.module("bloodonate", ["ngRoute"])
  .config(function($routeProvider, $locationProvider) {
    $routeProvider
      .when("/", {
        templateUrl: "main.html",
        controller: "MainController"
      })
      .when("/donor/:id" , {
        templateUrl: "donor_update.html",
        controller: "DonorUpdateController"
      })
      // Being received from ArcGIS popup button click (arcgis.js)
      .when("/@:x::y", {
        templateUrl: "donor_create.html",
        controller: "DonorCreateController"
      })
    $locationProvider.html5Mode(true);
  })
.factory("donor", function () {
  return {
    data: {},
    validation_errors: null
  }
})
.controller("MainController", function($scope, donor) {
  $scope.donor = donor
})
.controller("DonorCreateController", function($scope, donor, $http, $routeParams, $location) {
  $scope.donor = donor
  $scope.donor.validation_errors = null
  $scope.donor.data.geo_x = $routeParams.x
  $scope.donor.data.geo_y = $routeParams.y

  // Code below runs when donor submits form
  $scope.create_donor = function(form) {
    // Make API call for to create new donor
    $http.post("api/donor/", $scope.donor.data)
      .success(function(response) {
        // Show unique link to donor
        $scope.donor.unique_link = "/donor/" + response.unique_param

        response.ipv4 = INT_TO_STR_IP(response.ipv4)
        $scope.donor.saved_data = response.saved_data
        $scope.donor.validation_errors = null
        $location.path("/")
      })
      .error(function(response) {
        $scope.donor.validation_errors = SERVER_VALIDATION_ERROR(response)
      })
  }
})
.controller("DonorUpdateController", function ($scope, donor, $routeParams, $http, $location) {
  var id = $routeParams.id
  var url = "api/donor/" + id
  // Retrieve current donor information from server
  $http.get(url)
    .success(function(response){
      response.ipv4 = INT_TO_STR_IP(response.ipv4)
      // Bind data to update form
      $scope.donor.data = response
    })
    .error(function(response) {
      alert('WHAT? @TODO')
    })
  // Delete permanenty button action
  $scope.delete_donor = function(form) {
    $http.delete(url)
      .success(function() {
        // @TODO DRY? DELETE UPDATE delete_donor update_donor
        response.ipv4 = INT_TO_STR_IP(response.ipv4)
        // Show deleted data to user after operation
        $scope.donor.saved_data = response.saved_data
        $location.path("/")
      })
      .error(function(response) {
        $scope.donor.validation_errors = SERVER_VALIDATION_ERROR(response)
      })
  }
  // Save changes button action
  $scope.update_donor = function(form) {
    var body = $scope.donor.data
    delete body.ipv4
    $http.put(url, body)
      .success(function(response) {
        // @TODO DRY? DELETE UPDATE delete_donor update_donor
        response.ipv4 = INT_TO_STR_IP(response.ipv4)
        // Show new updated data to user after operation
        $scope.donor.saved_data = response.saved_data
        $location.path("/")
      })
      .error(function(response) {
        $scope.donor.validation_errors = SERVER_VALIDATION_ERROR(response)
      })
  }
})