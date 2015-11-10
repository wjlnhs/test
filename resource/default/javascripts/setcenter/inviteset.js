/**
 * Created by chenshanlian on 2015/3/18.
 */
define(function(require){
    var i8ui = require("../common/i8ui.js");
    var radios = $("input[type=radio]");
    var baseInfo = {};
    function getPubset(){
        $.ajax({
            url: i8_session.ajaxHost + "webajax/setcenter/getBaseInfo",
            type: "get",
            dataType: "json",
            success: function (data) {
                console.log(data);
                if(data.Result){
                    baseInfo = data.ReturnObject;
                    if(baseInfo.EnableInvite){
                        radios[0].checked = true;
                    }else{
                        radios[1].checked = true;
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
    //保存设置
    $("#js_public").on("click",".blue94x32",function(){
        baseInfo.EnableInvite = radios[0].checked
        var jdata = {
            domain: baseInfo.Domain,
            cmpName: baseInfo.CompanyName,
            actName: baseInfo.AccountName,
            backimage: baseInfo.BackImage,
            logo: baseInfo.Logo,
            SystemName: baseInfo.sysName,
            EnableInvite: baseInfo.EnableInvite
        }
        $.ajax({
            url: i8_session.ajaxHost + "webajax/setcenter/setBaseInfo",
            type: "get",
            dataType: "json",
            data:{jdata:jdata},
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