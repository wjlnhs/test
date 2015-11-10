define(function (require, exports,modules) {
    var ajaxHost = i8_session.ajaxHost;
    var resHost = i8_session.resHost;
    var fileuploader = require('../plugins/qiniu_uploader/qiniu_i8uploader.js');
    var i8ui = require('../common/i8ui');
    var crclebox=require('./crclebox');
    var funs={
        ajax:{
            //获取所有会议室信息
            /// <param name="accountID">社区ID</param>
            getAllRoom:function(callback){
                $.ajax({
                    url: ajaxHost + 'webajax/calendar_ajax/getallroom',
                    type: 'get',
                    dataType: 'json',
                    cache:false,
                    success: function (data) {
                        callback(data);
                    }, error: function (error) {
                        callback(error);
                    }
                });
            },
            //获取所有会议室信息（分页）
            /// <param name="accountID">社区ID</param>
            /// <param name="pageSize">每页显示数量</param>
            /// <param name="pageIndex">页码</param>
            getAllRoomByPage:function(options,callback){
                $.ajax({
                    url: ajaxHost + 'webajax/calendar_ajax/getallroombypage',
                    type: 'get',
                    dataType: 'json',
                    cache:false,
                    data:{options:options},
                    success: function (data) {
                        callback(data);
                    }, error: function (error) {
                        callback(error);
                    }
                });
            },
            /// <summary>
            /// 保存会议室(新增和修改)
            /// </summary>
            /// <param name="accountID">社区ID</param>
            /// <param name="mettingRoom">会议室实体</param>
            saveRoom:function(options,callback){
                $.ajax({
                    url: ajaxHost + 'webajax/calendar_ajax/saveroom',
                    type: 'get',
                    dataType: 'json',
                    cache:false,
                    data:{options:options},
                    success: function (data) {
                        callback(data);
                    }, error: function (error) {
                        callback(error);
                    }
                });
            },
            /// <summary>
            /// 删除会议室
            /// </summary>
            /// <param name="accountID">社区ID</param>
            /// <param name="mettingRoomID">会议室ID</param>
            deleteRoom:function(options,callback){
                $.ajax({
                    url: ajaxHost + 'webajax/calendar_ajax/deleteroom',
                    type: 'get',
                    dataType: 'json',
                    cache:false,
                    data:{options:options},
                    success: function (data) {
                        callback(data);
                    }, error: function (error) {
                        callback(error);
                    }
                });
            },
            //获取空闲会议室
            ///<param name="accountID">社区ID</param>
            /// <param name="mettingStartTime">会议开始时间</param>
            /// <param name="mettingEndTime">会议结束时间</param>
            /// <param name="pageSize">每页显示数量</param>
            /// <param name="pageIndex">页码</param>
            getFreeRoom:function(options,callback){
                $.ajax({
                    url: ajaxHost + 'webajax/calendar_ajax/getfreeroom',
                    type: 'get',
                    dataType: 'json',
                    cache:false,
                    data:{options:options},
                    success: function (data) {
                        callback(data);
                    }, error: function (error) {
                        callback(error);
                    }
                });
            },
            //根据ID获取会议室
            /// <param name="accountID">社区ID</param>
            /// <param name="mettingRoomID">会议室ID</param>
            getRoomByID:function(mettingRoomID,callback){
                $.ajax({
                    url: ajaxHost + 'webajax/calendar_ajax/getroombyid',
                    type: 'get',
                    dataType: 'json',
                    cache:false,
                    data:{mettingRoomID:mettingRoomID},
                    success: function (data) {
                        callback(data);
                    }, error: function (error) {
                        callback(error);
                    }
                });
            },
            //获取指定会议室指定时间范围内使用情况
            /// <param name="accountID">社区ID</param>
            /// <param name="mettingRoomID">会议室ID</param>
            /// <param name="mettingStartDate">开始日期</param>
            /// <param name="mettingEndDate">结束日期</param>
            getRoomByDate:function(options,callback){
                $.ajax({
                    url: ajaxHost + 'webajax/calendar_ajax/getroombydate',
                    type: 'get',
                    dataType: 'json',
                    cache:false,
                    data:{options:options},
                    success: function (data) {
                        callback(data);
                    }, error: function (error) {
                        callback(error);
                    }
                });
            },
            /// <summary>
            /// 获取日程视图(包括日视图、周视图、月视图)
            /// </summary>
            /// <param name="accountID">社区ID</param>
            /// <param name="passportID">用户ID</param>
            /// <param name="startDate">查询开始日期</param>
            /// <param name="endDate">查询结束日期</param>
            /// <param name="userIDs">日程创建人</param>
            /// <param name="isViewTask">是否显示我的任务</param>
            getScheduleView:function(options,callback){
                $.ajax({
                    url: ajaxHost + 'webajax/calendar_ajax/getscheduleview',
                    type: 'get',
                    dataType: 'json',
                    cache:false,
                    data:{options:options},
                    success: function (data) {
                        callback(data);
                    }, error: function (error) {
                        callback(error);
                    }
                });
            },
            /// <summary>
            /// 添加日程
            /// </summary>
            /// <param name="accountID">社区ID</param>
            /// <param name="userID">创建用户ID</param>
            /// <param name="scheduleinfo">日程数据</param>
            /// <returns></returns>
            addSchedule:function(options,callback){
                $.ajax({
                    url: ajaxHost + 'webajax/calendar_ajax/addschedule',
                    type: 'get',
                    dataType: 'json',
                    cache:false,
                    data:{options:options},
                    success: function (data) {
                        callback(data);
                    }, error: function (error) {
                        callback(error);
                    }
                });
            },
            /// <summary>
            /// 修改日程
            /// </summary>
            /// <param name="accountID">社区ID</param>
            /// <param name="scheduleID">日程实例ID</param>
            /// <param name="userID">创建用户ID</param>
            /// <param name="newschedule">修改后的日程数据</param>
            /// <param name="updateType">修改类型(0.不是循环日程(默认) 1.仅此日程 2.后续日程 3.全部日程)</param>
            updateSchedule:function(options,callback){
                $.ajax({
                    url: ajaxHost + 'webajax/calendar_ajax/updateschedule',
                    type: 'get',
                    dataType: 'json',
                    cache:false,
                    data:{options:options},
                    success: function (data) {
                        callback(data);
                    }, error: function (error) {
                        callback(error);
                    }
                });
            },
            /// <summary>
            /// 删除日程
            /// </summary>
            /// <param name="accountID">社区ID</param>
            /// <param name="userID">用户ID</param>
            /// <param name="scheduleID">日程ID</param>
            /// <param name="updateType">删除类型(0.不是循环日程(默认) 1.仅此日程 2.后续日程 3.全部日程)</param>
            deleteSchedule:function(options,callback){
                $.ajax({
                    url: ajaxHost + 'webajax/calendar_ajax/deleteschedule',
                    type: 'get',
                    dataType: 'json',
                    cache:false,
                    data:{options:options},
                    success: function (data) {
                        callback(data);
                    }, error: function (error) {
                        callback(error);
                    }
                });
            },
            /// <summary>
            /// 根据ID获取日程详细
            /// </summary>
            /// <param name="accountID">社区ID</param>
            /// <param name="scheduleID">日程ID</param>
            /// <param name="passportID">用户ID</param>
            getScheduleById:function(scheduleID,callback){
                $.ajax({
                    url: ajaxHost + 'webajax/calendar_ajax/getschedulebyid',
                    type: 'get',
                    dataType: 'json',
                    cache:false,
                    data:{scheduleID:scheduleID},
                    success: function (data) {
                        callback(data);
                    }, error: function (error) {
                        callback(error);
                    }
                });
            },
            /// <summary>
            /// 获取日程或任务标签
            /// </summary>
            /// <param name="accountID">社区ID</param>
            /// <param name="passportID">用户ID</param>
            /// <param name="scheduleID">日程ID或任务ID</param>
            ///  <param name="viewType">标签类型 1.日程 2.任务</param>
            getScheduleLabel:function(options,callback){
                $.ajax({
                    url: ajaxHost + 'webajax/calendar_ajax/getschedulelabel',
                    type: 'get',
                    dataType: 'json',
                    cache:false,
                    data:{options:options},
                    success: function (data) {
                        callback(data);
                    }, error: function (error) {
                        callback(error);
                    }
                });
            },
            /// <summary>
            /// 获取主题列表
            /// </summary>
            /// <param name="accountID">社区ID</param>
            /// <param name="startDate">查询开始日期</param>
            /// <param name="endDate">查询结束日期</param>
            /// <param name="userIDs">日程创建人</param>
            getScheduleList:function(options,callback){
                $.ajax({
                    url: ajaxHost + 'webajax/calendar_ajax/getschedulelist',
                    type: 'get',
                    dataType: 'json',
                    cache:false,
                    data:{options:options},
                    success: function (data) {
                        callback(data);
                    }, error: function (error) {
                        callback(error);
                    }
                });
            },
            /// <summary>
            /// 获取待办日程
            /// </summary>
            /// <param name="accountID">社区ID</param>
            /// <param name="passportID">用户ID</param>
            /// <param name="pageSize">每页显示数量</param>
            /// <param name="pageIndex">页码</param>
            getToDoSchedule:function(options,callback){
                $.ajax({
                    url: ajaxHost + 'webajax/calendar_ajax/gettodoschedule',
                    type: 'get',
                    dataType: 'json',
                    cache:false,
                    data:{options:options},
                    success: function (data) {
                        callback(data);
                    }, error: function (error) {
                        callback(error);
                    }
                });
            },
            /// <summary>
            /// 添加地点
            /// </summary>
            /// <param name="accountID">社区ID</param>
            /// <param name="place">地点</param>
            addPlace:function(options,callback){
                $.ajax({
                    url: ajaxHost + 'webajax/calendar_ajax/addplace',
                    type: 'get',
                    dataType: 'json',
                    cache:false,
                    data:{options:options},
                    success: function (data) {
                        callback(data);
                    }, error: function (error) {
                        callback(error);
                    }
                });
            },

            /// <summary>
            /// 删除地点
            /// </summary>
            /// <param name="accountID">社区ID</param>
            /// <param name="placeID">地点ID</param>
            deletePlace:function(options,callback){
                $.ajax({
                    url: ajaxHost + 'webajax/calendar_ajax/deleteplace',
                    type: 'get',
                    dataType: 'json',
                    cache:false,
                    data:{options:options},
                    success: function (data) {
                        callback(data);
                    }, error: function (error) {
                        callback(error);
                    }
                });
            },
            /// <summary>
            /// 获取日程地点(分页)
            /// </summary>
            /// <param name="accountID">社区ID</param>
            /// <param name="pageSize">每页显示数量</param>
            /// <param name="pageIndex">页码</param>
            getPlaceByPage:function(options,callback){
                $.ajax({
                    url: ajaxHost + 'webajax/calendar_ajax/getplacebypage',
                    type: 'get',
                    dataType: 'json',
                    cache:false,
                    data:{options:options},
                    success: function (data) {
                        callback(data);
                    }, error: function (error) {
                        callback(error);
                    }
                });
            },
            /// <summary>
            /// 获取日程设置
            /// </summary>
            /// <param name="accountID">社区ID</param>
            /// <param name="userID">用户ID</param>
            /// <returns></returns>
            getScheduleSet:function(callback){
                $.ajax({
                    url: ajaxHost + 'webajax/calendar_ajax/getscheduleset',
                    type: 'get',
                    dataType: 'json',
                    cache:false,
                    success: function (data) {
                        callback(data);
                    }, error: function (error) {
                        callback(error);
                    }
                });
            },
            /// <summary>
            /// 保存日程设置
            /// </summary>
            /// <param name="accountID">社区ID</param>
            /// <param name="userID">用户ID</param>
            /// <param name="model">日程设置实体</param>
            /// <returns></returns>
            saveScheduleSet:function(viewtype,callback){
                $.ajax({
                    url: ajaxHost + 'webajax/calendar_ajax/savescheduleset',
                    type: 'get',
                    dataType: 'json',
                    cache:false,
                    data:{ViewType:viewtype},
                    success: function (data) {
                        callback(data);
                    }, error: function (error) {
                        callback(error);
                    }
                });
            },
            /// <summary>
            /// 保存ICS
            /// </summary>
            /// <param name="accountID">社区ID</param>
            /// <param name="userID">用户ID</param>
            /// <returns></returns>
            createICS:function(callback){
                $.ajax({
                    url: ajaxHost + 'webajax/calendar_ajax/createics',
                    type: 'get',
                    dataType: 'json',
                    cache:false,
                    success: function (data) {
                        callback(data);
                    }, error: function (error) {
                        callback(error);
                    }
                });
            },
            /// <summary>
            /// 保存ICS
            /// </summary>
            /// <param name="accountID">社区ID</param>
            /// <param name="userID">用户ID</param>
            /// <returns></returns>
            addFiles:function(options,callback){
                $.ajax({
                    url: ajaxHost + 'webajax/calendar_ajax/addfiles',
                    type: 'get',
                    dataType: 'json',
                    data:{options:options},
                    cache:false,
                    success: function (data) {
                        callback(data);
                    }, error: function (error) {
                        callback(error);
                    }
                });
            },
            /// <summary>
            /// 保存ICS
            /// </summary>
            /// <param name="accountID">社区ID</param>
            /// <param name="userID">用户ID</param>
            /// <returns></returns>
            deleteFiles:function(options,callback){
                $.ajax({
                    url: ajaxHost + 'webajax/calendar_ajax/deletefiles',
                    type: 'get',
                    dataType: 'json',
                    data:{options:options},
                    cache:false,
                    success: function (data) {
                        callback(data);
                    }, error: function (error) {
                        callback(error);
                    }
                });
            },
            toqinniu: function (file, callback) {
                $.ajax({
                    url: ajaxHost + 'webajax/calendar_ajax/upqiniu',
                    type: 'get',
                    dataType: 'json',
                    data: {attachment: file},
                    cache: false,
                    success: function (result) {
                        callback(result)
                    },
                    error: function (e1, e2, e3) {
                        callback(e1)
                    }
                });
            },
            up: function (options) {
                if(options.isedit){
                    $('.attach-line').hide();
                    return false;
                }
                var attachmentlist = [];
                var ver=''
                if (options.data) {
                    attachmentlist = options.data.FileList;
                    ver=options.data.ver||'';
                }

                //文件上传按钮
                var options = {'button':'uploaderbtncalendar'+ver,//按钮ID
                    'fileContainerId':'uploadercalendar'+ver,//装文件容器
                    'btnContainerId':'btn_calendarcontainer'+ver,//按钮ID容器
                    'attachmentlist':attachmentlist,
                    'tokenUrl':'/platform/uptoken',
                    'flashUrl':'/default/javascripts/plugins/qiniu_uploader/plupload/Moxie.swf',
                    'fileUploaded':function(){

                    }
                };
                return fileuploader.i8uploader(options)
                /*var attachmentlist = [];
                if (options.data.FileList) {
                    attachmentlist = options.data.FileList;
                }
                var option = {
                    swf: resHost + 'swf/Uploader.swf', // 'swf/swfupload.swf',
                    server: ajaxHost + 'webajax/appcom/fileupload',//
                    pick: {
                        id: '#uploaderbtn',
                        label: '上传',
                        html: '<span class="s-icon attachment-btn">附件</span>'
                    },
                    container:'#uploaderbtn',
                    attachmentlist: attachmentlist,
                    dnd: '#uploader .queueList',
                    paste: document.body,
                    disableGlobalDnd: true,
                    accept: {
                        extensions: 'png,jpg,jpeg,gif,xls,xlsx,doc,docx'
                    },
                    replace: false,
                    chunked: true,
                    fileNumLimit: 5,
                    fileSizeLimit: 20 * 1024 * 1024,    // 所有文件限制20M
                    fileSingleSizeLimit: 5 * 1024 * 1024,   // 单个文件限制5M
                    uploadSuccess: function (file, response) {

                    }, *//*文件上传成功回调*//*
                    uploadFailed: function (file) {

                    }, *//*文件上传失败*//*
                    uploadCompleted: function (error) {

                    },//文件上传结束 成功或失败
                    deleteCallBack: function (file) {

                    }, *//*删除文件回调*//*
                    uploadStarted: function (file) {

                    }*//*开始上传触发*//*
                };
                //console.log(upfileContor);
                return i8uploader.i8uploader(option);//调用上传插件*/
            }
        },
        units:{
            //格式化日程 会议列表显示
            formatScheduleList:function(rtobj){
                var arr=[];
                var readList={};
                for(var i=0;i<rtobj.length;i++){
                    var startday=rtobj[i].ScheduleStartDay;
                    if(readList[startday]){
                        readList[startday].push(rtobj[i]);
                    }else{
                        readList[startday]=[];
                        arr.push(readList[startday]);
                        readList[startday].push(rtobj[i]);
                    }
                }
                return arr;
            },
            //根据日期获取日期所在周
            getWeekByDay:function(y,m,d){
                var date=new Date(y,m,d);
                var year=date.getFullYear();
                var month=date.getMonth();
                var day=date.getDay()||7;
                var date=date.getDate();
                return {
                    beginDate:new Date(year,month,date-day+1),
                    endDate:new Date(year,month,date-day+7)
                }
            },
            //根据日期上一周下一周
            getNewWeekByDay:function(date,i){
                return funs.units.getWeekByDay(date.getFullYear(),date.getMonth(),date.getDate()+(i*7));
            }
        },
        _option:{
            deleteSchedule:function(_data,callback){
                if(_data.ID){
                    if(_data.IsCycle){
                        crclebox.openWindow('是否确定删除？',function(type){
                            funs.ajax.deleteSchedule({scheduleID:_data.ID,updateType:type},function(data){
                                if($.type(data)=='object'&&data.Result){
                                    i8ui.write('删除成功！')
                                    callback();
                                }else{
                                    i8ui.error('删除失败，'+(data.Description||'请求超时！'));
                                }
                            });
                        });
                    }else{
                        i8ui.confirm({title:'是否确定删除？'},function(){
                            funs.ajax.deleteSchedule({scheduleID:_data.ID,updateType:0},function(data){
                                if($.type(data)=='object'&&data.Result){
                                    i8ui.write('删除成功！');
                                    callback();
                                }else{
                                    i8ui.error('删除失败，'+(data.Description||'请求超时！'));
                                }
                            });
                        })
                    }
                }else{
                    i8ui.error('获取数据失败请刷新页面！');
                }
            }
        }
    }
    modules.exports=funs;
});