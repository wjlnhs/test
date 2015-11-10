define(function (require, exports,modules) {
    var crcletpl=require('../../template/calendar/crcle.tpl')
    var i8ui=require('../../javascripts/common/i8ui');
    exports.openWindow=function(title,callback,cancelcallback){
        var _showbox=i8ui.showbox({
            title:title,
            cont:crcletpl
        });
        var showbox=$(_showbox);
        showbox.on('click','.app-radio',function(){
            showbox.find('.app-radio').removeClass('checked');
            $(this).addClass('checked');
        });
        showbox.on('click','.btncancel',function(){
            _showbox.close();
            cancelcallback&&cancelcallback();
        });

        showbox.on('click','.ct-close',function(){
            cancelcallback&&cancelcallback();
        });

        showbox.on('click','.btnsure',function(){
            callback&&callback(showbox.find('.app-radio.checked').attr('crcletype'));
            _showbox.close();
        });
    };
});