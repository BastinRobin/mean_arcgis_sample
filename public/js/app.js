angular.module("bloodonateApp", ["ngRoute"])
  .config(function($routeProvider, $locationProvider) {
    $routeProvider
      .when("/", {
        template: "index"
      })
      .when("/donor/success", {
        templateUrl: "views/donorSaved.html",
        controller: "DonorSavedController"
      })
      .when("/donor/find/:id", {
        templateUrl: "views/donorFind.html",
        controller: "DonorFindController"
      })
      .when("/donor/:id" , {
        templateUrl: "views/donorUpdate.html",
        controller: "DonorUpdateController"
      })
      // ArcGIS popup button click (arcgis.js)
      .when("/@:x::y", {
        templateUrl: "views/donorCreate.html",
        controller: "DonorCreateController"
      })
    $locationProvider.html5Mode(true);
  })
  .factory("transfer", function () {
  return {
    data: {},
    validation_errors: null
  }
})