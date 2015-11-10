define(function (require, exports,modules) {
    var fileuploader = require('../plugins/qiniu_uploader/qiniu_i8uploader.js');
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
        EbankNoticeUrl:'关于集中办理中信银行个人网银的公告'// 关于集中办理中信银行个人网银的公告
    }
//上传文件初始化
    var common = {
        //公用初始化上传插件
        upImage:function(name,attachmentlist){
            var uploader={};
            var btn=$('#up'+name+'Image');
            if(btn.hasClass('upload-cloud-btn')&&attachmentlist&&attachmentlist[0]){
                btn.attr('class','reupload').html('重新上传');;
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
        //把url转成附件格式json
        convertUrlToJson:function(Url,Title){
            if(!Url){
                return
            }else{
                var arr=Url.split('.');
                var ext=arr[arr.length-1].split('?')[0];
                var json={
                    ID:new Date().getTime(),
                    Extension:ext,
                    FilePath:Url,
                    FileName:(UrlConfig[Title]||Title)+'.'+ext,
                    Type:Title,
                    CreateTime:'2011-01-01'
                }
                return json;
            }

        }

    }
    exports.common=common;
});