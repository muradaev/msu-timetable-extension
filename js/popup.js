// IIFE - Immediately Invoked Function Expression
(function(libraries){
    libraries(window.jQuery, window, document);
}(function($, window, document) {

    function settingChanged() {
        var type = this.id;
        var value = this.value;
        var param = {};
        param[type] = value;

        chrome.storage.local.set(param, function() {
            console.log(type+' saved as: '+value);
        });
    }

    function changeSetting(select) {
        return function (data) {
            select.value = data[select.id];
            console.log(select.id + ' has set to: '+ data[select.id]);
        }
    }

    //DOM ready
    $(function(){
        $('select').each(function(){
            var select = this;
            chrome.storage.local.get(select.id, changeSetting(select));
            $(select).change(settingChanged);
        });
    });

}));
