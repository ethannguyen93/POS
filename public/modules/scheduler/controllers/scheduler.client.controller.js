'use strict';

angular.module('scheduler').controller('SchedulerController', [ '$scope', '$state', '$stateParams', 'Authentication', 'RetrieveEmployee', 'RetrieveInventory', 'MainpageServices',
    'LoginpageService', '$q', 'AdminLoginPageServices', 'AdminPageServices', '$modal', '$compile', 'uiCalendarConfig',
    'RetrieveAppointments', 'FTScroller', 'SchedulerServices',
    function($scope, $state, $stateParams, Authentication, RetrieveEmployee, RetrieveInventory, MainpageServices,
             LoginpageService, $q, AdminLoginPageServices, AdminPageServices, $modal, $compile, uiCalendarConfig,
             RetrieveAppointments, FTScroller, SchedulerServices) {
        /* config object */
        $scope.scheduler = {
            selectedEvent: false, //if user clicked on an event
            events: [],
            eventSources: [],
            employees: [],
            hourList: [],
            timeList: ['AM', 'PM'],
            new: {
                id: '',
                customer: {
                    name: '',
                    phone: '',
                    email: ''
                },
                assignedEmployee: {},
                open: false,
                date: new Date(),
                startTime: '12:00',
                startTimeList: 'AM',
                endTime: '12:00',
                endTimeList: 'AM',
                note: ''
            },
            selected: {
                id: '',
                customer: {
                    name: '',
                    phone: '',
                    email: ''
                },
                assignedEmployee: {},
                open: false,
                date: new Date(),
                startTime: '12:00',
                startTimeList: 'AM',
                endTime: '12:00',
                endTimeList: 'AM',
                note: ''
            }
        };
        $scope.addPaneHidden = true;

        //Init Scheduler page
        $scope.initScheduler = (function(){
            console.log('init Scheduler');
            /*Initialize all possible hours*/
            var hourList = [];
            for (var i = 0; i < 24; i++){
                var hour = Math.floor(i / 2) === 0 ? 12 : Math.floor(i / 2);
                ("0" + hour).slice(-2);
                var minute = i % 2 === 0 ? '00' : '30';
                hourList.push({value: hour + ':' + minute, disable: {start: false, end: false}});
            }
            $scope.scheduler.hourList = hourList;
            $scope.scheduler.events = [];
            $scope.scheduler.eventSources = [$scope.scheduler.events];
            var body = {
                'type': 'getAll'
            };
            RetrieveEmployee.load(body, function(response){
                _.each(response, function(employee){
                    $scope.scheduler.employees.push({id: employee._id, name: employee.name});
                });
                $scope.scheduler.new.assignedEmployee = $scope.scheduler.employees[0];
            });
            SchedulerServices.updateEvents(undefined , 'month', $scope.scheduler.events);
        })();

        //Change value of popup calendar setting
        $scope.openCalender = function(event){
            $scope.scheduler[event].open = !$scope.scheduler[event].open;
        };

        $scope.addNewEvent = function() {
            var startDate = new Date($scope.scheduler.new.date);
            var endDate = new Date($scope.scheduler.new.date);
            SchedulerServices.setHours(startDate, $scope.scheduler.new.startTime, $scope.scheduler.new.startTimeList);
            SchedulerServices.setHours(endDate, $scope.scheduler.new.endTime, $scope.scheduler.new.endTimeList);
            var body = {
                'type': 'add',
                customer: $scope.scheduler.new.customer,
                startTime: $scope.scheduler.new.startTime,
                startTimeList: $scope.scheduler.new.startTimeList,
                startDate: startDate,
                endTime: $scope.scheduler.new.endTime,
                endTimeList: $scope.scheduler.new.endTimeList,
                endDate: endDate,
                assignedEmployee: $scope.scheduler.new.assignedEmployee,
                note: $scope.scheduler.new.note
            };
            RetrieveAppointments.load(body, function(response){
                $scope.scheduler.events.push({
                    title: $scope.scheduler.new.assignedEmployee.name + ' - ' + $scope.scheduler.new.customer.name,
                    start: startDate,
                    end: endDate,
                    data: {
                        id: response[0]._id,
                        customer: $scope.scheduler.new.customer,
                        startTime: $scope.scheduler.new.startTime,
                        startTimeList: $scope.scheduler.new.startTimeList,
                        startDate: startDate,
                        endTime: $scope.scheduler.new.endTime,
                        endTimeList: $scope.scheduler.new.endTimeList,
                        endDate: endDate,
                        assignedEmployee: $scope.scheduler.new.assignedEmployee,
                        note: $scope.scheduler.new.note
                    }
                });
                $scope.scheduler.new.id = '';
                $scope.scheduler.new.assignedEmployee = $scope.scheduler.employees[0];
                $scope.scheduler.new.customer = {
                    name: '',
                    phone: '',
                    email: ''
                };
                $scope.scheduler.new.startTime = '12:00';
                $scope.scheduler.new.startTimeList = 'AM';
                $scope.scheduler.new.date = new Date();
                $scope.scheduler.new.startOpen = false;
                $scope.scheduler.new.endTime = '12:00';
                $scope.scheduler.new.endTimeList = 'AM';
                $scope.scheduler.new.endOpen = false;
                $scope.scheduler.new.note = '';

            });
        };

        $scope.updateEvent = function() {
            var event = _.find($scope.scheduler.events, function(e){
                return e.data.id === $scope.scheduler.selected.id;
            });
            var startDate = new Date($scope.scheduler.selected.date);
            var endDate = new Date($scope.scheduler.selected.date);
            SchedulerServices.setHours(startDate, $scope.scheduler.selected.startTime, $scope.scheduler.selected.startTimeList);
            SchedulerServices.setHours(endDate, $scope.scheduler.selected.endTime, $scope.scheduler.selected.endTimeList);
            var body = {
                type: 'update',
                id: event.data.id,
                customer: $scope.scheduler.selected.customer,
                startTime: $scope.scheduler.selected.startTime,
                startTimeList: $scope.scheduler.selected.startTimeList,
                startDate: startDate,
                endTime: $scope.scheduler.selected.endTime,
                endTimeList: $scope.scheduler.selected.endTimeList,
                endDate: endDate,
                assignedEmployee: $scope.scheduler.selected.assignedEmployee,
                note: $scope.scheduler.selected.note
            };
            RetrieveAppointments.load(body, function(){
                event.data.customer = $scope.scheduler.selected.customer;
                event.data.startTime = $scope.scheduler.selected.startTime;
                event.data.startTimeList = $scope.scheduler.selected.startTimeList;
                event.data.startDate = startDate;
                event.data.endTime = $scope.scheduler.selected.endTime;
                event.data.endTimeList = $scope.scheduler.selected.endTimeList;
                event.data.endDate = endDate;
                event.data.assignedEmployee = $scope.scheduler.selected.assignedEmployee;
                event.data.note = $scope.scheduler.selected.note;
                event.title = event.data.assignedEmployee.name + ' - ' + event.data.customer.name;
                event.start = event.data.startDate;
                event.end = event.data.endDate;
            });
        };

        $scope.deleteEvent = function(){
            var event = _.find($scope.scheduler.events, function(e){
                return e.data.id === $scope.scheduler.selected.id;
            });
            var body = {
                type: 'delete',
                id: event.data.id
            };
            RetrieveAppointments.load(body, function(response){
                var index = _.findIndex($scope.scheduler.events, function(e){
                    return e.data.id === $scope.scheduler.selected.id;
                });
                $scope.scheduler.events.splice(index,1);
                $scope.scheduler.selectedEvent = false;
            });
        };
        /*Update ending hour after user have chosen start hour*/
        $scope.updateDisableHour = function(eventType, hourType){
            _.each($scope.scheduler.hourList, function(h){
                h.disable = {start: false, end: false};
            });
            var otherHourType = hourType === 'start' ? 'end' : 'start';
            var targetTime = $scope.scheduler[eventType][hourType + 'Time'];
            var targetList = $scope.scheduler[eventType][[hourType + 'TimeList']] === 'AM'? 0 : 24;
            var indexTarget = _.findIndex($scope.scheduler.hourList, function(h){
                    return h.value === targetTime;
                }) + targetList;
            var otherTime = $scope.scheduler[eventType][otherHourType + 'Time'];
            var otherList = $scope.scheduler[eventType][otherHourType + 'TimeList'] === 'AM'? 0 : 24;
            var indexOther = _.findIndex($scope.scheduler.hourList, function(h){
                    return h.value === otherTime;
                }) + otherList;
            if (indexTarget === indexOther){
                var startIndex = hourType === 'start' ? 0 : indexOther;
                var endIndex = hourType === 'start' ? indexOther : 23;
                for (var i = startIndex; i <= endIndex; i++){
                    $scope.scheduler.hourList[i].disable[otherHourType] = true;
                };
                hourType === 'start' ? indexOther++ : indexOther--;
                $scope.scheduler[eventType][otherHourType + 'Time'] = $scope.scheduler.hourList[indexOther % 24].value;
                $scope.scheduler[eventType][otherHourType + 'TimeList'] = $scope.scheduler.timeList[indexOther < 24 ? 0 : 1];
            }else if((indexTarget > indexOther && hourType === 'start') || (indexTarget < indexOther && hourType === 'end')){
                var startIndex = hourType === 'start' ? 0 : indexTarget;
                var endIndex = hourType === 'start' ? indexTarget : 23;
                for (var i = startIndex; i <= endIndex; i++){
                    $scope.scheduler.hourList[i].disable[otherHourType] = true;
                };
                indexOther = hourType === 'start' ? indexTarget + 1 : indexTarget - 1;
                $scope.scheduler[eventType][otherHourType + 'Time'] = $scope.scheduler.hourList[indexOther % 24].value;
                $scope.scheduler[eventType][otherHourType + 'TimeList'] = $scope.scheduler.timeList[indexOther < 24 ? 0 : 1];
            }else{
                var startIndex = hourType === 'start' ? 0 : indexTarget;
                var endIndex = hourType === 'start' ? indexTarget : 23;
                for (var i = startIndex; i <= endIndex; i++){
                    $scope.scheduler.hourList[i].disable[otherHourType] = true;
                };
            }
        };
        $scope.updateTimeList = function(){
            _.each($scope.scheduler.hourList, function(h){
                h.disable = {start: false, end: false};
            });
        };
        /* alert on eventClick */
        $scope.alertOnEventClick = function( date, jsEvent, view){
            $scope.scheduler.selectedEvent = true;
            $scope.scheduler.selected.id = date.data.id;
            $scope.scheduler.selected.assignedEmployee = date.data.assignedEmployee;
            $scope.scheduler.selected.customer = date.data.customer;
            $scope.scheduler.selected.startTime = date.data.startTime;
            $scope.scheduler.selected.startTimeList = date.data.startTimeList;
            $scope.scheduler.selected.date = date.data.startDate;
            $scope.scheduler.selected.startOpen = false;
            $scope.scheduler.selected.endTime = date.data.endTime;
            $scope.scheduler.selected.endTimeList = date.data.endTimeList;
            $scope.scheduler.selected.endOpen = false;
            $scope.scheduler.selected.note = date.data.note;
            // Hide add pane
            $scope.addPaneHidden = true;
            //Reset all disable selection
            _.each($scope.scheduler.hourList, function(h){
                h.disable = {start: false, end: false};
            });
        };
        /* alert on Drop */
        $scope.alertOnDrop = function(event, delta, revertFunc, jsEvent, ui, view){
            function updateDate(d){
                var newDate = moment(d);
                newDate.add(delta._data.days, 'days');
                newDate.add(delta._data.hours, 'hours');
                newDate.add(delta._data.milliseconds, 'milliseconds');
                newDate.add(delta._data.minutes, 'minutes');
                newDate.add(delta._data.months, 'months');
                newDate.add(delta._data.seconds, 'seconds');
                newDate.add(delta._data.years, 'years');
                return newDate;
            }
            function updateTime(d){
                var h = moment(d).hour() % 12;
                var m = moment(d).minute();
                if (m === 0){
                    m = '00';
                }else{
                    m = '30';
                }
                if (h === 0){
                    return '12:' + m;
                }else{
                    return h.toString() + ':' + m;
                }
            }
            function updateTimeList(d){
                var h = moment(d).hour();
                if (h < 12){
                    return 'AM';
                }else{
                    return 'PM';
                }
            }
            var startDate = updateDate(event.data.startDate);
            var endDate = updateDate(event.data.endDate);
            var startTime = updateTime(startDate);
            var endTime = updateTime(endDate);
            var startTimeList = updateTimeList(startDate);
            var endTimeList = updateTimeList(endDate);
            var body = {
                type: 'update',
                id: event.data.id,
                customer: event.data.customer,
                startTime: startTime,
                startTimeList: startTimeList,
                startDate: startDate._d,
                endTime: endTime,
                endTimeList: endTimeList,
                endDate: endDate._d,
                assignedEmployee: event.data.assignedEmployee,
                note: event.data.note
            };
            RetrieveAppointments.load(body, function(response){
                var updateEvent = _.find($scope.scheduler.events, function(e){
                    return e.data.id === event.data.id;
                });
                updateEvent.data.startTime = startTime;
                updateEvent.data.startTimeList = startTimeList;
                updateEvent.data.startDate = startDate._d;
                updateEvent.data.endTime = endTime;
                updateEvent.data.endTimeList = endTimeList;
                updateEvent.data.endDate = endDate._d;
                $scope.scheduler.selected.startTime = startTime;
                $scope.scheduler.selected.startTimeList = startTimeList;
                $scope.scheduler.selected.date = startDate._d;
                $scope.scheduler.selected.endTime = endTime;
                $scope.scheduler.selected.endTimeList = endTimeList;
            });
        };
        /* alert on Resize */
        $scope.alertOnResize = function(event, delta, revertFunc, jsEvent, ui, view ){
            function updateDate(d){
                var newDate = moment(d);
                newDate.add(delta._data.days, 'days');
                newDate.add(delta._data.hours, 'hours');
                newDate.add(delta._data.milliseconds, 'milliseconds');
                newDate.add(delta._data.minutes, 'minutes');
                newDate.add(delta._data.months, 'months');
                newDate.add(delta._data.seconds, 'seconds');
                newDate.add(delta._data.years, 'years');
                return newDate;
            }
            function updateTime(d){
                var h = moment(d).hour() % 12;
                var m = moment(d).minute();
                if (m === 0){
                    m = '00';
                }else{
                    m = '30';
                }
                if (h === 0){
                    return '12:' + m;
                }else{
                    return h.toString() + ':' + m;
                }
            }
            function updateTimeList(d){
                var h = moment(d).hour();
                if (h < 12){
                    return 'AM';
                }else{
                    return 'PM';
                }
            }
            var endDate = updateDate(event.data.endDate);
            var endTime = updateTime(endDate);
            var endTimeList = updateTimeList(endDate);
            var body = {
                type: 'update',
                id: event.data.id,
                customer: event.data.customer,
                startTime: event.data.startTime,
                startTimeList: event.data.startTimeList,
                startDate: event.data.startDate,
                endTime: endTime,
                endTimeList: endTimeList,
                endDate: endDate._d,
                assignedEmployee: event.data.assignedEmployee,
                note: event.data.note
            };
            RetrieveAppointments.load(body, function(response){
                var updateEvent = _.find($scope.scheduler.events, function(e){
                    return e.data.id === event.data.id;
                });
                updateEvent.data.endTime = endTime;
                updateEvent.data.endTimeList = endTimeList;
                updateEvent.data.endDate = endDate._d;
                $scope.scheduler.selected.endTime = endTime;
                $scope.scheduler.selected.endTimeList = endTimeList;
                $scope.scheduler.selected.date = endDate._d;
            });
        };
        $scope.removeEmailAndPhone = function(type){
            $scope.scheduler[type].customer.email = '';
            $scope.scheduler[type].customer.phone = '';
        };
        $scope.selectCustomer = function(type){
            $scope.selectCustomerModal().then(function(customer){
                if (customer !== undefined){
                    $scope.scheduler[type].customer = customer;
                }
            });
        };
        $scope.selectCustomerModal = function () {
            var deferred = $q.defer();
            var editorInstance = $modal.open({
                animation: true,
                windowClass: 'modal-fullwindow',
                templateUrl: 'modules/scheduler/views/modal/selectCustomerModal.client.view.html',
                controller: 'selectCustomerController'
            });
            editorInstance.result.then(function (customer) {
                deferred.resolve(customer);
            });
            return deferred.promise;
        };
        $scope.sendReminders = function(){
            $scope.sendReminderModal().then(function(response){
                if (response === 'yes'){
                    var body = {
                        type: 'sendReminders'
                    };
                    RetrieveAppointments.load(body, function(response){
                    });
                }
            });
        };
        $scope.sendReminderModal = function () {
            var deferred = $q.defer();
            var editorInstance = $modal.open({
                animation: true,
                windowClass: 'modal-fullwindow',
                templateUrl: 'modules/scheduler/views/modal/sendReminderModal.client.view.html',
                controller: 'sendReminderController'
            });
            editorInstance.result.then(function (response) {
                deferred.resolve(response);
            });
            return deferred.promise;
        };
        /* Add New Calendar Btn Event */
        $scope.alertOnAddBtnClicked = function() {
            $scope.addPaneHidden = !$scope.addPaneHidden;
        };
        /*This config has to be below the event functions*/
        $scope.uiConfig = {
            calendar:{
                height: 800,
                editable: true,
                header:{
                    left: '',
                    center: 'title',
                    right: ''
                },
                slotEventOverlap: false,
                slotWidth:  500,
                slotDuration: '00:15:00',
                eventClick: $scope.alertOnEventClick,
                eventDrop: $scope.alertOnDrop,
                eventResize: $scope.alertOnResize
            }
        };
        $scope.getPrev = function(calendar){
            uiCalendarConfig.calendars[calendar].fullCalendar('prev');
            SchedulerServices.updateEvents(calendar, uiCalendarConfig.calendars[calendar].fullCalendar('getView').type, $scope.scheduler.events);
        };
        $scope.getNext = function(calendar){
            uiCalendarConfig.calendars[calendar].fullCalendar('next');
            SchedulerServices.updateEvents(calendar, uiCalendarConfig.calendars[calendar].fullCalendar('getView').type, $scope.scheduler.events);
        };
        $scope.getToday = function(calendar){
            uiCalendarConfig.calendars[calendar].fullCalendar('today');
            SchedulerServices.updateEvents(calendar, uiCalendarConfig.calendars[calendar].fullCalendar('getView').type, $scope.scheduler.events);
        };
        /* Change View */
        $scope.changeView = function(view,calendar) {
            uiCalendarConfig.calendars[calendar].fullCalendar('changeView',view);
        };
    }
]);
