define(function (require, exports,modules) {
    var common=require('./common');
    var util=require('../common/util');
    var addcalendar=require('./addcalendar');
    var detailtpl=require('../../template/calendar/detail.tpl');//列表template
    var detailrender= template(detailtpl);
    var scheduleID=util.getLastUrlName();
    var calendardetail=$('#calendardetail');
    var _data=calendardetail.data();
    var seefile=require('../common/seefile');
    var i8ui=require('../../javascripts/common/i8ui');
    var fileuploader = require('../plugins/qiniu_uploader/qiniu_i8uploader.js');
    var crclebox=require('./crclebox');
    var uploader;
    var attList;
    var up=function(){
        //文件上传按钮

        var options = {'button':'uploaderbtnDetail',//按钮ID
            'fileContainerId':'uploaderDetail',//装文件容器
            'btnContainerId':'btn_containerDetail',//按钮ID容器
            'tokenUrl':'/platform/uptoken',
            'flashUrl':'/default/javascripts/plugins/qiniu_uploader/plupload/Moxie.swf',
            'allFileUploaded':function(up, file, info){
                var file=uploader.getUploadFiles();
                uploader.uploaderReset();
                common.ajax.toqinniu(file,function(data){
                    if($.type(data)=='object'&&data.Result){
                        var fileids=[]
                        var retobj=data.ReturnObject;
                        for(var i=0;i<retobj.length;i++){
                            fileids.push(retobj[i].ID);
                        }
                        common.ajax.addFiles({
                            scheduleID:scheduleID,
                            fileIDs:fileids
                        },function(data){
                            if($.type(data)=='object'&&data.Result){
                                i8ui.write('上传成功！');
                                attList.html(getAtt(data.ReturnObject.fileList));
                            }else{
                                i8ui.error(data.Description||'请求超时！');
                            }
                        })
                    }else{
                        i8ui.alert({title:'文件存储失败！'});
                    }
                })
            }
        };

        return fileuploader.i8uploader(options);
    }

    var ownerids=util.getUrlParam('ownerids');
    var iseidt=util.getUrlParam('iseidt')==1?true:false;
    //格式化附件列表
    template.helper('getAtt',function(attachmentsArr){
        return getAtt(attachmentsArr);
    });

    var getAtt=function(attachmentsArr){
        for(var i=0;i<attachmentsArr.length;i++){
            if(attachmentsArr[i].CreaterID==i8_session.uid){
                attachmentsArr[i].showDel=true;
            }
        }
        var html=seefile.ks.getHtml(attachmentsArr,true,null,true);
        return html;
    }

    seefile.ks.bindImgClick($(document),function(id){
        common.ajax.deleteFiles({
            scheduleID:scheduleID,
            fileIDs:[id]
        },function(data){
            if($.type(data)=='object'&&data.Result){
                i8ui.write('删除成功！');
                attList.html(getAtt(data.ReturnObject.fileList));
            }else{
                i8ui.error(data.Description||'请求超时！');
            }
        })
    });

    //获取选中参加人
    template.helper('getOwner',function(joinIDs,joinNames,JoinHeadImages){
        return getOwner(joinIDs,joinNames,JoinHeadImages)
    });

    var getOwner=function(joinIDs,joinNames,JoinHeadImages){
        var owner={
            name:[],
            img:[]
        }
        if(!ownerids){
            owner.name.push(i8_session.uname);
            owner.img.push(i8_session.uimage30);
        }else{
            var _ownerarr=ownerids.split(';');
            for(var i=0;i<_ownerarr.length;i++){
                for(var j=0;j<joinIDs.length;j++){
                    if(_ownerarr[i]==joinIDs[j]){
                        owner.name.push(joinNames[j]);
                        owner.img.push(JoinHeadImages[j]);
                    }
                }
            }
        }
        return owner;
    }

    template.helper('dateformat',function(date,format){
        return util.dateformat(date,format);
    })
    template.helper('getWeekName',function(cycleValues){
        var weeks=['一','二','三','四','五','六','日'  ];
        var _cyclevalues=cycleValues.split(',');
        return $.map(_cyclevalues,function(i,item){
            return '周'+weeks[i-1];
        });
    })

    var getDetailByID=function(scheduleID){
        calendardetail.html(detailrender({loading:true}));
        common.ajax.getScheduleById(scheduleID,function(data){
            if($.type(data)=='object'&&data.Result){
                var exDefUsr=[];
                var retobj=data.ReturnObject;
                for(var i=0;i<retobj.JoinIDs.length;i++){
                    var person={"uid":retobj.JoinIDs[i],"uname":"@"+retobj.JoinNames[i],type:0};
                    exDefUsr.push(person);
                }
                initComments(exDefUsr);
                if(data.ReturnObject.CreaterID==i8_session.uid){
                    $('#calendaroption').show();
                }
                data.ReturnObject.resHost=i8_session.resHost;
                calendardetail.html(detailrender(data.ReturnObject));
                calendardetail.data(data.ReturnObject);
                var typename=data.ReturnObject.Type==1?'日程':'会议';
                //$('.detailtitle').html(data.ReturnObject.Title+(data.ReturnObject.Type==1?' 日程详情':' 会议详情'));

                $('.detailtitle').html('<div>'+data.ReturnObject.Title+'</div><div class="subtitle"><a>'+getOwner(data.ReturnObject.JoinIDs,data.ReturnObject.JoinNames,data.ReturnObject.JoinHeadImages).name+'</a> 的'+typename+'</div>')
                document.title=typename+'详情';
                var joinIds=data.ReturnObject.JoinIDs.join(',');
                if(joinIds.search(i8_session.uid)>=0){
                    $('#attFile').show();
                    uploader=up();
                }
                attList=$('#attList');
                if(iseidt){
                    $('.editcalendar').trigger('click');
                }
            }else{
                calendardetail.html(detailrender({error:data.Description||'请求超时！'}));
            }
        })

    }

    $(document).on('click','.editcalendar',function(){
        addcalendar.openWindow({
                'title':'编辑日程/会议',
                isedit:true,
                data:calendardetail.data()
            },function(Type,data){
            //window.opener.location.reload();
            $(window.opener.document).find('#refreshBtn')[0].click();
            if(data&&data.ReturnObject){
                window.location.href=i8_session.baseHost+'calendar/detail/'+data.ReturnObject+'?ownerids='+ownerids;
            }else{
                getDetailByID(_data.ID);
            }

        });
    })

    $(document).on('click','.deletecalendar',function(){
        common._option.deleteSchedule(_data,function(){
            $(window.opener.document).find('#refreshBtn')[0].click();
            $('#closeWindow').trigger('click');
            //window.opener.location.reload();
            //getDetailByID(_data.ID);
        });
    })
    getDetailByID(scheduleID);

    var initComments=function(exDefUsr){
        //日程评论
        var schedule_id=scheduleID;
        var app_schedule_id='92af1586-4fc4-4f79-a908-269a6c904fc5';
        var commentlist=require('../plugins/i8bloglist/i8comments');
        var commentContainer=$("#schedule-details");
        //var taskData=data.ReturnObject.task;
        //var creator={"uid":CreaterID,"uname":"@"+CreaterName,type:0};//创建人
        //exDefUsr.push(creator);
        $.get(i8_session.ajaxHost+'webajax/kkcom/get-appscomments',{sourceid:schedule_id,appid:app_schedule_id,r:Math.random().toString()},function(response){
            if(response.Result){
                commentlist({aTag:"#",rKey:"app_schedule",cmtContainer:commentContainer,datalist:response.ReturnObject,appID:app_schedule_id,sourceID:schedule_id,defAtUsers:exDefUsr,cmtsendType:"appcomment",replyModel:"replykk",lsModel:"detailsls"});
            }else{
                alert('获取评论失败!<br/>'+response.Description);
            }
        },"json");
    }


});