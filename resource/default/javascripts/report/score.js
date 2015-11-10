define(function (require, exports) {
    var score_tpl=require('../../template/report/score.tpl');
    var score_render=template(score_tpl);
    var score=$('#score').find('.score_content');
    var i8ui=require('../common/i8ui');
    //公用ajax方法
    var common =require('./common');
    exports.getScore=function(beginTime,endTime,fun){
        score.html(score_render({loading:true}));
        fun({startDay:beginTime,
            endDay:endTime,
            rpType:1
        },function(data){
            if($.type(data)=='object'){
                if(data.Result){
                    data.uid=i8_session.uid;
                    data.begintime=beginTime;
                    data.endtime=endTime;
                    score.html(score_render(data));
                }else{

                }
            }
        });
    }
    exports.renderScore=function(data){
        data.uid=i8_session.uid;
        if(data.ReturnObject&&data.ReturnObject[0]){
            data.openscore=data.ReturnObject[0].CanEvaluate?'openscore':'';
        }
        score.html(score_render(data));
    }

    //格式化时间
    template.helper('getScore',function(startTime,endTime){
        var _startTime=new Date(startTime);
        var _endTime=new Date(endTime);
        if(_startTime=='Invalid Date'||isNaN(_startTime)){
            _startTime= new Date(startTime.replace(/-/g,'/'));
        }
        if(_endTime=='Invalid Date'||isNaN(_endTime)){
            _endTime= new Date(endTime.replace(/-/g,'/'));
        }
        return _startTime.getFullYear()+'年'+(_startTime.getMonth()+1)+'月'+_startTime.getDate()+'日-'+_endTime.getFullYear()+'年'+(_endTime.getMonth()+1)+'月'+_endTime.getDate()+'日';
    });

    $(document).on('click','.invent-btn',function(){
        var _this=$(this);
        var options={
            isToLeader:true,
            title:'请尽快给我的[url="'+i8_session.baseHost+'report/detail/'+_this.attr('rid')+'";txt="'+_this.attr('date-time')+'";target="_blank"]的周报进行评分，谢谢！'
        }

        common.ajax.addCreateReportTips(options,function(data){
            if($.type(data)=='object'){
                if(data.Result){
                    i8ui.write('邀请成功！');
                    _this.html('已邀请').attr('class','weekdailypng-bg already');
                }
                else{
                    i8ui.error('邀请失败，'+data.Description);
                }
            }else{
                i8ui.error('邀请失败，邀请时请求超时！');
            }
        });
    })
});