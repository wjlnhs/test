define(function (require, exports) {
    require('../../javascripts/common/jquery-ui.min.js');
    /*build(remove.start)*/
    require('../../javascripts/plugins/i8scrollbar/mscrollbar.js');
    require('../../javascripts/plugins/i8scrollbar/css/mscrollbar.css');
    /*build(remove.end)*/
    var roomlist=require('../../template/calendar/roomlist.tpl');
    var roomrender=template(roomlist)
    var i8ui=require('../../javascripts/common/i8ui');
    var util=require('../../javascripts/common/util');
    var addcalendar=require('./addcalendar');
    var common=require('./common');
    var timearr=['0:00','0:30','1:00','1:30','2:00','2:30','3:00','3:30','4:00','4:30',
        '5:00','5:30','6:00','6:30','7:00','7:30','8:00','8:30','9:00','9:30',
        '10:00','10:30','11:00','11:30','12:00','12:30','13:00','13:30','14:00','14:30',
        '15:00','15:30','16:00','16:30','17:00','17:30','18:00','18:30','19:00','19:30',
        '20:00','20:30','21:00','21:30','22:00','22:30','23:00','23:30'];
    var weekarr=['周日','周一','周二','周三','周四','周五','周六'];

    var timepanel=$('#timepanel');//会议室详细列表

    //重置table功能
    var resetTable=function(){
        var time_zone=$("#time_zone");
        var tableheight=parseInt(time_zone.find('.table-content').css('height'))||287;
        var time_title = $('#time_title');
        var day_left = $('#day_left');

        var setTopLeft = function () {
            var t_content = $('#time_zone').find('.mCSB_container');
            time_title.css('left', t_content.css('left'));
            day_left.css('top', t_content.css('top'))
        }

        time_zone.mCustomScrollbar({
            scrollButtons: {
                enable: false
            },
            callbacks: {
                onScroll: function () {
                }
            },
            setHeight:(tableheight>410?410:tableheight),
            scrollInertia: 0,
            theme: "one-light-thin",
            axis: 'yx',
            autoHideScrollbar: true,
            autoDraggerLength: true,
            autoExpandScrollbar: true,
            callbacks: {
                whileScrolling: function () {
                    setTopLeft();
                }
            }
        });

        time_zone.find('tr').selectable({
                start: function (event, ui) {
                    time_zone.find('tr').find('td').removeClass('ui-selected');
                },
                stop:function(event, ui){
                    var _this=$(this);
                    if(_this.find('.hasmeeting.ui-selected').length>0){
                        time_zone.find('tr').find('td').removeClass('ui-selected');
                        i8ui.error('请勿选择已会议时间段！');
                        return;
                    }
                    var start_time=_this.find('td.ui-selected').eq(0).attr('time');

                    var index=timearr.indexOf(_this.find('td.ui-selected').last().attr('time'));
                    var end_time=timearr[index+1]||timearr[0];
                    var options={
                        title:'新增会议',
                        data:{
                            addDate:_this.attr('date'),
                            addStartTime:start_time.replace(/^\d:/,function($1){return 0+$1}),
                            addEndTime:end_time.replace(/^\d:/,function($1){return 0+$1}),
                            MettingRoomID:$('#roomtiles').find('a.active').attr('rid'),
                            Type:2
                        }
                    }
                    addcalendar.openWindow(options,function(type){
                        getRoomByDate();
                    },function(){
                        time_zone.find('tr').find('td').removeClass('ui-selected');
                    });
                }
            }
        );
        //$('#time_zone').find('.mCSB_container').css('left','-976px');
        time_title.css('left','-976px');
        time_zone.mCustomScrollbar("scrollTo","-976px");
    }

    //获取当天
    var getToday=function(){
        var date=new Date();
        return {timezone:[{datetime:util.dateformat(date,'yyyy-MM-dd'),day:date.getDay()}],timearr:timearr,weekarr:weekarr};
    }

    //转化成时间格式
    var getDate=function(value){
        var date=new Date(value);
        if(date=='Invalid Date'||isNaN(date)){
            date= new Date(value.replace(/-/g,'/'));
        }
        return date;
    }

    //获取开始日期到结束日期
    var getDayArray=function(beginTime,endTime){
        var gettime=[];
        var beginDay=getDate(beginTime);
        var year=beginDay.getFullYear();
        var month=beginDay.getMonth();
        var date=beginDay.getDate();
        var endDay=getDate(endTime);
        var day_length=(endDay.getTime()-beginDay.getTime())/86400000;
        for(var i=0;i<=day_length;i++){
            var _beginDay=new Date(year,month,date+i);
            gettime.push({datetime:util.dateformat(_beginDay,'yyyy-MM-dd'),day:_beginDay.getDay()});
        }
        return {timezone:gettime,timearr:timearr,weekarr:weekarr};
    }

    //获取当前周
    var getWeek=function(){
        var date=new Date();
        var year=date.getFullYear();
        var month=date.getMonth();
        var day=date.getDay()||7;
        var date=date.getDate();
        var getweek=[];
        for(var i=1;i<=7;i++){
            var beginDate=new Date(year,month,date-day+i);
            getweek.push({datetime:util.dateformat(beginDate,'yyyy-MM-dd'),day:beginDate.getDay()})
        }
        return {timezone:getweek,timearr:timearr,weekarr:weekarr};
    }

    //获取当前月
    var getMonth=function(){
        var date=new Date();
        var year=date.getFullYear();
        var month=date.getMonth();
        var day=date.getDay();
        var date=date.getDate();
        var endTime=new Date(year,month+1,0).getDate();
        var getmonth=[];
        for(var i=1;i<=endTime;i++){
            var _date=new Date(year,month,i);
            getmonth.push({datetime:util.dateformat(_date,'yyyy-MM-dd'),day:_date.getDay()})
        }
        return {timezone:getmonth,timearr:timearr,weekarr:weekarr};
    }

    //获取所有会议室名称
    var getAllRoom=function(){
        common.ajax.getAllRoom(function(data){
            if($.type(data)=='object'){
                if(data.Result){
                    var _html = template('roomtilestemplate', data);
                    if(!_html){
                        $('#roomtiles').html('<span class="red l-h36 m-l15">没有会议室,请创建会议室！</span>');
                    }else{
                        $('#roomtiles').html(_html);
                        getRoomByDate()
                    }
                }
            }else{

            }
        });
    }

    //获取选择会议室使用情况
    var getRoomByDate=function(){
        var options={
            mettingRoomID:$('#roomtiles').find('a.active').attr('rid'),
            mettingStartDate:$('#startTime').val(),
            mettingEndDate:$('#endTime').val()
        }
        common.ajax.getRoomByDate(options,function(data){
            if($.type(data)=='object'){
                if(data.Result){
                    var retdate=getDayArray(options.mettingStartDate,options.mettingEndDate);
                    var arr=data.ReturnObject;
                    var _html=$(roomrender(retdate));
                    for(var i= 0,len=arr.length;i<len;i++){
                        var _td=_html.find('tr[date='+arr[i].MettingDay+']').find('td');
                        var _start=timearr.indexOf(arr[i].StartTime);
                        var _end=timearr.indexOf(arr[i].EndTime);
                        _td.eq(_start).nextUntil(_td.eq(_end)).addClass('hasmeeting');
                        _td.eq(_start).addClass('hasmeeting').append('<div style="height: 100%;position: relative;"><div class="showperson" style="width:'+(_end-_start+1)*60+'px">发起人：'+arr[i].CreaterName+'</div></div>');
                        _td.eq(_end).addClass('hasmeeting');
                    }
                    timepanel.html(_html);
                    resetTable();
                    //新手导航
                    try{lead && lead.meeting()}catch (e){}//引导
                }
            }

        });
    }

    var weektime=getWeek();
    $('#startTime').val(weektime.timezone[0].datetime).setTime({
        maxDate:'#F{$dp.$D(\'endTime\');}',
        minDate:'#F{$dp.$D(\'endTime\',{d:-30});}',
        onpicked:function(dp){
            getRoomByDate();
            selectDate.find('a').removeClass('active');
        }
    });

    $('#endTime').val(weektime.timezone[weektime.timezone.length-1].datetime).setTime({
        minDate:'#F{$dp.$D(\'startTime\');}',
        maxDate:'#F{$dp.$D(\'startTime\',{d:30});}',
        onpicked:function(dp){
            getRoomByDate();
            selectDate.find('a').removeClass('active');
        }
    });

    var selectDate=$('#selectDate');//今天 本周 本月


    //注册点击今天本周本月
    selectDate.on('click','a',function(){
        var _this=$(this);
        selectDate.find('a').removeClass('active');
        _this.addClass('active');
        var retdate;
        switch(_this.attr('type')){
            case 'day':
                retdate=getToday();
                break;
            case 'week':
                retdate=getWeek();
                break;
            case 'month':
                retdate=getMonth();
                break;
        }
        $('#startTime').val(retdate.timezone[0].datetime)
        $('#endTime').val(retdate.timezone[retdate.timezone.length-1].datetime)
        getRoomByDate();
    });


    var roomtiles=$('#roomtiles');
    roomtiles.on('click','a',function(){
        roomtiles.find('a').removeClass('active');
        var _this=$(this).addClass('active');
        getRoomByDate();
    });

    exports.getRoom = function (isLoaded) {
        if(isLoaded){
            getRoomByDate();
        }else{
            getAllRoom();
        }
    }
    $('#refreshBtn').on('click',function(){
        getRoomByDate();
    });
});