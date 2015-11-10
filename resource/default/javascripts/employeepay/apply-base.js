define(function (require, exports,modules) {

    var i8reg=require('../../javascripts/common/i8reg');
    var i8ui=require('../../javascripts/common/i8ui');
    var ajax=require('./ajax');
    var apply_page1=$('#apply_page1');
    var apply_page2=$('#apply_page2');
    var apply_page3=$('#apply_page3');
    var apply_page4=$('#apply_page4');

    var companyInfo={}
    var historyfile=[];


    var commom=require('./common').common;
    var upImage=commom.upImage; //上传文件初始化
    var convertUrlToJson=commom.convertUrlToJson;
    var util=require('../common/util');
    var applyid=util.getUrlParam('applyid');


    var uploads={
        LPIDCardFrontUrl:'',//up.upImage('LPIDCardFrontUrl'),//法人身份信息
        OPIDCardFrontUrl:'',//up.upImage('OPIDCardFrontUrl'),//经办人身份信息
        BusinessLicenseUrl:'',//up.upImage('BusinessLicenseUrl'),//公司营业执照
        OrgCodeCertificateUrl:'',//up.upImage('OrgCodeCertificateUrl'),//公司组织机构代码证
        TaxCertificateUrl:'',//up.upImage('TaxCertificateUrl'),//公司税务登记证
        CompanyOpeningPermitUrl:'',//up.upImage('CompanyOpeningPermitUrl'),//公司开户许可证
        CreditCodeCardUrl:'',//up.upImage('CreditCodeCardUrl'),//公司信用机构代码证
        ProtocolUrl:'',//up.upImage('ProtocolUrl'),//代发协议
        PowerOfAttorneyUrl:'',//up.upImage('PowerOfAttorneyUrl'),//授权委托书
        EbankProtocolUrl:'',//up.upImage('EbankProtocolUrl')//中信银行代发单位职工集中办理电子银行委托协议
        EbankNoticeUrl:''// 关于集中办理中信银行个人网银的公告
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

    $('.i8select').each(function(i,item){
        var _item=$(item);
        _item.val(_item.attr('seletedval'));
        _item.setSelect({
            newi8select:'newi8-select fw_left m-r10',
            dropstyle: 'newselecti',
            ckedstyle: 'newselectcked',
            cbk:function(dom){

            }
        });
    });

    //收起展开
    $('.cate-row .retract,.cate-row .edit').on('click',function(){
        var caterow=$(this).parents('.cate-row');
        caterow.find('.retract,.edit').toggle();
        caterow.find('.cate-body').toggle('fast');
    })

    $('.seebigimg').on('click',function(){
        var _src=$(this).parents('.upload-example-cont').find('img').attr('src');
        if(!_src){
            return;
        }
        _src=_src.split('?')[0];
        var _html=$('<div><div class="home-showbox"><a class="close-showbox">X</a><img src="'+_src+'"/></div></div>');
        _html.find('img').on('load',function(){
            var showbox=i8ui.showbox({cont:_html.html()});
            $(showbox).css('top',$(window).scrollTop()+40+'px').on('click','a.close-showbox',function(){
                showbox.close();
            })
        })

    })

    var pageform1={
        companyname:$('#companyname'),/// 单位名称:'
        companytype:$('#companytype'),/// 单位性质
        businesslicenseno:$('#businesslicenseno'),/// 营业执照注册号
        licensedomicile:$('#licensedomicile'), /// 单位证件住所
        licenseaddress:$('#licenseaddress'),/// 单位证件通讯地址
        zipcode:$('#zipcode'),/// 通讯地址邮编
        paycheckbank:$('#paycheckbank'),/// 单位工资卡开户行
        legalpersonname:$('#legalpersonname'),/// 法人姓名
        legalpersonidtype:$('#legalpersonidtype'),/// 法人证件类型
        legalpersonidnumber:$('#legalpersonidnumber'),/// 法人证件号码
        legalpersonmobile:$('#legalpersonmobile'), /// 法人手机
        legalpersonphone:$('#legalpersonphone'),/// 法人固定电话
        operatorname:$('#operatorname'),/// 经办人姓名
        operatordepartment:$('#operatordepartment'),// 经办部门
        operatormobile:$('#operatormobile'),/// 经办人手机号码
        operatorphone:$('#operatorphone'),/// 经办人固定电话
        opvalidcode:$('#opvalidcode')//验证码
    }

    var getcode=$('#getCode').on('click',function(){
            if(getcode.hasClass('disabled')){
                return;
            }

            if(i8reg.checkMobile(pageform1.operatormobile.val())){
                getcode.addClass('disabled');
                addValidInfo({
                    passport:pageform1.operatormobile.val(),
                    btnDom:getcode
                })
            }else{
                i8ui.simpleAlert('手机格式错误',pageform1.operatormobile.focus());
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

        if(!isDraft){
            if(!i8reg.checkAll('#apply_page1')){
                return;
            }
            /*for(var i in pageform1){
                if(pageform1[i].length){
                    var text=pageform1[i].parent().prev().html();
                    var val=pageform1[i].val();
                    var maxlength=pageform1[i].attr('maxlength');
                    if(!val){
                        i8ui.simpleAlert(text+'为必填项',pageform1[i].focus());
                        return;
                    }
                }
            }*/
        }
        var model=
        {
            AccountID: i8_session.aid,/// 社区ID
            CreateID: i8_session.uid,///// 创建人
            CompanyName: pageform1.companyname.val(),/// 单位名称:'
            CompanyType: pageform1.companytype.val(),/// 单位性质
            BusinessLicenseNo: pageform1.businesslicenseno.val(),/// 营业执照注册号
            LicenseDomicile: pageform1.licensedomicile.val(), /// 单位证件住所
            LicenseAddress: pageform1.licenseaddress.val(),/// 单位证件通讯地址
            ZipCode: pageform1.zipcode.val(),/// 通讯地址邮编
            PayCheckBank: pageform1.paycheckbank.val(),/// 单位工资卡开户行
            LegalPersonName: pageform1.legalpersonname.val(),/// 法人姓名
            LegalPersonIDType: pageform1.legalpersonidtype.val(),/// 法人证件类型
            LegalPersonIDNumber: pageform1.legalpersonidnumber.val(),/// 法人证件号码
            LegalPersonMobile: pageform1.legalpersonmobile.val(), /// 法人手机
            LegalPersonPhone: pageform1.legalpersonphone.val(),/// 法人固定电话
            OperatorName: pageform1.operatorname.val(),/// 经办人姓名
            OperatorDepartment: pageform1.operatordepartment.val(),// 经办部门
            OperatorMobile: pageform1.operatormobile.val(),/// 经办人手机号码
            OperatorPhone: pageform1.operatorphone.val(),/// 经办人固定电话
            OPValidCode:pageform1.opvalidcode.val()
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
            text:'营业执照'
        },{
            key:'OrgCodeCertificateUrl',
            text:'组织机构代码证'
        },{
            key:'TaxCertificateUrl',
            text:'税务登记证'
        },{
            key:'CompanyOpeningPermitUrl',
            text:'开户许可证'
        },{
            key:'CreditCodeCardUrl',
            text:'信用机构代码证'
        }];
        getModelAndSave(modelpair,isValid,step,isDraft);
    }

    //第四步保存和暂存
    var saveCompanyFourthStep=function(isValid,step,isDraft){
        var modelpair=[{
            key:'ProtocolUrl',
            text:'代发协议'
        },{
            key:'PowerOfAttorneyUrl',
            text:'授权委托书'
        },{
            key:'EbankProtocolUrl',
            text:'中信银行代发单位职工集中办理电子银行委托协议'
        },{
            key:'EbankNoticeUrl',
            text:'关于集中办理中信银行个人网银的公告'
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
        companyInfo= $.extend(companyInfo,model);
        ajax.postData({
            model:companyInfo,
            step:step,
            isValid:isValid
        },function(data){
            if($.type(data)=='object'&&data.Result){
                clearTime=true;
                getcode.removeClass('disabled').html('获取验证码');
                if(step==5){
                    window.location.href=i8_session.baseHost+'employeepay/submit-companyapply'+(!applyid?'':'?applyid='+applyid);
                    return;
                }

                if(isDraft){//是否暂存
                    window.location.href=i8_session.baseHost+'employeepay/continue';
                    return;
                }else{
                    window.location.hash='#apply_page'+step;
                }
                getCompanyInfo();
            }else{
                i8ui.error('保存失败,'+(data.Description||'网络异常，请重试')+'!')
            }
        },'savecompanyinfo');
    }

    //获取企业信息
    var getCompanyInfo=function(){
        ajax.getData({},function(data){
            bindCompanyInfo(data)
        },'getcompanyinfo');
    }

    //获取历史文件信息
    var getHistoryFile=function(callback){
        ajax.getData({},function(data){
            historyfile=_.map(data.ReturnObject,function(item){
                return convertUrlToJson(item.Item2,item.Item1);
            });
           $('#historyfile').find('.filelist').html(template('historyimglist',{file:historyfile||[]}));
        },'gethistoryfile');
    }

    //绑定企业信息
    var bindCompanyInfo=function(data){
        if($.type(data)=='object'&&data.Result){
            if(data.ReturnObject){
                var retobj=data.ReturnObject;
                companyInfo=retobj||{};
                for(var i in retobj){
                    var tolow= i.toLocaleLowerCase();
                    switch (i){
                        case 'LPIDCardFrontUrl':/// 法人身份证正面照
                        case 'OPIDCardFrontUrl':/// 经办人身份证正面照
                        case 'BusinessLicenseUrl':// 公司营业执照
                        case 'OrgCodeCertificateUrl':/// 公司组织机构代码证
                        case 'TaxCertificateUrl':// 公司税务登记证
                        case 'CompanyOpeningPermitUrl':// 公司开户许可证
                        case 'CreditCodeCardUrl':// 公司信用机构代码证
                        case 'ProtocolUrl':// 代发协议
                        case 'PowerOfAttorneyUrl':// 授权委托书
                        case 'EbankProtocolUrl':// 中信银行代发单位职工集中办理电子银行委托协议
                        case 'EbankNoticeUrl':// 关于集中办理中信银行个人网银的公告
                            if(!uploads[i]){
                                if(retobj[i]){
                                    var files=convertUrlToJson(retobj[i],i);
                                    uploads[i]=upImage(i,[files]);
                                    //uploads[i].files=files;
                                    break;
                                }else{
                                    uploads[i]=upImage(i);
                                };
                            }
                           break;
                        default :pageform1[tolow]&&pageform1[tolow].val(retobj[i]);break;
                    }


                }
                window.location.hash="apply_page"+(data.ReturnObject.Step>4?4:data.ReturnObject.Step);
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
        //getCompanyInfo();
        bindCompanyInfo(data);
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