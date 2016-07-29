/**
 * Created by barry on 26-Jul-16.
 */

angular.module('starter.services', [])
.service("API", ["$http", "Auth", function($http, Auth) {
  this.baseURL = "http://10.0.0.198/API/packAppy.php";

  this.get = function(url) {
    return $http.get(this.baseURL + url, {headers: { "username": Auth.currentPacker() }});
  };

  this.post = function(url) {
    return $http.post(this.baseURL + url);
  };

  this.pull = function(url) {
    return $http.pull(this.baseURL + url);
  };
}])

.service("Storage", [function() {
  this.get = function(key, parseJSON) {
    var val = window.localStorage.getItem(key) || "";
    try
    {
      if (parseJSON && val) val = JSON.parse(val);
    } catch (e) {
      val = "";
    }
    return val;
  };

  this.set = function(key, val, stringify) {
    if (stringify) val = JSON.stringify(val);
    window.localStorage.setItem(key, val);
  };

  this.del = function(key) {
    window.localStorage.removeItem(key);
  };
}])

.service("Packers", ["$q", "API", "Storage", "Auth", function($q, API, Storage, Auth) {
  var _this = this;
  this.packer = Storage.get("packer");

  this.getPackers = function() {
    var def = $q.defer();
    var local = Storage.get("packers", true);

    // Attempt to get the most up-to-date list of packers from the API first.
    API.get("/getpackers").then(
      function(data) {
        if (data.data) {
          def.resolve({data: data.data});
        }
        else {
          throw "Cannot get remote packers.";
        }
      },
      function(err) {
        def.resolve({data: {packers: local || []}});
      });
    return def.promise;
  };

  this.setPacker = Auth.setPacker;
  this.currentPacker = Auth.currentPacker;
}])

.service("Auth", ["$q", "Storage", function($q, Storage) {
  var _this = this;
  var packer = Storage.get("packer");

  this.loggedIn = false;
  this.isLoggedIn = function() { return _this.loggedIn; };

  this.currentPacker = function() { return packer; };
  this.setPacker = function(packerID) {
    Storage.set("packer", packerID);
    Storage.del("despatchNote");
    packer = packerID;
  }

  // WinAuth stuff we don't use any more.
  this.authenticate = function() {
    var baseURL = "";
    var def = $q.defer();
    authDialog.authenticate(baseURL,
      function () {
        _this.loggedIn = true;
        def.resolve();
      },
      function() {
        _this.loggedIn = false;
        def.reject();
      });
    return def.promise;
  };
}])

.factory("DespNotes", ["$q", "Storage", "API", function($q, Storage, API) {
    var _data = {};
    var products = {};

    function _setupProducts(items) {
      for (var key in items) {
        var item = items[key];
        products[item.PRODUCT_KEY3] = item;
      }
      return products;
    }

    function _getDespatchNote (despatchNote) {
        // In order to get the latest DN, check if we've got one stored on-device.
        var deferred = $q.defer();

        // Get a locally stored D/N if we have one.
        var local = Storage.get("despatchNote", true);

        if (despatchNote) {
          // Specific D/N Requested
          API.get("/despatchnote/" + despatchNote).then(
            function(data) {
              var dn;
              if (data && data.data)
              {
                dn = data.data.despatchnote;
                //if (dn.STATUS == 0) {
                  Storage.set("despatchNote", dn, true);
                  _data = dn;
                  _setupProducts(dm.items);
                  deferred.resolve(dn);
                /*
                }
                else {
                  deferred.reject();
                }
                */
              }
              else {
                deferred.reject();
              }
            },
          function(err) {
            deferred.reject();
          });
          return deferred.promise;
        }
        else {
          API.get("/despatchnote").then(
            function(data) {
              var dn;
              if (data && data.data && data.data.despatchnote) {
                dn = data.data.despatchnote;
                if (dn.DESPATCH_NUM == local.DESPATCH_NUM) {
                  // Use the local one.
                  _data = local;
                  _setupProducts(local.items);
                  deferred.resolve(local);
                }
                else {
                  _data = dn;
                  Storage.set("despatchNote", dn, true);
                  _setupProducts(dn.items);
                  deferred.resolve(dn);
                }
              }
              else {
                deferred.reject();
              }
            },
          function(err) {
            deferred.reject();
          });

          return (deferred.promise);
        }
    }

    function _saveDespatchNote(data) {
      var deferred = $q.defer();
      Storage.set("despatchNote", data, true);
      return deferred.promise;
    }

    function _findProductByBarCodeID(despNote, barCodeID) {
      var ret = null;
      var products = despNote.items; //(despNote || {}).items || [];
      var product;
      alert("Looping thru products... " + products.length);
      for (var i=0; i < products.length; i++) {
        alert("interation " + i);
        alert(JSON.stringify(product));
        product = products[i];
        if (product.PRODUCT_KEY3 == barCodeID) {
          ret = product;
          break;
        }
      }
      return ret;
    }

    function _incrementProductQuanty(barcodeID, despNote) {
      var product;
      var def = $q.defer();

      product = products[barcodeID];
      if (product) {
        product.ACTUAL_QUANTITY = product.ACTUAL_QUANTITY || 0;
        product.ACTUAL_QUANTITY++;
        Storage.set("despatchNote", despNote);
        def.resolve(product);
      }
      else {
        def.reject();
      }

      return def.promise;
    }

    function _updateProductQuanty() {
      var def = $q.defer();

      Storage.set("despatchNote", despNote);
      def.resolve(product);

      return def.promise;
    }

    return {
        getDespatchNote: _getDespatchNote,
        saveDespatchNote: _saveDespatchNote,
        incrementProductQuanty: _incrementProductQuanty,
        updateProductQuanty: _updateProductQuanty,
        currentDespNote: function() { return _data; }
    };
}]);
