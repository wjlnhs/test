/**
 * Created by chent696 on 2015/3/12.
 */

/*global Qiniu */
/*global plupload */
/*global FileProgress */
/*global hljs */


//表示全局唯一标识符 (GUID)。

define(function (require, exports) {

    var FileProgress = require('./ui.js').FileProgress;
    var Qiniu = require('./qiniu.js').Qiniu;
    //require('../i8uploader/css/i8uploader.css');
    function Guid(g) {

        var arr = new Array(); //存放32位数值的数组


        if (typeof(g) == "string") { //如果构造函数的参数为字符串

            InitByString(arr, g);

        }

        else {

            InitByOther(arr);

        }

        //返回一个值，该值指示 Guid 的两个实例是否表示同一个值。

        this.Equals = function (o) {

            if (o && o.IsGuid) {

                return this.ToString() == o.ToString();

            }

            else {

                return false;

            }

        }

        //Guid对象的标记

        this.IsGuid = function () {
        }

        //返回 Guid 类的此实例值的 String 表示形式。

        this.ToString = function (format) {

            if (typeof(format) == "string") {

                if (format == "N" || format == "D" || format == "B" || format == "P") {

                    return ToStringWithFormat(arr, format);

                }

                else {

                    return ToStringWithFormat(arr, "D");

                }

            }

            else {

                return ToStringWithFormat(arr, "D");

            }

        }

        //由字符串加载

        function InitByString(arr, g) {

            g = g.replace(/\{|\(|\)|\}|-/g, "");

            g = g.toLowerCase();

            if (g.length != 32 || g.search(/[^0-9,a-f]/i) != -1) {

                InitByOther(arr);

            }

            else {

                for (var i = 0; i < g.length; i++) {

                    arr.push(g[i]);

                }

            }

        }

        //由其他类型加载

        function InitByOther(arr) {

            var i = 32;

            while (i--) {

                arr.push("0");

            }

        }

        /*

         根据所提供的格式说明符，返回此 Guid 实例值的 String 表示形式。

         N  32 位： xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

         D  由连字符分隔的 32 位数字 xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

         B  括在大括号中、由连字符分隔的 32 位数字：{xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx}

         P  括在圆括号中、由连字符分隔的 32 位数字：(xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)

         */

        function ToStringWithFormat(arr, format) {

            switch (format) {

                case "N":

                    return arr.toString().replace(/,/g, "");

                case "D":

                    var str = arr.slice(0, 8) + "-" + arr.slice(8, 12) + "-" + arr.slice(12, 16) + "-" + arr.slice(16, 20) + "-" + arr.slice(20, 32);

                    str = str.replace(/,/g, "");

                    return str;

                case "B":

                    var str = ToStringWithFormat(arr, "D");

                    str = "{" + str + "}";

                    return str;

                case "P":

                    var str = ToStringWithFormat(arr, "D");

                    str = "(" + str + ")";

                    return str;

                default:

                    return new Guid();

            }

        }

    }

//Guid 类的默认实例，其值保证均为零。

    Guid.Empty = new Guid();

//初始化 Guid 类的一个新实例。

    Guid.NewGuid = function () {

        var g = "";

        var i = 32;

        while (i--) {

            g += Math.floor(Math.random() * 16.0).toString(16);

        }

        return new Guid(g);

    }

    exports.i8uploader = function (option) {


        var option = option || {};

        var _button = option.button || 'pickfiles',
            _tokenUrl = option.tokenUrl || '/platform/uptoken',
            _flashUrl = '/default/javascripts/plugins/qiniu_uploader/plupload/Moxie.swf',
            _fileContainerId = option.fileContainerId || 'fsUploadProgress',
            _btnContainerId = option.btnContainerId || 'container',
            _beforeUpload = option.beforeUpload || function(){}, //开始上传前
            _uploadComplete = option.uploadComplete || function(){}, //上传结束
            _allFileUploaded = option.allFileUploaded || function(){},//所有文件上传完
            _deleteUpload = option.deleteUpload || function(){}, //删除文件
            _fileUploaded = option.fileUploaded || function(){}, //单个文件上传完成
            _uploadProgress = option.uploadProgress || function(){}, //上传进度事件
            _filesAdded=option.filesAdded || function(){}, //添加事件
            _optionChanged=option.optionChanged || function(){}, //属性变化事件监听
            _onExistDelete=option.onExistDelete || function(){},//当存在的文件删除时候（绑定在dom（'.state-exist .cancel'）.click）
            thumbnailWidth=80,
            thumbnailHeight=80,
            _maxFiles = option.maxFiles || 5,
            _maxSize = option.maxSize||(1024*1024*30),
            _extensions = (option.extensions || "doc,docx,xls,xlsx,ppt,pptx,pdf,zip,rar,txt,png,jpg,jpeg,gif").toLocaleLowerCase(),
            _attachmentlist = option.attachmentlist,
            _domain = option.domain || 'https://dn-i8buffer.qbox.me/';

        if(_maxSize.toString().indexOf('kb')>-1){
            _maxSize = parseFloat(_maxSize.toString())*1024;
        }else if(_maxSize.toString().indexOf('mb')>-1){
            _maxSize = parseFloat(_maxSize.toString())*1024*1024;
        }
        //= function (options) {

        //是否允许上传
        var _uploadFlag = true;
        //是否超过存储限制
        var _storageFlag = true;
        //验证上传空间
        var _fnVerifyLimit = function(){
            //总的存储空间
            var _totlaStorage = parseFloat(((i8_session||{}).platform||{}).storagelimit ||'0',10);
            var _usedStorage = parseFloat(((i8_session||{}).storenum||'0'),10);
            if(_usedStorage>=_totlaStorage && !!_totlaStorage && _totlaStorage !=0){
                _storageFlag = false;
            }
        }();

        // 上传个数判断
        var _fnFileControl = function(up){
            //if(up)
            //console.log(up);
            var _uploaded = $('#'+_fileContainerId).find('li').find('.success:visible').length;
            //_uploadedContainer

            var _queued = up.total.queued;
            if((_uploaded+_queued)>_maxFiles){

                alert('超过最大上传个数'+_maxFiles +'个的限制！');
                return false;
            }

            for(var i= 0,len=up.files.length;i<len;i++){
                if(up.files[i].size>_maxSize){
                    // alert('超过最大上传大小'+_(_maxSize/1024/1024).toFixed(2) +'MB的限制！');
                    return false;
                }
            }

            return true;
        }

        var uploader = Qiniu.uploader({
            runtimes: 'html5,flash,silverlight,html4',
            browse_button:_button,
            container: _btnContainerId,// 'container',
            drop_element: _btnContainerId,// 'container',
            max_file_size: _maxSize,
            prevent_duplicates:false,
            flash_swf_url: _flashUrl,
            dragdrop: true,
            chunk_size: '5mb',
            filters: [{ title: "All files", extensions:_extensions  }],
            uptoken_url:_tokenUrl,// $('#uptoken_url').val(),
            domain: _domain, //$('#domain').val(),
            // downtoken_url: '/downtoken',
            // unique_names: true,
            // save_key: true,
            //x_vars: {
            //    // 'id': '1234',
            // //   'key':'chentao',
            //     'time': function(up, file) {
            //         var time = (new Date()).getTime();
            //         // do something with 'time'
            //         return time;
            //     }
            //},
            auto_start: true,
            init: {
                'UploadFile':function(up,file){
                    //console.log('UploadFile');
                    if(!_storageFlag){
                        alert('存储空间超过限制！');
                    }

                },
                'FilesAdded': function (up, files) {
                    if(!_uploadFlag || !_storageFlag){
                        up.stop();
                        up.splice();
                        return false;
                    }
                    $('#'+_fileContainerId).show();
                    plupload.each(files, function (file) {
                        var progress = new FileProgress(file, _fileContainerId);
                        progress.setStatus("等待...");
                    });
                    if (typeof _filesAdded == 'function') {
                        _filesAdded(up, files);
                    }
                },
                'BeforeUpload': function (up, file) {

                    _uploadFlag = _fnFileControl(up);
                    if(!_uploadFlag || !_storageFlag){
                        return;
                    }else {
                        var progress = new FileProgress(file, _fileContainerId);
                        var chunk_size = plupload.parseSize(this.getOption('chunk_size'));
                        if (up.runtime === 'html5' && chunk_size) {
                            progress.setChunkProgess(chunk_size);
                        }

                        if (typeof _beforeUpload == 'function') {
                            _beforeUpload(file);
                        }
                    }
                },
                'UploadProgress': function (up, file) {
                    //   console.log('uploadprocess');
                    if(_uploadFlag && _storageFlag){

                        var progress = new FileProgress(file,_fileContainerId);
                        var chunk_size = plupload.parseSize(this.getOption('chunk_size'));
                        progress.setProgress(file.percent + "%", up.total.bytesPerSec, chunk_size);
                        if (typeof _beforeUpload == 'function') {
                            _uploadProgress(file);
                        }
                    }
                },
                'UploadComplete': function (up, file, info) {
                    if(typeof _uploadComplete == 'function'){
                        _uploadComplete(up, file, info);
                    }
                },
                'FileUploaded': function (up, file, info) {
                    var progress = new FileProgress(file, _fileContainerId);
                    progress.setComplete(up, file, info);

                    if(typeof _fileUploaded == 'function'){
                        _fileUploaded(up, file, info);
                    }
                    //console.log(uploader.files.length,$('#'+_fileContainerId).find('.complete').length)
                    if(uploader.files.length==$('#'+_fileContainerId).find('.complete').length){
                        _allFileUploaded(up, file, info);
                    }
                },
                'OptionChanged':function(up,option_name, info){
                    if(typeof _optionChanged == 'function'){
                        _optionChanged(up, option_name, info);
                    }
                },
                'Error': function (up, err, errTip) {
                    if(err.code == -600){
                        _uploadFlag = false;
                        alert('超过最大上传大小'+(_maxSize/1024/1024) +'MB的限制！');
                        // alert(err.message);
                    }else if(err.code == -601){
                        _uploadFlag = false;
                        alert('不支持上传的文件格式！只支持('+_extensions+')');
                    }else if(err.code == -602){
                        _uploadFlag = false;
                        alert('不能上传重复文件！');
                    }else{
                        _uploadFlag = false;
                        var qiniu_obj = window.global_qiniu_obj;
                        //if(typeof qiniu_obj == 'object' && err.code = -999)
                        if(typeof qiniu_obj == 'object' )
                        {
                           // qiniu_objn = qiniu_obj ||
                            if(!!qiniu_obj.errorMsg) {
                                alert(qiniu_obj.errorMsg);
                            }else{
                                alert(err.message);
                            }
                            return;
                        }else{

                            alert('上传失败');
                        }

                    }

                    console.log(err);
                    //    $('#'+_fileContainerId).find('table').show();

                    // var progress = new FileProgress(err.file, _fileContainerId);
                    // progress.setError();
                    //  progress.setStatus(errTip);
                }, 'CancelUpload': function () {

                },
                'Key': function (up, file) {


                    var _lastIndex = (file.name ||'').lastIndexOf('.') ||0;
                    var _extention = (file.name || '').substr(_lastIndex);
                    var _fileName = Guid.NewGuid().ToString();
                    var _filePath = '',
                        _aid = '';

                    if(typeof i8_session !== 'undefined'){
                        _aid = i8_session.aid||'';
                    }
                    if(!!_aid){
                        _filePath =  _filePath+_aid+'/';
                    }

                    return _filePath + _fileName+_extention;//file.name;
                    //var key = "";
                    // do something with key
                    // return key
                }
            }
        });

       //console.log($('.moxie-shim.moxie-shim-flash').length);

      setTimeout(function(){
          $('.moxie-shim-flash').removeAttr('style');
      },300);
        uploader.bind('FileUploaded', function () {
            // console.log('hello man,a file is uploaded');
            // $('.filelist').show();
            $('#'+_fileContainerId).show();
        });
        $('#'+_btnContainerId).on(
            'dragenter',
            function (e) {
                e.preventDefault();
                $('#'+_btnContainerId).addClass('draging');
                e.stopPropagation();
            }
        ).on('drop', function (e) {
                e.preventDefault();
                $('#'+_btnContainerId).removeClass('draging');
                e.stopPropagation();
            }).on('dragleave', function (e) {
                e.preventDefault();
                $('#'+_btnContainerId).removeClass('draging');
                e.stopPropagation();
            }).on('dragover', function (e) {
                e.preventDefault();
                $('#'+_btnContainerId).addClass('draging');
                e.stopPropagation();
            });

        function addAttachList(attachmentlist){
            if($.type(attachmentlist)=='array'&&attachmentlist.length>0){
                // $queue.show();
                for(var i= 0,len=attachmentlist.length;i<len;i++){

                    var $li = $('<li class="state-exist" fileid="' + (attachmentlist[i].ID)+ '">' +
                    '<p class="title">' + attachmentlist[i].FileName+ '</p>' +
                    '<p class="imgWrap"></p>' +
                    '<p class="progress progressName-exist"><span></span></p>' +
                    '</li>');//.appendTo($queue),
                    $btns = $('<div class="file-panel">' +
                    '<span class="cancel" filepath="'+attachmentlist[i].FilePath+'">删除</span></div><span class="success"></span>')
                        .on('click', 'span.cancel', function () {
                            var _this=$(this);
                            if(typeof _onExistDelete == 'function'){
                                _onExistDelete(_this);
                            }
                            _this.parents('li').remove();
                            //  var _ul_len=$queue.find('li').length;
                            //if(_ul_len==0){
                            //    $queue.hide();
                            //}else{
                            //    $queue.show();
                            //}
                        }).appendTo($li);
                    if(/(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(attachmentlist[i].Extension)){
                        $li.find('.imgWrap').append('<img src="'+(attachmentlist[i].ImageSmall||(attachmentlist[i].FilePath+'?imageView2/1/w/100/h/100'))+'" style="max-width:120px;max-height:120px"  />');
                    }else{
                        $li.find('.imgWrap').append('<span class="i8files-ico-'+attachmentlist[i].Extension+'"></span>');
                    }
                    $li.find('.progressName-exist').data({
                        DocID:attachmentlist[i].ID,
                        fileid:attachmentlist[i].ID
                    })

                    //$('.filelist').append($li);
                    $('#'+_fileContainerId).append($li);
                    //uploader.makeThumb('http://i8xiaoshi.qiniudn.com/attachment/cd2977ad-7aee-4db1-9d32-1516a9addf89/d28961a6-8701-384d-6c5b-279903eab691.jpg',function(error,src){console.log(error,src)},10,10)
                }

                $('#'+_fileContainerId).show();
            }
        }
        uploader.fns={
            addAttachList:addAttachList
        }
        addAttachList(_attachmentlist);

        $(document).on('click','#'+_fileContainerId+' .cancel',function(){
            var _container =    $(this).parents('li.progressContainer');
            uploader.removeFile(_container.attr('id'));
            _container.remove();
            if(typeof _deleteUpload == 'function'){
                _deleteUpload();
            }
            //删除到最后一个隐藏文件列表
            if($('#'+_fileContainerId).find('li').length == 0){
                $('#'+_fileContainerId).hide();
            }
        });


        return new function () {
            this.getUploadFiles = function (diyitems) {
                //是否自定义div
                var $objs=diyitems || $('#'+_fileContainerId).find("p.progressName")
                var uploadfiles = [];
                var jsonData = null,jsonStr = '',pushData = null,filename = '',fullFileInfo = '',fileLastIndex=0;
                $objs.each(function () {
                    //uploadfiles.push({ 'data': $(this).data(), 'aType': $(this).attr("aType") });
                    jsonStr = $(this).data('qiniudata');
                    try{
                        jsonData = $.parseJSON(jsonStr);
                    }catch(e){

                    }

                    if($.isPlainObject(jsonData)){
                        fullFileInfo = jsonData.key||'';
                        fileLastIndex = fullFileInfo.lastIndexOf('/')||-1;
                        filename = fullFileInfo.substr(fileLastIndex+1);
                        var _ext=jsonData.key.substr(jsonData.key.lastIndexOf('.')).toLocaleLowerCase();
                        pushData =  {"originalname":filename,"name":jsonData.name,"mimetype":jsonData.mimeType,"path":fullFileInfo,"extension":(jsonData.ext|| _ext || '').substr(1),"size":jsonData.size,"fileid":jsonData.uuid};
                        uploadfiles.push(pushData);
                    }

                });
                // uploader.reset();
                return uploadfiles;
            };

            this.uploaderReset = function(){
                var allFiles=uploader.files;
                for(var i=0;i<allFiles.length;){
                    uploader.removeFile(allFiles[i].id);
                }
                console.log(uploader.files);
                if($('#'+_fileContainerId).find('.multbtn').length){
                    $('#'+_fileContainerId).children().not('.multbtn').remove();
                }else{
                    $('#'+_fileContainerId).empty().hide();
                }
            };
            this.setOption = function(key,val){
                uploader.setOption(key,val);
            };

            this.removeFile = function(id){
                uploader.removeFile(id);
                $('#'+_fileContainerId).find('[uuid='+id+'],[fileid='+id+']').remove();
            };
            this.uploaderStop = function(){
                console.log(uploader)
                window.uploader=uploader;
            };
            this.addAttachList=function(_attachmentlist){
                addAttachList(_attachmentlist);
            }
            this.getExistFiles=function(){
                var existfiles=[];
                $('#'+_fileContainerId).find("p.progressName-exist").each(function () {
                    //uploadfiles.push({ 'data': $(this).data(), 'aType': $(this).attr("aType") });
                    existfiles.push($(this).data());
                });
                return existfiles;
            };
            this.getUploader = function(){
                return uploader;
            };
            this.getSingleFile = function(file){
                var jsonData=file;
                if($.isPlainObject(jsonData)){
                    fullFileInfo = jsonData.key||'';
                    fileLastIndex = fullFileInfo.lastIndexOf('/')||-1;
                    //filename = fullFileInfo.substr(fileLastIndex+1);
                    filename = fullFileInfo.substr(fileLastIndex+1);
                    var _ext=jsonData.key.substr(jsonData.key.lastIndexOf('.')).toLocaleLowerCase();
                    //pushData =  {"originalname":filename,"name":jsonData.name,"mimetype":jsonData.mimeType,"path":fullFileInfo,"extension":(jsonData.ext||'').substr(1),"size":jsonData.size,"fileid":jsonData.uuid};
                    pushData =  {"originalname":filename,"name":jsonData.name,"mimetype":jsonData.mimeType,"path":fullFileInfo,"extension":(jsonData.ext|| _ext || '').substr(1),"size":jsonData.size,"fileid":jsonData.uuid};
                }
                return pushData
            };
        }

    };
});
