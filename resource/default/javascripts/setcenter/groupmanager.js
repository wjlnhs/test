/**
 * Created by chenshanlian on 2015/3/20.
 */
define(function(require){
    var i8ui = require('../common/i8ui.js');
    var util = require('../common/util.js');
    var fw_page = require('../common/fw_pagination.js');
    var i8selector = require("../plugins/i8selector/fw_selector.js");
    var pageSize = 10;
    var queryType = 'getCurrentGroups';
    var arrList = null;
    var pid = "";
    var type = 1;
    //按人员搜索
    function searchPersonGroup(pageIndex){
        $.ajax({
            url: i8_session.ajaxHost + "webajax/setcenter/userManageGroups",
            type: "get",
            dataType: "json",
            data: {jdata:{pid:pid, pindex: pageIndex, psize: pageSize,queryType:type}},
            cache: false,
            success: function (data) {
                console.log(data);
                if (data.Result) {
                    var tpl = require('./template/grouplist.tpl');
                    var tmp = template(tpl);
                    template.helper("getManagerNames",function(data){
                        if(data)
                            return data.join("、");
                        else
                            return '';
                    });
                    template.helper('getGroupType',function(data){
                        if(data == 2){
                            return '<i class="pic pic_16"></i>';
                        }else{
                            return '';
                        }
                    });
                    template.helper('getBtnlist',function(data,index){
                        if(data == 0){
                            return '<span index="'+index+'" class="set-manger">指定管理员</span>'+
                                '<span class="cl_bf">|</span>'+
                                '<span index="'+index+'" class="close-group">关闭该群</span>'+
                                '<span class="cl_bf">|</span>'+
                                '<span index="'+index+'" class="disslution-group">解散该群</span>';
                        }else{
                            return '<span index="'+index+'" class="start-group">重启该群</span>'
                        }
                    });
                    $("#js_group_list").html(tmp(data));
                    if(data.Total <= 10){
                        $("#js_page_panl").hide();
                    }else{
                        $("#js_page_panl").show();
                    }
                    arrList = data.List;
                    //控制分页
                    fw_page.pagination({
                        ctr: $("#js_page_panl"),
                        totalPageCount: data.Total,
                        pageSize: pageSize,
                        current: pageIndex,
                        fun: function (new_current_page, containers) {
                            getOpenGroupList(new_current_page);
                        }, jump: {
                            text: '跳转'
                        }
                    });
                } else {
                    i8ui.error(data.Description);
                }
            },
            error: function (e1, e2, e3) {
                i8ui.error("请求出错");
            }
        });
    }
    //获群组列表
    function getOpenGroupList(pageIndex) {
        $("#js_group_list").html('<li><div class="ld-64-gray"></div></li>');
        $.ajax({
            url: i8_session.ajaxHost + "webajax/setcenter/" + queryType,
            type: "get",
            dataType: "json",
            data: {jdata:{ pindex: pageIndex, psize: pageSize,keyword: $("#js_search_txt").val()}},
            cache: false,
            success: function (data) {
                console.log(data);
                if (data.Result) {
                    var tpl = require('./template/grouplist.tpl');
                    var tmp = template(tpl);
                    template.helper("getManagerNames",function(data){
                        if(data)
                            return data.join("、");
                        else
                            return '';
                    });
                    template.helper('getGroupType',function(data){
                        if(data == 2){
                            return '<i class="pic pic_16"></i>';
                        }else{
                            return '';
                        }
                    });
                    template.helper('getBtnlist',function(data,index){
                        if(data == 0){
                            return '<span index="'+index+'" class="set-manger">指定管理员</span>'+
                                    '<span class="cl_bf">|</span>'+
                                    '<span index="'+index+'" class="close-group">关闭该群</span>'+
                                    '<span class="cl_bf">|</span>'+
                                    '<span index="'+index+'" class="disslution-group">解散该群</span>';
                        }else{
                            return '<span index="'+index+'" class="start-group">重启该群</span>'
                        }
                    });
                    $("#js_group_list").html(tmp(data));
                    if(data.Total <= 10){
                        $("#js_page_panl").hide();
                    }else{
                        $("#js_page_panl").show();
                    }
                    arrList = data.List;
                    //控制分页
                    fw_page.pagination({
                        ctr: $("#js_page_panl"),
                        totalPageCount: data.Total,
                        pageSize: pageSize,
                        current: pageIndex,
                        fun: function (new_current_page, containers) {
                            getOpenGroupList(new_current_page);
                        }, jump: {
                            text: '跳转'
                        }
                    });
                } else {
                    i8ui.error(data.Description);
                }
            },
            error: function (e1, e2, e3) {
                i8ui.error("请求出错");
            }
        });
    }
    //指定管理员
    $("#js_group_list").on("click",".set-manger",function(){
        var thisBtn = $(this);
        var item = arrList[thisBtn.attr("index")];
        var tpl = require('./template/setmanager.tpl');
        var tmp = template(tpl);
        var sbox = i8ui.showbox({
            title:"指定管理员",
            cont: tmp(item)
        });
        var ksn_owner = i8selector.KSNSelector({
            model: 2,
            width: 240,
            element: "#js_set_input",
            isAbox: true,
            searchType: { "org": false, "user": true, "grp": false }
        });
        var ids = [];
        for(var i=0; i<item.ManagerIDs.length; i++){
            ids.push({type:"user",id:item.ManagerIDs[i]});
        }
        ksn_owner.setAllselectedData(ids);
        //取消
        $(sbox).on("click",".gray96x32",function(){
            sbox.close();
        });
        //保存
        $(sbox).on("click",".blue96x32",function(){
            var uid = ksn_owner.selectedData();
            if(!uid || uid == ""){
                i8ui.txterror("请输入管理员！",$("#js_set_input"));
                setTimeout(function(){
                    $("#js_lg_tp_div").fadeOut(500);
                },3000);
                return;
            }

            $.ajax({
                url: i8_session.ajaxHost + "webajax/setcenter/setManagers",
                type: "get",
                dataType: "json",
                data:{jdata:{memberIDs: uid.split(';'), groupID:item.ID}},
                success: function (data) {
                    console.log(data);
                    if(data.Result){
                        i8ui.write("保存成功！");
                        getOpenGroupList(1);
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
    //重启该群
    $("#js_group_list").on("click",".start-group",function(){
        var thisBtn = $(this);
        var item = arrList[thisBtn.attr("index")];
        i8ui.confirm({title: '确定要重启该群吗',btnDom: thisBtn},function(){
            $.ajax({
                url: i8_session.ajaxHost + "webajax/setcenter/closeGroupByIDParam",
                type: "get",
                dataType: "json",
                data: {jdata:{ groupID:item.ID , message:'你所在的群组'+ item.Name +',已被设置中心管理员重启！'}},
                cache: false,
                success: function (data) {
                    console.log(data);
                    if (data.Result) {
                        i8ui.write("重启成功！");
                        getOpenGroupList(1);
                    } else {
                        i8ui.error(data.Description);
                    }
                },
                error: function (e1, e2, e3) {
                    i8ui.error("请求出错");
                }
            });
        });
    });
    //关闭该群
    $("#js_group_list").on("click",".close-group",function(){
        var thisBtn = $(this);
        var item = arrList[thisBtn.attr("index")];
        var conthtml = '<div style="padding:20px; line-height: 25px;">'+
                            '<span class="icon lt icon-no-group-close2"></span>'+
                            '<p style="margin-left:55px;">群组关闭后，数据和成员都会保留，管理员可以随时开启。</p>' +
                            '<p style="color:#E56600; margin-left: 55px;">是否确认关闭群组：<b>'+ item.Name +'</b>？<p/>'+
                            '<div class="tright m-t10"><span class="blue94x32 m-r10">确定</span><span class="gray94x32">取消</span></div>'
                        '</div>';
        var closeBox = i8ui.showbox({
            title:"关闭群组",
            cont: conthtml
        });
        $(closeBox).on("click",".blue94x32",function(){
            $.ajax({
                url: i8_session.ajaxHost + "webajax/setcenter/closeGroupByIDParam",
                type: "get",
                dataType: "json",
                data: {jdata:{ groupID:item.ID , message:'你所在的群组'+ item.Name +',已被设置中心管理员关闭！'}},
                cache: false,
                success: function (data) {
                    console.log(data);
                    if (data.Result) {
                        i8ui.write("关闭成功！");
                        closeBox.close();
                        getOpenGroupList(1);
                    } else {
                        i8ui.error(data.Description);
                    }
                },
                error: function (e1, e2, e3) {
                    i8ui.error("请求出错");
                }
            });
        });
    });
    //解散该群
    $("#js_group_list").on("click",".disslution-group",function(){
        var thisBtn = $(this);
        var item = arrList[thisBtn.attr("index")];
        var conthtml = '<div style="padding:20px; line-height: 25px;">'+
            '<span class="icon lt icon-no-group-close2"></span>'+
            '<p style="margin-left:55px;">群组解散后，数据将全部清除，管理员不能再激活！</p>' +
            '<p style="color:#E56600; margin-left: 55px;">是否确认解散群组：<b>'+ item.Name +'</b>？<p/>'+
            '<div class="tright m-t10"><span class="blue94x32 m-r10">确定</span><span class="gray94x32">取消</span></div>'
        '</div>';
        var closeBox = i8ui.showbox({
            title:"解散群组",
            cont: conthtml
        });
        $(closeBox).on("click",".blue94x32",function(){
            $.ajax({
                url: i8_session.ajaxHost + "webajax/setcenter/dismissGroup",
                type: "get",
                dataType: "json",
                data: {jdata:{ groupID:item.ID , message:'你所在的群组'+ item.Name +',已被设置中心管理员解散！'}},
                cache: false,
                success: function (data) {
                    console.log(data);
                    if (data.Result) {
                        i8ui.write("解散成功！");
                        closeBox.close();
                        getOpenGroupList(1);
                    } else {
                        i8ui.error(data.Description);
                    }
                },
                error: function (e1, e2, e3) {
                    i8ui.error("请求出错");
                }
            });
        });
    });
    //群组切换
    $("#js_top_menu").on("click","a",function(){
        var thisDom = $(this);
        $("#js_top_menu a").removeClass("current");
        queryType = thisDom.attr("type");
        type = (queryType == "getCurrentGroups" ? 1 : 2);
        thisDom.addClass("current");
        personCon.clearData();
        getOpenGroupList(1);
    });
    //搜索事件
    $("#js_search_txt").keyup(function(e){
        var e = e || window.event;
        if(e && e.keyCode == 13){
            getOpenGroupList(1);
        }
    })
    //搜索按钮
    $("#js_search_txt_btn").click(function(){
        getOpenGroupList(1);
    });
    //初始化下拉控件
    $("#js_select").setSelect({style:"width: 200px; height: 32px; line-height: 32px;",cbk:function(){
        if($("#js_select").getValue() == "1"){
            $("#js_sh_dd1").show();
            $("#js_sh_dd2").hide();
        }else{
            $("#js_sh_dd2").show();
            $("#js_sh_dd1").hide();
        }
    }});
    var personCon = i8selector.KSNSelector({
        model: 1,
        width: 174,
        element: "#mg-search-person",
        isAbox: true,
        searchType: { "org": false, "user": true, "grp": false },
        selectCallback: function(uid){
            pid = uid;
            searchPersonGroup(1);
        }
    });
    getOpenGroupList(1);
});
