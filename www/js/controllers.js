angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $ionicPlatform) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});



  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

    .controller('DespatchNoteCtrl', function($scope, $stateParams, DespNotes, $cordovaBarcodeScanner) {
      var _this = this;
      this.imgUrl = 'http://www.trilanco.com/userFiles/eShop/images/detail/';


        function init () {
          DespNotes.getDespatchNote().then(function(data){
            _this.data = data;
          });
        }

        function findProductAndIncrement(barCodeID) {
          var products = (_this.data || {}).items || [];
          var product;

          alert("BC is " + barCodeID);
          for (var i=0; i < products.length; i++) {
            product = products[i];
            alert(product.PRODUCT_KEY3);
            if (product.PRODUCT_KEY3 == barCodeID) {
              product.ACTUAL_QUANTITY = product.ACTUAL_QUANTITY || 0;
              product.ACTUAL_QUANTITY++;
              alert("Qty is now" + product.ACTUAL_QUANTITY);
              break;
            }
          }
        }

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

    .controller('HomeCtrl', function($scope, $stateParams, $http, $ionicPlatform, Auth) {
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
