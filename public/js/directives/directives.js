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
        templateUrl: "/js/directives/donorErrors.html",
        scope: true
    }
})
.directive("panel", function() {
    return {
        restrict: "E",
        templateUrl: "js/directives/panel.html",
        scope: {
            type: "@",
            body: "@",
            title: "@"  
        }
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