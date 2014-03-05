define(function () {
    toastr.options.timeOut = 4000;
    toastr.options.positionClass = 'toast-bottom-right';

    var imageSettings = {
        imageBasePath: '../content/images/photos/',
        unknownPersonImageSource: 'aboutface_4.jpg'
    };

    var remoteServiceName = 'breeze/RoseGardener';

    var routes = [{
        url: 'rosebushes',
        moduleId: 'viewmodels/rosebushes',
        name: 'Roses',
        visible: true
    }, {
        url: 'selections',
        moduleId: 'viewmodels/selections',
        name: 'Selections',
        visible: true
    }, {
        url: 'rosebushdetail/:id',
        moduleId: 'viewmodels/rosebushdetail',
        name: 'Edit Rose Bush',
        visible: false
    }, {
        url: 'rosebushadd',
        moduleId: 'viewmodels/rosebushadd',
        name: 'Add Rose',
        visible: true
        //caption: '<i class="icon-plus"></i> Add Rose',
        //settings: { admin: true }
    }];

    var startModule = 'rosebushes';

    return {
        imageSettings: imageSettings,
        remoteServiceName: remoteServiceName,
        routes: routes,
        startModule: startModule
    };
});
