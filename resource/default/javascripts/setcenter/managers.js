/**
 * Created by chenshanlian on 2015/3/17.
 */
define(function(require){
    var i8ui = require('../common/i8ui.js');
    var i8selector = require("../plugins/i8selector/fw_selector.js");
    var fw_page = require('../common/fw_pagination.js');
    var tbDom = $("#js_managers_tbody");
    var managers = null;
    var pageSize = 10;
    var mgTyparrs = [];
    var appJsons = {
    }
    //读取工作协作列表
    function getApps(){
        $.post(i8_session.ajaxHost+'webajax/modules/getmutippsvalue',{keys:decodeURIComponent(i8_session.apps)},function(response){
            if(response.Result){
                for(var i=0; i<response.ReturnObject.length; i++){
                    var item = response.ReturnObject[i];
                    mgTyparrs.push(item.Key);
                    appJsons[item.Key] = item.Name;
                }
            }
            getAdmin(1);
        },"json")
    }
    getApps();
    //获取管理员列表
    function getAdmin(pageIndex){
        var _index = pageIndex || 1;
        $.ajax({
            url: i8_session.ajaxHost + "webajax/setcenter/getAdmin",
            type: "get",
            dataType: "json",
            data:{jdata:{psize:pageSize, pindex:_index}},
            cache:false,
            success: function (data) {
                console.log(data);
                if(data.Result){
                    managers = data.ReturnObject;
                    var tpl = require('./template/managers.tpl');
                    var tmp = template(tpl);
                    template.helper('funMangers',function(arrs,arrs2){
                        var str = arrs.join('，');
                        str = str.replace('20','基础设置').replace('30','社区').replace("40","流程管理");
                        var mgArrs = [];
                        for(var i=0; i<arrs2.length; i++){
                            if(appJsons[arrs2[i]])
                                mgArrs.push(appJsons[arrs2[i]]);
                        }
                        if(str == ""){
                            return mgArrs.join("，");
                        }
                        if(mgArrs.length <= 0){
                            return str;
                        }
                        return str+"，" + mgArrs.join("，");
                    });
                    template.helper('appMangers',function(arrs){

                    });
                    tbDom.html(tmp(data));
                    //控制分页
                    fw_page.pagination({
                        ctr: $("#js_page_panl"),
                        totalPageCount: data.Total,
                        pageSize: pageSize,
                        current: pageIndex,
                        fun: function (new_current_page, containers) {
                            getAdmin(new_current_page);
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
    //读取人员的管理员信息
    function getManagerByID(userID,sbox){
        $.ajax({
            url: i8_session.ajaxHost + "webajax/setcenter/getSingleAdmin",
            type: "get",
            dataType: "json",
            data:{jdata:{userID:userID}},
            cache:false,
            success: function (data) {
                console.log(data);
                if(data.Result){
                    loadAdmin(data.ReturnObject,sbox);
                }else{
                    i8ui.error(data.Description);
                }
            },
            error: function (e1, e2, e3) {
                i8ui.error("请求出错");
            }
        });
    }
    //保存管理员
    function saveAdmin(uid,sbox){
        var chTypes = $(sbox).find("input[name='mgtype']");
        var otherTypes = $(sbox).find("input[name='mg-other-type']");
        var mgtype = 0;
        chTypes.each(function(){
            if(this.checked){
                mgtype += parseInt(this.value);
            }
        });
        var addapps = [];
        var delapps = [];
        otherTypes.each(function(){
            if(this.checked){
                addapps.push(this.value);
            }else{
                delapps.push(this.value);
            }
        });
        if(mgtype<=0 && addapps.length <= 0){
            i8ui.error("请选择对应的管理员角色！");
            return;
        }
        $.ajax({
            url: i8_session.ajaxHost + "webajax/setcenter/saveAdmin",
            type: "get",
            dataType: "json",
            data:{jdata:{adminID: uid, type:mgtype,addapps:addapps,delapps:delapps}},
            success: function (data) {
                console.log(data);
                if(data.Result){
                    i8ui.write("保存成功！");
                    var pindex = $("#js_page_panl .selected").html() || 1;
                    getAdmin(pindex);
                    sbox.close();
                }else{
                    i8ui.error(data.Description);
                }
            },
            error: function (e1, e2, e3) {
                i8ui.error("请求出错");
            }
        });
    }
    //新增管理员
    $("#js_add_mg").click(function(){
        var tpl = require('./template/addmanager.tpl');
        var tmp = template(tpl);
        var sbox = i8ui.showbox({
            title:"添加管理员",
            cont:tmp({})
        });
        var ksn_owner = i8selector.KSNSelector({
            model: 1,
            width: 290,
            element: "#js_set_input",
            isAbox: true,
            searchType: { "org": false, "user": true, "grp": false },
            selectCallback: function(uid){
                getManagerByID(uid,sbox);
            }
        });
        //应用管理员
        var mgtypehtml = '';
        for(var i=0; i<mgTyparrs.length; i++){
            mgtypehtml += '<label class="label1"><input type="checkbox" value="'+ mgTyparrs[i] +'" name="mg-other-type" />'+ appJsons[mgTyparrs[i]] +'</label>';
        }
        $("#js_mgtype_lists").append(mgtypehtml);
        sbox.againShow();
        //保存
        $(sbox).on("click",".blue96x32",function(){
            var uid = ksn_owner.selectedData();
            if(!uid || uid == ""){
                i8ui.txterror("请输入管理员！",$("#js_set_input"));
                return;
            }
            saveAdmin(uid,sbox);
        });
    });
    //勾上对应的应用
    function loadAdmin(items,sbox){
        var radioDoms = $(sbox).find(".label1 input");
        var rolesing = items.Roles.join(";");
        radioDoms.removeAttr("checked");
        for(var i=0; i<items.AppAdmin.length; i++){
            radioDoms.each(function(){
                if(this.value == items.AppAdmin[i]){
                    this.checked = true;
                }
            });
        }
        if(rolesing.indexOf("20") >= 0){
            radioDoms[0].checked = true;
        }
        if(rolesing.indexOf("30") >= 0){
            radioDoms[1].checked = true;
        }
        if(rolesing.indexOf("40") >= 0){
            radioDoms[2].checked = true;
        }
    }
    //变更角色
    tbDom.on("click",".org-per-edit",function(){
        var items = managers[$(this).attr("index")];
        var tpl = require('./template/editmanager.tpl');
        var tmp = template(tpl);
        var htmlstr = tmp({});
        var sbox = i8ui.showbox({
            title:"编辑管理员",
            cont:htmlstr.replace('#uname#',items.Name)
        });
        //应用管理员
        var mgtypehtml = '';
        var appsStr = items.AppAdmin.join();
        for(var i=0; i<mgTyparrs.length; i++){
            var cked = (appsStr.indexOf(mgTyparrs[i])>=0) ? 'checked':'';
            mgtypehtml += '<label class="label1"><input type="checkbox" '+cked+' value="'+ mgTyparrs[i] +'" name="mg-other-type" />'+ appJsons[mgTyparrs[i]] +'</label>';
        }
        $("#js_mgtype_lists").append(mgtypehtml);
        loadAdmin(items,sbox);
        //选中对应的应用权限
        sbox.againShow();
        //保存
        $(sbox).on("click",".blue96x32",function(){
            var uid = items.PassportID;
            saveAdmin(uid,sbox);
        });
    });
    //撤销管理员
    tbDom.on("click",".org-per-other",function(){
        var uid = $(this).attr("uid");
        var sbox = i8ui.confirm({title:"确定要撤销该管理员吗？",btnDom: $(this)},function(){
            $.ajax({
                url: i8_session.ajaxHost + "webajax/setcenter/saveAdmin",
                type: "get",
                dataType: "json",
                data:{jdata:{adminID: uid, type:0,addapps:[],delapps:mgTyparrs}},
                success: function (data) {
                    console.log(data);
                    if(data.Result){
                        i8ui.write("撤销成功！");
                        var pindex = $("#js_page_panl .selected").html() || 1;
                        getAdmin(pindex);
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
})