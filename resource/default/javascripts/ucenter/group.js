define(function (require, exports) {
    var util=require('../common/util');
    var ajaxHost=i8_session.ajaxHost;
    var uid=util.getLastUrlName();//util.getUrlParam('uid');
    var fw_page=require('../common/fw_pagination');

    template.helper('getGroupUrl',function(goupid){
        return i8_session.baseHost+'group/home'+'?id='+goupid;
    });
    var isSelf=uid==i8_session.uid;//判断查看的人是不是本人
    var _nogroup='<div class="noresult">\
                    <div class=" noresult-icon"></div>\
                    <div class="noresult-title">还没有加入任何群组哦~</div>\
                    <div ><a href="'+i8_session.baseHost+'group/list" target="_blank" class="btn-blue-h32">马上加入群组</a></div>\
                </div>';
    if(!isSelf){
        _nogroup='<div class="noresult">\
                    <div class=" noresult-icon"></div>\
                    <div class="noresult-title">还没有加入任何群组哦~</div>\
                </div>';
    }

    //获取他参加的群组信息
    var GetAllMyGroups=function(pageIndex,list){
        var _ul=list.find('ul');
        var _num=list.find('.groupnum');
        _ul.html('<li><div class="ld-64-gray"></div></li>')
        $.ajax({
            url:ajaxHost+'webajax/ucenter_ajax/GetAllMyGroups',
            data:{uid:uid,pageIndex:pageIndex},
            type:'get',
            dataType: 'json',
            success:function(data){
                if($.type(data)=='object'&&data.Result){
                    if(data.Total==0){
                        _ul.html(_nogroup);
                        _num.html(0);
                        return;
                    }
                    var tpl=require('../../template/ucenter/group.tpl');
                    var render=template(tpl);
                    var html=render(data);
                    _ul.html(html);
                    _num.html(data.Total);
                }else{
                    _ul.html(data.Description);
                }
                //分页控件绑定
                fw_page.pagination({
                    ctr: list.find('.pagination'),
                    totalPageCount: data.Total,
                    pageSize: 10,
                    current: pageIndex,
                    fun: function (new_current_page, containers) {
                        GetAllMyGroups(new_current_page,list);
                    }, jump: {
                        text: '跳转'
                    }
                });
            },error:function(err1){
                _ul.html('<li class="tcenter">获取他的群组信息时请求超时，请检查网络！</li>');
            }
        });
    }
    exports.GetAllMyGroups=GetAllMyGroups;
});