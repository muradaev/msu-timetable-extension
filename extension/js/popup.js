// IIFE - Immediately Invoked Function Expression
(function(libraries){
    libraries(window.jQuery, window, document);
}(function($, window, document) {

    function changeSelect(select) {
        return function (data) {
            select.value = data[select.id];
        }
    }

    function changeCheckBox(box) {
        return function (data) {
            if (data[box.id] === true)
                $(box).prop('checked', true);
        }
    }

    function DOMReady() {
        $('select').each(function(){
            var select = this;
            chrome.storage.local.get(select.id, changeSelect(select));

            $(select).change(function(){
                var param = {};
                param[this.id] = this.value;
                chrome.storage.local.set(param);
            });
        });

        $('#showScheudle').each(function(){
            var box = this;
            chrome.storage.local.get(box.id, changeCheckBox(box));

            $(box).change(function(){
                var param = {};
                param[this.id] = $(this).prop('checked');
                chrome.storage.local.set(param);
            });
        })
    }

    $(DOMReady);

}));
