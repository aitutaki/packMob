/**
 * Created by barry on 26-Jul-16.
 */

angular.module('starter.services', [])
.service("API", ["$http", function($http) {
  this.baseURL = "http://www.trilanco.com/userFiles/packAppy.php/";

  this.get = function(url) {
    return $http.get(baseURL + url);
  };

  this.post = function(url) {
    return $http.post(baseURL + url);
  };

  this.pull = function(url) {
    return $http.pull(baseURL + url);
  };
}])

.service("Storage", [function() {
  this.get = function(key) {
    return window.localStorage.getItem(key);
  };
  this.set = function(key, val, stringify) {
    if (stringify) val = JSON.stringify(val);
    window.localStorage.setItem(key, val);
  };
}])

.service("Auth", ["$q", "API", "Storage", function($q, API, Storage) {
  var _this = this;
  var baseURL = API.baseURL; //"http://www.trilanco.com/userFiles/dashAppy.php/loadDN/2165657";

  this.loggedIn = false;
  this.isLoggedIn = function() { return _this.loggedIn; };
  this.getPackers = function() {
    var data = [
      { id: 1, name: "Barry" },
      { id: 2, name: "Tom" }
    ];

    var def = $q.defer();
    def.resolve(data);
    return def.promise;
  };

  this.setPacker = function(packerID) {
    Storage.set("packer", packerID);
  };

  this.authenticate = function() {
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

.factory("DespNotes", ["$q", "Storage", function($q, Storage, API) {
    var data = {
        'DESPATCH_NUM':455,
        'ADDRESS1':'United Farmers Ltd',
        'ADDRESS2':'3B United Ormiston Terrace',
        'ADDRESS3':'Edinburgh',
        'ADDRESS4':'Lothian',
        'ADDRESS5':'',
        'ADDRESS6':'',
        'POSTCODE':'EH12 7SJ',
        'WEIGHT':'3kg',
        'DESPATCH_TYPE':'',
        'SPECIAL_INSTRUCTIONS':"Don't fucking drop anything",
        'items':[
            {
                'PRODUCT_CODE':'QAY0380',
                'LONG_DESCRIPTION_1':'Gallop Horse Shampoo',
                'TARGET_LOCATION':'2G2BIN02',
                'TARGET_QUANTITY':2,
                'ACTUAL_QUANTITY':0,
                'UNIT_CODE':'EACH',
                'BATCH_ID':'',
                'EXPIRY_DATE':'',
                'PRODUCT_KEY3':'123456'

            },
            {
                'PRODUCT_CODE':'QAY0145',
                'LONG_DESCRIPTION_1':'Canter Mane & Tail Conditioner X 500ml',
                'TARGET_LOCATION':'2G2BIN22',
                'TARGET_QUANTITY':1,
                'ACTUAL_QUANTITY':0,
                'UNIT_CODE':'EACH',
                'BATCH_ID':'',
                'EXPIRY_DATE':'',
                'PRODUCT_KEY3':'654321'
            },
            {
                'PRODUCT_CODE':'LEO3060',
                'LONG_DESCRIPTION_1':'Phaser C/w Spray X 500ml HSE 8030',
                'TARGET_LOCATION':'2G2BULK02',
                'TARGET_QUANTITY':6,
                'ACTUAL_QUANTITY':0,
                'UNIT_CODE':'EACH',
                'BATCH_ID':'',
                'EXPIRY_DATE':'',
                'PRODUCT_KEY3':'abcdef'

            },
            {
                'PRODUCT_CODE':'BAR0029',
                'LONG_DESCRIPTION_1':'Lavender Wash X 500ml',
                'TARGET_LOCATION':'2X2BIN02',
                'TARGET_QUANTITY':3,
                'ACTUAL_QUANTITY':0,
                'UNIT_CODE':'EACH',
                'BATCH_ID':'B_2EEP',
                'EXPIRY_DATE':'10/05/2017',
                'PRODUCT_KEY3':'fedcba'
            }

    ]};

    function _getDespatchNote (despatchNote) {
        // In order to get the latest DN, check if we've got one stored on-device.
        var deferred = $q.defer();

        if (despatchNote) {
          return APP.get("/despatchnote/" + despatchnote);
        }
        else {
          var rec = Storage.get("data");
          if (rec) {
            rec = JSON.parse(rec);
            deferred.resolve({data:rec});
            return (deferred.promise);
          }
          else {
            // API.get("/despatchnote")
            deferred.resolve({data: data});
            return (deferred.promise);
          }
        }
    }

    return {
        getDespatchNote: _getDespatchNote
    };
}]);
