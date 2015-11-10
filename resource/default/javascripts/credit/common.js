define(function (require, exports,modules) {
    var fileuploader = require('../plugins/qiniu_uploader/qiniu_i8uploader.js');
    var i8ui=require('../../javascripts/common/i8ui');
    var util=require('default/javascripts/common/util.js')
    var ajaxBaseHost=i8_session.ajaxHost;

    var ajaxfun=function(options,callback,type,url,$subBtn){
        if($subBtn){
            if($subBtn.hasClass('avoid')){
                return false;
            }
            var oldTxt=$subBtn.text();
            $subBtn.addClass('avoid').text('提交中...');
        }
        $.ajax({
            url: ajaxBaseHost + 'webajax/credit_ajax/'+url,
            type: type,
            dataType: 'json',
            //data:type=='get'?{options:options}:{options:util.toJsonString(options)},
            data:type=='get'?{options:options}:{options:JSON.stringify(options)},
            cache:false,
            success: function (data) {
                if($subBtn){
                    $subBtn.removeClass('avoid').text(oldTxt);
                }
                callback(data);
            }, error: function (error) {
                if($subBtn){
                    $subBtn.removeClass('avoid').text(oldTxt);
                }
                callback({Result:false,Description:'网络异常，请重试！'});
            }
        });
    }


    var UrlConfig={
        LPIDCardFrontUrl:'法人身份信息',//法人身份信息
        OPIDCardFrontUrl:'经办人身份信息',//经办人身份信息
        BusinessLicenseUrl:'公司营业执照',//公司营业执照
        OrgCodeCertificateUrl:'公司组织机构代码证',//公司组织机构代码证
        TaxCertificateUrl:'公司税务登记证',//公司税务登记证
        CompanyOpeningPermitUrl:'公司开户许可证',//公司开户许可证
        CreditCodeCardUrl:'公司信用机构代码证',//公司信用机构代码证
        ProtocolUrl:'代发协议',//代发协议
        PowerOfAttorneyUrl:'授权委托书',//授权委托书
        EbankProtocolUrl:'中信银行代发单位职工集中办理电子银行委托协议',//个人网银集中办理委托协议
        BusinessAccountFormUrl:'机构账户业务申请单',
        InvestorsSignatureCardUrl:'机构投资者印鉴卡',
        FaxTradingAagreementUrl:'传真交易协议书',
        RiskEvaluationUrl:'机构风险测评问卷',

        OpeningPermitUrl:'开户许可证',//
        ArticlesOfAssociationUrl:'公司章程',//
        LCCodeUrl:'信用机构代码证',//
        MaximumContractUrl:'近一年最大金额的一份合同',//
        RecentContractUrl:'最近签订的一份企业合同',//
        PerformanceContractUrl:'履行中合同金额统计表',//
        LoanCardUrl:'贷款卡',//
        LegalCreditReportUrl:'法人的个人征信报告',//
        MarriageCertificateUrl:'借款人结婚证',//
        SpouseIdentityCardUrl:'借款人配偶身份证',//
        AccountBookUrl:'户口本(整本)',//,
        CapitalVerificationUrl:'验资报告',//
        MarriageCertificate2Url:'借款人配偶结婚证',//
        DriverLicenseUrl:'借款人驾驶证（若有）',//

        LegalRepresentativeUrl:'法定代表人身份证复印件',//
        LegalResumeUrl:'法定代表人简历',//
        CompanyLedgerUrl:'公司台账'//
    }
//上传文件初始化
    var common = {
        ajax:{
            getData:function(options,callback,ajaxurl,$subBtn){
                ajaxfun(options,callback,'get',ajaxurl,$subBtn);
            },
            postData:function(options,callback,ajaxurl,$subBtn){
                ajaxfun(options,callback,'post',ajaxurl,$subBtn);
            },
            getDataSuccess:function(options,callback,ajaxurl,$subBtn){
                ajaxfun(options,function(data){
                    if(data.Code==0){
                        callback(data)
                    }else{
                        i8ui.error(data.Description || '未知错误')
                    }
                },'get',ajaxurl,$subBtn);
            },
            postDataSuccess:function(options,callback,ajaxurl,$subBtn){
                ajaxfun(options,function(data){
                    if(data.Code==0){
                        callback(data)
                    }else{
                        i8ui.error(data.Description || '未知错误')
                    }
                },'post',ajaxurl,$subBtn);
            }
        },
        //公用初始化上传插件
        upImage:function(name,attachmentlist){
            var uploader={};
            var btn=$('#up'+name+'Image');
            if(btn.hasClass('upload-cloud-btn')&&attachmentlist&&attachmentlist[0]){
                btn.attr('class','reupload').html('重新上传');
            }
            var _id=attachmentlist&&attachmentlist[0]?(attachmentlist[0].ID||attachmentlist[0].fileid):new Date().getTime();
            var options = {'button': 'up'+name+'Image',//按钮ID
                'fileContainerId': 'up'+name+'Detail',//装文件容器
                'btnContainerId': 'btn_container'+name+'Image',//按钮ID容器
                'tokenUrl': '/platform/uptoken',
                'flashUrl': '/default/javascripts/plugins/qiniu_uploader/plupload/Moxie.swf',
                'extensions': 'jpg,png,pdf',
                'maxFiles': 2,
                'attachmentlist':attachmentlist,
                'beforeUpload':function(up,file,info){
                    $('#'+options.fileContainerId).empty();
                    uploader&&uploader.files&&uploader.removeFile(uploader.files.fileid||_id);
                    uploader.removeFile(_id);
                    if(btn.hasClass('upload-cloud-btn')){
                        btn.attr('class','reupload').html('重新上传');
                    }
                },
                'fileUploaded': function (up, file, info) {
                    uploader.files = uploader.getUploadFiles()[0];
                }
            };

            uploader = fileuploader.i8uploader(options);
            return uploader;
        },
        //公用初始化上传插件（多文件）
        upImageMult:function(name,attachmentlist){
            var uploader={};
            var extensions=$('#'+'btn_container'+name+'Image').attr('ext');
            var options = {'button': 'up'+name+'Image',//按钮ID
                'fileContainerId': 'up'+name+'Detail',//装文件容器
                'btnContainerId': 'btn_container'+name+'Image',//按钮ID容器
                'tokenUrl': '/platform/uptoken',
                'flashUrl': '/default/javascripts/plugins/qiniu_uploader/plupload/Moxie.swf',
                'extensions': extensions || 'jpg,png,pdf',
                'maxFiles': 9999,
                'attachmentlist':attachmentlist,
                'beforeUpload':function(up,file,info){

                },
                'fileUploaded': function (up, file, info) {
                    uploader.files = uploader.getUploadFiles();
                },
                'deleteUpload':function(){
                    uploader.files = uploader.getUploadFiles();
                },
                'optionChanged':function(up,option_name){
                    if(option_name=='attachmentlist'){
                        var _attachmentlist=up.getOption('attachmentlist');
                        up.fns.addAttachList(_attachmentlist);
                    }
                },
                'onExistDelete':function($cancelDom){
                    var _filepath=$cancelDom.attr('filepath');
                    _.each(companyInfo.MultiAttachment,function(item){
                        var filepaths=_.pluck(item.File,'Url');
                        if(_.indexOf(filepaths,_filepath)!=-1){
                            item.File= _.filter(item.File,function(item2){
                                return item2.Url!=_filepath;
                            })
                        }
                    })
                }
            };

            uploader = fileuploader.i8uploader(options);
            return uploader;
        },
        //把url转成附件格式json
        convertUrlToJson:function(Url,Title){
            if(!Url){
                return
            }else{
                var arr=Url.split('.');
                var ext=arr[arr.length-1].split('?')[0];
               //多文件有后缀名字的去掉后缀；
                var reg=new RegExp('\\.'+ext+'\$');
                var _Title=Title;
                var _Title=_Title.replace(reg,'');
                //多文件有后缀名字的去掉后缀结束；
                var json={
                    ID:new Date().getTime(),
                    Extension:ext,
                    FilePath:Url,
                    FileName:(UrlConfig[Title]||_Title)+'.'+ext,
                    Type:Title,
                    CreateTime:'2011-01-01'
                }
                return json;
            }

        },
        convertUrlsToJson:function(obj){//多文件{File:[{Title:xx,Url:xx}],Name:'文件分类'}
            if(!obj || $.isEmptyObject(obj)){
                return
            }else{
                var attachmentlist=[];
                var files=obj.File;
                for(var i=0;i<files.length;i++){
                    attachmentlist.push(common.convertUrlToJson(files[i].Url,files[i].Title))
                }
                return attachmentlist;
            }

        }

    }
    exports.common=common;
});