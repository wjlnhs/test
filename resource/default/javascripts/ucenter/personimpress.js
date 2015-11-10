define(function (require, exports) {
    var util=require('../common/util');
    var ajaxHost=i8_session.ajaxHost;
    //var uid=util.getLastUrlName();//util.getUrlParam('uid');
    var userid=util.getLastUrlName();//util.getUrlParam('uid');
    var isMe=userid==i8_session.uid;
    var _he='TA';


    if(isMe){
        $('#isMe').html('我');
        $('#commentInput').hide();
        _he='我'
    }
    var no_resultstr='<div class="no-label-result" ><i class="no-resulticon no-person"></i><div class="no-label-desc"><span class="l-h90">还没有人评价过'+_he+'哦~</span></div></div>'
    var _subimpress=$('#subimpress');
    var inputKeyDown=function(ev){
        if(ev.keyCode==13){
            _subimpress.off('keydown',inputKeyDown);
            savePersonImpress(userid,$(this).val());
        }
    }
    _subimpress.on('keydown',inputKeyDown);//注册发送同事印象事件

    var getTeamUrl=function(uid){
        return i8_session.baseHost+'users/'+uid;
    }

    template.helper('getTeamUrl',function(uid){
        return getTeamUrl(uid);
    })


    //获取同事印象
    var getPersonImpress=function(pageIndex){
        var impress_loading=$('#impress_loading').show();
        var impress_more=$('#impress_more');
        var pageIndex=pageIndex||1;
        var options={
            pageIndex:pageIndex,
            pageSize:3,
            passportID:userid
        }
        $.ajax({
            url:ajaxHost+'webajax/ucenter_ajax/getPersonImpress',
            data:{options:options},
            type:'get',
            dataType: 'json',
            success:function(data){
                if(data.Result&&data.ReturnObject){
                    if(data.ReturnObject.totalCount==0){
                        impress_loading.prevAll('li,div').remove();
                        impress_loading.before(no_resultstr).hide();
                        impress_more.hide();
                        return;
                    }
                    var pagetotal=Math.ceil(data.ReturnObject.totalCount/options.pageSize)||1;

                    if(pagetotal==pageIndex){
                        impress_more.hide();
                    }else{
                        impress_more.show().one('click',function(){
                            getPersonImpress(pageIndex+1);
                        })
                    }
                    var tpl=require('../../template/ucenter/personimpress.tpl');
                    var render=template(tpl);
                    var html=render(data);
                    impress_loading.before(html).hide();
                }else{

                }

            },error:function(err1){

            }
        });
    }

    //保存同事印象
    var savePersonImpress=function(userid,impress){
        if(isMe){
            i8ui.alert({title:'不能给自己添加同事印象！'});
            return;
        }
        if(!impress){
            return;
        }
        $.ajax({
            url:ajaxHost+'webajax/ucenter_ajax/savePersonImpress',
            data:{options:{userid:userid,impress:impress}},
            type:'get',
            dataType: 'json',
            success:function(data){
                if(data.Result&&data.ReturnObject){
                    $('#impress_loading').prevAll('li,div').remove();
                    getPersonImpress(1);
                }else{
                }
                _subimpress.val('').on('keydown',inputKeyDown);
            },error:function(err1){
                _subimpress.val('').on('keydown',inputKeyDown);
            }
        });
    }


    getPersonImpress();
});