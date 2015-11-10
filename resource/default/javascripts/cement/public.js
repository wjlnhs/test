define(function(require,exports){
    var i8ui = require('../common/i8ui');
    function _getTypeList(cbk){
        $.ajax({
            url: i8_session.ajaxHost+'webajax/cement/get-type',
            type: 'get',
            dataType: 'json',
            cache: false,
            success: function(result){
                if(result.Result){
                    cbk(result.ReturnObject)
                }else{
                    i8ui.error(result.Description);
                }
            },
            error: function(e1,e2,e3){
                i8ui.error("获取分类列表失败");
            }
        });
    }
    function _getCementList(json,cbk){
        $.ajax({
            url: i8_session.ajaxHost+'webajax/cement/get-cement',
            type: 'get',
            dataType: 'json',
            data: json,
            cache: false,
            success: function(result){
                if(result.Result){
                    cbk(result.ReturnObject);
                }else{
                    i8ui.error(result.Description);
                }
            },
            error: function(e1,e2,e3){
                i8ui.error("获取分类列表失败");
            }
        });
    }
    function _getUrlParam(paras){
        var url = location.href.indexOf("#") > 0 ? location.href.substring(0, location.href.indexOf("#")) : location.href;
        var paraString = url.substring(url.indexOf("?") + 1, url.length).split("&");
        var paraObj = {}
        for (i = 0; j = paraString[i]; i++) {
            paraObj[j.substring(0, j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf("=") + 1);
        }
        var returnValue = paraObj[paras.toLowerCase()];
        if (typeof (returnValue) == "undefined") {
            return "";
        } else {
            return returnValue;
        }
    }
    function _getComadmin(){
        return i8_session.utype.join(",").indexOf("30") >= 0;
    }
    //判断是否是企业墙管理员
    function _getAdmin(){
        return i8_session.appadmin.join(",").indexOf("app_notice") >= 0;
    }

    exports.getTypeList = _getTypeList;
    exports.getCementList = _getCementList;
    exports.getUrlParam = _getUrlParam;
    exports.pagesize = 10;
    exports.getAdmin = _getAdmin;
    exports.getComadmin = _getComadmin;
});