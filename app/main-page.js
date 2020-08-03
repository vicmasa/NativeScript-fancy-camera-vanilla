const ViewModel = require('./main-view-model');
const modalcameramulti = "~/modal/cameramulti/cameramulti";

let page;
let cameraView = undefined;
let isInit = true;
exports.pageLoaded = function (args) {
    page = args.object;
    page.bindingContext = ViewModel;
    ViewModel.set('repeater', []);
    ViewModel.set('isImage', true);
    ViewModel.set('loaded', true);
    cameraView = page.getViewById("cameraView");
}
exports.tapReset = function () {
    ViewModel.set('loaded', true);
    ViewModel.set('repeater', []);
    page.getViewById('repeater').refresh();
}
function setContent(file, isArray) {
    const repeater = ViewModel.get('repeater');
    if(isArray){
        for (var i = 0; i < file.length; i++) {
            repeater.unshift({
                isImage: ViewModel.get('isImage'),
                src: file[i]
            })
        }
    }else{
        repeater.unshift({
            isImage: ViewModel.get('isImage'),
            src: file
        })
    }
    ViewModel.set('repeater', repeater);
    page.getViewById('repeater').refresh();
    ViewModel.set('loaded', true);
}
//MODAL CAMERA LOGIC
exports.tapModal = function(args){
    setModalCamera(getModalCamera(), 1);
}
function getModalCamera(isImage) {
    ViewModel.set('isImage', true);
    let item = {
        isImage: true,
        value: null,
        total: 0,
        loaded: false
    };
    if (!isImage) {
        ViewModel.set('isImage', false);
        item = {
            isImage: false,
            value: null,
            total: 0,
            loaded: false,
            recording: false,
            seconds: 0
        }
    } 
    return item;
}
function setModalCamera(params, index) {
    params.index = index;
    const platform = 'android'; //ls.getString('platform');
    const option = {
        context: {
            params: params,
            platform: platform
        },
        closeCallback: (index, item) => {
            // console.log(index);
            // console.dir(item);
            if (index) {
                setContent(item, true);
            }
        },
        fullscreen: true
    };
    if (platform == 'ios') {
        option.ios = {
            // eslint-disable-next-line no-undef
            presentationStyle: UIModalPresentationStyle.OverFullScreen
        }
    }
    page.showModal(modalcameramulti, option);
}
//