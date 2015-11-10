define(function(require, exports){
    var pb = require('./public.js');
    var tipsTypes = null;
    var socket = require('../common/socket_client.js');
    var i8ui = require('../common/i8ui.js');
    var util = require('../common/util.js');
    var tipsPanl = $("#js_tips_fixed");
    var tipsDiv = $("div.tips-list-linka");
    var tipsArrs = [];
    require('../common/rootbtn.js');
    //更新tips
    window.updatetips = function(noticeid){
        $.ajax({
            url: i8_session.ajaxHost+'webajax/modules/updatetips',
            type: 'get',
            dataType: 'json',
            cache: false,
            data:{noticeid: noticeid},
            success: function(result){
                if(result.Result){
                    getTips();
                }else{
                    i8ui.error(result.Description);
                }
            },
            error: function(e1,e2,e3){
            }
        });
    }
    function getTips(){
        pb.getTipstype(function(arrs){
            tipsTypes = arrs;
            $.ajax({
                url: i8_session.ajaxHost+'webajax/modules/tips',
                type: 'get',
                dataType: 'json',
                cache: false,
                success: function(result){
                    if(result.Result){
                        showHtml(result.ReturnObject || []);
                    }else{
                        i8ui.error(result.Description);
                    }
                },
                error: function(e1,e2,e3){
                }
            });
        });
    }
    //显示tips结果
    function showHtml(Items,isGet){
        if(!Items){
            Items = [];
        }
        tipsArrs = Items;
        var jsonCookie = util.getCookies('tipscookie') || "";
        var cokarrs = jsonCookie.split(';');
        var alinks = '';
        var bol = false;
        var cementCount = 0;
        var workflowCount = 0;
        for(var i=0; i<Items.length; i++){
            var _item = Items[i];
            //如果是企业墙
            if(_item.NoticeID == '57d99d89-caab-482a-a0e9-a0a803eed3ba'){
                cementCount = _item.TodoNum;
                continue;
                //如果是工作流待办
            }else if(_item.NoticeID == 'b4510a44-2f13-485a-a720-0c32adc06f70'){
                workflowCount = _item.TodoNum;
                continue;
            } else if(_item.TipNum){
                var tpsOps = tipsTypes[_item.NoticeID];
                var urlHost = '';
                if(_item.Type == "workflow"){
                    urlHost =i8_session.wfbaseHost;
                }else{
                    urlHost = i8_session.baseHost;
                }
                alinks += '<a class="tips-msg" href="'+ urlHost + tpsOps.Url +'" noticeid="'+ _item.NoticeID +'"><span class="my-tips-num">'+ _item.TipNum +'</span>'+ (tpsOps.Title) +'</a>';
                if(jsonCookie.indexOf(_item.NoticeID) < 0){
                    bol = true;
                }else{
                    for(var e=0; e<cokarrs.length; e++){
                        var ckID = cokarrs[e].split("|")[0];
                        if(ckID == _item.NoticeID){
                            var countNum = cokarrs[e].split("|")[1];
                            if(countNum != _item.TipNum){
                                bol = true;
                            }
                        }
                    }
                }
            }
        }
        //是否有新的企业墙
        if(cementCount > 0 ){
            $("#js_notice_tps").html(cementCount > 99 ?"N": cementCount).css("display","block");
        }else{
            $("#js_notice_tps").html("0").hide();
        }
        if(window.location.href.indexOf("process/task") < 0 && isGet) {
            //是否有新工作流待办
            if (workflowCount > 0) {
                $("#js_work_tps").html(workflowCount > 99 ? "N" : workflowCount).css("display", "block");
            } else {
                $("#js_work_tps").html("0").hide();
            }
        }

        if(alinks != ""){
            tipsDiv.html(alinks).show();
            $("li.my-message").addClass("news");
        }else{
            $("li.my-message").removeClass("news");
            tipsDiv.html(alinks).hide();
            tipsPanl.hide();
        }
        if(bol){
            tipsPanl.show();
            util.setCookies('tipscookie', "");
        }else{
            tipsPanl.hide();
        }
    }
    function socketDivider(data){
        var curaid=i8_session.aid;//.replace(/\-/g,"");
        switch (data.type){
            case 0:
                data.entity= _.where(data.entity,{"aid":curaid});
                for(var e=0; e<data.entity.length; e++){
                    var ishave = true;
                    var newItem = data.entity[e];
                    for(var i=0; i<tipsArrs.length; i++){
                        var oldItem = tipsArrs[i];
                        //如果已经存在该类型tips消息，则覆盖原来的item
                        if(newItem.NoticeID == oldItem.NoticeID){
                            tipsArrs[i] = newItem;
                            ishave = false;
                        }
                    }
                    //如果是新的类型tips消息则加入tipsArrs中
                    if(ishave){
                        tipsArrs.push(newItem);
                    }
                }
                showHtml(tipsArrs,true);
                break;
            case 2:
                if(window.realTimeKankan&&data.entity.aid==curaid){
                    window.realTimeKankan(data.entity);
                }
                break;
            case 3:
                if(i8_session.sid !=  data.entity.sid){
                    window.location.href = '/login?id='+ data.entity.ip;
                }
                break;
            case 5:
                try{downloadCbk(data)}catch (e){}
                break;
            case 10:
                if(data.entity.aid==curaid) {
                    scheduleTip.showScheduleHtml(data.entity);
                }
                break;
            case 31:
                reflashContext();//刷新上下文信息
                break;
            case 30://被禁用，强行退出用户
                alert('您的帐号已被管理员禁用，3秒后将退出！');
                setTimeout(function(){
                    window.location.href=i8_session.baseHost+"logout";
                },3000);

        }
    }
    function reflashContext(){
        $.get(i8_session.ajaxHost+'webajax/appcom/getNewContext',{},function(resp){
            if(resp.Result){
                i8_session=resp.ReturnObject;
            }else{

            }
        },"json")
    }
    //读取站点发布更新提醒
    function getpubNotie(){
        $.ajax({
            url: i8_session.ajaxHost+'webajax/modules/getnoticelast',
            dataType: 'json',
            type:'get',
            data:{"_": _.now()},
            success:function(data){
                if(data.result){
                    var cementEndTime = new Date(parseInt(data.data.EndTime.substring(6,19)));
                    var nowTime = new Date();
                    if(cementEndTime <= nowTime){
                        return;
                    }
                    var noticeHtml = '<div id="js_notice_last" class="app-head-notice tcenter">'+ data.data.NoticeContent +'<span class="my-tps-close"></span></div>';
                    $(document.body).append(noticeHtml);
                    $("#js_notice_last").on("click",".my-tps-close",function(){
                        $("#js_notice_last").remove();
                        util.setCookies("notice_last","true",1);
                    });
                }
            }
        });
    }
    //社区到期提醒
    function showCom(){
        i8_session.expire = i8_session.expire.replace(/-/g,"/");
        //判断到期提醒
        var endTime = new Date(i8_session.expire).valueOf();
        var nowTime = new Date();
        var oneday = new Date(nowTime.getFullYear()+"/"+(nowTime.getMonth()+1)+"/"+ nowTime.getDate()).valueOf();
        var endhtmls = [];
        var endDay = parseInt((endTime - oneday)/(1000*60*60*24));
        //先判断社区是否快到期
        if(endTime <= oneday){
            var othertpl = '';
            //社区切换
            if(i8_session.multiact){
                othertpl = '<span class="lt m-r10">跳转至</span><div class="lt app-cp-logo rel">'+
                    '<a id="js_show_communitys1" class="cmt-names" style="" title="'+ i8_session.aname +'">'+i8_session.aname+'</a>'+
                    '<span id="js_show_down_jt" class="spbg1 sprite-115" style="display: inline; top: 7px; left: 298px;"></span>'+
                    '<div id="js_community_list1" class="hd-communitys" style="border:1px solid #cbcbca; bottom: 61px; top: auto; box-shadow: none; left:0.5px; border-radius: 0px; width: 320px;"></div>'+
                    '</div>';
            }
            var tpl = '<div class="time-over">'+
                '<span class="time-over-bg1 lt"></span>'+
                '<div class="time-over-cont cl000">'+
                '<a href="/logout" style="position: absolute; top: 20px; right: 20px;">退出登录</a>'+
                '{if version == \"senior\"}'+
                '<h2>服务到期提醒</h2>'+
                '<h3 class="bold m-b25">'+
                '尊敬的用户，您在i8小时上的付费使用时间已经结束，请联系我们客服人员，及时续费，继续享受服务：'+
                '{else}'+
                '<h2>试用到期提醒</h2>'+
                '<h3 class="bold m-b25">'+
                '尊敬的用户，您在i8小时上的试用时间已经结束，请联系我们客服人员，升级为付费版，享受更多服务：'+
                '{/if}'+
                '</h3>'+
                '<ul class="time-over-ul">'+
                '<li><span class="bold">企业管家</span>——流程数据的深度分析，假期、预算、考勤通通搞定</li>'+
                '<li><span class="bold">工作流</span>——落实管理制度，永久保存流程数据，自由DIY流程设计</li>'+
                '<li><span class="bold">社区协作</span>——制定计划、完成任务、总结经验、分享idea</li>'+
                '<li><span class="bold">移动手机</span>——社区、工作流、数据带在身上，外出再不能影响您的工作</li>'+
                '<li><a class="ft14 bold" style="line-height: 36px;">服务热线：400-877-1181</a></li>'+
                '</ul>'+ othertpl +
                '</div>'+
                '</div>'+
                '<div class="ct-msk"></div>';
            var tmp = template(tpl);
            $(document.body).append(tmp(i8_session.platform));
            if(i8_session.multiact){
                var btnDom = $("#js_show_communitys1,#js_show_down_jt");
                var listDom = $("#js_community_list1");
                btnDom.show();
                changeCom(btnDom,listDom);
            }
            if(i8_session.platform.version != "senior"){
                endhtmls.push('<span class="red">试用已到期，请联系i8客服升级为付费版，服务热线：400-877-1181</span>');
            }else{
                endhtmls.push('<span class="red">服务已到期，请联系i8客服及时续费，服务热线：400-877-1181</span>');
            }
        }else if(endDay <= 30 && endDay >= 0){
            //高级版
            if(i8_session.platform.version == 'trial'){
                endhtmls.push('<span class="red">距离试用截止日期还有<span class="bold">'+ endDay +'</span> 天，届时服务将会自动停止，升级为付费版，享受更多服务。服务热线：400-877-1181</span>');
            }else{
                endhtmls.push('<span class="red">距离服务到期时间 '+ i8_session.expire.substring(0,10) +' 还有 <span class="bold">'+ endDay +'</span> 天，请联系i8客服及时续费，服务热线：400-877-1181</span>');
            }
        }
        $("#js_time_tps").html(endhtmls.join(" "));
//        var appJsons = {};
//        //读取工作协作列表
//        $.post(i8_session.ajaxHost+'webajax/modules/getmutippsvalue',{keys:decodeURIComponent(i8_session.apps)},function(response){
//            if(response.Result){
//                for(var i=0; i<response.ReturnObject.length; i++){
//                    var item = response.ReturnObject[i];
//                    appJsons[item.Key] = item.Name;
//                }
//                //在判断应用是否到期
//                for(var key in i8_session.expireapp){
//                    var endDay = parseInt((endTime - oneday)/(1000*60*60*24));
//                    if(endDay <= 30 && endDay > 0){
//                        endhtmls.push('<span class="red">距离'+ (appJsons[key]||"未知") +'应用服务到期时间还有 <span class="bold">'+ endDay +'</span> 天，届时服务将会自动停止，请联系i8客服及时续费，服务热线：400-877-1181</span>');
//                    }
//                }
//                $("#js_time_tps").html(endhtmls.join(" "));
//                //bgchangeSpan();
//            }
//
//        },"json");
//        //轮播事件
//        function bgchangeSpan(){
//            var tsize = -32;
//            var spanDoms = $("#js_time_tps>span");
//            var firstDom = $(spanDoms[0]);
//            var maxtop = (spanDoms.length -1)*32;
//            if(spanDoms.length > 0){
//                function changeSpan(){
//                    var oldmtop = parseInt(firstDom.css("margin-top"));
//                    if(oldmtop == 0){
//                        tsize = -32
//                    }
//                    if(maxtop + oldmtop == 0){
//                        tsize = 32;
//                    }
//                    firstDom.css({marginTop: oldmtop + tsize});
//                    setTimeout(changeSpan,10000);
//                }
//                setTimeout(changeSpan,10000);
//            }
//        }

    }
    function changeCom(btnDom,listDom){
        var actList = [];
        //获取社区列表
        function getActList(){
            $.ajax({
                url: i8_session.ajaxHost+'webajax/login/getActList',
                type: 'post',
                dataType: 'json',
                data:{"_": _.now()},
                success: function(result){
                    if(result.Result){
                        var listsHTML = '';
                        actList = result.ReturnObject;
                        for(var i=0; i<actList.length; i++){
                            var item = actList[i];
                            var iscurrent =  (i8_session.aid == item.aid ? "current": "");
                            var isdef = '<em title="设为默认社区" class="spbg1 sprite-117"></em>';
                            if(item.isdef){
                                isdef = '<em title="默认社区" class="spbg1 sprite-116"></em>';
                            }
                            listsHTML += '<a class="'+iscurrent+'" domain="'+item.domain+'"><span>'+item.aname+'</span><i class="spbg1 sprite-87"></i>'+ isdef+'</a>';
                        }
                        listDom.html(listsHTML);
                    }else{
                        i8ui.error(result.Description);
                    }
                },
                error: function(e1,e2,e3){
                    i8ui.error("操作失败");
                }
            });
        }
        //显示|隐藏社区列表
        btnDom.click(function(){
            if($(this).attr("class").indexOf("up") >= 0){
                $(this).removeClass("up");
            }else{
                $(this).addClass("up");
            }
            listDom.toggle();
            if(listDom.find("a").length <= 0){
                getActList();
            }
        }).show();
        //社区切换
        listDom.on("click","a",function(){
            if($(this).hasClass("current")){
                return;
            }
            var _domain=$(this).attr("domain");
            var targetAct= _.findWhere(actList,{domain:_domain});
            if(targetAct.dctoken){
                var gcodeBox= i8ui.showbox({
                    title:"进入该社区需要短信验证码",
                    cont:'<div class="valMsg-box p-t15">' +
                        (targetAct.mobile.length==0?'<div class="p10 oflow p-b10"><div class="l-hh36 fw_left"><span>*</span>绑定手机号</div><div class="p-lr-15 fw_left"><input type="text" class="w-240-h33" style="height:30px" id="txt_phoneNum"/></div></div>':"")+
                        '<div class="p10 oflow p-b10">' +
                        '<div class="l-hh36 fw_left"><span style="color:red">*</span>短信验证码</div><div class="p-lr-15 fw_left"><input type="text" class="w-128-h33" style="height:30px" id="txt_msgCode"/></div><div class="fw_left"><button class="blue-button rt" id="btn_getCode">获取验证码</button></div>' +
                        '</div>' +
                        '<div class="p10 m-b10 tright"><button class="blue-button" id="btn_submitmsg">确定</button>　<button class="gray-button" id="btn_cancelmsg">取消</button></div>' +
                        '</div>'
                });
                $("#btn_getCode").click(function(){
                    if(!$(this).hasClass("get-disabled")) {
                        var bindTel= $.trim($("#txt_phoneNum").val());
                        if(targetAct.mobile.length==0){
                            if(bindTel.length==0){
                                i8ui.error('您还未绑定手机号!');
                                return;
                            }
                        }
                        var button = $(this), sec = 59;
                        button.css({"background-color": "#bfbfbf"}).addClass("get-disabled").text("59秒后重发");
                        var timer = setInterval(function () {
                            if (sec > 0) {
                                sec--;
                                button.text(sec + "秒后重发");
                            } else {
                                sec = 59;
                                clearInterval(timer);
                                button.text("获取验证码").removeAttr("style").removeClass("get-disabled");
                            }
                        }, 1000);
                        if(targetAct.msgCode) {
                            $.post(i8_session.ajaxHost + 'webajax/appcom/getValidateCodeMsg', {code:targetAct.msgCode,aid:targetAct.aid,tel:bindTel}, function (resp) {
                                if(resp.Result){
                                    i8ui.simpleWrite('验证码已发送成功！',button);
                                }else{
                                    i8ui.error(result.Description);
                                }
                            }, "json")
                        }
                    }
                });
                $("#btn_submitmsg").click(function(){
                    var phoneNum = targetAct.mobile,valiCode= $.trim($("#txt_msgCode").val());
                    if(targetAct.mobile.length==0) {
                        phoneNum = $.trim($("#txt_phoneNum").val());
                        if (!(new RegExp("1[3-9][0-9]{9}", "g")).exec(phoneNum)) {
                            i8ui.error('请绑定正确的手机号码！');
                            return ;
                        }
                    }
                    if(valiCode.length==0){
                        i8ui.error('请输入验手机证码！');
                        return;
                    }
                    $.post(i8_session.ajaxHost + 'webajax/appcom/validateCode', {bindTel:targetAct.mobile.length==0,phoneNo: phoneNum, vcode: valiCode,dm:targetAct.domain,aid:targetAct.aid}, function (resp) {
                        if (resp.Result) {
                            createNewSocLink(targetAct,function(data){
                                window.location.href = window.location.protocol + data.openurl
                            });
                        }else{
                            i8ui.error(resp.Description);
                            $("#btn_getCode").text("获取验证码").removeAttr("style").removeClass("get-disabled");
                        }
                    }, "json");
                });
                $("#btn_cancelmsg").click(function(){ gcodeBox.close();});
                $("#txt_phoneNum").blur(function(){
                    var preBindTel=$.trim($(this).val());
                    if (!(new RegExp("1[3-9][0-9]{9}", "g")).exec(preBindTel)) {
                        i8ui.error('请绑定正确的手机号码！');
                        $(this).select();
                        return ;
                    }
                    $.post(i8_session.ajaxHost + '/webajax/login/isJoined',{jdata:{passport:preBindTel}},function(reps){
                        if(reps.Result){

                        }else{
                            i8ui.error('手机号无效，可能已被占用！');
                        }
                    },"json")
                })
            }else{
                var index = $(this).index();
                var item = actList[index];
                createNewSocLink(item,function(data){
                    var newurl = window.location.protocol + data.openurl;
                    window.location.href = newurl;
                })
            }
        });
        //创建切换社区链接
        function createNewSocLink(data,callback){
            $.post(i8_session.ajaxHost+'webajax/usrdata/createauth',{jdata: data},function(resp){
                if(resp.Result){
                    if(callback){
                        callback(resp.ReturnObject);
                    }
                }
            },"json");
        }
        //设置默认社区
        listDom.on("click",".sprite-117",function(){
            var index = $(this).parent().index();
            var item = actList[index];
            $.ajax({
                url: '/webajax/login/setDefaultAccount',
                type: 'post',
                dataType: 'json',
                data:{jdata: {acid: item.aid},_: _.now()},
                success: function(result){
                    if(result.Result){
                        getActList();
                    }else{
                        i8ui.error(result.Description);
                    }
                },
                error: function(e1,e2,e3){
                    i8ui.error("操作失败");
                }
            });
            return false;
        });
    };
    //右下角提醒控件
    var scheduleTip = {
        transAppKey:function(appKey,type){
            var _appName=''
            switch (appKey.toLocaleLowerCase()){
                case 'app_schedule':
                    if(type==1){
                        _appName='日程'
                    }else{
                        _appName='会议'
                    }
                    break;
                case 'app_task':
                    _appName='任务'
                    break;
            }
            return _appName;
        }
        ,refreshScheduleHtml:function(Item,countNum){
            var appUrl=Item.AppKey.toLocaleLowerCase()=='app_schedule' ? 'calendar': 'task';
            $('.home-schedule-title').html(''+scheduleTip.transAppKey(Item.AppKey,Item.Type)+'：<a target="_blank" href="'+i8_session.baseHost+''+appUrl+'/detail/'+Item.ID+'">'+Item.Title+'</a>');
            if(Item.AppKey=='app_task'){
                $('.home-schedule-time').html('到期时间：'+Item.Time+'');
            }else{
                $('.home-schedule-time').html('开始时间：'+Item.Time+'');
            }
            $('.home-schedule-index').html(countNum)
        }
        , renderScheduleHtml:function(Item,tatol,hasbox){
            var disabled='';
            var _html='';
            var stratOrEnd='';
            var appUrl=Item.AppKey.toLocaleLowerCase()=='app_schedule' ? 'calendar': 'task';
            if(Item.AppKey=='app_task'){
                stratOrEnd='到期时间';
            }else{
                stratOrEnd='开始时间';
            }
            if(hasbox){
                _html='<div class="home-schedule-box" id="home_schedule_box">';
            }
            _html+='<div class="rt m-t5 hide nextandprev" style="display: block;">\
                <span id="prev_schedule" class="spbg1 sprite-93 "></span><span id="next_schedule" class="spbg1 sprite-94 disabled"></span>\
            </div><div class="black bold home-schedule-title">'+scheduleTip.transAppKey(Item.AppKey,Item.Type)+'：<a target="_blank" href="'+i8_session.baseHost+''+appUrl+'/detail/'+Item.ID+'">'+Item.Title+'</a></div><div class="home-schedule-time">'+stratOrEnd+'：'+Item.Time+'</div><div class="home-schedule-index-box"><span class="home-schedule-index">'+tatol+'\
                </span><span class="home-schedule-total">/'+tatol+'</span></div><div class="home-schedule-close"></div>'
            if(hasbox){
                _html+='</div>'
            }
            return _html;
        }
        ,showScheduleHtml:function(Item){
            var schedule={};
            if($('#home_schedule_box').length){
                var olditems=$('#home_schedule_box').data().Items;
                var ids=_.pluck(olditems, 'ID');
                if(_.indexOf(ids,Item.ID)==-1){
                    olditems.push(Item);
                    var newitems=olditems;
                    //console.log(newitems)
                    var _html=scheduleTip.renderScheduleHtml(Item,newitems.length,true);
                    $('#home_schedule_box').replaceWith(_html);
                    schedule.Items=newitems;
                    $('#home_schedule_box').data(schedule);
                    scheduleTip.updataBottomTipCookies(schedule);
                }else{
                    return;
                }
            }else{
                var _html=scheduleTip.renderScheduleHtml(Item,1,true);
                $('.app-content').append(_html)
                schedule.Items=[Item];
                $('#home_schedule_box').data(schedule);
                scheduleTip.updataBottomTipCookies(schedule);

            }
            if(schedule.Items.length<2){
                $('.nextandprev').hide();
            }else{
                $('.nextandprev').show();
                var showPageCont={};
                var countNum = schedule.Items.length;
                var datas = schedule.Items;
                showPageCont.size = 0;
                var prevBtn = $("#prev_schedule");
                var nextBtn = $("#next_schedule");
                prevBtn.removeClass('disabled')
                //上一页
                prevBtn.click(function(){
                    if(prevBtn.attr("class").indexOf('disabled')>=0){
                        return;
                    }
                    var _index=parseInt($('.home-schedule-index').text());
                    nextBtn.removeClass('disabled');
                    if(_index<3){
                        prevBtn.addClass('disabled');
                    }
                    scheduleTip.refreshScheduleHtml(datas[_index-2],_index-1);
                });
                //下一页
                nextBtn.click(function(){
                    if(nextBtn.attr("class").indexOf('disabled')>=0){
                        return;
                    }
                    var _index=parseInt($('.home-schedule-index').text());
                    prevBtn.removeClass('disabled');
                    if(_index>countNum-2){
                        nextBtn.addClass('disabled');
                    }
                    scheduleTip.refreshScheduleHtml(datas[_index],_index+1);
                });
            }
            $('.home-schedule-close').click(function(){
                $('.home-schedule-box').remove();
                scheduleTip.deleteBottomTipCookies();
            })
        }
        ,updataBottomTipCookies:function(Items){
            Items.uid=i8_session.uid;
            util.setCookies('bottomTipCookies',util.toJsonString(Items));
        }
        ,deleteBottomTipCookies:function(){
            util.setCookies('bottomTipCookies','');
        }
        ,loadBottomTips:function(){

            var oldItems=util.getCookies('bottomTipCookies');
            if(!oldItems){
                return;
            }
            oldItems= $.parseJSON(oldItems);
            console.log(oldItems)

            if(oldItems.uid!=i8_session.uid){
                scheduleTip.deleteBottomTipCookies();
                return;
            }
            oldItems=oldItems.Items || [];
            for(var k=0;k<oldItems.length;k++){
                scheduleTip.showScheduleHtml(oldItems[k])
            }
        }

    }
    $(function(){
        getTips();
        //是否多社区
        if(i8_session.multiact){
            var btnDom = $("#js_show_communitys");
            var listDom = $("#js_community_list");
            btnDom.show();
            changeCom(btnDom,listDom);
        }else{
            $("#js_show_communitys").remove();
        }

        var urlhosts = window.location.host.split(".");
        urlhosts[0] = 'www';
        var newurl = urlhosts.join(".");
        urlhosts[0] = 'bbs';
        var bbsurl = urlhosts.join(".");
        var btnhtml = '<div id="js_rtbtns" class="fixed-btns">'+
            '<div class="fixed-btn-op">'+
            '<span class="helpbtn1"></span>'+
            '<div class="animate">'+
            '<p style="background: #47c7ea;"></p>'+
            '<a href="http://wpa.b.qq.com/cgi/wpa.php?ln=1&key=XzkzODAyNTMwMl8xNjY3MDlfNDAwODc3MTE4MV8yXw" target="_blank">在线咨询</a>'+
            '</div>'+
            '</div>'+
            '<div class="fixed-btn-op">'+
            '<span class="helpbtn2"></span>'+
            '<div class="animate">'+
            '<p style="background: #87ce18;"></p>'+
            '<a href="http://'+newurl+'/help" target="_blank">帮助中心</a>'+
            '</div>'+
            '</div>'+
            '<div class="fixed-btn-op">'+
            '<span class="helpbtn3"></span>'+
            '<div class="animate" style="">'+
            '<p style="background: #fbb40e;"></p>'+
            '<a href="http://'+bbsurl+'/post" target="_blank">意见反馈</a>'+
            '</div>'+
            '</div>'+
            '</div>';
        $("body").append(btnhtml);

        /**
         * 原页面里 builtNav script代码
         * */
        var builtNav= function(navdoms,addclassName){
            var addclassName=addclassName || "current";
            var _location = window.location.href;
            $(navdoms).removeClass(addclassName).each(function(index,item){
                var navkeyword=$(item).attr('navkeyword');
                if(navkeyword && _location.indexOf(navkeyword)>0){
                    $(item).addClass(addclassName);
                }
            })
            if($(''+navdoms+'.current').length==0){
                $(navdoms).eq(0).addClass('current')
            }
        }
        if($('.communityheader').length!=0){
            builtNav('.app-mapsite a')
        }
    });
    $(window).load(function(){
        socket.initSocket({
            roomId: i8_session.uid,
            url:i8_session.socketio,//'http://socketio.hvming.com', //'/socket.io', //
            callback: function(data){
                console.log(data);
                if(_.isObject(data)){
                    socketDivider(data);
                }
            }
        });
        //获取待办流程总数
        if(window.location.href.indexOf("process/task") < 0) {
            //获取待办流程数量
            $.ajax({
                url: i8_session.ajaxWfHost+'webajax/process/gettaskactivecount',
                type: 'get',
                dataType: 'json',
                data:{"_": _.now()},
                success: function(data){
                    if(data.Result){
                        //是否有新的待审批路程
                        var workCount = data.ReturnObject[0].Item1;
                        if(workCount > 0 ){
                            $("#js_work_tps").html(workCount > 99 ?"N": workCount).show();
                        }else{
                            $("#js_work_tps").hide();
                        }
                    }else{
                        i8ui.error(data.Description);
                    }
                },
                error: function(e1,e2,e3){
                }
            });
        }
    });
    scheduleTip.loadBottomTips();
    window.scheduleTip = scheduleTip;
    //关闭提醒浮层
    tipsPanl.on("click",".my-tps-close",function(){
        var jsonCookie = [];
        $(tipsDiv[1]).find("a.tips-msg").each(function(){
            jsonCookie.push($(this).attr("noticeid")+'|'+$(this).find("span").html());
        });
        util.setCookies('tipscookie', jsonCookie.join(';'));
        tipsPanl.hide();
    });
    if(!util.getCookies("notice_last")){
        getpubNotie();
    }
    //tips链接事件 为锚点页面进行刷新重置
    $("#js_top_links").on("click","a",function(){
        var hrefurl = $(this).attr("href");
        if(hrefurl != ""){
            window.location.reload(hrefurl);
        }
    });
    //判断是否有管理员的权限 或者 应用管理的权限
    if(i8_session.utype.length > 0 || i8_session.appadmin.length > 0){
        showCom();
    }
    //返回顶部功能
    $(window).scroll(function(){
        if($(document).scrollTop() >= 500){
            $("#js_retun_top").show();
        }else{
            $("#js_retun_top").hide();
        }
    });
    $(document).on("click","#js_retun_top",function(){
        $(document).scrollTop(0);
    });

    if($(window).width() <= 1200){
        $("#js_left_bg").css("margin-left","0px");
    }else{
        $("#js_left_bg").css("margin-left","-450px");
    }
    $(window).resize(function(){
        if($(window).width() <= 1200){
            $("#js_left_bg").css("margin-left","0px");
        }else{
            $("#js_left_bg").css("margin-left","-450px");
        }
    });
    //原top-nav-fix.js代码
    $(window).scroll(function(){
        var topHeight = 62;
        var scrollsize = $(document).scrollTop();
        if(scrollsize >= 350){
            $("#js_left_fixed_div").css({top: topHeight, position: "fixed",zIndex: 99});
        }else{
            $("#js_left_fixed_div").css({top: 0, position: "static",zIndex:0});
        }
        var headDom = $("#js_head_nav");
        if(scrollsize > 100){
            headDom.addClass("fixed");
            $("body").css("padding-top","115px");
        }else{
            headDom.removeClass("fixed");
            $("body").css("padding-top","0px");
        }
        var rtContDom = $("#js_home_rt_block");
        var blockDoms = $(rtContDom).find("div.rt-block");
        if(!rtContDom.length){
            return;
        }
        var rtTop = rtContDom.outerHeight();
        if(scrollsize >= rtTop){
            rtContDom.css({top: topHeight, position: "fixed"});
            blockDoms.addClass("hzero");
            var calendarDom = document.getElementById("calendar");
            var taskrptDom = document.getElementById("taskrpt");
            var birthdayDom = document.getElementById("birthday");
            if(calendarDom){
                $(calendarDom).removeClass("hzero");
            }
            if(taskrptDom){
                $(taskrptDom).removeClass("hzero");
            }
            if(!calendarDom || !taskrptDom){
                if(birthdayDom){
                    $(birthdayDom).removeClass("hzero");
                }
            }
            if(!calendarDom && !taskrptDom && !birthdayDom){
                $(blockDoms[0]).removeClass("hzero");
            }

        }else{
            rtContDom.css({ position: "inherit",width:250});
            blockDoms.removeClass("hzero");
        }
    });
});
