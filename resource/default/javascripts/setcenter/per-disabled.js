/**
 * Created by chenshanlian on 2015/3/20.
 */
define(function(require){
    var regObj = require('../common/regexp.js');
    var i8ui = require('../common/i8ui.js');
    var util = require('../common/util.js');
    var fw_page = require('../common/fw_pagination.js');

    var pageSize = 10;
    var personArrs = [];
    var sheachDom = $("#js_person_shtxt");
    var tbodyDom = $("#js_tbody_list");
    //获取组织架构
    function getStatusPersons(pageIndex) {
        var searchKey = $.trim(sheachDom.val());
        tbodyDom.html('<tr><td colspan="4"><div class="ld-64-write"></div></td></tr>');
        $.ajax({
            url: i8_session.ajaxHost + "webajax/setcenter/getPersonListByStatus",
            type: "get",
            dataType: "json",
            cache: false,
            data:{jdata:{pindex: pageIndex, psize:pageSize, status:2, searchKey: searchKey}},
            success: function (data) {
                console.log(data);
                if (data.Result) {
                    personArrs = data.ReturnObject;
                    var tpl = require('./template/per-disabled.tpl');
                    var tmp = template(tpl);
                    template.helper("getpersonEdit",function(index){
                        return ''
                    });
                    tbodyDom.html(tmp(data));
                    $("#js_total").html(data.Total);

                    if(data.Total == 0) {
                        $("#js_page_panl").hide();
                    }else{
                        $("#js_page_panl").show();
                    }
                    //控制分页
                    fw_page.pagination({
                        ctr: $("#js_page_panl"),
                        totalPageCount: data.Total,
                        pageSize: pageSize,
                        current: pageIndex,
                        fun: function (new_current_page, containers) {
                            getStatusPersons(new_current_page);
                        }, jump: {
                            text: '跳转'
                        }
                    });
                } else {

                }
            },
            error: function (e1, e2, e3) {

            }
        });
    }
    //恢复
    tbodyDom.on("click",".org-per-other",function(){
        var $this = $(this);
        var item = personArrs[$this.attr("index")];
        i8ui.confirm({title:'确定要取消对“'+item.Name+'”的禁用吗？', btnDom: $this},function(){
            $.ajax({
                url: i8_session.ajaxHost + "webajax/setcenter/updateStatus",
                type: "get",
                dataType: "json",
                data:{jdata:{status:0, remark:"",passportID: item.PassportID}},
                success: function (data) {
                    console.log(data);
                    if(data.Result){
                        i8ui.write("恢复成功！");
                        getStatusPersons($("#js_page_panl a.selected").html());
                    }else{
                        i8ui.error(data.Description);
                    }
                },
                error: function (e1, e2, e3) {
                    i8ui.error("请求出错");
                }
            });
        });
    });
    //查询
    $("#js_searh_btn").click(function(){
        getStatusPersons(1);
    });
    //回车查询
    $("#js_person_shtxt").keyup(function(e){
        var e = e || window.event
        if(e && e.keyCode == 13){
            getStatusPersons(1);
        }
    });
    getStatusPersons(1);
});
