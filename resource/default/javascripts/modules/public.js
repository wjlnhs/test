define(function(require,exports){
    function getAstro(birthday) {
        var arr=[20,19,21,21,21,22,23,23,23,23,22,22];
        var _date= new Date(birthday.replace(/-/g,"/"));
        var m=_date.getMonth()+1;
        var d=_date.getDate();
        return "魔羯水瓶双鱼牡羊金牛双子巨蟹狮子处女天秤天蝎射手魔羯".substr(m*2-(d<arr[m-1]?2:0),2) + "座";
    }
    //读取消息分类列表
    function getTipstype(cbk){
        $.ajax({
            url: i8_session.ajaxHost+'webajax/modules/gettpstype',
            type: 'post',
            dataType: 'json',
            cache: false,
            success:function(data){
                if(data.Result){
                    cbk(data.ReturnObject);
                }
            }
        });
    }
    exports.getXingZuo = getAstro;
    exports.getTipstype = getTipstype;
});
