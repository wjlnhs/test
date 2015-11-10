define(function(require){
    var i8ui = require('../common/i8ui');
    var fw_page = require('../common/fw_pagination.js');
    var fw = require('../group/public.js');
    var util = require('../common/util.js');
    var pageSize = 10;
    var pageDom =$("#js_group_listpage");
    var funJSON = {"myGroupAndPublicParam": "", "myJoinGroupsParam":4, "myManageGroupsParam":5,"myRequestedGroupsParam":2}

    //获取群组列表
    function getGroupList(pageIndex,funName){
        funName = funName || window.location.href.split("#")[1] || 'myGroupAndPublicParam';
        var queryType = $("#js_group_status").getValue();
        if(funName == ""){
            i8ui.error("菜单方法调用失败！");
            return;
        }
        var checkAlink = $("#js_group_type_menu").find("a");
        checkAlink.removeClass("current");
        switch(funName){
            case "myGroupAndPublicParam":
                $(checkAlink[0]).addClass("current");
                break;
            case "myJoinGroupsParam":
                $(checkAlink[1]).addClass("current");
                break;
            case "myManageGroupsParam":
                $(checkAlink[2]).addClass("current");
                break;
            case "myRequestedGroupsParam":
                $(checkAlink[3]).addClass("current");
                break;
        }
        var typenum = funJSON[funName];
        $("#js_group_mg_list_ul").html('<li><div class="ld-64-gray"></div></li>');
        $("#js_group_no_data").hide();
        $.ajax({
            url: i8_session.ajaxHost+'webajax/group/'+funName,
            type: 'get',
            dataType: 'json',
            data: {pageIndex: pageIndex, pageSize: pageSize,queryType: queryType},
            cache: false,
            success: function(result){
                if(result.Result){
                    var listHtml = '';
                    var arrs = result.List || [];
                    var newsArrs = [];
                    for(var i = 0; i < arrs.length; i++){
                        if(!arrs[i].Item1){
                            newsArrs.push({Item1: arrs[i],Item2: typenum});
                        }
                    }
                    if(newsArrs.length > 0){
                        result.List = newsArrs
                    }
                    var tpl = require('./template/grouplist.tpl');
                    var tmp = template(tpl);
                    var listHtml = tmp(result);
                    if(listHtml == ""){
                        listHtml = "";
                        var tps = '<p class="fz14-weight m-b15 m-t15 cl000">您的社区还没有群组，快去创建一个群组吧！</p><span class="blue-button create-group-btn">创建群组</span>';
                        if(funName == "myJoinGroupsParam"){
                            var txt = '您还没有加入活跃的群组，快去看看有没有感兴趣的！<p><a href="group/list" class="blue-button">马上加入</a></p>';
                            if(queryType == 2){
                                txt = '暂无关闭群组！';
                            }
                            tps = '<div class="fz14-weight m-b15 m-t5 cl000">'+ txt +'</div>';
                        }else if(funName == "myManageGroupsParam"){
                            tps = '<p class="fz14-weight m-b15 m-t30 cl000">您目前没有需要管理的群组！</p>';
                        }else if(funName == "myRequestedGroupsParam"){
                            tps = '<p class="fz14-weight m-b15 m-t30 cl000">您目前没有正在申请的群组！</p>';
                        }
                        $("#js_group_no_data").show().find("div").html(tps);
                    }
                    if(result.Total <= 0){
                        $("#js_group_page_panl").hide();
                    }else{
                        $("#js_group_page_panl").show();
                    }
                    //控制分页
                    fw_page.pagination({
                        ctr: $("#js_group_page_panl"),
                        totalPageCount: result.Total,
                        pageSize: pageSize,
                        current: pageIndex,
                        fun: function (new_current_page, containers) {
                            getGroupList(new_current_page);
                        }, jump: {
                            text: '跳转'
                        }
                    });
                    $("#js_group_mg_list_ul").html(listHtml);
                }else{
                    i8ui.error(result.Description);
                }
            },
            error: function(e1,e2,e3){
            }
        });
    }
    //获取群组类型
    template.helper('getGroupType',function(num){
        if(num == 2 || num == 1){
            return '<i class="spbg1 sprite-109"></i>';
        }else{
            return "";
        }
    });
    template.helper('$getTypeBtn',function(item){
        var data = item.Item1;
        if(data.Status == 1) {
            if(item.Item2 == 5) {
                return '<span class="ta-group-btn start-group bgf2" gid="'+ data.ID +'" name="'+ data.Name +'"><i class="spbg1 sprite-26" style="vertical-align:-2px;"></i>重新激活</span>';
            }else {
                return '<span class="ta-group-btn tcenter disabled">该群组已关闭</span>';
            }
        }
        switch(item.Item2){
            case 1:
                return '<span class="ta-group-btn add-group" gid="'+ data.ID +'" name="'+ data.Name +'" gtype="'+ data.Type +'" ><i class="spbg1 sprite-30"></i>加入该群</span>';
                break;
            case 2:
                return '<span class="ta-group-btn tcenter disabled">申请中</span>';
                break;
            case 3:
                //return '<span class="ta-group-btn add-group" gid="'+ data.ID +'"><i class="spbg1 sprite-30"></i>再次申请</span>';
                return '<span class="ta-group-btn add-group2" gid="'+ data.ID +'" name="'+ data.Name +'" gtype="'+ data.Type +'" >' +
                            '<i class="spbg1 sprite-30"></i>再次申请' +
                        '</span>' +
                        '<span class="group-jujue-becource">拒绝原因：'+ item.Item1.RefuseReason+'</span>';
                break;
            case 4:
                return '<span class="ta-group-btn out-group" mid="'+ i8_session.uid +'" gid="'+ data.ID +'" name="'+ data.Name +'" gtype="'+ data.Type +'"><i class="spbg1 sprite-33"></i>退出该群</span>';
                break;
            case 5:
                return '<span class="ta-group-btn close-group" gid="'+ data.ID +'" name="'+ data.Name +'"><i class="spbg1 sprite-70" style="vertical-align:-2px;"></i>关闭该群</span>';
                break;
            default:
                return '';
                break;

        }
    });
    template.helper('getUrlLink',function(item){
        if(item.Status == 0){

        }else{
            return 'style="cursor: default; color: #999;"';
        }

    });
    template.helper('$getLastTimestr',function(times){
        if(times){
            var reg = new RegExp("[0-9]{4}-[0-9]{1,2}-[0-9]{1,2}");
            return times.match(/[0-9]{4}-[0-9]{1,2}-[0-9]{1,2}/);
        }
    });
    //获取系统消息
    function getgroupMessage(){
        $.ajax({
            url: i8_session.ajaxHost+'webajax/group/getMyGroupNotices',
            type: 'get',
            dataType: 'json',
            cache: false,
            success: function(result){
                if(result.Result){
                    var listHtml = '';
                    var arrs = result.ReturnObject;
                    for(var i = 0; i < arrs.length; i++){
                        var closeBtn = '';
                        var groupReg = /\$\%\$.*\$\%\$/g;
                        var requestReg = /\$\#\$.*\$\#\$/g;
                        var inviteReg = /\$\@\$.*\$\@\$/g
                        var requestID = arrs[i].Content.match(requestReg);
                        var inviteID = arrs[i].Content.match(inviteReg);
                        var groupInfo = arrs[i].Content.match(groupReg);
                        var groupName = "";

                        if(groupInfo){
                            groupInfo = groupInfo.toString()
                            groupName = groupInfo.split(",")[0].replace("$%$","");
                        }
                        if(requestID){
                            requestID = requestID.toString().replace(/\$\#\$/g,"");
                        }
                        if(inviteID){
                            inviteID = inviteID.toString().replace(/\$\@\$/g,"");
                        }
                        var msgLinkUrl = '<a href="">'+groupName+'</a>';
                        var newMsgCont = arrs[i].Content.replace(groupReg,msgLinkUrl).replace(inviteReg,"").replace(requestReg,"");
                        if(arrs[i].Content == '该消息已被其他管理员处理'){
                            closeBtn = '<span class="group-message-close"></span>';
                        }
                        listHtml += '<p requestid="'+requestID+'" inviteid="'+inviteID+'" messageid="'+ arrs[i].ID +'" source="'+ arrs[i].Source +'" class="igroup-message-ops">' +
                                        '<i class="spbg1 sprite-19"></i>'+newMsgCont +
                                        '<span class="group-yes-btn spbg1 sprite-100">同意</span>' +
                                        '<span class="group-no-btn spbg1 sprite-101">拒绝</span>';
                                        closeBtn +
                                    '</p>';
                    }
                    $("#js_group_message_div").html(listHtml);
                }else{
                    i8ui.error(result.Description);
                }
            },
            error: function(e1,e2,e3){
            }
        });
    }
    //关闭系统消息
    function closeMessage($p,ids){
        $.ajax({
            url: i8_session.ajaxHost+'webajax/group/deleteSysNotice',
            type: 'get',
            dataType: 'json',
            data: {ids: ids},
            success: function(result){
                if(result.Result){
                    $p.fadeOut(500,function(){
                        $p.remove();
                    });
                }else{
                    i8ui.error(result.Description);
                }
            },
            error: function(e1,e2,e3){
            }
        });
    }
    //处理申请消息
    function chuliShenQing(pdata,callback,error){
        $.ajax({
            url: i8_session.ajaxHost+'webajax/group/approveJoinParam',
            type: 'get',
            dataType: 'json',
            data: pdata,
            success: function(result){
                if(result.Result){
                    callback();
                }else{
                    if(error){
                        error(result);
                        return;
                    }
                    i8ui.error(result.Description);
                }
            },
            error: function(e1,e2,e3){
            }
        });
    }
    //处理邀请消息
    function chuliYaoqing(pdata,callback,error){
        $.ajax({
            url: i8_session.ajaxHost+'webajax/group/activeInviteParam',
            type: 'get',
            dataType: 'json',
            data: {grpInviteID: pdata.grpInviteID, sysNoticeID: pdata.sysNoticeID,flagType: pdata.flagType},
            success: function(result){
                if(result.Result){
                    callback();
                }else{
                    if(error){
                        error(result);
                        return;
                    }
                    i8ui.error(result.Description);
                }
            },
            error: function(e1,e2,e3){
            }
        });
    }
    $(function(){
        //分类初始化
        $("#js_group_status").setSelect({
            style:"line-height: 26px; background: #fff;",
            cbk: function() {
                getGroupList(1);
            }
        });
        $("#js_group_status").setValue(1);
        getGroupList(1);
        getgroupMessage();
        //菜单筛选事件
        $("#js_group_type_menu").on("click","a",function(){
            var $this = $(this);
            $("#js_group_type_menu a").removeClass("current");
            $this.addClass("current");
            getGroupList(1,$(this).attr("funname"));
        });
        //加入群组
        $("#js_group_mg_list_ul").on("click","span.add-group",function(){
            var $this = $(this);
            var gtype = $(this).attr("gtype");
            var gid = $this.attr("gid");
            var datas = {
                groupID: gid
            }
            if(gid != ""){
                $.ajax({
                    url: i8_session.ajaxHost+'webajax/group/joinParam',
                    type: 'get',
                    dataType: 'json',
                    data: datas,
                    cache: false,
                    success: function(result){
                        if(result.Result){
                            i8ui.alert({title:"操作成功!",btnDom:$this,type:2});
                            if(result.ReturnObject.Type == 0){
                                $this.html('<i class="spbg1 sprite-33"></i>退出该群')
                                    .attr('mid',i8_session.uid)
                                    .attr('gid',result.ReturnObject.ID)
                                    .attr("class","ta-group-btn out-group");
                            }else{
                                $this.replaceWith('<span class="ta-group-btn tcenter disabled">申请中</span>');
                            }
                        }else{
                            i8ui.alert({title:result.Description,btnDom:$this});
                        }
                    },
                    error: function(e1,e2,e3){
                        i8ui.error("服务器异常！请稍后再试");
                    }
                });
            }
        });
        //再次申请
        $("#js_group_mg_list_ul").on("click","span.add-group2",function(){
            var $this = $(this);
            var gtype = $(this).attr("gtype");
            var gid = $this.attr("gid");
            var datas = {
                groupID: gid
            }
            if(gid != ""){
                $.ajax({
                    url: i8_session.ajaxHost+'webajax/group/updateJoinRequest',
                    type: 'get',
                    dataType: 'json',
                    data: datas,
                    cache: false,
                    success: function(result){
                        if(result.Result){
                            i8ui.alert({title:"申请成功!",btnDom:$this,type:2});
                            $this.replaceWith('<span class="ta-group-btn tcenter disabled">已申请加入</span>');
                        }else{
                            i8ui.error(result.Description);
                        }
                    },
                    error: function(e1,e2,e3){
                        i8ui.error("服务器异常！请稍后再试");
                    }
                });
            }
        });
        //退出群组
        $("#js_group_mg_list_ul").on("click","span.out-group",function(){
            var $this = $(this);
            var jsons = {
                groupID : $this.attr("gid"),
                memberID : $this.attr("mid"),
                mystate : 0
            }
            fw.outGroupID(jsons,function(result){
                i8ui.alert({title:"退出成功!",btnDom:$this,type:2});
                $this.html('<i class="spbg1 sprite-30"></i>加入该群')
                    .attr("class","ta-group-btn add-group");
            });
        });
        //关闭群组
        $("#js_group_mg_list_ul").on("click","span.close-group",function(){
            var $this = $(this);
            var jsons = {
                groupID : $this.attr("gid")
            }
            i8ui.confirm({title: "确定要关闭该群吗？"},function(){
                fw.closeGroup(jsons,function(){
                    i8ui.alert({title:"关闭成功!",btnDom:$this,type:2});
                    $this.html('<i class="spbg1 sprite-26"></i>重新激活')
                        .removeClass("close-group")
                        .addClass("start-group");
                });
            });

        });
        //激活群组
        $("#js_group_mg_list_ul").on("click","span.start-group",function(){
            var $this = $(this);
            var jsons = {
                groupID : $this.attr("gid")
            }
            fw.closeGroup(jsons,function(){
                i8ui.alert({title:"激活成功!",btnDom:$this,type:2});
                $this.html('<i class="spbg1 sprite-33"></i>关闭该群')
                    .addClass("close-group")
                    .removeClass("start-group");
            });
        });
        //关闭消息
        $("#js_group_message_div").on("click",".group-message-close",function(){
            var $p = $(this).parents("p.igroup-message-ops");
            var messageid = $p.attr("messageid");
            closeMessage($p,[messageid]);
        });
        //激活邀请
        $("#js_group_message_div").on("click",".group-agree-invite",function(){
            var $this = $(this);
            var $p = $this.parents("p.igroup-message-ops");
            var gid = $p.attr("source");
            var inviteid = $this.attr("inviteid");
            var messageid = $p.attr("messageid");
            var flagType = $this.attr("type");
            $.ajax({
                url: i8_session.ajaxHost+'webajax/group/activeInviteParam',
                type: 'get',
                dataType: 'json',
                data: {grpInviteID: inviteid, sysNoticeID: messageid,flagType: flagType},
                success: function(result){
                    if(result.Result){
                        if(flagType == "1"){
                            i8ui.alert({title:"已加入该群！",type:2, btnDom: $this, cbk: function(){
                                window.location.href = '/group/home?id='+gid;
                            }});
                        }else{
                            i8ui.alert({title:"您已拒绝！",type:2, btnDom: $this});
                            $p.fadeOut(500,function(){
                                $p.remove();
                            });
                        }

                    }else{
                        i8ui.alert({
                            title: fw.showError(result.Code),
                            btnDom: $this
                        });
                        $p.fadeOut(500,function(){
                            $p.remove();
                        });
                    }
                },
                error: function(e1,e2,e3){
                }
            });
        });
        //消息操作同意
        $("#js_group_message_div").on("click","span.group-yes-btn",function(){
            var $this = $(this);
            var $p = $this.parents("p.igroup-message-ops");
            var requestid = $p.attr("requestid");
            var inviteid = $p.attr("inviteid")
            var messageid = $p.attr("messageid");
            var gid = $p.attr("source");
            //如果是申请消息
            if(requestid != "null"){
                var state = 1;
                var pData = {
                    groupID: gid,
                    grpRequestID: requestid,
                    state: state,
                    reason: "",
                    sysNoticeID:messageid
                };
                chuliShenQing(pData,function(){
                    i8ui.alert({title:"同意成功！",type:2, btnDom:$this});
                    $p.fadeOut(500,function(){
                        $p.remove();
                    });
                },function(result){
                    i8ui.alert({
                        title: fw.showError(result.Code),
                        btnDom: $this
                    });
                    $p.fadeOut(500,function(){
                        $p.remove();
                    });
                });
            }
            if(inviteid != "null"){
                var pData = {
                    grpInviteID: inviteid,
                    flagType: 1,
                    sysNoticeID: messageid
                };
                chuliYaoqing(pData,function(){
                    i8ui.alert({title:"已加入该群！",type:2, btnDom: $this, cbk: function(){
                        window.location.href = '/group/home?id='+gid;
                    }});
                },function(result){
                    i8ui.alert({
                        title: fw.showError(result.Code),
                        btnDom: $this
                    });
                    $p.fadeOut(500,function(){
                        $p.remove();
                    });
                });
            }
        });
        //拒绝申请
        $("#js_group_message_div").on("click","span.group-no-btn",function(){
            var $this = $(this);
            var $p = $this.parents("p.igroup-message-ops");
            var requestid = $p.attr("requestid");
            var inviteid = $p.attr("inviteid")
            var messageid = $p.attr("messageid");
            var gid = $p.attr("source");
            //拒绝申请消息
            if(requestid != "null"){
                var state = 2;
                var pData = {
                    groupID: gid,
                    grpRequestID: requestid,
                    state: state,
                    reason: "",
                    sysNoticeID:messageid
                };
                var sbox = i8ui.showbox({
                    title:"拒绝原因",
                    cont:'<div class="p10"><textarea class="group-refuse-txt">你不符合本群的要求！</textarea><div class="tcenter"><span class="btn-gray96x32 m-r10">取消</span><span class="btn-blue96x32">确定</span></div></div>'
                });
                //取消
                $(sbox).on("click",".btn-gray96x32", function(){
                    sbox.close();
                });
                //确定
                $(sbox).on("click",".btn-blue96x32", function(){
                    pData.reason = $(sbox).find("textarea").val();
                    chuliShenQing(pData,function(){
                        sbox.close();
                        i8ui.alert({title:"您已拒绝！",type:2, btnDom:$this});
                        $p.fadeOut(500,function(){
                            $p.remove();
                        });
                    },function(result){
                        sbox.close();
                        i8ui.alert({
                            title: fw.showError(result.Code),
                            btnDom: $this
                        });
                        $p.fadeOut(500,function(){
                            $p.remove();
                        });
                    });
                });
            }
            //拒绝邀请消息
            if(inviteid != "null"){
                var pData = {
                    grpInviteID: inviteid,
                    flagType: 2,
                    sysNoticeID: messageid
                };
                chuliYaoqing(pData,function(){
                    i8ui.alert({title:"您已拒绝！",type:2, btnDom: $this});
                    $p.fadeOut(500,function(){
                        $p.remove();
                    });
                },function(result){
                    i8ui.alert({
                        title: fw.showError(result.Code),
                        btnDom: $this
                    });
                    $p.fadeOut(500,function(){
                        $p.remove();
                    });
                });
            }
        });
        //新增群组事件
        pageDom.on("click",".create-group-btn",function(){
            var addgroup = require('../group/addgroup.js');
            addgroup.groupBox();
        });
        //新增群组事件
        pageDom.on("click",".yellow160x40",function(){
            var addgroup = require('../group/addgroup.js');
            addgroup.groupBox();
        });
    });
    //清空tips消息
    updatetips('ea3c6304-09cc-4583-b0a9-27eae33a68ef');
});