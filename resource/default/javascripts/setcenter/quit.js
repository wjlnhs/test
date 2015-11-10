/**
 * Created by chenshanlian on 2015/3/19.
 */
define(function(require){
    var i8ui = require("../common/i8ui.js");
    var util = require('../common/util.js');
    var rtDom = $("#js_result");
    var uid = util.getUrlParam("uid");
    var uname = util.getUrlParam("name");
    $("#js_uname").html(decodeURIComponent(uname));
    var appJsons = {};
    //读取工作协作列表
    function getApps(){
        $.post(i8_session.ajaxHost+'webajax/modules/getmutippsvalue',{keys:decodeURIComponent(i8_session.apps)},function(response){
            if(response.Result){
                for(var i=0; i<response.ReturnObject.length; i++){
                    var item = response.ReturnObject[i];
                    appJsons[item.Key] = item.Name;
                }
            }
            defuatlfun();
        },"json")
    }
    //离职检测
    function defuatlfun(){
        rtDom.attr("class","");
        $.ajax({
            url: i8_session.ajaxHost + "webajax/setcenter/checkPersonStatusForQuit",
            type: "get",
            dataType: "json",
            data:{jdata:{personID:uid}},
            success: function (data) {
                console.log(data);
                if(data.Result){
                    var rtJson = data.ReturnObject;
                    var htmlstr = '<ul class="lz-jc-ops">';
                    var ContentAdmin = rtJson.ContentAdmin ? "社区管理员 " : "";
                    var SuperAdmin = rtJson.SuperAdmin ? "超级管理员 " : "";
                    var SetCenterAdmin = rtJson.SetCenterAdmin ? "基础设置管理员 " : "";
                    var WorkflowAdmin = rtJson.WorkflowAdmin ? "流程管理员 " : "";
                    var WorkflowInnerAdmin = rtJson.WorkflowInnerAdmin ? "流程设计或流程实例 " : "";
                    var adminAppstr = [];
                    for(var i=0; i< rtJson.AdminApps.length; i++){
                        adminAppstr.push(appJsons[rtJson.AdminApps[i]]);
                    }
                    var  managerHTML = ContentAdmin+ SuperAdmin+ SetCenterAdmin + WorkflowAdmin + WorkflowInnerAdmin + adminAppstr.join(" ");
                    var isadmin = (managerHTML.length > 0);

                    htmlstr += '<li class="'+ !isadmin +'"><span class="jc-st">●</span><span class="jc-option">检测管理员身份</span><span class="jc-result">'+
                        (isadmin ? '检测到管理员身份：'+managerHTML:'该项检测通过!') +'</span></li>';
                    htmlstr += '<li class="'+(rtJson.DeptOwner == "")+'"><span class="jc-st">●</span><span class="jc-option">检测部门负责人身份</span><span class="jc-result">'+
                        ((rtJson.DeptOwner!="") ? '检测部门负责人：'+rtJson.DeptOwner:'该项检测通过!') +' </span></li>';
                    htmlstr += '<li class="'+(rtJson.SubCount <= 0)+'"><span class="jc-st">●</span><span class="jc-option">检测汇报关系身份</span><span class="jc-result">'+
                        ((rtJson.SubCount > 0) ? '检测到汇报关系身份：共'+ rtJson.SubCount +'人向其汇报':'该项检测通过!') +' </span></li>';
                    htmlstr += '<li class="'+(rtJson.PartTime == "")+'"><span class="jc-st">●</span><span class="jc-option">检测兼职身份</span><span class="jc-result">'+
                        ((rtJson.PartTime!="") ? '检测兼职身份：'+rtJson.PartTime:'该项检测通过!') +' </span></li>';
                    htmlstr += '<li class="'+(rtJson.DoingFlow <= 0)+'"><span class="jc-st">●</span><span class="jc-option">检测未处理流程</span><span class="jc-result">'+
                        ((rtJson.DoingFlow > 0) ? '检测未处理流程：共'+rtJson.DoingFlow+'支流程实例待审批!':'该项检测通过!' ) +'</span></li>';
                    htmlstr += '<li class="'+(rtJson.SpecialRole == "")+'"><span class="jc-st">●</span><span class="jc-option">检测专项角色身份</span><span class="jc-result">'+
                        ( (rtJson.SpecialRole != "") ? '检测到专项角色身份：'+rtJson.SpecialRole : '该项检测通过!') +'</span></li>';
                    htmlstr += '<li class="'+(rtJson.GroupAdmin == 0)+'"><span class="jc-st">●</span><span class="jc-option">检测群组管理员</span><span class="jc-result">'+
                        ((rtJson.GroupAdmin > 0) ? '检测到群组管理员身份：Ta共在'+rtJson.GroupAdmin+'个群组中担任管理员!':'该项检测通过!' ) +'</span></li>';
                    htmlstr += '<li class="'+(rtJson.ReceiveFlow == 0)+'"><span class="jc-st">●</span><span class="jc-option">检测流程收文设置</span><span class="jc-result">'+
                        ((rtJson.ReceiveFlow > 0) ? '检测流程收文设置：共'+rtJson.ReceiveFlow+'支流程设置了Ta为流程收文人':'该项检测通过!') +'</span></li>';
                    htmlstr += '</ul>';
                    rtDom.attr("class","lz-jc").html(htmlstr);
                    if(rtDom.find("li.false").length <= 0){
                        $("#js_set_quit").show();
                        //设为离职
                        $("#js_set_quit").click(function(){
                            $.ajax({
                                url: i8_session.ajaxHost + "webajax/setcenter/updateStatus",
                                type: "get",
                                dataType: "json",
                                cache: false,
                                data:{jdata:{passportID:uid, status:1, remark:''}},
                                success: function (data) {
                                    if (data.Result) {
                                        i8ui.write("设置离职状态成功！");
                                        setTimeout(function(){
                                            window.location.href = i8_session.baseHost+"setcenter/per-quit";
                                        },2000);
                                    } else {
                                        i8ui.error(data.Description);
                                    }
                                },
                                error: function (e1, e2, e3) {

                                }
                            });
                        });
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
    getApps();
});