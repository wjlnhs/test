/**
 * Created by chenshanlian on 2015/3/19.
 */
define(function(require){
    var i8ui = require("../common/i8ui.js");
    var fw_page = require('../common/fw_pagination.js');
    var i8selector = require("../plugins/i8selector/fw_selector.js");
    var util = require('../common/util.js');
    var regbox = require('../common/regexp.js');
    var pageSize = 10;
    var dataList = null;
    var tbodyDom = $("#js_msg_tblist");
    //获取短信密码员工列表
    function getList(pageIndex){
        var searchKey = $.trim($("#js_searchkey").val());
        tbodyDom.html('<tr><td colspan="4"><div class="ld-64-gray"></div></td></tr>');
        $.ajax({
            url: i8_session.ajaxHost + "webajax/setcenter/sMSSetPage",
            type: "get",
            dataType: "json",
            cache:false,
            data:{jdata:{searchKey: searchKey, pindex:pageIndex, psize: pageSize}},
            success: function (data) {
                console.log(data);
                if(data.Result){
                    var tpl = require('./template/msgpwdlist.tpl');
                    template.helper("funMobile",function(data){
                        if(!data || data == ""){
                            return '<span class="red">未绑定手机号</span>';
                        }else{
                            return data;
                        }
                    });
                    var tmp = template(tpl);
                    $("#js_msg_tblist").html(tmp(data));
                    dataList = data.ReturnObject;
                    //控制分页
                    fw_page.pagination({
                        ctr: $("#js_page_panl"),
                        totalPageCount: data.Total,
                        pageSize: pageSize,
                        current: pageIndex,
                        fun: function (new_current_page, containers) {
                            getList(new_current_page);
                        }, jump: {
                            text: '跳转'
                        }
                    });
                }else{
                    i8ui.error(data.Description);
                }
            },
            error: function (e1, e2, e3) {
                i8ui.error("请求出错");
            }
        });
    }
    //获取余额
    function getReport(){
        $.ajax({
            url: i8_session.ajaxHost + "webajax/setcenter/getReport",
            type: "get",
            dataType: "json",
            success: function (data) {
                console.log(data);
                if(data.Result){
                    var pdiv = $("#js_money_num");
                    if(data.ReturnObject.curMoney <= 1){
                        pdiv.addClass("bg-fff");
                        pdiv.find("p").html('<label class="bold fz13"><i class="pic pic_25"></i>余额不足，服务已暂停，帐号在登录时将不会再收到短信密码</label><a href="setcenter/pay" class="yellow-btn bold m-l15 m-r15">在线充值并重启服务</a>');
                    }else{
                        pdiv.removeClass("bg-fff");
                        $("#js_money_span").html(data.ReturnObject.curMoney);
                    }
                    pdiv.show();
                }else{
                    i8ui.error(data.Description);
                }
            },
            error: function (e1, e2, e3) {
                i8ui.error("请求出错");
            }
        });
    }
    function loadbegin(){
        if(i8_session.platform.dctoken == "1"){
            $("#js_msg_pwd_stop").remove();
            $("#js_msg_pwd").show();
        }else{
            $("#js_msg_pwd").remove();
            $("#js_msg_pwd_stop").show();
        }
    }
    //查询
    $("#js_msg_pwd").on("click","span.blue94x32",function(){
        getList(1);
    });
    //开启短信密码事件
    $("#js_msg_pwd").on("click","span.yellow-btn",function(){
        var tpl = require('./template/startmsg.tpl');
        var tmp = template(tpl);
        var sbox = i8ui.showbox({
            title: "为同事开启短信密码",
            cont:tmp({})
        });
        var allRadio = $(sbox).find("input[type=radio]")[1];
        var ksn_owner = i8selector.KSNSelector({
            model: 2,
            width: 275,
            element: "#js_select_input",
            isAbox: true,
            searchType: { "org": false, "user": true, "grp": false },
            deleteCallback: function () {
                $($("div.lg-wk-set")[i]).find(".blue100x36,.add-invite-person").show();
            }
        });
        //选项切换
        $(sbox).on("click","input[type=radio]",function(){
            if(this.value == "all"){
                $("#js_setect_div").hide();
            }else{
                $("#js_setect_div").show();
            }
        });
        //取消
        $(sbox).on("click",".gray96x32",function(){
            sbox.close();
        })
        //开启
        $(sbox).on("click",".blue96x32",function(){
            var ajaxFunc = "updateAllToken";
            var jdata = {status: true};
            if(!allRadio.checked){
                ajaxFunc = "updateTokenEnable";
                jdata.passportIDs = [];
                var lists = ksn_owner.getAllselectedData();
                if(lists.length<=0){
                    i8ui.error("请选择要开启的同事！",$("#js_select_input"));
                    return;
                }
                for(var i=0; i<lists.length; i++){
                    jdata.passportIDs.push(lists[i].id);
                }
            }
            $.ajax({
                url: i8_session.ajaxHost + "webajax/setcenter/"+ajaxFunc,
                type: "get",
                dataType: "json",
                data:{jdata:jdata},
                success: function (data) {
                    console.log(data);
                    if(data.Result){
                        i8ui.write("开启成功！");
                        setTimeout(function(){
                            sbox.close();
                            getList(1);
                        },1000);
                    }else{
                        i8ui.error(data.Description);
                    }
                },
                error: function (e1, e2, e3) {
                    i8ui.error("请求出错");
                }
            });
        })
    });
    //更换手机号
    $("#js_msg_tblist").on("click","span.org-per-other",function(){
        var index = parseInt($(this).attr("index"));
        var item = dataList[index];
        var tpl = require('./template/uppassport.tpl');
        var tmp = template(tpl);
        var sbox = i8ui.showbox({
            title: "为同事更换手机号",
            cont:tmp({}).replace("#uname#",item.Name)
        });
        //修改
        $(sbox).on("click",".blue96x32",function(){
            var newPassport = $("#js_mobile_input").val();
            if(!regbox.fmobileTest(newPassport)){
                util.bgFlicker($("#js_mobile_input"));
                i8ui.txterror("请填写正确的手机号！",$("#js_mobile_input"));
                return;
            }
            var ajaxjFun = "changeMobile";
            if(item.Mobile == ""){
                ajaxjFun = "setNewPassport";
            }
            $.ajax({
                url: i8_session.ajaxHost + "webajax/setcenter/"+ajaxjFun,
                type: "get",
                dataType: "json",
                data:{jdata:{passportID: item.PassportID, oldPassport:item.Mobile, newPassport: newPassport}},
                success: function (data) {
                    console.log(data);
                    if(data.Result){
                        i8ui.write("修改成功！");
                        setTimeout(function(){
                            sbox.close();
                            getList(1);
                        },1000);
                    }else{
                        i8ui.error(data.Description);
                    }
                },
                error: function (e1, e2, e3) {
                    i8ui.error("请求出错");
                }
            });
        })
    });
    //取消短信密码
    $("#js_msg_tblist").on("click","span.org-per-edit",function(){
        var index = parseInt($(this).attr("index"));
        var item = dataList[index];
        var showhtml = '<div style="padding:40px; width: 260px;line-height:30px; font-size: 14px;">取消短信密码，会导致安全性下降，<br>是否确定取消“<a>'+item.Name+'</a>”的短信密码？<p class="fz12 m-t15 tcenter"><span class="gray96x32 m-r20">取消</span><span class="blue96x32">确定</span></p></div>'
        var sbox = i8ui.showbox({cont:showhtml});
        //确定
        $(sbox).on("click",".blue96x32",function(){
            $.ajax({
                url: i8_session.ajaxHost + "webajax/setcenter/updateTokenEnable",
                type: "get",
                dataType: "json",
                data:{jdata:{status: false, passportIDs:[item.PassportID]}},
                success: function (data) {
                    console.log(data);
                    if(data.Result){
                        i8ui.write("取消成功！");
                        setTimeout(function(){
                            sbox.close();
                            getList(1);
                        },1000);
                    }else{
                        i8ui.error(data.Description);
                    }
                },
                error: function (e1, e2, e3) {
                    i8ui.error("请求出错");
                }
            });
        })
    });
    loadbegin();
    getList(1);
    getReport();
});