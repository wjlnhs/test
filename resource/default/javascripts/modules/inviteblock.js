/**
 * Created by chenshanlian on 2015/10/23 邀请同事的JS
 */
define((function(require){
    var i8ui = require('../common/i8ui');
    var util= require('../common/util');
    var reg = require('../common/regexp');
    var inviteBox = null;
    var treeDom = document.createElement("ul");
    var orgCkDom = null;
    treeDom.setAttribute("class","ztree rt-invite-ztree");

    //获取组织架构
    function getDefaulttree() {
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
                    orgCkDom.attr("orgid", treeNode.id).html(treeNode.name).addClass("cl000");
                    $(treeDom).hide();
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
                    for (var i=0; i<data.ReturnObject.length; i++) {
                        var item = data.ReturnObject[i];
                        newOrgArrs.push({ id: item.OrgID, name: item.Name, title: item.Name, open: (item.ParentID == 0), pId: item.ParentID });
                    }
                    $.fn.zTree.init($(treeDom), setting, newOrgArrs);
                    $("body").append(treeDom);
                } else {

                }
            },
            error: function (e1, e2, e3) {

            }
        });
    }
    //邀请同事
    $("#js_invite_btn").on("click",function(){
        var tpl = require('./template/invite.tpl');
        var tmp = template(tpl);
        inviteBox = i8ui.showbox({
            title:"邀请同事加入社区",
            cont: tmp({})
        });
        //邀请更多
        $(inviteBox).on("click",".add-btn",function(){
            var addStr = '<div class="tr"><input class="name" typte="text" placeholder="姓名"/><input class="port" typte="text" placeholder="请输入同事的手机号或电子邮箱"/><span class="classid" class="invite-class">请选择部门</span></div>';
            var parentDom = $(this).parent()
            parentDom.before(addStr);
            if($(inviteBox).find("input.name").length >= 10){
                parentDom.remove();
            }
        });
        $(inviteBox).on("click",function(){
            $(treeDom).hide();
        });
        //显示下拉部门
        $(inviteBox).on("click",".classid",function(){
            orgCkDom = $(this);
            var topN = orgCkDom.offset().top + 33;
            var leftN = orgCkDom.offset().left;
            $(treeDom).css({top:topN,left:leftN,display:"block",zIndex:1001});
            return false;
        });
        //发送邀请
        $(inviteBox).on("click",".blue96x32",function(){
            var trDoms = $(inviteBox).find("div.tr");
            var inviteArrs = [];
            var bol = true;
            trDoms.each(function(){
                var $this = $(this);
                var nameDom = $this.find("input.name");
                var portDom = $this.find("input.port");
                var orgDom = $this.find("span.classid");

                var nameValue = $.trim(nameDom.val());
                var portValue = $.trim(portDom.val());
                var orgValue = orgDom.attr("orgid");
                if(!nameValue && !portValue && !orgValue){
                    return true;
                }
                if(!reg.ftest(nameValue,reg.nametext)){
                    util.bgFlicker(nameDom);
                    i8ui.error("姓名格式不正确！");
                    bol = false;
                    return false;
                }else if(!reg.femailTest(portValue) && !reg.fmobileTest(portValue)){
                    util.bgFlicker(portDom);
                    i8ui.error("账号格式不正确！");
                    bol = false;
                    return false;
                }else if(!orgValue){
                    util.bgFlicker(orgDom);
                    i8ui.error("请选择部门！");
                    bol = false;
                    return false;
                }
                inviteArrs.push({
                    Passport: portValue,
                    OrgID: orgValue,
                    Name: nameValue,
                    IsManager: false
                });
            });
            if (inviteArrs.length <= 0) {
                i8ui.error('请检查姓名格式，手机号格式，部门选择是否正确！');
                return;
            }
            if(!bol){
                return false;
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
                                inviteBox.close();
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
        getDefaulttree();
    });

}))
