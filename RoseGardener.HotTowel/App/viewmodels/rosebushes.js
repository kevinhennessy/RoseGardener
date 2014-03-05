/// <reference path="../knockout-2.3.0.js"/>
/// <reference path="../moment.js" />
/// <reference path="../breeze.debug.js" />
/// <reference path="../bootstrap.js" />
/// <reference path="logger.js" />

define(['services/logger', 'services/datacontext'], function (logger, datacontext) {
    var title = 'Roses';
    var rosebushes = ko.observableArray();

    var initialized = false;

    var vm = {
        rosebushes: rosebushes,
        activate: activate,
        //deactivate: deactivate,
        refresh: refresh,
        title: title,
        //attached: attached
    };
    return vm

    function activate() {
        if (initialized) { return; }
        logger.log(title + ' View Activated', null, title, true);
        initialized = true;
        return refresh();
    }

    function refresh() {
        return datacontext.getRoseBushes(rosebushes);
    }
});
