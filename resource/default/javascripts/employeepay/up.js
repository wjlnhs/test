define(function (require, exports,modules) {
    var fileuploader = require('../plugins/qiniu_uploader/qiniu_i8uploader.js');
//上传文件初始化
    var up = {
        //公用初始化上传插件
        upImage:function(name,attachmentlist,ext){
            var uploader={};
            //uploader.files=attachmentlist
            var _id=attachmentlist?(attachmentlist[0].ID||attachmentlist[0].ID):new Date().getTime();
            var options = {'button': 'up'+name+'Image',//按钮ID
                'fileContainerId': 'up'+name+'Detail',//装文件容器
                'btnContainerId': 'btn_container'+name+'Image',//按钮ID容器
                'tokenUrl': '/platform/uptoken',
                'flashUrl': '/default/javascripts/plugins/qiniu_uploader/plupload/Moxie.swf',
                'extensions':ext|| 'jpg,png,pdf',
                'maxFiles': 2,
                'attachmentlist':attachmentlist,
                'beforeUpload':function(up,file,info){
                    uploader&&uploader.files&&uploader.removeFile(uploader.files.fileid||_id);
                    uploader.removeFile(_id);
                },
                'fileUploaded': function (up, file, info) {
                    //console.log(file);
                    var info = $.parseJSON(info);
                    //$('#uploadoperatorexampleimg')[0].style.backgroundImage='https://dn-'+info.bucket+'.qbox.me/'+info.key+'?imageView2/1/w/124/h/94';
                    //$('#'+name).attr('src', 'https://dn-' + info.bucket + '.qbox.me/' + info.key + '?imageView2/1/w/124/h/94');
                    uploader.files = uploader.getUploadFiles()[0];
                    //uploader && uploader.uploaderReset();
                }
            };

            uploader = fileuploader.i8uploader(options);
            return uploader;
        }
    }
    exports.up=up;
});