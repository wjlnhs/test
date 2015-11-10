define(function (require, exports, modules) {
    var i8uploader = require('../plugins/i8uploader/fw_i8uploader.js');
    var i8ui = require('../common/i8ui');
    var common = require('./common.js');
    var selector = require('../plugins/i8selector/fw_selector.js');
    var i8reg = require('../common/i8reg');
    var fw_page=require('../common/fw_pagination.js');
    var i8hash=require('../common/i8hash.js');
    var myset=require('../setrelation/set');
    var setrelation=require('../setrelation/setrelation');
    var newtask = require('./newtask');

    var pageSize=10,
        pageType= parseInt(i8hash.getHashJson('pageType')) || 1,
        pageIndex= 1,
        field={type:0},
        statusType= null,
        orderType= 0,
        search_createrIDs=[],
        search_ownerIDs=[],
        search_beginTime="",
        search_endTime="",
        search_name="",
        targetUserID=i8_session.uid;
    var uploader;//附件对象
    sel_obj={};//选人控件集合
    //时间选择器
    $(document).on('blur','.time-input',function(){
        if($(this).val()){
            $(this).addClass('active')
        }else{
            $(this).removeClass('active')
        }
    })
    //下拉框初始化
    $('#task_status').setSelect({
        style:"line-height: 26px; background: #fff;width:80px;float:left;margin-right:10px;"
    })
    $('#task_status').setValue(0);
    $('#task_status').find('em').each(function(index,item){
       // if(index==0){
            //$(this).attr('status',0);
        //}
        //if(index!=0){
            $(this).attr('status',index).attr('class','status'+index)
        //}
    })
    $('#task_order').setSelect({
        style:"line-height: 26px; background: #fff;width:80px;float:left;margin-right:10px;"
    })
    $('#task_order').setValue(0);
    $('#task_order').find('em').each(function(index,item){
        $(this).attr('order',index)
    })
    //选择同事渲染
    $('.select-people-line').find('span').eq(0).attr('uid',targetUserID);
    setrelation.getShareMeUsers({'appname':'App_Task','noReportRelation':false},function(data){
        console.log(data)
        if(!data.Result){
            $('.select-people-line').append(data.Description);
            return;
        }
        if(data.ReturnObject && data.ReturnObject.length){
            var $data=data.ReturnObject;
            var str='';
            for(var i=0;i<$data.length;i++){
                str+='<span uid="'+$data[i].PassportID+'">'+$data[i].Name+'</span>'
            }
            $('.select-people-line').append(str);
        }
        i8ui.expendUI($('.select-people-line-box'),{height:100,max_height:100,bottom:42})
    })
    //绑定同事tip
    $('.threeline-icon').click(function(){
        var $this=$('.select-people-line .active');
        var _targetUserID=$this.attr('uid');
        var _name=$this.text();
        common.page.renderRpt(_targetUserID,_name,$this);
    })
    //绑定同事事件
    $('.select-people-line').on('click','span',function(){
        if($(this).hasClass('active')){
            return;
        }
        $('.select-people-line .active').removeClass('active');
        $(this).addClass('active')
        targetUserID=$(this).attr('uid');
        refresh_status();
    })

    //任务状态筛选
    $('#task_status').on('click','em',function(){

    })
    //任务排序
    $('#task_order').on('click','em',function(){

    })
    if(i8hash.getHashJson('isset')){
        updatetips('f22d4361-2a0a-4e79-8725-238c4cbb44d4');
        $('#todo_box').hide();
        $('#share_box').show();
        $('#nav_share').addClass('active');
        pageIndex=4;
    }else{
        //导航初始化
        switch (parseInt(pageType)){
            case 1:
                $('.select-people-line-box').show();
                $('#nav_todo').addClass('active');
                $('#task_status').removeClass('style3').addClass('style2');
                //加载tip
                break;
            case 2:
                $('#nav_initiated').addClass('active');
                $('#task_status').removeClass('style3').removeClass('style2');
                break;
            case 3:
                $('#nav_participate').addClass('active');
                $('#task_status').removeClass('style3').removeClass('style2');
                break;
            case 4:
                $('#nav_finished').addClass('active');
                $('#task_status').removeClass('style2').addClass('style3');
                break;
        }
        renderList({'targetUserID':i8_session.uid,pageSize:pageSize,pageIndex:pageIndex,type:pageType,field:field})
    }
    function refresh_status(){
        $('#todo_box').show();
        $('#share_box').hide();
        pageIndex=1;
        statusType=null;
        orderType=0;
        $('#task_status').setValue(0);
        $('#task_order').setValue(0);
        common.tool.updatePageHash(pageSize,pageIndex,pageType);
        renderList({'targetUserID':targetUserID,pageSize:pageSize,pageIndex:pageIndex,type:pageType,field:{
            status:statusType || null,
            order:orderType
        }});
    }
    //myset
    $('#nav_share').on('click',function(){
        updatetips('f22d4361-2a0a-4e79-8725-238c4cbb44d4');
        $('#todo_box').hide();
        $('#share_box').show();
        i8hash.setHashJson({
            isset:1
        })
        $('.nav-item').removeClass('active');
        $(this).addClass('active');
        return false;
    })
    //绑定myset事件
    myset.setRelation('App_Task','任务');
    //待办按钮事件
    $('#nav_todo').on('click',function(){
        //if(pageType!=1){
            $('.select-people-line span').removeClass('active');
            $('.select-people-line span').eq(0).addClass('active');
            pageType=1;
            targetUserID=i8_session.uid;
            $('.select-people-line-box').show();
            refresh_status();
            $('.nav-item').removeClass('active');
            $(this).addClass('active');
            $('#task_status').removeClass('style3').addClass('style2').find('.i8-sel-options').hide();
        //}
        return false;
    })
    //发起按钮事件
    $('#nav_initiated').on('click',function(){
        //if(pageType!=2){
            pageType=2;
            targetUserID=i8_session.uid;
            $('.select-people-line-box').hide();
            refresh_status();
            $('.nav-item').removeClass('active');
            $(this).addClass('active');
            $('#task_status').removeClass('style3').removeClass('style2').find('.i8-sel-options').hide();
        //}
        return false;
    })
    //参与按钮事件
    $('#nav_participate').on('click',function(){
        //if(pageType!=3){
            pageType=3;
            targetUserID=i8_session.uid;
            $('.select-people-line-box').hide();
            refresh_status();
            $('.nav-item').removeClass('active');
            $(this).addClass('active');
            $('#task_status').removeClass('style3').removeClass('style2').find('.i8-sel-options').hide();
        //}
        return false;
    })
    //完成按钮事件
    $('#nav_finished').on('click',function(){
        pageType=4;
        targetUserID=i8_session.uid;
        $('.select-people-line-box').hide();
        refresh_status();
        $('.nav-item').removeClass('active');
        $(this).addClass('active');
        $('#task_status').removeClass('style2').addClass('style3').find('.i8-sel-options').hide();
        return false;
    })
    //状态按钮事件
    $('#task_status').find('[status]').on('click',function(){
        pageIndex=1;
        statusType=parseInt($(this).attr('status'));
        renderList({'targetUserID':targetUserID,pageSize:pageSize,pageIndex:pageIndex,type:pageType,field:{
            status:statusType || null,
            order:orderType
        }});
    })
    //排序按钮事件
    $('#task_order').find('[order]').on('click',function(){
        pageIndex=1;
        orderType=parseInt($(this).attr('order'));
        renderList({'targetUserID':targetUserID,pageSize:pageSize,pageIndex:pageIndex,type:pageType,field:{
            status:statusType || null,
            order:orderType
        }});
    })

    //搜索按钮
    $('#search_btn').on('click',function(){
        pageIndex=1;
        $('#task_status').setValue(0);
        $('#task_order').setValue(0);
        statusType=null;
        orderType=0;
        search_name=$('#search_name').val();
        search_createrIDs=sel_obj.search_launch_user.getAllselectedData()[0] ? [sel_obj.search_launch_user.getAllselectedData()[0].id] : [];
        search_ownerIDs=sel_obj.search_leader_user.getAllselectedData()[0] ? [sel_obj.search_leader_user.getAllselectedData()[0].id] : [];
        search_beginTime=$('#search_StartTime').val() || "";
        search_endTime=$('#search_EndTime').val() || "";
        renderList({'targetUserID':search_createrIDs[0] || search_ownerIDs[0] || i8_session.uid,pageSize:pageSize,pageIndex:pageIndex,type:pageType,field:{
            status:statusType || null,
            order:orderType,
            name:search_name,
            createrIDs:search_createrIDs,
            ownerIDs:search_ownerIDs,
            beginTime:search_beginTime,
            endTime:search_endTime
        }});
    })
    //导出excel

    $('#export_excel').on('click',function(){
        var export_dielog_tpl=require('../../template/task/export_task.tpl');
        var export_dielog=i8ui.showbox({
            title:'导出任务数据',
            cont:export_dielog_tpl
        })
        $(export_dielog).find('#export_start').val(new Date().format('yyyy-MM-dd')).blur(function(){
            common.page.setExcelUrl()
        }).setTime({
            dateFmt:"yyyy-MM-dd",
            maxDate:"#F{$dp.$D('export_end');}"
        })
        $(export_dielog).find('#export_end').val(new Date().format('yyyy-MM-dd')).blur(function(){
            common.page.setExcelUrl()
        }).setTime({
            dateFmt:"yyyy-MM-dd",
            minDate:"#F{$dp.$D('export_start');}"
        })

        $(export_dielog).find('#export_end').trigger('blur')
        $(export_dielog).on('click','.app-radio2',function(){
            $('.app-radio2').removeClass('checked');
            $(this).addClass('checked');
            common.page.setExcelUrl()
        })
        $(export_dielog).on('click','.cancel',function(){
            export_dielog.close();
        })
        $('#doexport').on('click',function(){
            export_dielog.close();
        })
    })
    //checkbox事件
    $(document).on('click','.app-checkbox',function(){
        $(this).toggleClass('checked');
        if($(this).parents('#review_name').length){
            $('#review_name').toggleClass('active');
        }
    })
    //新建任务
    $('#new_task').on('click',function(){
        var new_task_tpl=require('../../template/task/new_task.tpl');
        var new_task=i8ui.showbox({
            'title':'新建任务',
            'cont':new_task_tpl,
            'success':function(){

            }
        })
        newtask.newtask();
        newtask.bindSave(new_task,true)
        //取消按钮
        $(new_task).on('click','#cancel_task',function(){
            new_task.close();
        })

    })

    //搜索任务
    //$('#search_StartTime').val(new Date().format('yyyy-MM-dd'));
    //$('#search_EndTime').val(new Date().format('yyyy-MM-dd'));
    $('#show_search').on('click',function(){
        $('.app_task_search_span').show();
        return false;
    })
    $(document).on('click',function(){
        $('.app_task_search_span').hide();
    })
    /**/

    sel_obj.search_launch_user = selector.KSNSelector({
        model:1,
        width: 336,
        element: '#search_launch_user',
        searchType: { "org": false, "user": true, "grp": false },
        selectCallback: function (uid, uname, uemail,utype,obj) {
        }
    });
    sel_obj.search_leader_user = selector.KSNSelector({
        model:1,
        width: 336,
        element: '#search_leader_user',
        searchType: { "org": false, "user": true, "grp": false },
        selectCallback: function (uid, uname, uemail,utype,obj) {
        }
    });
    $(document).on('click','.fw_agtlist',function(){
        return false;
    })
    function renderList(options){
        var $thead=options.head || $('#todo_box .app-table-list thead');
        var $tbody=options.box || $('#todo_box .app-table-list tbody');
        $tbody.html('<tr><td align="center" colspan="5"><div class="ld-64-write" style="width:64px;height: 64px;"></div></td></tr>')
        if(pageType==4){
            $thead.replaceWith('<thead><tr><td class="w-365">任务名称</td><td>负责人</td><td>任务状态</td><td>截止日期</td></tr></thead>')
        }else{
            $thead.replaceWith('<thead><tr><td class="w-365">任务名称</td><td>状态</td><td>发起人</td><td>最近修改时间</td><td>截止日期</td></tr></thead>')
        }
        common.ajax.getUserTask(options,function(data){
            rendView(options,data);
        })
    }
    function rendView(options,data){
        console.log(data)
        var $thead=options.head || $('#todo_box .app-table-list thead');
        var $tbody=options.box || $('#todo_box .app-table-list tbody');
        //<div style="width:200px;text-align: center">附件更新中请稍等...</div>

        if(data.Total==0){
            $tbody.html(common.page.renderNoResult(pageType))
            $("#js_cement_page_panl").html("");
            common.tool.updatePageHash(pageSize,pageIndex,pageType);
            return;
        }
        template.helper('getStatus',common.tool.getStatus)
        template.helper('$setRed',common.page.setRed);
        template.helper('$getStatusContForList',common.page.getStatusContForList);
        if(pageType==4){
            var task_list_tpl=require('../../template/task/task_list_finish.tpl');
        }else{
            var task_list_tpl=require('../../template/task/task_list.tpl');
        }
        var task_list_render=template(task_list_tpl);
        var task_list_html=task_list_render(data);
        $tbody.html(task_list_html);
        common.tool.updatePageHash(pageSize,pageIndex,pageType);
        var items=$tbody.find('tr');
        $(data.ReturnObject).each(function(index,item){
            items.eq(index)[0].dat=item;
        })
        //控制分页
        if(data.Total<=10){
            $("#js_cement_page_panl").html("");
        }
        fw_page.pagination({
            ctr: $("#js_cement_page_panl"),
            totalPageCount: data.Total,
            pageSize: pageSize,
            current: pageIndex,
            fun: function (new_current_page,containers) {
                pageIndex=new_current_page;
                renderList({'targetUserID':targetUserID,pageSize:pageSize,pageIndex:pageIndex,type:pageType,field:{
                    status:statusType || null,
                    order:orderType
                }})
                //SearchPerson(keyword,new_current_page,orgID,isOnlyContract);
            }, jump: {
                text: '跳转'
            }
        });
    }


    //modules.exports = common;
});
