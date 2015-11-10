define(function (require, exports,modules) {

    var i8reg=require('../../javascripts/common/i8reg');
    var i8ui=require('../../javascripts/common/i8ui');

    var apply_page1=$('#apply_page1');
    var apply_page2=$('#apply_page2');
    var apply_page3=$('#apply_page3');
    var apply_page4=$('#apply_page4');




    var commom=require('./common').common;
    var upImage=commom.upImage; //上传文件初始化
    var convertUrlToJson=commom.convertUrlToJson;
    var ajax=commom.ajax;//ajax方法
    var util=require('../common/util');
    var FundCode=util.getLastUrlName().split('#')[0];

    var companyInfo={FundCode:FundCode}
    var historyfile=[];
    //var applyid=util.getUrlParam('applyid');


    var uploads={
        LPIDCardFrontUrl:'',//up.upImage('LPIDCardFrontUrl'),//法人身份证照片
        OPIDCardFrontUrl:'',//up.upImage('OPIDCardFrontUrl'),//经办人身份证照片
        BusinessLicenseUrl:'',//up.upImage('BusinessLicenseUrl'),//公司营业执照
        OrgCodeCertificateUrl:'',//up.upImage('OrgCodeCertificateUrl'),//公司组织机构代码证
        TaxCertificateUrl:'',//up.upImage('TaxCertificateUrl'),//公司税务登记证
        CompanyOpeningPermitUrl:'',//up.upImage('CompanyOpeningPermitUrl'),//开户许可证
        BusinessAccountFormUrl:'',//up.upImage('CreditCodeCardUrl'),//机构账户业务申请单
        InvestorsSignatureCardUrl:'',//up.upImage('ProtocolUrl'),//机构投资者印鉴卡
        PowerOfAttorneyUrl:'',//up.upImage('PowerOfAttorneyUrl'),//授权委托书
        FaxTradingAagreementUrl:'',//up.upImage('EbankProtocolUrl')//传真交易协议书
        RiskEvaluationUrl:'',//机构风险测评问卷
        InvestorsOpeningCardUrl:''//投资者开户银行卡信息
    }



    $(window).on('hashchange',function(){
        var hashVal=window.location.hash;
        $('.apply-page').hide();
        $(hashVal).show();
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

    //初始化下拉控件
    $('.i8select').each(function(i,item){
        var _item=$(item);
        _item.val(_item.attr('seletedval'));
        _item.setSelect({
            newi8select:'newi8-select fw_left m-r10',
            dropstyle: 'newselecti',
            ckedstyle: 'newselectcked',
            style:"width:298px;",
            cbk:function(dom){

            }
        });
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

    //收起展开
    $('.cate-row .retract,.cate-row .edit').on('click',function(){
        var caterow=$(this).parents('.cate-row');
        caterow.find('.retract,.edit').toggle();
        caterow.find('.cate-body').toggle('fast');
    })

    var pageform1={
        CompanyName:{
            elem:$('#CompanyName'),
            type:'input'
        },/// 投资者名称(银行户名)
        LicenseType:{
            elem:$('#LicenseType'),
            type:'select'
        }, /// 证件类型
        LicenseNo:{
            elem:$('#LicenseNo'),
            type:'input'
        },/// 证件号码
        BusinessScope:{
            elem:$('#BusinessScope'),
            type:'input'
        },/// 经营范围
        CompanyType:{
            elem:$('#CompanyType'),
            type:'select'
        },/// 机构类型
        OrgCode:{
            elem:$('#OrgCode'),
            type:'input'
        },/// 组织机构代码
        TaxCode:{
            elem:$('#TaxCode'),
            type:'input'
        },/// 税务登记号码
        Address:{
            elem:$('#Address'),
            type:'input'
        },/// 营业地址
        PostCode:{
            elem:$('#PostCode'),
            type:'input'
        },/// 投资人邮政编码
        OfficeTelNo:{
            elem:$('#OfficeTelNo'),
            type:'input'
        },// 投资人单位电话号码
        LicenseExpiryDate:{
            elem:$('#LicenseExpiryDate'),
            type:'input',
            isDate:true
        },/// 投资者证件有效期
        LegalPersonName:{
            elem:$('#LegalPersonName'),
            type:'input'
        }, /// 法定代表人姓名
        LegalPersonIDType:{
            elem:$('#LegalPersonIDType'),
            type:'select'
        },/// 法人证件类型
        LegalPersonIDNumber:{
            elem:$('#LegalPersonIDNumber'),
            type:'input'
        },/// 法人证件号码
        LegalPersonIDExpiryDate:{
            elem:$('#LegalPersonIDExpiryDate'),
            type:'input',
            isDate:true
        },// 法人证件有效期
        OperatorName:{
            elem:$('#OperatorName'),
            type:'input'
        },/// 经办人姓名
        OperatorPhone:{
            elem:$('#OperatorPhone'),
            type:'input'
        },/// 经办人联系电话
        OPIDType:{
            elem:$('#OPIDType'),
            type:'select'
        },//经办人证件类型
        OPIDNumber:{
            elem:$('#OPIDNumber'),
            type:'input'
        },//经办人证件号码
        OPIDExpiryDate:{
            elem:$('#OPIDExpiryDate'),
            type:'input',
            isDate:true
        },//经办人证件有效期
        BankOfDeposit:{
            elem:$('#BankOfDeposit'),
            type:'select'
        },//开户银行
        BankAccount:{
            elem:$('#BankAccount'),
            type:'input'
        },//银行账号
        OPValidCode:{
            elem:$('#OPValidCode'),
            type:'input'
        },//开户网点
        BranchInfo:{
            elem:$('#BranchInfo'),
            type:'input'
        }
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
        window.location.hash='#apply_page1';
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
        window.location.hash='#apply_page2';
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
        window.location.hash='#apply_page3';
    });

    //第四步 下一步
    apply_page4.on('click','.next',function(){
        saveCompanyFourthStep(true,5);
    });

    //第四步 暂时保存
    apply_page4.on('click','.savedraft',function(){
        saveCompanyFourthStep(false,4,true);
    });


    //历史记录
    $('.upload-card-sel').on('click',function(){
        var _card=$(this).parents('.upload-card');
        var _li=_card.find('li');
        var _id=_card.find('ul').attr('id');
        var _type=_id?_id.substr(2,_id.length-8):'';
        var fileid=_li.attr('fileid')||_li.attr('uuid');
        if($('#historyfile').find('li').length==0){
            i8ui.error('暂无历史记录',$(this));
            return;
        }
        var showbox=$(i8ui.showbox({title:'历史记录',cont:$('#historyfile').html()}));
        showbox.on('click','li',function(){
            showbox.find('.cyclecheck').removeClass('checked');
            $(this).find('.cyclecheck').addClass('checked');
        });

        showbox.on('click','.btn-blue-h32w90',function(){
            var currentimg=showbox.find('.cyclecheck.checked');
            if(currentimg.length>0){
                var index=currentimg.parents('li').attr('index');
                var item=historyfile[index];
                if(fileid){
                    uploads[_type].removeFile(fileid);
                }
                uploads[_type].addAttachList([item]);
                companyInfo[_type]=item.FilePath;
                showbox.find('.ct-close').trigger('click');
            }else{
                i8ui.error('请选择一个文件！');
            }

        })

        showbox.on('click','.btn-gray-h32w90',function(){
            showbox.find('.ct-close').trigger('click');
        })
    })

    //第一步保存和暂存
    var saveCompanyFirstStep=function(isValid,step,isDraft){
        var _throw=true;

        if(!isDraft){
            if(!i8reg.checkAll('#apply_page1')){
                return;
            }
            $('#apply_page1 .app-checkbox').each(function(){
                if(!$(this).hasClass('checked')){
                    i8ui.error('您还未同意'+$(this).next().text(),$(this))
                    _throw=false;
                }
            })
            if(!_throw){
                return;
            }
        }
        var model={

        }
        for(var i in pageform1){
            var item=pageform1[i];
            if(item.elem){
                switch (item.type){
                    case 'input':model[i]=item.elem.val();break;
                    case 'select':model[i]=item.elem.getValue();break;
                    default :break;
                }
            }
        }
        saveCompanyInfo(model,isValid,step,isDraft);
    }

    //第二步保存和暂存
    var saveCompanySecondStep=function(isValid,step,isDraft){
        var modelpair=[{
            key:'LPIDCardFrontUrl',
            text:'法人身份信息'
        },{
            key:'OPIDCardFrontUrl',
            text:'经办人身份信息'
        }];
        getModelAndSave(modelpair,isValid,step,isDraft);
    }

    //第三步保存和暂存
    var saveCompanyThirdStep=function(isValid,step,isDraft){
        var modelpair=[{
            key:'BusinessLicenseUrl',
            text:'公司营业执照'
        },{
            key:'OrgCodeCertificateUrl',
            text:'公司组织机构代码证'
        },{
            key:'TaxCertificateUrl',
            text:'公司税务登记证'
        },{
            key:'CompanyOpeningPermitUrl',
            text:'开户许可证'
        },{
            key:'InvestorsOpeningCardUrl',
            text:'投资者开户银行卡信息'
        }];
        getModelAndSave(modelpair,isValid,step,isDraft);
    }

    //第四步保存和暂存
    var saveCompanyFourthStep=function(isValid,step,isDraft){
        var modelpair=[{
            key:'InvestorsSignatureCardUrl',
            text:'机构投资者印鉴卡'
        },{
            key:'PowerOfAttorneyUrl',
            text:'授权委托书'
        }];
        getModelAndSave(modelpair,isValid,step,isDraft);
    }


    //根据modelpair获取修改的对象并保存
    var getModelAndSave=function(modelpair,isValid,step,isDraft){

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
        var urls={};
        var attachment=[];
        //添加附件
        for(var i=0;i<modelpair.length;i++){
            var _key=modelpair[i].key;
            urls[_key]=uploads[_key].files||companyInfo[_key];
            if(uploads[_key].files){
                attachment.push(uploads[_key].files)
            }
        }
        //验证文件提交是否完整
        if(!validateimg(urls,step)){
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
                    model[_key]=file&&file.FilePath?file.FilePath:companyInfo[_key];
                }
                if(validateimg(model,step)){
                    saveCompanyInfo(model,isValid,step,isDraft);
                }
            },'upqiniu')
        }else{
            if(validateimg(companyInfo,step)) {
                saveCompanyInfo(companyInfo, isValid, step,isDraft);
            }
        }
    }

    //保存企业信息
    var saveCompanyInfo=function(model,isValid,step,isDraft){
        var $subBtn=isDraft ? null : $('.next').eq(step-2);
        companyInfo= $.extend(companyInfo,model,{FundCode:FundCode});
        ajax.postData({
            model:companyInfo,
            step:step,
            isValid:isValid
        },function(data){
            if($.type(data)=='object'&&data.Result){
                clearTime=true;
                getcode.removeClass('disabled').html('获取验证码');
                if(isDraft){//是否暂存
                    window.location.href=i8_session.baseHost+'cmppay/apply-records';
                    return;
                }else{
                    window.location.hash='#apply_page'+step;
                }
                if(step!=5){
                    getCompanyInfo();
                }
                getHistoryFile();
            }else{
                i8ui.error('保存失败,'+(data.Description||'网络异常，请重试')+'!')
            }
        },'submitcompanyinfo',$subBtn);
    }

    //获取企业信息
    var getCompanyInfo=function(){
        ajax.getData({fundCode:FundCode},function(data){
            bindCompanyInfo(data)
        },'getcompanyinfo');
    }

    //获取历史文件信息
    var getHistoryFile=function(callback){
        ajax.getData({},function(data){
            historyfile=_.map(data.ReturnObject,function(item){
                return convertUrlToJson(item.Item2,item.Item1);
            });
            if($('#historyfile').length!=0){
                $('#historyfile').find('.filelist').html(template('historyimglist',{file:historyfile||[]}));
            }
        },'gethistoryfile');
    }

    //绑定企业信息
    var bindCompanyInfo=function(data){
        if($.type(data)=='object'&&data.Result){
            if(data.ReturnObject){
                var retobj=data.ReturnObject;
                if(data.Result&&retobj){
                    $('#productName').html(retobj.ProductName);
                    $('#applyNo').html(retobj.ApplyNo);
                    $('#apphref').attr('href','cmppay/detail/'+retobj.ApplyID);

                }
                companyInfo= $.extend(companyInfo,retobj||{});
                for(var i in pageform1){
                    var item=pageform1[i];
                    if(item.elem){
                        if(item.isDate){
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
                        if(retobj[j]){
                            var files=convertUrlToJson(retobj[j],j);
                            uploads[j]=upImage(j,[files]);
                        }else{
                            uploads[j]=upImage(j);
                        };
                    }
                }
                window.location.hash="apply_page"+((data.ReturnObject.Step>5?5:data.ReturnObject.Step)||1);
                $(window.location.hash).show();
            }else{
                window.location.hash="apply_page1";
                $(window.location.hash).show();
            }
        }else{
            window.location.hash="apply_page1";
        }
    }

    var init=function(){
        bindCompanyInfo(_data);
        getHistoryFile();
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