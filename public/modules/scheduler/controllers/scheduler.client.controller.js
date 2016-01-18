'use strict';

angular.module('scheduler').controller('SchedulerController', [ '$scope', '$state', '$stateParams', 'Authentication', 'RetrieveEmployee', 'RetrieveInventory', 'MainpageServices',
    'LoginpageService', '$q', 'AdminLoginPageServices', 'AdminPageServices', '$modal', '$compile', 'uiCalendarConfig',
    'RetrieveAppointments', 'FTScroller',
    function($scope, $state, $stateParams, Authentication, RetrieveEmployee, RetrieveInventory, MainpageServices,
             LoginpageService, $q, AdminLoginPageServices, AdminPageServices, $modal, $compile, uiCalendarConfig,
             RetrieveAppointments, FTScroller) {
        /*Scheduler Page*/

        $scope.scheduler = {
            selectedEvent: false, //if user clicked on an event
            events: [],
            eventSources: [],
            employees: [],
            hourList: [
                '12:00', '12:30', '1:00', '1:30', '2:00', '2:30', '3:00', '3:30', '4:00', '4:30',
                '5:00', '5:30', '6:00', '6:30', '7:00', '7:30', '8:00', '8:30',
                '9:00', '9:30', '10:00', '10:30', '11:00', '11:30'],
            timeList: ['AM', 'PM'],
            new: {
                id: '',
                customerName: '',
                assignedEmployee: {},
                startTime: '12:00',
                startTimeList: 'AM',
                startDate: new Date(),
                startOpen: false,
                endTime: '12:00',
                endTimeList: 'AM',
                endDate: new Date(),
                endOpen: false,
                note: ''
            },
            selected: {
                id: '',
                customerName: '',
                assignedEmployee: {},
                startTime: '12:00',
                startTimeList: 'AM',
                startDate: new Date(),
                startOpen: false,
                endTime: '12:00',
                endTimeList: 'AM',
                endDate: new Date(),
                endOpen: false,
                note: ''
            }
        };
        $scope.scheduler.openCalender = function(event){
            switch (event){
                case 'newStart':
                    $scope.scheduler.new.startOpen = !$scope.scheduler.new.startOpen;
                    break;
                case 'newEnd':
                    $scope.scheduler.new.endOpen = !$scope.scheduler.new.endOpen;
                    break;
                case 'selectedStart':
                    $scope.scheduler.selected.startOpen = !$scope.scheduler.selected.startOpen;
                    break;
                case 'selectedEnd':
                    $scope.scheduler.selected.endOpen = !$scope.scheduler.selected.endOpen;
                    break;
            }
        };
        $scope.initScheduler = (function(){
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
            RetrieveAppointments.load(body, function(response){
                _.each(response, function(appointment){
                    var startDate = new Date(appointment.startDate);
                    var endDate = new Date(appointment.endDate);
                    function setHours (d, startTime, timeList){
                        d.setHours(0,0,0,0);
                        var index = startTime.indexOf(':');
                        var hour = parseInt(startTime.substring(0,index)) % 12;
                        if (timeList === 'PM'){
                            hour += 12;
                        }
                        var min = parseInt(startTime.substring(index+1));
                        d.setHours(hour);
                        d.setMinutes(min);
                    }
                    setHours(startDate, appointment.startTime, appointment.startTimeList);
                    setHours(endDate, appointment.endTime, appointment.endTimeList);
                    $scope.scheduler.events.push({
                        title: $scope.scheduler.new.assignedEmployee.name + ' - ' + appointment.customerName,
                        start: startDate,
                        end: endDate,
                        data: {
                            id: appointment._id,
                            customerName: appointment.customerName,
                            startTime: appointment.startTime,
                            startTimeList: appointment.startTimeList,
                            startDate: startDate,
                            endTime: appointment.endTime,
                            endTimeList: appointment.endTimeList,
                            endDate: endDate,
                            assignedEmployee: appointment.assignedEmployee,
                            note: appointment.note
                        }
                    });
                })
            });

        })();

        $scope.addNewEvent = function() {
            var startDate = new Date($scope.scheduler.new.startDate);
            var endDate = new Date($scope.scheduler.new.endDate);
            function setHours (d, startTime, timeList){
                d.setHours(0,0,0,0);
                var index = startTime.indexOf(':');
                var hour = parseInt(startTime.substring(0,index)) % 12;
                if (timeList === 'PM'){
                    hour += 12;
                }
                var min = parseInt(startTime.substring(index+1));
                d.setHours(hour);
                d.setMinutes(min);
            }
            setHours(startDate, $scope.scheduler.new.startTime, $scope.scheduler.new.startTimeList);
            setHours(endDate, $scope.scheduler.new.endTime, $scope.scheduler.new.endTimeList);
            var body = {
                'type': 'add',
                customerName: $scope.scheduler.new.customerName,
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
                    title: $scope.scheduler.new.assignedEmployee.name + ' - ' + $scope.scheduler.new.customerName,
                    start: startDate,
                    end: endDate,
                    data: {
                        id: response[0]._id,
                        customerName: $scope.scheduler.new.customerName,
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
                $scope.scheduler.new.customerName = '';
                $scope.scheduler.new.startTime = '12:00';
                $scope.scheduler.new.startTimeList = 'AM';
                $scope.scheduler.new.startDate = new Date();
                $scope.scheduler.new.startOpen = false;
                $scope.scheduler.new.endTime = '12:00';
                $scope.scheduler.new.endTimeList = 'AM';
                $scope.scheduler.new.endDate = new Date();
                $scope.scheduler.new.endOpen = false;
                $scope.scheduler.new.note = '';

            });
        };
        $scope.updateEvent = function() {
            var event = _.find($scope.scheduler.events, function(e){
                return e.data.id === $scope.scheduler.selected.id;
            });
            var startDate = new Date($scope.scheduler.selected.startDate);
            var endDate = new Date($scope.scheduler.selected.endDate);
            function setHours (d, startTime, timeList){
                d.setHours(0,0,0,0);
                var index = startTime.indexOf(':');
                var hour = parseInt(startTime.substring(0,index)) % 12;
                if (timeList === 'PM'){
                    hour += 12;
                }
                var min = parseInt(startTime.substring(index+1));
                d.setHours(hour);
                d.setMinutes(min);
            }
            setHours(startDate, $scope.scheduler.selected.startTime, $scope.scheduler.selected.startTimeList);
            setHours(endDate, $scope.scheduler.selected.endTime, $scope.scheduler.selected.endTimeList);
            var body = {
                type: 'update',
                id: event.data.id,
                customerName: $scope.scheduler.selected.customerName,
                startTime: $scope.scheduler.selected.startTime,
                startTimeList: $scope.scheduler.selected.startTimeList,
                startDate: startDate,
                endTime: $scope.scheduler.selected.endTime,
                endTimeList: $scope.scheduler.selected.endTimeList,
                endDate: endDate,
                assignedEmployee: $scope.scheduler.selected.assignedEmployee,
                note: $scope.scheduler.selected.note
            };
            RetrieveAppointments.load(body, function(response){
                event.data.customerName = $scope.scheduler.selected.customerName;
                event.data.startTime = $scope.scheduler.selected.startTime;
                event.data.startTimeList = $scope.scheduler.selected.startTimeList;
                event.data.startDate = startDate;
                event.data.endTime = $scope.scheduler.selected.endTime;
                event.data.endTimeList = $scope.scheduler.selected.endTimeList;
                event.data.endDate = endDate;
                event.data.assignedEmployee = $scope.scheduler.selected.assignedEmployee;
                event.data.note = $scope.scheduler.selected.note;
                event.title = event.data.assignedEmployee.name + ' - ' + event.data.customerName;
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
        /* alert on eventClick */
        $scope.scheduler.alertOnEventClick = function( date, jsEvent, view){
            $scope.scheduler.selectedEvent = true;
            $scope.scheduler.selected.id = date.data.id;
            $scope.scheduler.selected.assignedEmployee = date.data.assignedEmployee;
            $scope.scheduler.selected.customerName = date.data.customerName;
            $scope.scheduler.selected.startTime = date.data.startTime;
            $scope.scheduler.selected.startTimeList = date.data.startTimeList;
            $scope.scheduler.selected.startDate = date.data.startDate;
            $scope.scheduler.selected.startOpen = false;
            $scope.scheduler.selected.endTime = date.data.endTime;
            $scope.scheduler.selected.endTimeList = date.data.endTimeList;
            $scope.scheduler.selected.endDate = date.data.endDate;
            $scope.scheduler.selected.endOpen = false;
            $scope.scheduler.selected.note = date.data.note;
            // Hide add pane
            $scope.addPaneHidden = true;
        };
        /* alert on Drop */
        $scope.scheduler.alertOnDrop = function(event, delta, revertFunc, jsEvent, ui, view){
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
                customerName: event.data.customerName,
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
                $scope.scheduler.selected.startDate = startDate._d;
                $scope.scheduler.selected.endTime = endTime;
                $scope.scheduler.selected.endTimeList = endTimeList;
                $scope.scheduler.selected.endDate = endDate._d;
            });
        };
        /* alert on Resize */
        $scope.scheduler.alertOnResize = function(event, delta, revertFunc, jsEvent, ui, view ){
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
                customerName: event.data.customerName,
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
                $scope.scheduler.selected.endDate = endDate._d;
            });
        };
        /* Change View */
        $scope.scheduler.changeView = function(view,calendar) {
            uiCalendarConfig.calendars[calendar].fullCalendar('changeView',view);
        };
        /* Add New Calendar Btn Event */
        $scope.addPaneHidden = true;
        $scope.scheduler.alertOnAddBtnClicked = function() {
            $scope.addPaneHidden = !$scope.addPaneHidden;
            console.log($scope.addPaneHidden);
        };
        /* config object */
        $scope.uiConfig = {
            calendar:{
                height: 800,
                editable: true,
                header:{
                    left: '',
                    center: 'title',
                    right: 'today prev,next'
                },
                slotDuration: '00:05:00',
                eventClick: $scope.scheduler.alertOnEventClick,
                eventDrop: $scope.scheduler.alertOnDrop,
                eventResize: $scope.scheduler.alertOnResize
            }
        };
    }
]);
