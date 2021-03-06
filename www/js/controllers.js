angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $ionicPlatform) {

})

.controller('DespatchNoteCtrl', function($scope, $stateParams, DespNotes, $cordovaBarcodeScanner, Storage, $timeout) {
  var _this = this;
  this.imgUrl = 'http://www.trilanco.com/userFiles/eShop/images/detail/';

  function init () {
    /*
    DespNotes.getDespatchNote().then(function(data){
      _this.data = data.data;
    });
    */
    _this.data = DespNotes.currentDespNote(); //Storage.get("despatchNote", true);
  }

  this.updateProductQuanty = function(barcodeID, qty) {
    DespNotes.updateProductQuanty(barcodeID, qty, _this.data);
  }

  this.saveDN = function() {
    DespNotes.saveDespatchNote(_this.data);
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
              DespNotes.incrementProductQuanty(data.text, _this.data).then(function(product) {
                $ionicLoading.show({
                  template: 'Updated ' + product.LONG_DESCRIPTION_1 + ' to ' + product.ACTUAL_QUANTITY
                }).then(function(){
                  $timeout(function() {
                    $ionicLoading.hide();
                  }, 1000);
                });
              });
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
  };

  init();
})

.controller('CloseDespatchNoteCtrl', function($scope, $stateParams) {
    this.action = $stateParams.action;
})

.controller('HomeCtrl', ["$scope", "$state", "$stateParams", "$location", "$http", "$ionicPlatform", "$ionicLoading", "DespNotes", "Auth", "Packers", "Storage", "$cordovaBarcodeScanner", function($scope, $state, $stateParams, $location, $http, $ionicPlatform, $ionicLoading, DespNotes, Auth, Packers, Storage, $cordovaBarcodeScanner) {
    var _this = this;

    // Load the last logged in packer.
    this.packer = Storage.get("packer");
    if (!!this.packer) this.packer = this.packer;

    this.packers = [];
    this.login = function(){};

    function _requestDN() {
      $ionicLoading.show({
        template: '<ion-spinner icon="ios-small"></ion-spinner>'
      }).then(function(){
        DespNotes.getDespatchNote().then(
          function(data) {
            $state.go("app.despatchNote");
            $ionicLoading.hide();
          },
          function(e) {
            $ionicLoading.hide();
            alert("Cannot get next DN. " + e);
          });
        });
    }

    function _barCodify (cb) {
      try {
        $cordovaBarcodeScanner.scan()
          .then(function(data) {
            if (data.cancelled == 0) {
              if (data.text) {
                cb && cb(data.text);
              }
              else {
                throw "Unable to read barcode.";
              }
            }
          })
          .catch(function(e) {
            alert("1 ERR:" + e);
          });
      }
      catch(e) {
        alert("2 ERR:" + e);
      }
    }

    this.scanDN = function() {
      _barCodify(function(barCodeID) {
        // Check for the product on the DN
        $ionicLoading.show({
          template: '<ion-spinner icon="ios-small"></ion-spinner>'
        }).then(function(){
          DespNotes.getDespatchNote(barCodeID).then(
            function(data) {
              $state.go("app.despatchNote");
              $ionicLoading.hide();
            },
            function() {
              $ionicLoading.hide();
              alert("Unable to get D/N.");
            });
        });
      });
    };

    this.scanPacker = function($event) {
      $event.stopImmediatePropagation();
      $event.preventDefault();

      _barCodify(function(barCodeID) {
        _this.packer = barCodeID;
        Auth.setPacker(barCodeID);
      });
    };

    $ionicPlatform.ready(function() {
      $ionicLoading.show({
        template: '<ion-spinner icon="ios-small"></ion-spinner>'
      }).then(function(){
        // Get the list of packers.
        Packers.getPackers().then(
          function(data) {
            _this.packers = data.data.packers || [];
            $ionicLoading.hide();
          },
        function(err) {
          $ionicLoading.hide();
        });
      });
    });

    this.isLoggedIn = Auth.isLoggedIn;
    this.authenticate = Auth.authenticate;
    this.setPacker = Packers.setPacker;
    this.requestDN = _requestDN;
}]);
