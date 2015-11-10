define(function(require){
    var i8ui = require('../common/i8ui');
    var fw = require('../cement/public.js');
    var seefile = require('../common/seefile.js');
    var urlId = fw.getUrlParam("id");
    var cementObj = null;
    if( urlId != ""){
        editLoad(urlId);
    }else{
        i8ui.error("参数错误,3秒后自动跳转到列表页！");
        setTimeout(function(){
            window.location.href= '/cement/list';
        },3000);
    }
    function editLoad(id){
        $.ajax({
            url: i8_session.ajaxHost+'webajax/cement/get-cementid',
            type: 'get',
            dataType: 'json',
            cache: false,
            data: {announcementID: id},
            success: function(result){
                if(result.Result){
                    var _item = result.ReturnObject;
                    var domeHt = $("#js_cement_list_li").html();
                    var tbhtml = domeHt.replace("{typename}",_item.CategoryName)
                                    .replace("{title}", _item.Title)
                                    .replace("{id}", _item.ID)
                                    .replace("{content}", _item.Content)
                                    .replace("{CreateTime}",_item.SendTime)
                                    .replace("{delete}",getDeleteA(_item.ID))
                                    .replace("{files}",seefile.ks.getCementHtml(_item.FlieList ? _item.FlieList:[],false,true));
                    if(tbhtml == ""){
                        tbhtml = '暂无数据';
                    }
                    $("#js_cement_head_ct").html('<span class="app-placard-icon lt m-r15"></span><p class="b fz18 m-t10 heit">'+ _item.CategoryName +'</p>');
                    $("#js_cement_detial").html(tbhtml);
                    seefile.ks.bindImgClick($("#js_cement_list_ol"),true);
                }else{
                    i8ui.error(result.Message);
                }
            },
            error: function(e1,e2,e3){
                i8ui.error("读取失败！");
            }
        });
    }
    function getDeleteA(id){
        return '<a del-id="'+ id +'" class="m-r10 del-color">删除</a>|';
    }
    //删除公告
    function deleCement(id){
        $.ajax({
            url: i8_session.ajaxHost+'webajax/cement/del-cement',
            type: 'get',
            dataType: 'json',
            data: {announcementID: id},
            cache: false,
            success: function(result){
                if(result.Result){
                    i8ui.write('删除成功！');
                    getMgList();
                }else{
                    i8ui.error(result.Description);
                }
            },
            error: function(e1,e2,e3){
                i8ui.error("获取分类列表失败");
            }
        });
    }
    //删除
    $("#js_cement_detial").on("click","a.del-color",function(){
        var id = $(this).attr("del-id")
        i8ui.confirm({title:"确定要删除吗？"},function(){
            deleCement(id);
        });
    });
});