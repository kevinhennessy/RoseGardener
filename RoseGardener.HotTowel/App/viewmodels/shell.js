define(['durandal/system', 'plugins/router', 'services/logger', 'config', 'services/datacontext'],
    function (system, router, logger, config, datacontext) {
        var shell = {
            activate: activate,
            router: router
        };
        
        return shell;

        //#region Internal Methods
        function activate() {
            return datacontext.primeData()
                .then(boot)
                .fail(failedInitialization);
        }

        function boot() {
            log('Rose Gardener loaded!', null, true);

            router.on('router:route:not-found', function (fragment) {
                logError('No Route Found', fragment, true);
            });

            var routes = [
                { route: '', moduleId: 'rosebushes', title: 'Rose Bushes', nav: 1 },
                { route: 'selections', moduleId: 'selections', title: 'Selections', nav: 2 },
                { route: 'rosebushadd', moduleId: 'rosebushadd', title: 'Add Rose', nav: 3 },
                { route: 'rosebushdetail/:id', moduleId: 'rosebushdetail', title: 'Edit Rose', nav: false }
            ];

            return router.makeRelative({ moduleId: 'viewmodels' }) // router will look here for viewmodels by convention
                .map(routes)            // Map the routes
                .buildNavigationModel() // Finds all nav routes and readies them
                .activate();            // Activate the router
        }

        function log(msg, data, showToast) {
            //logger.log(msg, data, system.getModuleId(shell), showToast);
        }

        function logError(msg, data, showToast) {
            //logger.logError(msg, data, system.getModuleId(shell), showToast);
        }

        function failedInitialization(error) {
            var msg = 'App initialization failed: ' + error.message;
            //logger.logError(msg, error, system.getModuleId(shell), true);
        }
        //#endregion
    });