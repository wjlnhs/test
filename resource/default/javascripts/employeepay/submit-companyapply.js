define(function (require, exports,modules) {

    var i8ui=require('../../javascripts/common/i8ui');

    var ajax=require('./ajax');
    var apply_page=$('#apply_page');

    var commom=require('./common').common;
    var upImage=commom.upImage; //上传文件初始化
    var util=require('../common/util');
    var applyid=util.getUrlParam('applyid');
    var convertUrlToJson=commom.convertUrlToJson;
    var fileUrl={}
    var applyid='';
    var ispass=false;
    var attachmentlists={

    }
    if(data&&data.Result&&data.ReturnObject){
        if(data.ReturnObject.Model){
            if(data.ReturnObject.Model.ApplyStatus==1||data.ReturnObject.Model.ApplyStatus==2){
                apply_page.hide();
                window.scrollTo(0,0)
                $('.page6-des,.page5-des').toggle();
                $('#applyNo').html(data.ReturnObject.Model.ApplyNo);
                $('#apphref').attr('href','employeepay/process-show/'+data.ReturnObject.Model.ID)
            }
            var model=data.ReturnObject.Model;
            applyid=model.ID;
            attachmentlists={
                BusinessListUrl:convertUrlToJson(model.BusinessListUrl,'BusinessListUrl'),
                EbankInfoFormUrl:convertUrlToJson(model.EbankInfoFormUrl,'EbankInfoFormUrl'),
                PayrollCardFormUrl:convertUrlToJson(model.PayrollCardFormUrl,'PayrollCardFormUrl'),
                EbankApprovalFormUrl:convertUrlToJson(model.EbankApprovalFormUrl,'EbankApprovalFormUrl'),
                SMSApplyFormUrl:convertUrlToJson(model.SMSApplyFormUrl,'SMSApplyFormUrl'),
                BatchSMSUrl:convertUrlToJson(model.BatchSMSUrl,'BatchSMSUrl'),
                BatchCardAuthCodeUrl:convertUrlToJson(model.BatchCardAuthCodeUrl,'BatchCardAuthCodeUrl'),
                SMSAuthCodeUrl:convertUrlToJson(model.SMSAuthCodeUrl,'SMSAuthCodeUrl')
            }
            fileUrl=data.ReturnObject.Model;
        }

        ispass=data.ReturnObject.IsPass;

    }

    var uploads={
        BusinessListUrl:upImage('BusinessListUrl',attachmentlists.BusinessListUrl?[attachmentlists.BusinessListUrl]:[],'jpg,png,pdf,xlsx'),//代发业务清单
        EbankInfoFormUrl:upImage('EbankInfoFormUrl',attachmentlists.EbankInfoFormUrl?[attachmentlists.EbankInfoFormUrl]:[],'jpg,png,pdf,xlsx'),//批量网银信息表
        PayrollCardFormUrl:upImage('PayrollCardFormUrl',attachmentlists.PayrollCardFormUrl?[attachmentlists.PayrollCardFormUrl]:[],'jpg,png,pdf,xlsx'),//批量开卡模版
        EbankApprovalFormUrl:upImage('EbankApprovalFormUrl',attachmentlists.EbankApprovalFormUrl?[attachmentlists.EbankApprovalFormUrl]:[],'jpg,png,pdf,xlsx'),//个人网银集中办理信息登记审批表
        SMSApplyFormUrl:upImage('SMSApplyFormUrl',attachmentlists.SMSApplyFormUrl?[attachmentlists.SMSApplyFormUrl]:[],'jpg,png,pdf,xlsx'),//批量开通短信业务导入文件模版
        BatchSMSUrl:upImage('BatchSMSUrl',attachmentlists.BatchSMSUrl?[attachmentlists.BatchSMSUrl]:[],'jpg,png,pdf,xlsx'),//批量短信通模版
        BatchCardAuthCodeUrl:upImage('BatchCardAuthCodeUrl',attachmentlists.BatchCardAuthCodeUrl?[attachmentlists.BatchCardAuthCodeUrl]:[],'jpg,png,pdf,xlsx'),//批量开卡授权码
        SMSAuthCodeUrl:upImage('SMSAuthCodeUrl',attachmentlists.SMSAuthCodeUrl?[attachmentlists.SMSAuthCodeUrl]:[],'jpg,png,pdf,xlsx')//短信通授权码
    }

    var fun='continuecompanyapply';
    if(applyid){
        fun='updatecompanyapply';

    }else if(ispass){
        fun='addcompanyapply';
    }
    //下一步
    apply_page.on('click','.next',function(){

        getModelAndSave(true,fun,false)
    })

    //暂存
    apply_page.on('click','.savedraft',function(){
        getModelAndSave(false,fun,true);
    })

    var getModelAndSave=function(isValid,fun,isDraft){
        var modelpair=[{
            key:'BusinessListUrl',
            text:'代发业务清单'
        },{
            key:'EbankInfoFormUrl',
            text:'批量网银信息表'
        },{
            key:'PayrollCardFormUrl',
            text:'批量开卡模版'
        },{
            key:'EbankApprovalFormUrl',
            text:'个人网银集中办理信息登记审批表'
        },{
            key:'SMSApplyFormUrl',
            text:'批量开通短信业务导入文件模版'
        },{
            key:'BatchSMSUrl',
            text:'批量短信通模版'
        },{
            key:'BatchCardAuthCodeUrl',
            text:'批量开卡授权码'
        },{
            key:'SMSAuthCodeUrl',
            text:'短信通授权码'
        }];
        //验证下一步是文件是否提交完整方法
        var validateimg=function(model,isValid){
            if(isValid){
                for(var i=0;i<modelpair.length;i++){
                    if(!model[modelpair[i].key]){
                        $('#btn_container'+modelpair[i].key+'Image').find('input').focus();
                        i8ui.simpleAlert('请上传'+modelpair[i].text,$('#up'+modelpair[i].key+'Image'));
                        return false;
                    }
                }
            }
            return true;
        }
        var urls={};
        var attachment=[];
        //添加附件
        for(var i=0;i<modelpair.length;i++){
            var _key=modelpair[i].key;
            urls[_key]=uploads[_key].files||fileUrl[_key];
            if(uploads[_key].files){
                attachment.push(uploads[_key].files)
            }
        }
        //验证文件提交是否完整
        if(!validateimg(urls,isValid)){
            return;
        }
        if(attachment.length>0){
            //上传附件到7牛
            ajax.postData({
                attachment:attachment
            },function(data){
                var retobj=data.ReturnObject;
                var model={};
                //从7牛返回中获取URL地址 拼接model对象
                for(var i=0;i<modelpair.length;i++){
                    var _key=modelpair[i].key;
                    var file=_.find(retobj,function(item){
                        return item.ID==(uploads[_key].files?uploads[_key].files.fileid:'')
                    })
                    model[_key]=file&&file.FilePath?file.FilePath:fileUrl[_key];
                }
                if(validateimg(model,isValid)){
                    submitCompanyApply(model,fun,isDraft);
                }
            },'upqiniu')
        }else{
            if(validateimg(fileUrl,isValid)) {
                submitCompanyApply(fileUrl,fun,isDraft);
            }
        }
    }

    var submitCompanyApply=function(model,fun,isDraft){
        model.IsSubmit=!isDraft;
        fileUrl= $.extend(fileUrl,model);
        ajax.postData({model:model,applyID:applyid},function(data){
            if($.type(data)=='object'&&data.Result){
                i8ui.write('保存成功');
                if(isDraft){
                    window.location.href=i8_session.baseHost+'employeepay/continue';
                }else{
                    apply_page.hide();
                    window.scrollTo(0,0)
                    $('.page6-des,.page5-des').toggle();
                    $('#applyNo').html(data.ReturnObject.Item2);
                    $('.page6-des').find('a').attr('href','employeepay/process-show/'+data.ReturnObject.Item1);
                }
            }else{
                i8ui.error('保存失败，'+(data.Description||'网络异常，请重试！'));
            }
        },fun)
    }




    var init=function(){

    }
    init();
});