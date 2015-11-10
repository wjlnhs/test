define(function (require, exports,modules) {

    var i8reg=require('../../javascripts/common/i8reg');
    var i8ui=require('../../javascripts/common/i8ui');

    var apply_page1=$('#apply_page1');
    var apply_page2=$('#apply_page2');
    var apply_page3=$('#apply_page3');
    var apply_page4=$('#apply_page4');
    var apply_page5=$('#apply_page5');
    var apply_page6=$('#apply_page6');
    var apply_page7=$('#apply_page7');


    var commom=require('./common').common;
    var upImage=commom.upImage; //上传文件初始化
    var upImageMult=commom.upImageMult; //上传文件初始化
    var convertUrlToJson=commom.convertUrlToJson;
    var convertUrlsToJson=commom.convertUrlsToJson;
    var ajax=commom.ajax;//ajax方法
    var util=require('../common/util');
    var FundCode=util.getLastUrlName().split('#')[0];

    window.companyInfo={FundCode:FundCode,cnm:i8_session.cname,IsLastStep:false,ProductKey:FundCode}
    var historyfile=[];
    //var applyid=util.getUrlParam('applyid');


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
        AccountBookUrl:'',//户口本(整本)
        CapitalVerificationUrl:'',//验资报告
        LegalRepresentativeUrl:'',//法定代表人身份证复印件
        LegalResumeUrl:'',//法定代表人简历
        CompanyLedgerUrl:'',//公司台账

        CompanyOpeningPermitUrl:'',//up.upImage('CompanyOpeningPermitUrl'),//银行开户证明
        BusinessAccountFormUrl:'',//up.upImage('CreditCodeCardUrl'),//机构账户业务申请单
        InvestorsSignatureCardUrl:'',//up.upImage('ProtocolUrl'),//机构投资者印鉴卡
        PowerOfAttorneyUrl:'',//up.upImage('PowerOfAttorneyUrl'),//授权委托书
        FaxTradingAagreementUrl:'',//up.upImage('EbankProtocolUrl')//传真交易协议书
        RiskEvaluationUrl:''//机构风险测评问卷
    }

    var uploadsMult={
        LifePhotoUrl:'',//// 申请人生活照
        FinancialStatementUrl:'',//近两年财务报表
        TaxPaymentVoucherUrl:'',//最近一年的缴税凭证汇总清单
        TaxPaymentApproveUrl:'',//近两年增值税纳税申报表
        WagePaymentUrl:'',//最近一年的工资发放证明
        BusinessPremisesCertificateUrl:'',//经营场所证明（租赁合同或房产证明）
        HydropowerCoalUrl:'',//最近三个月缴纳水、电、煤气账单
        PropertyCertificateUrl:'',//法人个人财产证明
        HousePropertyUrl:'',//房产证
        ShareholderIDCardUrl:'',//主要股东身份证复印件
        ShareholderResumeUrl:'',//主要股东、管理者简历
        BankCopyUrl:'',//最近6个月银行对账单
        ContractUrl:'',//合同
        AllKindsOfBillsUrl:'',//近两年应收账款、应付账款、预收账款、预付账款明细账
        OtherKindsOfBillsUrl:'',//近两年其他应收款、其他应付款明细
        LoanCardMultUrl:'',//贷款卡（企业征信）记录
        BankLoanContractUrl:'',//银行贷款合同
        OtherLoanContractUrl:''//其他金融性借款（负债）合同
    }
    window.uploadsMult=uploadsMult;

    $(window).on('hashchange',function(){
        var hashVal=window.location.hash;
        $('.apply-page').hide();
        $(hashVal.split('&')[0]).show();
        $(window).scrollTop(0)
        var addClass=hashVal && hashVal.match(/\d/) && hashVal.match(/\d/)[0];
        var applytop=$('.apply-process-top');
        applytop.attr('class','apply-process-top').addClass('page'+addClass);
        if(hashVal!='apply_page1'){
            applytop.find('')
        }else{

        }
    })
    $(window).trigger('hashchange')

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
    //初始化下拉控件
    $('.i8select').each(function(i,item){
        var _item=$(item);
        _item.val(_item.attr('seletedval'));
        setSelect(_item);
    });


    //时间控件初始化
    $('.i8date').each(function(i,item){
        var _item=$(item);
        _item.setTime();
    });

    //checkbox
    $('#apply_page1 .app-checkbox').on('click',function(){
        $(this).toggleClass('checked');
    })


    //删除

    //icon-add2
    $(document).on('click','.family .icon-add2',function(){
        var $this=$(this);
        if($this.hasClass('del')){
            if($('.family').length==1){
                i8ui.error('至少填写一个家庭成员!');
                return false;
            }
            $this.parent().remove();
        }else{
            $this.parent().after($('#family_add_tp').html());
        }
        $(this).toggleClass('del');
    })

    //icon-add2
    $(document).on('click','.accno-dl .icon-add2',function(){
        var $this=$(this);
        if($this.hasClass('del')){
            if($('.accno').length==1){
                i8ui.error('至少填写一个银行账号!');
                return false;
            }
            $this.parents('dl').remove();
        }else{
            var $acc=$($('#accno_dl_tp').html());

            setSelect($acc.find('.i8select'));
            $acc.find('.accno').attr('value','')
            $this.parents('dl').after($acc)
        }
        $(this).toggleClass('del');
    })

    //收起展开
    $('.cate-row .retract,.cate-row .edit').on('click',function(){
        var caterow=$(this).parents('.cate-row');
        caterow.find('.retract,.edit').toggle();
        caterow.find('.cate-body').toggle('fast');
    })

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
//        AccNo:{
//            elem:$('#AccNo'),
//            type:'input'
//        },/// 交易账号
        Purpose:{
            elem:$('#Purpose'),
            type:'input'
        }/// 融入资金用途
    }

    var getcode=$('#getCode').on('click',function(){
        if(getcode.hasClass('disabled')){
            return;
        }

        if(i8reg.checkMobile(pageform1.OperatorPhone.elem.val())){
            getcode.addClass('disabled');
            addValidInfo({
                passport:pageform1.OperatorPhone.elem.val(),
                btnDom:getcode
            })
        }else{
            i8ui.simpleAlert('手机格式错误',pageform1.OperatorPhone.elem.focus());
        }
    })

    //第一步 下一步
    apply_page1.on('click','.next',function(){
        saveCompanyFirstStep(true,2);
    });

    //第一步 暂时保存
    apply_page1.on('click','.savedraft',function(){
        saveCompanyFirstStep(false,1,true);
    });

    //第二步 上一步
    apply_page2.on('click','.prev',function(){
        var ID= '&'+window.location.hash.split('&')[1];
        window.location.hash='#apply_page1'+ID;
    });

    //第二步 下一步
    apply_page2.on('click','.next',function(){
        saveCompanySecondStep(true,3);
    });

    //第二步 暂时保存
    apply_page2.on('click','.savedraft',function(){
        saveCompanySecondStep(false,2,true);
    });

    //第三步 上一步
    apply_page3.on('click','.prev',function(){
        var ID= '&'+window.location.hash.split('&')[1];
        window.location.hash='#apply_page2'+ID;
    });

    //第三步 下一步
    apply_page3.on('click','.next',function(){
        saveCompanyThirdStep(true,4);
    });

    //第三步 暂时保存
    apply_page3.on('click','.savedraft',function(){
        saveCompanyThirdStep(false,3,true);
    });

    //第四步 上一步
    apply_page4.on('click','.prev',function(){
        var ID= '&'+window.location.hash.split('&')[1];
        window.location.hash='#apply_page3'+ID;
    });

    //第四步 下一步
    apply_page4.on('click','.next',function(){
        saveCompanyFourthStep(true,5);
    });

    //第四步 暂时保存
    apply_page4.on('click','.savedraft',function(){
        saveCompanyFourthStep(false,4,true);
    });

    //第五步 上一步
    apply_page5.on('click','.prev',function(){
        var ID= '&'+window.location.hash.split('&')[1];
        window.location.hash='#apply_page4'+ID;
    });

    //第五步 下一步
    apply_page5.on('click','.next',function(){
        saveCompanyFifthStep(true,6);
    });

    //第五步 暂时保存
    apply_page5.on('click','.savedraft',function(){
        saveCompanyFifthStep(false,5,true);
    });

    //第六步 上一步
    apply_page6.on('click','.prev',function(){
        var ID= '&'+window.location.hash.split('&')[1];
        window.location.hash='#apply_page5'+ID;
    });

    //第六步 下一步
    apply_page6.on('click','.next',function(){
        saveCompanySixthStep(true,7);
    });

    //第六步 暂时保存
    apply_page6.on('click','.savedraft',function(){
        saveCompanySixthStep(false,6,true);
    });


    //第一步保存和暂存
    var saveCompanyFirstStep=function(isValid,step,isDraft){
        var _throw=true;
        companyInfo.IsLastStep=false;//不是最后一步

        //获取家庭成员
        var Family=[];
        var familyThrow=true;
        var _Name='';
        var _Identity='';
        var _Contact='';
        $('.family').each(function(){
            var $this=$(this);
            var _Name=$.trim($this.find('.peopleName').val());
            var _Identity=$.trim($this.find('.peopleIdentity').val());
            var _Contact=$.trim($this.find('.peopleContact').val());
            if(_Name && _Identity && _Contact){
                Family.push({
                    Name: _Name,
                    Identity : _Identity,
                    Contact : _Contact
                })
            }
        })
        //获取开户银行
        var AccNo={};
        var AccNoThrow=false;
        $('.accno-dl .i8-select').each(function(){
            var $this=$(this);
            var accnoNum= $.trim($this.next().find('.accno').val());
            var _key=$this.getValue();
            if(accnoNum){
                AccNo[_key]=(AccNo[_key] || []).concat([accnoNum])
                AccNoThrow=true;
            }
        })
        if(!isDraft){
            if(!i8reg.checkAll('#apply_page1')){
                return;
            }

            //判断家庭
            if(!_Name && !_Identity && !_Contact){

            }else{
                switch (true){
                    case !_Name:

                        i8ui.error('成员姓名不能为空',$this.find('.peopleName'));
                        $this.find('.peopleName').focus();
                        familyThrow=false;
                        break;
                    case !_Identity:
                        i8ui.error('成员身份不能为空',$this.find('.peopleIdentity'));
                        $this.find('.peopleIdentity').focus();
                        familyThrow=false;
                        break;
                    case !_Contact:

                        i8ui.error('联系方式不能为空',$this.find('.peopleIdentity'));
                        $this.find('.peopleContact').focus();
                        familyThrow=false;
                        break;
                }
            }
            //判断银行账号
            if(!AccNoThrow){
                i8ui.error('请至少填写一个银行账号！');
                return false;
            }
            //accno-outbox
            if(!familyThrow){
                return false;
            }
            if(Family.length==0){
                i8ui.error('请至少填写一个家庭成员！');
                return false;
            }


            if(!_throw){
                return;
            }
        }
        companyInfo['Family']=Family;
        companyInfo['AccNo']=AccNo;
        var modelUpload={
            modelpairMult:[{
                key:'LifePhotoUrl',
                text:'申请人生活照',
                minlen:3
            }]
        }
        //var model={};
        for(var i in pageform1){
            var item=pageform1[i];
            if(item.elem){
                switch (item.type){
                    case 'input':companyInfo[i]=item.elem.val();break;
                    case 'select':companyInfo[i]=item.elem.getValue();break;
                    default :break;
                }
            }
        }
        getModelAndSave(modelUpload,isValid,step,isDraft);
    }

    //第二步保存和暂存
    var saveCompanySecondStep=function(isValid,step,isDraft){
        companyInfo.IsLastStep=false;//不是最后一步
        var modelUpload={
            modelpair:[{
                key:'BusinessLicenseUrl',
                text:'营业执照'
            },{
                key:'OrgCodeCertificateUrl',
                text:'组织机构代码证'
            },{
                key:'TaxCertificateUrl',
                text:'税务登记证'
            },{
                key:'ArticlesOfAssociationUrl',
                text:'公司章程'
            },{
                key:'CapitalVerificationUrl',
                text:'验资报告'
            },{
                key:'LegalRepresentativeUrl',
                text:'法定代表人身份证复印件'
            },{
                key:'LegalResumeUrl',
                text:'法定代表人简历'
            }],
            modelpairMult:[{
                key:'ShareholderIDCardUrl',
                text:'主要股东身份证复印件'
            },{
                key:'ShareholderResumeUrl',
                text:'主要股东、管理者简历'
            }]
        }
        getModelAndSave(modelUpload,isValid,step,isDraft);
    }

    //第三步保存和暂存
    var saveCompanyThirdStep=function(isValid,step,isDraft){
        companyInfo.IsLastStep=false;//不是最后一步
        var modelUpload={
            modelpair:[{
                key:'CompanyLedgerUrl',
                text:'公司台账'
            }],
            modelpairMult:[{
                key:'HousePropertyUrl',
                text:'土地、房屋产权证'
            },{
                key:'BusinessPremisesCertificateUrl',
                text:'房屋租赁合同'
            },{
                key:'WagePaymentUrl',
                text:'固定资产清单'
            }]
        }
        getModelAndSave(modelUpload,isValid,step,isDraft);
    }

    //第四步保存和暂存
    var saveCompanyFourthStep=function(isValid,step,isDraft){
        companyInfo.IsLastStep=false;//不是最后一步
        var modelUpload={
            modelpairMult:[{
                key:'TaxPaymentApproveUrl',
                text:'近两年增值税纳税申报表'
            },{
                key:'TaxPaymentVoucherUrl',
                text:'近两年增值税缴税单'
            },{
                key:'BankCopyUrl',
                text:'最近6个月银行对账单'
            },{
                key:'ContractUrl',
                text:'主要客户、产品的销售合同'
            }]
        }
        getModelAndSave(modelUpload,isValid,step,isDraft);
    }
    //第五步保存和暂存
    var saveCompanyFifthStep=function(isValid,step,isDraft){
        companyInfo.IsLastStep=false;//不是最后一步
        var modelUpload={
            modelpairMult:[{
                key:'FinancialStatementUrl',
                text:'近两年财务报表'
            },{
                key:'AllKindsOfBillsUrl',
                text:'近两年应收账款、应付账款、预收账款、预付账款明细账'
            },{
                key:'OtherKindsOfBillsUrl',
                text:'近两年其他应收款、其他应付款明细'
            }]
        }
        getModelAndSave(modelUpload,isValid,step,isDraft);
    }
    //第六步保存和暂存
    var saveCompanySixthStep=function(isValid,step,isDraft){
        companyInfo.IsLastStep=true;//不是最后一步
        var modelUpload={
            modelpairMult:[{
                key:'LoanCardMultUrl',
                text:'贷款卡（企业征信）记录'
            },{
                key:'BankLoanContractUrl',
                text:'银行贷款合同'
            },{
                key:'OtherLoanContractUrl',
                text:'其他金融性借款（负债）合同'
            }]
        }
        getModelAndSave(modelUpload,isValid,step,isDraft);
    }


    //根据modelpair获取修改的对象并保存
    var getModelAndSave=function(modelUpload,isValid,step,isDraft){
        var modelpair=modelUpload.modelpair || [];
        var modelpairMult=modelUpload.modelpairMult || [];
        //验证下一步是文件是否提交完整方法
        var validateimg=function(model,step){
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
        //验证下一步多文件
        var validateimgMult=function(model,step){
            if(isValid){
                for(var i=0;i<modelpairMult.length;i++){
                    var obj=model[modelpairMult[i].key];//{Name: "LifePhotoUrl",File: Array[0]}
                    if(_.isEmpty(obj)){
                        $('#btn_container'+modelpairMult[i].key+'Image').find('input').focus();
                        i8ui.simpleAlert('请上传'+modelpairMult[i].text,$('#up'+modelpairMult[i].key+'Image'));
                        return false;
                    }
                    if(modelpairMult[i].minlen && obj.length<modelpairMult[i].minlen){
                        $('#btn_container'+modelpairMult[i].key+'Image').find('input').focus();
                        i8ui.simpleAlert('请上传至少'+modelpairMult[i].minlen+'个'+modelpairMult[i].text,$('#up'+modelpairMult[i].key+'Image'));
                        return false;
                    }
                }
            }
            return true;
        }
        var urls={};
        var urlsMult={};
        var attachment=[];
        //添加附件
        for(var i=0;i<modelpair.length;i++){
            var _key=modelpair[i].key;
            urls[_key]=uploads[_key].files||companyInfo['SingleAttachment'][_key];
            if(uploads[_key].files){
                attachment.push(uploads[_key].files)
            }
        }
        //多文件附件
        for(var i=0;i<modelpairMult.length;i++){
            var _key=modelpairMult[i].key;
            var oldFiles=_.find(companyInfo['MultiAttachment'],function(item){//已经存在文件
                return item.Name==modelpairMult[i].key;
            })
            oldFiles=oldFiles && oldFiles.File;
            urlsMult[_key]=(uploadsMult[_key].files || []).concat(oldFiles || []);
            if(uploadsMult[_key].files){
                attachment=(attachment || []).concat(uploadsMult[_key].files || [])
            }
        }
        //验证是否上传完成
        var allUploaded=true;
        $('.progressContainer').each(function(){
            var $this=$(this);
            if($this.hasClass('green')){
                i8ui.error('还有未上传完成的文件');
                allUploaded=false;
            }
        })
        if(!allUploaded){
            return false;
        }
        //验证文件提交是否完整
        if(!validateimg(urls,step)){
            return;
        }
        //验证多文件提交是否完整
        if(!validateimgMult(urlsMult,step)){
            return;
        }
        if(attachment.length>0){
            //上传附件到7牛
            ajax.postData({
                attachment:attachment
            },function(data){
                var retobj=data.ReturnObject;
                var model={};
                // =model.SingleAttachment;
                //=model.MultiAttachment ;
                var SingleAttachment=companyInfo['SingleAttachment']=companyInfo['SingleAttachment'] || {};
                var MultiAttachment=companyInfo['MultiAttachment']=companyInfo['MultiAttachment'] || [];
                //从7牛返回中获取URL地址 拼接model对象
                for(var i=0;i<modelpair.length;i++){
                    var _key=modelpair[i].key;
                    var file=_.find(retobj,function(item){
                        return item.ID==(uploads[_key].files?uploads[_key].files.fileid:'')
                    })
                    SingleAttachment[_key]=file&&file.FilePath?file.FilePath:companyInfo['SingleAttachment'][_key];
                }
                console.log(data)
                //多文件
                for(var i=0;i<modelpairMult.length;i++){

                    var _key=modelpairMult[i].key;
                    //uploadsMult[_key].uploaderReset();
                    var curFiles= _.find(MultiAttachment,function(item){//当前多文件Json对象
                        return item.Name==modelpairMult[i].key;
                    });
                    curFiles=curFiles || {};
                    if($.isEmptyObject(curFiles)){
                        curFiles={Name:modelpairMult[i].key,CName:modelpairMult[i].text};
                        MultiAttachment.push(curFiles)
                    }
                    curFiles['File']=curFiles['File'] || [];//容错File为数组
                    _.each(retobj,function(item){//刚上传的文件
                        var uploadIds=_.pluck(uploadsMult[_key].files, 'fileid');
                        if(_.indexOf(uploadIds,item.ID)!=-1 && item.FilePath){
                            curFiles['File'].push({
                                Title:item.FileName,
                                Url:item.FilePath
                            })
                        }
                    })

                    //绑定上传控件
                    uploadsMult[_key].uploaderReset();
                    uploadsMult[_key].setOption('attachmentlist',convertUrlsToJson(curFiles))

                }
                companyInfo['LifePhoto']=['http://mat1.gtimg.com/gamezone/playgame/images/mobaicon.jpg','http://mat1.gtimg.com/gamezone/playgame/images/mobaicon.jpg','http://mat1.gtimg.com/gamezone/playgame/images/mobaicon.jpg']
                saveCompanyInfo(model,isValid,step,isDraft);
            },'upqiniu')
        }else{
            //if(validateimg(companyInfo,step)) {
            saveCompanyInfo(companyInfo, isValid, step,isDraft);
            //}
        }
    }

    //保存企业信息
    var saveCompanyInfo=function(model,isValid,step,isDraft){
        var $subBtn=isDraft ? null : $('.next').eq(step-2);
        companyInfo= $.extend(true,companyInfo,model,{FundCode:FundCode});
        companyInfo.CompanyName=i8_session.cname;
        if((_data.ReturnObject && _data.ReturnObject.ID) || window.location.hash.split('&')[1]){
            companyInfo.ApplyID= _data.ReturnObject.ID ||  window.location.hash.split('&')[1]
        }
        ajax.postData({
            model:companyInfo,
            step:step,
            isValid:isValid
        },function(data){
            if($.type(data)=='object'&&data.Result){
                if(isDraft){//是否暂存
                    window.location.href=i8_session.baseHost+'credit/apply-records';
                    return;
                }else{
                    console.log(data)
                    window.location.hash='#apply_page'+step+'&'+data.ReturnObject.ID;
                }
                if(step!=7){
                    //getCompanyInfo();
                    bindCompanyInfo(data)
                }
            }else{
                i8ui.error('保存失败,'+(data.Description||'网络异常，请重试')+'!')
            }
        },'submitInfo',$subBtn);
    }

    //获取企业信息
    var getCompanyInfo=function(){
        ajax.getDataSuccess({fundCode:FundCode},function(data){
            bindCompanyInfo(data)
        },'getInfo');
    }


    //绑定企业信息
    var bindCompanyInfo=function(data){
        if($.type(data)=='object'&&data.Result){
            if(data.ReturnObject){
                _data=data;
                var retobj=data.ReturnObject;
                if(data.Result&&retobj){
                    $('#productName').html(retobj.ProductName);
                    $('#applyNo').html(retobj.ApplyNo);
                    $('#apphref').attr('href','credit/detail/'+FundCode+'?applyID='+(retobj.ID || retobj.ApplyID));

                }
                companyInfo= $.extend(companyInfo,retobj||{});
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
                    $('.accno-dl').last().after($(template('accno_dl_tp',{accKey:0,accNoArr:['']})).find('.i8select').each(function(){
                        setSelect($(this))
                    }).end());
                    $oldAccNo.remove();
                }else{
                    $('.accno-dl').last().after($(template('accno_dl_tp',{accKey:0,accNoArr:['']})).find('.i8select').each(function(){
                        setSelect($(this))
                    }).end());
                    $oldAccNo.remove();
                }
                //家庭成员
                var Family=companyInfo.Family;
                if(Family && Family.length>0){
                    var $oldFamily=$('.family');
                    $oldFamily.last().after(template('family_tp',companyInfo));
                    $oldFamily.remove();
                    $('.family').last().after($('#family_add_tp').html())
                }
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
                            uploads[j]=upImage(j,[files]);
                        }else{
                            uploads[j]=upImage(j);
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
                            uploadsMult[j]=upImageMult(j,files);
                        }else{
                            uploadsMult[j]=upImageMult(j);
                        };
                    }
                }
                window.location.hash="apply_page"+((data.ReturnObject.Step>7?7:data.ReturnObject.Step)||1)+'&'+(_data.ReturnObject.ApplyID || _data.ReturnObject.ID);
                $(window.location.hash.split('&')[0]).show();
            }else{
                for(var j in uploadsMult){
                    if(!uploadsMult[j]){
                        uploadsMult[j]=upImageMult(j);
                    }
                }
                var ID= '&'+(window.location.hash.split('&')[1] || '');
                window.location.hash="apply_page1"+ID;
                $(window.location.hash.split('&')[0]).show();
            }
        }else{
            for(var j in uploadsMult){
                if(!uploadsMult[j]){
                    uploadsMult[j]=upImageMult(j);
                }
            }
            var ID= '&'+(window.location.hash.split('&')[1] || '');
            window.location.hash="apply_page1"+ID;
        }
    }

    var init=function(){
        $('#ApplyTime').val(new Date().format('yyyy-MM-dd'))
        bindCompanyInfo(_data);
    }
    init();

    var addValidInfo=function(json){
        $.ajax({
            url: i8_session.baseHost+'/webajax/login/addValidInfo',
            type: 'post',
            dataType: 'json',
            data: {jdata: {passport: json.passport, type:8}},
            cache: false,
            success: function(result){
                if(result.Result){
                    //$("#js_lg_tp_div").remove();
                    i8ui.simpleWrite('验证码已发送成功！',json.btnDom);
                    beginSetTime(json.btnDom);
                }else{
                    i8ui.error(result.Description);
                }
            },
            error: function(e1,e2,e3){
                i8ui.error("操作失败");
            }
        });

    }

    var beginSetTime=function(btndom){
        var time = 60000;
        clearTime = false;
        //util.setCookies2('i8codeinfo',"120000",60);
        setTfunc(time);
        function setTfunc(time){
            btndom.addClass("disabled").html();
            if(time > 0){
                time = time - 1000;
                btndom.html(time/1000+'秒后重发');
                setTimeout(function(){
                    if(!clearTime){
                        setTfunc(time);
                    }
                },1000)
            }else{
                btndom.removeClass('disabled').html('获取验证码');
            }
        }
    }

});