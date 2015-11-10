/**
 * Created by chenshanlian on 2015/3/24.
 */
define(function(require){
    var i8ui = require('../common/i8ui.js');
    var regbox = require('../common/regexp.js');
    var i8selector = require("../plugins/i8selector/fw_selector.js");
    var fw_page = require('../common/fw_pagination.js');
    var roleArrs = [];
    var pageSize = 11;
    var ulDom = $("#js_role_list");
    //获取专项角色列表
    function getRoleList(pageIndex){
        $.ajax({
            url: i8_session.ajaxHost + "webajax/setcenter/getRoleList",
            type: "get",
            dataType: "json",
            cache:false,
            data:{ jdata:{pindex: pageIndex, psize: pageSize}},
            success: function (data) {
                console.log(data);
                if(data.Result){
                    roleArrs = data.ReturnObject.Item2;
                    var tpl = require('./template/rolelist.tpl');
                    var tmp = template(tpl);
                    ulDom.html(tmp(data.ReturnObject));
                    //控制分页
                    fw_page.pagination({
                        ctr: $("#js_page_panl"),
                        totalPageCount: data.ReturnObject.Item1,
                        pageSize: pageSize,
                        current: pageIndex,
                        fun: function (new_current_page, containers) {
                            getRoleList(new_current_page);
                        }, jump: {
                            text: '跳转'
                        }
                    });
                }
            },
            error: function(error){}
        });
    }
    //新增专项角色
    ulDom.on("click",".add-zxrole",function(){
        var tpl = require('./template/saverole.tpl');
        var tmp = template(tpl);
        var sbox = i8ui.showbox({
            title:"新增专项角色",
            cont: tmp({})
        });
        var ksn_owner = i8selector.KSNSelector({
            model: 1,
            width: 281,
            element: "#js_set_input",
            isAbox: true,
            searchType: { "org": false, "user": true, "grp": false }
        });
        //取消
        $(sbox).on("click",".gray96x32",function(){
            sbox.close();
        });
        //保存
        $(sbox).on("click",".blue96x32",function(){
            var nameDom = $("#js_role_name");
            var roleName = $.trim(nameDom.val());
            if(!regbox.ftest(roleName,regbox.nametext)){
                i8ui.txterror("角色名称格式不正确！",nameDom.next());
                return;
            }
            var uid = ksn_owner.selectedData();
            if(!uid || uid == ""){
                i8ui.txterror("请输入指定人员！",$("#js_set_input"));
                return;
            }
            $.ajax({
                url: i8_session.ajaxHost + "webajax/setcenter/addAdminRoleII",
                type: "get",
                dataType: "json",
                data:{jdata:{UserId: uid, RoleName:roleName}},
                success: function (data) {
                    console.log(data);
                    if(data.Result){
                        i8ui.write("保存成功！");
                        getRoleList(1);
                        sbox.close();
                    }else{
                        if(data.Code == 10030){
                            i8ui.error("该角色名已存在！");
                        }else{
                            i8ui.error(data.Description);
                        }
                    }
                },
                error: function (e1, e2, e3) {
                    i8ui.error("请求出错");
                }
            });
        });
    });
    //编辑专项角色
    ulDom.on("click",".zxrole-op-edit",function(){
        var thisDom = $(this);
        var index = thisDom.parent().attr("index");
        var item = roleArrs[index];
        var tpl = require('./template/saverole.tpl');
        var tmp = template(tpl);
        var sbox = i8ui.showbox({
            title:"编辑专项角色",
            cont: tmp({})
        });
        var nameDom = $("#js_role_name");
        var ksn_owner = i8selector.KSNSelector({
            model: 1,
            width: 281,
            element: "#js_set_input",
            isAbox: true,
            searchType: { "org": false, "user": true, "grp": false }
        });
        ksn_owner.setAllselectedData([{type:'user', id:item.UserID}]);
        //取消
        $(sbox).on("click",".gray96x32",function(){
            sbox.close();
        });
        nameDom.val(item.RoleName);
        //保存
        $(sbox).on("click",".blue96x32",function(){
            var roleName = $.trim(nameDom.val());
            if(!regbox.ftest(roleName,regbox.nametext)){
                i8ui.txterror("角色名称格式不正确！",nameDom.next());
                return;
            }
            var uid = ksn_owner.selectedData();
            if(!uid || uid == ""){
                i8ui.txterror("请输入指定人员！",$("#js_set_input"));
                return;
            }
            $.ajax({
                url: i8_session.ajaxHost + "webajax/setcenter/updateAdminRoleII",
                type: "get",
                dataType: "json",
                data:{jdata:{UserId: uid, RoleRecId:item.ID,RoleName:roleName}},
                success: function (data) {
                    console.log(data);
                    if(data.Result){
                        i8ui.write("编辑成功！");
                        getRoleList($("#js_page_panl a.selected").html() || 1);
                        sbox.close();
                    }else{
                        if(data.Code == 10030){
                            i8ui.error("该角色名已存在！");
                        }else{
                            i8ui.error(data.Description);
                        }
                    }
                },
                error: function (e1, e2, e3) {
                    i8ui.error("请求出错");
                }
            });
        });
    });
    //删除角色
    ulDom.on("click",".zxrole-op-del",function(){
        var thisDom = $(this);
        var index = thisDom.parent().attr("index");
        var item = roleArrs[index];
        i8ui.confirm({title:"确定要删除该角色吗？",btnDom:thisDom},function(){
            $.ajax({
                url: i8_session.ajaxHost + "webajax/setcenter/deleteAdminRole",
                type: "get",
                dataType: "json",
                cache:false,
                data:{ jdata:{RoleRecId: item.ID}},
                success: function (data) {
                    console.log(data);
                    if(data.Result){
                        i8ui.write('删除成功！');
                        getRoleList(1);
                    }
                },
                error: function(error){}
            });
        });
    });
    getRoleList(1);

});