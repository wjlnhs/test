/**
 * Created by chenshanlian on 2015/3/4.
 */
define(function(require,exports){
    var i8selector = require("../plugins/i8selector/fw_selector.js");
    var newOrgArrs = [];
    var roleList = null;
    function getRoleList() {
        $.ajax({
            url: i8_session.ajaxHost + "webajax/login/getSystemRole",
            type: "post",
            dataType: "json",
            success: function (data) {
                if (data.Result) {
                    var listHtml = '';
                    var tpl = $("#js_rolelist").html();
                    var tmp = template(tpl);
                    roleList = data.ReturnObject;
                    $("#js_role_list").html(tmp(data));
                    for (var i = 0; i < roleList.length; i++) {
                        selectBegin('#js_role'+i,i);
                    }
                } else {

                }
            },
            error: function (e1, e2, e3) {

            }
        });
    }
    function selectBegin(id,i) {
        var ksn_owner = i8selector.KSNSelector({
            model: 1,
            width: 550,
            element: id,
            isAbox: true,
            searchType: { "org": false, "user": true, "grp": false },
            deleteCallback: function () {
                $($("div.lg-wk-set")[i]).find(".blue100x36,.add-invite-person").show();
            }
        });
    }
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
                    var treeDome = $("#js_org_add_list");
                    var dropSel = $("#js_add_org_parnt");
                    dropSel.attr("orgid", treeNode.id).html(treeNode.name);
                    treeDome.hide();
                }
            }
        }
        $.ajax({
            url: i8_session.ajaxHost + "webajax/login/getDefaultTree",
            type: "post",
            dataType: "json",
            success: function (data) {
                if (data.Result) {
                    newOrgArrs = [];
                    for (var i=0; i<data.ReturnObject.length; i++) {
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
    //下一步
    $("#js_next_link").click(function(){
        var setRoles = {};
        var thisDom = $(this)
        var bol = false;
        $("#js_role_list").find("input").each(function(index){
            var thisDom = $(this);
            var roleID = roleList[index].ID;
            var userID = (thisDom.prev()).attr("data-uid");
            if(userID){
                bol = true;
                setRoles[roleID] = userID;
            }
        });
        if(bol){
            $.ajax({
                url: i8_session.ajaxHost + "webajax/login/updateSystemRole",
                type: "post",
                dataType: "json",
                data: {jdata:{roleDict:JSON.stringify(setRoles)}},
                success: function (data) {
                    if (data.Result) {
                        i8ui.write("设置成功！", thisDom);
                        setTimeout(function(){
                            window.location.href = i8_session.baseHost + 'login/protemplate';
                        },1500);
                    } else {
                        i8ui.error(data.Description, thisDom);
                    }
                },
                error: function (e1, e2, e3) {

                }
            });
        }else{
            window.location.href = '/login/protemplate'
        }
    });

    //保存角色
    $("#js_role_list").delegate(".blue100x36", "click", function () {
        var thisDom = $(this);
        var roleID = thisDom.attr("id");
        var userid = thisDom.parents("dl").find("span.fw_ksninput_slted").data("uid");
        if (!userid || userid == "") {
            i8ui.error("设置角色人员不能为空！",thisDom);
            return;
        }
        $.ajax({
            url: i8_session.ajaxHost + "webajax/login/updateSystemRole",
            type: "post",
            dataType: "json",
            data: {jdata:{ID: roleID,saveUserID: userid}},
            success: function (data) {
                if (data.Result) {
                    i8ui.write("设置成功！", thisDom);
                    thisDom.hide();
                    thisDom.parent().next().find("a").hide();
                } else {
                    i8ui.error(data.Description, thisDom);
                }
            },
            error: function (e1, e2, e3) {

            }
        });
    });
    //邀请同事弹出层
    $("#js_role_list").on( "click",".add-invite-person", function () {
        var tpl = $("#js_addperson").html();
        var addbox = i8ui.showbox({
            title: "邀请同事加入",
            cont: tpl
        });
        //保存
        $(addbox).on("click", ".org-bluebtn", function () {
            var name = $.trim($("#js_org_add_name").val());
            var mobile = $.trim($("#js_org_add_mobile").val());
            var orgID = $("#js_add_org_parnt").attr("orgid");
            if (!orgID) {
                i8ui.error('请选择部门！');
                return;
            }
            if (!regObj.fmobileTest(mobile)) {
                $("#js_org_add_mobile").addClass("bdred");
                i8ui.error('请输入正确的手机号！');
                return;
            }
            if (!regObj.fnameTest(name)) {
                $("#js_org_add_name").addClass("bdred");
                i8ui.error('姓名格式不正确，2-15个字母或汉字！');
                return;
            }
            var inviteArrs = [{
                Passport: mobile,
                OrgID: orgID,
                Name: name,
                IsManager: false
            }];
            $.ajax({
                url: i8_session.ajaxHost + "webajax/login/invitePerson",
                type: "post",
                dataType: "json",
                data: {jdata:{psnArray: inviteArrs} },
                success: function (data) {
                    if (data.Result) {
                        var count = 0;
                        var failCount = 0;
                        for (var key in data.ReturnObject) {
                            if (data.ReturnObject[key] == 0) {
                                count++;
                            }else{
                                failCount ++;
                            }
                        }
                        if (count > 0) {
                            i8ui.write('邀请成功');
                            addbox.close();
                        } else {
                            i8ui.error("邀请失败，邀请的同事的手机号已存在");
                        }
                    } else {
                        i8ui.error(data.Description);
                    }
                },
                error: function (e1, e2, e3) {
                }
            });
        });
        $(addbox).on("focus", "input", function () {
            $(this).removeClass("bdred");
        });
        $(addbox).click(function () {
            $("#js_org_add_list").hide();
        });
        $("#js_add_org_parnt").click(function () {
            var treeDome = $("#js_org_add_list");
            var domThis = $(this);
            if (treeDome.css("display") == "block") {
                treeDome.hide();
                return false;
            }
            treeDome.css({ left: domThis.offset().left, top: domThis.offset().top + 33, "z-index": "1001" }).show();
            return false;
        });
    });
    getDefault();
    getRoleList();
})


