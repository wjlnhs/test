/**
 * 考勤视图
 */
define(function (require, exports) {
    var i8ui=require('../common/i8ui.js');
    var ta_attendance=$('#ta_attendance');
    var fw_page=require('../common/fw_pagination.js');
    var seefile=require('../common/seefile');
    var clearDielog='';

    $('#vacation>.hide').removeClass('hide');
    $('#vacation .ld-64-gray').hide();
    var choosedate=10;

    var pageSize=10;
    var calendarSource={};



    var attendancecase_tbody_tpl='{if (List || []).length==0}\
    <tr>\
        <td colspan="999"><div class="noresult">\
                        <div class="no-resulticon noresult-icon"></div>\
                            <div class="noresult-title">暂无异常数据</div>\
                        </div></td>\
    </tr>\
    {else}\
    {each List}\
    <tr>\
        <td>{$setClock2($value.ScheduleDate)}</td>\
        <td>{$setPunchLabelOnly($value.PunchLabel)}</td>\
        <td>{$setPunchLabelOnly($value.ModifiedLabel)}</td>\
    </tr>\
    {/each}\
    {/if}';

    var attendance_dielog_notWorkingDay_tpl='<div class="mnews2-1">\
        <div class="lblock1 lt" style="font-size: 20px;color: red;">\
        休 - 休\
    </div>\
    <div class="rblock1 lt">\
        <div class="rblock1-1">\
            <div class="rblock1-1-1">\
                <div class="lt mnfont-1">\
                </div>\
            </div>\
            <div class="rblock1-1-2">\
            </div>\
        </div>\
        <div class="rblock1-2">\
            <div class="rblock1-2-2">\
            </div>\
        </div>\
    </div>\
    </div>'
    var attendance_dielog_tpl='<div id="attendance_dielog">\
        <div class="mynews">\
        <div class="mnews-2">\
                {each Periods}\
            <div class="mnews2-1">\
                <div class="lblock1 lt" style="font-size: 16px;">{$setClock($value.ClockIn)} - {$setClock($value.ClockOut)}</div>\
                <div class="rblock1 lt">\
                    {if $value.PunchIn}\
                    <div class="rblock1-1">\
                        <div class="rblock1-1-1">\
                            <div class="lt mnfont-1">\
                                    <span>签到 </span>{$setPunchLabel($value.PunchIn)} {$setmodifytxt($value.PunchIn)} {$setPhotos($value.PunchIn)}\
                            </div>\
                        </div>\
                        <div class="rblock1-1-2">\
                                {$setPunchInfo($value.PunchIn.ClientType,$value.PunchIn)}\
                        </div>\
                        {if $value.PunchIn.PaintRed && $value.PunchIn.ProcInstId==0}\
                        <span class="btn-blue-h26 rt clearbtn">清除异常</span>\
                        {/if}\
                    </div>\
                    {/if}\
                    {if $value.PunchOut}\
                    <div class="rblock1-2">\
                        <div class="rblock1-2-1">\
                                <span>签退 </span>{$setPunchLabel($value.PunchOut)} {$setmodifytxt($value.PunchOut)} {$setPhotos($value.PunchOut)}\
                        </div>\
                        <div class="rblock1-2-2">\
                                {$setPunchInfo($value.PunchOut.ClientType,$value.PunchOut)}\
                        </div>\
                        {if $value.PunchOut.PaintRed && $value.PunchOut.ProcInstId==0}\
                        <span class="btn-blue-h26 rt clearbtn">清除异常</span>\
                        {/if}\
                    </div>\
                    {/if}\
                </div>\
            </div>\
                {/each}\
        </div>\
        {if Vacations}\
        {each Vacations}\
         <div class="mnews-border" style="padding-right: 2px;">\
         <a style="color: #6F7276;font-size: 13px;" target="_blank" href="{$setVacationsLink($value.ProcUrl,$value.ProcInstId)}"><span style="display: inline-block;width: 130px;">假期类型：{$value.Label}</span>{if $value.VacationType==2}<span class="m-r15">到岗时间：{$setClock3($value.BeginTime)}</span>销假时长：{$value.HourSpan}小时{else}<span class="m-r15">开始时间：{$setClock3($value.BeginTime)}</span>结束时间：{$setClock3($value.EndTime)}{/if}</a>\
         </div>\
        {/each}\
        {/if}\
        <div class="mnews-border">\
        <div class="lanse lt">共有<span class="blue">{$getPunchsLen(Punchs)}</span>条打卡记录</div>\
        <div id="allchecklist" class="clear" style="line-height: 24px;">\
    {each Punchs}\
    {if $index<4}\
        <div>{$renderCheckList($value)}</div>\
        {/if}\
            {if $index==4}\
                <div id="morechecklist" style="display: none;">\
                            {each Punchs}\
                                {if $index>=4}\
                    <div>{$renderCheckList($value)}</div>\
                                {/if}\
                            {/each}\
                </div>\
                <div class="clear"></div>\
                <div id="morecheckbtn" class="in-bl" style="cursor: pointer;"><i class="icon icon-down-solid"></i><span class="moretxt">查看更多</span></div>\
                        {/if}\
                    {/each}\
            </div>\
                </div>\
                </div>\
                </div>';

    //根据日期获取年月日下拉列表
    var getYearDay=function(date){
        var retjson={
            year:[],
            day:[]
        }
        var _date=date||new Date();
        var _year=_date.getFullYear();
        var _endDate=new Date(_date.getFullYear(),_date.getMonth()+1,0).getDate();
        for(var i=1;i<=_endDate;i++){
            retjson.day.push(i);
        }
        for(var j=_year+5;j>_year-5;j--){
            retjson.year.push(j);
        }
        return retjson;
    }

    var choosedateTpl='<div>\
        <div class="year-panel">\
    {each year}\
    <span value="{$value}">{$value}</span>\
    {/each}\
    </div>\
        <div class="month-panel">\
            <span value="1">1</span>\
            <span value="2">2</span>\
            <span value="3">3</span>\
            <span value="4">4</span>\
            <span value="5">5</span>\
            <span value="6">6</span>\
            <span value="7">7</span>\
            <span value="8">8</span>\
            <span value="9">9</span>\
            <span value="10">10</span>\
            <span value="11">11</span>\
            <span value="12">12</span>\
        </div>\
        <div class="day-panel">\
            {each day}\
            <span value="{$value}">{$value}</span>\
            {/each}\
        </div>\
    </div>'
    //初始化时间标题
    var initTitle=function(){
        ta_attendance=$('#ta_attendance');
        var _date=new Date(ta_attendance.fullCalendar('getDate'));
        var chooselist=$(template.compile(choosedateTpl)(getYearDay(_date)));
        var _yearhtml='<div class="year-panel date-panel">'+chooselist.find('.year-panel').html()+'</div>';
        var _monthhtml='<div class="month-panel date-panel">'+chooselist.find('.month-panel').html()+'</div>';
        var _dayhtml='<div class="day-panel date-panel">'+chooselist.find('.day-panel').html()+'</div>';
        var view=ta_attendance.fullCalendar('getView');
        var moment = ta_attendance.fullCalendar('getDate');
        var _titleStr='';
        var _title=ta_attendance.find('.fc-center h2');
        switch (view.name){
            case 'month':_titleStr='<span class="year"><span>'+moment.format('YYYY')+'</span>'+_yearhtml+'</span>  年 '+'<span class="month"><span>'+moment.format('M')+'</span>'+_monthhtml+'</span>  月';break;
            case 'agendaWeek':_titleStr='<span class="year"><span>'+moment.format('YYYY')+'</span>'+_yearhtml+'</span>  年 '+'<span class="month"><span>'+moment.format('M')+'</span>'+_monthhtml+'</span>  月 '+'<span class="day"><span>'+moment.format('D')+'</span>'+_dayhtml+'</span>  日';break;
            case 'agendaDay':_titleStr='<span class="year"><span>'+moment.format('YYYY')+'</span>'+_yearhtml+'</span>  年 '+'<span class="month"><span>'+moment.format('M')+'</span>'+_monthhtml+'</span>  月 '+'<span class="day"><span>'+moment.format('D')+'</span>'+_dayhtml+'</span>  日';break;
        }
        _title.html(_titleStr);
    }

    var formatData=function(data){
        var rtobj=[];
        var lableobj=[];//假期
        _.map(data.ReturnObject,function(item){
            var ScheduleDate=item.ScheduleDate;
            var ScheduleDateFomate=ScheduleDate.split(' ')[0];
            _.map(item.Periods,function(item2,index){
               // console.log(new Date(new Date(ScheduleDateFomate.replace(/-/g,'/')).setMinutes(60-index)))
                if(item2){
                    if(!((item2.PunchIn==null) && (item2.PunchOut==null))){//判断PaintText都不为null;
                        rtobj.push({
                            id:ScheduleDateFomate.replace(/-/g,''),
                            title:'<span class="m-l5 '+((item2.PunchIn && item2.PunchIn.PaintRed) ? "red" : "black")+'">'+(item2.PunchIn ? item2.PunchIn.PaintText : '')+'</span>'+'<span class="black">~</span>'+'<span class="'+((item2.PunchOut && item2.PunchOut.PaintRed) ? "red" : "black")+'">'+(item2.PunchOut ? item2.PunchOut.PaintText : '')+'</span>'+'',
                            allDay:false,
                            start:new Date(new Date(ScheduleDateFomate.replace(/-/g,'/')).setMinutes(index)),
                            end:new Date(new Date(ScheduleDateFomate.replace(/-/g,'/')).setMinutes(index)),
                            nativeData:item,
                            className: 'nobackground'
                        })
                    }

                }
            })
            if(item.Labels){
                lableobj.push({
                    title:item.Labels,
                    nativeData:item,
                    start:new Date(new Date(ScheduleDateFomate.replace(/-/g,'/')).setMinutes(59)),
                    className: 'nobackground black'
                });
            }

        })
        var events=[];
//        var rtobj=[{
//                id:'123',//	可选，事件唯一标识，重复的事件具有相同的id
//                title:'测试',	//必须，事件在日历上显示的title
//                allDay:false,	//可选，true or false，是否是全天事件。
//                start:'2015-10-10',	//必须，事件的开始时间。
//                end	:'2015-10-10',//可选，结束时间。
//                className:'test'
//        }];
        if(rtobj&&rtobj.length>0){
            var len=rtobj.length;
            for(var i=0;i<len;i++){
                var obj={
                    id:rtobj[i].id,//	可选，事件唯一标识，重复的事件具有相同的id
                    title:rtobj[i].title,	//必须，事件在日历上显示的title
                    allDay:false,	//可选，true or false，是否是全天事件。
                    start:rtobj[i].start,	//必须，事件的开始时间。
                    end	:rtobj[i].end,//可选，结束时间。
                    nativeData:rtobj[i].nativeData,
                    className:rtobj[i].className	//指定事件的样式。
                }
                events.push(obj);
            }
        }
        for(var i=0;i<lableobj.length;i++){
            events.push(lableobj[i]);
        }

        return events;
    }

    //初始化选择时间
    var initChooseDate=function(){
        ta_attendance=$('#ta_attendance');
        ta_attendance.on('click','.fc-center .year,.fc-center .month,.fc-center .day',function(){
            var _this=$(this);
            var ishidden=_this.find('div').is(':hidden');
            ta_attendance.find('.fc-center .year,.fc-center .month,.fc-center .day').removeClass('up').find('div').slideUp();
            if(ishidden){
                _this.addClass('up').find('div').slideDown();
            }else{
                _this.removeClass('up').find('div').slideUp()
            }
            return false;
        });
        ta_attendance.on('click','.fc-center h2 div span',function(){
            var _this=$(this);
            var _parent=_this.parents('.date-panel');
            if(_parent.hasClass('year-panel')){
                _this.parents('.year').find('>span').html(_this.attr('value'));
            }else if(_parent.hasClass('month-panel')){
                _this.parents('.month').find('>span').html(_this.attr('value'));
            }else if(_parent.hasClass('day-panel')){
                _this.parents('.day').find('>span').html(_this.attr('value'));
            }

            ta_attendance.fullCalendar('gotoDate',new Date(ta_attendance.find('.fc-center .year').find('>span').html(),ta_attendance.find('.fc-center .month').find('>span').html()-1,ta_attendance.find('.fc-center .day').find('>span').html()||1));
            initTitle();
        })
    }

    var openWindow=function(segs){
        console.log(segs);
    };

    ///////////////设置template//////////////////////////////////////
    //处理说明模板
    template.helper('$setmodifytxt',function(item){
        var punchLableArr=['缺卡','正常','补卡','迟到','早退','位置异常','IP异常','外勤'];
        var result='';
        if(item.ModifiedLabel!=-1){
            result=new Date(item.ModifyTime.replace(/-/g,'/')).format('yyyy-MM-dd')+' 由'+item.ModifyUserName+'变更为'+punchLableArr[item.ModifiedLabel]
        }
        return result;
    });
    //考勤图片模板
    template.helper('$setPhotos',function(item){
        $photoHtml='';
        if(item && item.Photos){
            var Photos=item.Photos;
            if(Photos && Photos.length!=0){
                var $photoHtml=$('<div class="photohide" style="display: none;"></div>');
                $photoHtml.html(seefile.ks.getDocHtml(Photos,true,null,true));
                return '<span class="photospan blue" style="cursor: pointer;">照片</span>'+$photoHtml[0].outerHTML;
            }
        }
        return $photoHtml;
    });
    //设置签到时间（09:00:00）
    template.helper('$setClock',function(time){
        return new Date(time.replace(/-/g,'/')).format('hh:mm')
    })
    //设置签到时间（2015-10-01）
    template.helper('$setClock2',function(time){
        return time.split(' ')[0]
    })
    //设置签到时间（2015年10月01日12：00）
    template.helper('$setClock3',function(time){
        return new Date(time.replace(/-/g,'/')).format('yyyy年MM月dd日 hh:mm');
    })
    //设置假期链接http://hvming.i8s.cn/workflow/process/page/routecustom?procInstId=100000008397098
    template.helper('$setVacationsLink',function(ProcUrl,linkid){
        return i8_session.wfbaseHost+ProcUrl.replace('/','')+'?procInstId='+linkid;
    })
    //获取打卡条数
    template.helper('$getPunchsLen',function(Punchs){
        return Punchs ? Punchs.length : 0;
    })

    //map打卡状态
    var punchLableArr=['缺卡','正常','补卡','迟到','早退','位置异常','IP异常','外勤'];
    //map打卡状态
    template.helper('$setPunchLabelOnly',function(PunchLabel){
        if(PunchLabel==-1){
            return '未处理';
        }else{
            return punchLableArr[PunchLabel];
        }

    })

    template.helper('$setmodifytxt',function(item){
        var punchLableArr=['缺卡','正常','补卡','迟到','早退','位置异常','IP异常','外勤'];
        var result='';
        if(item.ModifiedLabel!=-1){
            result=new Date(item.ModifyTime.replace(/-/g,'/')).format('yyyy-MM-dd')+' 由'+item.ModifyUserName+'变更为'+punchLableArr[item.ModifiedLabel]
        }
        return result;
    })
    var  renderCaseList=function(pageIndex,_month,_year,userID){
        i8ui.render_loading_mid_w('#attendancecase_tbody');
        var ops={options:{unhandled:true,Month:_month,Year:_year,pageIndex:pageIndex,pageSize:pageSize,userID:userID || i8_session.uid}};
        $.ajax({
            url: i8_session.ajaxWfHost+'webajax/attendance_ajax/getAttendanceCase',
            type: 'get',
            dataType: 'json',
            cache: false,
            data:ops,
            success: function(data){
                if(data.Code==0){
                    var html = template.compile(attendancecase_tbody_tpl)(data);
                    $('#attendancecase_tbody').html(html);
                    var tatol=data.Total;
                    //控制分页
                    if(tatol<=pageSize){
                        $("#js_cement_caselist_page_panl").html("");
                    }
                    fw_page.pagination({
                        ctr: $("#js_cement_caselist_page_panl"),
                        totalPageCount: tatol,
                        pageSize: pageSize,
                        current: pageIndex,
                        fun: function (new_current_page,containers) {
                            renderCaseList(new_current_page,_month,_year,userID);
                        }, jump: {
                            text: '跳转'
                        }
                    });
                    console.log(data)
                    //rendPunch(result);
                }else{
                    i8ui.error(data.Description);
                }
            },
            error: function(e1,e2,e3){

            }
        });
    }

    var renderDielog=function(date){
        template.helper('$setPunchLabel',function(Periods){
            var PaintText=Periods.PaintText;
            var PunchLabel=Periods.PunchLabel;
            var isRed=Periods.PaintRed ? 'red' : '';
            var _html='';
            switch (PunchLabel){
                case 0:
                    _html='<span class="'+isRed+'">缺卡</span>';
                    break;
                case 1:
                    _html='<span class="'+isRed+'">正常 </span><span>'+PaintText+'</span>';
                    break;
                case 2:
                    _html='<span class="'+isRed+'">补卡 </span>';
                    break;
                case 3:
                    _html='<span class="'+isRed+'">迟到 </span><span>'+PaintText+'</span>';
                    break;
                case 4:
                    _html='<span class="'+isRed+'">早退 </span><span>'+PaintText+'</span>';
                    break;
                case 5:
                    _html='<span class="'+isRed+'">位置异常 </span>';
                    break;
                case 6:
                    _html='<span class="'+isRed+'">IP异常 </span>';
                    break;
                case 7:
                    _html='<span class="'+isRed+'">外勤</span>';
                    break;
            }
            return _html;
        })
        //设置签到信息(电脑端 - 222.73.202.251)
        template.helper('$setPunchInfo',function(ClientType,Punch){
            var _html='';
            switch (ClientType){
                case 0:
                    _html='';
                    break;
                case 1:
                    _html='<span>电脑端-</span><span>'+Punch.IPAddress+'</span>';
                    break;
                case 2:
                    _html='<span>移动端-</span><span>'+Punch.LAddress+'</span><span class="fakea m-l20 point rspoint" Lat="'+Punch.Lat+'" Lng="'+Punch.Lng+'" LAddress="'+Punch.LAddress+'">地理位置</span>';
                    break;
                case 3:
                    _html='<span>移动端-</span><span>'+Punch.LAddress+'</span><span class="fakea m-l20 point rspoint" Lat="'+Punch.Lat+'" Lng="'+Punch.Lng+'" LAddress="'+Punch.LAddress+'">地理位置</span>';
                    break;
            }
            return _html;
        })
        template.helper('$renderCheckList',function(Punch){
            if(!Punch || !Punch.PunchTime){
                return;
            }
            var time=new Date(Punch.PunchTime.replace(/-/g,'/')).format('hh:mm');
            var type=Punch.ClientType==1 ? '电脑端：' : '手机端：';
            var address=Punch.ClientType==1 ? Punch.IPAddress : Punch.LAddress;
            return time+' '+type+' '+address
        })
        var _html = template.compile(attendance_dielog_tpl)(date.nativeData);
        var _titleName=date.nativeData.ScheduleName;
        var dielog=i8ui.showbox({
            title:_titleName,
            cont:_html
        })
        if(!date.nativeData.IsWorkingDay){
            $(dielog).find('.mnews-2').html( attendance_dielog_notWorkingDay_tpl)
        }
        $(dielog).find('.mncont-3').on('click',function(){
            dielog.close();
        })
        $(dielog).on('click','#morecheckbtn',function(){
            var $i=$(this).find('i');
            if($i.hasClass('icon-up')){
                $(this).find('.moretxt').text('查看更多');
            }else{
                $(this).find('.moretxt').text('收起');
            }
            $i.toggleClass('icon-up');

            $('#morechecklist').slideToggle()
        })
    }
    //初始化日历控件
    var initCalendar=function(uid,isForWorkflow){
        if(i8_session.ability){

        }
        ta_attendance=$('#ta_attendance').addClass('rt-block-cont');
        if(isForWorkflow){
            ta_attendance.addClass('disablehover') ;
        }
        ta_attendance.fullCalendar({
            //头部显示
            header: {
                left: '',//今天
                center: 'prev title next',//上  时间  下
                right: '' //月 周 日
            },
            //列格式
            columnFormat:{
                month: 'ddd',
                week: "M 月 D 日",
                day: 'YYYY 年 M 月  D 日 dddd'
            },
            dayPopoverFormat:'ddd ，M月D日',
            defaultView:'month',//month,agendaDay,agendaWeek
            //时间格式
            timeFormat:'H:mm',
            timezone:'local',
            firstDay:1,
            //title的时间格式
            titleFormat: {
                month: 'YYYY 年 M 月',
                week: "YYYY 年 M 月 D 日",
                day: 'YYYY 年 M 月  D 日'
            },
            contentHeight:450,
            monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
            monthNamesShort: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'],
            dayNames: ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
            dayNamesShort: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
            //按钮文字
            buttonText:{
                prev:'<',
                next:'>',
                prevYear: '去年',
                nextYear: '明年',
                today:'今天',
                curWeek:'本周',
                curMonth:'本月',
                month:'月',
                week:'周',
                day:'日'
            },
            //默认日期
            editable: false,
            eventLimit: true, // allow "more" link when too many events
            selectable: true,
            selectHelper: true,
            //拖动透明度
            dragOpacity:{
                agenda:.5 ,//对于agenda试图
                '':.5 //其他视图
            },
            eventConstraint:{
                start: '00:00', // a start time (10am in this example)
                end: '24:00'
            },
            selectConstraint:{
                start: '00:00', // a start time (10am in this example)
                end: '24:00'
            },
            weekMode:'liquid',
            allDaySlot:false,//在agenda视图模式下，是否在日历上方显示all-day(全天)
            allDayText:'任务',//定义日历上方显示全天信息的文本
            axisFormat:'H:mm',//设置日历agenda视图下左侧的时间显示格式，默认显示如：5:30pm
            firstHour:6,//当切换到agenda时，初始滚动条滚动到的时间位置，默认在6点钟的位置
            slotEventOverlap:false,
            //是否从缓存信息获取event。比如从月视图切换到周视图。
            lazyFetching:false,
            //选择拖动时间
            //数据
            events:function(start,end,timezone, callback){
                initTitle();
                var _start=start.format('YYYY-MM-DD');
                var _end=end.format('YYYY-MM-DD');

                //var _titleTime=new Date(ta_attendance.fullCalendar('getView').title.replace(/ /g,'').replace(/[年|月]/g,'/')+1);
                var _titleTime=new Date(start.format('YYYY/MM/DD'));

                _titleTime.setDate(_titleTime.getDate()+10);
                console.log(_titleTime)
                var _month=_titleTime.getMonth()+1;
                var _year=_titleTime.getFullYear();
                //alert(_start+','+_end);
                $.ajax({
                    url: i8_session.ajaxWfHost+'webajax/attendance_ajax/getAttendanceMonthly',
                    type: 'get',
                    dataType: 'json',
                    cache: false,
                    data:{options:{Month:_month,Year:_year,userID:[uid || i8_session.uid]}},
                    success: function(result){
                        console.log(result);
                        if(result.Code==0){
                            calendarSource=result;
                            callback&&callback(formatData(result,start,end,timezone));
                            $('.fc-title').each(function(){
                                var $this=$(this);
                                $this.html($this.text())
                                $this.attr('title',$this.text())
                                $this.parents('.fc-content').attr('title',$this.text())
                            })
                            //rendPunch(result);
                        }else{
                            i8ui.error(result.Description);
                        }
                    },
                    error: function(e1,e2,e3){

                    }
                });

                //渲染考勤异常
                if(!isForWorkflow){
                    renderCaseList(1,_month,_year)
                }


            },
            select: function(startDate, endDate, allDay, jsEvent, view) {//开始时间，结束时间

            },
            eventLimitClick:function(cellInfo,jsEvent){
                var segs=cellInfo.segs;
                ta_attendance.on('click','.fc-popover a.fc-event',function(){
                    //console.log($(this).index())
                    openWindow(segs);
                    return false;
                })
                //console.log(cellInfo,jsEvent);
                return 'popover';

            },
            //日程事件被拖动之前触发。这里的拖动不一定是一个有效的拖动，只要日程事件的控件被拖着动了，事件就触发。 可以从该对象中获取位移，位置等数据
            eventDragStart:function( event, jsEvent, ui, view ){

            },
            //日程事件被拖动之后触发。这里的拖动不一定是一个有效的拖动，只要日程事件的控件被拖着动了，事件就触发。 可以从该对象中获取位移，位置等数据
            eventDragStop:function( event, jsEvent, ui, view ){

            },
            //ayDelta 保存日程向前或者向后移动了多少天
            //minuteDelta 这个值只有在agenda视图有效，移动的时间
            // 如果是月视图，或者是agenda视图的全天日程，此值为true,否则为false
            eventDrop:function( event, delta, revertFunc, jsEvent, ui, view ){

            },
            //在日程事件改变大小并成功后调用, 参数和eventDrop参数用法一致。用法
            eventResize:function( event, delta, revertFunc, jsEvent, ui, view ){

            },
            //当单击日历中的某一天时，触发callback，用法：
            //date是点击的day的时间(如果在agenda view, 还包含时间)，
            // 在月view下点击一天时，allDay是true，在agenda模式下，
            // 点击all-day的窄条时，allDay是true，
            // 点击其他的agenda view下的day则为false，
            // jsEvent就是一个普通的javascript事件，包含的是click事件的基础信息
            dayClick:function(date, allDay, jsEvent, view) {
                if(!isForWorkflow){
                    var nowDate=date.format('YYYY-MM-DD');
                    var todayStr=new Date().format('yyyyMMdd');
                    var nowDateStr=nowDate.replace(/-/g,'')
                    var cuData= _.find(calendarSource.ReturnObject,function(item){
                        return item.ScheduleDate.split(' ')[0]==nowDate;
                    })
                    console.log(cuData)
                    if(cuData && (nowDateStr<=todayStr)){
                        renderDielog({nativeData:cuData});
                    }
                }

                //console.log(date, allDay, jsEvent, view);
            },
            //当点击日历中的某一日程（事件）时，触发此操作，用法：
            //event是日程（事件）对象，jsEvent是个javascript事件，view是当前视图对象。
            eventClick:function(date,event, jsEvent, view) {
                //calendarfun.eventClick&&calendarfun.eventClick(event, jsEvent, view);
                //console.log(event,jsEvent,view);
                //var _cont=$('#attendance_dielog_tpl').html();
                if(isForWorkflow){
                    return false;
                }
                renderDielog(date);
                // console.log(date,event, jsEvent, view);

            },
            //鼠标划过的事件，用法和参数同上
            //event是日程（事件）对象，jsEvent是个javascript事件，view是当前视图对象。
            eventMouseover:function(event, jsEvent, view) {
                //console.log(event, jsEvent, view);

            },
            //鼠标离开的事件，用法和参数同上
            //event是日程（事件）对象，jsEvent是个javascript事件，view是当前视图对象。
            eventMouseout:function(event, jsEvent, view) {

            },
            //日历开始加载的时候，isLoading参数为true触发一次，日历加载完毕，isLoading参数为false触发一次，用法：
            loading:function(isLoading, view){

            }
        });
        initTitle();
        initChooseDate();
    }
    require.async(i8_session.resWfHost+'/default/javascripts/attendance/bmap.js',function(bmap){
        $(document).on('click','.rspoint',function(){
            var $this=$(this);
            bmap.uncode({
                lat:$this.attr('lat'),
                lng:$this.attr('lng'),
                address:$this.attr('laddress')||''
            })

        })
    })

    var ProcTpl='<div class="procdielog">\
                    <ul>\
                    {each ReturnObject}\
                    <li><span class="design-bg-icons3 app-radio v--7"></span><span prohref="{$setProcUrl($value.Url,$value.ProcFullName,$value.Version)}">{$value.ProcName}</span></li>\
                    {/each}\
                    </ul>\
                 </div>';
    template.helper('$setProcUrl',function(url,ProcFullName,Version){
        var url=url.replace('/','');
        return i8_session.wfbaseHost+url+'?procfullname='+ProcFullName+'&version='+Version;
    })
    //清除按钮
    $(document).on('click','.clearbtn',function(){
        clearDielog=i8ui.showbox({
            title:'选择流程',
            cont:'<div id="procdielog" style="width: 500px;min-height: 200px;">\
            <div class="ld-64-write" style="width:64px;height: 64px;"></div>\
            </div><div class="m-l15 m-r15 clear">\
            <div class="h-45 m-t15">\
            <a target="_blank" id="procdieloglink" class="btn-blue96x32 rt confirm">发起流程</a>\
        </div>\
        <div class="clear"></div>\
        </div>'
        })
        $.ajax({
            url: i8_session.ajaxWfHost+'webajax/attendance_ajax/getRelatedProcs',
            type: 'get',
            dataType: 'json',
            cache: false,
            data:{},
            success: function(result){
                if(result.Code==0){
                    console.log(result)
                    var _html=template.compile(ProcTpl)(result);
                    if(_.isEmpty(result.ReturnObject)){
                        i8ui.render_no_data('#procdielog','没有流程可以选择');
                    }else{
                        $('#procdielog').html(_html);
                        dielog.position()
                    }

                    //callback&&callback(formatData(result,start,end,timezone));
                    //rendPunch(result);
                }else{
                    i8ui.error(result.Description);
                }
            },
            error: function(e1,e2,e3){

            }
        });
    })
    $(document).on('click','.photospan',function(){
        $(this).next().find('li .doc-options').eq(0).trigger('click');
    })
    seefile.ks.bindImgClick($(document));

    $(document).on('click','#procdielog .app-radio',function(){
        var $this=$(this);
        $('#procdielog .app-radio').removeClass('checked');
        $this.addClass('checked');
        $('#procdieloglink').attr('href',encodeURI($this.next().attr('prohref')));
    })
    $(document).on('click','#procdieloglink',function(){
        var $this=$(this);
        if(!$this.attr('href')){
            i8ui.error('请选择一个流程');
            return false;
        }
        clearDielog.close();
    })
    exports.initCalendar=initCalendar;
    exports.renderCaseList=renderCaseList;
    //initCalendar();
});