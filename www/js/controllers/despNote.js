angular.module('starter.controllers', []).controller('DespatchNoteCtrl', function($scope, $stateParams, DespNotes, $cordovaBarcodeScanner, Storage) {
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

      for (var i=0; i < products.length; i++) {
        product = products[i];
        if (product.PRODUCT_KEY3 == barCodeID) {
          product.ACTUAL_QUANTITY = product.ACTUAL_QUANTITY || 0;
          product.ACTUAL_QUANTITY++;
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
});
