define(['services/datacontext',
        'durandal/system',
        'plugins/router',
        'durandal/app',
        'services/logger'],
    function (datacontext, system, router, app, logger) {
        var roseBush = ko.observable(),
            categories = ko.observableArray(),
            colors = ko.observableArray(),
            ratings = ko.observableArray(),
            isSaving = ko.observable(false),
            isDeleting = ko.observable(false),

            activate = function (queryStringId) {
                var id = parseInt(queryStringId);
                //var id = 1;
                initLookups();
                return datacontext.getRoseBushById(id, roseBush);
            },

            initLookups = function () {
                categories(datacontext.lookups.categories);
                colors(datacontext.lookups.colors);
                //ratings(datacontext.lookups.ratings);
           };

        var goBack = function () {
            router.navigateBack();
        };

        var hasChanges = ko.computed(function () {
            return datacontext.hasChanges();
        });

        var cancel = function () {
            datacontext.cancelChanges();
        };

        var canSave = ko.computed(function () {
            return hasChanges() && !isSaving();
        });

        var save = function () {
            isSaving(true);
            return datacontext.saveChanges().fin(complete);

            function complete() {
                isSaving(false);
            }
        };

        var deleteRoseBush = function () {
            var msg = 'Delete roseBush "' + roseBush().name() + '" ?';
            var title = 'Confirm Delete';
            isDeleting(true);
            return app.showMessage(msg, title, ['Yes', 'No'])
                .then(confirmDelete);

            function confirmDelete(selectedOption) {
                if (selectedOption === 'Yes') {
                    roseBush().entityAspect.setDeleted();
                    save().then(success).fail(failed).fin(finish);

                    function success() {
                        router.navigate('#/');
                    }

                    function failed(error) {
                        cancel();
                        var errorMsg = 'Error: ' + error.message;
                        logger.logError(
                            errorMsg, error, system.getModuleId(vm), true);
                    }

                    function finish() {
                        return selectedOption;
                    }
                }
                isDeleting(false);
            }

        };

        var canDeactivate = function () {
            if (isDeleting()) { return false; }

            if (hasChanges()) {
                var title = 'Do you want to leave "' +
                    roseBush().name() + '" ?';
                var msg = 'Navigate away and cancel your changes?';
                var checkAnswer = function (selectedOption) {
                    if (selectedOption === 'Yes') {
                        cancel();
                    }
                    return selectedOption;
                };
                return app.showMessage(title, msg, ['Yes', 'No'])
                    .then(checkAnswer);
            }
            return true;
        };

        var vm = {
            activate: activate,
            cancel: cancel,
            canDeactivate: canDeactivate,
            canSave: canSave,
            deleteRoseBush: deleteRoseBush,
            goBack: goBack,
            hasChanges: hasChanges,
            colors: colors,
            ratings: ratings,
            categories: categories,
            save: save,
            roseBush: roseBush,
            title: 'Rose Bush Detail'
        };
        return vm;
    });