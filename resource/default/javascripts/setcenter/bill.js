/**
 * Created by chenshanlian on 2015/3/19.
 */
define(function(require){
    var i8ui = require("../common/i8ui.js");
    var fw_page = require('../common/fw_pagination.js');
    //var util = require('../common/util.js');
    var pageSize = 10;
    var rechargeTB = $("#js_recharge_tb");
    var consumeTB = $("#js_consume_tb");
    //充值记录
    function getRecharge(pageIndex){
        rechargeTB.show();
        consumeTB.hide();
        rechargeTB.find("tbody").html('<tr><td colspan="4"><div class="ld-64-write"></div></td></tr>');
        $.ajax({
            url: i8_session.ajaxHost + "webajax/setcenter/getRechargeList",
            type: "get",
            dataType: "json",
            data:{jdata:{pindex:pageIndex, psize: pageSize, beginTime:$("#js_begin").val(), endTime:$("#js_end").val() }},
            success: function (data) {
                console.log(data);
                if(data.Result){
                    if(data.ReturnObject.length <= 0){
                        rechargeTB.find("tbody").html('<tr><td colspan="4">暂无充值记录</td></tr>');
                        return;
                    }
                    var tpl = require('./template/recharge.tpl');
                    var tmp = template(tpl);
                    rechargeTB.find("tbody").html(tmp(data));
                    //控制分页
                    fw_page.pagination({
                        ctr: $("#js_page1"),
                        totalPageCount: data.Total,
                        pageSize: pageSize,
                        current: pageIndex,
                        fun: function (new_current_page, containers) {
                            getRecharge(new_current_page);
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
    //消费记录
    function getConsumeList(pageIndex){
        consumeTB.show();
        rechargeTB.hide();
        consumeTB.find("tbody").html('<tr><td colspan="4"><div class="ld-64-write"></div></td></tr>');
        $.ajax({
            url: i8_session.ajaxHost + "webajax/setcenter/getConsumeList",
            type: "get",
            dataType: "json",
            data:{jdata:{pindex:pageIndex, psize: pageSize, beginTime:$("#js_begin").val(), endTime:$("#js_end").val() }},
            success: function (data) {
                console.log(data);
                if(data.Result){
                    if(data.ReturnObject.length <= 0){
                        consumeTB.find("tbody").html('<tr><td colspan="4">暂无消费记录</td></tr>');
                        return;
                    }
                    var tpl = require('./template/consume.tpl');
                    var tmp = template(tpl);
                    consumeTB.find("tbody").html(tmp(data));
                    //控制分页
                    fw_page.pagination({
                        ctr: $("#js_page1"),
                        totalPageCount: data.Total,
                        pageSize: pageSize,
                        current: pageIndex,
                        fun: function (new_current_page, containers) {
                            getConsumeList(new_current_page);
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
    //切换
    $("#js_type_menu").on("click","span",function(){
        $("#js_type_menu").find("span").removeClass("current")
        $(this).addClass("current");
        if($(this).html() == "充值明细"){
            getRecharge(1);
        }else{
            getConsumeList(1);
        }
    });
    //查询
    $("#js_search").click(function(){
        if($("#js_type_menu").find("span.current").html() == "充值明细"){
            getRecharge(1);
        }else{
            getConsumeList(1);
        }
    });
    getRecharge(1);


});