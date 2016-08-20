angular.module("bloodonateApp")
.directive("donorForm", function() {
    return {
        restrict: "A",
        templateUrl: "/js/directives/donorForm.html",
        scope: true
    }
})
.directive("donorErrors", function() {
    return {
        restrict: "A",
        templateUrl: "/js/directives/donorErrors.html"
    }
})
.directive("icon", function() {
    return {
        restrict: "E",
        templateUrl: "js/directives/glyphicon.html",
        scope: {
            name: "@",
            text: "@"
        }
    }
})