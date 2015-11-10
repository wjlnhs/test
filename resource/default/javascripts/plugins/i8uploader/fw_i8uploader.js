/**
 * Created by kusion on 2014/11/8.
 */
define(function (require, exports) {
    /*【上传控件DEMO】*/
    require('./webuploader.js');/*seajs 引用*/
    require('./css/i8uploader.css');
    var mimeTypeJson= require('./mimeType.js');
    var util ={};
    util.urlParamToJson = function (url, key, replace) {
        url = url.replace(/^[^?=]*\?/ig, '').split('#')[0]; //去除网址与hash信息
        var json = {};
        url.replace(/(^|&)([^&=]+)=([^&]*)/g, function (a, b, key, value) {
            if (!(key in json)) {
                json[key] = /\[\]$/.test(key) ? [value] : value; //如果参数名以[]结尾，则当作数组
            }
            else if (json[key] instanceof Array) {
                json[key].push(value);
            }
            else {
                json[key] = [json[key], value];
            }
        });
        return key ? json[key] : json;
    };
    exports.i8uploader = function (options) {

        //require('./jquery-1.10.2.min.js');   // just in case. Make sure it's not an other libaray.
        var $ = jQuery,
            $wrap = $(options.uploader),

        // 文件容器
            $queue = $('<ul class="filelist"></ul>')
                .appendTo($(options.dnd)),

        // 添加的文件数量
            fileCount = 0,

        // 添加的文件总大小
            fileSize = 0,

        // 优化retina, 在retina下这个值是2
            ratio = window.devicePixelRatio || 1,

        // 缩略图大小
            thumbnailWidth = 120 * ratio,
            thumbnailHeight = 120 * ratio,
            _file,
        // 可能有pedding, ready, uploading, confirm, done.
            state = 'pedding',

        // 所有文件的进度信息，key为file id
            percentages = {},

            supportTransition = (function () {
                var s = document.createElement('p').style,
                    r = 'transition' in s ||
                        'WebkitTransition' in s ||
                        'MozTransition' in s ||
                        'msTransition' in s ||
                        'OTransition' in s;
                s = null;
                return r;
            })(),

        // WebUploader实例
            uploader;
        if (!WebUploader.Uploader.support()) {
            alert('上传控件不支持您的浏览器！如果你使用的是IE浏览器，请尝试升级 flash 播放器');
            //throw new Error('WebUploader does not support the browser you are using.');
            //return;
            return new function () {
                this.getUploadFiles = function () {
                    var uploadfiles = [];
                    return uploadfiles;
                },
                this.getExistFiles=function(){
                    var existfiles=[];
                    return existfiles;
                }
            }
        }
        var _extensions=options.accept.extensions||'doc,docx,xls,xlsx,ppt,pptx,pdf,zip,rar,txt,png,jpg,jpeg,gif';
        var _extarr=_extensions.split(',');
        options.accept.mimeTypes='';
        for(var i in _extarr){
            if(mimeTypeJson[_extarr[i]]){
                options.accept.mimeTypes+=','+mimeTypeJson[_extarr[i]];
            }
        }
        options.accept.mimeTypes=options.accept.mimeTypes.substr(1);
        var _options =$.extend({
            pick: {
                id: '#filePicker',
                label: '点击选择文件'
            },
            dnd: '#uploader .queueList',//队列列表*/'#uploader .queueList',
            paste: document.body, //document.body,
            accept:{
                extensions: 'doc,docx,xls,xlsx,ppt,pptx,pdf,zip,rar,txt,png,jpg,jpeg,gif'
            },
            // swf文件路径
            swf: '', // 'swf/Uploader.swf',
            disableGlobalDnd: true,// true,
            chunked: false,
            replace:false,
            completeDelete:false,
            server:'',// 'http://2betop.net/fileupload.php',
            fileNumLimit:5,
            fileSizeLimit: 20 * 1024 * 1024,    // 200 M
            fileSingleSizeLimit:20 * 1024 * 1024,   // 50 M
            thumbnailWidth:thumbnailWidth,
            thumbnailHeight:thumbnailHeight,
            uploadSuccess: function () { }, /*文件上传成功回调*/
            uploadfailed: function (err) { },/*文件上传失败*/
            uploadCompleted: function () { },
            deleteCallBack: function () { }, /*删除文件回调*/
            uploadStarted: function () { },/*开始上传触发*/
            cancelUploading: function () { },/*取消正在上传*/
            _resizeHandler:function(){}
        },options)
        if(_options.replace==true){
            _options.fileNumLimit=2;
        }

        uploader = WebUploader.create(_options);

        // 添加“添加文件”的按钮，
        uploader.addButton({
            id: '#filePicker2',
            label: '继续添加'
        });

        function addAttachList(attachmentlist){
            if($.type(attachmentlist)=='array'&&attachmentlist.length>0){
                $queue.show();
                for(var i= 0,len=attachmentlist.length;i<len;i++){

                    var $li = $('<li class="state-exist" id="' + attachmentlist[i].DocID+ '">' +
                            '<p class="title">' + attachmentlist[i].FileName+ '</p>' +
                            '<p class="imgWrap"></p>' +
                            '<p class="progress"><span></span></p>' +
                            '</li>').data(attachmentlist[i]).appendTo($queue),
                        $btns = $('<div class="file-panel">' +
                            '<span class="cancel">删除</span></div><span class="success"></span>')
                            .on('click', 'span.cancel', function () {
                                (function (i){
                                    if (_options.deleteCallBack) {
                                        _options.deleteCallBack(attachmentlist[i]);
                                    }
                                })(i)
                                var _this=$(this);
                                _this.parents('li').remove();
                                var _ul_len=$queue.find('li').length;
                                if(_ul_len==0){
                                    $queue.hide();
                                }else{
                                    $queue.show();
                                }

                            }).appendTo($li);
                    if(/(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(attachmentlist[i].Extension)){
                        $li.find('.imgWrap').append('<img src="'+(attachmentlist[i].ImageSmall||attachmentlist[i].FilePath)+'" width="'+_options.thumbnailWidth+'" height="'+_options.thumbnailHeight+'" />');
                    }else{
                        $li.find('.imgWrap').append('<span class="i8files-ico-'+attachmentlist[i].Extension+'"></span>');
                    }
                    $li.data({
                        DocID:attachmentlist[i].DocID
                    })
                    //uploader.makeThumb('http://i8xiaoshi.qiniudn.com/attachment/cd2977ad-7aee-4db1-9d32-1516a9addf89/d28961a6-8701-384d-6c5b-279903eab691.jpg',function(error,src){console.log(error,src)},10,10)
                }
            }
        }

        addAttachList(_options.attachmentlist);

        // 当有文件添加进来时执行，负责view的创建
        function addFile(file) {
            var $li = $('<li id="' + file.id + '">' +
                    '<p class="title">' + file.name + '</p>' +
                    '<p class="imgWrap"></p>' +
                    '<p class="progress"><span></span></p>' +
                    '</li>'),

                $btns = $('<div class="file-panel">' +
                    '<span class="cancel">删除</span>')
                    .on('click', 'span.cancel', function () {
                        uploader.cancelFile(file);
                        _file=null;
                        if (_options.deleteCallBack) {
                            _options.deleteCallBack(file);
                        }
                        var _ul_len=$queue.find('li').length;
                        if(_ul_len==0){
                            $queue.hide();
                        }else{
                            $queue.show();
                        }
                    }).appendTo($li),
                $prgress = $li.find('p.progress span'),
                $wrap = $li.find('p.imgWrap'),
                $info = $('<p class="error"></p>'),
                showError = function (code) {
                    switch (code) {
                        case 'exceed_size':
                            text = '文件大小超出';
                            break;
                        case 'interrupt':
                            text = '上传暂停';
                            break;

                        default:
                            text = '上传失败，<a >请重试</a>';
                            break;
                    }
                    $info.html(text).appendTo($li).find('a').click(function () {
                        $wrap.empty();
                        uploader.upload(file);
                    });
                };

            if (file.getStatus() === 'invalid') {
                showError(file.statusText);
            } else {
                percentages[file.id] = [file.size, 0];
                file.rotation = 0;
            }

            file.on('statuschange', function (cur, prev) {
                // 成功
                if (cur === 'error' || cur === 'invalid') {
                    showError(file.statusText);
                    percentages[file.id][1] = 1;
                } else if (cur === 'interrupt') {
                    showError('interrupt');
                } else if (cur === 'queued') {
                    percentages[file.id][1] = 0;
                } else if (cur === 'progress') {
                    $info.remove();
                    $prgress.css('display', 'block');
                } else if (cur === 'complete') {
                    $li.append('<span class="success"></span>');
                }

                $li.removeClass('state-' + prev).addClass('state-' + cur);
            });
            $li.appendTo($queue);
        }

        // 负责view的销毁
        function removeFile(file) {
            var $li = $('#' + file.id);
            delete percentages[file.id];
            $li.off().find('.file-panel').off().end().remove();
        }

        function setState(val) {
            var file, stats;

            if (val === state) {
                return;
            }
            state = val;
            switch (state) {
                case 'pedding':
                    $queue.parent().removeClass('filled');
                    $queue.hide();
                    uploader.refresh();
                    break;

                case 'ready':
                    $queue.parent().addClass('filled');
                    $queue.show();
                    uploader.refresh();
                    break;

                case 'uploading':
                    //$('#filePicker2').addClass('element-invisible');
                    break;

                case 'paused':
                    break;

                case 'confirm':
                    stats = uploader.getStats();
                    if (stats.successNum && !stats.uploadFailNum) {
                        setState('finish');
                        return;
                    }
                    break;
                case 'finish':
                    stats = uploader.getStats();
                    if (stats.successNum) {
                        //alert('上传成功');

                    } else {
                        // 没有成功的文件，重设
                        state = 'done';
                        location.reload();
                    }
                    break;
            }
        }

        uploader.onUploadStart = function (file) {
            if(_options.replace){
                if(_file){
                    uploader.cancelFile(_file);
                }
                _file=file;
            }
            var $li = $('#' + file.id);
            $li.append('<div class="loading"><span class="loadingText"></span></div>');
            if (_options.uploadStarted) {
                _options.uploadStarted(file);
            }
        }

        //文件上传中
        uploader.onUploadProgress = function (file, percentage) {
            var $li = $('#' + file.id),
                $percent = $li.find('span.loadingText');
            $percent.text(parseInt(percentage * 100) + '%');
        };

        //文件上传结束
        uploader.onUploadComplete = function (file) {
            if(_options.completeDelete==true){
                uploader.cancelFile(file);
                return;
            }
            var currentLi = $('#' + file.id);
            currentLi.find('.loading').remove();
            var $wrap = currentLi.find('p.imgWrap');
            uploader.makeThumb(file, function (error, src) {
                if (error) {
                    var span = $('<span class="i8files-ico-' + file.ext + '"></span>');
                    $wrap.empty().append(span);
                    return;
                }
                var img = $('<img src="' + src + '">');
                $wrap.empty().append(img);
            }, _options.thumbnailWidth, _options.thumbnailHeight);
            _options.uploadCompleted(file);
        }

        //文件上传成功
        uploader.onUploadSuccess = function (file, response) {
            //response = 'state=200&serverfile=0/b4ffb3a9-929c-499f-b00e-2019d298809e.pngtemp&thumbnail=/Buffer/b4ffb3a9-929c-499f-b00e-2019d298809e.png&filesize=1936&guid=b4ffb3a9-929c-499f-b00e-2019d298809e';
            /*文件返回信息数据格式
             {
             originalname: 'car mp3.txt',
             name: '264b635a4c7b5fde8eab56821342a6fc.txt',
             path: 'buffer\\264b635a4c7b5fde8eab56821342a6fc.txt',
             extension: 'txt',
             size: 27,
             truncated: false
             }*/

            /* console.log(file);console.log(response);*/
            /* var tServerJson = util.urlParamToJson(response);
             var cbfileName = file.name.replace(/,/g, '');
             tServerJson['fileName'] = encodeURIComponent(cbfileName);*/
            var currentLi = $('#' + file.id);
            if(response.Result){
                currentLi.data(response.ReturnObject,response);
                if (_options.uploadSuccess) {
                    _options.uploadSuccess(response.ReturnObject,response);
                }
            }
            /* if (tServerJson.state == '200') {

             currentLi.data('state', tServerJson.state);
             currentLi.data('serverfile', tServerJson.serverfile);
             currentLi.data('thumbnail', tServerJson.thumbnail);
             currentLi.data('filesize', tServerJson.filesize);
             currentLi.data('guid', tServerJson.guid);
             currentLi.data('filesize', tServerJson.filesize);

             var fileTypeReg = /(\.jpg|\.jpeg|\.gif|\.png)$/i;
             var _fileType = file.name.substr(file.name.lastIndexOf('.')) || file.type;
             var aType = (fileTypeReg.test(_fileType) ? '0' : '1');
             var aType = (_fileType == ".rar" || _fileType == ".zip") ? "2" : aType;
             currentLi.attr('aType', aType);

             if (_options.uploadSuccess) {
             _options.uploadSuccess(file, tServerJson);
             }
             }
             if (_options.uploadSuccess) {
             _options.uploadSuccess(file, response);
             }*/

        };

        //文件入队
        uploader.onFileQueued = function (file) {

            fileCount++;
            fileSize += file.size;
            uploader.upload(file);
            addFile(file);
            setState('ready');
        };

        //文件出队
        uploader.onFileDequeued = function (file) {
            fileCount--;
            fileSize -= file.size;

            if (!fileCount) {
                setState('pedding');
            }
            removeFile(file);

        };

        uploader.on('all', function (type) {
            var stats;
            switch (type) {
                case 'uploadFinished':
                    setState('confirm');
                    break;
                case 'startUpload':
                    setState('uploading');
                    break;
                case 'stopUpload':
                    setState('paused');
                    break;
            }
        });

        //上传出错
        uploader.onError = function (code) {
            var filesingle=_options.fileSingleSizeLimit/(1024*1024)>1?_options.fileSingleSizeLimit/(1024*1024)+'M':_options.fileSingleSizeLimit/1024+'K';
            var filetotal=_options.fileSizeLimit/(1024*1024)>1?_options.fileSizeLimit/(1024*1024)+'M':_options.fileSizeLimit/1024+'K';
            switch (code) {
                case 'F_DUPLICATE': alert('文件已经在上传列表中，请勿重复添加！'); break;
                case 'F_EXCEED_SIZE':alert('文件大小超限,单个文件大小限制为'+filesingle+',总文件大小限制为'+filetotal+'！'); break;
                case 'Q_EXCEED_NUM_LIMIT': alert('文件数超限,最多上传'+_options.fileNumLimit+'个文件'); break;
                case 'Q_EXCEED_SIZE_LIMIT': alert('文件大小超限,单个文件大小限制为'+filesingle+',总文件大小限制为'+filetotal+'！'); break;
                case 'Q_TYPE_DENIED': alert('文件类型错误，请选择 '+_options.accept.extensions+' 类型的文件上传！'); break;
            }
            if (_options.uploadFailed) {
                _options.uploadfailed(code);
            }
        };

        uploader.on( 'beforeFileQueued', function( file ) {
            var flag = true;
            var count=$('.filelist').find('li').length;
            if (count >= _options.fileNumLimit && flag ) {
                flag = false;
                this.trigger( 'error', 'Q_EXCEED_NUM_LIMIT', _options.fileNumLimit, file );
                setTimeout(function() {
                    flag = true;
                }, 1 );
            }

            return count >= _options.fileNumLimit ? false : true;
        });
        //上传后台出错
        uploader.onUploadError = function (file, code) {
            //alert('');
            if (_options.uploadFailed) {
                _options.uploadFailed(code);
            }
        };

        /*uploader.onUploadAccept = function (object, ret) {
         alert('');
         if (_options.uploadFailed){
         _options.uploadFailed(ret);
         }
         };*/

        return new function () {
            this.getUploadFiles = function () {
                var uploadfiles = [];
                $queue.find('li.state-complete,li.state-exist').each(function () {
                    //uploadfiles.push({ 'data': $(this).data(), 'aType': $(this).attr("aType") });
                    uploadfiles.push($(this).data());
                });
                uploader.reset();
                return uploadfiles;
            },
            this.getExistFiles=function(){
                var existfiles=[];
                $queue.find('li.state-exist').each(function () {
                    //uploadfiles.push({ 'data': $(this).data(), 'aType': $(this).attr("aType") });
                    existfiles.push($(this).data());
                });
                return existfiles;
            },this.getNowUpFiles = function () {
                var uploadfiles = [];
                $queue.find('li.state-complete').each(function () {
                    //uploadfiles.push({ 'data': $(this).data(), 'aType': $(this).attr("aType") });
                    uploadfiles.push($(this).data());
                });
                uploader.reset();
                return uploadfiles;
            };
            this.uploaderReset=function(){
                $queue.hide().find('li').remove();
                uploader.reset();//$queue.remove();
            };
        }
    }

})