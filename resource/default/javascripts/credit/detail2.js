define(function(require,exports,mouldes){


    var commom=require('./common').common;
    var upImage=commom.upImage; //上传文件初始化
    var convertUrlToJson=commom.convertUrlToJson;
    var convertUrlsToJson=commom.convertUrlsToJson;
    var ajax=commom.ajax;
    var seefile=require('../common/seefile');
    var i8ui=require('../../javascripts/common/i8ui');
   // require('./apply1.js');

    var uploads={
        LPIDCardFrontUrl:'',//up.upImage('LPIDCardFrontUrl'),//法人身份证照片
        //OPIDCardFrontUrl:'',//up.upImage('OPIDCardFrontUrl'),//经办人身份证照片
        BusinessLicenseUrl:'',//up.upImage('BusinessLicenseUrl'),//公司营业执照
        OrgCodeCertificateUrl:'',//up.upImage('OrgCodeCertificateUrl'),//公司组织机构代码证
        TaxCertificateUrl:'',//up.upImage('TaxCertificateUrl'),//公司税务登记证
        OpeningPermitUrl:'',//开户许可证
        ArticlesOfAssociationUrl:'',//公司章程
        LCCodeUrl:'',//信用机构代码证
        MaximumContractUrl:'',//近一年最大金额的一份合同
        RecentContractUrl:'',//最近签订的一份企业合同
        PerformanceContractUrl:'',//履行中合同金额统计表
        LoanCardUrl:'',//贷款卡
        LegalCreditReportUrl:'',//法人的个人征信报告
        MarriageCertificateUrl:'',//借款人结婚证
        SpouseIdentityCardUrl:'',//借款人配偶身份证
        AccountBookUrl:'',//户口本(整本),
        CapitalVerificationUrl:'',//验资报告
        MarriageCertificate2Url:'',//借款人配偶结婚证
        DriverLicenseUrl:'',//借款人驾驶证（若有）

        CompanyOpeningPermitUrl:'',//up.upImage('CompanyOpeningPermitUrl'),//银行开户证明
        BusinessAccountFormUrl:'',//up.upImage('CreditCodeCardUrl'),//机构账户业务申请单
        InvestorsSignatureCardUrl:'',//up.upImage('ProtocolUrl'),//机构投资者印鉴卡
        PowerOfAttorneyUrl:'',//up.upImage('PowerOfAttorneyUrl'),//授权委托书
        FaxTradingAagreementUrl:'',//up.upImage('EbankProtocolUrl')//传真交易协议书
        RiskEvaluationUrl:''//机构风险测评问卷
    }

    var uploadsMult={
        LifePhotoUrl:'',//// 申请人生活照
        FinancialStatementUrl:'',//最近三年、最近六个月的财务报表
        TaxPaymentVoucherUrl:'',//最近一年的缴税凭证汇总清单
        WagePaymentUrl:'',//最近一年的工资发放证明
        BusinessPremisesCertificateUrl:'',//经营场所证明（租赁合同或房产证明）
        HydropowerCoalUrl:'',//最近三个月缴纳水、电、煤气账单
        PropertyCertificateUrl:'',//法人个人财产证明
        BankCopyUrl:'',//近6个月公司或个人银行对账单（法人、法人配偶、股东等可合并计算，尽量多提供）
        ContractUrl:'',//合同
        InvoiceUrl:'',//发票
        HousePropertyUrl:''//房产证
    }
    var pageform1={
        ApplyPersonName:{
            elem:$('#ApplyPersonName'),
            type:'input'
        },/// 申请人
        ApplyTime:{
            elem:$('#ApplyTime'),
            type:'input',
            isDate:true
        }, ///申请时间
        LoanAmount:{
            elem:$('#LoanAmount'),
            type:'input'
        },/// 融资金额（万）
        LoanMonths:{
            elem:$('#LoanMonths'),
            type:'input'
        },/// 融资期限（月）
        WageDay:{
            elem:$('#WageDay'),
            type:'input',
            isDate:true
        },/// 工资固定发放日
        FixedIncomeTaxWithholding:{
            elem:$('#FixedIncomeTaxWithholding'),
            type:'input',
            isDate:true
        },/// 所得税固定扣缴日
        AccNo:{
            elem:$('#AccNo'),
            type:'input'
        },/// 交易账号
        Purpose:{
            elem:$('#Purpose'),
            type:'input'
        }/// 融入资金用途
    }

    var setSelect=function(item){
        item.setSelect({
            newi8select:'newi8-select fw_left m-r10',
            dropstyle: 'newselecti',
            ckedstyle: 'newselectcked',
            style:"width:298px;",
            cbk:function(dom){

            }
        });
        return item;
    }

    if(data&&data.Result&&data.ReturnObject){
        var attachmentsArr=[];
        var companyInfo;
        var retobj=companyInfo=data.ReturnObject;
//银行账号
        var AccNo=companyInfo.AccNo;
        var $oldAccNo=$('.accno-dl');
        if(!$.isEmptyObject(AccNo)){
            for(var k in AccNo){
                var item={
                    accKey:k,
                    accNoArr:AccNo[k]
                };
                console.log(item)
                $('.accno-dl').last().after($(template('accno_dl_tp',item)).find('.i8select').each(function(){
                    var $this=$(this);
                    $this.val($this.attr('seletedval'));
                    setSelect($this)
                })
                    .end()
                    .find('.icon-add2')
                    .addClass('del')
                    .end())
            }
            $oldAccNo.remove();
        }

        var Family=companyInfo.Family;
        if(Family && Family.length>0){
            var $oldFamily=$('.family');
            $oldFamily.last().after(template('family_tp',companyInfo));
            $oldFamily.remove();
        }
        $('input, textarea').attr('disabled','true')
        for(var i in pageform1){
            var item=pageform1[i];
            if(item.elem){
                if(item.isDate){
                    item.elem.val(companyInfo[i].split(' ')[0]);
                    item.elem.val(companyInfo[i].split(' ')[0]);
                }else{
                    switch (item.type){
                        case 'input':item.elem.val(companyInfo[i]);break;
                        case 'select':item.elem.setValue(companyInfo[i]);break;
                        default :break;
                    }
                }
            }
        }

        for(var j in uploads){
            if(!uploads[j]){
                var SingleAttachment=retobj['SingleAttachment'];
                if(SingleAttachment[j]){
                    var files=convertUrlToJson(SingleAttachment[j],j);
                    $('#up'+j+'Detail').replaceWith(seefile.ks.getDocHtml([files],true,null,true));
                    //uploads[j]=upImage(j,[files]);
                }else{
                    //uploads[j]=upImage(j);
                };
            }
        }
        for(var j in uploadsMult){
            if(!uploadsMult[j]){
                var MultiAttachment=retobj['MultiAttachment'];
                var obj= _.find(MultiAttachment,function(item){
                    return item.Name==j;
                })
                if(!$.isEmptyObject(obj)){
                    //var files=convertUrlToJson(retobj[j],j);

                    var files=convertUrlsToJson(obj);
                    //uploadsMult[j]=upImageMult(j,files);
                    $('#up'+j+'Detail').replaceWith(seefile.ks.getDocHtml(files,true,null,true));

                }else{
                    //uploadsMult[j]=upImageMult(j);
                };
            }
        }

        seefile.ks.bindImgClick($(document));
    }

    $('.apply-process').append($('#approve_tp').html());
    $('#agree').on('click',function(){
        var dielog=i8ui.confirm({
            'title':'',
            'body':'<div class="p20" style="padding-bottom: 0px;"><div class="m-b20 ft14">同意</div><div><textarea style="width: 300px;height: 100px;resize: none;"></textarea></div></div>'
        },function(){
            var _val=$.trim($(dielog).find('textarea').val());
            ajax.getDataSuccess({
                approveType:1,
                approveNote: _val,
                applyID:window.location.href.toLowerCase().split('?')[1].split('applyid=')[1]
            },function(data){
                if(data.Code==0){
                    i8ui.write('已同意');
                    $('#agree').remove();
                    $('#rejust').remove();
                }
            },'approve');
        })
    })
    $('#rejust').on('click',function(){
        var dielog=i8ui.confirm({
            'title':'',
            'body':'<div class="p20" style="padding-bottom: 0px;"><div class="m-b20 ft14">拒绝</div><div><textarea style="width: 300px;height: 100px;resize: none;"></textarea></div></div>'
        },function(){
            var _val=$.trim($(dielog).find('textarea').val());
            ajax.getDataSuccess({
                approveType:2,
                approveNote: _val,
                applyID:window.location.href.toLowerCase().split('?')[1].split('applyid=')[1]
            },function(data){
                if(data.Code==0){
                    i8ui.write('已拒绝');
                    $('#agree').remove();
                    $('#rejust').remove();
                }
            },'approve');
        })

        $(dielog).find('.ct-confirm').on('click',function(){
            var _val=$.trim($(dielog).find('textarea').val());
            if(!_val){
                i8ui.error('拒绝信息不能为空');
                return false;
            }
        });
    })
});