/**
*本文件逐步弃用，已转移到right-controls.js里
*/
define(function(require, exports){
    var i8ui = require('../common/i8ui');
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

});