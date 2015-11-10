define(function(require){
    var util = require('../common/util.js');
    var fw = require('../group/public.js');
    var i8ui = require('../common/i8ui.js');
    var fw_page = require('../common/fw_pagination.js');
    var seefile = require('../common/seefile.js');
    var blogPoster=require('../plugins/i8poster/js/i8poster');
    var kankanlist=require('../plugins/i8bloglist/i8blogs');
    var pageSize = 10;
    var groupMemberList = [];
    var groupDocList = [];
    var isManager = false;

    //展开收起群组公告文字
    var expendNotice=function($id){
        if($id.height()>125){
            $id.css('max-height','120px');
            $id.append($('<span class="expend-content-line" style="display:block;bottom: 5px;right: 5px"><a class="expend-switch es-close" style="display: inline;"><span>展开</span><i></i></a></span>'))
                .on('click','.expend-switch',function(){
                    var _this=$(this);
                    _this.toggle(function(){
                        $id.css('max-height','none');
                        _this.removeClass('es-close').html('<span>收起</span><i></i>');
                    },function(){
                        $id.css('max-height','120px');
                        _this.addClass('es-close').html('<span>展开</span><i></i>');
                    });
                }).find('.expend-switch').trigger('click');
        }
    }
    var focusGroup=function(obj){
        var _obj=obj.parents('.rel').next('.rel').find('input');
        if(!_obj.prev('.fw_ksninput_slted').attr('data-uid')){
            _obj.trigger('focus');
        }else{
            focusGroup(_obj);
        }
    }
    //验证当前登录人是否包含于该群组
    var isInGroup = function(){
        for(var i=0; i<groupDT.Members.length; i++){
            var item = groupDT.Members[i];
            if(item.UserID == i8_session.uid){
                return true;
            }
        }
    }
    //邀请成员
    function inviteMember(callback){
        var tpl = require('./template/addmembers.tpl');
        var tmp = template(tpl);
        var yaoqingBox = i8ui.showbox({
            title: '邀请成员',
            cont: tmp({})
        });
        var outputGroupMemberList={};//弹出层选择人列表
        var selector = require('../plugins/i8selector/fw_selector');
        var inviteSel = selector.KSNSelector({
            model:1,
            width: 400,
            element: '.add-members-input',
            searchType: { "org": false, "user": true, "grp": false },
            selectCallback: function (uid, uname, uemail,utype,obj) {
                if(uid){
                    if(outputGroupMemberList[uid]){
                        i8ui.alert({title:"该成员已选择",btnDom: $(obj).parent()});
                        var txtDom = inviteSel.getMultiKsnObjById(obj.id);
                        txtDom.clearData();
                        return;
                    }
                    outputGroupMemberList[uid]=1;
                    focusGroup($('#'+obj.id));
                }

                $.ajax({
                    url: i8_session.ajaxHost+'webajax/group/checkInviteState',
                    type: 'get',
                    dataType: 'json',
                    data: {groupID: groupDT.ID, userID: uid},
                    cache: false,
                    success: function(result){
                        if(!result.Result){
                            i8ui.alert({title:fw.showError(result.Code),btnDom: $(obj).parent()});
                            txtDom.clearData();
                            return;
                        }
                    },
                    error: function(e1,e2,e3){
                        i8ui.error("服务器异常！请稍后再试");
                    }
                });
            },
            deleteCallback:function(obj,elem){
                delete  outputGroupMemberList[$(obj).attr('data-uid')];
            }
        });
        //取消
        $(yaoqingBox).on('click','.btn-gray96x32',function(){
            yaoqingBox.close();
        });
        //确定
        $(yaoqingBox).on('click','.btn-blue96x32',function(){
            var inviteArrs = [];
            $(yaoqingBox).find("span.fw_ksninput_slted").each(function(){
                var mid = $(this).attr("data-uid");
                if(mid != ""){
                    inviteArrs.push(mid);
                }
            });
            if(inviteArrs.length > 0){
                var datas = {
                    groupID: groupDT.ID,
                    userIDs: inviteArrs
                }
                $.ajax({
                    url: i8_session.ajaxHost+'webajax/group/inviteMember',
                    type: 'get',
                    dataType: 'json',
                    data: datas,
                    cache: false,
                    success: function(result){
                        if(result.Result){
                            i8ui.write("邀请成功");
                            yaoqingBox.close();
                        }else{
                            i8ui.error(result.Description);
                        }
                    },
                    error: function(e1,e2,e3){
                    }
                });
            }else{
                i8ui.error("最少要邀请一个人！");
                return;
            }
        });
    }
    //获取管理员姓名ID对象
    function getManagerObj(){
        if(groupDT){
            var arrs = groupDT.Members;
            var managerNames = [];
            var managerIDs = [];
            var createrName = '';
            for(var i = 0; i<arrs.length; i++){
                var _item = arrs[i];
                if(_item.Type == 2 || _item.Type == 0){
                    managerNames.push(_item.UserName);
                    managerIDs.push(_item.UserID);
                    if(_item.UserID == i8_session.uid){
                        isManager = true;
                    }
                }
            }
            return {
                    managerNames: managerNames.join(',') == "" ? "暂无" : managerNames.join(','),
                    managerIDs: managerIDs.join(','),
                    createrName: createrName
            };
        }else{
            return null;
        }
    }
    //修改群组公告
    function updateNotice(callback){
        var editDom = $("#js_save_set_img");
        var newNotice = $.trim($("#js_group_notice_edit").find("textarea").val());
        if(newNotice == ""){
            i8ui.alert({title:"请输入公告内容！", btnDom: editDom});
            return;
        }
        if(groupDT.Notice == newNotice){
            callback();
            return;
        }
        groupDT.Notice = newNotice;
        updateGroup(groupDT,callback);
    }
    //群组成员组件列表
    function blockMembers(){
        var listHtml = '';
        if(groupMemberList && groupMemberList.List){
            for(var i = 0; i < groupMemberList.List.length; i++){
                var _item = groupMemberList.List[i].Member;
                listHtml += '<a class="rt-team-ops lt"><img class="my-headimg" src="'+ _item.HeadImage +'"/>'+ _item.Name +'</a>';
            }
        }
        if(listHtml == ''){
            listHtml = '<div class="bd-dashed tcenter m-r10 m-l10">暂无成员</div>';
        }
        $("#js_block_members").html(listHtml);
    }
    //群组文档组件列表
    function blockDocs(){
        var tpl = require('./template/blockdoclist.tpl');
        var newItems = {Items:[]};
        for(var i=0; i<groupDocList.List.length; i++){
            if(i<2){
                newItems.Items.push(groupDocList.List[i]);
            }else{
                break;
            }
        }
        var tmp = template(tpl);
        var html=tmp(newItems);
        if(html == ""){
            html = '<div class="fz14-weight tcenter p10 cl999"><span class="icon icon-group-no-doc"></span>一篇文档都没有哦</div>'
        }
        $("#js_group_block_lists").html(html).attr("data-arrs",util.toJsonString(groupDocList.List));
    }
    //群组成员分页列表
    function membersList(pageIndex){
        fw.getMembers(pageIndex,function(data){
            groupMemberList = data;
            if(pageIndex == 1){
                blockMembers();
            }
            var tpl = require('./template/memberlist.tpl');
            var managerObj = getManagerObj();
            template.helper("$getStatusBtn",function(item){
                if(isManager && groupDT.Status == 0){
                    if(item.MemberType == 0){
                        return "<td>1111111111</td>";
                    }else if(item.MemberType == 1){
                        return '<td><span class="dcolor cur set-manager" pid="'+ item.Member.PassportID +'"><i class="spbg1 sprite-35"></i>设为管理员</span><span class="clortt cur mg10 del-member" pid="'+ item.Member.PassportID +'"><i class="spbg1 sprite-36"></i>踢出</span></td>';
                    }else if(item.MemberType == 2){
                        console.log(item);
                        return '<td><span class="dcolor cur del-manager" pid="'+ item.Member.PassportID +'"><i class="spbg1 sprite-70"></i>撤销管理员</span><span class="clortt mg10"></td>';
                    }
                }else{
                    return "";
                }
            });
            if(!isManager){
                $("#js_group_manger").remove();
            }
            var tmp = template(tpl);
            $("#js_group_members_tbody").html(tmp(data));
            //控制分页
            fw_page.pagination({
                ctr: $("#js_group_member_page"),
                totalPageCount: groupMemberList.Total,
                pageSize: pageSize,
                current: pageIndex,
                fun: function (new_current_page, containers) {
                    membersList(new_current_page);
                }, jump: {
                    text: '跳转'
                }
            });
        });
    }
    template.helper("getDocSize",function(dsize){
        return dsize;
    });
    //文档分页列表
    function docList(pageIndex){
        fw.getDocList(pageIndex, function(data){
            var tpl = require('./template/doclist.tpl');
            groupDocList = data;
            if(pageIndex == 1){
                blockDocs();
            }
            var tmp = template(tpl);
            var html=tmp(groupDocList);
            if(html == ""){
                html = '<div class="fz14-weight tcenter p10 cl999"><span class="icon icon-group-no-doc"></span>一篇文档都没有哦</div>'
            }

            $("#js_group_doc_arrs").html(html).attr("data-arrs",util.toJsonString(data.List));
            if(!isInGrounp()){
                $("#js_group_doc_arrs").append('<div class="quick_post_mask"></div><div class="quick_post_mask_cont"><i class="icon icon-no-in-grounp"></i>只有成员才能查看群组文档，<a class="add-group cur">赶快加入</a>吧！</div>')
            }
            //控制分页
            fw_page.pagination({
                ctr: $("#js_group_doc_page"),
                totalPageCount: groupDocList.Total,
                pageSize: pageSize,
                current: pageIndex,
                fun: function (new_current_page, containers) {
                    docList(new_current_page);
                }, jump: {
                    text: '跳转'
                }
            });
        });
    }
    //更新群组信息
    function updateGroup(json,callback){
        var dtgrop = json;
        dtgrop.Members = undefined;
        $.ajax({
            url: i8_session.ajaxHost+'webajax/group/updateGroupParam',
            type: 'post',
            dataType: 'json',
            data: {group: dtgrop},
            cache: false,
            success: function(result){
                if(result.Result){
                    groupDT = json;
                    callback();
                }else{
                    i8ui.error(result.Description);
                }
            },
            error: function(e1,e2,e3){
            }
        });
    }
    $(document).on('click','.iscover',function(){
        $(this).toggleClass('checked')
        var _oldwidth=$('#js_img_yulan').width() >800 ? 800 : $('#js_img_yulan').width();
        if($('.iscover').hasClass('checked')){
            $('#js_img_yulan').attr('m_oldwidth',_oldwidth).width('100%')
        }else{
            var _oldwidth=$('#js_img_yulan').attr('m_oldwidth') >800 ? 800 : $('#js_img_yulan').attr('m_oldwidth');
            $('#js_img_yulan').width(_oldwidth);
        }
        $('#js_img_yulan').css('top','0px');
    })
    //修改背景图
    function updateCoverImg(){
        var setImg = require('../group/setimg.js');
        setImg.showBox({oldImg: groupDT.CoverImg},function(data){
            var newGroup = groupDT;
            if(document.getElementById("js_set_img_type1").style.display == "none"){
                var m_top=parseInt($('#js_img_yulan').css('top'));
                if(m_top>0){
                    m_top=0;
                }
                var _top=parseInt(Math.abs(m_top/0.666666))
                var parm={
                    'thumbnail':'1200x',
                    'crop':'!1200xa0a'+_top,
                    'top':_top,
                    'm_top':m_top,
                    'm_width':parseInt($('#js_img_yulan').width()),
                    'm_oldwidth':$('#js_img_yulan').attr('m_oldwidth'),
                    'iscover':$('.iscover').hasClass('checked') ? true : false
                }
                if(!$('.iscover').hasClass('checked')){
                    parm.thumbnail='1200x>';
                }
                data.setImgUrl=data.setImgUrl.split('?')[0]+"?"+setImg.joinQiNiuParm(parm,'imageMogr2');
            }
            newGroup.CoverImg=data.setImgUrl;

            updateGroup(newGroup,function(){
                //$("#js_group_coverImg").attr("src",groupDT.CoverImg);
                $('.ta-home-bg').css('background-image','url('+data.setImgUrl+')')
                data.box.close();
            });
        });
    }
    //页面默认加载
    function isInGrounp(uid,Members){
        var uid=i8_session.uid;
        var Members=groupDT.Members;
        var isInGrounp=false;
        for(var i=0;i<Members.length;i++){
            if(Members[i].UserID==uid){
                isInGrounp=true;
            }
        }
        return isInGrounp;
    }
    //初始化群组信息
    $(function(){

        var urltype = window.location.hash;
        //锚点定位显示的内容
        if(urltype.indexOf('members') >= 0){
            $("#js_group_members").show();
            $("#grp-tab-content,#js_group_doc_list").hide();
            $("#js_group_menu").find("span").removeClass("current");
            $("#member-group").addClass("current")
        }
        var managerObj = getManagerObj();
        $("#js_group_manager_name").html(managerObj.managerNames);
        var cementHtml = groupDT.Notice? groupDT.Notice : '<div class="fz14-weight tcenter cl999" style="text-indent:0px;"><span class="icon icon-group-no-cement"></span>暂无公告内容</div>';
        expendNotice($("#js_group_notice").html(cementHtml));
        //标签页切换
        $("#js_group_menu").on("click","span",function(){
            $("#js_group_menu").find("span").removeClass("current");
            $(this).addClass("current");
            var thisText = $(this).html();
            if(thisText == "群组成员"){
                $("#grp-tab-content,#js_group_doc_list").hide();
                $("#js_group_members").show();
            }else if(thisText == "群组动态"){
                $("#js_group_members,#js_group_doc_list").hide();
                $("#grp-tab-content").show();
            }else if(thisText == "群组文档"){
                $("#grp-tab-content,#js_group_members").hide();
                $("#js_group_doc_list").show();
                docList(1);
            }
        });
        if(isManager && groupDT.Status == 0){
            $("#js_group_notice_edit").find("textarea").val(groupDT.Notice);
            $("#js_edit_group_cement, #js_group_manager").show();
            //管理员操作
            $("#js_group_manager").on("click","div.ta-pf-btn",function(){
                var vhtml = $.trim($(this).text());
                if(vhtml == "上传封面图"){
                    updateCoverImg();
                }else if(vhtml == "关闭该群"){
                    var conthtml = '<div style="padding:20px; line-height: 25px;">'+
                                        '<span class="icon lt icon-no-group-close2"></span>'+
                                        '<p style="margin-left:55px;">群组关闭后，数据和成员都会保留，管理员可以随时开启。</p>' +
                                        '<p style="color:#E56600; margin-left: 55px;">是否确认关闭？<p/>'+
                                        '<div class="tright m-t10"><span class="btn-gray96x32 m-r10">取消</span><span class="btn-blue96x32">确定</span></div>'
                                    '</div>';
                    var closeBox = i8ui.showbox({
                        title:"关闭群组",
                        cont: conthtml
                    });
                    //取消
                    $(closeBox).on("click",".btn-gray96x32",function(){
                        closeBox.close();
                    });
                    //确定
                    $(closeBox).on("click",".btn-blue96x32",function(){
                        var jsons = {
                            groupID : fw.getGid()
                        }
                        fw.closeGroup(jsons, function(){
                            i8ui.alert({title:"关闭成功！",type: 2,cbk: function(){
                                window.location.href = '/group/list';
                            }});

                        });
                    });
                }else if(vhtml == "邀请成员"){
                    inviteMember();
                }
            });
            //编辑公告
            $("#js_edit_group_cement").click(function(){
                $("#js_group_notice").hide();
                $("#js_group_notice_edit").show();
            });
            //取消编辑公告
            $("#js_group_notice_edit").on("click","span.btn-gray96x32",function(){
                $("#js_group_notice").show();
                $("#js_group_notice_edit").hide();
            });
            //保存编辑公告
            $("#js_group_notice_edit").on("click","span.btn-blue96x32",function(){
                var $this = $("#js_alert_btn");
                updateNotice(function(){
                    i8ui.alert({title:"发布成功！",type:2, btnDom: $this});
                    expendNotice($("#js_group_notice").html(groupDT.Notice));
                    $("#js_group_notice").show();
                    $("#js_group_notice_edit").hide();
                });

            });
            //编辑群组信息
            $("#js_group_edit").show();
            $("#js_group_edit").click(function(){
                var addgroup = require('../group/addgroup.js');
                addgroup.groupBox(groupDT,function(data){
                    groupDT = data;
                    $("#span-group-name").html(groupDT.Name);
                    $("#js_group_headimg").attr("src",groupDT.Icon);
                    $("#js_group_description").html(groupDT.Description);
                });
            });
            //设置管理员
            $("#js_group_members_tbody").on("click","span.set-manager",function(){
                var $this = $(this);
                var jsons = {
                    groupID : groupDT.ID,
                    memberID : $this.attr("pid"),
                    mystate : 1
                }
                fw.outGroupID(jsons,function(){
                    i8ui.alert({title:"设置成功", type:2, btnDom: $this});
                    $this.html('<i class="spbg1 sprite-70"></i>撤销管理员')
                        .removeClass("set-manager")
                        .addClass("del-manager");
                });
            });
            //撤销管理员
            $("#js_group_members_tbody").on("click","span.del-manager",function(){
                var $this = $(this);
                var userid = $this.attr("pid");
                var jsons = {
                    groupID : groupDT.ID,
                    memberID : userid,
                    mystate : 2
                }
                fw.outGroupID(jsons,function(){
                    i8ui.alert({title:"撤销成功", type:2, btnDom: $this});
                    if(userid == i8_session.uid){
                        $this.remove();
                        return;
                    }
                    $this.html('<i class="spbg1 sprite-35"></i>设置管理员')
                        .removeClass("del-manager")
                        .addClass("set-manager");
                });
            });
            //踢出成员
            $("#js_group_members_tbody").on("click","span.del-member",function(){
                var $this = $(this);
                var jsons = {
                    groupID : groupDT.ID,
                    memberID : $this.attr("pid"),
                    mystate : 0
                }
                i8ui.confirm({title:"确定要踢出该成员吗？",btnDom:$this},function(){
                    fw.outGroupID(jsons,function(){
                        i8ui.alert({title:"踢出成功",btnDom: $this,type:2});
                        membersList(1);
                    });
                });
            });
            //查看文档
        }
        //是否在群组中
        if(isInGroup() && groupDT.Status == 0){
            $("#js_group_out").show();
            //退出群组
            $("#js_group_out").on("click","div.ta-pf-btn",function(){
                i8ui.confirm({title:"你确定要退出该群组吗？"},function(){
                    var jsons = {
                        groupID : groupDT.ID,
                        memberID : i8_session.uid,
                        mystate : 0
                    }
                    fw.outGroupID(jsons,function(result){
                        i8ui.write("退出成功!");
                        window.location.href = i8_session.baseHost + 'group/list';
                    });
                });
            });
        }
        membersList(1);
        docList(1);
        seefile.ks.bindImgClick($("#js_group_doc_arrs,#js_group_block_lists"));
        //加入群组
        $("#group_content").on("click","a.add-group",function(){
            var $this = $(this);
            var datas = {
                groupID: groupDT.ID
            }
            $.ajax({
                url: i8_session.ajaxHost+'webajax/group/joinParam',
                type: 'get',
                dataType: 'json',
                data: datas,
                cache: false,
                success: function(result){
                    if(result.Result){
                        i8ui.alert({title:"加入成功！",type:2,btnDom: $this,cbk:function(){
                            window.location.href = window.location.href;
                        }});
                    }else{
                        i8ui.error(result.Description);
                    }
                },
                error: function(e1,e2,e3){
                    i8ui.error("服务器异常！请稍后再试");
                }
            });
        });
    });
    $(function(){
        //群组侃侃及列表初始化
        var showKankan=null;
        var groupID=util.getUrlParam("id");
        if(groupID != ""){
            var postBloger=blogPoster({container:"#quick_post",
                header:{kankan:true,schedule:false,daily:false},
                enableHeader:false,
                kkConfig:{attachment:true,gift:false,face:true,topic:true,scope:true,defalultScope:2,scopeukk:i8_session.ukankan,attachid:"btn_attachment",attaContainer:"upContainer",attabtnContainer:"btn_attachment_container",kid:"ksn",kkplaceholder:"侃侃生活点滴...",faceitem:""},
                postCompleted:function(data){
                    if(showKankan&& _.isObject(data)){
                        showKankan.appendBefore(data);
                    }
                    postBloger.addUser2Cache({ 'uid': groupDT.ID, 'uname': '@' + groupDT.Name,type:1 });
                    postBloger.defAddTxt2Box("@"+groupDT.Name+" ");
                    $(".only-visible-btn").trigger("click");
                },
                others:{sourceid:groupID}
            });
            postBloger.init();
            postBloger.addUser2Cache({ 'uid': groupDT.ID, 'uname': '@' + groupDT.Name,type:1 });
            postBloger.defAddTxt2Box("@"+groupDT.Name+" ");
            //侃侃展示
            showKankan=kankanlist({container:"#blog_list",listType:"group",appid:groupID,listHeader:false});
            showKankan.init();
            if(!isInGrounp()){
                $('#quick_post').append('<div id="quick_post_mask"></div><div id="quick_post_mask_cont"><i class="icon icon-no-in-grounp"></i>只有成员才能发言，<a class="add-group cur">赶快加入</a>吧！</div>')
                if($("#blog_list ul li.blist-cell").length>0) {
                    $('#blog_list').append('<div id="blog_list_mask"></div>')
                }
            }
            if(groupDT.Status==1){//关闭后的群组
                $('#quick_post').append('<div id="quick_post_mask"></div><div id="quick_post_mask_cont"><i class="icon icon-no-in-grounp"></i>该群组已关闭！</div>')
                $("#grp-tab-content").append($('<div class="disabledLayer"></div>'));
            }
        }
    });
});
