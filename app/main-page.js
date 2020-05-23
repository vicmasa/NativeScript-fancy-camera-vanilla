const FancyCamera = require('nativescript-fancy-camera');
const fc = new FancyCamera.FancyCamera();
const ViewModel = require('./main-view-model');

let page;
let cameraView = undefined;
exports.pageLoaded = function (args) {
    page = args.object;
    page.bindingContext = ViewModel;
    ViewModel.set('repeater', []);
    ViewModel.set('isImage', true);
    setTimeout(function () {
        cameraView = page.getViewById("cameraView");
    }, 1000);
}
exports.tapReset = function () {
    ViewModel.set('repeater', []);
    page.getViewById('repeater').refresh();
}
function setContent(file) {
    const repeater = ViewModel.get('repeater');
    repeater.unshift({
        isImage: ViewModel.get('isImage'),
        src: file
    })
    ViewModel.set('repeater', repeater);
    page.getViewById('repeater').refresh();
    ViewModel.set('loaded', true);
}
let timer = 0;
function onEvent(args) {
    console.log('New finish');
    if (timer) {
        clearTimeout(timer);
    }
    timer = setTimeout(function () {
        console.dir(args);
        const object = args.object;
        const file = object.get('file');
        ViewModel.set('loaded', false);
        setContent(file);
        timer = 0;
    }, 1000);
}
exports.toggleCamera = function (args) {
    cameraView.toggleCamera();
}
exports.takePhoto = function (args) {
    ViewModel.set('isImage', true);
    console.log('takePhoto()');
    cameraView.takePhoto();
    clearTimeout(timer);
    cameraView.on('finished', onEvent.bind(this));
}
exports.recordVideo = function (args) {
    ViewModel.set('isImage', false);
    cameraView.on('finished', onEvent.bind(this));
    cameraView.startRecording();
}
exports.stopRecord = function (args) {
    cameraView.stopRecording();
}
exports.showCamera = function (args) {
    fc.show().then(data => {
        if (data && data.file && data.type) {
            console.dir(data);
            if (data.type === 'video') {
                ViewModel.set('isImage', false);
            }
            if (data.type === 'photo') {
                ViewModel.set('isImage', true);
            }
            setContent(data.file);
        }
    });
}
exports.showBasicPhoto = function (args) {
    fc.takePhoto().then(data => {
        console.dir(data);
        if (data && data.file) {
            ViewModel.set('isImage', true);
            setContent(data.file);
        }
    });
}
exports.showBasicRecorder = function (args) {
    fc.record().then(data => {
        if (data && data.file) {
            ViewModel.set('isImage', false);
            setContent(data.file);
        }
    });
}