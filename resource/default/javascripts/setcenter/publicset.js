/**
 * Created by chenshanlian on 2015/3/18.
 */
define(function(require){
    var util=require("../common/util.js");
    var i8ui = require("../common/i8ui.js");
    var i8selector = require("../plugins/i8selector/fw_selector.js");
    var ksn_owner = i8selector.KSNSelector({
        model: 2,
        width: 850,
        element: "#js_set_input",
        isAbox: true,
        searchType: { "org": false, "user": true, "grp": false }
    });
    var radios = $("input[type=radio]");
    function getPubset(){
        $.ajax({
            url: i8_session.ajaxHost + "webajax/setcenter/getAccountentity",
            type: "get",
            dataType: "json",
            success: function (data) {
                console.log(data);
                if(data.Result){
                    if(data.ReturnObject.ScopeType == 0){
                        radios[0].checked = true;
                    }else{
                        radios[1].checked = true;
                        $("#js_public_setdiv").show();
                        var ids = [];
                        for(var key in data.ReturnObject.Scopes){
                            ids.push({type:"user",id:key});
                        }
                        ksn_owner.setAllselectedData(ids);
                    }
                }else{
                    i8ui.error(data.Description);
                }
            },
            error: function (e1, e2, e3) {
                i8ui.error("请求出错");
            }
        });
    }
    //选择切换
    $("#js_public").on("click",".auth-option input",function(){
        if(this.value == 0){
            $("#js_public_setdiv").hide();
        }else{
            $("#js_public_setdiv").show();
        }
    });
    //保存设置
    $("#js_public").on("click",".blue94x32",function(){
        var type = radios[0].checked ? 0 : 1;
        var scope = {};
        if(type == 1){
            var ids = ksn_owner.getAllselectedData();
            if(ids.length <= 0){
                i8ui.error("请输入指定的人员！");
                return;
            }else{
                for(var i=0; i<ids.length; i++){
                    scope[ids[i].id] = 0;
                }
            }
        }
        console.log(scope);
        $.ajax({
            url: i8_session.ajaxHost + "webajax/setcenter/editAccountentity",
            type: "get",
            dataType: "json",
            data:{jdata:{usdata:encodeURIComponent(util.toJsonString({type: type, scope: scope}))}},
            success: function (data) {
                console.log(data);
                if(data.Result){
                    i8ui.write("保存成功！");
                }else{
                    i8ui.error(data.Description);
                }
            },
            error: function (e1, e2, e3) {
                i8ui.error("请求出错");
            }
        });
    });
    getPubset();
});