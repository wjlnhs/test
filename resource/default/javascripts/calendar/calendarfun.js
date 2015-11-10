define(function (require, exports,modules) {
    var common=require('./common');
    var crclebox=require('./crclebox');

    var addcalendar=require('./addcalendar');
    var i8ui=require('../common/i8ui');
    var _monent=$.fullCalendar.moment;
    var resHost=i8_session.resHost;
    var baseHost=i8_session.baseHost;
    var urls=['','calendar/detail/','calendar/detail/','task/detail/'];

    var units={
        //把数据转化成events
        formatData:function(data,_colorarr){
            var events=[];
            var rtobj=data.ReturnObject;
            if(rtobj&&rtobj.length>0){
                var len=rtobj.length;
                for(var i=0;i<len;i++){
                    var obj={
                        id:rtobj[i].ScheduleID,//	可选，事件唯一标识，重复的事件具有相同的id
                        title:rtobj[i].Title,	//必须，事件在日历上显示的title
                        allDay:false,	//可选，true or false，是否是全天事件。
                        start:rtobj[i].ScheduleStartDay,	//必须，事件的开始时间。
                        end	:rtobj[i].ScheduleEndDay,//可选，结束时间。
                        url:baseHost+urls[rtobj[i].AppType]+rtobj[i].ScheduleID+(rtobj[i].OwnerIDs?'?ownerids='+rtobj[i].OwnerIDs.join(';'):''),	//可选，当指定后，事件被点击将打开对应url。
                        target:'_blank',
                        className:rtobj[i].OwnerIDs?(rtobj[i].OwnerIDs.length>1?'bg-none':_colorarr[rtobj[i].OwnerIDs[0]]):_colorarr[rtobj[i].CreaterID],	//指定事件的样式。
                        editable:rtobj[i].AppType!=0,	//事件是否可编辑，可编辑是指可以移动, 改变大小等。
                        source:'',	//指向次event的eventsource对象。
                        color:'',	//背景和边框颜色。
                        backgroundColor:'',	//背景颜色。
                        borderColor:'',	//边框颜色。
                        textColor:'',	//文本颜色。
                        aType:rtobj[i].AppType,
                        IsCycle:rtobj[i].IsCycle,
                        OwnerIDs:rtobj[i].OwnerIDs,
                        IsMerge:rtobj[i].IsMerge,
                        _colorarr:_colorarr,
                        startTime:rtobj[i].ScheduleStartDay,
                        endTime:rtobj[i].ScheduleEndDay,
                        imgurl:rtobj[i].joinHeadImages&&rtobj[i].joinHeadImages.length==1?rtobj[i].joinHeadImages[0]:'https://dn-i8public.qbox.me/cd2977ad-7aee-4db1-9d32-1516a9addf89/3d8074d8-4890-3bc6-f140-d6fe804d2dfe.png?imageView2/1/w/60/h/60',
                        joinname:rtobj[i].JoinNames?rtobj[i].JoinNames.join(','):'',//参加人
                        CreaterName:rtobj[i].CreaterName?rtobj[i].CreaterName[0]:'',//创建人
                        place:rtobj[i].Place,//地点
                        CycleType:rtobj[i].CycleType,
                        IsIncludeWeekend:rtobj[i].IsIncludeWeekend,
                        CycleValues:rtobj[i].CycleValues,
                        canDelete:rtobj[i].CreaterID==i8_session.uid
                    }
                    if(rtobj[i].AppType==3){
                        obj.className=_colorarr[i8_session.uid]+ ' bg-task';
                        obj.allDay=true;
                    }

                    if(rtobj[i].CreaterID!=i8_session.uid){
                        obj.editable=false;
                        if(rtobj[i].Status=='11'){
                            obj.url='';
                            obj.title='忙碌';
                        }else{
                            if(rtobj[i].ViewStatus==1){
                                obj.className+=' bg-new';
                            }else if(rtobj[i].ViewStatus==2){
                                obj.className+=' bg-update';
                            }
                        }
                    }

                    events.push(obj);
                }
            }
            return events;
        },
        //转化时间
        getDate:function(obj){
            if(obj._d){
                return {
                    date:_monent(obj._d).format('YYYY-MM-DD'),
                    time:_monent(obj._d).format('HH:mm')
                }
            }else{
                return {}
            }
        },
        getChangeTime:function(obj,adjust){
            return _monent(obj).format('YYYY-MM-DD HH:mm');
        },
        getLastDate:function(date){
            return _monent(new Date(date.getFullYear(),date.getMonth(),date.getDate()-1)).format('YYYY-MM-DD');
            //return _monent(obj).format('YYYY-MM-DD H:mm');
        }
    }

    exports.init=function(cal,_colorarr,elems){
        return {
            //作为方法的形式获得event
            events:function(start,end,timezone,callback){
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

                var options={
                    startDate:units.getDate(start).date,
                    endDate:units.getDate(end).date,
                    userIDs:userids,
                    isViewNotify:elems.showNotify.hasClass('checked')
                }
                if(options.userIDs.length==0){
                    callback&&callback([]);
                    return;
                }
                common.ajax.getScheduleView(options,function(data){
                    if($.type(data)=='object'){
                        if(data.Result){
                            callback&&callback(units.formatData(data,_colorarr));
                        }
                    }

                    //callback([{id:1,title:'123',start:'2015-3-19'}]);
                });
            },
            //选择拖动时间
            select: function(startDate, endDate, jsEvent, view) {//开始时间，结束时间
                var start=units.getDate(startDate);
                var end=units.getDate(endDate);
                addcalendar.openWindow({title:'新建日程/会议',data:{addDate:start.date,addStartTime:start.time,addEndTime:end.time,Type:1}},function(){
                    elems.calendar.fullCalendar('refetchEvents');
                });
            },
            //日程事件被拖动之前触发。这里的拖动不一定是一个有效的拖动，只要日程事件的控件被拖着动了，事件就触发。 可以从该对象中获取位移，位置等数据
            eventDragStart:function( event, jsEvent, ui, view ){
            },
            //日程事件被拖动之后触发。这里的拖动不一定是一个有效的拖动，只要日程事件的控件被拖着动了，事件就触发。 可以从该对象中获取位移，位置等数据
            eventDragStop:function( event, jsEvent, ui, view ){
            },
            //event事件对象
            //delta持续时间
            //revertFunc回滚
            //jsEvent持有本地JavaScript事件与低层次的信息，如鼠标坐标。
            //view当前视图对象
            updateSchelue:function( event, delta, revertFunc, jsEvent, ui, view ){
                if(!event.end){
                    event.end=event.start;
                }
                if(units.getChangeTime(event.start).split(' ')[0]<units.getLastDate(new Date())){
                    i8ui.error('无法更改过去的时间的日程！');
                    revertFunc();
                    return;
                }
                if(event.aType=='3'){//拖放任务时触发
                    i8ui.error('无法更改任务！');
                    revertFunc();//回滚
                    return;
                }
                var options={
                    scheduleID:event.id,
                    StartTime:units.getChangeTime(event.start),
                    EndTime:units.getChangeTime(event.end)
                }
                if(event.IsCycle){
                    if(delta._days!=0){
                        i8ui.error('循环日程调整时不支持跨日期调整！');
                        revertFunc();
                        return;
                    }
                    crclebox.openWindow('请选择循环日程日程修改范围：',function(type){
                        options.updateType=type;
                        common.ajax.updateSchedule(options,function(data){
                            if($.type(data)=='object'&&data.Result){
                                cal.fullCalendar('refetchEvents');
                                i8ui.write('修改成功！');
                            }else{
                                i8ui.error('修改失败,'+data.Description+'!');
                                revertFunc();
                            }
                        });
                    },function(){
                        revertFunc();
                    });
                }else{
                    i8ui.confirm({title:'是否确认修改?'},function(){
                        common.ajax.updateSchedule(options,function(data){
                            if($.type(data)=='object'&&data.Result){
                                cal.fullCalendar('refetchEvents');
                                i8ui.write('修改成功！');
                            }else{
                                i8ui.error('修改失败,'+data.Description+'!');
                                revertFunc();
                            }
                        });
                    },function(){
                        revertFunc();
                    });
                }
            },
            //当单击日历中的某一天时，触发callback，用法：
            //date是点击的day的时间(如果在agenda view, 还包含时间)，
            // 在月view下点击一天时，allDay是true，在agenda模式下，
            // 点击all-day的窄条时，allDay是true，
            // 点击其他的agenda view下的day则为false，
            // jsEvent就是一个普通的javascript事件，包含的是click事件的基础信息
            dayClick:function(date, allDay, jsEvent, view) {
            },
            //当点击日历中的某一日程（事件）时，触发此操作，用法：
            //event是日程（事件）对象，jsEvent是个javascript事件，view是当前视图对象。
            eventClick:function(event, jsEvent, view) {
            },
            //鼠标划过的事件，用法和参数同上
            //event是日程（事件）对象，jsEvent是个javascript事件，view是当前视图对象。
            eventMouseover:function(event, jsEvent, view) {
            },
            //鼠标离开的事件，用法和参数同上
            //event是日程（事件）对象，jsEvent是个javascript事件，view是当前视图对象。
            eventMouseout:function(event, jsEvent, view) {
            },
            //日历开始加载的时候，isLoading参数为true触发一次，日历加载完毕，isLoading参数为false触发一次，用法：
            loading:function(isLoading, view){
            }
        }
    }
});