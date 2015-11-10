define(function (require, exports,modules) {
    var i8ui=require('../common/i8ui');
    var i8selector=require('../plugins/i8selector/fw_selector.js');
    //var swfuploadControl = require('../plugins/qiniu_uploader/qiniu_i8uploader.js');
    var fw_page = require('../common/fw_pagination');
    var util=require('../common/util');
    /*build(remove.start)*/
    require('default/stylesheets/addcalendar.css');
    /*build(remove.end)*/
    var common=require('./common');
    var crclebox=require('./crclebox');
    exports.openWindow=function(options,callback,cancelCallback){
        var addcalendar=require('../../template/calendar/addcalendar.tpl');
        var freeroom=require('../../template/calendar/freeroom.tpl');
        var placetpl=require('../../template/calendar/place.tpl');
        var placetrender=template(placetpl);
        var freeroomrender=template(freeroom);
        var render=template(addcalendar);
        var showbox;
        var _html=render(options.data);
        var ver=options.data.ver||'';
        if(options.noWindow){
            showbox=$(_html);
            options.elem.html(showbox);
        }else{
            showbox=$(i8ui.showbox({
                title:options.title,
                cont:_html
            }));
        }

        var schedule_title=$('#schedule_title'+ver);
        var addDate=$('#addDate'+ver);//日程 会议日期

        var repeat_startTime=$('#repeat_startTime'+ver);//循环 开始时间
        var repeat_endTime=$('#repeat_endTime'+ver);//循环 结束时间
        var starttime=$('#starttime'+ver);
        var endtime=$('#endtime'+ver);
        var remind_text=$('#remind_text'+ver);//提醒时间
        var repeat_radio=$('#repeat_radio'+ver);//循环单选周或者每日
        var repeat_checkbox=$('#repeat_checkbox'+ver); //循环多选天
        var isrepeat=$('#isrepeat'+ver);//是否循环
        var hasweekend=$('#hasweekend'+ver);//是否包含周末
        var searchfreeroom=$('#searchfreeroom'+ver);//查看空闲会议室详情
        var freeroom=$('#freeroom'+ver);//空闲会议室列表
        var freetbody=freeroom.find('tbody');
        var freeroompage=$('#freeroompage'+ver);//分页插件
        var detail_text=$('#detail_text'+ver);//详细内容
        var meettingRoom=$('#meettingRoom'+ver);//会议室
        var place=$('#place'+ver);//地点
        var place_input=place.find('input');
        var chooseplace=$('#chooseplace'+ver);//选择地点按钮
        var meetplace=$('#meetplace'+ver);
        var retract=$('#retract'+ver);//展开收起
        var morebox=$('#morebox'+ver)


        //获取空闲会议室分页方法
        var getFreeTable=function(pageIndex,mettingStartTime,mettingEndTime){
            getfreeRoom(pageIndex,5,mettingStartTime,mettingEndTime,function(data){
                if($.type(data)=='object'){
                    if(data.Result){
                        data.selectRoomID=selectPlace.getValue();
                        freetbody.html(freeroomrender(data));
                        //分页控件绑定
                        fw_page.pagination({
                            ctr: freeroompage,
                            totalPageCount: data.Total,
                            pageSize: 5,
                            current: pageIndex,
                            fun: function (new_current_page, containers) {
                                getFreeTable(new_current_page,mettingStartTime,mettingEndTime);
                            }, jump: {
                                text: '跳转'
                            }
                        });
                    }else{
                        freetbody.html(freeroomrender({error:true,Description:data.Description}));
                    }
                }else{
                    freetbody.html(freeroomrender({error:true}));
                }
            });
        }
        //重置清楚空闲会议室数据
        var resetFreeTable=function(){
            freeroom.hide();
            freetbody.html('');
            i8_options.html('');
            selectPlace.find('.i8-select-cked').html('--请选择--').attr('value','');
            starttime.html(addStartTime.getValue());
            endtime.html(addEndTime.getValue())
            getSelectFreeRoom();
        }
        //获取开始结束时间
        var getMettingStartEndDate=function(){
            var _date=addDate.val();
            var _startTime=addStartTime.getValue();
            var _endTime=addEndTime.getValue();
            if(!_date||!_startTime){
                i8ui.error('请设置开始时间！');
                return false;
            }else if(!_date||!_endTime){
                i8ui.error('请设置结束时间！');
                return false;
            }
            else{
                return {mettingStartTime:_date+' '+_startTime,mettingEndTime:_date+' '+_endTime}
            }
        }

        //获取会议室方法
        var getfreeRoom=function(pageIndex,pageSize,mettingStartTime,mettingEndTime,callback){

            var _options={
                pageIndex:pageIndex,
                pageSize:pageSize,
                scheduleID:options.data.ID||null,
                mettingStartTime:mettingStartTime,/// 开始时间
                mettingEndTime:mettingEndTime/// 结束时间
            }
            common.ajax.getFreeRoom(_options,function(data){
                callback(data);
            })
        }


        //修改日程
        var updateSchedule=function(_options){
            common.ajax.updateSchedule(_options,function(data){
                if($.type(data)=='object'){
                    if(data.Result){
                        i8ui.write('保存成功！');
                        showbox.find('.ct-close').trigger('click');
                        callback(_options.Type,data)
                    }else{
                        i8ui.error('保存失败，'+data.Description+'！');
                    }
                }else{
                    i8ui.error('保存失败,请求超时！');
                }
                showbox.find('.posting').html('保存').removeClass('posting');
            });
        }

        var saveSchdule=function(scheduleinfo){
            if(options.isedit){
                var _options= $.extend({},options.data,scheduleinfo,{updateType:0,scheduleID:options.data.ID});

                if(options.data.IsCycle){//是否为循环日程
                    //匹配循环信息
                    if(options.data.CycleType==scheduleinfo.CycleType&&
                        options.data.CycleValues==scheduleinfo.CycleValues&&
                        options.data.IsIncludeWeekend==scheduleinfo.IsIncludeWeekend&&
                        options.data.CycleStartDate==scheduleinfo.CycleStartDate&&
                        options.data.CycleEndDate==scheduleinfo.CycleEndDate){
                        crclebox.openWindow('此修改的适用范围：',function(type){
                            _options.updateType=type;
                            updateSchedule(_options);
                        },function(){
                            showbox.find('.posting').html('保存').removeClass('posting');
                        });
                    }else{
                        i8ui.confirm({title:'您已经修改循环信息，是否要修改全部该循环日程？'},function(){
                            _options.updateType=3;
                            updateSchedule(_options);
                        },function(){
                            showbox.find('.posting').html('保存').removeClass('posting');
                        });
                    }
                }else{
                    updateSchedule(_options);
                }
            }else{
                common.ajax.addSchedule({scheduleinfo:scheduleinfo},function(data){
                    if($.type(data)=='object'){
                        if(data.Result){
                            i8ui.write('保存成功！');
                            showbox.find('.ct-close').trigger('click');
                            callback(scheduleinfo.Type);
                            options.callback&&options.callback(data.ReturnObject);
                        }else{
                            i8ui.error('保存失败，'+data.Description+'！');
                        }
                    }else{
                        i8ui.error('保存失败,请求超时！');

                    }
                    showbox.find('.posting').html('保存').removeClass('posting');
                });
            }
        }


        if(options.data.Type==1){
            place.show();
        }else{
            meettingRoom.show();
        }

        var getPlace=function(pageIndex,elem){
            var t_body=elem.find('tbody');
            t_body.html(placetrender({loading:true}));
            var placepage=elem.find('.placepage').empty();
            common.ajax.getPlaceByPage({
                pageIndex:pageIndex||1,
                pageSize:5
            },function(data){
                if($.type(data)=='object'&&data.Result){
                    if(data.Total!=0){
                        t_body.html(placetrender(data));
                        //分页控件绑定
                        fw_page.pagination({
                            ctr: placepage,
                            totalPageCount: data.Total,
                            pageSize: 5,
                            current: pageIndex,
                            fun: function (new_current_page, containers) {
                                getPlace(new_current_page,elem);
                            }, jump: {
                                text: '跳转'
                            }
                        });
                    }else{
                        t_body.html(placetrender({noresult:true}));
                    }
                }else{
                    t_body.html(placetrender({error:(data.Description||'请求超时！')}));
                }
            })
        }


        //选择地点按钮事件
        chooseplace.on('click',function(){
            var elem=$(i8ui.showbox({
                title:'选择地点',
                cont:place.find('.placecont').html()
            }));
            //删除地点
            elem.on('click','tbody a.btn-delete',function(){
                common.ajax.deletePlace({placeID:$(this).attr('pid')},function(data){
                    i8ui.confirm({title:'是否确认删除?'},function(){
                        if($.type(data)=='object'&&data.Result){
                            getPlace(1,elem);
                            i8ui.write('删除成功！');
                        }else{
                            i8ui.error('删除失败，'+(data.Description||'请求超时')+'！');
                        }
                    })
                });
            });
            //选择地点
            elem.on('click','tbody .app-radio',function(){
                elem.find('.app-radio').removeClass('checked');
                $(this).addClass('checked');
            });
            //添加地点
            elem.on('click','a.addplace',function(){
                var placeval= $.trim(elem.find('.placeval').val());
                if(!placeval){
                    i8ui.error('请输入地点名称！');
                    return;
                }
                common.ajax.addPlace({place:{Name:placeval}},function(data){
                        if($.type(data)=='object'&&data.Result){
                            getPlace(1,elem);
                            i8ui.write('添加成功！');
                            elem.find('.placeval').val('');
                        }else{
                            i8ui.error('添加失败，'+(data.Description||'请求超时')+'！');
                        }
                });
            });

            elem.on('click','span.btn-blue96x32',function(){
                var val=elem.find('.app-radio.checked').attr('pname');
                if(!val){
                    i8ui.error('请选择地点！');
                    return;
                }
                place_input.val(val);
                elem.find('.ct-close').trigger('click');
            });

            elem.on('click','span.btn-gray96x32',function(){
                elem.find('.ct-close').trigger('click');
            });
            getPlace(1,elem);
        });

        //日期
        addDate.setTime({
            onpicked:function(dp){
                resetFreeTable();
            }
        });

        //开始时间
       /* addStartTime.setTime({
            dateFmt:'HH:mm',
            onpicked:function(dp,time,b){
                $('#starttime'+ver).html(addStartTime.val());
                var date=new Date('2011','1','1',parseInt(dp.cal.getP('H'))+1,dp.cal.getP('m'));
                addEndTime.val(util.dateformat(date,'hh:mm'));
                resetFreeTable();
            }
        });

        //结束时间
        addEndTime.setTime({
            dateFmt:'HH:mm',
            minDate:"#F{$dp.$D('addStartTime"+ver+"');}",
            onpicked:function(dp){
                $('#endtime'+ver).html(addEndTime.val());
                resetFreeTable();
            }
        });*/


        var choosePerson=i8selector.KSNSelector({
            model:2,
            width: options.width||720,
            element: '#choosePerson'+ver,
            searchType: { "org": false, "user": true, "grp": false },
            loadItem:{
                items:options.data.JoinIDs||[i8_session.uid],
                loadedCallBack:function(){

                }
            }
        });//初始化选人控件

        var chooseNotify=i8selector.KSNSelector({
            model:2,
            width: options.width||720,
            element: '#chooseNotify'+ver,
            searchType: { "org": false, "user": true, "grp": false },
            loadItem:{
                items:options.data.NotifyIDs||[],
                loadedCallBack:function(){

                }
            }
        });//初始化知会人选人控件

        var nodate=new Date();
        var threeMonthlater=new Date(nodate.getFullYear(),nodate.getMonth()+3,nodate.getDate());//3个月后

        //循环开始时间
        repeat_startTime.val(repeat_startTime.val()||util.dateformat(nodate,'yyyy-MM-dd')).setTime({
            maxDate:"#F{$dp.$D('repeat_endTime"+ver+"');}"
        });
        //循环结束时间
        repeat_endTime.val(repeat_endTime.val()||util.dateformat(threeMonthlater,'yyyy-MM-dd')).setTime({
            minDate:"#F{$dp.$D('repeat_startTime"+ver+"');}"
        });
        //选择类型
        $('#selectType'+ver).setSelect({
            newi8select:'newi8-select fw_left m-r10',
            dropstyle: 'newselecti',
            ckedstyle: 'newselectcked'
        });
        $('#selectType'+ver).setValue(options.data.Type);
        //初始化会议室选择
        $('#selectPlace'+ver).setSelect({
            newi8select:'newi8-select fw_left m-r10',
            dropstyle: 'newselecti',
            ckedstyle: 'newselectcked'
        });

        //提醒单位初始化
        $('#selectunit'+ver).setSelect({
            newi8select:'newi8-select fw_left m-r10',
            dropstyle: 'newselecti',
            ckedstyle: 'newselectcked'
        });

        //日程 会议开始时间
        var addStartTime=$('#addStartTime'+ver);//日程 会议开始时间


        addStartTime.find('option[value="'+addStartTime.attr('choose')+'"]').attr('selected',true);

        addStartTime.setSelect({
            newi8select:'newi8-select fw_left m-r10',
            dropstyle: 'newselecti',
            ckedstyle: 'newselectcked'
        });

        var addEndTime=$('#addEndTime'+ver);//日程 会议结束时间
        addEndTime.find('option[value="'+addEndTime.attr('choose')+'"]').attr('selected',true);
        //日程 会议结束时间
        addEndTime.setSelect({
            newi8select:'newi8-select fw_left m-r10',
            dropstyle: 'newselecti',
            ckedstyle: 'newselectcked'
        });

        var selectPlace=$('#selectPlace'+ver);//选择地点
        var selectunit=$('#selectunit'+ver);//提醒单位
        var selectType=$('#selectType'+ver);//选择类型
        addStartTime=$('#addStartTime'+ver);//日程 会议开始时间

        addEndTime=$('#addEndTime'+ver);//日程 会议结束时间
        //选择空闲会议室
        var i8_options=selectPlace.find('.i8-sel-options');


        //日程 会议变更
        selectType.on('click','em',function(){
            var _type=$(this).attr('value');
            if(_type==1){
                place.show();
                meettingRoom.hide();
            }else{
                place.hide();
                meettingRoom.show();
            }
        });
        //点击读取会议室
        selectPlace.on('click','.i8-select-drop',function(){
            //getSelectFreeRoom();
        });

        addStartTime.find('.i8-sel-options').css('height','320px').mCustomScrollbar({//添加滚动条功能
            scrollButtons: {
                enable: true
            },
            scrollInertia:0,
            theme: "dark-thin"
        }).on('click','.mCSB_dragger_bar',function(){
            return false;
        });
        //开始时间变更
        addStartTime.on('click','em',function(){
            var sval=addStartTime.getValue();
            var val=addEndTime.find('em[value="'+sval+'"]').next().next().attr('value');
            addEndTime.setValue(val);
            resetFreeTable();
        });
        addEndTime.find('.i8-sel-options').css('height','320px').mCustomScrollbar({//添加滚动条功能
            scrollButtons: {
                enable: true
            },
            scrollInertia:0,
            theme: "dark-thin"
        }).on('click','.mCSB_dragger_bar',function(){
            return false;
        });
        //结束时间变更
        addEndTime.on('click','em',function(){
            var sval=addEndTime.getValue();
            if(addStartTime.getValue()>=sval){
                var val=addStartTime.find('em[value="'+sval+'"]').prev().prev().attr('value');
                addStartTime.setValue(val);
            }
            resetFreeTable();
        });

        //展开收起
        retract.on('click',function(){
            retract.find('i').toggleClass('icon-down-solid icon-up');
            morebox.toggleClass('hauto');
        });




        //获取下拉会议室方法
        var getSelectFreeRoom=function(){
            var meetingdate=getMettingStartEndDate();
            if(!meetingdate){
                return;
            }
            if($.trim(i8_options.html())){
                return;
            }
            i8_options.html('<div class="ld-32-write" ></div>');
            var _callback=function(data){
                if($.type(data)=='object'){
                    if(data.Result){
                        var arr=data.ReturnObject;
                        var htmlarr=[];
                        var _idarr=['00000000-0000-0000-0000-000000000000'];
                        for(var i= 0,len=arr.length;i<len;i++){
                            htmlarr.push('<em value="'+arr[i].ID+'">'+arr[i].Name+'</em>');
                            _idarr.push(arr[i].ID);
                        }
                        if(_idarr.join(',').search(options.data.MettingRoomID)==-1&&options.data.Type==2){
                            i8ui.error('会议室在该时间段被占用，请重新选择会议室！')
                        }
                        htmlarr.push('<em value="00000000-0000-0000-0000-000000000000">其他</em>')
                        var _html=htmlarr.join('');
                        i8_options.html(_html);
                        selectPlace.setValue(options.data.MettingRoomID);
                        searchfreeroom.show();
                    }
                }
            }
            var _options={
                pageIndex:1,
                pageSize:0,
                scheduleID:options.data.ID||null,
                mettingStartTime:meetingdate.mettingStartTime,/// 开始时间
                mettingEndTime:meetingdate.mettingEndTime/// 结束时间
            }
            common.ajax.getFreeRoom(_options,function(data){
                _callback(data);
            })
        }

        //详细页面点击选择
        freeroom.on('click','.app-radio',function(){
            freeroom.find('.app-radio').removeClass('checked');
            var _this=$(this).addClass('checked');
            selectPlace.setValue(_this.attr('rid'));
            selectPlace.removeClass('smallselectmeet');
            meetplace.hide();
        });

        //选择下拉空闲会议室
        selectPlace.on('click','em',function(){
            var _this=$(this).addClass('checked');
            freeroom.find('.app-radio').removeClass('checked');
            freeroom.find('.app-radio[rid='+_this.attr('value')+']').trigger('click');
            //if()
            if(selectPlace.getValue()=='00000000-0000-0000-0000-000000000000'){
                selectPlace.addClass('smallselectmeet');
                meetplace.show();
            }else{
                selectPlace.removeClass('smallselectmeet');
                meetplace.hide();
            }
        })



        //查看空闲会议室详细信息按钮
        searchfreeroom.on('click',function(){
            var meetingdate=getMettingStartEndDate();
            freeroompage.empty();
            if(!meetingdate){
                return;
            }
            if(freeroom.css('display')!='none'){
                freeroom.toggle('fast');
                return;
            }
            freeroom.toggle('fast');
            freetbody.html(freeroomrender({loading:true}));
            freeroompage.empty();
            getFreeTable(1,meetingdate.mettingStartTime,meetingdate.mettingEndTime)
        });



        //单选
        repeat_radio.on('click','.app-radio',function(){
            repeat_radio.find('.app-radio').removeClass('checked');
            var _this=$(this).addClass('checked');
            if(_this.attr('type')=='1'){
                //repeat_checkbox.find('.app-checkbox').addClass('checked');
                hasweekend.show();
                repeat_checkbox.hide();
            }else{
                hasweekend.hide();
                repeat_checkbox.show();
            }
        });

        var repeat_panel=showbox.find('.repeat-box').find('.repeat-panel');


        //是否循环
        isrepeat.on('click',function(){
            var _ischeck=$(this).toggleClass('checked').hasClass('checked');
            if(_ischeck){
                repeat_panel.show();
            }else{
                repeat_panel.hide();
            }
        });

        //周循环是选择日期
        repeat_checkbox.on('click','.app-checkbox',function(){
            $(this).toggleClass('checked');
        });

        hasweekend.on('click','.app-checkbox',function(){
            $(this).toggleClass('checked');
        });

        //上传
        var i8uploader=common.ajax.up(options);

        //验证任务或日程对象
        var validateScheduleInfo=function(scheduleinfo){
            if(!scheduleinfo.Title){
                i8ui.error('请输入主题名称！');
                return false;
            }
            if(!scheduleinfo.StartTime){
                i8ui.error('请选择开始时间！');
                return false;
            }
            if(!scheduleinfo.EndTime){
                i8ui.error('请选择结束时间！');
                return false;
            }
            if(scheduleinfo.StartTime>=scheduleinfo.EndTime){
                i8ui.error('开始时间不能大于结束时间！');
                return false;
            }

            if(scheduleinfo.JoinIDs.length==0||!scheduleinfo.JoinIDs[0]){
                i8ui.error('请选择参加人！');
                return false;
            }
            if(!scheduleinfo.BeforeTime){

                i8ui.error('请选择提醒时间！');
                return false;
            }
            if(isNaN(scheduleinfo.BeforeTime)){
                i8ui.error('请输入正确的提醒时间！');
                return false;
            }
            if(!scheduleinfo.BeforeTimeType){
                i8ui.error('请选择提醒类型！');
                return false;
            }
            if(scheduleinfo.IsCycle){
                if(!scheduleinfo.CycleStartDate||!scheduleinfo.CycleEndDate){
                    i8ui.error('请选择循环开始结束时间！');
                    return false;
                }
            }else{
                scheduleinfo.CycleStartDate='2011-01-01';
                scheduleinfo.CycleEndDate='2011-01-01';
            }
            return true;
        }

        //取消按钮
        showbox.on('click','.btn-gray96x32',function(){
            showbox.find('.ct-close').trigger('click');
            cancelCallback&&cancelCallback();
        });

        //取消按钮
        showbox.on('click','.ct-close',function(){
            cancelCallback&&cancelCallback();
        });

        //确认按钮
        showbox.on('click','.btn-blue96x32:not(.posting)',function(){
            var _this=$(this);
            _this.html('提交中...').addClass('posting');
            var _date=addDate.val();
            var _startTime=addStartTime.getValue()//.replace(/^\d{1}:/,function(a,b){return '0'+a;})
            //_startTime=util.dateformat(new Date('2011','1',_startTime),'hh:mm');
            var _endTime=addEndTime.getValue()//.replace(/^\d{1}:/,function(a,b){return '0'+a;});
            //_endTime=util.dateformat(new Date('2011','1',_endTime),'hh:mm');
            var cycleValues=[];
            repeat_checkbox.find('.app-checkbox').each(function(i,item){
                var _item=$(item);
                if(_item.hasClass('checked')){
                    cycleValues.push(_item.attr('type'));
                }
            });



            var scheduleinfo={
                Title: $.trim(schedule_title.val()),//主题名称
                Type:selectType.getValue(),/// 日程日历类型 1.日程 2.会议
                StartTime:(!_date||!_startTime)?'':_date+' '+_startTime, /// 开始时间
                EndTime:(!_date||!_endTime)?'':_date+' '+_endTime,/// 结束时间
                JoinIDs:choosePerson.selectedData().split(';'),/// 参加人ID集合
                BeforeTime:remind_text.val(),/// 提醒设置时间
                BeforeTimeType:selectunit.getValue(),/// 提醒设置类型（0.分钟 1.小时 2.日 3.周)
                Content:detail_text.val(),/// 详细内容
                FileIDs:fileIDs,/// 附件ID列表
                IsCycle:isrepeat.hasClass('checked'),/// 是否循环日程
                CycleType:repeat_radio.find('.app-radio.checked').attr('type'),/// 循环周期类型（1.每天 2.每周）
                CycleStartDate:repeat_startTime.val(), /// 循环开始日期
                CycleEndDate:repeat_endTime.val(),/// 循环结束日期
                CycleValues:cycleValues.join(','),/// 循环内容（循环周期类型为每周时使用，1-7分别代表周一到周日，以“,”分割）
                IsIncludeWeekend:hasweekend.find('.app-checkbox').hasClass('checked')/// 是否包含周末（循环周期类型为每天时使用)
            }

            var notifstr=chooseNotify.selectedData();
            if(!notifstr){
                scheduleinfo.NotifyIDs=[];
            }else{
                scheduleinfo.NotifyIDs=chooseNotify.selectedData().split(';');//知会人集合
            }
            if(scheduleinfo.Type=='1'){
                scheduleinfo.Place= $.trim(place_input.val());
                if(!scheduleinfo.Place){
                    i8ui.error('请填写日程地点！');
                    _this.html('保存').removeClass('posting');
                    return;
                }
            }else if(scheduleinfo.Type=='2'){
                scheduleinfo.MettingRoomID=selectPlace.getValue();
                scheduleinfo.Place=$.trim(meetplace.val());
                if(!scheduleinfo.MettingRoomID){
                    i8ui.error('请选择会议室！');
                    _this.html('保存').removeClass('posting');
                    return;
                }
                if(scheduleinfo.MettingRoomID=='00000000-0000-0000-0000-000000000000'&&!scheduleinfo.Place){
                    i8ui.error('请选择填写会议地点！');
                    _this.html('保存').removeClass('posting');
                    return;
                }

            }

            if(scheduleinfo.IsCycle&&scheduleinfo.CycleType==2&&!scheduleinfo.CycleValues){
                i8ui.error('请完善循环周期！');
                _this.html('保存').removeClass('posting');
                return;
            }

            if(validateScheduleInfo(scheduleinfo)){
                if(!options.isedit){
                    var fileIDs=[];
                    var uploadfiles=i8uploader.getUploadFiles();
                    var files=uploadfiles.concat(i8uploader.getExistFiles());
                    $(files).each(function(i,item){
                        fileIDs.push(item.fileid||item.ID);
                    })
                    scheduleinfo.FileIDs=fileIDs;
                    if(uploadfiles.length){
                        common.ajax.toqinniu(uploadfiles,function(data){
                            if($.type(data)=='object'&&data.Result){
                                saveSchdule(scheduleinfo);
                            }else{
                                i8ui.alert({title:'文件存储失败！'});
                                _this.html('保存').removeClass('posting');
                            }
                        })
                    }else{
                        saveSchdule(scheduleinfo);
                    }
                }else{
                    saveSchdule(scheduleinfo);
                }
            }else{
                _this.html('保存').removeClass('posting');
            }
        });

        //编辑时绑定数据
        var bindData=function(){
            var _data=options.data;
            if(_data.Type==1){//日程
                selectType.setValue(1);
            }else{
                selectType.setValue(2);
            }
            if(_data.IsCycle){
                isrepeat.trigger('click');
                var cycleType=_data.CycleType;
                repeat_radio.find('span[type='+cycleType+']').trigger('click');
                if(_data.IsIncludeWeekend){
                    hasweekend.addClass('checked');
                }else if(_data.CycleValues){
                    var cv=_data.CycleValues.split(',');
                    for(var i=0;i<cv.length;i++){
                        repeat_checkbox.find('.app-checkbox[type='+cv[i]+']').addClass('checked');
                    }
                }
                addDate.off('click');
                selectunit.setValue(_data.BeforeTimeType);
            }

            selectType.off('click');
            isrepeat.off('click').css('background-color','#f0f0f0');

        }
        if(options.isedit){
            bindData();
        }


        getSelectFreeRoom();

    }
});