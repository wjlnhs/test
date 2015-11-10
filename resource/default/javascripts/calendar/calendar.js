define(function (require, exports,modules) {

    var setrelation=require('../setrelation/setrelation');
    var addcalendar=require('./addcalendar');
    var common=require('./common');
    /*build(remove.start)*/
    require('../plugins/fullcalendar-2.3.1/fullcalendar.css');
    require('../plugins/fullcalendar-2.3.1/mycalendar.css');
    require('../plugins/i8scrollbar/mscrollbar.js');
    require('../plugins/i8scrollbar/css/mscrollbar.css');
    /*build(remove.end)*/
    var util=require('../common/util');
    var i8ui=require('../common/i8ui');
    var viewName=util.getUrlParam('view');
    var schedulelisttpl=require('../../template/calendar/schedulelist.tpl');//列表template
    var schedule_render=template(schedulelisttpl);//render
    var ajaxHost=i8_session.ajaxHost;//ajax路径

    template.helper('dateformat',function(date,format){
        return util.dateformat(date,format);
    })
    template.helper('getWeekName',function(cycleValues){
        var weeks=['一','二','三','四','五','六','日'  ];
        var _cyclevalues=cycleValues.split(',');
        return $.map(_cyclevalues,function(i,item){
            return '周'+weeks[i-1];
        });
    })
    var showcalview=$('#showcalview').on('click',function(event){
        event.stopPropagation();
    });
    showcalview.on('click','.ct-close',function(){
        hideView();
    })

    showcalview.on('click','a.btn-delete',function(){
        var _parent=$(this).parent();
        common._option.deleteSchedule({ID:_parent.attr('id'),IsCycle:_parent.attr('iscycle')==0?false:true},function(){
            $('#refreshBtn').trigger('click');
        });
    })

    showcalview.on('click','a.btn-edit',function(){
        var _parent=$(this).parent();
        var loading=i8ui.showbox({cont:'<div class="loading"></div>'});
        common.ajax.getScheduleById(_parent.attr('id'),function(data){
            loading.close();
            if($.type(data)=='object'&&data.Result){
                addcalendar.openWindow({
                    'title':'编辑日程/会议',
                    isedit:true,
                    data:data.ReturnObject
                },function(Type,data){
                    $('#refreshBtn').trigger('click');
                });
            }

        })
    })



    var colors=['bg-pink','bg-orange','bg-green','bg-blue1','bg-blue2','bg-purple'];//配色数组
    var defaultView=['agendaDay','agendaWeek','month'];//默认视图
    var isList=false;//视图是否为列表
    var defaultClass=['.fc-agendaDay-button','.fc-agendaWeek-button','.fc-month-button','.fc-list-btn'];//切换视图按钮样式集合
    var viewNum=1;//当前视图



    //是否显示任务
    var setNotify=function(elems){
        var hasChecked=elems.showNotify.hasClass('checked');
        if(elems.calendar.fullCalendar('getView').name=='month'){
            return;
        }
        if(hasChecked){
            elems.calendar.find('.fc-day-grid,.fc-divider.fc-widget-header').show();
        }else{
            elems.calendar.find('.fc-day-grid,.fc-divider.fc-widget-header').hide();
        }
    }



    var nowDate=new Date();//当天日期
    var nowWeek=common.units.getWeekByDay(nowDate.getFullYear(),nowDate.getMonth(),nowDate.getDate());//当前周星期一 星期日 日期



    //判断是不是本周
    var checkNowDate=function(elems){
        var date=elems.currentDate.data();
        elems.chooseWeek.find('a').removeClass('active');
        if(util.dateformat(date.selectDate.beginDate,'yyyy-MM-dd')==util.dateformat(date.nowWeek.beginDate,'yyyy-MM-dd')){
            elems.chooseWeek.find('a[type=week]').addClass('active');
        }
    }

   //获取分享给我的人
   var getSharePerson=function(callback,elems){
       /*setrelation.getShareMeUsers({'appname':'App_Schedule','noReportRelation':true},function(data){

       })*/

       if($.type(_data)=='object'){
           if(_data.Result){
               _data.colors=colors;
               elems.colleagues.html(template('sharechecklist', _data));
               var _colorarr={};
               elems.colleagues.find('.app-checkbox-white').each(function(i,item){
                   var _item=$(item);
                   _colorarr[_item.attr('uid')]=_item.attr('bgcolor');
               });
               callback(_colorarr);
               i8ui.expendUI(elems.colleagues.find('.w-910'),{
                   max_height:45,
                   height:65,
                   bottom:13,
                   right:5
               })
           }else{
               elems.colleagues.html(template('sharechecklist', {error:true}));
           }
       }else{
           elems.colleagues.html(template('sharechecklist', {error:true}));
       }
   }
    //获取列表
    var getScheduleList=function(elems){
        /// <param name="startDate">查询开始日期</param>
        /// <param name="endDate">查询结束日期</param>
        /// <param name="userIDs">日程创建人</param>
        elems.schedulelist.html(schedule_render({loading:true}));
        var userids=[];
        if(elems.calendar.attr('id')=='calendar'){
            userids.push(i8_session.uid);
        }else{
            elems.colleagues.find('.app-checkbox-white.checked').each(function(i,item){
                var _item=$(item);
                if(_item.hasClass('checked')){
                    userids.push(_item.attr('uid'));
                }
            });
        }
        var selectDate=elems.currentDate.data('selectDate');
        if(userids.length==0){
            elems.schedulelist.html(schedule_render({noresult:true}));
            return;
        }
        common.ajax.getScheduleList({
            userIDs:userids,
            startDate:util.dateformat(selectDate.beginDate,'yyyy-MM-dd')+' 00:00',
            endDate:util.dateformat(selectDate.endDate,'yyyy-MM-dd')
        },function(data){
            if($.type(data)=='object'&&data.Result){
                if(data.ReturnObject){
                    elems.schedulelist.html(schedule_render({ReturnObject:common.units.formatScheduleList(data.ReturnObject)}));
                }else{
                    elems.schedulelist.html(schedule_render({noresult:true}));
                }
                try{lead && lead.calendar()}catch (e){}//引导
            }else{
                elems.schedulelist.html(schedule_render({error:data.Description?'请求失败,'+data.Description:'请求超时！'}));
            }
        })
    }

    //显示弹窗
    var showView=function(event,jsEvent){
        var _top=jsEvent.clientY;
        var _left=jsEvent.clientX;
        _top=_top>310?310:_top;
        _left=_left>890?890:_left;
        showcalview.show().css({
            top:_top+'px',
            left:_left+'px'
        }).html(template('calviewhtml',event))
    }

    var hideView=function(){
        showcalview.hide();
    }

    //初始化日历控件
    var initCalendar=function(_colorarr,hasLoaded,elems){
        var calendarfun=require('./calendarfun').init(elems.calendar,_colorarr,elems);
        elems.calendar.fullCalendar({
            //头部显示
            header: {
                left: 'today',//今天
                center: 'prev title next',//上  时间  下
                right: 'agendaDay,agendaWeek,month' //月 周 日
            },
            //列格式
            columnFormat:{
                month: 'ddd',
                week: "M 月 D 日",
                day: 'YYYY 年 M 月  D 日 dddd'
            },
            dayPopoverFormat:'ddd ，M月D日',
            defaultView:viewName||defaultView[viewNum]||defaultView[1],//month,agendaDay,agendaWeek
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
            contentHeight:500,
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
            editable: true,
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
                calendarfun.events&&calendarfun.events(start,end,timezone, callback,elems);
            },
            select: function(startDate, endDate, allDay, jsEvent, view) {//开始时间，结束时间
                calendarfun.select&&calendarfun.select(startDate, endDate, allDay, jsEvent, view);
            },
            eventLimitClick:function(cellInfo,jsEvent){
                var segs=cellInfo.segs;
                elems.calendar.on('click','.fc-popover a.fc-event',function(){
                    //console.log($(this).index())
                    showView(segs[$(this).index()].event,jsEvent);
                    return false;
                })
                //console.log(cellInfo,$('.fc-popover'));
                return 'popover';

            },
            //日程事件被拖动之前触发。这里的拖动不一定是一个有效的拖动，只要日程事件的控件被拖着动了，事件就触发。 可以从该对象中获取位移，位置等数据
            eventDragStart:function( event, jsEvent, ui, view ){
                calendarfun.eventDragStart&&calendarfun.eventDragStart(event, jsEvent, ui, view);
            },
            //日程事件被拖动之后触发。这里的拖动不一定是一个有效的拖动，只要日程事件的控件被拖着动了，事件就触发。 可以从该对象中获取位移，位置等数据
            eventDragStop:function( event, jsEvent, ui, view ){
                calendarfun.eventDragStop&&calendarfun.eventDragStop(event, jsEvent, ui, view);
            },
            //ayDelta 保存日程向前或者向后移动了多少天
            //minuteDelta 这个值只有在agenda视图有效，移动的时间
            // 如果是月视图，或者是agenda视图的全天日程，此值为true,否则为false
            eventDrop:function( event, delta, revertFunc, jsEvent, ui, view ){
                calendarfun.updateSchelue&&calendarfun.updateSchelue(event, delta, revertFunc, jsEvent, ui, view);
            },
            //在日程事件改变大小并成功后调用, 参数和eventDrop参数用法一致。用法
            eventResize:function( event, delta, revertFunc, jsEvent, ui, view ){
                calendarfun.updateSchelue&&calendarfun.updateSchelue(event, delta, revertFunc, jsEvent, ui, view);
            },
            //当单击日历中的某一天时，触发callback，用法：
            //date是点击的day的时间(如果在agenda view, 还包含时间)，
            // 在月view下点击一天时，allDay是true，在agenda模式下，
            // 点击all-day的窄条时，allDay是true，
            // 点击其他的agenda view下的day则为false，
            // jsEvent就是一个普通的javascript事件，包含的是click事件的基础信息
            dayClick:function(date, allDay, jsEvent, view) {
                calendarfun.dayClick&&calendarfun.dayClick(date, allDay, jsEvent, view);
            },
            //当点击日历中的某一日程（事件）时，触发此操作，用法：
            //event是日程（事件）对象，jsEvent是个javascript事件，view是当前视图对象。
            eventClick:function(event, jsEvent, view) {
                //calendarfun.eventClick&&calendarfun.eventClick(event, jsEvent, view);
                //console.log(event,jsEvent,view);
                showView(event,jsEvent);
                return false;

            },
            //鼠标划过的事件，用法和参数同上
            //event是日程（事件）对象，jsEvent是个javascript事件，view是当前视图对象。
            eventMouseover:function(event, jsEvent, view) {
                //console.log(event, jsEvent, view);
                calendarfun.eventMouseover&&calendarfun.eventMouseover(event, jsEvent, view);
            },
            //鼠标离开的事件，用法和参数同上
            //event是日程（事件）对象，jsEvent是个javascript事件，view是当前视图对象。
            eventMouseout:function(event, jsEvent, view) {
                calendarfun.eventMouseout&&calendarfun.eventMouseout(event, jsEvent, view);
            },
            //日历开始加载的时候，isLoading参数为true触发一次，日历加载完毕，isLoading参数为false触发一次，用法：
            loading:function(isLoading, view){
                calendarfun.loading&&calendarfun.loading(isLoading, view);
            }
        });


        if(hasLoaded){//是否已加载过
            return;
        }
        elems.calendar.on('click','a.fc-event',function(){
            //$(this).attr('target','_blank');
            //$(this).removeClass('bg-new bg-update');
        });

        elems.calendar.find('.fc-button-group')
            .append($('<a class="fc-button fc-list-btn fc-state-default fc-corner-right">列表</a>').on('click',function(){
                elems.calendar.hide();
                isList=true;
                elems.calendar_list.show();
            }),$('<span class="setschedule"></span>').on('click',function(){
                setSchedule($(this),elems);
                return false;
            }));

        if(isList){
            $(defaultClass[3]).addClass('defaultset')
        }else{
            $(defaultClass[viewNum]).addClass('defaultset');
        }
        var scrollPanel=function(){
            setNotify(elems);
            var _date=new Date(elems.calendar.fullCalendar('getDate'));
            var chooselist=$(template('choosedate', getYearDay(_date)));
            var _yearhtml='<div class="year-panel date-panel">'+chooselist.find('.year-panel').html()+'</div>';
            var _monthhtml='<div class="month-panel date-panel">'+chooselist.find('.month-panel').html()+'</div>';
            var _dayhtml='<div class="day-panel date-panel">'+chooselist.find('.day-panel').html()+'</div>';
            var view=elems.calendar.fullCalendar('getView');
            var moment = elems.calendar.fullCalendar('getDate');
            var _titleStr='';
            var _title=elems.calendar.find('.fc-center h2');
            switch (view.name){
                case 'month':_titleStr='<span class="year"><span>'+moment.format('YYYY')+'</span>'+_yearhtml+'</span>  年 '+'<span class="month"><span>'+moment.format('M')+'</span>'+_monthhtml+'</span>  月';break;
                case 'agendaWeek':_titleStr='<span class="year"><span>'+moment.format('YYYY')+'</span>'+_yearhtml+'</span>  年 '+'<span class="month"><span>'+moment.format('M')+'</span>'+_monthhtml+'</span>  月 '+'<span class="day"><span>'+moment.format('D')+'</span>'+_dayhtml+'</span>  日';break;
                case 'agendaDay':_titleStr='<span class="year"><span>'+moment.format('YYYY')+'</span>'+_yearhtml+'</span>  年 '+'<span class="month"><span>'+moment.format('M')+'</span>'+_monthhtml+'</span>  月 '+'<span class="day"><span>'+moment.format('D')+'</span>'+_dayhtml+'</span>  日';break;
            }
            _title.html(_titleStr);
            _title.find('.date-panel').mCustomScrollbar({
                scrollButtons: {
                    enable: false
                },
                set_height:200,
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
            var _scroll=elems.calendar.find('.fc-scroller').mCustomScrollbar({
                scrollButtons: {
                    enable: false
                },
                set_height:340,
                callbacks: {
                    onScroll: function () {

                    }
                },
                scrollInertia: 0,
                theme: "one-light-thin",
                axis: 'y',
                autoHideScrollbar: true,
                autoDraggerLength: true,
                autoExpandScrollbar: true,
                callbacks: {
                    whileScrolling: function () {
                    }
                }
            });
            _scroll.mCustomScrollbar("scrollTo","-288px");


        }

        //下拉
        elems.calendar.on('click','.fc-center .year,.fc-center .month,.fc-center .day',function(){
            var _this=$(this);
            var ishidden=_this.find('div').is(':hidden');
            elems.calendar.find('.fc-center .year,.fc-center .month,.fc-center .day').removeClass('up').find('div').slideUp();
            if(ishidden){
                _this.addClass('up').find('div').slideDown();
            }else{
                _this.removeClass('up').find('div').slideUp()
            }

            return false;
        });
        elems.calendar.on('click','.fc-center h2 div span',function(){
            var _this=$(this);
            var _parent=_this.parents('.date-panel');
            if(_parent.hasClass('year-panel')){
                _this.parents('.year').find('>span').html(_this.attr('value'));
            }else if(_parent.hasClass('month-panel')){
                _this.parents('.month').find('>span').html(_this.attr('value'));
            }else if(_parent.hasClass('day-panel')){
                _this.parents('.day').find('>span').html(_this.attr('value'));
            }

            elems.calendar.fullCalendar('gotoDate',new Date(elems.calendar.find('.fc-center .year').find('>span').html(),elems.calendar.find('.fc-center .month').find('>span').html()-1,elems.calendar.find('.fc-center .day').find('>span').html()||1));
            scrollPanel(elems);
        })

        elems.calendar.on('click',function(){
            elems.calendar.find('.year-panel,.month-panel,.day-panel').hide();
            elems.calendar.find('.up').removeClass('up');
        })
        elems.calendar.on('click','.fc-agendaDay-button,.fc-agendaWeek-button ,.fc-month-button,.fc-next-button,.fc-prev-button,.fc-today-button',function(){
            //calendar.find('.fc-day-grid,.fc-divider.fc-widget-header').hide();
            scrollPanel(elems);
        });
        elems.calendar.find('.fc-today-button').on('click',function(){
            //calendar.find('.fc-day-grid,.fc-divider.fc-widget-header').hide();
            scrollPanel(elems);
        })
        scrollPanel(elems);

    }

    //点击设置默认视图
    var setSchedule=function(btn,elems){
        var grouplist=btn.parents('.fc-button-group')
        grouplist.append(elems.setschedulelist.show()).find('.app-radio[viewtype='+viewNum+']').trigger('click');
    }

    //获取下拉年和日
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

   exports.init=function(data,hasLoaded,ver){


       var elems={
           schedulelist:$('#schedule_body'+(ver||'')),//列表tbody
           currentDate:$('#currentDate'+(ver||'')),//列表当前时间
           chooseWeek:$('#chooseWeek'+(ver||'')),//本周 今天 按钮
           prevWeek:$('#prevWeek'+(ver||'')),//上一周
           nextWeek:$('#nextWeek'+(ver||'')),//下一周
           calendar:$('#calendar'+(ver||'')),//日历容器
           calendar_list:$('#calendar_list'+(ver||'')),//列表容器
           colleagues:$('#colleagues'+ver||''),//分享给我的人
           setschedulelist:$('#setschedulelist'+(ver||'')),
           showNotify:$('#showNotify'+(ver||'')),
           choosecalendar:$('#choosecalendar'+(ver||''))//列表选择 周 月 日 列表 容器
       }


       /*var schedulelist=$('#schedule_body');//列表tbody
       var currentDate=$('#currentDate');//列表当前时间
       var chooseWeek=$('#chooseWeek');//本周 今天 按钮
       var prevWeek=$('#prevWeek');//上一周
       var nextWeek=$('#nextWeek');//下一周
       var calendar=$('#calendar');//日历容器
       var calendar_list=$('#calendar_list');//列表容器
       var colleagues=$('#colleagues');//分享给我的人
       var setschedulelist=$('#setschedulelist');
       var showTask=$('#showTask');

       var choosecalendar=$('#choosecalendar');//列表选择 周 月 日 列表 容器
        */
       if(!hasLoaded){

           $('.app-content-bg').on('click',function(){
               elems.setschedulelist.hide();
               hideView();
           })

           //选择切换视图
           elems.setschedulelist.on('click','.app-radio',function(){
               elems.setschedulelist.find('.app-radio').removeClass('checked');
               $(this).addClass('checked');
               return false;
           });

           //保存
           elems.setschedulelist.on('click','.blue-button',function(){
               var viewtype=elems.setschedulelist.find('.app-radio.checked').attr('viewtype');
               if(viewtype==viewNum){
                   elems.setschedulelist.hide();
                   i8ui.write('保存成功！');
                   return;
               }
               common.ajax.saveScheduleSet(viewtype,function(data){
                   if($.type(data)=='object'&&data.Result){
                       viewNum=viewtype;
                       $('.fc-button.defaultset').removeClass('defaultset');
                       $(defaultClass[viewNum]).addClass('defaultset');
                       elems.setschedulelist.hide();
                       i8ui.write('保存成功！');
                   }else{
                       i8ui.error('保存失败！');
                   }
               });
               return false;
           });


           //是否显示任务
           elems.showNotify.on('click',function(){
               elems.showNotify.toggleClass('checked');
               setNotify(elems);
               elems.calendar.fullCalendar('refetchEvents');
           });

           //选择分享人
           elems.colleagues.on('click','.app-checkbox,.app-checkbox-white',function(){
               var _this=$(this).toggleClass('checked');
               if(_this.attr('type')=='all'){
                   if(_this.hasClass('checked')){
                       elems.colleagues.find('.app-checkbox,.app-checkbox-white').addClass('checked');
                   }else{
                       elems.colleagues.find('.app-checkbox,.app-checkbox-white').removeClass('checked');
                   }
               }
               if(elems.colleagues.find('.app-checkbox-white').not('.checked').length==0){
                   elems.colleagues.find('.app-checkbox').addClass('checked');
               }else{
                   elems.colleagues.find('.app-checkbox').removeClass('checked');
               }
               if(isList){
                   getScheduleList(elems);
               }else{
                   elems.calendar.fullCalendar('refetchEvents');
               }
           });

           //列表日期显示
           elems.currentDate.html(util.dateformat(nowWeek.beginDate,'yyyy年MM月dd日')+' 至 '+util.dateformat(nowWeek.endDate,'yyyy年MM月dd日')).data({
               nowWeek:nowWeek,
               nowDate:nowDate,
               selectDate:nowWeek
           });

           //选择本周 今天
           elems.chooseWeek.on('click','a',function(){
               elems.chooseWeek.find('a').removeClass('active');
               var _type=$(this).addClass('active').attr('type');
               if(_type=='week'){
                   elems.currentDate.data('selectDate',nowWeek);
                   elems.currentDate.html(util.dateformat(nowWeek.beginDate,'yyyy年MM月dd日')+' 至 '+util.dateformat(nowWeek.endDate,'yyyy年MM月dd日'));
               }else{
                   elems.currentDate.data('selectDate',{
                       beginDate:nowDate,
                       endDate:nowDate
                   });
                   elems.currentDate.html(util.dateformat(nowDate,'yyyy年MM月dd日'));
               }
               getScheduleList(elems);
           });

           //列表上一周
           elems.prevWeek.on('click',function(){
               var selectDate=elems.currentDate.data('selectDate');
               var newWeek=common.units.getNewWeekByDay(selectDate.beginDate,-1);
               elems.currentDate.data('selectDate',newWeek);
               elems.currentDate.html(util.dateformat(newWeek.beginDate,'yyyy年MM月dd日')+' 至 '+util.dateformat(newWeek.endDate,'yyyy年MM月dd日'));
               checkNowDate(elems);
               getScheduleList(elems);
           });

           //列表下一周
           elems.nextWeek.on('click',function(){
               var selectDate=elems.currentDate.data('selectDate');
               var newWeek=common.units.getNewWeekByDay(selectDate.beginDate,1);
               elems.currentDate.data('selectDate',newWeek);
               elems.currentDate.html(util.dateformat(newWeek.beginDate,'yyyy年MM月dd日')+' 至 '+util.dateformat(newWeek.endDate,'yyyy年MM月dd日'));
               checkNowDate(elems);
               getScheduleList(elems);
           });

           //列表显示的点击右侧 年月日列表
           elems.choosecalendar.on('click','a',function(){
               var aType=$(this).attr('type');
               if(aType){
                   isList=false;
                   elems.calendar_list.hide();
                   elems.calendar.show().find('.'+aType).trigger('click');
               }
           });
           //点击设置默认页按钮
           elems.choosecalendar.on('click','.setschedule',function(){
               setSchedule($(this),elems);
               return false;
           });

           //查看更多日程
           elems.calendar.on('click','.fc-more',function(){
               $('.fc-popover .fc-event-container').mCustomScrollbar({
                   scrollButtons: {
                       enable: false
                   },
                   set_height:100,
                   callbacks: {
                       onScroll: function () {

                       }
                   },
                   scrollInertia: 0,
                   theme: "one-light-thin",
                   axis: 'y',
                   autoHideScrollbar: true,
                   autoDraggerLength: true,
                   autoExpandScrollbar: true,
                   callbacks: {
                       whileScrolling: function () {
                       }
                   }
               });
           });

           elems.calendar.on('click','.mCSB_scrollTools',function(){
               return false;
           });

           //刷新
           var refreshBtn=$('#refreshBtn').on('click',function(){
               elems.calendar.fullCalendar('refetchEvents');
               getScheduleList(elems);
           });

           var scheduleSet=data;//日程设置

           if(!scheduleSet){
               elems.calendar.show();
           }else if(scheduleSet.ViewType==3){
               elems.calendar_list.show();
               viewNum=scheduleSet.ViewType;
               isList=true;
           }else{
               elems.calendar.show();
               viewNum=scheduleSet.ViewType;
           }
           getSharePerson(function(_colorarr){
               initCalendar(_colorarr,hasLoaded,elems);
               getScheduleList(elems);
           },elems);
       }



   }
});