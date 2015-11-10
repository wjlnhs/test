define(function(require,exports,mouldes){


    var commom=require('./common').common;
    var upImage=commom.upImage; //上传文件初始化
    var convertUrlToJson=commom.convertUrlToJson;
    var seefile=require('../common/seefile');


    var urls={
        BusinessLicenseUrl:'营业执照',//营业执照
        OrgCodeCertificateUrl:'组织机构代码证正本',//组织机构代码证正本
        TaxCertificateUrl:'税务登记证正本',//税务登记证正本
        CompanyOpeningPermitUrl:'开户许可证',//开户许可证
        CreditCodeCardUrl:'信用机构代码证',//信用机构代码证
        LPIDCardFrontUrl:'法定代表人身份证',//法定代表人身份证
        ProtocolUrl:'代发协议',//代发协议
        PowerOfAttorneyUrl:'授权委托书',////授权委托书
        PayrollCardFormUrl:'代发工资开卡信息表',////代发工资开卡信息表
        BusinessListUrl:'代发业务清单',//代发业务清单
        BatchSMSUrl:'短信信息表',//短信信息表
        OPIDCardFrontUrl:'经办人身份证正反面复印件',//经办人身份证正反面复印件
        EbankProtocolUrl:'中信银行代发单位职工集中办理电子银行委托协议',//个人网银集中办理委托协议
        EbankNoticeUrl:'关于集中办理中信银行个人网银的公告',// 关于集中办理中信银行个人网银的公告
        EbankApprovalFormUrl:'个人网银集中办理信息登记审批表',//个人网银集中办理信息登记审批表
        EbankInfoFormUrl:'批量网银信息表'//批量网银信息表
    }

    if(data&&data.Result&&data.ReturnObject){
        var attachmentsArr=[]
        var retobj=data.ReturnObject;
        for(var i in urls){
            if(retobj[i]){
                attachmentsArr.push(convertUrlToJson(retobj[i],urls[i]));
            }
        }

        $('#files').html(seefile.ks.getDocHtml(attachmentsArr,true,null,true));
        seefile.ks.bindImgClick($(document));
    }

});