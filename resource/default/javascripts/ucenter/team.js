define(function (require, exports) {
    var util=require('../common/util');
    var ajaxHost=i8_session.ajaxHost;
    var uid=util.getLastUrlName();//util.getUrlParam('uid');


    //拼接个人主页url
    var getTeamUrl=function(uid){
        return i8_session.baseHost+'users/'+uid;
    }

    //拼接个人主页url
    template.helper('getTeamUrl',function(uid){
        return getTeamUrl(uid);
    })

    var isMe=uid==i8_session.uid; //判断查看的人是不是本人
    if(isMe){
        $('#isMyTeam,#isMyLeader,#isMyColleagues').html('我');
    }
    var no_resultstr='<div class="no-label-result" ><i class="no-resulticon no-team"></i><div class="no-label-desc "><span class="l-h90">团队小伙伴还木有到位哦~</span></div></div>'
    var getTeam=function(){  //同事组件
        getDirectLeader();//获取我的上级
        getColleagues(); //获取我的团队

    }
    var getColleagues=function(){
        var _colleagues=$('#colleagues').html('<div class="ld-32-write"></div>');
        $.ajax({
            url:ajaxHost+'webajax/ucenter_ajax/getColleagues',
            data:{uid:uid},
            type:'get',
            dataType: 'json',
            success:function(data){
                if($.type(data)=='object'&&data.Result){
                    if(data.Total==0){
                        _colleagues.html(no_resultstr).prev().hide();
                        return;
                    }
                    var tpl=require('../../template/ucenter/colleagues.tpl');
                    var render=template(tpl);
                    data.isMe=isMe;
                    var html=render(data);
                    _colleagues.html(html);

                }else{
                    _colleagues.html(data.Description);
                }
            },error:function(err1){
                _colleagues.html('获取同事信息时请求超时，请检查网络！');
            }
        });
    }

    var getDirectLeader=function(){
        var _direct=$('#directleader .heit');
        $.ajax({
            url:ajaxHost+'webajax/ucenter_ajax/getDirectLeader',
            data:{uid:uid},
            type:'get',
            dataType: 'json',
            success:function(data){
                if(data.Result&&data.ReturnObject&&data.ReturnObject.Item1){
                    _direct.after('<a target="_blank" href='+getTeamUrl(data.ReturnObject.Item1.PassportID)+' class="rt-team-ops lt">\
                        <img class="my-headimg" src="'+data.ReturnObject.Item1.HeadImage+'?imageView2/1/w/60/h/60"/>\
                        '+data.ReturnObject.Item1.Name+'\
                        </a>');
                }else if(data.Result&&!data.ReturnObject){
                    _direct.parent().hide();
                }else{
                    _direct.after('<div>'+data.Description+'</div>');
                }
            },error:function(err1){
                _direct.after('<div>获取上级领导时请求超时，请检查网络</div>');
            }
        });
    }
    getTeam(); //初始化
});