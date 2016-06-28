'use strict';

angular.module('admin').controller('AdminController', [
    '$scope', '$state', '$stateParams', 'Authentication', 'RetrieveEmployee', 'RetrieveInventory', 'MainpageServices',
    'LoginpageService', '$q', 'AdminLoginPageServices', 'AdminPageServices', '$modal', '$compile', 'uiCalendarConfig',
    'RetrieveAppointments', 'FTScroller', 'Config',
    function ($scope, $state, $stateParams, Authentication, RetrieveEmployee, RetrieveInventory, MainpageServices,
              LoginpageService, $q, AdminLoginPageServices, AdminPageServices, $modal, $compile, uiCalendarConfig,
              RetrieveAppointments, FTScroller, Config) {
        $scope.config = Config;
        /*Admin Main Page*/
        $scope.admin = {
            page: 'setting',
            setting: {
                name: '',
                passcode: '',
                newpasscode: '',
                newpasscode_repeat: '',
                isError: false,
                errorMessage: ''
            },
            employee: {
                isError: false,
                errorMessage: '',
                gridOptions: {
                    rowHeight: 60,
                    columnFooterHeight: 60,
                    showColumnFooter: true,
                    enableFiltering: true,
                    enablePaginationControls: false,
                    paginationPageSize: 10,
                    data: 'admin.employee.employees'
                },
                employees: [],
                newemployeename: '',
                newemployeepasscode: ''
            },
            category: {
                isError: false,
                errorMessage: '',
                gridOptions: {
                    rowHeight: 60,
                    columnFooterHeight: 60,
                    showColumnFooter: true,
                    enableFiltering: true,
                    enablePaginationControls: false,
                    paginationPageSize: 10,
                    data: 'admin.category.categories'
                },
                categories: [],
                newcategoryname: ''
            },
            giftcard: {
                isError: false,
                errorMessage: '',
                gridOptions: {
                    rowHeight: 60,
                    columnFooterHeight: 60,
                    enableFiltering: true,
                    enablePaginationControls: false,
                    paginationPageSize: 10,
                    data: 'admin.giftcard.giftcards'
                },
                giftcards: [],
                newgc: '',
                newgcprice: ''
            },
            report: {
                selectedEmployee: '',
                employees: [],
                customer:{
                    name: '',
                    id: ''
                },
                isError: false,
                errorMessage: '',
                gridOptions: {
                    columnDefs: [
                        {field: 'name'},
                        {field: 'gender', visible: false},
                        {field: 'company'}
                    ],
                    rowHeight: 60,
                    enablePaginationControls: false,
                    paginationPageSize: 10,
                    data: 'admin.report.reports'
                },
                reports: [],
                selectedOption: ''
            },
            item: {
                isError: false,
                errorMessage: '',
                gridOptions: {
                    rowHeight: 60,
                    columnFooterHeight: 60,
                    showColumnFooter: true,
                    enableFiltering: true,
                    enablePaginationControls: false,
                    paginationPageSize: 10,
                    data: 'admin.item.items'
                },
                items: [],
                newitemname: '',
                newitemprice: '',
                newcat: ''
            }
        };

        // Check State Parameters for user details, if empty go back to Login page
        if (!$stateParams.user) {
            $state.go('core.admin.login');
        } else {
            $scope.showContent = true;
            $scope.admin.setting.name = $stateParams.user.name;
            $scope.admin.setting.passcode = $stateParams.user.passcode;
        }

        /**
         *
         * @param item: decide which object to load
         */
        $scope.getAll = function (item) {
            var deferred = $q.defer();
            AdminPageServices.getAll($scope, item).then(function () {
                deferred.resolve();
            });
            return deferred.promise;
        };

        /*Scroller Initialization*/
        $scope.initFTScroller = FTScroller.initFTScroller;
        $scope.initFTScrollerGrid = FTScroller.initFTScrollerGrid;

    }]);
