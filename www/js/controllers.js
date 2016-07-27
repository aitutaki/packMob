angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $ionicPlatform) {

})

.controller('DespatchNoteCtrl', function($scope, $stateParams, DespNotes, $cordovaBarcodeScanner, Storage) {
  var _this = this;
  this.imgUrl = 'http://www.trilanco.com/userFiles/eShop/images/detail/';

  function init () {
    DespNotes.getDespatchNote().then(function(data){
      _this.data = data.data;
    });
  }

  function findProductAndIncrement(barCodeID) {
    var products = (_this.data || {}).items || [];
    var product;

    for (var i=0; i < products.length; i++) {
      product = products[i];
      if (product.PRODUCT_KEY3 == barCodeID) {
        product.ACTUAL_QUANTITY = product.ACTUAL_QUANTITY || 0;
        product.ACTUAL_QUANTITY++;
        alert("Qty is now" + product.ACTUAL_QUANTITY);
        break;
      }
    }
  }

  this.saveDN = function() {
    Storage.set("data", _this.data, true);
  };

  this.barCodify = function() {
    try {
      $cordovaBarcodeScanner.scan()
        .then(function(data) {
          // alert(JSON.stringify(data));
          // data.text
          if (data.cancelled === 0) {
            if (data.text) {
              // Check for the product on the DN
              findProductAndIncrement(data.text);
            }
            else {
              throw "Unable to read barcode.";
            }
          }
        })
        .catch(function(e) {
          alert(e);
        });
    }
    catch(e) {
      alert(e);
    }
  }

  init();
})

.controller('CloseDespatchNoteCtrl', function($scope, $stateParams) {
    this.action = $stateParams.action;
})

.controller('HomeCtrl', function($scope, $stateParams, $http, $ionicPlatform, $ionicLoading, Auth) {
    var _this = this;
    // this.packer = 'barry';
    this.packers = [];
    this.login = function(){};

    Auth.getPackers().then(function(data) {
      _this.packers = data;
    });

    $ionicPlatform.ready(function() {
      // alert("ready");
      if (ionic.Platform.isWebView()) {
        $ionicLoading.show({
          template: '<ion-spinner icon="ios-small"></ion-spinner><br />Authenticating...'
        }).then(function(){
           Auth.authenticate().then(function() {
             // We Need to force a digest cycle but the Windows Auth is outside
             // of Angular.
             $ionicLoading.hide();
             $scope.$apply();
           }, function() {
             // alert("uh oh");
             $ionicLoading.hide();
             $scope.$apply();
           });
        });
      }
      else {
        Auth.loggedIn = true;
      }
    });

    this.isLoggedIn = Auth.isLoggedIn;
    this.authenticate = Auth.authenticate;
    this.setPacker = Auth.setPacker;
});
