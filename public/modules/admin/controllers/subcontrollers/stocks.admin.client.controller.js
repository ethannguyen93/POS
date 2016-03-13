'use strict';

angular.module('admin').controller('Stocks.AdminController', ['$scope', '$state', '$stateParams', 'Authentication', 'RetrieveEmployee', 'RetrieveStock', 'MainpageServices',
    'LoginpageService', '$q', 'AdminLoginPageServices', 'AdminPageServices', 'Upload', '$modal', '$http',
    function ($scope, $state, $stateParams, Authentication, RetrieveEmployee, RetrieveStock, MainpageServices,
              LoginpageService, $q, AdminLoginPageServices, AdminPageServices, Upload, $modal, $http) {
        $scope.gridOptions = {
            rowHeight: 120,
            columnFooterHeight: 60,
            showColumnFooter: true,
            enableFiltering: true,
            enablePaginationControls: false,
            paginationPageSize: 7,
            data: 'data.items'
        };
        $scope.data = {
            new: {
                name: '',
                cat: '',
                stockPrice: '',
                quantity: 0,
                image: '',
                price: '',
                desc: ''
            },
            items: [],
            categories: [],
            isError: false,
            errorMessage: ''
        };

        $scope.onFileSelect = function(item, image) {
            if (image !== undefined){
                if (angular.isArray(image)) {
                    image = image[0];
                }

                if (image.type !== 'image/png' && image.type !== 'image/jpeg') {
                    alert('Only PNG and JPEG are accepted.');
                    return;
                }

                $scope.uploadInProgress = true;
                $scope.uploadProgress = 0;

                Upload.upload({
                    url: 'stocks/upload',
                    method: 'POST',
                    file: image,
                    data: item
                }).success(function(response) {
                    item.image = response;
                    var random = (new Date()).toString();
                    item.image = item.image + "?cb=" + random;
                })
            }
        };

        $scope.getAllItem = function(){
            var deferred = $q.defer();
            var body = {
                type: 'getAllItem'
            };
            RetrieveStock.load(body, function(response){
                $scope.data.items = response;
                deferred.resolve(response);
            });
            return deferred.promise;
        };
        $scope.getAllCategory = function(){
            var deferred = $q.defer();
            var body = {
                type: 'getAllCategory'
            };
            RetrieveStock.load(body, function(response){
                $scope.data.categories = response;
                deferred.resolve(response);
            });
            return deferred.promise;
        };
        $scope.verifyModal = function () {
            var deferred = $q.defer();
            var editorInstance = $modal.open({
                animation: true,
                windowClass: 'modal-fullwindow',
                templateUrl: 'modules/admin/views/subviews/modals/verifyModal.client.view.html',
                controller: 'logoutCtrl'
            });
            editorInstance.result.then(function (response) {
                deferred.resolve(response);
            });
            return deferred.promise;
        };
        $scope.removeItem = function (item) {
            $scope.verifyModal().then(function(response){
                if (response === 'yes'){
                    var body = {
                        type: 'removeItem',
                        _id: item._id
                    };
                    RetrieveStock.load(body, function(response){
                        $scope.data.items = _.without($scope.data.items, _.findWhere($scope.data.items, {_id: item._id}));
                    });
                }
            });
        };
        $scope.addItem = function () {
            if ($scope.data.new.name === undefined ||
                $scope.data.new.name === '' ||
                $scope.data.new.cat.name === undefined ||
                $scope.data.new.cat.name === '' ||
                $scope.data.new.quantity === undefined ||
                $scope.data.new.quantity === '' ||
                $scope.data.new.stockPrice === undefined ||
                $scope.data.new.stockPrice === '' ||
                $scope.data.new.price === undefined ||
                $scope.data.new.price === '' ||
                $scope.data.new.desc === undefined ||
                $scope.data.new.desc === ''
            ) {
                $scope.data.isError = true;
                $scope.data.errorMessage = 'Please fill all box below';
            } else if (_.find($scope.data.items, function (item) {
                    return $scope.data.new.name === item.name
                        && $scope.data.new.cat.name === item.cat
                }) === undefined) {
                var body = {
                    type: 'addItem',
                    name: $scope.data.new.name,
                    category: $scope.data.new.cat.name,
                    quantity: parseInt($scope.data.new.quantity),
                    stockPrice: parseFloat($scope.data.new.stockPrice),
                    price: parseFloat($scope.data.new.price),
                    desc: $scope.data.new.desc
                };
                RetrieveStock.load(body, function(response){
                    $scope.data.items.push(response[0]);
                });
            } else {
                $scope.admin.category.isError = true;
                $scope.admin.category.errorMessage = 'This item is already existed';
            }
        };
        $scope.printBarcode = function(item){
            $http({
                method  : 'GET',
                url     : './label/printLabel.label',
                timeout : 10000,
                params  : {},  // Query Parameters (GET)
                transformResponse : function(data) {
                    return data;
                }
            }).success(function(data, status, headers, config) {
                var printers = dymo.label.framework.getPrinters();
                var labelXml = data;
                var label = dymo.label.framework.openLabelXml(labelXml);
                label.setObjectText("Top Barcode", item.barcode);
                label.setObjectText("Bottom Barcode", item.barcode);
                label.setObjectText("Top Text", '$'+item.price.toFixed(2)+'\n' + item.desc);
                label.setObjectText("Bottom Text", '$'+item.price.toFixed(2)+'\n' + item.desc);
                //debugger;
                console.log(printers);
                label.print(printers[0].name);
            }).error(function(data, status, headers, config) {
                console.log('error');
            });
        };
        $scope.reset = function () {
            $scope.data.isError = false;
            $scope.data.errorMessage = '';
        };
        $scope.gridOptions.onRegisterApi = function (gridApi) {
            $scope.gridApi = gridApi;
            gridApi.edit.on.beginCellEdit($scope, function () {
                $scope.data.isError = false;
                $scope.data.errorMessage = '';
            });
            gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
                var field = colDef.field;
                var tmp = _.filter($scope.data.items, function (item) {
                    return (item.name === rowEntity.name
                    && item.category === rowEntity.category)
                });
                if (tmp.length > 1) {
                    $scope.data.isError = true;
                    $scope.data.errorMessage = 'This item is already existed';
                    rowEntity[field] = oldValue;
                } else {
                    var body = {
                        type: 'updateItemField',
                        name: rowEntity.name,
                        desc: rowEntity.desc,
                        id: rowEntity._id,
                        stockPrice: rowEntity.stockPrice,
                        price: rowEntity.price
                    };
                    RetrieveStock.load(body, function(response){

                    })
                }
            });
        };
        $scope.editQuantity = function(item){
            $scope.editQuantityModal(item).then(function(change){
                item.quantity += change;
            })
        };
        $scope.editQuantityModal = function(item){
            var deferred = $q.defer();
            var editorInstance = $modal.open({
                animation: true,
                windowClass: 'modal-fullwindow',
                templateUrl: 'modules/admin/views/partials/modal/editQuantityModal.client.view.html',
                controller: 'editQuantityCtrl',
                resolve: {
                    item: function () {
                        return item;
                    }
                }
            });
            editorInstance.result.then(function (change) {
                deferred.resolve(change);
            });
            return deferred.promise;
        };
        $scope.openImage = function(item){
            $modal.open({
                animation: true,
                windowClass: 'modal-image',
                templateUrl: 'modules/admin/views/partials/modal/imageViewerModal.client.view.html',
                controller: function($scope) {
                    $scope.image = item.image;
                }
            });
        };
        $scope.initItem = function () {
            $scope.getAllItem().then(function () {
                return $scope.getAllCategory();
            }).then(function(){
                $scope.gridOptions.columnDefs = [
                    {
                        name: 'Item name',
                        field: 'name',
                        footerCellTemplate: '<input ng-model="grid.appScope.data.new.name" ' +
                        'ng-change="grid.appScope.reset()" placeholder="Enter new item name"ng-pattern="/^.+$/"/>',
                        enableCellEdit: true
                    },
                    {
                        name: 'Category name',
                        field: 'category',
                        footerCellTemplate: '<select class="form-control" ng-model="grid.appScope.data.new.cat" ng-change="grid.appScope.reset()" ng-options="category as category.name for category in grid.appScope.data.categories"></select>',
                        enableCellEdit: false
                    },
                    {
                        name: 'Quantity',
                        field: 'quantity',
                        cellTemplate: '<div class="ui-grid-cell-contents ng-binding ng-scope">{{row.entity.quantity}}  <button type="button" class="btn btn-danger" ng-click="grid.appScope.editQuantity(row.entity)"> <span class="glyphicon glyphicon-pencil"></span> </button></div>',
                        footerCellTemplate: '<input ng-model="grid.appScope.data.new.quantity" ' +
                        'ng-change="grid.appScope.reset()" placeholder="Enter new quantity" ng-pattern="/^[0-9]+$/"/>',
                        enableCellEdit: false
                    },
                    {
                        name: 'Stock Price',
                        field: 'stockPrice',
                        cellFilter: 'priceFilter',
                        footerCellTemplate: '<input ng-model="grid.appScope.data.new.stockPrice" ' +
                        'ng-change="grid.appScope.admin.item.onchange()" placeholder="Enter new price" ng-pattern="/(^[0-9]+$)|(^[0-9]+[.]{1}[0-9]+$)/"/>'
                    },
                    {
                        name: 'Retail Price',
                        field: 'price',
                        cellFilter: 'priceFilter',
                        footerCellTemplate: '<input ng-model="grid.appScope.data.new.price" ' +
                        'ng-change="grid.appScope.reset()" placeholder="Enter new price" ng-pattern="/(^[0-9]+$)|(^[0-9]+[.]{1}[0-9]+$)/"/>'
                    },
                    {
                        name: 'Barcode',
                        field: 'barcode',
                        enableCellEdit: false,
                        enableFiltering: true
                    },
                    {
                        name: 'Description',
                        field: 'desc',
                        enableCellEdit: true,
                        enableFiltering: false,
                        footerCellTemplate: '<input ng-model="grid.appScope.data.new.desc" ' +
                        'ng-change="grid.appScope.reset()" placeholder="Enter new desc"/>'
                    },
                    {
                        name: 'Print Barcode',
                        cellTemplate: '<a href="" ng-click="grid.appScope.printBarcode(row.entity)"> <span class="glyphicon glyphicon-print"></span> </a>',
                        enableCellEdit: false,
                        enableFiltering: false
                    },
                    {
                        name: 'Image',
                        field: 'image',
                        cellTemplate: '<img data-ng-src="/upload/{{row.entity.image}}" data-ng-if="row.entity.image" height="100" width="100" ng-click="grid.appScope.openImage(row.entity)">',
                        enableCellEdit: false,
                        enableFiltering: false
                    },
                    {
                        name: 'Upload',
                        field: 'upload',
                        cellTemplate: '<input type="file" ngf-select="grid.appScope.onFileSelect(row.entity, $files)" accept="image/png, image/jpeg">',
                        enableFiltering: false,
                        enableCellEdit: false
                    },
                    {
                        name: 'Add/Remove',
                        enableFiltering: false,
                        cellTemplate: '<a href="" ng-click="grid.appScope.removeItem(row.entity)"' +
                        '><span class="glyphicon glyphicon-remove"></span></a>',
                        enableCellEdit: false,
                        footerCellTemplate: '<a href="" ng-click="grid.appScope.addItem()"> <span class="glyphicon glyphicon-plus"></span> </a>'
                    }
                ];
            });
        };

    }]);
