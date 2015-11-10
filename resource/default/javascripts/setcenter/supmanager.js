/**
 * Created by chenshanlian on 2015/3/17.
 */
define(function(require){
    var i8ui = require('../common/i8ui.js');
    var i8selector = require("../plugins/i8selector/fw_selector.js");
    var ksn_owner = i8selector.KSNSelector({
        model: 1,
        width: 250,
        element: "#js_set_input",
        isAbox: true,
        searchType: { "org": false, "user": true, "grp": false },
        deleteCallback: function () {
            $($("div.lg-wk-set")[i]).find(".blue100x36,.add-invite-person").show();
        }
    });
    function changeAdmin(){
        var adminID = ksn_owner.selectedData();
        if(adminID == ""){
            i8ui.error("请输入要交接的同事！");
            return;
        }
        $.ajax({
            url: i8_session.ajaxHost + "webajax/setcenter/changeAdmin",
            type: "get",
            dataType: "json",
            data:{jdata:{adminID: adminID}},
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
    }
    //保存修改
    $("#js_have_btn").click(changeAdmin);
    $("#js_show_set").click(function(){
        $("#js_tps").hide();
        $("#js_set").show();
    });
})