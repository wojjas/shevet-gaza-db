(function () {
    'use strict';

    //ngTable constructor takes two objects, parameters and settings.
    app.factory('tableService', TableService);

    TableService.$inject = ['$filter', 'ngTableParams'];

    /* @ngInject */
    function TableService($filter, ngTableParams) {
        var table;
        var data = [];           //The array with all the data.
        var service = {
            updateData: updateData,
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
                total: data.length,
                getData: function($defer, params){
                    // use build-in angular filter
                    var filteredData = params.filter() ?
                        $filter('filter')(data, params.filter()) :
                        data;
                    var orderedData = params.sorting() ?
                        $filter('orderBy')(filteredData, params.orderBy()) :
                        filteredData;

                    params.total(orderedData.length); //Set total for recalculate pagination
                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            },
            init: init
        };

        return service;

        ////////////////

        function init(docs) {
            data = docs;
            table = new ngTableParams(service.parameters, service.settings);
            return table;
        }
        function updateData(docs){
            data = docs;
            table.reload();
        }
    }
})();