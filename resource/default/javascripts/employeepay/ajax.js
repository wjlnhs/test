define(function(require,exports,mouldes){
    var ajaxBaseHost=i8_session.ajaxHost;

    var ajaxfun=function(options,callback,type,url){
        $.ajax({
            url: ajaxBaseHost + 'webajax/employeepay_ajax/'+url,
            type: type,
            dataType: 'json',
            data:{options:options},
            cache:false,
            success: function (data) {
                callback(data);
            }, error: function (error) {
                callback({Result:false,Description:'网络异常，请重试！'});
            }
        });
    }

    mouldes.exports={
        getData:function(options,callback,ajaxurl){
            ajaxfun(options,callback,'get',ajaxurl);
        },
        postData:function(options,callback,ajaxurl){
            ajaxfun(options,callback,'post',ajaxurl);
        }
    }
});