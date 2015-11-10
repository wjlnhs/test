/**
 * Created by jialin on 2015/2/25.
 */
define(function (require, exports) {
    require('default/javascripts/plugins/fullcalendar/fullcalendar.js');
    require('default/javascripts/common/fw_cpec.js');
    require('default/javascripts/plugins/fullcalendar/fullcalendar.css');
    require('default/javascripts/plugins/fullcalendar/cupertino/theme.css');
    require('default/stylesheets/calendar.css')
    require('default/javascripts/plugins/fullcalendar/jquery-ui-1.8.23.custom.min.js');
    var i8ui = require('default/javascripts/common/i8ui');
    var detail_tpl = require('default/template/calendar/app_schedule_view_detail_show.tpl');
    var fw_selector=require('../plugins/i8selector/fw_selector.js');
    var KSNSelector=fw_selector.KSNSelector;
    var $calendarContainer = $('#quick_post');
    //var urlJson = cpec.string.fParamToJson(location.href);
    //var accountId = urlJson['a'];
    var colorObj = {};
    //
    var colorArr = [{ 'background': '9FC6E7', 'border': '038BC0' }, { 'background': 'B3DC6C', 'border': '93C00B' }, { 'background': 'FF7537', 'border': 'BB5517' }, { 'background': 'FEF2D3', 'border': 'FAD165' }, { 'background': 'E4F7F8', 'border': '9FE1E7' }, { 'background': 'C0EED7', 'border': '92E1C0' }, { 'background': 'F0D0CE', 'border': 'DB7972' }, { 'background': 'E6CE84', 'border': 'C0A75A' }, { 'background': 'DBE7FA', 'border': '8FB5F2' }, { 'background': '94C7AF', 'border': '4EAF83' }];
    var colorArrCopy = colorArr.slice();
    var checkUserObj = {};
    var defaultView = ('30' || '1'); //agendaDay,agendaWeek,month
    defaultViewObj = { '1': 'agendaDay', '7': 'agendaWeek', '30': 'month' },
        eventClassifyObj = {},
        eventClassifyObjCopy = {},
        attentionUserObj = {},
        cycleFlagObj = {},
        //setDefaultView = urlJson['setdefaultview'],
        //setDefaultMonth = urlJson['setdefaultmonth'],
        setDefaultView='';
        deleteDataId = '';
    if (!!setDefaultView) {
        defaultView = setDefaultView;
    }
    var deepCopy = function (obj) {
        var str = JSON.stringify(obj);
        return JSON.parse(str);
    }
    //任务数据
    var jobClassifyObj = {};
    var jobDate = 0;
    var fGetDateFromString = function (date) {
        var curTime = new Date();
        curTime = new Date(date);
        if ($.isNaN(curTime)) curTime = date.toDate();
        if ($.isNaN(curTime)) {
            curTime = new Date(date.replace('T', ' ').replace('Z', ' ').replace(/-/g, '/'));
        }

        return curTime;
    }
    var globalStartTime = globalEndTime = new Date();
    var calendarObj;
    var isMonthView;
    var isCycle = false;
    var add_schedule_obj = {};
    var curSelectUserId = currentUserId = '3d77a1a6-6428-40a7-9ffd-551d935cd6d3';


    var fGetschedulefocus = function () {
        $.ajax({
            url:'webajax/calendar_ajax/fGetschedulefocus',
            async: false,
            success: function (data) {
                if (!data.Result) {
                    return;
                }
                var dataContainer = $('.app_schedule_staff_selects');
                var result = data.ReturnObject;
                var html = '';
                var curResult, curName, curId;
                for (var i = 0; i < result.length; i++) {
                    curResult = result[i];
                    curName = curResult.Name;
                    curId = curResult.ID;
                    attentionUserObj[curId] = curResult;
                    if (i == 0) {
                        currentUserId = curId;
                        checkUserObj[curId] = 'ck0';
                        colorObj['ck0'] = colorArrCopy.shift();
                        curName = '我';
                        html += '<span ckd="ckd" data-selectobj=\'{"' + curId + '":"ck' + i + '"}\' index="' + i + '" uid="' + curId + '" class="app_schedule_staff_span ck0">' + curName + '<span class="app_schedule_staff_select_unselet"></span></span>';
                        continue;
                    }
                    html += '<span data-selectobj=\'{"' + curId + '":"ck' + i + '"}\' index="' + i + '" uid="' + curId + '" class="app_schedule_staff_span">' + curName + '<span class="app_schedule_staff_select_unselet"></span></span>';
                }

                dataContainer.html(html);
                if (dataContainer.height() > 30) {
                    $('.app_schedule_show_more').show();
                    dataContainer.addClass('app_schedule_show_more_hidden');
                }
                else {
                    $('.app_schedule_show_more').hide();
                }
            }
        });
    }
    $(document).ready(function () {
        //var url = fw_globalConfig.root + 'handler/AppHandler.ashx';
        $.ajaxSetup({
            type: 'get',
            //url: url,
            dataType: 'JSON',
            async: true
        });

        currentUserId = '';
        //缓存多次使用的dom元素
        var $calendarContainer = $('#quick_post'),
            $view_schedule = $('.app_schedule_view_tips'),
            $add_schedule = $('#app_schedule_view_add_schedule').click(function () { return false; });

        var $view_month_more = null,
            calendar = null,
            popUpBox = null;


        var curDate = date = new Date();
        var d = date.getDate();
        var m = date.getMonth();
        var y = date.getFullYear();

        /*
         fun         取得我关注的人,生成关注人数据列表
         argument
         return
         */
        fGetschedulefocus();
        /*
         fun         取得当前选中人的列表
         argument
         return      返回关注人的用户id 数组
         */
        var fGetSelectedFocusUser = function () {
            var allUsers = $('.app_schedule_staff_span');
            var selectedArr = [];
            checkUserObj = {};
            var uid = '', index;
            allUsers.each(function (index, sender) {
                if (sender.getAttribute('ckd') === 'ckd') {
                    uid = sender.getAttribute('uid');
                    index = sender.getAttribute('index');
                    selectedArr.push(uid);
                    checkUserObj[uid] = 'ck' + index;
                }
            });
            return selectedArr;
        }

        /*
         fun         使用ajax请求从后台取得日程活动日历数据
         argument    start:开始时间  end:结束时间
         return      返回日历json对象
         author      rong add 整合任务到日历中
         */
        var fGetAppEventData = function (start, end, addTask) {
            var now = new Date();
            var start = ((start || '').format('yyyy-MM-dd hh:mm:ss')) || new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1).format('yyyy-MM-dd hh:mm:ss');
            var end = ((end || '').format('yyyy-MM-dd hh:mm:ss')) || new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).format('yyyy-MM-dd hh:mm:ss');
            var eventData = [];
            $.ajax({
                async: false,
                type: 'get',
                url: 'webajax/calendar_ajax/getscheduledata',
                data: { 'pass': fGetSelectedFocusUser().join(',') || '', 'StartTime': start.toString(), 'EndTime': end.toString(),'addTask':!!addTask },
                success: function (data) {
                    if (data.Result) {
                        eventData = data.ReturnObject;
                    }
                }
            });
            return eventData;
        }
        /*
         fun      重绘日历控件
         argument
         return
         */
        var fUpdateEvent = function () {
            $calendarContainer.fullCalendar('refetchEvents');
        }



        /*
         fun 使用拖动功能更改日历
         argument
         evt: event事件信息
         changeType:要更改的事件类型
         callback:操作失败的回调函数
         successCallBack:操作成功的回调函数
         return
         */
        var fEidtCalendarAjax = function (evt, changeType, callback, sucessCallBack) {
            var _changeType = (typeof changeType === 'undefined') ? 1 : changeType;
            var editPage = fw_globalConfig.root + 'Handler/AppHandler.ashx?fn=editschedule';
            if (evt.start.toString().indexOf(".") >= 0) {//ul li中的拖动
                var dDate = new Date();
                dDate.setYear(parseInt(evt.start.substring(0, 4), 10));
                dDate.setMonth(parseInt(evt.start.substring(5, 7) - 1, 10));
                dDate.setDate(parseInt(evt.start.substring(8, 10), 10));
                dDate.setHours(parseInt(evt.start.substring(11, 13), 10));
                dDate.setMinutes(parseInt(evt.start.substring(14, 16), 10));
                dDate.setSeconds(parseInt(evt.start.substring(17, 19), 10));
                var tempsmonth = (new Date(dDate).getMonth() + 1);
                var tempsdate = new Date(dDate).getDate();
                var tempsHours = new Date(dDate).getHours();
                var tempsMinutes = new Date(dDate).getMinutes();
                var tempsSeconds = new Date(dDate).getSeconds();
                var tempsMilliseconds = new Date(dDate).getMilliseconds();
                tempsMilliseconds = tempsMilliseconds.toString().length == 1 ? ("00" + tempsMilliseconds.toString()) : (tempsMilliseconds.toString().length == 2 ? ("0" + tempsMilliseconds.toString()) : tempsMilliseconds.toString());

                var deDate = new Date();
                deDate.setYear(parseInt(evt.end.substring(0, 4), 10));
                deDate.setMonth(parseInt(evt.end.substring(5, 7) - 1, 10));
                deDate.setDate(parseInt(evt.end.substring(8, 10), 10));
                deDate.setHours(parseInt(evt.end.substring(11, 13), 10));
                deDate.setMinutes(parseInt(evt.end.substring(14, 16), 10));
                deDate.setSeconds(parseInt(evt.end.substring(17, 19), 10));
                var tempemonth = (new Date(deDate).getMonth() + 1);
                var tempedate = new Date(deDate).getDate();
                var tempeHours = new Date(deDate).getHours();
                var tempeMinutes = new Date(deDate).getMinutes();
                var tempeSeconds = new Date(deDate).getSeconds();
                var tempeMilliseconds = new Date(deDate).getMilliseconds();
                tempeMilliseconds = tempeMilliseconds.toString().length == 1 ? ("00" + tempeMilliseconds.toString()) : (tempeMilliseconds.toString().length == 2 ? ("0" + tempeMilliseconds.toString()) : tempeMilliseconds.toString());

                var startTimeValue = new Date(dDate).getFullYear() + "-" + (tempsmonth.toString().length == 1 ? ("0" + tempsmonth.toString()) : tempsmonth.toString()) + "-" + (tempsdate.toString().length == 1 ? ("0" + tempsdate.toString()) : tempsdate.toString()) + " " + (tempsHours.toString().length == 1 ? ("0" + tempsHours.toString()) : tempsHours.toString()) + ":" + (tempsMinutes.toString().length == 1 ? ("0" + tempsMinutes.toString()) : tempsMinutes.toString()) + ":" + (tempsSeconds.toString().length == 1 ? ("0" + tempsSeconds.toString()) : tempsSeconds.toString()) + "." + tempsMilliseconds;
                var endTimeValue = new Date(deDate).getFullYear() + "-" + (tempemonth.toString().length == 1 ? ("0" + tempemonth.toString()) : tempemonth.toString()) + "-" + (tempedate.toString().length == 1 ? ("0" + tempedate.toString()) : tempedate.toString()) + " " + (tempeHours.toString().length == 1 ? ("0" + tempeHours.toString()) : tempeHours.toString()) + ":" + (tempeMinutes.toString().length == 1 ? ("0" + tempeMinutes.toString()) : tempeMinutes.toString()) + ":" + (tempeSeconds.toString().length == 1 ? ("0" + tempeSeconds.toString()) : tempeSeconds.toString()) + "." + tempeMilliseconds;
                $.ajax({
                    type: 'get',
                    url: editPage + '&updatetype=1&ChangeType=' + changeType + '&StartTime=' + startTimeValue + '&EndTime=' + endTimeValue + '&id=' + (evt.id || '').substr(0, 36),
                    dataType: 'json',
                    success: function (json) {
                        if (json.Result) {
                            fw_setTimeNoMaskShow('修改成功');
                            //操作成功时执行成功后的回调
                            if (sucessCallBack) {
                                sucessCallBack();
                            }
                        }
                        else {
                            //操作失败时执行失败后的回调
                            if (callback) {
                                callback();
                            }
                        }
                    }, error: function () {
                        if (callback) {
                            callback();
                        }
                    }
                });
            } else {
                $.ajax({
                    type: 'get',
                    url: editPage + '&updatetype=1&ChangeType=' + changeType + '&StartTime=' + new Date(evt.start).format('yyyy-MM-dd hh:mm:ss') + '&EndTime=' + new Date(evt.end).format('yyyy-MM-dd hh:mm:ss') + '&id=' + (evt.id || '').substr(0, 36),
                    dataType: 'json',
                    success: function (json) {
                        if (json.Result) {
                            fw_setTimeNoMaskShow('修改成功');
                            //操作成功时执行成功后的回调
                            if (sucessCallBack) {
                                sucessCallBack();
                            }
                        }
                        else {
                            //操作失败时执行失败后的回调
                            if (callback) {
                                callback();
                            }
                        }
                    }, error: function () {
                        if (callback) {
                            callback();
                        }
                    }
                });
            }
        }

        //编辑普通的日程日历
        /*var fEditNormalCalendar = function (evt, me, callback) {
            var evt = evt || {};
            popUpBox = fw_oshow_box.createNew();
            popUpBox.fshow_delete_box({
                dialogtype: 0,                      // 为1 或0 弹出是否模态，
                message: "确认修改？",              //提示消息
                success: function (data) {          // 确定的回调函数
                    fEidtCalendarAjax(evt, 1, function () {
                            if (callback) {
                                callback();
                            }
                        }, function () {
                            fUpdateEvent();
                            var curViewName = $calendarContainer.fullCalendar('getView').name;
                            $calendarContainer.fullCalendar('changeView', curViewName);
                            popUpBox.closed();
                        }
                    );
                },
                fcancel: function () {               //取消|关闭 的回调函数
                    popUpBox.closed();
                    if (callback) {
                        callback();
                    }
                }
            });
        }*/
        var fEditNormalCalendar=function (evt, me, callback){
            var evt = evt || {};
            var popUpBox=i8ui.confirm({title: '确认修改？'}, function () {
                fEidtCalendarAjax(evt, 1, function () {
                        if (callback) {
                            callback();
                        }
                    }, function () {
                        fUpdateEvent();
                        var curViewName = $calendarContainer.fullCalendar('getView').name;
                        $calendarContainer.fullCalendar('changeView', curViewName);
                        popUpBox.closed();
                    }
                );
            },function(){
                callback && callback();
            })
        }
        //编辑循环日程日历
        var fEditCycleCalendar = function (evt, me, callback) {
            var evt = evt || {};
            var _strhtml = $("#js_edit_schedule").html();
            //回调函数和参数需要在其它地方使用，此处保存成全局变量
            window['editCycleCallBack'] = callback;
            window['editCycleEvent'] = evt;
            ScheduleBox = fw_oshow_box.createNew2();
            ScheduleBox.fshow_box({
                title: "请选择循环日程日程修改范围：",    //标题
                shtml_id: "js_edit_schedule_show", //弹出层容器ID
                dialogtype: 0,      //显示模式 0模态，1非模态
                scontent: _strhtml, // html 代码
                success: function (data) {  //绑定的回调函数

                }
            });
        }

        calendarObj = calendar = $calendarContainer.fullCalendar({
            header: {
                left: 'prev,next today curWeek curMonth',
                center: 'title',
                right: 'agendaDay,agendaWeek,month'
            },
            selectable: true,
            selectHelper: true,
            theme: true,
            contentHeight: '460', //内容高度
            lazyFetching: false, //从日，周，月模式相互切换时是否再次往后台取数据
            color: '#ffffff',
            editable: true,
            disableDragging: false, //2013-06-03 rong add 实现拖拽
            disableResizing: false, //2013-06-03 rong add 实现拖拽
            defaultView: defaultViewObj[defaultView], //默认显示的日历模式
            // slotMinutes: 30,
            firstHour: 8,
            allDaySlot: true,
            columnFormat: 'ddd',
            axisFormat: 'H:00',
            //调整日历大小后触发的函数
            eventResize: function (event, dayDelta, minuteDelta, revertFunc, jsEvent, ui, view) {
                var _calEvent = event, _curDate = curDate;
                //当前月模式不支持拖动
                //当时如果是月模式，则回滚拖动的结果
                if (isMonthView) {
                    //                        revertFunc();
                    //                        return false;
                }
                var start = new Date(event.start);
                //更改他人的日历
                if (currentUserId != _calEvent.userid) { //@TODO
                    revertFunc();
                    //fw_settimealert({ str: "无法更改他人的日程", showmask: false, type: 'warning' });
                    i8ui.error('无法更改他人的日程');
                    return;
                }
                if ((!_calEvent.cuserid || currentUserId == _calEvent.cuserid) && (start > (_curDate) || (start.format('yyyyMMdd') == _curDate.format('yyyyMMdd')))) {

                    if (event.IsCycle) { //循环日历
                        fEditCycleCalendar(event, $(this), revertFunc);
                    } else {    //普通日历
                        fEditNormalCalendar(event, $(this), revertFunc);
                    }
                }
                else {
                    revertFunc();
                    if (currentUserId != _calEvent.cuserid) { //当前人不是创建人
                        //fw_settimealert({ str: "请联系创建人修改", showmask: false, type: 'warning' });
                        i8ui.error('请联系创建人修改')
                    } else {
                        //fw_settimealert({ str: "不能修改过去时间的日程", showmask: false, type: 'warning' });
                        i8ui.error('不能修改过去时间的日程')
                    }
                }
            },
            //拖动调整时间
            eventDrop: function (event, dayDelta, minuteDelta, allDay, revertFunc, jsEvent, ui, view) {
                var _calEvent = event, _curDate = curDate;
                if (isMonthView) {
                    //                        revertFunc();
                    //                        return false;
                    if (event.id.split("--").length == 5) {//提示用户：不能拖动任务
                        //fw_settimealert({ str: "无法更改任务", showmask: false, type: 'warning' });
                        i8ui.error('无法更改任务');
                        fUpdateEvent();
                        var curViewName = $calendarContainer.fullCalendar('getView').name;
                        $calendarContainer.fullCalendar('changeView', curViewName);
                        return false;
                    }
                }
                var start = new Date(event.start);
                if (currentUserId != _calEvent.userid) { //@TODO
                    revertFunc();
                    //fw_settimealert({ str: "无法更改他人的日程", showmask: false, type: 'warning' });
                    i8ui.error('无法更改他人的日程');
                    return;
                }

                if ((!_calEvent.cuserid || currentUserId == _calEvent.cuserid) && (start > (_curDate) || (start.format('yyyyMMdd') == _curDate.format('yyyyMMdd')))) {

                    if (event.IsCycle) {
                        fEditCycleCalendar(event, $(this), revertFunc);
                    } else {
                        fEditNormalCalendar(event, $(this), revertFunc);
                    }
                }
                else {
                    revertFunc();
                    if (currentUserId != _calEvent.cuserid) {
                        //fw_settimealert({ str: "请联系创建人修改", showmask: false, type: 'warning' });
                        i8ui.error('请联系创建人修改');
                    } else {
                        //fw_settimealert({ str: "不能修改过去时间的日程", showmask: false, type: 'warning' });
                        i8ui.error('不能修改过去时间的日程');
                    }
                }
            },
            //选中日历执行
            select: function (start, end, allDay, jsEvent) {
                if ($(".fw_ksninput_slted").size() > 0) {//清空创建日程的历史选择参与人
                    $(".fw_ksninput_slted").remove()
                }
                isMonthView = ($calendarContainer.fullCalendar('getView').name === 'month');
                var _time = $add_schedule.find('.app_schedule_view_add_time');
                if (isMonthView) {
                    $('.app_schedule_view_add_time_month').show();
                    _time.hide();
                }
                else {
                    _time.show();
                    $('.app_schedule_view_add_time_month').hide();
                }
                var _pageX = jsEvent.pageX - 125,
                    _pageY = jsEvent.pageY - 125;
                var _date = $add_schedule.find('.app_schedule_view_add_date'),
                    _week = $add_schedule.find('.app_schedule_view_add_week');
                _date.html(window['calendarFormat'](start, null, 'yyyy年MM月dd日')); //格式化日期
                _week.html(window['calendarFormat'](start, null, 'dddd'));
                _time.html('时间：' + window['calendarFormat'](start, null, 'HH:mm') + ' 至 ' + window['calendarFormat'](end, null, 'HH:mm'));
                //显示添加新日历弹出层
                $add_schedule.css({ 'position': 'absolute', 'zIndex': '9', left: _pageX, top: _pageY }).show();
                //保存当前添加的日历数据信息
                add_schedule_obj = {};
                add_schedule_obj = {
                    start: start,
                    end: end,
                    allDay: allDay,
                    userid: currentUserId,
                    color: ('#' + ((colorObj[checkUserObj[currentUserId] || ''] || {}).border)) || 'red'
                };
                $('.app_schedule_view_add_subject').val('').focus();
                //如果当前是月模式则禁止冒泡
                if (isMonthView) {
                    //return false;
                }
                AddSchedule_select.loadData(joiner.split(','));
            },
            eventClick: function (calEvent, jsEvent, view) {
                //点击日历弹出日历详细信息，注意月日历显示详细事件单独实现
                isMonthView = ($calendarContainer.fullCalendar('getView').name === 'month');
                if (isMonthView) {
                    //如果是任务数据，则跟日、周试图一样显示明细，否则跟原来一样按照div,li的click显示
                    console.log(calEvent)
                    if (calEvent.appid != "92af1586-4fc4-4f79-a908-269a6c904fc5") {
                        return true;
                        //fShowScheduleDetail({ 'data': calEvent, 'event': jsEvent });
                        //return false;
                    }
                }
                fShowScheduleDetail({ 'data': calEvent, 'event': jsEvent });
                return false;
            },
            events: function (start, end, callback) {
                //提供日历数据源
                globalStartTime = start, globalEndTime = end;
                var curEvent, curUserId, sharingtype;
                isMonthView = ($calendarContainer.fullCalendar('getView').name === 'month');
                eventData = {};
                if (isMonthView) {
                    eventClassifyObj = {};
                    eventClassifyObjCopy = {};
                }
                var flag = 1; //1-不带任务，2-带任务
                if ($("#selectTask").attr("checked") == "checked") {
                    flag = 2;
                }
                var czyjobClassifyObj = new Array(); //专门给周、日试图整合任务用，其他情况 该数组不用，自动设为null回收
                var cjobClassifyObj = new Array(); //专门给月视图整合任务用，其他情况  该数组不用，自动设为null：因为下面的eventData在带任务的月视图中会改变，根据索引值修改相应属性值
                var eventData = flag == 1 ? (fGetAppEventData(start, end)) : (fGetAppEventData(start, end, '1a289157-8af2-4379-94e0-2b04b1b5395d'));
                var eventClassifyId = '';
                jobClassifyObj = deepCopy(eventData);
                //遍历后台返回的数据，生成控件需要的数据格式
                for (var i = 0, rid = 0, len = eventData.length; i < len; i++) {
                    if (flag == 2 && isMonthView) {//月视图带任务
                        curEvent = eventData[i], curUserId = curEvent.userid, sharingtype = 1 || attentionUserObj[curUserId].SharingType;
                        var idLastStart = eventData[i].start.toDate(), idLastEnd = eventData[i].end.toDate(), idLast = idLastStart.format('yyyyMMdd') + "--" + idLastEnd.format('yyyyMMdd');

                        if (eventData[i].appid.toString() != "92af1586-4fc4-4f79-a908-269a6c904fc5") {//如果是任务，则讲任务划分为每天的一个日程数据来统计有多少条并放入全局数组中，供渲染用
                            var jobStartDate = curEvent.start.toDate(), jobEndDate = curEvent.end.toDate();
                            var _tempcurEventStart = new Date(curEvent.start.toDate().getFullYear(), curEvent.start.toDate().getMonth(), curEvent.start.toDate().getDate(), 0, 0, 0);
                            var _tempcurEventEnd = new Date(curEvent.end.toDate().getFullYear(), curEvent.end.toDate().getMonth(), curEvent.end.toDate().getDate(), 0, 0, 0);
                            //var days = curEvent.end.toDate().getDate() - curEvent.start.toDate().getDate() + 1; //任务一共执行多少天，每天单元格都放一个并做好统计，循环放入
                            var days = (_tempcurEventEnd.getTime() - _tempcurEventStart.getTime()) / 86400000 + 1;
                            var baseDay = jobStartDate.getDate(), baseMonth = jobStartDate.getMonth(), baseYear = jobStartDate.getFullYear();
                            for (var dayIndex = 0; dayIndex < days; dayIndex++) {
                                var job = {
                                    id: curEvent.id,
                                    title: curEvent.title,
                                    start: curEvent.start,
                                    end: curEvent.end,
                                    userid: curEvent.userid,
                                    cuserid: curEvent.cuserid,
                                    IsCycle: curEvent.IsCycle,
                                    IsRead: curEvent.IsRead,
                                    Attendees: curEvent.Attendees,
                                    color: ('#' + (colorObj[checkUserObj[curUserId] || ''].border)) || 'red',
                                    showTime: false,
                                    allDay: false,
                                    ReferUrl: curEvent.ReferUrl,
                                    ShowEdit: curEvent.ShowEdit,
                                    appid: curEvent.appid,
                                    taskStart: curEvent.start.toDate(),
                                    taskEnd: curEvent.end.toDate(),
                                    taskflag: 2,
                                    ReferID: curEvent.ReferID
                                };
                                job.start = eventData[i].start.toDate();
                                job.end = eventData[i].end.toDate();

                                curEvent.color = ('#' + (colorObj[checkUserObj[curUserId] || ''].border)) || 'red';
                                curEvent.taskflag = 2;

                                var tempJobStartDate = new Date(baseYear, baseMonth, baseDay + dayIndex, 0, 0, 0);
                                var tempJobEndDate = new Date(baseYear, baseMonth, baseDay + dayIndex, 23, 59, 59);
                                var eventIdDate = tempJobStartDate.format('yyyyMMdd');
                                job.id = eventData[i].id + '--' + eventData[i].userid + '--' + eventIdDate + '--' + idLast;
                                job.start = tempJobStartDate;
                                job.end = tempJobEndDate;
                                eventClassifyId = 'event_' + eventIdDate;
                                if (eventClassifyId in eventClassifyObj) {
                                    eventClassifyObj[eventClassifyId].count = ++eventClassifyObj[eventClassifyId].count; //统计每天有多少条数据
                                    eventClassifyObj[eventClassifyId].data.push(curEvent); //缓存当前数据，此处的对象不能引用同一个，需复制出来作为一个独立对象放入
                                }
                                else {
                                    eventClassifyObj[eventClassifyId] = {};
                                    eventClassifyObj[eventClassifyId].count = 1;
                                    eventClassifyObj[eventClassifyId].data = [curEvent];
                                }
                                cjobClassifyObj[rid] = job;
                                rid++;
                            }
                        } else {//日程数据，则直接统计条数并放入全局数组中，供渲染用
                            var job = {
                                id: curEvent.id,
                                title: curEvent.title,
                                start: curEvent.start,
                                end: curEvent.end,
                                userid: curEvent.userid,
                                cuserid: curEvent.cuserid,
                                IsCycle: curEvent.IsCycle,
                                IsRead: curEvent.IsRead,
                                Attendees: curEvent.Attendees,
                                color: ('#' + (colorObj[checkUserObj[curUserId] || ''].border)) || 'red',
                                showTime: false,
                                allDay: false,
                                ReferUrl: curEvent.ReferUrl,
                                ShowEdit: curEvent.ShowEdit,
                                appid: curEvent.appid,
                                taskStart: curEvent.start.toDate(),
                                taskEnd: curEvent.end.toDate(),
                                taskflag: 2,
                                ReferID: curEvent.ReferID
                            };
                            job.start = eventData[i].start.toDate();
                            job.end = eventData[i].end.toDate();

                            curEvent.color = ('#' + (colorObj[checkUserObj[curUserId] || ''].border)) || 'red';
                            curEvent.taskflag = 2;

                            //日程日历的id有可能重复(在循环日历中) 页面中要求id唯一，所以将日历id和用户id拼接起来组成唯一id
                            job.id = eventData[i].id + '--' + eventData[i].userid; //默认先按日程数据处理 如果是任务，则再分割成单天子任务：这样才能自动分割到每个日期表格中，为了绘制图案，得在id中保存任务的起止时间

                            cycleFlagObj[job.id] = eventData[i]['IsCycle'];
                            eventClassifyId = 'event_' + job.start.format('yyyyMMdd');
                            if (eventClassifyId in eventClassifyObj) {
                                eventClassifyObj[eventClassifyId].count = ++eventClassifyObj[eventClassifyId].count; //统计每天有多少条数据
                                eventClassifyObj[eventClassifyId].data.push(curEvent); //缓存当前数据
                            }
                            else {
                                eventClassifyObj[eventClassifyId] = {};
                                eventClassifyObj[eventClassifyId].count = 1;
                                eventClassifyObj[eventClassifyId].data = [curEvent];
                            }
                            job.color = ('#' + (colorObj[checkUserObj[curUserId] || ''].border)) || 'red';
                            job.IsRead = curEvent.IsRead;
                            //sharingType　为2时不允许显示日历详细信息
                            if (sharingtype == '2') {
                                job.title = '忙碌';
                            }
                            job.showTime = false;
                            job.allDay = false;
                            cjobClassifyObj[rid] = job;
                            rid++;
                        }
                    } else {//日、周视图带任务、不带任务；月视图不带任务
                        cjobClassifyObj = null; //让垃圾收集器自动回收
                        if (eventData[i].appid.toString() == "92af1586-4fc4-4f79-a908-269a6c904fc5") {
                            curEvent = eventData[i], curUserId = curEvent.userid, sharingtype = 1 || attentionUserObj[curUserId].SharingType;
                            var eventTemp = {
                                Attendees: curEvent.Attendees,
                                IsCycle: curEvent.IsCycle,
                                IsRead: curEvent.IsRead,
                                ReferUrl: curEvent.ReferUrl,
                                ShowEdit: curEvent.ShowEdit,
                                appid: curEvent.appid,
                                cuserid: curEvent.cuserid,
                                end: eventData[i].end.toDate(),
                                id: eventData[i].id + '--' + eventData[i].userid,
                                start: eventData[i].start.toDate(),
                                title: curEvent.title,
                                userid: curEvent.userid,
                                ReferID: curEvent.ReferID
                            };

                            eventData[rid].start = eventData[i].start.toDate();
                            eventData[rid].end = eventData[i].end.toDate();
                            //日程日历的id有可能重复(在循环日历中) 页面中要求id唯一，所以将日历id和用户id拼接起来组成唯一id
                            eventData[rid].id = eventData[i].id + '--' + eventData[i].userid;
                            cycleFlagObj[eventData[rid].id] = eventData[i]['IsCycle'];

                            if (isMonthView) {
                                eventClassifyId = 'event_' + eventData[rid].start.format('yyyyMMdd');
                                if (eventClassifyId in eventClassifyObj) {
                                    eventClassifyObj[eventClassifyId].count = ++eventClassifyObj[eventClassifyId].count; //统计每天有多少条数据
                                    eventClassifyObj[eventClassifyId].data.push(curEvent); //缓存当前数据
                                }
                                else {
                                    eventClassifyObj[eventClassifyId] = {};
                                    eventClassifyObj[eventClassifyId].count = 1;
                                    eventClassifyObj[eventClassifyId].data = [curEvent];
                                }
                            }
                            eventData[rid].color = ('#' + (colorObj[checkUserObj[curUserId] || ''].border)) || 'red';
                            eventTemp.color = ('#' + (colorObj[checkUserObj[curUserId] || ''].border)) || 'red';
                            eventData[rid].IsRead = curEvent.IsRead;
                            //sharingType　为2时不允许显示日历详细信息
                            if (sharingtype == '2') {
                                eventData[rid].title = '忙碌';
                                eventTemp.title = '忙碌';
                            }
                            eventData[rid].showTime = false;
                            eventData[rid].allDay = false;
                            eventTemp.showTime = false;
                            eventTemp.allDay = false;
                            czyjobClassifyObj[rid] = eventTemp;
                            rid++;
                        }
                    }
                }
                eventClassifyObj = deepCopy(eventClassifyObj); // 将自身复制　important
                if (flag == 2 && isMonthView) {
                    callback(cjobClassifyObj);
                } else {
                    if (flag == 2) {//日、周试图
                        callback(czyjobClassifyObj);
                    } else {
                        callback(eventData); //保持原来的日程渲染逻辑，此处的数据是上面筛选的日程数据
                    }
                }
            },
            loading: function (isLoading, view) {
                //数据没有加载完成时生成一个弹出层覆盖到控件上
                if (isLoading) {
                    var _postion = $calendarContainer.position(), _height = $calendarContainer.height(), _width = $calendarContainer.width();
                    var _html = '<div class="app_schedule_view_cover_loading" style="top:' + _postion.top + 'px;left:' + _postion.left + 'px;height:' + _height + 'px;width:' + _width + 'px;"><div class="app_schedule_view_loading_container"><span>' + !curSelectUserId ? "" : attentionUserObj[curSelectUserId].Name + '的日程日历正在加载中&nbsp;&nbsp;</span><span class="app_schedule_view_loading_img"> </span></div></div>';
                    $('body').append(_html);
                } else {
                    $('.app_schedule_view_cover_loading').remove();
                    //在此处加日历视图切换时的任务
                    var viewName = $calendarContainer.fullCalendar('getView').name;
                    var cjobClassifyObj = new Array();
                    for (var i = 0, jid = 0, len = jobClassifyObj.length; i < len; i++) {
                        if (jobClassifyObj[i].appid.toString() !== "92af1586-4fc4-4f79-a908-269a6c904fc5") {
                            var job = {
                                id: jobClassifyObj[i].id,
                                title: jobClassifyObj[i].title,
                                start: jobClassifyObj[i].start,
                                end: jobClassifyObj[i].end,
                                userid: jobClassifyObj[i].userid,
                                cuserid: jobClassifyObj[i].cuserid,
                                IsCycle: jobClassifyObj[i].IsCycle,
                                IsRead: jobClassifyObj[i].IsRead,
                                Attendees: jobClassifyObj[i].Attendees,
                                ReferUrl: jobClassifyObj[i].ReferUrl,
                                color: ('#' + (colorObj[checkUserObj[jobClassifyObj[i].cuserid] || ''].border)) || 'red',
                                ReferID: jobClassifyObj[i].ReferID
                            };
                            cjobClassifyObj[jid] = job;
                            jid++;
                        }
                    }
                    if (viewName == "agendaDay") {
                        //rong add 2013-06-06 任务整合到日历
                        var jobItemDiv = '';
                        var _riYear = parseInt($("#schedule-time-list-year").attr("timevalue"));
                        var _riMonth = parseInt($("#schedule-time-list-month").attr("timevalue")) - 1;
                        var _riDay = parseInt($("#schedule-time-list-day").attr("timevalue"));
                        if (jobDate > 1) {
                            var _ridate = new Date();
                            _riYear = _ridate.getFullYear();
                            _riMonth = _ridate.getMonth();
                            _riDay = _ridate.getDate();
                        } else {
                            _riDay = _riDay + jobDate;
                        }
                        var curDate = new Date(_riYear, _riMonth, _riDay, 0, 0, 0);
                        for (var i = 0, len = cjobClassifyObj.length; i < len; i++) {
                            var jobItemHeight = i * 18 + i;
                            var jobItemWidth = $("[class='fc-view fc-view-agendaDay fc-agenda']").find("table[class='fc-agenda-days fc-border-separate']").find("thead tr th:eq(1)").width() - 4;
                            var str = cjobClassifyObj[i].start;
                            var tempStrs = str.split(" ");
                            var dateStrs = tempStrs[0].split("-");
                            var year = parseInt(dateStrs[0], 10);
                            var month = parseInt(dateStrs[1], 10) - 1;
                            var day = parseInt(dateStrs[2], 10);
                            var jobStartDate = new Date(year, month, day, 0, 0, 0);

                            str = cjobClassifyObj[i].end;
                            tempStrs = str.split(" ");
                            dateStrs = tempStrs[0].split("-");
                            year = parseInt(dateStrs[0], 10);
                            month = parseInt(dateStrs[1], 10) - 1;
                            day = parseInt(dateStrs[2], 10);
                            var jobEndDate = new Date(year, month, day, 0, 0, 0); //任务的开始、结束时间，用于计算两边是否应该有三角形箭头 两头的三角形箭头预留60px，每个30px
                            var left = 0, right = 0;
                            if (jobStartDate.getTime() < curDate.getTime()) {//预留30px放三角箭头
                                jobItemWidth = jobItemWidth - 30;
                                left = 30;
                                var cstr = $("[class='fc-view fc-view-agendaDay fc-agenda']").find("table[class='fc-agenda-days fc-border-separate']").find("thead tr th:eq(1)").attr("gotodate");
                                var cdateStrs = cstr.split("-");
                                var cyear = parseInt(cdateStrs[0], 10);
                                var cmonth = parseInt(cdateStrs[1], 10) - 1;
                                var cday = parseInt(cdateStrs[2], 10);
                                var cjobStartDate = new Date(cyear, cmonth, cday, 0, 0, 0);
                                if (cjobStartDate.getTime() == jobStartDate.getTime()) {
                                    jobItemWidth = jobItemWidth + 30;
                                    left = 0;
                                } else {
                                    jobItemDiv += '<div id=\"jobd_' + cjobClassifyObj[i].id + '_lefttask\" class="jobLeft jobhover showtaskview" taskid="' + cjobClassifyObj[i].ReferID + '" style="position:absolute;background-color:' + cjobClassifyObj[i].color + ';width:30px;height:18px;top:' + jobItemHeight + 'px;left:0px;text-align:left;"></div>';
                                }
                            }
                            if (jobEndDate.getTime() > curDate.getTime()) {//预留30px放三角箭头
                                jobItemWidth = jobItemWidth - 30;
                                right = 30;
                                var cstr = $("[class='fc-view fc-view-agendaDay fc-agenda']").find("table[class='fc-agenda-days fc-border-separate']").find("thead tr th:eq(1)").attr("gotodate");
                                var cdateStrs = cstr.split("-");
                                var cyear = parseInt(cdateStrs[0], 10);
                                var cmonth = parseInt(cdateStrs[1], 10) - 1;
                                var cday = parseInt(cdateStrs[2], 10);
                                var cjobEndDate = new Date(cyear, cmonth, cday, 0, 0, 0);
                                if (cjobEndDate.getTime() == jobEndDate.getTime()) {
                                    jobItemWidth = jobItemWidth + 30;
                                    right = 0;
                                }
                            }
                            var showparas = JSON.stringify(cjobClassifyObj[i]);
                            jobItemDiv += '<div id=\"jobd_' + cjobClassifyObj[i].id + '\" class="jobhover showtaskview" taskid="' + cjobClassifyObj[i].ReferID + '" style="cursor:pointer;position:absolute;color:#FFFFFF;background-color:' + cjobClassifyObj[i].color + ';width:' + jobItemWidth + 'px;height:18px;top:' + jobItemHeight + 'px;left:' + left + 'px;right:' + right + '"  onclick="fShowJobDetail(this.id,event)" jobdata=\'' + showparas + '\'>&nbsp;' + cjobClassifyObj[i].title + '</div>';
                            if (right == 30) {
                                jobItemDiv += '<div id=\"jobd_' + cjobClassifyObj[i].id + '_righttask\" class="jobRight jobhover showtaskview" taskid="' + cjobClassifyObj[i].ReferID + '" style="position:absolute;background-color:' + cjobClassifyObj[i].color + ';width:30px;height:18px;top:' + jobItemHeight + 'px;left:' + (left + jobItemWidth) + 'px;text-align:right;"></div>';
                            }
                        }
                        $("#jobAgendaWeek").hide();
                        $("#jobAgendaDay").remove();
                        var trHeight = cjobClassifyObj.length * 20, contentHeight = trHeight + 20;
                        if (cjobClassifyObj.length == 0) {
                            trHeight = 20;
                            contentHeight = 40;
                        }
                        if ($("#selectTask").attr("checked") == "checked") {
                            $("[class='fc-view fc-view-agendaDay fc-agenda']").find("table[class='fc-agenda-days fc-border-separate']").find("tbody")
                                .prepend('<tr id="jobAgendaDay" class="fc-first fc-last"><th class="fc-agenda-axis ui-widget-header fc-first" style="height:' + trHeight + 'px;background-color:#C8C8C8;border:1px solid #F5F5F5;border-right:none;text-align:center;">任务</th><td style="height:' + trHeight + 'px;background-color:#F9F9F9;border:1px solid #FFB320;border-left:none;"><div class="fc-day-content"><div style="position:relative">' + jobItemDiv + '</div></div></td><td class="fc-agenda-gutter ui-widget-content fc-last" style="height:' + trHeight + 'px;border-bottom:none;">&nbsp;</td></tr>');
                            $(".app_schedule_view_scroll_container").parent().css({ "top": contentHeight + 6 });
                        }
                    } else if (viewName == "agendaWeek") {
                        //rong add 2013-06-06 任务整合到日历

                        var weekJobItemDiv = '';
                        var weekStartDate = $("[class='fc-mon fc-col0 ui-widget-header']").attr("gotodate").split("-"); //本周第一天日期
                        var weekEndDate = $("[class='fc-sun fc-col6 ui-widget-header']").attr("gotodate").split("-"); //本周第一天日期
                        weekStartDate = new Date(weekStartDate[0], parseInt(weekStartDate[1]) - 1, weekStartDate[2], 0, 0, 0);
                        weekEndDate = new Date(weekEndDate[0], parseInt(weekEndDate[1]) - 1, weekEndDate[2], 0, 0, 0);
                        var gridCellWidth = $("[class='fc-mon fc-col0 ui-widget-header']").width();
                        for (var i = 0, len = cjobClassifyObj.length; i < len; i++) {
                            var jobItemHeight = i * 18 + i + 1; //加后面的i是把间隔的高度算在内 18是div的高度
                            var str = cjobClassifyObj[i].start;
                            var tempStrs = str.split(" ");
                            var dateStrs = tempStrs[0].split("-");
                            var year = parseInt(dateStrs[0], 10);
                            var month = parseInt(dateStrs[1], 10) - 1;
                            var day = parseInt(dateStrs[2], 10);
                            var jobStartDate = new Date(year, month, day, 0, 0, 0);

                            str = cjobClassifyObj[i].end;
                            tempStrs = str.split(" ");
                            dateStrs = tempStrs[0].split("-");
                            year = parseInt(dateStrs[0], 10);
                            month = parseInt(dateStrs[1], 10) - 1;
                            day = parseInt(dateStrs[2], 10);
                            var jobEndDate = new Date(year, month, day, 0, 0, 0); //任务的开始、结束时间，用于计算两边是否应该有三角形箭头 两头的三角形箭头预留60px，每个30px

                            //计算任务在本周显示的最大宽度
                            var jobWidth = 0;
                            //计算左边距离
                            var left = (jobStartDate.getTime() - weekStartDate.getTime()) / 86400000;
                            var jobItemWidth = 0; //最大的距左距离
                            if (left < 0) {//任务开始时间比本周第一天早
                                if (weekStartDate.getTime() > jobStartDate.getTime()) {//本周第一天比任务的开始时间大，任务条左端减30px，用左三角形替换
                                    jobItemWidth = 30; //记得在div任务条左边加三角形
                                    weekJobItemDiv += '<div id=\"jobwd_' + cjobClassifyObj[i].id + '_lefttask\" class="jobLeft jobhover showtaskview" taskid="' + cjobClassifyObj[i].ReferID + '" style="position:absolute;background-color:' + cjobClassifyObj[i].color + ';width:30px;height:18px;top:' + jobItemHeight + 'px;left:0px;text-align:left;"></div>';
                                }
                            } else {
                                jobItemWidth = left * gridCellWidth;
                            }
                            //计算右边距离
                            var right = (jobEndDate.getTime() - weekEndDate.getTime()) / 86400000;
                            var rightFlag = 0; //右边是否加三角形标志0：不加；1加
                            if (right < 0) {
                                if (jobStartDate.getTime() >= weekStartDate.getTime()) {//从具体的某天开始
                                    jobWidth = ((jobEndDate.getTime() - jobStartDate.getTime()) / 86400000 + 1) * gridCellWidth;
                                } else {
                                    jobWidth = ((jobEndDate.getTime() - weekStartDate.getTime()) / 86400000 + 1) * gridCellWidth - 30; //此处的30是给左边用的
                                }
                            } else if (right == 0) {
                                if (jobStartDate.getTime() >= weekStartDate.getTime()) {
                                    jobWidth = ((weekEndDate.getTime() - jobStartDate.getTime()) / 86400000 + 1) * gridCellWidth;
                                } else {
                                    jobWidth = ((weekEndDate.getTime() - weekStartDate.getTime()) / 86400000 + 1) * gridCellWidth - 30; //此处的30是给左边用的
                                }
                            } else {//本周最后一天比任务的结束时间小，任务条右端减30px，用右三角形替换
                                if (jobStartDate.getTime() >= weekStartDate.getTime()) {
                                    jobWidth = ((weekEndDate.getTime() - jobStartDate.getTime()) / 86400000 + 1) * gridCellWidth - 30;
                                } else {
                                    jobWidth = ((weekEndDate.getTime() - weekStartDate.getTime()) / 86400000 + 1) * gridCellWidth - 60;
                                }
                                rightFlag = 1;
                            }
                            var showparas = JSON.stringify(cjobClassifyObj[i]);
                            weekJobItemDiv += '<div id=\"jobwd_' + cjobClassifyObj[i].id + '\" class="jobhover showtaskview" taskid="' + cjobClassifyObj[i].ReferID + '" style="cursor:pointer;position:absolute;color:#FFFFFF;background-color:' + cjobClassifyObj[i].color + ';width:' + jobWidth + 'px;height:18px;top:' + jobItemHeight + 'px;left:' + jobItemWidth + 'px" onclick="fShowJobDetail(this.id,event)" jobdata=\'' + showparas + '\'>&nbsp;' + cjobClassifyObj[i].title + '</div>';
                            if (rightFlag == 1) {
                                weekJobItemDiv += '<div id=\"jobwd_' + cjobClassifyObj[i].id + '_righttask\" class="jobRight jobhover showtaskview" taskid="' + cjobClassifyObj[i].ReferID + '" style="position:absolute;background-color:' + cjobClassifyObj[i].color + ';width:30px;height:18px;top:' + jobItemHeight + 'px;left:' + (jobItemWidth + jobWidth) + 'px;text-align:right;"></div>';
                            }
                        }
                        $("#jobAgendaDay").hide();
                        $("#jobAgendaWeek").remove();

                        var trHeight = cjobClassifyObj.length * 20, contentHeight = trHeight + 20;
                        if (cjobClassifyObj.length == 0) {
                            trHeight = 20;
                            contentHeight = 40;
                        }
                        if ($("#selectTask").attr("checked") == "checked") {
                            $("[class='fc-view fc-view-agendaWeek fc-agenda']").find("table[class='fc-agenda-days fc-border-separate']").find("tbody")
                                .prepend('<tr id="jobAgendaWeek" class="fc-first fc-last"><td class="fc-agenda-axis ui-widget-header fc-first" style="height:' + trHeight + 'px;background-color:#C8C8C8;border:1px solid #F5F5F5;border-right:none;text-align:center;">任务</th><th colspan="7"><div style="position:relative;border:1px solid #FFB320;border-left:none;height:' + trHeight + 'px;width:100%;background-color:#F9F9F9;">' + weekJobItemDiv + '</div></td><td class="fc-agenda-gutter ui-widget-header fc-last" >&nbsp;</td></tr>');
                            $(".app_schedule_view_scroll_container").parent().css({ "top": contentHeight + 6 });
                        }
                    }
                    //rong add 2013-06-06 任务整合到日历
                    $(".jobhover").each(function () {
                        var _job = $(this);
                        _job.hover(
                            function () {
                                var jobId = $(this).attr("id");
                                if (jobId.split("_").length == 2) {
                                    $("#" + jobId).addClass("fc-view-month_control-view-detail_job");
                                    if ($("#" + jobId + "_righttask").length == 1) {
                                        $("#" + jobId + "_righttask").addClass("fc-view-month_control-view-detail_job");
                                    }
                                    if ($("#" + jobId + "_lefttask").length == 1) {
                                        $("#" + jobId + "_lefttask").addClass("fc-view-month_control-view-detail_job");
                                    }
                                } else if (jobId.split("_").length == 3) {
                                    var jobIdSegs = jobId.split("_");
                                    jobId = jobIdSegs[0] + "_" + jobIdSegs[1];
                                    $("#" + jobId).addClass("fc-view-month_control-view-detail_job");
                                    if ($("#" + jobId + "_righttask").length == 1) {
                                        $("#" + jobId + "_righttask").addClass("fc-view-month_control-view-detail_job");
                                    }
                                    if ($("#" + jobId + "_lefttask").length == 1) {
                                        $("#" + jobId + "_lefttask").addClass("fc-view-month_control-view-detail_job");
                                    }
                                }
                            },
                            function () {
                                var jobId = $(this).attr("id");
                                if (jobId.split("_").length == 2) {
                                    $("#" + jobId).removeClass("fc-view-month_control-view-detail_job");
                                    if ($("#" + jobId + "_righttask").length == 1) {
                                        $("#" + jobId + "_righttask").removeClass("fc-view-month_control-view-detail_job");
                                    }
                                    if ($("#" + jobId + "_lefttask").length == 1) {
                                        $("#" + jobId + "_lefttask").removeClass("fc-view-month_control-view-detail_job");
                                    }
                                } else if (jobId.split("_").length == 3) {
                                    var jobIdSegs = jobId.split("_");
                                    jobId = jobIdSegs[0] + "_" + jobIdSegs[1];
                                    $("#" + jobId).removeClass("fc-view-month_control-view-detail_job");
                                    if ($("#" + jobId + "_righttask").length == 1) {
                                        $("#" + jobId + "_righttask").removeClass("fc-view-month_control-view-detail_job");
                                    }
                                    if ($("#" + jobId + "_lefttask").length == 1) {
                                        $("#" + jobId + "_lefttask").removeClass("fc-view-month_control-view-detail_job");
                                    }
                                }
                            }
                        );
                    });
                }
            }
        });



        var fShowScheduleDetail = function (opt) {
            var _option = opt || {};
            var _calEvent = _option.data, _jsEvent = _option.event, _container = _option.container ? _option.container : $('body'), _direction = _option.direction || 'top';
            //当前日程不允许其它用户查看
            if (attentionUserObj[_calEvent.userid].SharingType == '2') {
                return;
            }
            var start = _calEvent.start, end = _calEvent.end, title = _calEvent.title, dataId = _calEvent.id, participants = _calEvent.Attendees;
            var _pageX, _pageY, _offsetLeft = _option.offsetleft || 0;
            var _showContainer = $('#app_schedule_view_detail_show'); //移除所有元素
            if (_showContainer.length > 0) {
                var _curDataId = _showContainer.attr('dataid');
                _showContainer.remove();
                if (dataId == _curDataId) {
                    return;
                }
            }

            _container.append(detail_tpl);
            var _offsetTop = 0;
            var _$viewObj = $('#app_schedule_view_detail_show');
            var _triangle;
            //弹出层在页面中的位置　
            switch (_direction) {
                case 'top':
                    _pageX = _option.left || (_jsEvent.pageX - 125),
                        _pageY = _option.top || (_jsEvent.pageY - 145);
                    break;
                case 'left':
                    _pageX = (_option.left) || (_jsEvent.pageX - 260),
                        _pageY = _option.top || (_jsEvent.pageY - 110);
                    _triangle = _$viewObj.find('i');
                    _triangle.css({ 'left': '250px', 'bottom': '50px', 'borderColor': 'transparent transparent transparent #D9D9D9' });
                    _triangle.find('s').css('borderColor', 'transparent transparent transparent #F0F4F7');
                    break;
                case 'right':
                    _pageX = (_option.left) || (_jsEvent.pageX - 260),
                        _pageY = _option.top || (_jsEvent.pageY - 110);
                    _triangle = _$viewObj.find('i');
                    _triangle.css({ 'left': '-16px', 'bottom': '50px', 'borderColor': 'transparent #D9D9D9 transparent transparent' });
                    _triangle.find('s').css('borderColor', 'transparent #F0F4F7 transparent transparent ');
                    break;
            }
            //如果弹出层已经到达顶部,则重新定位光标
            if (_option.data.appid == "1a289157-8af2-4379-94e0-2b04b1b5395d" || _option.data.id.split("--").length == 5) {//任务的定位
                return true;
            } else {//保留原来的逻辑
                var height = $("#quick_post").height(); //新增的，原来没有height
                height = height - 178; //新增的，原来没有height
                if (_pageY < 20) {//现在是20的地方10
                    _offsetTop = 20 - _pageY;
                    _pageY = 32; //原来是10
                    _triangle = _$viewObj.find('i');
                    _triangle.css({ 'bottom': (64 + _offsetTop) }); //原来64的地方是50
                } else if (_pageY > height) {//原来height的地方都是490
                    _offsetTop = _pageY - height;
                    _pageY = height;
                    _triangle = _$viewObj.find('i');
                    _triangle.css({ 'bottom': (50 - _offsetTop) });
                }
                switch (_option.top) {
                    case 38:
                    case 58:
                    case 78: _pageY = 26; _triangle = _$viewObj.find('i');
                        _triangle.css({ 'bottom': (78 - _option.top) }); break;
                }
            }

            //判断当前的时间类型,如果是字符型则强制转换成时间类型
            if (typeof start === 'string') {
                var startTime, endTime;
                startTime = new Date(start);
                if ($.isNaN(startTime)) startTime = start.toDate();
                if ($.isNaN(startTime)) {
                    startTime = new Date(start.replace('T', ' ').replace('Z', ' ').replace(/-/g, '/'));
                }
                endTime = new Date(end);
                if ($.isNaN(endTime)) endTime = end.toDate();
                if ($.isNaN(endTime)) {
                    endTime = new Date(end.replace('T', ' ').replace('Z', ' ').replace(/-/g, '/'));
                }
                start = startTime, end = endTime;
            }
            var _$date = $('.app_schedule_view_view_date');
            var _$week = $('.app_schedule_view_view_week');
            var _$time = $('.app_schedule_view_view_time');
            var _$title = $('.app_schedule_view_view_subject');
            var _$header = $('.app_schedule_view_tips_headimg');
            var _$participants = $('.app_schedule_view_view_participants');
            var _curDate = new Date();
            //判断是否可以删除编辑此条日程日历

            //如果我是参与人，也显示是我的日历

            if (currentUserId == _calEvent.userid || !_calEvent.cuserid) { //@TODO
                if ((!_calEvent.cuserid || currentUserId == _calEvent.cuserid) && (start > (_curDate) || (start.format('yyyyMMdd') == _curDate.format('yyyyMMdd')))) {
                    $('.app_schedule_view_tips_write').show();
                } else {
                    $('.app_schedule_view_tips_write').hide();
                }
                if (!_calEvent.cuserid || currentUserId == _calEvent.cuserid) {
                    $('.app_schedule_view_tips_delete').show();
                } else {
                    $('.app_schedule_view_tips_delete').hide();
                }
                $('.app_schedule_view_view_username').html('我的日历');
            } else {
                $('.app_schedule_view_tips_delete').hide();
                $('.app_schedule_view_tips_write').hide();
                $('.app_schedule_view_view_username').html(attentionUserObj[_calEvent['userid']].Name + '的日历');

                //如果这条日历不是当前登录用户的，则要显示用户名
            }
            var startHours = start.getHours();
            var startMinutes = start.getMinutes();
            var endHours = end.getHours();
            var endMinutes = end.getMinutes();
            var startHM = (startHours < 10 ? "0" + startHours : startHours) + ":" + (startMinutes < 10 ? "0" + startMinutes : startMinutes);
            var endHM = (endHours < 10 ? "0" + endHours : endHours) + ":" + (endMinutes < 10 ? "0" + endMinutes : endMinutes);

            _$date.html(window['calendarFormat'](start, null, 'yyyy年MM月dd日'));
            _$week.html(window['calendarFormat'](start, null, 'dddd'));
            _$time.html('时　间：' + startHM + '至' + endHM);
            //_$time.html('时　间：' + window['calendarFormat'](start, null, 'HH:mm') + '至' + window['calendarFormat'](end, null, 'HH:mm'));
            _$title.html('日　程：' + title).attr('title', title);
            _$header.attr('src', attentionUserObj[_calEvent['userid']].Icon);
            _$participants.html('参与人：' + participants).attr('title', participants);
            _$viewObj.css({ 'position': 'absolute', 'zIndex': '9', left: _pageX - _offsetLeft, top: (_pageY - 22) }).show().attr('dataid', dataId).attr('tpid', _calEvent['userid'] || '');

            if (_option.data.appid == "1a289157-8af2-4379-94e0-2b04b1b5395d" || _option.data.id.split("--").length == 5) {
                start = _calEvent.taskStart, end = _calEvent.taskEnd,
                    $('.app_schedule_view_view_username').html('我的任务');
                _$date.remove();
                _$week.remove();
                _$time.html('执行期限：' + window['calendarFormat'](start, null, 'yyyy-MM-dd HH:mm') + '至' + window['calendarFormat'](end, null, 'yyyy-MM-dd HH:mm'));
                _$title.html('任务：' + title).attr('title', title);
                $(".app_schedule_view_tips_delete").remove();
                $(".app_schedule_view_tips_write").remove();
                $(".app_schedule_view_tips_look").removeAttr("target");
                $(".app_schedule_view_tips_look").attr("taskid", _calEvent.ReferID);
                $(".app_schedule_view_tips_look").addClass("showtaskview");
                _$viewObj.css({ 'position': 'absolute', 'zIndex': '9', left: _pageX - _offsetLeft, top: (_pageY - 18) }).show().attr('dataid', dataId).attr('tpid', _calEvent['userid'] || '');
                return false;
            }

            //生成dom结构后绑定事件
            fBindDetailEvent(_container);
            //_container.append(_cloneObj);
        }

        //点击添加按钮往后台快速添加日程
        $('.app_schedule_view_add_btn').click(function () {
            var subject = $.trim($add_schedule.find('.app_schedule_view_add_subject').val());
            var participants = AddSchedule_select.selectedData();
            if (!subject) {
                seajs.use("default/special/js/assets/util.js", function (model) {
                    model.i8alert({ str: "请输入主题", type: 1 });
                });
                return;
            }
            var _len = cpec.string.fByteLength(subject);
            if (_len > 50) {
                seajs.use("default/special/js/assets/util.js", function (model) {
                    model.i8alert({ str: "您输入的字符数超过限制", type: 1 });
                });
                return;
            }
            if (participants == "") {
                seajs.use("default/special/js/assets/util.js", function (model) {
                    model.i8alert({str:"参与人不能为空",type:1});
                });
                return;
            }
            //$(".fw_ksninput_slted").each(function (i) {
            //    if (i == 0) {
            //        participants = $(this).attr("data-uid");
            //    } else {
            //        participants = participants + ";" + $(this).attr("data-uid");
            //    }
            //});
            var result = fMonthViewDateHandle();
            if (!result) return;
            var _title = $.trim(subject);
            add_schedule_obj.title = _title;
            $.ajax({
                url: url + '?fn=addquickschedule',
                type: 'post',
                data: { 'Title': encodeURIComponent(_title), 'StartTime': add_schedule_obj.start.format('yyyy-MM-dd hh:mm:ss'), 'EndTime': add_schedule_obj.end.format('yyyy-MM-dd hh:mm:ss'), 'Attendees': participants },
                success: function (data) {
                    if (data.Result) {
                        /*
                         add_schedule_obj.id = (data.ReturnObject || {}).ID;  // 保存数据的id
                         //更新已保存的 eventData数据
                         var _curDayEventsKey = 'event_' + add_schedule_obj.start.format('yyyyMMdd');
                         var _curDayEvents = eventClassifyObj[_curDayEventsKey];
                         if (!!_curDayEvents) {
                         _curDayEvents.count++;
                         _curDayEvents.data.push(add_schedule_obj);
                         } else {
                         eventClassifyObj[_curDayEventsKey] = {};
                         eventClassifyObj[_curDayEventsKey].count = 1;
                         eventClassifyObj[_curDayEventsKey].data = [add_schedule_obj];
                         }
                         eventClassifyObj = deepCopy(eventClassifyObj); // 将自身复制　important 否则obj是引用类型，在其它地方会改变 obj的值，将直接影响到  eventClassifyObj
                         eventClassifyObjCopy = deepCopy(eventClassifyObj); // 更新 副本数据
                         //添加成功后日程控件需要重新渲染
                         calendarObj.fullCalendar('render');
                         $add_schedule.hide(); //添加成功后隐藏 添加弹出层
                         */
                        $add_schedule.hide();
                        $('#quick_post').fullCalendar('refetchEvents');
                    }
                }
            });


        });

        //点击关闭按钮关闭查看弹出层
        $('.app_schedule_view_tips_close').live('click', function () {
            $('.app_schedule_view_add').hide();
        });

        //点击删除按钮进行日历删除操作
        $(".app_schedule_add_ok_btn").live("click", function () {
            var _dataId = deleteDataId;
            fDeleteShedule(_dataId, function () {
                //如果当前是查看更多的弹出层，则还需要移除查看更多
                ScheduleBox.closed();
            });
        });

        //循环日历中的取消编辑
        $('.app_schedule_edit_canle_btn').live('click', function () {
            ScheduleBox.closed();
            if (window['editCycleCallBack']) {
                window['editCycleCallBack']();
            }
        });

        //修改日程日历的时间　
        $('.app_schedule_edit_ok_btn').live('click', function () {
            var _changeType = '';
            var _changeType = $('input[name="ChangeType"]:checked').val() || '1';
            fEidtCalendarAjax(window['editCycleEvent'], _changeType, window['editCycleCallBack'], function () {
                ScheduleBox.closed();
                fUpdateEvent();
                var curViewName = $calendarContainer.fullCalendar('getView').name;
                $calendarContainer.fullCalendar('changeView', curViewName);
            });
        });

        $(".app_schedule_add_canle_btn").live("click", function () {
            ScheduleBox.closed();
        });
        /*
         fun         删除日历
         argument    id:日历id　　callback:操作后的回调函数
         return
         */
        var fDeleteShedule = function (id, callBack) {
            var ChangeType = $('input[name="ChangeType"]:checked').val() || '1';
            if (!ChangeType) {
                ChangeType = '1';
            }
            $.ajax({
                type: "get",
                dataType: "json",
                data: {
                    id: id.split('--')[0],
                    ChangeType: ChangeType
                },
                url: fw_globalConfig.root + 'Handler/AppHandler.ashx?fn=delschedule',      //提交到一般处理程序请求数据
                success: function (data) {
                    if (data.Result) {
                        //操作成功提交页面
                        if (isMonthView) {
                            $('#app_schedule_month_view_more_detail').remove();
                            calendarObj.fullCalendar('render');
                        } else {
                            calendarObj.fullCalendar('removeEvents', id);
                        }
                        if ($('.app_schedule_add_save_btn').length > 0) {
                            fw_setTimeshow("日程删除成功!", $(".app_schedule_add_save_btn"));
                        }
                    }
                    else {
                        if ($('.app_schedule_add_save_btn').length > 0) {
                            fw_setTimeshow("日程删除失败!", $(".app_schedule_add_save_btn"));
                        }
                    }
                    $('#js_update_schedule_show').remove();
                    callBack();
                }
            });
        }

        var ScheduleBox = {};
        var fBindDetailEvent = function ($container) {
            $container.undelegate('.viewDetail').delegate('a', 'click.viewDetail', function () {
                var _$me = $(this);
                var _className = _$me.attr('class');
                var _$view_detail = $('#app_schedule_view_detail_show');
                switch (_className) {
                    case 'app_schedule_view_tips_delete':
                        var _orgDataId = $('#app_schedule_view_detail_show').attr('dataid');
                        var _flag = cycleFlagObj[_orgDataId];
                        var _dataId = _orgDataId.split('--')[0];
                        deleteDataId = _orgDataId;
                        if (_flag) {
                            var _strhtml = $("#js_update_schedule").html();
                            ScheduleBox = fw_oshow_box.createNew2();
                            ScheduleBox.fshow_box({
                                title: "此次删除的适用范围是：",    //标题
                                shtml_id: "js_update_schedule_show", //弹出层容器ID
                                dialogtype: 0,      //显示模式 0模态，1非模态
                                scontent: _strhtml, // html 代码
                                success: function (data) {  //绑定的回调函数

                                }
                            });
                        }
                        else {
                            fDeleteShedule(_orgDataId, function () {
                                //如果当前是查看更多的弹出层，则还需要移除查看更多
                                _$view_detail.remove();
                            });
                        }
                        return false;
                    case 'app_schedule_view_tips_write': //编辑日历
                        location.href = ('EditSchedule.aspx?id=' + (_$view_detail.attr('dataid') || '').split('--')[0] + '&a=' + accountId);
                        _$view_detail.remove();
                        return false;
                    case 'app_schedule_view_tips_look': //查看日历详细信息
                        location.href = ('ScheduleView.aspx?id=' + (_$view_detail.attr('dataid') || '').split('--')[0] + '&tpid=' + _$view_detail.attr('tpid') + '&a=' + accountId);
                        _$view_detail.remove();
                        return false;
                }
            });
        }


        $('#quick_post').delegate('div,li', 'click', function (event) {
            var $me = $(this);
            var controlType = $me.attr('controltype');
            switch (controlType) {
                case 'control-view-detail':
                    var data = $me.data('eventdata');
                    var position = $me.position() || {};
                    var left = (position.left || 0), top = (position.top || 0), _detailDirection = '', _offsetLeft = 0;
                    var _start = fGetDateFromString(data.start);  // new Date(data.start);
                    _weekDay = _start.getDay();

                    //如果查看的是弹出层中详细信息
                    if (event.target.tagName === 'LI') {
                        _detailDirection = $('.app_schedule_month_view_more').attr('detaildirection');
                        switch (_detailDirection) {
                            case 'right':
                                left = left + 160;
                                top = top - 64;
                                break;
                            case 'left':
                                left = left - 260;
                                top = top - 64;
                                break;
                        }
                        fShowScheduleDetail({ 'data': data, 'event': event, 'left': left, 'top': top, 'container': $me.parent(), 'direction': _detailDirection, offsetleft: _offsetLeft });
                        return false;
                    }

                    if (_weekDay > 3 || _weekDay == 0) {
                        _detailDirection = 'left';
                        left = position.left - 260; // -130;
                        top = position.top - 64; // +58;
                    }
                    else {
                        _detailDirection = 'right';
                        top = top - 64; // +58;
                        left = left + 104;
                    }
                    fShowScheduleDetail({ 'data': data, 'event': event, 'left': left, 'top': top, 'container': $me.parent(), 'direction': _detailDirection, offsetleft: _offsetLeft });
                    return false;
                case 'control-view-more':   //用于月视图中的查看更多
                    $view_month_more = $('#app_schedule_month_view_more_detail');
                    var _dataId = $me.attr('eventdayid');
                    var _data = eventClassifyObj[_dataId].data;  //$me.data('eventdata') || [];
                    var _curDate = fGetDateFromString(_data[0].start); //new Date(_data[0].start);
                    if ($("#selectTask").attr("checked") == "checked") {
                        var jobSplitArr = _dataId.split('_')
                        var curd = jobSplitArr[1];
                        var eventyear = parseInt(curd.substr(0, 4), 10);
                        var eventmonth = parseInt(curd.substr(4, 2), 10) - 1;
                        var eventday = parseInt(curd.substr(6, 2), 10);
                        _curDate = new Date(eventyear, eventmonth, eventday, 0, 0, 0);
                    }
                    $('.app_schedule_month_view_time').html(window['calendarFormat'](_curDate, null, 'MM') + '/' + window['calendarFormat'](_curDate, null, 'dd') + '(' + window['calendarFormat'](_curDate, null, 'ddd') + ')');
                    var _dataContainer = $('#app_schedule_month_view_more_list');
                    var _html = '', _curTitle = '';
                    for (var i = 0, len = _data.length; i < len; i++) {
                        _curTitle = _data[i].title;
                        _curTitle = _curTitle.length > 5 ? (_curTitle.substr(0, 5) + '...') : _curTitle;
                        _html += '<li style="position:relative;color:' + _data[i].color + ';"  title="' + _data[i].title + '" controltype="control-view-detail" data-eventdata=\'' + JSON.stringify(_data[i]) + '\' >' + _curTitle + (!(_data[i].IsRead == 0) ? "<span class='app_schedule_show_" + ((_data[i].IsRead == 1) ? "new" : "mod") + "_schedule_icon' style='position:absolute;right:5px''></span>" : "") + '</li>'; //     (true?"<span class='app_schedule_show_new_schedule_icon'></span>":"")+ //!event.IsRead
                    }
                    var _weekDay = _curDate.getDay();
                    var _detailDirection = '', _moreDirection = ''; //分别用来标识详情 和更多弹出层从哪边弹出来
                    if (_weekDay < 4 && _weekDay > 0) {
                        _detailDirection = 'right';
                    } else {
                        _detailDirection = 'left';

                    }

                    _dataContainer.html(_html);
                    var _$curDay = $('#day_' + _curDate.format('yyyyMMdd'));
                    // rong add bind li dragDrop
                    $(function () {
                        //限定区域，有回调函数。
                        _dataContainer.find("li").cdragDrop({ fixarea: [$('#quick_post').position().left, $('#quick_post').position().left + $('#quick_post').width() - 100, $('#quick_post').position().top + 70, $('#quick_post').position().top + $('#quick_post').height() - 20] });
                    });
                    //更多弹出层的 left座标值和 top座标值
                    var _position = _$curDay.position();
                    var _positionLeft = _position.left, _positionTop = _position.top - 2;

                    //当前这一列是最后一列，则更多弹出层从左边出来

                    //如果当前为最后一行，则更多弹出层高度需要做特殊处理
                    if ((_$curDay.parent('tr').attr('class') || '').indexOf('fc-last') > -1) {
                        switch (_weekDay) {
                            case 1:
                                $view_month_more.removeAttr('style').css({ 'left': '0', 'bottom': '0' }).show().attr('detaildirection', _detailDirection).show();
                                break;
                            case 0:
                                $view_month_more.removeAttr('style').css({ 'right': '0', 'bottom': '0' }).show().attr('detaildirection', _detailDirection).show();
                                break;
                            default:
                                $view_month_more.removeAttr('style').css({ 'left': _positionLeft, 'bottom': '0' }).show().attr('detaildirection', _detailDirection).show();
                                break;
                        }
                        return false;
                    }

                    //更多默认从右边弹出，如果是最右边一列，则从左边弹出
                    if (_weekDay == 0) {
                        $view_month_more.removeAttr('style').css({ 'top': _positionTop, 'right': '0' }).attr('detaildirection', _detailDirection).show();
                    } else {
                        $view_month_more.removeAttr('style').css({ 'left': _position.left, 'top': _positionTop }).show().attr('detaildirection', _detailDirection).show();
                    }
                    return false;
            }
        })

        //选取人员操作
        $('.app_schedule_staff_selects').delegate('.app_schedule_staff_span', 'click', function () {
            var $me = $(this);
            var _index = $me.attr('index');
            var _ckindex = 'ck' + _index;
            var _style = '';
            if ($me.attr('ckd') === 'ckd') {
                colorArrCopy.unshift(colorObj['ck' + _index]);
                delete colorObj['ck' + _index];
                $me.removeAttr('ckd').removeClass('ck' + _index).removeAttr('style').removeClass('ckdspan');
                $me.find('span').removeAttr('style');
            } else {
                if (colorArrCopy.length == 0) {
                    fw_cpecalert('最多同时查看10人日程！');
                }
                colorObj[_ckindex] = colorArrCopy.shift();
                _style = 'background-color:#' + colorObj[_ckindex].background + ';border:1px solid #' + colorObj[_ckindex].border;
                $me.attr('ckd', 'ckd').addClass(_ckindex).attr('style', _style).addClass('ckdspan');
                $me.find('span').attr('style', 'border-left:1px solid #' + colorObj[_ckindex].border);
            }
            curSelectUserId = $me.attr('uid');
            if (CalendarViewShowType == 1) {
                fGetSelectedFocusUser();
                fUpdateEvent();
            } else {
                LoadCalenderViewList();
            }
        });

        $('.app_schedule_month_view_more_tips_close').live('click', function () {
            $('#app_schedule_month_view_more_detail').hide();
        });
        //rong add 2013-06-04
        (function ($) {
            $.extend({
                //获取鼠标当前坐标
                mouseCoords: function (ev) {
                    if (ev.pageX || ev.pageY) {
                        return { x: ev.pageX, y: ev.pageY };
                    }
                    return {
                        x: ev.clientX + document.body.scrollLeft - document.body.clientLeft,
                        y: ev.clientY + document.body.scrollTop - document.body.clientTop
                    };
                },
                //获取样式值
                getStyle: function (obj, styleName) {
                    return obj.currentStyle ? obj.currentStyle[styleName] : document.defaultView.getComputedStyle(obj, null)[styleName];
                    // return obj.currentStyle ? obj.currentStyle[styleName] : document.defaultView.getComputedStyle(obj,null).getPropertyValue(styleName);
                }
            });
            // 元素拖拽插件
            $.fn.cdragDrop = function (options) {
                //编辑普通的日程日历
                var crevertFunc = function () { };
                var opts = $.extend({}, $.fn.cdragDrop.defaults, options);
                return this.each(function () {
                    //是否正在拖动
                    var bDraging = false;
                    //移动的元素
                    var moveEle = $(this);
                    //当前移动的事件所在的日期所在的矩阵单元格
                    var curGridDateX = 0;
                    var curGridDateY = 0;
                    //点击哪个元素，以触发移动。
                    //该元素需要是被移动元素的子元素（比如标题等）
                    var focuEle = opts.focuEle ? $(opts.focuEle, moveEle) : moveEle;
                    if (!focuEle || focuEle.length <= 0) {
                        //alert('focuEle is not found! the element must be a child of ' + this.id);
                        return false;
                    }
                    var initX = 0, initY = 0;
                    // initDiffX|Y : 初始时，鼠标与被移动元素原点的距离
                    // moveX|Y : 移动时，被移动元素定位位置 (新鼠标位置与initDiffX|Y的差值)
                    // 如果定义了移动中的回调函数，该对象将以参数传入回调函数。
                    var dragParams = { initDiffX: '', initDiffY: '', moveX: '', moveY: '' };
                    //被移动元素，需要设置定位样式，否则拖拽效果将无效。
                    //moveEle.css({ 'position': 'absolute', 'left': '0', 'top': '0' });
                    //点击时，记录鼠标位置
                    //DOM写法： getElementById('***').onmousedown= function(event);
                    focuEle.bind('mousedown', function (e) {
                        //标记开始移动
                        bDraging = true;
                        //改变鼠标形状
                        moveEle.css({ 'cursor': 'pointer' });
                        //捕获事件。（该用法，还有个好处，就是防止移动太快导致鼠标跑出被移动元素之外）
                        if (moveEle.get(0).setCapture) {
                            moveEle.get(0).setCapture();
                        }
                        //（实际上是鼠标当前位置相对于被移动元素原点的距离）
                        // DOM写法：(ev.clientX + document.body.scrollLeft - document.body.clientLeft) - document.getElementById('***').style.left;
                        //dragParams.initDiffX = $.mouseCoords(e).x - $('#testfull').position().left; //moveEle.position().left;
                        //dragParams.initDiffY = $.mouseCoords(e).y - $('#testfull').position().top; //moveEle.position().top;
                        initX = $.mouseCoords(e).x, initY = $.mouseCoords(e).y;
                        //鼠标按下的时候确定当前是哪一天，落在哪一个格子内 left和top分别加上10便于准确定位 不准
                        //curGridDateX = parseInt(($('#app_schedule_month_view_more_detail').position().left + 10) / 114); //放在横向格子
                        //curGridDateY = parseInt(($('#app_schedule_month_view_more_detail').position().top + 10) / 100); //放在纵向格子
                        //根据矩阵单元来推算
                        var _thisdataeventdatadown = $(this).attr("data-eventdata");
                        var _thisEventdown = JSON.parse(_thisdataeventdatadown);
                        var _thisEventStartTime = _thisEventdown.start.substr(0, 10).split("-");
                        var _eventTimeValue = _thisEventStartTime[0] + _thisEventStartTime[1] + _thisEventStartTime[2];
                        var dataArr = new Array();
                        var _thismonthfirstdate = $('div[class="fc-view fc-view-month fc-grid"]').find('table[class="fc-border-separate"]').find("tbody").find("tr[class='fc-week0 fc-first']").find("td:eq(0)").attr("id").split("_")[1];
                        $('div[class="fc-view fc-view-month fc-grid"]').find('table[class="fc-border-separate"]').find("tbody").find("tr").each(function (i, item) {
                            var _thisTr = $(this);
                            var row = i + 1;
                            _thisTr.find("td").each(function (j, jitem) {
                                var col = j + 1;
                                dataArr.push($(jitem).attr("id").split("_")[1]);
                            });
                        });
                        var _overFlag = false;
                        var _index = 0;
                        for (var i = 1; i < 7; i++) {
                            for (var j = 1; j < 8; j++) {
                                if (_eventTimeValue == dataArr[_index]) {
                                    curGridDateX = i - 1;
                                    curGridDateY = j - 1;
                                    _overFlag = true;
                                    break;
                                }
                                _index = _index + 1;
                            }
                            if (_overFlag) {
                                break;
                            }
                        }
                    });
                    var _moveThis = null;
                    var dDate = null;
                    var deDate = null;
                    //移动过程
                    focuEle.bind('mousemove', function (e) {//天的宽度是114，高是100，据此计算落到哪天
                        if (bDraging) {
                            //被移动元素的新位置，实际上鼠标当前位置与原位置之差
                            //实际上，被移动元素的新位置，也可以直接是鼠标位置，这也能体现拖拽，但是元素的位置就不会精确。
                            dragParams.moveX = $.mouseCoords(e).x; //+ dragParams.initDiffX;
                            dragParams.moveY = $.mouseCoords(e).y; // + dragParams.initDiffY;
                            var _thisWidth = $(this).width();
                            var _thisHeight = $(this).height();
                            var _thisTitle = $(this).attr("title");
                            var _thisdataeventdata = $(this).attr("data-eventdata");
                            var _thiscontroltype = $(this).attr("controltype");
                            if (!_moveThis) {
                                _moveThis = $("<div  class='control-view-detail fc-event fc-event-draggable fc-corner-left fc-corner-right ui-draggable' data-eventdata='" + _thisdataeventdata + "' controltype='" + _thiscontroltype + "' unselectable='on'><span class='fc-event-title' style='color:#038BC0' title='" + _thisTitle + "'>" + _thisTitle + "</span></div>");
                                $("body").append(_moveThis);
                            }
                            _moveThis.show();
                            _moveThis.css({ position: "absolute", width: 108, height: _thisHeight, background: "#EAEAEA" });

                            //                            //是否限定在某个区域中移动.
                            //                            //fixarea格式: [x轴最小值,x轴最大值,y轴最小值,y轴最大值]
                            if (opts.fixarea) {
                                if (dragParams.moveX < opts.fixarea[0]) {
                                    dragParams.moveX = opts.fixarea[0]
                                }
                                if (dragParams.moveX > opts.fixarea[1]) {
                                    dragParams.moveX = opts.fixarea[1]
                                }
                                if (dragParams.moveY < opts.fixarea[2]) {
                                    dragParams.moveY = opts.fixarea[2]
                                }
                                if (dragParams.moveY > opts.fixarea[3]) {
                                    dragParams.moveY = opts.fixarea[3]
                                }
                            }
                            //计算日期落在哪一个格子内，同时判断移到目标格子后是加还是减相应的日期数
                            var _thisEvent = JSON.parse(moveEle.attr("data-eventdata"));
                            dDate = new Date(_thisEvent.start);
                            deDate = new Date(_thisEvent.end);
                            var gridWidth = 146, gridHeight = 100;
                            if ($("#selectTask").attr("checked") == "checked") {//选择人物的拖动
                                gridWidth = $("[class='fc-view fc-view-month fc-grid']").find("table[class='fc-agenda-days fc-border-separate']").find("tbody tr:eq(0) th:eq(0)").width();
                                gridHeight = $("[class='fc-view fc-view-month fc-grid']").find("table[class='fc-agenda-days fc-border-separate']").find("tbody tr:eq(0) th:eq(0)").height();
                            }
                            dragParams.initDiffX = (dragParams.moveX - $('.fc-content').position().left) / gridWidth; //=0横向第一格 =6横向第七格
                            dragParams.initDiffY = (dragParams.moveY - _thisHeight - $('.fc-content').position().top) / gridHeight; //=0纵向第一格 =5纵向第六格
                            dragParams.initDiffX = parseInt(dragParams.initDiffX), dragParams.initDiffY = parseInt(dragParams.initDiffY); //归整化

                            if (dragParams.initDiffX > curGridDateX) {//横向向右且上下移动
                                if (dragParams.initDiffY > curGridDateY) {//纵向向下移动
                                    //加  跨一个单位值就加7
                                    dDate.setDate(dDate.getDate() + (dragParams.initDiffY - curGridDateY) * 7 + (dragParams.initDiffX - curGridDateX));
                                    deDate.setDate(deDate.getDate() + (dragParams.initDiffY - curGridDateY) * 7 + (dragParams.initDiffX - curGridDateX));
                                } else if (dragParams.initDiffY < curGridDateY) {//纵向向上移动
                                    //减 跨一个单位值就减7
                                    dDate.setDate(dDate.getDate() - (curGridDateY - dragParams.initDiffY) * 7 + (dragParams.initDiffX - curGridDateX));
                                    deDate.setDate(deDate.getDate() - (curGridDateY - dragParams.initDiffY) * 7 + (dragParams.initDiffX - curGridDateX));
                                } else {
                                    dDate.setDate(dDate.getDate() + (dragParams.initDiffX - curGridDateX));
                                    deDate.setDate(deDate.getDate() + (dragParams.initDiffX - curGridDateX));
                                }
                            } else if (dragParams.initDiffX < curGridDateX) {//横向向左且上下移动
                                if (dragParams.initDiffY > curGridDateY) {//纵向向下移动
                                    //加  跨一个单位值就加7
                                    dDate.setDate(dDate.getDate() + (dragParams.initDiffY - curGridDateY) * 7 - (curGridDateX - dragParams.initDiffX));
                                    deDate.setDate(deDate.getDate() + (dragParams.initDiffY - curGridDateY) * 7 - (curGridDateX - dragParams.initDiffX));
                                } else if (dragParams.initDiffY < curGridDateY) {//纵向向上移动
                                    //减 跨一个单位值就减7
                                    dDate.setDate(dDate.getDate() - (curGridDateY - dragParams.initDiffY) * 7 - (curGridDateX - dragParams.initDiffX));
                                    deDate.setDate(deDate.getDate() - (curGridDateY - dragParams.initDiffY) * 7 - (curGridDateX - dragParams.initDiffX));
                                } else {
                                    dDate.setDate(dDate.getDate() - (curGridDateX - dragParams.initDiffX));
                                    deDate.setDate(deDate.getDate() - (curGridDateX - dragParams.initDiffX));
                                }
                            } else {//纵向移动
                                if (dragParams.initDiffY > curGridDateY) {//纵向向下移动
                                    //加  跨一个单位值就加7
                                    dDate.setDate(dDate.getDate() + (dragParams.initDiffY - curGridDateY) * 7 - (curGridDateX - dragParams.initDiffX));
                                    deDate.setDate(deDate.getDate() + (dragParams.initDiffY - curGridDateY) * 7 - (curGridDateX - dragParams.initDiffX));
                                } else if (dragParams.initDiffY < curGridDateY) {//纵向向上移动
                                    //减 跨一个单位值就减7
                                    dDate.setDate(dDate.getDate() - (curGridDateY - dragParams.initDiffY) * 7);
                                    deDate.setDate(deDate.getDate() - (curGridDateY - dragParams.initDiffY) * 7);
                                }
                            }
                            var newID = "day_" + new Date(dDate).format('yyyyMMdd');
                            $(".fc-border-separate").find("td").css({ backgroundColor: "#FFF" });
                            $("#day_" + new Date().format('yyyyMMdd')).css({ backgroundColor: "#F5F5F5" });
                            $("#" + newID).css({ backgroundColor: "#EAF4FF" });
                            var tempsmonth = (new Date(dDate).getMonth() + 1);
                            var tempsdate = new Date(dDate).getDate();
                            var tempsHours = new Date(dDate).getHours();
                            var tempsMinutes = new Date(dDate).getMinutes();
                            var tempsSeconds = new Date(dDate).getSeconds();
                            var tempsMilliseconds = new Date(dDate).getMilliseconds();
                            tempsMilliseconds = tempsMilliseconds.toString().length == 1 ? ("00" + tempsMilliseconds.toString()) : (tempsMilliseconds.toString().length == 2 ? ("0" + tempsMilliseconds.toString()) : tempsMilliseconds.toString());

                            var tempemonth = (new Date(deDate).getMonth() + 1);
                            var tempedate = new Date(deDate).getDate();
                            var tempeHours = new Date(deDate).getHours();
                            var tempeMinutes = new Date(deDate).getMinutes();
                            var tempeSeconds = new Date(deDate).getSeconds();
                            var tempeMilliseconds = new Date(deDate).getMilliseconds();
                            tempeMilliseconds = tempeMilliseconds.toString().length == 1 ? ("00" + tempeMilliseconds.toString()) : (tempeMilliseconds.toString().length == 2 ? ("0" + tempeMilliseconds.toString()) : tempeMilliseconds.toString());

                            var startTimeValue = new Date(dDate).getFullYear() + "-" + (tempsmonth.toString().length == 1 ? ("0" + tempsmonth.toString()) : tempsmonth.toString()) + "-" + (tempsdate.toString().length == 1 ? ("0" + tempsdate.toString()) : tempsdate.toString()) + " " + (tempsHours.toString().length == 1 ? ("0" + tempsHours.toString()) : tempsHours.toString()) + ":" + (tempsMinutes.toString().length == 1 ? ("0" + tempsMinutes.toString()) : tempsMinutes.toString()) + ":" + (tempsSeconds.toString().length == 1 ? ("0" + tempsSeconds.toString()) : tempsSeconds.toString()) + "." + tempsMilliseconds;
                            _thisEvent.start = startTimeValue;
                            var endTimeValue = new Date(deDate).getFullYear() + "-" + (tempemonth.toString().length == 1 ? ("0" + tempemonth.toString()) : tempemonth.toString()) + "-" + (tempedate.toString().length == 1 ? ("0" + tempedate.toString()) : tempedate.toString()) + " " + (tempeHours.toString().length == 1 ? ("0" + tempeHours.toString()) : tempeHours.toString()) + ":" + (tempeMinutes.toString().length == 1 ? ("0" + tempeMinutes.toString()) : tempeMinutes.toString()) + ":" + (tempeSeconds.toString().length == 1 ? ("0" + tempeSeconds.toString()) : tempeSeconds.toString()) + "." + tempeMilliseconds;
                            _thisEvent.end = endTimeValue;

                            //console.log(JSON.stringify(_thisEvent));

                            _moveThis.attr({ "data-eventdata": JSON.stringify(_thisEvent) });
                            //移动方向：可以是不限定、垂直、水平。
                            if (opts.dragDirection == 'all') {
                                //DOM写法： document.getElementById('***').style.left = '***px';
                                _moveThis.css({ left: dragParams.moveX, top: dragParams.moveY });
                            }
                            else if (opts.dragDirection == 'vertical') {
                                _moveThis.css({ top: dragParams.moveY });
                            }
                            else if (opts.dragDirection == 'horizontal') {
                                _moveThis.css({ left: dragParams.moveX });
                            }
                            //如果有回调
                            if (opts.callback) {
                                //将dragParams作为参数传递
                                opts.callback.call(opts.callback, dragParams);
                            }
                        }
                    });
                    //鼠标弹起时，标记为取消移动
                    focuEle.bind('mouseup', function (e) {
                        //moveEle.click(); //此处点击使得弹出的详细关闭
                        bDraging = false;  //start.format('yyyyMMdd')
                        moveEle.css({ 'cursor': 'default' });
                        if (moveEle.get(0).releaseCapture) {
                            moveEle.get(0).releaseCapture();
                        }
                        if (Math.abs($.mouseCoords(e).x - initX) == 0 && Math.abs($.mouseCoords(e).y - initY) == 0) {
                            if (_moveThis) {
                                _moveThis.remove();
                            }
                            moveEle.triggerHandler("click");
                            return false;
                        }
                        var _thisEvent = JSON.parse(_moveThis.attr("data-eventdata"));
                        if (_thisEvent.appid == "1a289157-8af2-4379-94e0-2b04b1b5395d") {//提示用户：不能拖动任务
                            //fw_settimealert({ str: "无法更改任务", showmask: false, type: 'warning' });
                            i8ui.error('无法更改任务');
                            _moveThis.remove();
                            return false;
                        }
                        var _calEvent = _thisEvent, _curDate = new Date();
                        var start = new Date();
                        start.setYear(parseInt(_thisEvent.start.substring(0, 4), 10));
                        start.setMonth(parseInt(_thisEvent.start.substring(5, 7) - 1, 10));
                        start.setDate(parseInt(_thisEvent.start.substring(8, 10), 10));
                        start.setHours(parseInt(_thisEvent.start.substring(11, 13), 10));
                        start.setMinutes(parseInt(_thisEvent.start.substring(14, 16), 10));
                        start.setSeconds(parseInt(_thisEvent.start.substring(17, 19), 10));
                        start.setMilliseconds(parseInt(_thisEvent.start.substring(20, 23), 10));

                        if (currentUserId != _calEvent.userid) { //@TODO
                            //fw_settimealert({ str: "无法更改他人的日程", showmask: false, type: 'warning' });
                            i8ui.error('无法更改他人的日程');
                            _moveThis.remove();
                            $(".fc-border-separate").find("td").css({ backgroundColor: "#FFF" });
                            $("#day_" + _curDate.format('yyyyMMdd')).css({ backgroundColor: "#F5F5F5" });
                            $(".app_schedule_month_view_more_tips_close").click();
                            return;
                        }

                        if ((!_calEvent.cuserid || currentUserId == _calEvent.cuserid) && (start > (_curDate) || (start.format('yyyyMMdd') == _curDate.format('yyyyMMdd')))) {

                            if (_thisEvent.IsCycle) {
                                fEditCycleCalendar(_thisEvent, moveEle, crevertFunc);
                            } else {
                                fEditNormalCalendar(_thisEvent, moveEle, crevertFunc);
                            }
                        }
                        else {
                            if (currentUserId != _calEvent.cuserid) {
                                //fw_settimealert({ str: "请联系创建人修改", showmask: false, type: 'warning' });
                                i8ui.error('请联系创建人修改');
                            } else {
                                //fw_settimealert({ str: "不能修改过去时间的日程", showmask: false, type: 'warning' });
                                i8ui.error('不能修改过去时间的日程');
                            }
                        }
                        _moveThis.remove();
                        $(".fc-border-separate").find("td").css({ backgroundColor: "#FFF" });
                        $("#day_" + _curDate.format('yyyyMMdd')).css({ backgroundColor: "#F5F5F5" });
                        $(".app_schedule_month_view_more_tips_close").click();
                    });
                });
            };
            //默认配置
            $.fn.cdragDrop.defaults =
            {
                focuEle: null, //点击哪个元素开始拖动,可为空。不为空时，需要为被拖动元素的子元素。
                callback: null, //拖动时触发的回调。
                dragDirection: 'all', //拖动方向：['all','vertical','horizontal']
                fixarea: null //限制在哪个区域拖动,以数组形式提供[minX,maxX,minY,maxY]
            };
        })(jQuery);
        //rong add 2013-06-06 任务整合到日历中
        if ("1" == "1") {
            $("#quick_post").find(".fc-header-right").prepend('<span style="margin-right:20px;margin-top:5px;display:inline-block;height:30px;"><input type="checkbox" id="selectTask" >我负责的任务</span>');
        }
        //添加列表视图选项到操作栏 ---by 大雄


        if ("30" == "0") {
            IndexWeekDays = new Date();
            CalendarViewShowType = 2;
            LoadAllSelect();
            LoadCalenderViewList();


            $("#app_schedule_listviews").show();
            $("#quick_post").hide();
        } else {
            CalendarViewShowType = 1;
            $("#app_schedule_listviews").hide();
            $("#quick_post").show();
        }

        $("#quick_post").find(".fc-header-right").append('<span id="showcalendarlist" class="fc-button  ui-state-default ui-corner-right"><span class="fc-button-inner"><span class="fc-button-content">列表</span><span class="fc-button-effect"><span></span></span></span></span>');
        $("#showcalendarlist").live("click", function () {
            IndexWeekDays = new Date();
            CalendarViewShowType = 2;
            LoadAllSelect();
            LoadCalenderViewList();


            $("#app_schedule_listviews").show();
            $("#quick_post").hide();
        });
    });
    //KSNSelector({ model: 2, element: $("#app_schedule_view_add_participants"), width: 176 });
    //update by csh 2014-07-23，创建日程时，默认将创建人添加到参与人列表中
    AddSchedule_select = KSNSelector({ model: 2, element: $("#app_schedule_view_add_participants"), width: 176 });
    var joiner = fw_request("jo");
    if (joiner.length == 0) {
        joiner = i8_session.uid;
    }
    AddSchedule_select.loadData(joiner.split(','));
    //rong add 2013-06-07 整合任务到日历
    //选取人员操作
    $('#quick_post').delegate('#selectTask', 'click', function () {
        jobDate = 0;
        $('#quick_post').fullCalendar('render');
    });
    var fShowJobDetail = function (id, event) {//rong add
        return true;
        $('#app_job_view_detail_show').remove();
        var paras = $("#" + id).attr("jobdata");
        var opt = JSON.parse(paras);
        var showjob = '<div style="position: absolute; z-index: 9; left: ' + (event.clientX - 128) + 'px; top:' + (event.clientY - 162 + $(document).scrollTop()) + 'px;" id="app_job_view_detail_show" class="app_schedule_view_tips" dataid="' + opt.id + '" tpid="' + opt.id + '">'
            + '<div class="app_schedule_view_tips_title">'
            + '<img class="app_schedule_view_tips_headimg" alt=" " src="' + attentionUserObj[opt.userid].Icon + '">'
            + '<span href="javascript:" class="a app_schedule_view_view_username">我的任务</span>'
            + '<span onclick="$(\'#app_job_view_detail_show\').remove()" id="app_schedule_view_detail_close" class="app_schedule_view_tips_close"></span>'
            + '</div>'
            + '<div class="app_schedule_view_tips_txt">'
            + '<p class="app_schedule_view_view_subject" title="' + opt.title + '">任务：' + opt.title + '</p>'
            + '<p class="app_schedule_view_view_time">执行期限：' + opt.start.substr(0, 16) + '至' + opt.end.substr(0, 16) + '</p>'
            + '<p class="app_schedule_view_view_participants" title="' + opt.Attendees + '">参与人：' + opt.Attendees + '</p>'

            + '</div>'
            + '<div class="app_schedule_view_tips_edit">'
            + '<a class="app_schedule_view_tips_delete" href="javascript:"style="display: none;">删除</a>'
            + '<a class="app_schedule_view_tips_write" href="javascript:" style="display: none;">编辑</a>'
            + '<a class="showtaskview" taskid="' + opt.ReferID + '">浏览</a>'
            + '</div>'
            + '<i><s></s></i>'
            + '</div>';
        $(showjob).appendTo("body");
    }



    $('.app-lt-my-info').click(function(){
        calendarObj.refresh()
    })
})