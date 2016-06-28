'use strict';

angular.module('scheduler').factory('SchedulerServices', [ 'uiCalendarConfig', 'RetrieveAppointments', '$q',
    function (uiCalendarConfig, RetrieveAppointments, $q) {
        return {
            /**
             * Retrieve list of appointments on current view
             * @param calendar: DOM stored calendar
             * @param type: type of calendar view (month, week, day)
             * @param events: list of current events
             */
            updateEvents: function(calendar, type, events){
                switch (type){
                    case 'month':
                        break;
                    case 'agendaWeek':
                        type = 'week';
                        break;
                    case 'agendaDay':
                        type = 'day';
                        break;
                    default:
                        type = 'year';
                        break;
                }
                var now = calendar === undefined ? moment() :  uiCalendarConfig.calendars[calendar].fullCalendar('getDate');
                //var now = uiCalendarConfig.calendars[calendar].fullCalendar('getDate');
                var firstDay = moment(now).startOf(type);
                var lastDay = moment(now).endOf(type);
                var body = {
                    'type': 'getAllGivenDate',
                    firstDay: firstDay,
                    lastDay: lastDay
                };
                var self = this;
                //remove all previous appointments
                events.splice(0, events.length);
                RetrieveAppointments.load(body, function(response){
                    _.each(response, function(appointment){
                        var startDate = new Date(appointment.startDate);
                        var endDate = new Date(appointment.endDate);
                        self.setHours(startDate, appointment.startTime, appointment.startTimeList);
                        self.setHours(endDate, appointment.endTime, appointment.endTimeList);
                        if (appointment.assignedEmployee){
                            events.push({
                                title: appointment.assignedEmployee.name + ' - ' + appointment.customer.name,
                                start: startDate,
                                end: endDate,
                                data: {
                                    id: appointment._id,
                                    customer: appointment.customer,
                                    startTime: appointment.startTime,
                                    startTimeList: appointment.startTimeList,
                                    startDate: startDate,
                                    endTime: appointment.endTime,
                                    endTimeList: appointment.endTimeList,
                                    endDate: endDate,
                                    assignedEmployee: appointment.assignedEmployee,
                                    note: appointment.note,
                                    sendSMS: appointment.sendSMS,
                                    sendEmail: appointment.sendEmail
                                }
                            });
                        }
                    });
                });
            },

            setHours: function(d, startTime, timeList){
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

        };
    }
]);
