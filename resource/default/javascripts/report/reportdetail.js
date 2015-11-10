define(function (require, exports) {
    var getdatepicker=require('./getdatepicker');
    var commentlist=require('../plugins/i8bloglist/i8comments');
    var common=require('./common');
    var util=require('../common/util');
    var uid=$('#w_name').attr('uid');
    var reportID=util.getLastUrlName();
    var score=require('./score.js');
    var seefile=require('../common/seefile');
    var addweekport=require('./addweekport');
    var i8ui=require('../common/i8ui');
    var exDefUsr=[];


    getdatepicker.setshareDatePicker($('#datepicker'),common.ajax.getMyReportsByMonth,uid);

    //格式化时间
    template.helper('dateformat',function(datetime,format){
        return util.dateformat(datetime,format);
    });

    //标记为已阅
    $(document).on('click','.readit',function(){
        common.fun.readreport($(this),reportID);
    });

    var getAttr=function(attachmentsArr){
        var html=seefile.ks.getHtml(attachmentsArr,null,null);
        seefile.ks.bindImgClick($(document),true);
        return html;
    }

    if(data&&data.Result&&data.ReturnObject){
        var retobj=data.ReturnObject;
        var creator={"uid":retobj.UserID,"uname":"@"+retobj.AuthorName,type:0};
        exDefUsr.push(creator);

        if(data.ReturnObject.RpType==1){

            var _data={}

            _data.ReturnObject=[data.ReturnObject];
            score.renderScore(_data);

            $(document).on('click','.openscore',function(){
                common.fun.openScore(_data.ReturnObject[0],function(data){
                    _data.ReturnObject[0]=data;
                    score.renderScore(_data);
                });
            });
        }
        var reportoption=$('#reportoption');

        //编辑周日报
        reportoption.on('click','.editreport',function(){
            //编辑周日报
            addweekport.openaddweekdaily({type:'edit',reportdata:data.ReturnObject,callback:function(){
                var _btn=$(window.opener.document.getElementById('weeks')).find('.week.current');
                if(_btn&&_btn.length>0){
                    _btn[0].click();
                }else{
                    window.opener.location.reload();
                }
                window.location.reload();
            }});
        });
        //删除周日报
        reportoption.on('click','.deletereport',function(){
            var reportdata=data.ReturnObject;
            if(!reportdata){
                return;
            }
            var rpTypeName=reportdata.RpType=='0'?'日报':'周报';
            i8ui.confirm({
                title:'确认要删除这条'+rpTypeName+'？删除时会将相应的评论也删除！'
            },function(){
                common.ajax.deleteReport(reportdata.ID,function(data){
                    if($.type(data)=='object'){
                        if(data.Result){
                            i8ui.alert({title:'删除成功！',type:2});
                            window.opener.location.reload();
                            window.close();
                        }else{
                            i8ui.alert({title:'删除失败,'+data.Description+'！'});
                        }
                    }else{
                        i8ui.alert({title:'删除失败,删除周日报时请求超时！'});
                    }
                })
            });
        });
        $('#itemdate').html(util.formateDate(data.ReturnObject.LastUpdateTime));
        $('#attrlist').html(getAttr(data.ReturnObject.FileList))
    }

    //评论
    var app_id="568d9564-09e0-40e6-945b-db2bd86854dd";




    //var source_id=$(this).attr("optid");
    var commentData=[];

    var commentContainer=$("#report-comments-container");
    $.get(i8_session.ajaxHost+'webajax/kkcom/get-appscomments',{sourceid:reportID,appid:app_id,r:Math.random().toString()},function(response){
        if(response.Result){
            commentlist({aTag:"#",rKey:"app_report",cmtContainer:commentContainer,datalist:response.ReturnObject,appID:app_id,defAtUsers:exDefUsr,sourceID:reportID,cmtsendType:"appcomment",replyModel:"replykk",lsModel:"detailsls"});
        }else{
            alert('获取评论失败!<br/>'+response.Description);
        }
    },"json");
});