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
.controller("MainCtrl", function ($scope, $http) {
  // Code below runs when donor submits form
  $scope.post = function(form) {
    // Make API call for to create new donor
    $http.post("api/donor/", $scope.data)
      .success(function(response) {
        // Show unique link to donor
        $scope.unique_link = "/donor/" + response.unique_param
        $scope.validation_errors = null;
      })
      .error(function(response) {
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
        // Bind errors to the document
        $scope.validation_errors = errors;
      })
  }
})
.controller("DonorCtrl", function ($scope, $routeParams, $http, $location) {
  var id = $routeParams.id
  var url = "api/donor/" + id
  $http.get(url)
    .success(function(response){
      // Convert 32 bit ip address to display as string
      var int = response.ipv4;
      var part1 = int & 255;
      var part2 = ((int >> 8) & 255);
      var part3 = ((int >> 16) & 255);
      var part4 = ((int >> 24) & 255);
      response.ipv4 = part4 + "." + part3 + "." + part2 + "." + part1;
      // Bind data to update form
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