define(['config', 'durandal/system', 'services/logger'],
    function (config, system, logger) {
    var imageSettings = config.imageSettings;
    var initialized = false;
    var nulloDate = new Date(1900, 0, 1);
    var referenceCheckValidator;
    var Validator = breeze.Validator;

    var orderBy = {
        roseBush: 'name, color'
    };

    var entityNames = {
        roseBush: 'RoseBush',
        selection: 'Selection',
        color: 'Color',
        rating: 'Rating',
        category: 'Category'
    };

    var model = {
        applyRoseBushValidators: applyRoseBushValidators,
        configureMetadataStore: configureMetadataStore,
        createNullos: createNullos,
        entityNames: entityNames,
        orderBy: orderBy
    };

    return model;

    //#region Internal Methods
    function configureMetadataStore(metadataStore) {
        metadataStore.registerEntityTypeCtor(
            'RoseBush', null, rosebushInitializer);
        metadataStore.registerEntityTypeCtor(
            'Selection', null, selectionInitializer);

        referenceCheckValidator = createReferenceCheckValidator();
        Validator.register(referenceCheckValidator);
        log('Validators registered');
    }

    function createReferenceCheckValidator() {
        var name = 'realReferenceObject';
        var ctx = { messageTemplate: 'Missing %displayName%' };
        var val = new Validator(name, valFunction, ctx);
        log('Validators created');
        return val;

        function valFunction(value, context) {
            return value ? value.id() !== 0 : true;
        }
    }

    function applyRoseBushValidators(metadataStore) {
        var types = ['color', 'category'];
        types.forEach(addValidator);
        log('Validators applied', types);

        function addValidator(propertyName) {
            var sessionType = metadataStore.getEntityType('RoseBush');
            sessionType.getProperty(propertyName)
                .validators.push(referenceCheckValidator);
        }
    }
    function rosebushInitializer(rosebush) {
        rosebush.imageName = ko.computed(function () {
            return makeImageName(rosebush.imageSource());
        });

    };

    function createNullos(manager) {
        var unchanged = breeze.EntityState.Unchanged;

        createNullo(entityNames.color);
        createNullo(entityNames.category);

        function createNullo(entityName, values) {
            var initialValues = values
                || { name: ' [Select a ' + entityName.toLowerCase() + ']' };
            return manager.createEntity(entityName, initialValues, unchanged);
        }

    }

    function selectionInitializer(selection) {
        return selection;
    };

    function makeImageName(source) {
        return imageSettings.imageBasePath +
            (source || imageSettings.unknownPersonImageSource);
    }

    function log(msg, data, showToast) {
        logger.log(msg, data, system.getModuleId(model), showToast);
    }

    //#endregion
});