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
        tbodyDom.html('<tr><td colspan="3"><div class="ld-64-write"></div></td></tr>');
        $.ajax({
            url: i8_session.ajaxHost + "webajax/setcenter/getPersonListByStatus",
            type: "get",
            dataType: "json",
            cache: false,
            data:{jdata:{pindex: pageIndex, psize:pageSize, status:0, searchKey: searchKey}},
            success: function (data) {
                console.log(data);
                if (data.Result) {
                    personArrs = data.ReturnObject;
                    var tpl = require('./template/per-notype.tpl');
                    var tmp = template(tpl);
                    template.helper("getpersonEdit",function(index){
                        return ''
                    });
                    tbodyDom.html(tmp(personArrs));
                    $("#js_total").html(personArrs.rc);

                    //控制分页
                    fw_page.pagination({
                        ctr: $("#js_page_panl"),
                        totalPageCount: personArrs.rc,
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
    getStatusPersons(1);
});
