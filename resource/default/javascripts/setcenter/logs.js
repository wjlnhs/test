/**
 * Created by chenshanlian on 2015/3/17.
 */
define(function(require){
    var i8ui = require('../common/i8ui.js');
    var i8selector = require("../plugins/i8selector/fw_selector.js");
    var fw_page = require('../common/fw_pagination.js');
    var tbDom = $("#logs").find('tbody');
    var managers = null;
    var pageSize = 10;

    //获取日志
    $('#startTime').setTime({
        maxDate:'#F{$dp.$D(\'endTime\')}'
    })
    $('#endTime').setTime({
        minDate:'#F{$dp.$D(\'startTime\')}'
    })
    function getLogList(pageIndex,startDate,endDate,keyword){
        $.ajax({
            url: i8_session.ajaxHost + "webajax/setcenter/getLogList",
            type: "get",
            dataType: "json",
            data:{jdata:{pageSize:pageSize, pageIndex:pageIndex,startDate:startDate,endDate :endDate,keyword :keyword }},
            cache:false,
            success: function (data) {
                if(data.Result){
                    if(data.List && data.List.length<=pageSize){
                        $("#js_page_panl").html('');
                    }
                    if(data.List && data.List.length==0){
                        function render_no_data(box){
                            //没有数据
                            var txt="没有找到任何数据~";
                            $(box).html('<td class="noresult" colspan="5">\
                        <div class="no-resulticon noresult-icon"></div>\
                            <div class="noresult-title">'+txt+'</div>\
                        </td>');
                        }
                        render_no_data(tbDom)
                        return;
                    }
                    console.log(data)
                    var tpl = require('./template/logs.tpl');
                    var tmp = template(tpl);
                    tbDom.html(tmp(data));
                    //控制分页
                    fw_page.pagination({
                        ctr: $("#js_page_panl"),
                        totalPageCount: data.Total,
                        pageSize: pageSize,
                        current: pageIndex,
                        fun: function (new_current_page, containers) {
                            getLogList(new_current_page,startDate,endDate,keyword);
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
    $('#search_logs_btn').on('click',function(){
        var startDate=$('#startTime').val().replace(/\-/g,'/') || undefined;
        var endDate=$('#endTime').val().replace(/\-/g,'/') || undefined;
        var keyword=$('.search-txt').val() || undefined;
        if((endDate && !startDate) || (!endDate && startDate)){
            i8ui.error('请填写完整开始时间和结束时间');
            return;
        }
        getLogList(1,startDate,endDate,keyword);
    })
    getLogList();
})