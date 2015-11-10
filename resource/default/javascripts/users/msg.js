/**
 * Created by jialin on 2015/1/16.
 */
define(function (require, exports) {
    var i8ui = require('../common/i8ui');
    var fw_page=require('../common/fw_pagination.js');
    var pageSize=10;
    var pageIndex=1;
    template.helper('$dateFormat',function(date,formatStr){
        date=date.replace(/\-/g,'/')
        return new Date(date).format(formatStr,true);
    })
    var app_dictionary={}//名称和appID对应的json;
    function GetMyNotices(pageIndex){
        $('#msg_cont').css('text-align','center').html('<div class="ld-64-gray" style="width:64px;height: 64px;"></div>')
        $.post(i8_session.ajaxHost+"webajax/settings/GetMyNoticesForApp?" + Math.random(),{pageIndex:pageIndex,pageSize:pageSize},function(data){
            console.log(data)
            if(data.Result && data.List.length>0){
                if($.isEmptyObject(app_dictionary)){
                    $.post(i8_session.ajaxHost+'webajax/modules/getmutippsvalue',{keys:decodeURIComponent(i8_session.apps)},function(response){
                        console.log(response)
                        if(!response.Code && response.ReturnObject){
                            for(var i=0;i<response.ReturnObject.length;i++){
                                if(response.ReturnObject[i].Key=='app_schedule'){
                                    app_dictionary[response.ReturnObject[i].ID]='calendar#myset'
                                }
                                if(response.ReturnObject[i].Key=='app_task'){
                                    app_dictionary[response.ReturnObject[i].ID]='task#isset=1&'
                                }
                                if(response.ReturnObject[i].Key=='app_report'){
                                    app_dictionary[response.ReturnObject[i].ID]='report#reportset'
                                }
                            }
                        }
                        renderNotices(data)
                    })
                }else{
                    renderNotices(data)
                }
            }else{
                var noMsgHtml='<ul class="blogs-list-items">\
                    <li style="display: list-item;"><div class="noresult">\
                    <div class=" noresult-icon"></div>\
                    <div class="noresult-title">暂无系统消息~</div>\
                </div>\
                </ul>'
                $('#msg_cont').html(noMsgHtml).css('text-align','center');
                //i8ui.error(data.Code)
            }
        })
    }

    $('#msg_cont').on('click','.del',function(){
        var $this=$(this);
        i8ui.confirm({title: '确定删除本条系统消息吗',btnDom: $this}, function () {
            var _id=$this.attr('delid');
            $.post(i8_session.ajaxHost+"webajax/settings/DeleteMyNotices?" + Math.random(),{ids: [_id]},function(data){
                if(data.Result){
                    i8ui.simpleWrite('删除成功！',$this)
                    $this.parents('.talk-item').eq(0).remove();
                }else{
                    i8ui.error(data.Message)
                }
            })
        })
    });
    function renderNotices(data){
        template.helper('$setCont',function(ActionType,Content){
            var resultContent='';
            switch(parseInt(ActionType)){
                case 0:
                    resultContent= Content;
                    break;
                case 1:
                    var group=Content.split('$%$')[1];
                    var groupId=group.split(',')[1];//群组id;
                    var groupName=group.split(',')[0];//群组名字;
                    resultContent= Content.split('$%$')[0]+'<a href="/group/home?id='+groupId+'">'+groupName+'</a>'+Content.split('$%$')[2];
                    break;
                case 4:
                    var _linkUrl=app_dictionary[Content.split('$#$')[1]];
                    resultContent= Content.split('$#$')[0]+'<a href="'+_linkUrl+'">立即查看</a>';
                    break;
            }
           return resultContent;
        })
        var sysmsg=require('./settings/userInfo/template/sys-msg.tpl');
        var render = template(sysmsg);
        var _html = render({List: data.List});
        $('#msg_cont').css('text-align','left').html(_html)
        fw_page.pagination({
            ctr: $("#msg_cont_panl"),
            totalPageCount: data.Total,
            pageSize: 10,
            current: pageIndex,
            fun: function (new_current_page,containers) {
                pageIndex=new_current_page;
                GetMyNotices(new_current_page);
            }, jump: {
                text: '跳转'
            }
        });
    }
    GetMyNotices();

})