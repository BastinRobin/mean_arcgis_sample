angular.module("bloodonateApp", ["ngRoute"])
  .config(function($routeProvider, $locationProvider) {
    $routeProvider
      .when("/", {
        templateUrl: "views/index.html"
      })
      .when("/donor/success", {
        templateUrl: "views/donorSaved.html",
        controller: "DonorSavedController"
      })
      .when("/donor/notfound", {
        templateUrl: "views/donorNotFound.html"
      })
      .when("/donor/deleted", {
        templateUrl: "views/donorDeleted.html"
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