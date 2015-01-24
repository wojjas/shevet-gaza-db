(function () {
    'use strict';

    //Uses ngTable and the doctorsProxy to handle the data.
    //ngTable constructor takes two objects, parameters and settings.
    app.factory('doctorsTable', DoctorsTable);

    DoctorsTable.$inject = ['$filter', 'ngTableParams', 'doctors'];

    /* @ngInject */
    function DoctorsTable($filter, ngTableParams, doctorsProxy) {
        var doctors = [];           //The array with all the doctors.
        var service = {
            parameters: {
                page: 1,
                count: 17,
                filter: {
                },
                sorting: {
                    name: 'asc'     //Initial sorting column and order.
                }
            },
            settings: {
                filterDelay:200,
                total: doctors.length,
                getData: function($defer, params){
                    // use build-in angular filter
                    var filteredData = params.filter() ?
                        $filter('filter')(doctors, params.filter()) :
                        doctors;
                    var orderedData = params.sorting() ?
                        $filter('orderBy')(filteredData, params.orderBy()) :
                        filteredData;

                    params.total(orderedData.length); //Set total for recalculate pagination
                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            },
            createTable: createTable
        };

        return service;

        ////////////////

        function createTable(docs) {
            doctors = docs;
            return new ngTableParams(service.parameters, service.settings);
        }
    }
})();