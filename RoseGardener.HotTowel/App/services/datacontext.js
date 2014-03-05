/////// <reference path="../breeze.debug.js" />

define(['durandal/system', 'services/model', 'config', 'services/logger'],
    function (system, model, config, logger) {
        var EntityQuery = breeze.EntityQuery,
            manager = configureBreezeManager(),
            orderBy = model.orderBy,
            entityNames = model.entityNames;

        var getRoseBushes = function (rosebushesObservable, forceRemote) {
            if (!manager.metadataStore.isEmpty() && !forceRemote) {
                var p = getLocal('RoseBushes', 'name', false);
                if (p.length > 0) {
                    rosebushesObservable(p);
                    return Q.resolve();
                }
            };

            var query = EntityQuery.from('Rosebushes')
                .expand("Category")
                .expand("Color")
                .orderBy('Name');

            return manager.executeQuery(query)
                .then(querySucceeded)
                .fail(queryFailed);

            function querySucceeded(data) {
                if (rosebushesObservable) {
                    rosebushesObservable(data.results);
                }
                log('Retrieved [Rosebushes] from remote data source',
                    data, true);
            }
        };

        var getRoseBushById = function (roseBushId, roseBushObservable) {
            // 1st - fetchEntityByKey will look in local cache 
            // first (because 3rd parm is true) 
            // if not there then it will go remote
            return manager.fetchEntityByKey(
                entityNames.roseBush, roseBushId, true)
                .then(fetchSucceeded)
                .fail(queryFailed);

            // 2nd - Refresh the entity from remote store (if needed)
            function fetchSucceeded(data) {
                var s = data.entity;
                //return s.isPartial() ? refreshRoseBush(s) : roseBushObservable(s);
                return roseBushObservable(s);
            }

            function refreshRoseBush(roseBush) {
                return EntityQuery.fromEntities(roseBush)
                    .using(manager).execute()
                    .then(querySucceeded)
                    .fail(queryFailed);
            }

            function querySucceeded(data) {
                var s = data.results[0];
                //s.isPartial(false);
                log('Retrieved [roseBush] from remote data source', s, true);
                return roseBushObservable(s);
            }

        };

        var cancelChanges = function() {
            manager.rejectChanges();
            log('Canceled changes', null, true);
        };

        var primeData = function () {
            return Q.all([getLookups(), getRoseBushes()]);
        };

        var primeData = function () {
            var promise = Q.all([
                getLookups(),
                getRoseBushes()]);
                //.then(applyValidators);

            return promise.then(success);

            function success() {
                datacontext.lookups = {
                    colors: getLocal('Colors', 'name', true),
                    //ratings: getLocal('Ratings', 'starRating', true),
                    categories: getLocal('Categories', 'name', true)
                    //rosebushes: getLocal('RoseBushes', orderBy.name, true)
                };
                log('Primed data', datacontext.lookups);
            }

            function applyValidators() {
                model.applyRoseBushValidators(manager.metadataStore);
            }

        };
        var saveChanges = function () {
            return manager.saveChanges()
                .then(saveSucceeded)
                .fail(saveFailed);

            function saveSucceeded(saveResult) {
                log('Saved data successfully', saveResult, true);
            }

            function saveFailed(error) {
                var msg = 'Save failed: ' + getErrorMessages(error);
                logError(msg, error);
                error.message = msg;
                throw error;
            }
        };


        var createRoseBush = function () {
            return manager.createEntity(entityNames.roseBush);
        };

        var hasChanges = ko.observable(false);

        manager.hasChangesChanged.subscribe(function (eventArgs) {
            hasChanges(eventArgs.hasChanges);
        });

        var datacontext = {
            getRoseBushes: getRoseBushes,
            primeData: primeData,
            createRoseBush: createRoseBush,
            hasChanges: hasChanges,
            getRoseBushById: getRoseBushById,
            cancelChanges: cancelChanges,
            saveChanges: saveChanges
        };

        return datacontext;

        //#region Internal methods        
        
        function getLocal(resource, ordering, includeNullos) {
            var query = EntityQuery.from(resource)
                .orderBy(ordering);
            if (!includeNullos) {
                query = query.where('id', '!=', 0);
            }
            return manager.executeQueryLocally(query);
        }
        
        function getErrorMessages(error) {
            var msg = error.message;
            if (msg.match(/validation error/i)) {
                return getValidationMessages(error);
            }
            return msg;
        }
        
        function getValidationMessages(error) {
            try {
                //foreach entity with a validation error
                return error.entityErrors.map(function(entity) {
                    // get each validation error
                    return entity.entityAspect.getValidationErrors().map(function(valError) {
                        // return the error message from the validation
                        return valError.errorMessage;
                    }).join('; <br/>');
                }).join('; <br/>');
            }
            catch (e) { }
            return 'validation error';
        }

        function queryFailed(error) {
            var msg = 'Error retreiving data. ' + error.message;
            logError(msg, error);
            throw error;
        }

        function configureBreezeManager() {
            breeze.NamingConvention.camelCase.setAsDefault();
            var mgr = new breeze.EntityManager(config.remoteServiceName);
            model.configureMetadataStore(mgr.metadataStore);
            return mgr;
        }

        function getLookups() {
            return EntityQuery.from('Lookups')
                .using(manager).execute()
                .then(processLookups)
                .fail(queryFailed);
        }
        
        function processLookups() {
            model.createNullos(manager);
        }


        function log(msg, data, showToast) {
            logger.log(msg, data, system.getModuleId(datacontext), showToast);
        }

        function logError(msg, error) {
            logger.logError(msg, error, system.getModuleId(datacontext), true);
        }
        //#endregion    
    }
);