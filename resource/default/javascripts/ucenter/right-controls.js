/**
 * Created by kusion on 2015/8/15.
 * 该文件为，社区首页、@我的评论、@我的侃侃等页面的右则控件JS整合（管理员引导、新手引导、我的日程、我的任务、新员工风采、生日祝福、热门话题、i8社区）
 */
define(function(require){
    var i8ui = require('../common/i8ui'),pubjs = require('../modules/public.js');
    /**
    *管理员引导（原modules/managenovice.js）
    */
    var adminnav = i8_session.adminnav;
    if($("#js_manage_novice_ul").length > 0) {
        var adminLi = $("#js_manage_novice_ul").html();
        var adminNum = 0;
        if (!adminnav) {
            adminnav = {};
        }
        for (var key in adminnav) {
            if (adminnav[key]) {
                adminNum++;
            }
        }
        adminLi = adminLi.replace('{setcomp}', adminnav.setcomp)
            .replace('{invitemate}', adminnav.invitemate)
            .replace('{addlevel}', adminnav.addlevel)
            .replace('{addorg}', adminnav.addorg)
            .replace('{designwf}', adminnav.designwf)
            .replace('{setrole}', adminnav.setrole)
            .replace('{addadmin}', adminnav.addadmin)
            .replace('{addcontact}', adminnav.addcontact);

        var statusDom = $("#js_manage_novice_status");
        if (adminNum <= 3) {
            statusDom.html('<i class="spbg1 sprite-90"></i>初掌i8');
        } else if (adminNum > 3 && adminNum <= 6) {
            statusDom.html('<i class="spbg1 sprite-91"></i>管理高手');
        } else if (adminNum >= 7) {
            statusDom.html('<i class="spbg1 sprite-92"></i>管理之星');
        }
        $("#js_manage_novice_ul").html(adminLi).show();
    }

    /**
     *我的日程（原modules/calendar.js）
     */
    //var i8ui = require('../common/i8ui');
    var util=require('../common/util');
    var addcalendar=require('../calendar/addcalendar');
    /*build(remove.start)*/
    require('../plugins/i8scrollbar/mscrollbar.js');
    require('../plugins/i8scrollbar/css/mscrollbar.css');
    /*build(remove.end)*/
    var common=require('../calendar/common');
    var calendartitle=$('#calendartitle');
    var _ul=calendartitle.find('ul');
    var calendarbody=$('#calendarbody').mCustomScrollbar({
        scrollButtons: {
        },
        set_height:150,
        callbacks: {
            onScroll: function () {
            }
        },
        scrollInertia: 0,
        theme: "one-light-thin",
        axis: 'y',
        callbacks: {
            whileScrolling: function () {
            }
        }
    });
    template.helper('getDay',function(val){
        var date=new Date().getDate();
        if(val.replace){
            var retval=val.replace(/\d{0,}(-0|-)/,'');
            return  '<i class="day" style="background-color: '+(date==retval?'#f8b62b':'#47c7ea')+'">'+retval+'</i>';
        }
        return '';
    });


    var prev=calendartitle.find('.sprite-93');
    var next=calendartitle.find('.sprite-94');
    var weekarr=['日','一','二','三','四','五','六'];
    //获取当前周
    var getSevenDay=function(date,opt){
        var date=date||new Date();
        var year=date.getFullYear();
        var month=date.getMonth();
        var day=date.getDay()||7;
        var date=date.getDate();
        var retobj={
            getweek:[]
        }
        if(opt=='prev'){
            retobj.prevdate=new Date(year,month,date-7);
            retobj.nextdate=new Date(year,month,date-1);
            retobj.selectdate=retobj.nextdate;
            date=date-7;
        }else if(opt=='next'){
            retobj.prevdate=new Date(year,month,date+1);
            retobj.nextdate=new Date(year,month,date+7);
            retobj.selectdate=retobj.prevdate;
            date=date+1;
        }else{
            retobj.prevdate=new Date(year,month,date);
            retobj.nextdate=new Date(year,month,date+6);
            retobj.selectdate=retobj.prevdate;
        }
        for(var i=0;i<7;i++){
            var beginDate=new Date(year,month,date+i);
            var istoday=false;
            if(util.dateformat(new Date(),'yyyy-MM-dd')==util.dateformat(beginDate,'yyyy-MM-dd')){
                istoday=true;
            }
            if(istoday){
                prev.addClass('disabled');
            }
            retobj.getweek.push({datetime:util.dateformat(beginDate,'yyyy-MM-dd'),istoday:istoday,day:weekarr[beginDate.getDay()],date:beginDate.getDate(),month:beginDate.getMonth()+1})
        }
        return retobj;
    }

    //初始化
    var init=function(date,opt){
        var date=date||new Date();
        var _datetime=util.dateformat(date,'yyyy-MM-dd');
        var retobj=getSevenDay(date,opt);
        var noweek=retobj.getweek;
        prev.data('datetime',retobj.prevdate).attr('datetime',retobj.prevdate);
        next.data('datetime',retobj.nextdate).attr('datetime',retobj.nextdate);;
        var _datetime=util.dateformat(retobj.selectdate,'yyyy-MM-dd');

        var _li=[];
        for(var i=0;i<noweek.length;i++){
            _li.push('<li month="'+noweek[i].month+'" class="'+(_datetime==noweek[i].datetime?'active':'')+'" datetime='+noweek[i].datetime+' >' +
                '<span class="spbg1 sprite-52 spweek">'+noweek[i].day+'</span><a class="'+(noweek[i].istoday?'today':'')+'">'+noweek[i].date+'</a></li>');
        }
        _ul.html(_li.join(''));
        var firstm=noweek[0].month;
        var lastm=noweek[noweek.length-1].month;
        var monthtitle=firstm==lastm?'<span class="blue">'+firstm+'</span>月':'<span class="blue">'+firstm+'</span>月 - '+'<span class="blue">'+lastm+'</span>月'
        $('#calendarmonth').html(monthtitle);
        if(!opt){
            getScheduleList({
                userIDs:[i8_session.uid],
                startDate:noweek[0].datetime,
                endDate:noweek[noweek.length-1].datetime
            },function(){
                _ul.find('li').removeClass('active');
            });
            return;
        }
        getScheduleList({
            userIDs:[i8_session.uid],
            startDate:_datetime,
            endDate:_datetime
        });
    }

    //上一周
    calendartitle.on('click','.spbg1.sprite-93:not(.disabled)',function(){
        init($(this).data('datetime'),'prev');
    })

    //下一周
    next.on('click',function(){
        init($(this).data('datetime'),'next');
        prev.removeClass('disabled');
    });

    //显示一周日程按钮
    calendartitle.on('click','.sprite-show',function(){
        calendartitle.find('.show-week').toggle('fast');
        return false;
    });

    //显示一周日程
    calendartitle.on('click','.show-week',function(){
        //calendartitle.find('.show-week').toggle('slow');
        var week=getSevenDay().getweek;
        getScheduleList({
            userIDs:[i8_session.uid],
            startDate:week[0].datetime,
            endDate:week[week.length-1].datetime
        },function(){
            _ul.find('li').removeClass('active');
        });
        calendartitle.find('.show-week').hide('fast')
        return false;
    });
    $(document).on('click',function(){
        calendartitle.find('.show-week').hide('fast')
    })

    //获取日程列表
    var getScheduleList=function(options,callback){
        var _ul=calendarbody.find('ul');
        var istoday=calendartitle.find('li.active a').hasClass('today');
        if(istoday){
            options.startDate=util.dateformat(new Date(),'yyyy-MM-dd hh:mm');
        }
        _ul.html(template('js_calendar_tpl',{loading:true}));
        common.ajax.getScheduleList(options,function(data){
            var html=''
            if($.type(data)=='object'&&data.Result){
                html=template('js_calendar_tpl',data);
            }else{
                html=template('js_calendar_tpl',{error:true,Description:data.Code||data.Description});
            }
            _ul.html(html);

            callback&&callback();
        });
    }

    init(new Date(),0);

    _ul.on('click','li',function(){
        _ul.find('li').removeClass('active');
        var _this=$(this).addClass('active');
        getScheduleList({
            userIDs:[i8_session.uid],
            startDate:_this.attr('datetime'),
            endDate:_this.attr('datetime')
        });
    })

    $('#addcalendar').on('click',function(){
        var _date=new Date();
        var _h=_date.getHours();
        var _m=_date.getMinutes();
        if(_m>30){
            _h++;
            _m=0;
        }else{
            _m=30;
        }
        addcalendar.openWindow({
            title:'新建日程/会议',
            data:{
                addDate:util.dateformat(_date,'yyyy-MM-dd'),
                addStartTime:util.dateformat(new Date('2014','1','1',_h,_m),'hh:mm'),
                addEndTime:util.dateformat(new Date('2014','1','1',_h+1,_m),'hh:mm'),
                Type:1,
                ver:'home'
            }},function(){
            var _this=_ul.find('li.active');
            getScheduleList({
                userIDs:[i8_session.uid],
                startDate:_this.attr('datetime'),
                endDate:_this.attr('datetime')
            });
        });
    });
    /**
     *新员工风采（原modules/members.js）
     */
    //var pubjs = require('./public.js');
    //var i8ui = require('../common/i8ui.js');
    var i8city = require("../plugins/i8city/i8city.js");
    function getMembers(){
        $.ajax({
            url: i8_session.ajaxHost+'webajax/modules/members',
            type: 'get',
            dataType: 'json',
            cache: false,
            data: {topn: 10},
            success: function(result){
                if(result.Result){
                    var countNum = result.List ?  result.List.length : 0;
                    var datas = result.List || [];
                    showPageCont.size = 0;
                    if(countNum > 2){
                        $("#js_members_page").show();
                        var prevBtn = $("#js_members_prev");
                        var nextBtn = $("#js_members_next")
                        //上一页
                        prevBtn.click(function(){
                            if(prevBtn.attr("class").indexOf('disabled')>=0){
                                return;
                            }
                            showPageCont.size = showPageCont.size - 2;
                            nextBtn.removeClass('disabled');
                            if(showPageCont.size <= 0){
                                prevBtn.addClass('disabled');
                            }else{
                                prevBtn.removeClass('disabled');
                            }
                            showPageCont(datas);
                        });
                        //下一页
                        nextBtn.click(function(){
                            if(nextBtn.attr("class").indexOf('disabled')>=0){
                                return;
                            }
                            showPageCont.size = showPageCont.size + 2;
                            prevBtn.removeClass('disabled');
                            if(showPageCont.size < countNum - 2){
                                nextBtn.removeClass('disabled');
                            }else{
                                nextBtn.addClass('disabled');
                            }
                            showPageCont(datas);
                        });
                    }
                    showPageCont(datas);
                }
            },
            error: function(e1,e2,e3){
            }
        });
    }
    function getInfohtml(item){
        var rtHtml = '';
        if(item.BirthLocation && item.BirthLocation !=""){
            rtHtml += '<p><i class="spbg1 sprite-55"><b></b></i> 籍贯 '+ i8city.getCityByCode(item.BirthLocation) +'</p>';
        }
        if(item.Birthday){
            rtHtml += '<p><i class="spbg1 sprite-56"><b></b></i> 星座 '+ pubjs.getXingZuo(item.Birthday) +'</p>';
        }
        if(item.Labels.length > 0){
            rtHtml += '<p><i class="spbg1 sprite-57"></i> 爱好 '+ item.Labels.join('、') +'</p>';
        }
        if(item.Comment){
            rtHtml += '<p>我：'+ item.Comment +'</p>';
        }
        if(rtHtml == ""){
            if(item.ID == i8_session.uid){
                rtHtml = '<div class="tcenter"><a href="users/settings/info">立即完善信息！</a></div>'
            }else{
                rtHtml = '这个人很懒~<a class="members-at-ta" uid="'+ item.ID +'" uname="'+ item.Name +'">邀请TA尽快完善吧！</a>'
            }
        }
        return  rtHtml;
    }
    function getTimestring(timestr){
        if(timestr){
            var newstr = timestr.match(/[0-9]{4}-[0-9]{2}-[0-9]{2}/);
            return newstr[0].replace("-","年").replace("-","月") + "日";
        }
    }
    function getBirthday(timestr){
        if(timestr){
            var newstr = timestr.match(/[0-9]{4}-[0-9]{2}-[0-9]{2}/);
            return newstr[0].replace("-","年").substring(0,5);
        }else{
            return '';
        }
    };
    function showPageCont(datas){
        var mdHtml = $('#js-members-tpl').html();
        var listHtml = '';
        for( var i = showPageCont.size; i < showPageCont.size + 2; i++){
            var _item = datas[i];
            if(_item){
                listHtml += mdHtml.replace('{name}', _item.Name)
                    .replace('{headimg}', _item.HeadImage? _item.HeadImage:"")
                    .replace(/{ID}/g, _item.ID)
                    .replace('{datetime}', getTimestring(_item.CreateTime))
                    .replace('{orgname}',_item.OrgName)
                    .replace('{perinfo}',getInfohtml(_item));
            }
            //console.log();
        }
        if(datas.length <= 0){
            $("#js-members-list").html('<div class="fz14-weight tcenter p10 cl999"><span class="icon icon-no-members"></span>最近都没有新同事哦~</div>');
            return;
        }
        $('#js-members-list').html(listHtml);
    }
    getMembers();
    $("#members").on("click","a.members-at-ta",function(){
        var $this = $(this);
        var uname = $this.attr("uname");
        var uid = $this.attr("uid");
        $.post(i8_session.ajaxHost+'webajax/kkcom/postblog',{scopeType:2,kankanContent:'$%$'+ uname +','+ uid +',0$%$麻烦您尽快完善个人信息，比如籍贯、个人标签、出生日期O(∩_∩)O！'},function(response){
            if(response.Result){
                i8ui.simpleWrite("邀请发送成功！", $this);
                $this.removeClass("members-at-ta").css({"color":"#999","cursor":"default"});
            }else{
                i8ui.simpleAlert(response.Description, $this);
            }
        },"json");
    });
    /**
     * 生日祝福(原birthday.js)
    */
    //var i8ui = require('default/javascripts/common/i8ui');
    //var pubjs = require('default/javascripts/modules/public.js');
        //获取生日列表
    function getBirthdayList(){
        $.ajax({
            url: i8_session.ajaxHost+'webajax/modules/birthday?',
            type: 'get',
            dataType: 'json',
            cache: false,
            data:{fn:'getlist',topn:10},
            success: function(result){
                if(result.Result){
                    $("#js_birthday_ld_div").hide();
                    $("#js_birthday_cont").show();
                    var countNum = result.List? result.List.length : 0;
                    var datas =result.List || [];
                    if(countNum > 0){
                        $("#birthday").show();
                    }
                    $("#js_birthday_num").html(countNum);
                    showPageCont.size = 0;
                    if(countNum > 2){
                        $("#js_birthday_page").show();
                        var prevBtn = $("#js_birthday_prev");
                        var nextBtn = $("#js_birthday_next")
                        //上一页
                        prevBtn.click(function(){
                            if(prevBtn.attr("class").indexOf('disabled')>=0){
                                return;
                            }
                            showPageCont.size = showPageCont.size - 2;
                            nextBtn.removeClass('disabled');
                            if(showPageCont.size <= 0){
                                prevBtn.addClass('disabled');
                            }else{
                                prevBtn.removeClass('disabled');
                            }
                            showBirthPageCont(datas);
                        });
                        //下一页
                        nextBtn.click(function(){
                            if(nextBtn.attr("class").indexOf('disabled')>=0){
                                return;
                            }
                            showPageCont.size = showPageCont.size + 2;
                            prevBtn.removeClass('disabled');
                            if(showPageCont.size < countNum - 2){
                                nextBtn.removeClass('disabled');
                            }else{
                                nextBtn.addClass('disabled');
                            }
                            showBirthPageCont(datas);
                        });
                    }
                    showBirthPageCont(datas);
                }
            },
            error: function(e1,e2,e3){
            }
        });
    }
    function getBirthdayDate(birthday){
        if(birthday){
            var dtime = new Date(birthday.replace(/-/g,"/"));
            var month = dtime.getMonth() + 1;
            var day = dtime.getDate();
            return (month < 10 ? "0" + month : month) + '.' + (day < 10 ? '0' + day : day);
        }else{
            return '';
        }
    }
    function showBirthPageCont(datas){
        var mdHtml = $('#js_birthday_tpl').html();
        var listHtml = '';
        var uids = [];
        for( var i = showPageCont.size; i < showPageCont.size + 2; i++){
            var _item = datas[i];
            if(_item){
                listHtml += mdHtml.replace(/\{name\}/g, _item.Name)
                    .replace('{headimg}', _item.HeadImage)
                    .replace(/\{birthday\}/g, getBirthdayDate(_item.Birthday))
                    .replace(/\{bid\}/g, _item.ID)
                    .replace("{btime}",_item.Birthday)
                    .replace('{imgs}',getZhufuimgs(_item.Pleasure))
                    .replace('{xingzuo}',pubjs.getXingZuo(_item.Birthday));
                uids.push(_item.ID);
            }
        }
        if(datas.length <= 0){
            $("#js_birthday_cont").html('<div class="fz14-weight tcenter p10 cl999"><span class="icon icon-no-birthday"></span>最近都没有人过生日哦~</div>');
            return;
        }
        $('#js_birthdays').html(listHtml);
        if(uids.length>0){
            getListParam(uids);
        }
    }
    //获取生日祝福列表
    function getListParam(ids){
        $.ajax({
            url: i8_session.ajaxHost+'webajax/modules/getzan?',
            type: 'get',
            dataType: 'json',
            data:{uids: ids},
            success: function(result){
                if(result.Result){
                    var Items = result.ReturnObject;
                    if(Items.length <= 0){
                        return;
                    }
                    $("#js_birthdays").find("span.zhu-fu").each(function(){
                        var btnDom = $(this);
                        var zanDom = btnDom.nextAll('div.rt-birthday-persons');
                        var zanNames = zanDom.find("label");
                        var bid = btnDom.attr("bid");
                        for(var i=0; i<Items.length; i++){
                            if(bid == Items[i].ID){
                                var zanHtml = Items[i].SendUserNames.join(" ");
                                zanNames.html(zanHtml);
                                if(zanHtml.indexOf(i8_session.uname)>=0){
                                    btnDom.addClass("disabled");
                                }
                                zanDom.show();
                            }
                        }
                    });
                    //zanNames.append(' '+ cpec_si8_session);
                    //zanDom.show();
                }
            },
            error: function(e1,e2,e3){
            }
        });
    }
    //生日快乐
    $("#js_birthdays").on("click","span.zhu-fu",function(){
        var $this = $(this);
        var zanDom = $this.nextAll('div.rt-birthday-persons');
        var zanNames = zanDom.find("label");
        var bid = $this.attr("bid");
        var btime = $this.attr("btime");
        var names = zanNames.html();
        if(names.indexOf(i8_session.uname)>=0){
            return;
        }
        $(this).addClass("disabled");
        $.ajax({
            url: i8_session.ajaxHost+'webajax/modules/zan?',
            type: 'get',
            dataType: 'json',
            data:{bid: bid, btime: btime},
            success: function(result){
                if(result.Result){
                    zanNames.prepend(i8_session.uname+' ');
                    zanDom.show();
                }else{
                    i8ui.alert({title: result.Description, btnDom: $this});
                }
            },
            error: function(e1,e2,e3){
            }
        });
    });
    //赠送礼物

    var gifBox = null;
    $("#js_birthdays").on("click","span.send-gift",function(){
        var to_name=$(this).attr("to-name");
        var to_id=$(this).attr("to-id");
        if(gifBox){
            gifBox.close();
        }
        gifBox = i8ui.showbox({
            title:'送TA礼物',
            noMask: true,
            cont: '<div class="send-gift-boxer" id="send-gift-box"></div>'
        });
        var giftDom = $(gifBox);
        giftDom.css({top: $(this).offset().top, left: $(this).offset().left - 580});
        var blogPoster=require('../plugins/i8poster/js/i8poster');
        var postBloger=blogPoster({
            container:"#send-gift-box",
            enableHeader:false,
            header:{kankan:true,schedule:false,daily:false},
            kkConfig:{attachment:false,gift:true,face:true,topic:true,scope:false,defalultScope:2,attachid:"btn_attachment",attaContainer:"upContainer",attabtnContainer:"btn_attachment_container",kid:"ksn_gift",kkplaceholder:"送礼物想说点什么...",faceitem:"",appid:"460fdf91-952d-4bef-b3d7-51e975c3045e"},//appid,生日礼物
            postCompleted:function(data) {
                i8ui.write('礼物已发送成功！');
                gifBox.close();
            }
        });
        postBloger.init();
        postBloger.defAddTxt2Box("@"+to_name+" #祝"+to_name+"生日快乐#");
        postBloger.addUser2Cache({uid:to_id,uname:"@"+to_name,type:0,type:0});
        $(".kk-sub",giftDom).removeClass("post-btn-disabled");//默认开启发布按钮
    });
    function getZhufuimgs(imgs){
        var classhide = 'hide';
        if(imgs && imgs.length > 0){
            classhide = '';
        }else{
            imgs = [];
        }
        var imghtml = '<div class="rt-birthday-persons '+ classhide +'"><i class="spbg1 sprite-53 lt"></i><label></label><span class="rt-linj">◆<span>◆</span></span>';
        for(var i=0; i< imgs.length; i++){
            imghtml += '<img src="'+ imgs[i] +'">';
        }
        imghtml += '</div>';
        return imghtml;
    }
    getBirthdayList();

    /**
     * 热门话题(topic.js)
     */
    function getHotTopic(){
        $.ajax({
            url: i8_session.ajaxHost+'webajax/modules/topic?',
            type: 'get',
            dataType: 'json',
            cache: false,
            data:{topn:5},
            success: function(result){
                if(result.Result){
                    var listHtml = '';
                    if(result.ReturnObject.length <= 0){
                        $("#js_topic").html('<div class="fz14-weight tcenter p10 cl999"><span class="icon icon-no-topic"></span>最近都没有热门话题哦~</div>');
                        return;
                    }
                    for( var i = 0; i < result.ReturnObject.length; i++){
                        if(i>=5){
                            break;
                        }
                        var _item = result.ReturnObject[i];
                        var title= _item.Topic.replace(/\$%\$([^,]+).+?\$%\$/g,"@$1");
                        listHtml += '<li><a target="_blank" href="search?keyword='+ title +'#dynamic">'+ title +'</a></li>';
                    }
                    $('#js_topic').html(listHtml);
                }
            },
            error: function(e1,e2,e3){
            }
        });
    }
    getHotTopic();


    /**
     * 新手引导（原novice.js）部分
     */
    var usernav = i8_session.usernav;
    //var i8ui = require('../common/i8ui.js');
    var userLi = '';
    var userNum = 0;
    if(!usernav){
        usernav = {};
    }
    for(var key in usernav){
        if(usernav[key]){
            userNum++;
        }
    }
    if(userNum <= 5 ){
        $("#js_novice_status").html("初入i8职场");
    }else if( userNum > 5 && userNum <= 8){
        $("#js_novice_status").html("i8职场高手");
    }else if( userNum >= 9){
        $("#js_novice_status").html("i8职场之星");
    }
    userLi = ['<li class="'+ usernav.sethead +'"><a href="users/settings/header">设置头像<i class="spbg1 sprite-87"></i></a></li>',
            '<li class="'+ usernav.setinfo +'"><a href="users/settings/info">完善个人资料<i class="spbg1 sprite-87"></i></a></li>',
            '<li class="'+ usernav.addgroup +'"><a href="group/list">创建/加入一个群组<i class="spbg1 sprite-87"></i></a></li>',
            '<li class="'+ usernav.addblog +'"><a class="novice-add-kk">发一条图片侃侃<i class="spbg1 sprite-87"></i></a></li>',
            '<li class="'+ usernav.addwf +'"><a href="/workflow/process/list">发起一支流程<i class="spbg1 sprite-87"></i></a></li>',
            '<li class="'+ usernav.addreport +'"><a href="report#myreport">写一篇日报<i class="spbg1 sprite-87"></i></a></li>',
            '<li class="'+ usernav.adddoc +'"><a href="document">上传一篇文档<i class="spbg1 sprite-87"></i></a></li>',
            '<li class="'+ usernav.addtask +'"><a href="task#pageSize=10&pageIndex=1&pageType=1&">新建任务<i class="spbg1 sprite-87"></i></a></li>',
            '<li class="'+ usernav.adddaily +'"><a href="calendar#mycalendarview">创建日程<i class="spbg1 sprite-87"></i></a></li>'
    ]
    $("#js_novice_ul").html(userLi);
    //发一条图片侃侃
    $("#js_novice_ul").on("click","a.novice-add-kk",function(){
        i8ui.txtError($("#kk-content-ksn"));
    });

    /**
     * 我的任务（原 render_rpt.js）部分
     */
    var ajaxHost = i8_session.ajaxHost;
    //var i8ui = require('../common/i8ui');
    //require('../../stylesheets/task-tip.css')
    var renderRpt={
        //获取任务统计
        getUserRpt:function(options, callback){
            $.ajax({
                url: ajaxHost + 'webajax/task/getUserRpt',
                type: 'get',
                dataType: 'json',
                data: {options: options},
                success: function (data) {
                    if(data.Description){
                        i8ui.error(data.Description+' (获取任务统计)')
                    }else{
                        callback(data);
                    }
                }, error: function (error) {
                    callback(error);
                }
            });
        },
        renderRptHtml:function(targetUserID,dom){
            var $Name=i8_session.uname;
            if($(targetUserID).length>0){
                return;
            }
            template.helper('$getTodo',function(viewNum,doingNum,reviewNum){
                var str='<a target="_blank" href="'+i8_session.baseHost+'task" class="task-num">';
                str+=parseInt(viewNum)+parseInt(doingNum)+parseInt(reviewNum);
                str+='</a>';
                return str;
            })

            var task_tip_tpl=require('../../template/task/task_tip.tpl');
            renderRpt.getUserRpt({
                targetUserID:targetUserID
            },function(data){
                if(data.Result){
                    var $data=data.ReturnObject;
                    console.log(data)
                    $data.Name=$Name;
                    $data.baseHost=i8_session.baseHost;
                    $data.targetUserID=targetUserID;
                    $data.noClose=true;
                    var task_tip_render=template(task_tip_tpl);
                    var task_tip_html=task_tip_render($data);
                    $(dom).html(task_tip_html);
                }
            })
        },
        renderRpt:function(targetUserID,$Name,dom){
            clearTimeout(timer)
            if($(targetUserID).length>0){
                return;
            }
            template.helper('$getTodo',function(viewNum,doingNum,reviewNum){
                var str='<span class="task-num">';
                str+=parseInt(viewNum)+parseInt(doingNum)+parseInt(reviewNum);
                str+='</span>';
                return str;
            })
            var task_tip_tpl=require('../../template/task/task_tip.tpl');
            var timer=setTimeout(function(){
                if($(targetUserID).length>0){
                    return;
                }
                if($('.ct-ly').length>0){
                    $('.ct-ly').remove()
                }
                var tip_dielog=i8ui.showbox({
                    cont:'<div class="dielog-tip task-tip">\
                                <div class="ld-128-write" style="width:128px;height: 128px;margin-top: 30px;"></div>\
                            </div>',
                    btnDom:dom
                });
                $(tip_dielog).css({
                    'background':'none',
                    'box-shadow':'none',
                    'border':'none',
                    'margin-top':'244px'
                }).find('.dielog-close').on('click',function(){
                    tip_dielog.close();
                })
                renderRpt.getUserRpt({
                    targetUserID:targetUserID
                },function(data){
                    if(data.Result){
                        var $data=data.ReturnObject;
                        console.log(data)
                        $data.Name=$Name;
                        $data.targetUserID=targetUserID;
                        var task_tip_render=template(task_tip_tpl);
                        var task_tip_html=task_tip_render($data);
                        // $parent.append(task_tip_html)
                        //console.log(task_tip_html);
                        $(tip_dielog).find('.dielog-tip').replaceWith(task_tip_html);
                        $(tip_dielog).find('.dielog-close').on('click',function(){
                            tip_dielog.close();
                        })

                        /*$(window.tip_dielog).css({
                         top:dom.offset().top,
                         left:dom.offset().left
                         })*/
                    }
                })
            })
        }
    }
    renderRpt.renderRptHtml(i8_session.uid,'#taskrpt')

    /*打卡功能*/
    function punchcardInit(){
        var now=new Date();
        var $cday=$('.cday');
        var $date=$cday.next();
        var $klock=$('.klock')
        $klock.html(now.format('hh:mm'));
        $cday.html(now.format('yyyy-MM-dd'));
        $date.html('星期'+now.format('D','cn'));
        setInterval(function(){
            var now=new Date();
            $('.klock').html(now.format('hh:mm'));
            $cday.html(now.format('yyyy-MM-dd'));
            $date.html('星期'+now.format('D','cn'));
        },5000);

        $(document).on('click','#punchcard',function(){
            var $this=$(this);
            if($this.hasClass('disabled')){
                return false;
            }
            $this.addClass('disabled');
            $.ajax({
                url: i8_session.ajaxWfHost+'webajax/attendance_ajax/punchCard',
                type: 'post',
                dataType: 'json',
                cache: false,
                data:{options:{}},
                success: function(result){
                    $this.removeClass('disabled');
                    if(result.Code==0){
                        console.log(result);
                        rendPunch(result);
                        i8ui.write('打卡成功');
                    }else{
                        i8ui.error(result.Description);
                    }
                },
                error: function(e1,e2,e3){
                    $this.removeClass('disabled');
                }
            });
        })

        //打开记录
        $.ajax({
            url: i8_session.ajaxWfHost+'webajax/attendance_ajax/getAttendance',
            type: 'get',
            dataType: 'json',
            cache: false,
            data:{options:{Date:new Date().format('yyyy-MM-dd')}},
            success: function(result){
                console.log(result);
                if(result.Code==0){
                    rendPunch(result);
                }else{
                    $('.rb4-1-1 .rb4-2-1.first').html(result.Description  || ('ErrorCode:'+result.Code));
                }
            },
            error: function(e1,e2,e3){

            }
        });
        //渲染
        function rendPunch(result){
            if(!result.ReturnObject.Punchs){
                $('.no-punchoutbox').show();
                return;
            }
            $('.no-punchoutbox').hide();
            $('.first-punch').show();
            var firstPunch=result.ReturnObject.Punchs[0];
            $('.rb4-1-1 .first').html(new Date(firstPunch.PunchTime.replace(/-/g,'/')).format('hh:mm')  || ('Code:'+result.Code));
            $('.rb4-2-n .first').html(firstPunch.ClientType==1 ? firstPunch.IPAddress : firstPunch.LAddress);
            if(result.ReturnObject.Punchs.length>1){
                $('.last-punch').show();
                var lastPunch=result.ReturnObject.Punchs[result.ReturnObject.Punchs.length-1];
                $('.rb4-1-1 .last').html(new Date(lastPunch.PunchTime.replace(/-/g,'/')).format('hh:mm')  || ('Code:'+result.Code));
                $('.rb4-2-n .last').html(lastPunch.ClientType==1 ? lastPunch.IPAddress : lastPunch.LAddress);
            }
        }
    }
    punchcardInit();

    /**
    * 控件设置（原modules-set.js）部分*
    */
//    if(i8_session.portal == null || i8_session.portal == ""){
//        i8_session.portal = "managenovice,novice,calendar,taskrpt,members,birthday,topic,bbs,attendance";
//        //管理员引导、新手引导、我的日程、我的任务、新员工风采、生日祝福、热门话题、i8社区
//    }
    var mdSet = i8_session.portal || "";

    var $blockSetCont=$("#js_options_block");
    var setBlockDom = $("#js_block_set");

//    if((i8_session.utype.join(",")+",").indexOf("4,") >= 0){
//        $("#js_ismanger").show();
//    }

    function showBlockSetCont(cbk){
        var rtsize = $(document.body).outerWidth() - setBlockDom.offset().left -16;
        $blockSetCont.css({top: setBlockDom.offset().top, right: rtsize});
        $blockSetCont.show().stop().animate({
            'width':138
        },function(){
            $blockSetCont.removeClass('hide')
        })
    }
    function hideBlockSetCont(){
        $blockSetCont.stop().animate({
            'width':0
        },function(){
            $blockSetCont.addClass('hide').hide();
        })
        $("#js_block_set_list").height(0);
    }
    function ladingclick(){
        var contTimer=null;
        var contDom = $("#js_block_set");

        $("#js_home_rt_block .rt-block").hover(function(){
            clearTimeout(contTimer);
            var blockDoms = $("div.app-rt").find("div.true");

            var thisDom = $(this);
            if(blockDoms.index(thisDom) == 0){
                $("#js_block_setcont").find("span").removeClass("ban");
                $("#js_block_setcont").find('span.set-first,span.set-up').addClass("ban");
            }else if(blockDoms.index(thisDom) == (blockDoms.length - 1)){
                $("#js_block_setcont").find("span").removeClass("ban");
                $("#js_block_setcont").find('span.set-last,span.set-down').addClass("ban");
            }else{
                $("#js_block_setcont").find("span").removeClass("ban");
            }
            contDom.show().css({
                "opacity":1,
                "filter":"alpha(opacity=100)"
            });
            contDom.stop().animate({left: thisDom.offset().left + 251, top: thisDom.offset().top})
                .attr("showid",$(this).attr("id"));
            hideBlockSetCont();
        },function(){
            clearTimeout(contTimer)
            contTimer=setTimeout(function(){
                contDom.fadeOut();
                hideBlockSetCont();
            },1000)
            hideBlockSetCont();
        });
        $("#js_block_set,#js_options_block").mouseover(function(){
            clearTimeout(contTimer);
            $("#js_block_set").show();
        });
        $("#js_block_set,#js_options_block").mouseout(function(){
            clearTimeout(contTimer)
            contTimer=setTimeout(function(){
                $("#js_block_set").fadeOut();
                hideBlockSetCont();
            },1000)
        });

        $("#js_block_setcont").on('click','.set-show',function(){
            var blockSetDoms = $blockSetCont.find('div.block-set-op');
            if(mdSet.indexOf(":") >= 0){
                blockSetDoms.each(function(){
                    var tname = $(this).attr("name");
                    if(mdSet.indexOf(tname+":true")>=0){
                        $(this).removeClass("close");
                    }
                });
            }else{
                blockSetDoms.removeClass("close");
            }
            if($blockSetCont.hasClass('hide')){
                showBlockSetCont();
            }else{
                hideBlockSetCont();
            }
        });
        //上移
        $("#js_block_setcont").on('click','span.set-up',function(){
            if($(this).attr("class").indexOf("ban")>=0){
                return;
            }
            var thisDom = $("#" + $("#js_block_set").attr("showid"));
            var newDom = thisDom.clone(true);
            var prevDom = null;
            var trueDoms = $("#js_home_rt_block").find("div.true");
            trueDoms.each(function(i){
                if(this.id == thisDom.attr("id")){
                    prevDom = $(trueDoms[i-1]);
                    return false;
                }
            });
            thisDom.remove();
            prevDom.before(newDom);
            $("#js_block_set").fadeOut();
            upSet();
        });
        //下移
        $("#js_block_setcont").on('click','span.set-down',function(){
            if($(this).attr("class").indexOf("ban") >= 0){
                return;
            }
            var thisDom = $("#" + $("#js_block_set").attr("showid"));
            var newDom = thisDom.clone(true);
            var nextDom = null;
            var trueDoms = $("#js_home_rt_block").find("div.true");
            trueDoms.each(function(i){
                if(this.id == thisDom.attr("id")){
                    nextDom = $(trueDoms[i+1]);
                    return false;
                }
            });
            thisDom.remove();
            nextDom.after(newDom);
            $("#js_block_set").fadeOut();
            upSet();
        });
        //移动到最上面
        $("#js_block_setcont").on('click','span.set-first',function(){
            if($(this).attr("class").indexOf("ban") >= 0){
                return;
            }
            var thisDom = $("#" + $("#js_block_set").attr("showid"));
            var newDom = thisDom.clone(true);
            thisDom.remove();

            if(document.getElementById("js_invite_btn")){
                $("#js_invite_btn").after(newDom);
            }else{
                $("div.app-rt").prepend(newDom);
            }
            $("#js_block_set").fadeOut();
            upSet();
        });
        //最下移
        $("#js_block_setcont").on('click','span.set-last',function(){
            if($(this).attr("class").indexOf("ban") >= 0){
                return;
            }
            var thisDom = $("#" + $("#js_block_set").attr("showid"));
            var newDom = thisDom.clone(true);
            thisDom.remove();
            $("div.app-rt").append(newDom);
            $("#js_block_set").fadeOut();
            upSet();
        });
        //打开或关闭
        $blockSetCont.on('click','.block-set-op',function(){
            var this$ = $(this);
            if(setForm() <=2 && this$.attr("class").indexOf("close")<0){
                i8ui.alert({title:"亲，别在关闭了！",btnDom: this$});
                return;
            }
            var appOption = this$.attr("name");
            if(this$.attr("class").indexOf("close") >=0 ){
                this$.removeClass("close");
                $("#"+appOption).addClass("true");
            }else{
                this$.addClass("close");
                $("#"+appOption).removeClass("true");
            }
            upSet();
        });
        $("#js_block_setbtn").click(function(){
            $("#js_block_set_list").height(178);
        });
    }
    function setForm(){
        return $("div.block-set-cont").find("div").not('.close').length;
    }
    ladingclick();
    function updatePortal(callback){
        var mds = $('div.app-rt').find('div.rt-block');
        var caChearrs = mdSet.split(",");
        var newAddArrs = [];
        mds.each(function(i){
            var v = $(this).attr('id');
            if(mdSet.indexOf(v)>= 0){
                newAddArrs.push(v);
            }
        });
        var newAstring = newAddArrs.join(",");
        for(var i=0; i<caChearrs.length; i++){
            if(newAstring.indexOf(caChearrs[i]) < 0){
                newAstring += (","+caChearrs[i]);
            }
        }
        if(newAddArrs.length <= 0 ){
            i8ui.error("最少要留一个组件");
            return;
        }
        upSet(newAstring,callback);
    }
    function upSet(callback){
        var newAstring = '';
        $("#js_home_rt_block").find("div.rt-block").each(function(){
            var $this = $(this);
            newAstring += this.id +":"+($this.attr("class").indexOf("true")>=0)+",";
        });
        //newAstring = 'calendar:true,members:true,birthday:true,topic:true,novice:true,taskrpt:true,managenovice:true,attendance:true'
        $.ajax({
            url: i8_session.ajaxHost+'webajax/modules/update-set',
            type: 'get',
            dataType: 'json',
            cache: false,
            data:{portal: newAstring},
            success: function(result){
                if(result.Result){
                    i8ui.alert({title:"更新成功",type:2, btnDom: $("#js_block_setcont")});
                }else{
                    i8ui.error(result.Description);
                }
            },
            error: function(e1,e2,e3){
            }
        });
    }
});
