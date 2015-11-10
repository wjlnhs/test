define(function(require,exports,mouldes){


    var commom=require('./common').common;
    var upImage=commom.upImage; //上传文件初始化
    var convertUrlToJson=commom.convertUrlToJson;
    var seefile=require('../common/seefile');
    require('./apply.js');

    var urls={
        LPIDCardFrontUrl:'法人身份证照片',//法人身份证照片
        OPIDCardFrontUrl:'经办人身份证照片',//经办人身份证照片
        BusinessLicenseUrl:'公司营业执照',//公司营业执照
        OrgCodeCertificateUrl:'公司组织机构代码证',//公司组织机构代码证
        TaxCertificateUrl:'公司税务登记证',//公司税务登记证
        CompanyOpeningPermitUrl:'银行开户证明',//银行开户证明
        BusinessAccountFormUrl:'机构账户业务申请单',//机构账户业务申请单
        InvestorsSignatureCardUrl:'机构投资者印鉴卡',//机构投资者印鉴卡
        PowerOfAttorneyUrl:'授权委托书',//授权委托书
        FaxTradingAagreementUrl:'传真交易协议书',//传真交易协议书
        RiskEvaluationUrl:'机构风险测评问卷'//机构风险测评问卷
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