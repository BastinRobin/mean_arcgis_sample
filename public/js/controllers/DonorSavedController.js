angular.module("bloodonateApp").controller("DonorSavedController",
function($scope, transfer) {
    var saved = transfer.saved
    $scope.uniqueLink = saved.uniqueLink
    $scope.data = saved.data
})