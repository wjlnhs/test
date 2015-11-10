define(function (require, exports, modules) {
    var ajaxHost = i8_session.ajaxHost;
    var resHost = i8_session.resHost;
    //var i8uploader = require('../plugins/i8uploader/fw_i8uploader.js');
    var i8uploader=require('../plugins/qiniu_uploader/qiniu_i8uploader');
    var i8ui = require('../common/i8ui');
    var selector = require('../plugins/i8selector/fw_selector.js');
    var fileViewer=require('../common/seefile');
    var i8hash=require('../common/i8hash.js');
    var process=require('./process.js');
    var render_rpt=require('./render_rpt.js');
    var common = {
        ajax:
        {   //新建用户任务
            addTask: function (options, callback) {
                $.ajax({
                    url: ajaxHost + 'webajax/task/addTask',
                    type: 'post',
                    dataType: 'json',
                    cache:false,
                    data: {options: options},
                    success: function (data) {
                        if(data.Code!=0){
                            i8ui.error(data.Description+' (新建用户任务)')
                        }else{
                            callback(data);
                        }
                        $('#save_task').removeClass('saving btn-gray96x32').text('保存');
                    }, error: function (error) {
                        $('#save_task').removeClass('saving btn-gray96x32').text('保存');
                        i8ui.error('请求超时')
                    }
                });
            },
            //获取分享给我的人
            getShareMeUsers: function (options, callback) {
                $.ajax({
                    url: ajaxHost + 'webajax/task/getShareMeUsers',
                    type: 'get',
                    dataType: 'json',
                    cache:false,
                    data: {options: options},
                    success: function (data) {
                        callback(data);
                    }, error: function (error) {
                        console.log(error);
                        i8ui.error('请求超时')
                    }
                });
            },
            //获取用户任务
            getUserTask: function (options, callback) {
                $.ajax({
                    url: ajaxHost + 'webajax/task/GetUserTask',
                    type: 'get',
                    dataType: 'json',
                    cache:false,
                    data: {options: options},
                    success: function (data) {
                        if(data.Code!=0){
                            i8ui.error(data.Description+' (获取用户任务)')
                        }else{
                            callback(data);
                        }
                    }, error: function (error) {
                        console.log(error);
                        i8ui.error('请求超时')
                    }
                });
            }
            //获取已完成任务
            ,getFinishTask: function (options, callback) {
                $.ajax({
                    url: ajaxHost + 'webajax/task/GetFinishTask',
                    type: 'get',
                    dataType: 'json',
                    cache:false,
                    data: {options: options},
                    success: function (data) {
                        if(data.Code!=0){
                            i8ui.error(data.Description+' (获取已完成任务)')
                        }else{
                            callback(data);
                        }
                    }, error: function (error) {
                        console.log(error);
                        i8ui.error('请求超时')
                    }
                });
            }
            //获取单条数据
            ,getSingleTask:function (options, callback,errcallback) {
                $.ajax({
                    url: ajaxHost + 'webajax/task/getSingleTask',
                    type: 'get',
                    dataType: 'json',
                    cache:false,
                    data: {options: options},
                    success: function (data) {
                        if(data.Code!=0){
                            if(errcallback){
                                errcallback(data);
                            }else{
                                i8ui.error(data.Description+' (获取单条数据)')
                            }
                        }else{
                            callback(data);
                        }
                    }, error: function (error) {
                        console.log(error);
                        i8ui.error('请求超时')
                    }
                });
            }
            //删除单条任务
            ,deleteTask:function (options, callback) {
                $.ajax({
                    url: ajaxHost + 'webajax/task/deleteTask',
                    type: 'get',
                    dataType: 'json',
                    cache:false,
                    data: {options: options},
                    success: function (data) {
                        if(data.Code!=0){
                            i8ui.error(data.Description+' (删除单条任务)')
                        }else{
                            callback(data);
                        }
                    }, error: function (error) {
                        console.log(error);
                        i8ui.error('请求超时')
                    }
                });
            }
            //更新单条任务
            ,updateInfo:function (options, callback) {
                $.ajax({
                    url: ajaxHost + 'webajax/task/updateInfo',
                    type: 'get',
                    dataType: 'json',
                    cache:false,
                    data: {options: options},
                    success: function (data) {
                        if(data.Code!=0){
                            i8ui.error(data.Description+' (更新单条任务)')
                        }else{
                            callback(data);
                        }
                    }, error: function (error) {
                        console.log(error);
                        i8ui.error('请求超时');
                    }
                });
            }
            //关注任务
            ,favorTask:function (options, callback) {
                $.ajax({
                    url: ajaxHost + 'webajax/task/favorTask',
                    type: 'get',
                    dataType: 'json',
                    cache:false,
                    data: {options: options},
                    success: function (data) {
                        if(data.Code!=0){
                            i8ui.error(data.Description+' (关注任务)')
                        }else{
                            callback(data);
                        }
                    }, error: function (error) {
                        console.log(error);
                        i8ui.error('请求超时');
                    }
                });
            }
            //取消关注
            ,unFavorTask:function (options, callback) {
                $.ajax({
                    url: ajaxHost + 'webajax/task/unFavorTask',
                    type: 'get',
                    dataType: 'json',
                    cache:false,
                    data: {options: options},
                    success: function (data) {
                        if(data.Code!=0){
                            i8ui.error(data.Description+' (取消关注)')
                        }else{
                            callback(data);
                        }
                    }, error: function (error) {
                        console.log(error);
                        i8ui.error('请求超时');
                    }
                });
            }
            //添加子任务
            ,addTaskItem:function (options, callback) {
                $.ajax({
                    url: ajaxHost + 'webajax/task/addTaskItem',
                    type: 'get',
                    dataType: 'json',
                    cache:false,
                    data: {options: options},
                    success: function (data) {
                        if(data.Code!=0){
                            i8ui.error(data.Description+' (添加子任务)')
                        }else{
                            callback(data);
                        }
                    }, error: function (error) {
                        console.log(error);
                        i8ui.error('请求超时');
                    }
                });
            }
            //更新子任务
            ,updateTaskItem:function (options, callback) {
                $.ajax({
                    url: ajaxHost + 'webajax/task/updateTaskItem',
                    type: 'get',
                    dataType: 'json',
                    cache:false,
                    data: {options: options},
                    success: function (data) {
                        if(data.Code!=0){
                            i8ui.error(data.Code+data.Description+' (更新子任务)')
                        }else{
                            callback(data);
                        }
                    }, error: function (error) {
                        console.log(error);
                        i8ui.error('请求超时');
                    }
                });
            }
            //删除子任务
            ,delTaskItem:function (options, callback) {
                $.ajax({
                    url: ajaxHost + 'webajax/task/delTaskItem',
                    type: 'get',
                    dataType: 'json',
                    cache:false,
                    data: {options: options},
                    success: function (data) {
                        if(data.Code!=0){
                            i8ui.error(data.Description+' (删除子任务)')
                        }else{
                            callback(data);
                        }
                    }, error: function (error) {
                        console.log(error);
                        i8ui.error('请求超时');
                    }
                });
            }
            //更新单条信息
            ,updateInfo:function (options, callback) {
                $.ajax({
                    url: ajaxHost + 'webajax/task/updateInfo',
                    type: 'get',
                    dataType: 'json',
                    cache:false,
                    data: {options: options},
                    success: function (data) {
                        if(data.Code!=0){
                            i8ui.error(data.Description+' (更新单条信息)')
                        }else{
                            callback && callback(data);
                        }
                    }, error: function (error) {
                        console.log(error);
                        i8ui.error('请求超时');
                    }
                });
            }
            //新增附件updateFiles
            ,addFiles:function (options, callback) {
                $.ajax({
                    url: ajaxHost + 'webajax/task/AddFiles',
                    type: 'get',
                    dataType: 'json',
                    cache:false,
                    data: {options: options},
                    success: function (data) {
                        if(data.Code!=0){
                            i8ui.error(data.Description+' (新增附件)')
                        }else{
                            callback(data);
                        }
                    }, error: function (error) {
                        console.log(error);
                        i8ui.error('请求超时');
                    }
                });
            }
            //删除附件
            ,deleteFile:function (options, callback) {
                $.ajax({
                    url: ajaxHost + 'webajax/task/DeleteFile',
                    type: 'get',
                    dataType: 'json',
                    cache:false,
                    data: {options: options},
                    success: function (data) {
                        if(data.Code!=0){
                            i8ui.error(data.Description+' (删除附件)')
                        }else{
                            callback(data);
                        }
                    }, error: function (error) {
                        console.log(error);
                        i8ui.error('请求超时');
                    }
                });
            }
            //获取任务统计
            ,getUserRpt:function(options, callback){
                $.ajax({
                    url: ajaxHost + 'webajax/task/getUserRpt',
                    type: 'get',
                    dataType: 'json',
                    cache:false,
                    data: {options: options},
                    success: function (data) {
                        if(data.Code!=0){
                            i8ui.error(data.Description+' (获取任务统计)')
                        }else{
                            callback(data);
                        }
                    }, error: function (error) {
                        console.log(error);
                        i8ui.error('请求超时');
                    }
                });
            }
            //更新状态
            ,updateTaskStatus:function(options, callback){
                $.ajax({
                    url: ajaxHost + 'webajax/task/updateTaskStatus',
                    type: 'get',
                    dataType: 'json',
                    cache:false,
                    data: {options: options},
                    success: function (data) {
                        if(data.Code!=0){
                            i8ui.error(data.Description+' (更新状态)')
                        }else{
                            callback && callback(data);
                        }
                    }, error: function (error) {
                        console.log(error);
                        i8ui.error('请求超时');
                    }
                });
            }
            //上传到七牛
            ,toqinniu: function (file, callback) {
                $.ajax({
                    url: ajaxHost + 'webajax/task/upqiniu',
                    type: 'get',
                    dataType: 'json',
                    cache:false,
                    data: {attachment: file},
                    cache: false,
                    success: function (result) {
                        callback(result)
                    },
                    error: function (e1, e2, e3) {
                        callback(e1)
                    }
                });
            }
            ,up: function (options,cbks) {
                //文件上传按钮
                var option = {'button':'uploaderbtn',//按钮ID
                    'fileContainerId':'queueList',//装文件容器
                    'btnContainerId':'uploaderbtn_box',//按钮ID容器
                    'attachmentlist':options.attachmentlist || [],
                    'tokenUrl':'/platform/uptoken',
                    'flashUrl':'/default/javascripts/plugins/qiniu_uploader/plupload/Moxie.swf',
                    'fileUploaded':function(file,up,info){
                        //cbks.uploadSuccessCbk && cbks.uploadSuccessCbk(info);
                        var info=$.parseJSON(info);
                        options.uploadSuccess_cbk && options.uploadSuccess_cbk(info,file,up);
                    },
                    'beforeUpload': function (up, file){
                        //cbks.uploadStartedCbk && cbks.uploadStartedCbk(up, file);
                    },
                    'allFileUploaded':function(info,file,up){
                        options.allFileUploaded_cbk && options.allFileUploaded_cbk(info,file,up);
                    }
                };
                option= $.extend(option,options)
                return i8uploader.i8uploader(option);//调用上传插件
            }
        },
        tool:{
            //更新分页hash
            updatePageHash:function(pageSize,pageIndex,pageType,isfinish){
                i8hash.setHashJson({
                    pageSize:pageSize,
                    pageIndex:pageIndex,
                    pageType:pageType
                })
            }
            ,
            getSelector:function(box){
                var fw_ksninput=$(box).find('.fw_ksninput'), ids=[], names=[];
                fw_ksninput.find('em').each(function(){
                    ids.push($(this).text())
                })
                fw_ksninput.find('span').each(function(){
                    names.push($(this).attr('data-uid'))
                })
                return {
                    names:names,
                    ids:ids
                }
            }
            ,getAttachIds:function(obj){
                var ids=[];
                for(var i=0;i<obj.length;i++){
                    ids.push(obj[i].ID)
                }
                return ids;
            }
            ,getStatus:function(num){
                switch (num){
                    case 0:
                        return "删除"
                    break;
                    case 1:
                        return "待查看"
                        break;
                    case 2:
                        return "待完成"
                        break;
                    case 3:
                        return "待评审"
                        break;
                    case 4:
                        return "已关闭"
                        break;
                    case 5:
                        return "已终止"
                        break;
                    case 6:
                        return "被重启"
                        break;
                    case 7:
                        return "被退回"
                        break;
                }
            }
            ,setSelectorAndLoad:function(ele,ids,num){
                max=num || 10000;
                selector.KSNSelector({
                    model:1,width:'auto',element: ele,maxSelected:max,
                    searchType: { "org": false, "user": true, "grp": false },
                    selectCallback: function (uid, uname, uemail,utype,obj) {
                    },
                    loadItem:{items:ids}
                });
            }
            ,ableSelector:function($parent){
                $parent.toggleClass('stopedit')
                $parent.find(".fw_sboxer").show();
                $parent.find('.fw_ksntxtbox').css("border", "solid 1px #E2E5E7");
                $parent.find("input").focus();
                $parent.addClass('editing');
            }
            ,stopSelector:function($parent){
                console.log($parent)
                $parent.addClass('stopedit')
                $parent.find(".fw_sboxer").hide();
                $parent.removeClass('editing');
            }
            ,toUpDateInfo:function(sel_obj,taskID,cbk,cbkID){
                if(updating){
                    return;
                }
                updating=true;
                if(!sel_obj.owner.selectedData()){
                    i8ui.error('负责人不能为空');
                    return;
                }
                if(cbkID){
                    var id=cbkID.ownerID || sel_obj.owner.selectedData();
                    var id2=cbkID.reviewID || sel_obj.review.selectedData();
                }else{
                    var id=sel_obj.owner.selectedData();
                    var id2=sel_obj.review.selectedData();
                }
                if(!sel_obj.participants.selectedData()){
                    var id3=[];
                }else{
                    var id3=sel_obj.participants.selectedData().split(';');
                }
                var _id=[],_id2=[];
                var oldid=$('#owner').attr('oldid');
                if(id!=oldid){
                    if(oldid!='00000000-0000-0000-0000-000000000000'){
                        _id.push(oldid);
                    }
                }
                var oldid2=$('#review').attr('oldid');
                if(id2!=oldid2){
                    if(oldid2!='00000000-0000-0000-0000-000000000000'){
                        _id2.push(oldid2);
                    }
                }
                id3=_.union(_id,id3,_id2)
                var subDate={
                    ownerID:id,
                    reviewID:id2,
                    joinIDs:id3,
                    beginTime:$('#start_time').val(),
                    endTime:$('#end_time').val(),
                    desc:$('#des_input').val(),
                    alert:common.tool.setAlertString($.trim($('#delay_time').val()),$('#delay_time_box .newselectcked').text())
                }
                if($task.ReviewID=='00000000-0000-0000-0000-000000000000'){
                    $task.ReviewID="";
                }
                if(!$('.owner-box').hasClass('editing')){
                    if($task.Description==subDate.desc && $task.AlertBefore==subDate.alert && $task.OwnerID==subDate.ownerID && $task.ReviewID==subDate.reviewID && $task.BeginTime==subDate.beginTime && $task.EndTime==subDate.endTime){
                        if($task.JoinerIDs.toString()==id3.toString()){
                            if(!$.trim($('#des_input').val())){
                                $('#des_txt').text('点击添加任务描述..')
                            }
                            updating=false;
                            return;
                        }
                    }
                }


                common.ajax.updateInfo({
                    task:subDate,
                    taskID:taskID
                },function(data){
                    if(data.Result){
                        if(!$.trim($('#des_input').val())){
                            $('#des_txt').text('点击添加任务描述..')
                        }
                        if(!cbk){
                            if($('#js_lg_tp_div').length==0){
                                i8ui.simpleWrite('更新成功');
                                $task.Description=subDate.desc;
                                $task.AlertBefore=subDate.alert;
                                $task.JoinerIDs=id3;
                                $task.BeginTime=subDate.BeginTime;
                                $task.endTime=subDate.endTime;
                            }
                            setTimeout(function(){
                                updating=false;
                            },100)
                        }
                        //$('.fw_agtlist').remove();
                        //刷新页面
                        if(cbk){
                            cbk(data)
                            if($('#js_lg_tp_div').length==0){
                                i8ui.simpleWrite('更新成功');
                                $task.Description=subDate.desc;
                                $task.AlertBefore=subDate.alert;
                                $task.JoinerIDs=id3;
                            }
                            setTimeout(function(){
                                updating=false;
                            },100)
                            /*common.ajax.getSingleTask({taskID:taskID},function(data){

                            })*/
                        }
                    }else{
                        i8ui.error(data.Description)
                    }
                })
            }
            ,getAlertJson:function(sec){
                var json={};
                switch (true){
                    case sec<60 :
                        json={
                            em:'分钟',
                            num:sec
                        }
                        break;
                    case sec%1440==0 :
                        json={
                            em:'天',
                            num:sec/1440
                        }
                        break;
                    case sec%60==0:
                        json={
                            em:'小时',
                            num:sec/60
                        }
                        break;
                    default :
                        json={
                            em:'分钟',
                            num:sec
                        }
                        break;
                }
                return json;
            },setAlertString:function(sec,em){
                var result={};
                switch (em){
                    case '分钟' :
                        result=sec;
                        break;
                    case '天' :
                        result=sec*1440;
                        break;
                    case '小时' :
                        result=sec*60;
                        break;
                }
                return result;
            }
            ,getAlertHtml :function(sec){
                var time_json=common.tool.getAlertJson(sec);
                return "任务结束前"+time_json.num+""+time_json.em+"";
            }
            ,getAlertNum :function(sec){
                var time_json=common.tool.getAlertJson(sec);
                return time_json.num;
            },reFreshStartEndTime :function(){
                $('#start_time').val();$('#end_time').val()
            }
            ,reFreshStartEndTime :function(){
                $('#start_time_txt').text($('#start_time').val());
                $('#end_time_txt').text($('#end_time').val());
            }
            ,reFreshemindTime:function(){
                $('#time_delay_txt').html(common.tool.getAlertHtml(common.tool.setAlertString($.trim($('#delay_time').val()),$('#delay_time_box .newselectcked').text())))
            }
            ,addChildTask :function(taskID,_val,ownerID,sel_obj){
                common.ajax.addTaskItem({
                    taskID:taskID,
                    sub:{Name:_val,ownerID:ownerID}
                },function(data){
                    if(data.Result){
                        common.tool.renderChild(taskID,data,sel_obj)
                        common.page.refreshProcess(taskID)
                        console.log(data)
                        i8ui.simpleWrite('添加成功!')
                    }else{
                        i8ui.simpleWrite(data.Description)
                    }

                })
            }
            ,updateChildTask:function(taskID,ID,Finished,Name,OwnerID,cbk){
                common.ajax.updateTaskItem({
                    taskID:taskID,
                    itemID:ID,
                    newName:Name,
                    finished:Finished,
                    newOwnerID:OwnerID
                },function(data){
                    console.log(data)
                    if(data.Result){
                        cbk && cbk(data)
                        common.page.refreshProcess(taskID);
                        i8ui.simpleWrite('更新成功!');
                    }
                })
            }
            ,renderChild :function(taskID,data_task,sel_obj){
                var render=function(data_task,JoinerIDs,sel_obj){
                    var $parent=$('.add-blue-box').parent();
                    if(!sel_obj){
                        $parent.find('.child-item').remove();
                    }
                    var child_tpl=require('../../template/task/task_child.tpl');
                    var task_child_render=template(child_tpl);
                    var task_child_html=task_child_render(data_task);
                    $parent.append($(task_child_html).find('.child-item-txt').on('click',function(){
                        if($('.editing-child').length==0){
                            var $this=$(this);
                            $this.hide();
                            $this.prev().show().addClass('editing-child');
                            var selId=$this.prev().find('input').attr('id');//子任务id也是选人空间id
                            var oid=$this.prev().find('input').attr('oid');//负责人id
                            //子任务选人控件
                            selector.KSNSelector({
                                model:1,width:'200',element: '#'+selId,
                                searchType: { "org": false, "user": true, "grp": false },
                                selectCallback: function (uid, uname, uemail,utype,obj) {
                                },
                                cancelCbk:function(){
                                },
                                loadItem:{items:[oid]}
                            });
                            return false;
                        }
                    }).end());
                    if(sel_obj){
                        sel_obj.participants.clearData()//更新主任务参与人
                        sel_obj.participants.loadData(JoinerIDs)//更新主任务参与人
                    }
                    $parent.find('.child-edit-box').on('click',function(){
                        return false;
                    })
                }
                if(data_task){
                    if(sel_obj){
                        data_task.Items=[data_task.ReturnObject && data_task.ReturnObject.AddedItem || {}];
                        var JoinerIDs=data_task.ReturnObject && data_task.ReturnObject.JoinerIDs || [];
                    }
                    render(data_task,JoinerIDs,sel_obj);
                    return;
                }
                common.ajax.getSingleTask({
                    taskID:taskID
                },function(data){
                    var data_task=data.ReturnObject.task;
                    render(data_task)
                })
            }
            ,refreshChild :function(sel_obj,taskID,data_task,replaceid){//replace需要被替换的id
                var $replace=$('#'+replaceid).parents('.child-item');
                var child_tpl=require('../../template/task/task_child.tpl');
                var task_child_render=template(child_tpl);
                var task_child_html=task_child_render(data_task);
                $replace.replaceWith(task_child_html);
                sel_obj.participants.clearData()//更新主任务参与人
                sel_obj.participants.loadData(data_task.JoinerIDs)//更新主任务参与人
                $('#'+replaceid).parents('.child-item').find('.child-item-txt').on('click',function(){
                    if($('.editing-child').length==0){
                        var $this=$(this);
                        $this.hide();
                        $this.prev().show().addClass('editing-child');
                        var selId=$this.prev().find('input').attr('id');//子任务id也是选人空间id
                        var oid=$this.prev().find('input').attr('oid');//负责人id
                        //子任务选人控件
                        selector.KSNSelector({
                            model:1,width:'200',element: '#'+selId,
                            searchType: { "org": false, "user": true, "grp": false },
                            selectCallback: function (uid, uname, uemail,utype,obj) {
                            },
                            cancelCbk:function(){
                            },
                            loadItem:{items:[oid]}
                        });
                        return false;
                    }

                });
                $('#'+replaceid).parents('.child-item').find('.child-edit-box').on('click',function(){
                    return false;
                })
            }
            ,deleteChildTask :function(taskID,itemID,dom){
                common.ajax.delTaskItem({
                    taskID:taskID,
                    itemID:itemID
                },function(data){
                    if(data.Result){
                        console.log(data)
                        dom.remove();
                        i8ui.simpleWrite('删除成功!')
                    }
                })
            }
            ,renderAttach:function(){

            }
            ,updateFiles:function(uploader,taskID,file,oid){
                common.ajax.toqinniu(file,function(data){
                    //执行添加
                    var fls=[];
                    if(data.Result){
                        console.log(data)
                        if(data.ReturnObject.length>0){
                            for(var i=0;i<data.ReturnObject.length;i++){
                                fls.push(data.ReturnObject[i].ID);
                            }
                            //var _upID=data.ReturnObject[0].ID;
                            //fls=common.tool.getAttachIds(uploader.getExistFiles());

                            common.ajax.addFiles({
                                taskID:taskID,
                                fileIDs:fls
                            },function(data){
                               // uploader.start();
                                console.log(data)
                                common.tool.updateView(taskID);
                                //$('.state-complete').last().attr('doc_id',_upID);
                                uploader.uploaderReset();
                                //$('#'+oid).find('.cancel').trigger('click');
                                i8ui.write('更新成功');
                            })
                        }
                    }
                })
            }
            ,setAttachmentlist:function(Files){
                    if(!Files){
                        return;
                    }
                    var uid=i8_session.uid;
                    for(var i=0;i<Files.length;i++){
                        Files[i].ImageSmall=Files[i].FilePath;
                        Files[i].DocID=Files[i].ID;
                        if(uid==Files[i].CreaterID){
                            Files[i].showDel=true;
                        }
                    }
                }
            ,deleteFile:function(uploader,taskID,deleteID){
                var update_ly=i8ui.showbox({
                    cont:'<div class="ld-64-write" style="width:64px;height: 64px;"></div>'
                })
                //fls= _.without(fls,deleteID)
                //执行删除
                common.ajax.deleteFile({
                    taskID:taskID,
                    fileID:deleteID
                },function(data){
                    common.tool.updateView(taskID);
                    console.log(data)
                    update_ly.close();
                    i8ui.simpleWrite('删除成功')
                })
            }
            ,updateView:function(taskID){
                common.ajax.getSingleTask({
                    taskID:taskID
                },function(data){
                    var $task=data.ReturnObject.task;
                    var attachmentlist=$task.Files;
                    common.tool.setAttachmentlist(attachmentlist);
                    $('.show-attachmentlist').html(fileViewer.ks.getHtml(attachmentlist,true,null,true));
                    fileViewer.ks.bindImgClick($('.show-attachmentlist'));
                })
            }
        }
        ,page:{
            renderProcess:process.renderProcess,
            setExcelUrl:function(){
                var json={
                    createTime:$('#export_start').val(),
                    endTime:$('#export_end').val()
                };
                if($('#export_by_create').hasClass('checked')){
                    json.type=0;
                }else{
                    json.type=1;
                }
                var str='';
                for(var i in json){
                    str+=i+'='+json[i]+'&';
                }
                var _href="webajax/task/exportTask?"+str
                $('#doexport').attr('href',_href);
            }
            ,finish_btn_ev:function(taskID,cbk){
                var titleStr="确定要完成吗？";
                if($('.task-check-row').find('.app-checkbox').length!=$('.task-check-row').find('.checked').length){
                    titleStr="该任务有尚未提交的子任务, 确定要完成吗？";
                }
                i8ui.confirm({
                    title:titleStr
                },function(){
                    common.ajax.updateTaskStatus({
                        taskID:taskID,
                        action:2,
                        score:10,
                        note: $.trim($('#finish_note').val())
                    },function(data){
                        if(data.Result){
                            i8ui.successMask('保存成功！');
                            cbk && cbk();
                            finish_dilog.close();
                        }
                    })
                })
               /* var finish_dilog= i8ui.showbox({
                    title:'任务提交',
                    cont:'<div style="height: 150px;width: 295px;padding: 15px;">' +
                        '<div class="cate-title">'+titleStr+'</div>' +
                        '<div class="cate-body"><textarea id="finish_note" placeholder="随便说下进展..." style="padding: 5px;box-sizing: border-box;width: 100%;resize: none;height: 100px;margin-top: 15px;"></textarea></div>' +
                        '</div><div class="h-45">\
                        <span class="btn-blue96x32 rt m-r15 save">保存</span>\
                        <span class="btn-gray96x32 m-r10 rt cancel " >取消</span>\
                        </div><div class="clear"></div>'
                })
                $(finish_dilog).on('click','.cancel',function(){
                    finish_dilog.close();
                })
                $(finish_dilog).on('click','.save',function(){

                })*/
            }
            ,see_ev:function(taskID){
                common.ajax.updateTaskStatus({
                    taskID:taskID,
                    action:1
                })
            }
            ,back_ev:function(taskID,cbk){
                var review_dilog= i8ui.confirm({
                    title:'确定要退回吗!'
                },function(){
                    common.ajax.updateTaskStatus({
                        taskID:taskID,
                        action:6
                    },function(data){
                        i8ui.successMask('退回成功！');
                        cbk && cbk();
                    })
                })
            }
            ,review_btn_ev:function(taskID,cbk){
                var review_dielog_tpl=require('../../template/task/review_dielog.tpl');;
                var review_dilog= i8ui.showbox({
                    title:'评审任务',
                    cont:review_dielog_tpl
                })
                $(review_dilog).on('click','.cancel',function(){
                    review_dilog.close();
                })
                $(review_dilog).on('keydown','input',function(ev){
                    if($(this).val() && $(this).val().length>1 && ev.keyCode!=8){
                        return false;
                    }
                })
                var radios=$(review_dilog).find('.app-radio2')
                radios.click(function(){
                    radios.removeClass('checked');
                    $(this).addClass('checked');
                })
                $(review_dilog).on('click','.save',function(){
                    if($(review_dilog).find('.reset-radio').hasClass('checked')){
                        common.page.back_ev(taskID,function(data){
                            //在detail页面调用cbk（刷新页面估计）
                            cbk && cbk();
                            review_dilog.close();
                        });
                        return;
                    }
                    var _score= $.trim($('#score').val());
                    if(!_score){
                        i8ui.error('评分不能为空!')
                        return;
                    }
                    if(isNaN(_score)){
                        i8ui.error('评分格式不正确!,请重新输入!')
                        return;
                    }
                    if(_score>10 || _score<0){
                        i8ui.error('评分只能在1-10之间!')
                        return;
                    }
                    common.ajax.updateTaskStatus({
                        taskID:taskID,
                        action:3,
                        score:_score,
                        note: $.trim($('#review_note').val())
                    },function(data){
                        console.log(data);
                        cbk && cbk();
                        review_dilog.close();
                    })
                })
            }
            ,restart_btn_ev:function(taskID,cbk){
                var review_dilog= i8ui.confirm({
                    title:'确定要重启吗!'
                },function(){
                    common.ajax.updateTaskStatus({
                        taskID:taskID,
                        action:5
                    },function(data){
                        i8ui.successMask('重启成功！');
                        cbk && cbk();
                        review_dilog.close();
                    })
                })
            }
            ,stop_btn_ev:function(taskID,cbk){
                var review_dilog= i8ui.confirm({
                    title:'确定要终止吗!'
                },function(){
                    common.ajax.updateTaskStatus({
                        taskID:taskID,
                        action:4
                    },function(data){
                        i8ui.successMask('终止成功！');
                        cbk && cbk();
                        review_dilog.close();
                    })
                })
            }
            ,getStatusCont:function(Status,Score,OwnerName,ReviewName,ReviewNote){
                ReviewNote=ReviewNote || '无';
                var str="";
                switch (Status){
                    case 1:
                        str='<span class="unfinish-head"><b>待 <span class="blue">负责人（'+OwnerName+'）</span> 查看</span></b>';
                        break;
                    case 2:
                        str='<span class="unfinish-head"><b>待 <span class="blue">负责人（'+OwnerName+'）</span> 完成</span></b>';
                        break;
                    case 6:
                        str='<span class="unfinish-head"><b>待 <span class="blue">负责人（'+OwnerName+'）</span> 完成</span></b>';
                        break;
                    case 7:
                        str='<span class="unfinish-head"><b>待 <span class="blue">负责人（'+OwnerName+'）</span> 完成</span></b>';
                        break;
                    case 3:
                        str='<span class="unfinish-head"><b>待 <span class="blue">评审人（'+ReviewName+'）</span> 评审</span></b>';
                        break;
                    case 4:
                        str='<span class="finish-head">\
                                <i class="icon-finish-score task-icon"></i>\
                                <b>任务得分：</b>\
                                <span class="score">'+Score+'</span> 分！\
                                <b>评审内容：</b>'+ReviewNote+'\
                            </span>';
                        break;
                }
                return str;
            }
            ,getStatusContForList:function(Status,ReviewName,ReviewID){
                var str="";
                switch (Status){
                    case 0:
                        return "已删除"
                        break;
                    case 1:
                        return "待查看"
                        break;
                    case 2:
                        return "待完成"
                        break;
                    case 3:
                        return '待 <a href="users/'+ReviewID+'" class="blue">'+ReviewName+'</a> 评审'
                        break;
                    case 4:
                        return "已关闭"
                        break;
                    case 5:
                        return "已终止"
                        break;
                    case 6:
                        return "被重启"
                        break;
                    case 7:
                        return "被退回"
                        break;
                }
                return str;
            }
            ,getBtns:function(Status,uid,ReviewID,OwnerID,CreaterID){
                var str="";
                switch (Status){
                    case 1:
                        if(uid==OwnerID){
                            str='<span class="btn-yellow-h32" id="stop_btn"><span class="lt m-r5" style="font-size: 20px;font-weight: bold;">×</span>终止</span>' +
                                '<span class="btn-blue96x32" id="finish_btn"><i class="task-icon icon-finish"></i>完成</span>';
                        }
                        break;
                    case 2:
                        if(uid==OwnerID){
                            str='<span class="btn-yellow-h32" id="stop_btn"><span class="lt m-r5" style="font-size: 20px;font-weight: bold;">×</span>终止</span>' +
                                '<span class="btn-blue96x32" id="finish_btn"><i class="task-icon icon-finish"></i>完成</span>';
                            break;
                        }
                        if(uid==CreaterID){
                            str='<span class="btn-yellow-h32" id="stop_btn"><span class="lt m-r5" style="font-size: 20px;font-weight: bold;">×</span>终止</span>'
                            break;
                        }
                        break;
                    case 6:
                        if(uid==OwnerID){
                            str='<span class="btn-yellow-h32" id="stop_btn"><span class="lt m-r5" style="font-size: 20px;font-weight: bold;">×</span>终止</span>' +
                                '<span class="btn-blue96x32" id="finish_btn"><i class="task-icon icon-finish"></i>完成</span>';
                            break;
                        }
                        if(uid==CreaterID){
                            str='<span class="btn-yellow-h32" id="stop_btn"><span class="lt m-r5" style="font-size: 20px;font-weight: bold;">×</span>终止</span>'
                            break;
                        }
                        break;
                    case 7:
                        if(uid==OwnerID){
                            str='<span class="btn-yellow-h32" id="stop_btn"><span class="lt m-r5" style="font-size: 20px;font-weight: bold;">×</span>终止</span>' +
                                '<span class="btn-blue96x32" id="finish_btn"><i class="task-icon icon-finish"></i>完成</span>';
                            break;
                        }
                        if(uid==CreaterID){
                            str='<span class="btn-yellow-h32" id="stop_btn"><span class="lt m-r5" style="font-size: 20px;font-weight: bold;">×</span>终止</span>'
                            break;
                        }
                        break;
                    case 3:
                        if(uid==ReviewID){
                            str='<span class="btn-blue96x32" id="review_btn"><i class="task-icon icon-review"></i>评审</span>';
                        }
                        break;
                    case 4:
                        if(uid==CreaterID){
                            str='<span class="btn-yellow-h32" id="restart_btn"><i class="task-icon icon-restart"></i>重启</span>';
                        }
                        break;
                    case 5:
                        if(uid==CreaterID){
                            str='<span class="btn-yellow-h32" id="restart_btn"><i class="task-icon icon-restart"></i>重启</span>';
                        }
                        break;
                }
                return str;
            }
            ,refreshProcess:function (taskID){
                common.ajax.getSingleTask({taskID:taskID},function(data){
                    common.page.renderProcess(data.ReturnObject,'.process-items');
                })
            }
            ,hasEditBtn:function(Status,uid,CreaterID,ReviewID,OwnerID,JoinerIDs,whichBtn){
                if(Status==4 || Status==5){
                    return "";
                }
                switch (whichBtn){
                    //创建人编辑按钮
                    case 'ownerBtn':
                        if(uid==CreaterID){
                            return '<a class="btn-edit2"></a>'
                        }else{
                            return "";
                        }
                        break;
                    //评审人编辑按钮
                    case 'reviewBtn':
                        if(uid==CreaterID){
                            return '<a class="btn-edit2"></a>'
                        }else{
                            return "";
                        }
                        break;
                    //参与人编辑按钮
                    case 'joinerBtn':
                        //if(uid==CreaterID){
                            return '<a class="btn-edit2"></a>'
                        //}
                        break;
                    //执行时间编辑按钮
                    case 'timerBtn':
                        if(uid==CreaterID || uid==OwnerID){
                            return '<a class="btn-edit2"></a>'
                        }else{
                            return "";
                        }
                        break;
                    //任务描述编辑按钮
                    case 'desBtn':
                        if(!(uid==CreaterID || uid==OwnerID)){
                            return 'no-power'
                        }else{
                            return "";
                        }
                        break;
                    //提醒设置编辑按钮
                    case 'tipBtn':
                        if(!(uid==CreaterID || uid==OwnerID)){
                            return 'no-power'
                        }else{
                            return "";
                        }
                        break;
                    //删除按钮
                    case 'delBtn':
                        if(uid==CreaterID){
                            return '<a class="task-icon task-detail-del rt"></a>'
                        }else{
                            return "";
                        }
                        break;
                }

            }
            ,renderFocusTask:function(IsFavor){
                if(IsFavor){
                    return '<a class="btn-yellow-h36 focus-task isfocus-task rt"><i class="task-icon icon-eye"></i> 关注任务</a>'
                }
            }
            ,renderRpt:render_rpt.renderRpt
            ,renderTime:function(date,formatStr){
                return new Date(date.replace(/\-/g,'/')).format(formatStr)
            }
            ,initLeftNav:function(){
                var $body=$("html,body");
                var _nav= $('.task-cont-l');
                /*$(window).scroll(function(){
                    if($('html').scrollTop() || $('body').scrollTop()>150){
                        _nav.css('position','fixed');
                    }else{
                        _nav.css('position','absolute');
                    }
                })*/
                $('.task-detail-nav').on('click',function(){
                    $body.animate({scrollTop:parseInt($('.task-detail-row').offset().top)-0},100)
                })
                $('.task-check-nav').on('click',function(){
                    $body.animate({scrollTop:parseInt($('.task-check-row').offset().top)-0},100)
                })
                $('.task-attach-nav').on('click',function(){
                    $body.animate({scrollTop:parseInt($('.task-attach-row').offset().top)-0},100)
                })
                $('.task-comment-nav').on('click',function(){
                    $body.animate({scrollTop:parseInt($('.task-comment-row').offset().top)-0},100)
                })
                $('.task-process-nav').on('click',function(){
                    $body.animate({scrollTop:parseInt($('.task-process-row').offset().top)-0},100)
                })
            }
            ,setRed:function(EndTime){
                var nowstr= new Date().getTime();
                var endstr=new Date(EndTime.replace(/\-/g,'/')).getTime();
                return nowstr-endstr>=0 ? 'red' : ''
            }
            ,renderNoResult:function(type){
                var str="";
                str+='<tr><td align="center" colspan="5"><div class="noresult"><div class="no-resulticon noresult-icon"></div>';
                switch (type){
                    case 1:
                        str+='<div class="noresult-title">包含所有待你查看、待你完成、待你评审的任务!</div>'
                        break;
                    case 4:
                        str+='<div class="noresult-title">包含那些你在待办任务中处理过的任务记录</div>'
                        break;
                    case 2:
                        str+='<div class="noresult-title">合理的任务安排，可以让工作变得更井井有条</div>'
                        break;
                    case 3:
                        str+='<div class="noresult-title">包含所有你为参与人的任务</div>'
                        break;
                }
                str+='<div><a class="btn-blue-h32" id="new_task2" onclick="$(\'#new_task\').trigger(\'click\')">立刻新建任务</a></div></div></td></tr>';
                return str;
            }
        }
    }
    modules.exports = common;
});
