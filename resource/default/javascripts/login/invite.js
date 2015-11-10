/**
 * Created by chenshanlian on 2015/3/3.
 */
var addorgName = '';
var newOrgArrs = null;
//获取组织架构
function getDefault(bol) {
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
        url: i8_session.ajaxHost + "webajax/login/getDefaultTree",
        type: "post",
        dataType: "json",
        success: function (data) {
            if (data.Result) {
                newOrgArrs = [];
                for (var key in data.ReturnObject) {
                    var item = data.ReturnObject[key];
                    if(bol && addorgName == item.Name){
                        var index = $("#js_org_drop_list").attr("zindex");
                        $($("#js_invite_tb").find("div.org-selct")[index]).attr("orgid",item.OrgID).html(item.Name);
                    }
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
//选择父节点
function showAddtree() {
    $("#js_add_org_parnt").html(newOrgArrs[0].name).attr("orgid",newOrgArrs[0].id); //默认选择顶级节点
    var setting2 = {
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
                var dropSel = $("#js_add_org_parnt")
                dropSel.attr("orgid", treeNode.id).html(treeNode.name);
                treeDome.hide();
            }
        }
    }
    $.fn.zTree.init($("#treedome2"), setting2, newOrgArrs);
}
$("#js_invite_tb").delegate(".lg-invite-name,.lg-invite-mobile", "focus", function () {
    $(this).removeClass("bdred");
});
//验证
$("#js_invite_tb").delegate(".lg-invite-name,.lg-invite-mobile", "blur", function () {
    var thisClass = $(this).attr("class");
    if (thisClass.indexOf("lg-invite-mobile") >= 0) {
        var mobileDom = $(this);
        var nameDom = mobileDom.parents("tr").find(".lg-invite-name");
        var nameVal = $.trim(nameDom.val());
        var mobileVal = $.trim(mobileDom.val());
        if (nameVal == "" && mobileVal == "") {
            return;
        }
        if (!regObj.fnameTest(nameVal)) {
            nameDom.addClass("bdred");
        };
        if (!regObj.fmobileTest(mobileVal)) {
            mobileDom.addClass("bdred");
        }
        return;
    }
    var nameDom = $(this);
    var mobileDom = nameDom.parents("tr").find(".lg-invite-mobile");
    var nameVal = nameDom.val();
    var mobileVal = mobileDom.val();
    if (!regObj.fnameTest(nameVal)) {
        nameDom.addClass("bdred");
    }
});
//下拉树
$("#js_invite_tb").delegate("div.org-selct", "click", function () {
    var treeDome = $("#js_org_drop_list");
    var domThis = $(this);
    var zindex = $("#js_invite_tb").find("div.org-selct").index(domThis);
    var oldTop = treeDome.offset().top - 33;
    var newTop = domThis.offset().top;
    if (oldTop == newTop) {
        treeDome.hide();
        return;
    }
    treeDome.attr("zindex", zindex).css({ left: domThis.offset().left, top: domThis.offset().top + 33 }).show();
});
//发送邀请
$("#js_pub_btn").click(function () {
    var inviteArrs = [];
    $("#js_invite_tb tbody").find("tr").each(function () {
        var thisDom = $(this);
        var nameDom = thisDom.find(".lg-invite-name");
        var mobileDom = thisDom.find(".lg-invite-mobile");
        var name = $.trim(nameDom.val());
        var mobile = $.trim(mobileDom.val());
        var orgID = thisDom.find("div.org-selct").attr("orgid");
        var bol = thisDom.find("input[type=checkbox]")[0].checked;
        if (name == "" && mobile == "") {
        } else {
            if (!regObj.fnameTest(name)) {
                nameDom.addClass("bdred");
            }
            if (!regObj.fmobileTest(mobile)) {
                mobileDom.addClass("bdred");
            }
            if (regObj.fnameTest(name) && regObj.fmobileTest(mobile) && orgID) {
                //fw.i9alert({ str: "请输入2-15个字母或汉字！", btnobj: nameDom, stype: true, type: 1 });
                inviteArrs.push({
                    Passport: mobile,
                    OrgID: orgID,
                    Name: name,
                    IsManager: bol
                });
            }
        }
    });
    if (inviteArrs.length <= 0) {
        i8ui.error('请检查姓名格式，手机号格式，部门选择是否正确！');
        return;
    }
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
                    i8ui.write('成功邀请' + count + '位同事,<span style="color:red;">邀请失败：'+ failCount +'位</span>');
                    setTimeout(function () {
                        window.location.href = "/login/setrole";
                    },2000);
                } else {
                    i8ui.error("邀请失败，邀请的同事的手机号都已存在");
                }
            } else {
                i8ui.error(data.Description);
            }
        },
        error: function (e1, e2, e3) {

        }
    });
});
//新增一行
$("#js_add_tr_btn").click(function () {
    if ($("#js_invite_tb tbody tr").length < 10) {
        $("#js_invite_tb tbody").append('<tr><td><input class="lg-invite-name" placeholder="姓名" type="text" /></td><td><input class="lg-invite-mobile" placeholder="手机号" type="text" /></td><td><div class="org-selct">请选择部门</div></td><td><label class="lg-invite-lb"><input type="checkbox" />部门负责人</label></td></tr>');
    } else {
        $(this).hide();
    }
});
//新增部门
$("#js_org_drop_list").on("click",".blue46x28", function () {
    $("#js_org_drop_list").hide();
    var tpl = $("#js_addorg").html();
    var tmp = template(tpl);
    var addbox = i8ui.showbox({
        title: "添加新部门",
        cont: tmp({})
    });
    showAddtree();
    //取消
    $(addbox).on("click", ".org-graybtn", function () {
        addbox.close();
        return;
    });
    //保存
    $(addbox).on("click", ".org-bluebtn", function () {
        var pid = $("#js_add_org_parnt").attr("orgid");
        var orgname = $.trim($("#js_org_add_name").val());
        if (!pid) {
            i8ui.error("请选择部门");
            return false;
        }
        if (!regObj.ftest(orgname, regObj.nametext)) {
            i8ui.error("部门名称格式不正确");
            return false;
        }
        var bol = true;
        for(var i=0; i<newOrgArrs.length; i++){
            var item = newOrgArrs[i];
            if(pid == item.pId && orgname == item.name){
                bol = false;
                i8ui.error("部门名称已存在");
                break;
            }
        }
        if(!bol){
            return false
        }
        $.ajax({
            url: i8_session.ajaxHost + "webajax/login/saveParam",
            type: "post",
            dataType: "json",
            data: {jdata:{ Name: orgname, ParentID: pid}},
            success: function (data) {
                if (data.Result) {
                    i8ui.write("新增成功！");
                    addorgName = orgname;
                    getDefault(true);
                    addbox.close();
                } else {

                }
            },
            error: function (e1, e2, e3) {

            }
        });
    });

    $("#js_add_org_parnt").click(function () {
        var treeDome = $("#js_org_add_list");
        var domThis = $(this);
        if (treeDome.css("display") == "block") {
            treeDome.hide();
            return false;
        }
        treeDome.css({ left: domThis.offset().left, top: domThis.offset().top + 33, "z-index": "1011","width":260 }).show();
        return false;
    });
    $(addbox).click(function () {
        $("#js_org_add_list").hide();
    });
});
$("#js_org_drop_list").on("click",".f346x28", function () {
    $("#js_org_drop_list").hide();
});
getDefault();