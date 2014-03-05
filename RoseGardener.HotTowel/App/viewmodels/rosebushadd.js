define(['durandal/app', 'services/logger', 'services/datacontext', 'plugins/router'], function (app, logger, datacontext, router) {
    var title = 'Add Rose',
        isSaving = ko.observable(false),
        rosebush = ko.observable(),
        categories = ko.observableArray(),
        colors = ko.observableArray(),
        ratings = ko.observableArray();

    var initLookups = function () {
        categories(datacontext.lookups.categories);
        colors(datacontext.lookups.colors);
        //ratings(datacontext.lookups.ratings);
        },

        cancel = function (complete) {
            router.navigateBack();
        },

        hasChanges = ko.computed(function () {
            return datacontext.hasChanges();
        }),
        canSave = ko.computed(function () {
            return hasChanges() && !isSaving();
        }),

        save = function () {
            isSaving(true);
            datacontext.saveChanges()
                .then(goToEditView).fin(complete);

            function goToEditView(result) {
                router.navigate('#/rosebushdetail/' + rosebush().id());
            }

            function complete() {
                isSaving(false);
            }
        };

        canDeactivate = function () {
            if (hasChanges()) {
                var msg = 'Do you want to leave and cancel?';
                return app.showMessage(msg, 'Navigate Away', ['Yes', 'No'])
                    .then(function (selectedOption) {
                        if (selectedOption === 'Yes') {
                            datacontext.cancelChanges();
                        }
                        return selectedOption;
                    });
            }
            return true;
        };

    var vm = {
            activate: activate,
            title: title,
            rosebush: rosebush,
            cancel: cancel,
            canSave: canSave,
            canDeactivate: canDeactivate,
            hasChanges: hasChanges,
            save: save,
            categories: categories,
            colors: colors
        };

        return vm;

        //#region Internal Methods
        function activate() {
            initLookups();
            rosebush(datacontext.createRoseBush());
            logger.log(title + ' View Activated', null, title, true);
            return true;
        }
        //#endregion
});
