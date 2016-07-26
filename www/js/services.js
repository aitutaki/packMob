/**
 * Created by barry on 26-Jul-16.
 */

angular.module('starter.services', [])
    .factory("DespNotes", ["$q", function($q) {
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
            var deferred = $q.defer();
            deferred.resolve(data);
            return (deferred.promise);
        }


        return {
            getDespatchNote: _getDespatchNote
        };
    }]);