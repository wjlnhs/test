/**
 * Created by Administrator on 2015/11/5.
 */
define(function(require){
    var newOrgArrs = null;
    //获取组织架构
    function getDefault() {
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
                    var treeDome = $("#js_org_drop_list");
                    var zindex = treeDome.attr("zindex");
                    var dropSel = $("#js_invite_tb").find("div.org-selct");
                    $(dropSel[zindex]).attr("orgid", treeNode.id).html(treeNode.name);
                    treeDome.hide();
                }
            }
        }
        $.ajax({
            url: "/webajax/setcenter/getDefaultOrgTree",
            type: "post",
            dataType: "json",
            data:{jdata:{aid:i8_session.aid}},
            success: function (data) {
                if (data.Result) {
                    newOrgArrs = [];
                    for (var i = 0; i < data.ReturnObject.length; i++) {
                        var item = data.ReturnObject[i];
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
    //获取群组列表
    function getGroupList(){
        $.ajax({
            url: "/webajax/group/myGroupAndPublicParam",
            type: "post",
            dataType: "json",
            data:{pageSize: 15, pageIndex: 1,queryType:1,},
            success: function (data) {
                if (data.Result) {
                    var listr = '';
                    var arrS = data.List || [];
                    for (var i=0; i < arrS.length; i++) {
                        listr += '<li>'+ arrS[i].Item1.Name +'</li>'
                    }
                    $("#js_group_list").html(listr);
                } else {

                }
            },
            error: function (e1, e2, e3) {

            }
        });
    }
    //获取专项角色
    function getRoleList() {
        $.ajax({
            url: "/webajax/setcenter/getSystemRole",
            type: "post",
            dataType: "json",
            success: function (data) {
                if (data.Result) {
                    var listHtml = '';
                    var roleArrs = data.ReturnObject;
                    for (var i = 0; i < roleArrs.length; i++) {
                        listHtml += '<li>'+ roleArrs[i].RoleName+'  '+ roleArrs[i].UserName +'</li>';
                    }
                    $("#js_workflow_role").html(listHtml);
                } else {

                }
            },
            error: function (e1, e2, e3) {

            }
        });
    }
    //获取激活的流程
    function getTempList(){
        $.ajax({
            url: "/webajax/setcenter/getAccountProc",
            type: "post",
            dataType: "json",
            success: function (data) {
                if (data.Result) {
                    var htmlstr = '';
                    for(var i=0; i<data.ReturnObject.length; i++){
                        var item = data.ReturnObject[i];
                        htmlstr += '<li title="'+ item +'" style="overflow:hidden; text-overflow: ellipsis; white-space: nowrap;">'+item;+'</li>';
                    }
                    $("#js_workflow_jihuo").html(htmlstr);
                } else {
                    i8ui.error(data.Description);
                }
            },
            error: function (e1, e2, e3) {
            }
        });
    }
    getDefault();
    getRoleList();
    getGroupList();
    getTempList();
    $("#js_regover").on("click",".ct-close",function(){
        $("#js_regover").remove();
        $("#js_msk").remove();
    });
})