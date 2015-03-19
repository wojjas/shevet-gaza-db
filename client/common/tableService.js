(function () {
    'use strict';

    //ngTable constructor takes two objects, parameters and settings.
    angular.module('gdCommon').factory('tableService', TableService);

    TableService.$inject = ['$filter', 'ngTableParams'];

    /* @ngInject */
    function TableService($filter, ngTableParams) {

       function TableServiceInstance(tableData){
           this.table;
           this.data = tableData;           //The array with all the data.

           this.parameters = {
               page: 1,
                   count: 17,
                   filter: {
               },
               sorting: {
                   name: 'asc'     //Initial sorting column and order.
               }
           };
           this.settings = {
               filterDelay: 200,
               total: this.data.length,
               getData: function ($defer, params) {
                   // use build-in angular filter
                   var filteredData = params.filter() ?
                       $filter('filter')(TableServiceInstance.prototype.data, params.filter()) :
                       this.data;
                   var orderedData = params.sorting() ?
                       $filter('orderBy')(filteredData, params.orderBy()) :
                       filteredData;

                   params.total(orderedData.length); //Set total for recalculate pagination
                   $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
               }
           };
       };
       TableServiceInstance.prototype.updateData = function(docs){
           TableServiceInstance.prototype.data = docs;
           this.table.reload();

           return this.table;
       };
        TableServiceInstance.prototype.init = function(docs){
            TableServiceInstance.prototype.data = docs;
            this.table = new ngTableParams(this.parameters, this.settings);

            return this.table;
        };

        return {
            tableObject : TableServiceInstance
        }
    }
})();