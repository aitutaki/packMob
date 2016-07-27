angular.module('starter.controllers', []).controller('HomeCtrl', function($scope, $stateParams, $http, $ionicPlatform, Auth) {
    this.packer = 'barry';
    this.login = function(){};

    $ionicPlatform.ready(function() {
      // alert("ready");
      Auth.authenticate().then(function() {
        $scope.$apply();
      }, function() {
        alert("uh oh");
      });
    });

    this.isLoggedIn = Auth.isLoggedIn;
    this.authenticate = Auth.authenticate;
});
