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
    var orgJson = {};
    //获取组织架构
    function getDefault(orgDom) {
        var setting = {
            view: {
                dblClickExpand: false,
                showLine: true,
                showIcon: false,
                nameIsHTML: true,
                showTitle: false
            },
            data: {
                simpleData: {
                    enable: true
                }
            },
            callback: {
                onClick: function (e, treeId, treeNode) {
                    orgDom.attr("orgid", treeNode.id).html(treeNode.name);
                    orgDom.next().hide();
                }
            }
        }
        $.ajax({
            url: i8_session.ajaxHost + "webajax/setcenter/getDefaultOrgTree",
            type: "get",
            dataType: "json",
            cache: false,
            success: function (data) {
                console.log(data);
                if (data.Result) {
                    var newOrgArrs = [];
                    for (var key in data.ReturnObject) {
                        var item = data.ReturnObject[key];
                        orgJson[item.OrgID] = item.Name;
                        newOrgArrs.push({ id: item.OrgID, name: item.Name, title: item.Name, open: (item.ParentID == 0), pId: item.ParentID });
                    }
                    $.fn.zTree.init($("#treedome"), setting, newOrgArrs);
                } else {

                }
            },
            error: function (e1, e2, e3) {

            }
        });
    }
    //成员列表
    function getStatusPersons(pageIndex) {
        var searchKey = $.trim(sheachDom.val());
        tbodyDom.html('<tr><td colspan="3"><div class="ld-64-write"></div></td></tr>');
        $.ajax({
            url: i8_session.ajaxHost + "webajax/setcenter/getPersonListByStatus",
            type: "get",
            dataType: "json",
            cache: false,
            data:{jdata:{pindex: pageIndex, psize:pageSize, status:1, searchKey: searchKey}},
            success: function (data) {
                if (data.Result) {
                    personArrs = data.ReturnObject;
                    var tpl = require('./template/per-quit.tpl');
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
    //获取职级
    function getClassLine(selDom,classid){
        $.ajax({
            url: i8_session.ajaxHost + "webajax/setcenter/getClassLine",
            type: "get",
            dataType: "json",
            success: function (data) {
                if(data.Result){
                    var selhtml = '';
                    for(var i=0; i<data.ReturnObject.length; i++){
                        var it = data.ReturnObject[i];
                        var selted = ''
                        if(classid == it.LevelID){
                            selted = 'selected';
                        }
                        selhtml = '<option '+selted+' value="'+it.LevelID+'">'+it.Name+'</option>' + selhtml;
                    }
                    selDom.html(selhtml);
                    selDom.setSelect({style:"height: 33px; line-height: 33px; width:240px;"});
                }else{
                    i8ui.error(data.Description);
                }
            },
            error: function (e1, e2, e3) {
                i8ui.error("请求出错");
            }
        });
    }

    //在入职
    tbodyDom.on("click",".org-per-other",function(){
        var index = $(this).attr("index");
        var item = personArrs[index];
        var tpl = require('./template/entry.tpl');
        var tmp = template(tpl);
        var sbox = i8ui.showbox({
            title: '“'+ item.Name +'”再入职',
            cont: tmp(item)
        });
        var orgDom = $("#js_org_sel")
        var classDom = $("#js_class_sel");
        if(!orgJson[item.OrgID]){
            orgDom.attr("orgid","").html(" ");
        }
        getClassLine(classDom,item.ClassID);
        getDefault(orgDom);
        //取消
        $(sbox).on("click",".gray96x32",function(){
            sbox.close();
        });

        //保存
        $(sbox).on("click",".blue96x32",function(){
            var orgid = orgDom.attr("orgid");
            var classid = $("#js_class_sel").getValue();
            if(!orgid || orgid == ""){
                i8ui.error("请选择部门！",orgDom);
                return;
            }
            $.ajax({
                url: i8_session.ajaxHost + "webajax/setcenter/reEntry",
                type: "get",
                dataType: "json",
                data:{jdata:{classID:classid,orgID: orgid, passportID: item.PassportID }},
                success: function (data) {
                    console.log(data);
                    if(data.Result){
                        i8ui.write("保存成功！");
                        getStatusPersons($("#js_page_panl a.selected").html());
                        sbox.close();
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
