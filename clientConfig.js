'use strict';

module.exports = {
    accountSid: 'ACc6d06b7c7cc18f2b04ca09f823f69a8f',
    authToken: 'f0b37ac21592628e9f9abd792add153f',
    phoneNumber: '+16475600735',
    email: 'ethannguyen93@gmail.com',
    emailPassword: 'password',
    /**
     *
     * @param customerName
     * @param startTime: what time is the appointment
     * @param startTimeList: when is the appointment (AM/PM)
     * @returns {string}
     */
    SMSMessage: function(customerName, startTime, startTimeList){
        return 'Hello ' + customerName + ', this is a reminder that your appointment ' +
            'with ... is tomorrow at ' + startTime + ' ' + startTimeList + '. We hope ' +
            'to see you there.';
    },
    EmailMessage: function(customerName, startTime, startTimeList){
        return 'Hello ' + customerName + ', this is a reminder that your appointment ' +
            'with ... is tomorrow at ' + startTime + ' ' + startTimeList + '. We hope ' +
            'to see you there.';
    }
};
