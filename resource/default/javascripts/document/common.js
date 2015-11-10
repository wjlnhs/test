define(function (require, exports, modules) {
    var ajaxHost = i8_session.ajaxHost;
    var fileuploader=require('../plugins/qiniu_uploader/qiniu_i8uploader');
    var fw_page=require('../common/fw_pagination.js');
    var i8ui = require('../common/i8ui');
    //require('../plugins/i8ztree/treestyle.css');
    var selector = require('../plugins/i8selector/fw_selector.js');
   // var fileViewer=require('../common/seefile');
    //var i8hash=require('../common/i8hash.js');
    var util=require('../common/util.js');
    var common = {
        ajax: {
            //获取“企业文档”第一级
            getCompanyFirsts: function (options, callback) {
                $.ajax({
                    url: ajaxHost + 'webajax/document/getCompanyFirsts',
                    type: 'get',
                    dataType: 'json',
                    cache:false,
                    data: {options: options},
                    success: function (data) {
                        if(data.Code!=0){
                            i8ui.error(data.Description);
                            console.log('获取“企业文档”第一级')
                        }else{
                            console.log(data)
                            callback && callback(data);
                        }
                    }, error: function (error) {
                        i8ui.error('请求超时!');
                    }
                });
            },
            //重命名
            renameDocTree: function (options, callback) {
                $.ajax({
                    url: ajaxHost + 'webajax/document/renameDocTree',
                    type: 'get',
                    dataType: 'json',
                    cache:false,
                    data: {options: options},
                    success: function (data) {
                        if(data.Code!=0){
                            i8ui.error(data.Description)
                            console.log('重命名')
                        }else{
                            callback && callback(data);
                        }
                    }, error: function (error) {
                        i8ui.error('请求超时!');
                    }
                });
            },
            //归档文件
            fileToDocTree:function(options, callback){
                options=encodeURIComponent(util.toJsonString(options));
                $.ajax({
                    url: ajaxHost + 'webajax/document/fileToDocTree',
                    type: 'post',
                    dataType: 'json',
                    cache:false,
                    data: {options: options},
                    success: function (data) {
                        if(data.Code!=0){
                            var errFileName='';
                            if(!$.isEmptyObject(data.ReturnObject) && data.ReturnObject.FailFileNames){
                                errFileName='('+data.ReturnObject.FailFileNames+')';
                            }
                            i8ui.error(data.Description+errFileName);
                            console.log('归档文件')
                        }else{
                            console.log(data)
                            callback && callback(data);
                        }
                        common.tool.resetConfirm();
                    },
                    error: function (error) {
                        common.tool.resetConfirm();
                        i8ui.error('请求超时!');
                    }
                });
            },
            //删除文件
            deleteDocTree: function (options, callback) {
                $.ajax({
                    url: ajaxHost + 'webajax/document/deleteDocTree',
                    type: 'get',
                    dataType: 'json',
                    cache:false,
                    data: {options: options},
                    success: function (data) {
                        if(data.Code!=0){
                            i8ui.error(data.Description)
                            console.log('删除')
                        }else{
                            callback && callback(data);
                        }
                    }, error: function (error) {
                        i8ui.error('请求超时!');
                    }
                });
            },
            getFolder:function(options, callback){
                $.ajax({
                    url: ajaxHost + 'webajax/document/getFolder',
                    type: 'get',
                    dataType: 'json',
                    cache:false,
                    data: {options: options},
                    success: function (data) {
                        if(data.Code!=0){
                            i8ui.error(data.Description)
                            console.log('获取文件夹')
                        }else{
                            callback && callback(data);
                        }
                    }, error: function (error) {
                        i8ui.error('请求超时!');
                    }
                });
            },
            //获取全部
            getDocTree: function (options, callback,errorcallback) {
                console.log(options)
                $.ajax({
                    url: ajaxHost + 'webajax/document/getDocTree',
                    type: 'get',
                    dataType: 'json',
                    cache:false,
                    data: {options: options},
                    success: function (data) {
                        if(data.Code!=0){
                            if(errorcallback){
                                errorcallback(data)
                            }else{
                                i8ui.error(data.Description);
                                console.log('获取全部')
                            }
                            console.log(data)
                        }else{
                            console.log(data)
                            callback && callback(data);
                        }
                    }, error: function (error) {
                        i8ui.error('请求超时!');
                    }
                });
            },
            //根据父级文件夹ID等条件，获取“企业文档”(获取我的文档)
            getCompanyDTsByParentID: function (options, callback,errorcallback) {
                var _url='getCompanyDTsByParentID';
                if(!options.isCompany){
                    _url='GetMyDocs'
                }
                $.ajax({
                    url: ajaxHost + 'webajax/document/'+_url,
                    type: 'get',
                    dataType: 'json',
                    cache:false,
                    data: {options: options},
                    success: function (data) {
                        if(data.Code!=0){
                            if(errorcallback){
                                errorcallback(data)
                            }else{
                                i8ui.error(data.Description)
                                console.log('根据父级文件夹ID等条件，获取“企业文档”');
                            }
                            console.log(data)
                        }else{
                            console.log(data)
                            callback && callback(data);
                        }
                    }, error: function (error) {
                        i8ui.error('请求超时!');
                    }
                });
            },
            // 获取整个“企业文档”文件夹树
            getCompanyFolderTrees: function (options, callback) {
                $.ajax({
                    url: ajaxHost + 'webajax/document/getCompanyFolderTrees',
                    type: 'post',
                    dataType: 'json',
                    cache:false,
                    data: {options: options},
                    success: function (data) {
                        if(data.Code!=0){
                            i8ui.error(data.Description)
                            console.log('获取整个“企业文档”文件夹树')
                        }else{
                            console.log(data)
                            callback && callback(data);
                        }
                    }, error: function (error) {
                        i8ui.error('请求超时!');
                    }
                });
            },
            //获取版本
            getFileVersions:function(options, callback){
                $.ajax({
                    url: ajaxHost + 'webajax/document/getFileVersions',
                    type: 'get',
                    dataType: 'json',
                    cache:false,
                    data: {options: options},
                    success: function (data) {
                        if(data.Code!=0){
                            i8ui.error(data.Description)
                            console.log('获取版本')
                        }else{
                            console.log(data)
                            callback && callback(data);
                        }
                    }, error: function (error) {
                        i8ui.error('请求超时!');
                    }
                });
            },
            //删除版本
            deleteFileVersion:function(options, callback){
                $.ajax({
                    url: ajaxHost + 'webajax/document/deleteFileVersion',
                    type: 'post',
                    dataType: 'json',
                    cache:false,
                    data: {options: options},
                    success: function (data) {
                        if(data.Code!=0){
                            console.log(data.Code)
                            i8ui.error(data.Description)
                            console.log('删除版本')
                        }else{
                            console.log(data)
                            callback && callback(data);
                        }
                    }, error: function (error) {
                        i8ui.error('请求超时!');
                    }
                });
            },
            addFileVersion:function(options, callback){
                console.log(options)
                common.ajax.toqinniu(options.file,function(data){
                    console.log(data)
                    var _file=data.ReturnObject[0];
                    options.file= _file;
                    options.file.DocID=_file.ID;
                    options.docTreeID=i8_session.docTreeID;
                    options.newName= $.trim($('.file-name').val());
                    options.Name= $.trim($('.file-name').val());
                    $.ajax({
                        url: ajaxHost + 'webajax/document/addFileVersion',
                        type: 'post',
                        dataType: 'json',
                        cache:false,
                        data: {options: options},
                        success: function (data) {
                            if(data.Code!=0){
                                i8ui.error(data.Description)
                                console.log('上传新版本')
                                common.tool.resetConfirm()
                            }else{
                                console.log(data)
                                callback && callback(data);
                                common.tool.resetConfirm()
                            }
                        }, error: function (error) {
                            i8ui.error('请求超时!');
                            common.tool.resetConfirm()
                        }
                    });
                })
            },
            //纯保存文件
            onlySaveDocTree:function(options, callback){
                options=encodeURIComponent(util.toJsonString(options));
                $.ajax({
                    url: ajaxHost + 'webajax/document/saveDocTree',
                    type: 'post',
                    dataType: 'json',
                    cache:false,
                    data: {options: options},
                    success: function (data) {
                        if(data.Code!=0){
                            var errFileName='';
                            if(!$.isEmptyObject(data.ReturnObject) && data.ReturnObject.FailFileNames){
                                errFileName='('+data.ReturnObject.FailFileNames+')';
                            }
                            i8ui.error(data.Description+errFileName);
                            console.log('保存文件')
                        }else{
                            console.log(data)
                            callback && callback(data);
                        }
                        common.tool.resetConfirm();
                    }, error: function (error) {
                        common.tool.resetConfirm();
                        i8ui.error('请求超时!');
                    }
                });
            },
            //纯批量保存
            onlyAddDocTrees:function(options, callback){
                options=encodeURIComponent(util.toJsonString(options));
                $.ajax({
                    url: ajaxHost + 'webajax/document/addDocTrees',
                    type: 'post',
                    dataType: 'json',
                    cache:false,
                    data: {options: options},
                    success: function (data) {
                        if(data.Code!=0){
                            var errFileName='';
                            if(!$.isEmptyObject(data.ReturnObject) && data.ReturnObject.FailFileNames){
                                errFileName='('+data.ReturnObject.FailFileNames+')';
                            }
                            i8ui.error(data.Description+errFileName);
                            console.log('纯批量保存')
                        }else{
                            console.log(data)
                            callback && callback(data);
                        }
                        common.tool.resetConfirm();
                    }, error: function (error) {
                        i8ui.error('请求超时!');
                        common.tool.resetConfirm();
                    }
                });
            },
            // 保存文件
            saveDocTree: function (options, callback) {
                common.ajax.toqinniu(options.fls,function(data){
                    console.log(data);
                    var _file=data.ReturnObject;
                    for(var i=0;i<_file.length;i++){
                        _file[i].DocID=_file[i].ID;
                        console.log( _file[i].FileName)
                        //_file[i].Name=$('.edit-file-item').eq(0).find('input').val();
                        _file[i].Name=_file[i].FileName;
                    }
                    options.files= _file;
                    //options.file.DocID=options.file.ID;
                    //options.docTree.Name=$.trim($('.file-name').val());
                    options.FileName= $.trim($('.file-name').val())
                    common.ajax.onlySaveDocTree(options, callback);
                })

            },
            // 批量保存文件
            addDocTrees: function (options, callback) {
                common.ajax.toqinniu(options.fls,function(data){
                    console.log(data);
                    var _file=data.ReturnObject;

                    for(var i=0;i<_file.length;i++){
                        _file[i].DocID=_file[i].ID;
                        console.log( _file[i].FileName)
                        //_file[i].Name=$('.edit-file-item').eq(0).find('input').val();
                        var _FileName=_file[i].FileName;
                        var _ext=_file[i].Extension ? '.'+_file[i].Extension : _FileName.substr(_FileName.lastIndexOf('.'));
                        var _FileNameName=_FileName.substr(0,_FileName.lastIndexOf('.')).substr(0,30);
                        _file[i].Name=_FileNameName+_ext;
                        _file[i].FileName=_FileNameName+_ext;
                        //开始绑定上传完的
                        var $itemLi=$('[uuid='+_file[i].ID+']');
                        _file[i].FilePath=_file[i].FilePath || $itemLi.attr('filepath');
                        $itemLi.attr('filepath',_file[i].FilePath);
                        //结束绑定上传完的
                    }
                    options.files= _file;

                    //options.file.DocID=options.file.ID;
                    //options.docTree.Name=$.trim($('.file-name').val());
                    //options.FileName= $.trim($('.file-name').val())
                    common.ajax.onlyAddDocTrees(options, callback);
                })

            },
            //获取文档设置树
            getDocSetTree:function(options, callback){
                $.ajax({
                    url: ajaxHost + 'webajax/document/getDocSetTree',
                    type: 'post',
                    dataType: 'json',
                    cache:false,
                    data: {options: options},
                    success: function (data) {
                        if(data.Code!=0){
                            i8ui.error(data.Description)
                            console.log('获取文档设置树')
                        }else{
                            callback && callback(data);
                        }
                    }, error: function (error) {
                        i8ui.error('请求超时!')
                        //console.log('请求超时!');
                    }
                });
            },
            //保存自定义文件
            saveQuickFinder:function(options, callback){
                $.ajax({
                    url: ajaxHost + 'webajax/document/saveQuickFinder',
                    type: 'post',
                    dataType: 'json',
                    cache:false,
                    data: {options: options},
                    success: function (data) {
                        if(data.Code!=0){
                            i8ui.error(data.Description)
                            console.log('保存自定义文件')
                        }else{
                            callback && callback(data);
                        }
                    }, error: function (error) {
                        i8ui.error('请求超时!')
                        console.log(error);
                    }
                });
            },
            //删除自定义文件
            deleteQuickFinder:function(options, callback){
                $.ajax({
                    url: ajaxHost + 'webajax/document/deleteQuickFinder',
                    type: 'post',
                    dataType: 'json',
                    cache:false,
                    data: {options: options},
                    success: function (data) {
                        if(data.Code!=0){
                            i8ui.error(data.Description)
                            console.log('删除自定义文件')
                        }else{
                            callback && callback(data);
                        }
                    }, error: function (error) {
                        i8ui.error('请求超时!')
                        console.log(error);
                    }
                });
            },
            //获取自定义文件
            getQuickFinderPage:function(options, callback){
                $.ajax({
                    url: ajaxHost + 'webajax/document/getQuickFinderPage',
                    type: 'post',
                    dataType: 'json',
                    cache:false,
                    data: {options: options},
                    success: function (data) {
                        if(data.Code!=0){
                            i8ui.error(data.Description)
                            console.log('获取自定义文件')
                        }else{
                            callback && callback(data);
                        }
                    }, error: function (error) {
                        i8ui.error('请求超时!')
                        console.log(error);
                    }
                });
            },
            //搜索文件
            getSearchList:function(options, callback){
                $.ajax({
                    url: ajaxHost + 'webajax/document/getSearchList',
                    type: 'post',
                    dataType: 'json',
                    cache:false,
                    data: {options: options},
                    success: function (data) {
                        if(data.Code!=0){
                            i8ui.error(data.Description);
                            console.log(data.Description+'(搜索文件)');
                        }else{
                            callback && callback(data);
                        }
                    }, error: function (error) {
                        i8ui.error('请求超时!')
                        console.log(error);
                    }
                });
            }
            //上传到七牛
            ,toqinniu: function (file, callback) {
                $.ajax({
                    url: ajaxHost + 'webajax/document/upqiniu',
                    type: 'get',
                    dataType: 'json',
                    cache:false,
                    data: {attachment: file},
                    success: function (result) {
                        if(result.Code!=0){
                            i8ui.error(result.Description);
                            console.log(' (上传到七牛)')
                            common.tool.resetConfirm();
                        }else{
                            callback && callback(result);
                        }
                    },
                    error: function (e1, e2, e3) {
                        callback(e1)
                        common.tool.resetConfirm();
                    }
                });
            }
            ,up: function (options,cbks) {
                //文件上传按钮
                var options = {'button':'update_document_btn',//按钮ID
                    'fileContainerId':'upload_hide_ul',//装文件容器
                    'btnContainerId':'update_document',//按钮ID容器
                    'attachmentlist':options.attachmentlist || [],
                    'tokenUrl':'/platform/uptoken',
                    'maxFiles':options.maxFiles || 5,
                    'flashUrl':'/default/javascripts/plugins/qiniu_uploader/plupload/Moxie.swf',
                    'fileUploaded':function(file,up,info){
                        cbks.uploadSuccessCbk && cbks.uploadSuccessCbk(info);
                        var _info= $.parseJSON(info);
                        var _ext=_info.key.substr(_info.key.lastIndexOf('.')+1).toLocaleLowerCase();
                        $('#'+up.id).find('.progressName').html('<i class="file-icon-'+_ext+' lt"></i>');
                    },
                    'beforeUpload': function (up, file){
                        var uploader= myupload.doc_uploader.getUploader();
                        cbks.uploadStartedCbk && cbks.uploadStartedCbk(up, file);
                    },
                    'uploadProgress':function(up){
                        //$('#'+up.id+'percent').text(up.percent+'%');
                        //console.log(up)
                        //console.log(8888)
                    },
                    'filesAdded':function(up,files){

                    }
                };

                //<a class="btn-yellow-h36 m-r10 rt" id="update_document"><i class="icon icon-upload-big "></i>&nbsp;上传文档&nbsp;</a>
                //console.log(upfileContor);
                return fileuploader.i8uploader(options);//调用上传插件
            }
            ,up2: function (options,cbks) {
                //文件上传按钮
                var options = {'button':'reupload_btn',//按钮ID
                    'fileContainerId':'upload_hide_ul2',//装文件容器
                    'btnContainerId':'reupload',//按钮ID容器
                    'attachmentlist':options.attachmentlist || [],
                    'tokenUrl':'/platform/uptoken',
                    'flashUrl':'/default/javascripts/plugins/qiniu_uploader/plupload/Moxie.swf',
                    'maxFiles':999999999999,
                    'fileUploaded':function(file,up,info){
                        cbks.uploadSuccessCbk && cbks.uploadSuccessCbk(info);
                        var _info= $.parseJSON(info);
                        var _ext=_info.key.substr(_info.key.lastIndexOf('.')+1).toLocaleLowerCase();
                        $('#'+up.id).find('.progressName').html('<i class="file-icon-'+_ext+' lt"></i>');
                    },
                    'beforeUpload': function (up, file){
                        cbks.uploadStartedCbk && cbks.uploadStartedCbk(up, file);
                    },
                    'uploadProgress':function(up){

                        //$('#'+up.id+'percent').text(up.percent+'%');
                        //console.log(up)
                        //console.log(8888)
                    },
                    'filesAdded':function(up,files){
                        uploader2.stop();
                        var liLength=parseInt($('#upload_hide_ul li').length);
                        if(liLength+parseInt(files.length)>5){
                            i8ui.error('超过最大上传个数5个的限制')
                            //return false;
                        }else{
                            for(var i=0;i<files.length;i++){
                                uploader.addFile(files[i].getNative() || files[i].getSource())
                            }
                        }
                        //uploader.addFile(up.getNative());
                        uploader.start();
                        //myupload.doc_uploader2.uploaderReset()
                        //$('#'+up.id).find('.cancel').trigger('click')
                        //uploader2.removeFile(up.id);
                    }
                };

                //<a class="btn-yellow-h36 m-r10 rt" id="update_document"><i class="icon icon-upload-big "></i>&nbsp;上传文档&nbsp;</a>
                //console.log(upfileContor);
                return fileuploader.i8uploader(options);//调用上传插件
            }
        },
        tool:{
            //重置提交按钮
            resetConfirm:function(){
                var $confirm=$('.btn-gray96x32.confirm');
                $confirm.removeClass('btn-gray96x32');
                $confirm.addClass('btn-blue96x32');
                $confirm.text($confirm.attr('oldtxt'));
            },
            //禁用提交按钮
            setUnableConfirm:function($confirmBtn){
                if($confirmBtn.hasClass('btn-gray96x32')){
                    return false;
                }else{
                    $confirmBtn.addClass('btn-gray96x32');
                    $confirmBtn.removeClass('btn-blue96x32');
                    $confirmBtn.attr('oldtxt',$confirmBtn.text());
                    $confirmBtn.text('提交中...');
                }
            },
            set_dielog_cbk:function(dielogobj,confirmCbk,cancelCbk){
                $(dielogobj).find('.cancel').on('click',function(){
                    cancelCbk && cancelCbk();
                    dielogobj.close();
                })
                $(dielogobj).find('.confirm').on('click',function(){
                    var $this=$(this);
                    clearTimeout(timer);
                    var timer=setTimeout(function(){
                        $this.removeClass('subing');
                    },2000)
                    if($this.hasClass('subing')){
                        return;
                        //$this.removeClass('subing');
                    }
                    $this.addClass('subing');
                    confirmCbk && confirmCbk();
                    //dielogobj.close();
                })
            }
            ,ableSelector:function($parent){
                //$parent.toggleClass('stopedit')
                $parent.find(".fw_sboxer").show();
                $parent.find('.fw_ksntxtbox').css("border", "solid 1px #E2E5E7");
                $parent.find("input").focus();
                $parent.removeClass('stoping');
            }
            ,unableSelector:function($parent){
                $parent.addClass('stoping');
                $parent.find(".fw_sboxer").hide();
                $parent.removeClass('isnew');
            }
            ,stopSelector:function($parent){
                console.log($parent)
                $parent.addClass('stopedit')
                $parent.find(".fw_sboxer").hide();
                $parent.removeClass('editing');
            }
            ,renderTime:function(date,formatStr){
                return new Date(date.replace(/\-/g,'/')).format(formatStr)
            }
            ,getFileCreatTime:function(Type,CreateTime,LastUpdateTime){
                var result="";
                if(Type==0){
                    result=common.tool.renderTime(CreateTime,'yyyy年MM月dd日 hh:mm')
                }else{
                    result=common.tool.renderTime(LastUpdateTime,'yyyy年MM月dd日 hh:mm')
                }
                return result;
            },
            transTypeEn:function(type){
                var _type='';
                switch (type){
                    case 0:
                        _type='user'
                        break;
                    case 1:
                        _type='grp'
                        break;
                    case 2:
                        _type='org'
                        break;
                }
                return _type;
            },
            transTypeCn:function(type){
                var _type='';
                switch (type){
                    case 0:
                        _type=''
                        break;
                    case 1:
                        _type='[群组]'
                        break;
                    case 2:
                        _type='[组织]'
                        break;
                }
                return _type;
            },
            transPmtFolder:function(Pmt){
                var _Pmt='';
                switch (Pmt){
                    case 1:
                        _Pmt='只读'
                        break;
                    case 2:
                        _Pmt='上传'
                        break;
                    case 4:
                        _Pmt='管理'
                        break;
                }
                return _Pmt;
            },
            transPmtFile:function(Pmt){
                var _Pmt='';
                switch (Pmt){
                    case 1:
                        _Pmt='只读'
                        break;
                    case 2:
                        _Pmt='下载'
                        break;
                    case 4:
                        _Pmt='完全控制'
                        break;
                }
                return _Pmt;
            },
            resetTreeData :function(_data){
                if(!_data){
                    //i8ui.error('您一个文件夹上传权限也没有~');
                }
                for(var i=0;i<_data.length;i++){
                    if(i==0){
                        _data[0].open=true;
                    }
                    _data[i].iconSkin='flod';
                    if(_data[i].IsPermission){
                        _data[i].chkDisabled=false;
                    }else{
                        _data[i].chkDisabled=true;
                        _data[i].color='#D0D0D0';
                        _data[i].iconSkin='nopermission'
                    }
                }
                return _data;
            },
            addFolderTree:function(treeBoxId,autoshow,type,clickcbk){
                /*if(i8_session.appadmin.join('').indexOf('app_document')<0){
                    includeRoot=false;
                }*/
                if(autoshow){
                    $('#'+treeBoxId).css('visibility','visible');
                }else{
                    $('#'+treeBoxId).hide();
                }
                var ztree={};
                common.ajax.getDocSetTree({isFirst:true,type:type},function(data){
                    console.log(data)
                    function setFontCss(treeId, treeNode) {
                        return treeNode.chkDisabled ? {color:"#D0D0D0"} : {};
                    };
                    function ajaxDataFilter(treeId, parentNode, responseData) {
                        responseData=responseData.ReturnObject;
                        responseData=common.tool.resetTreeData(responseData)
                        return responseData;
                    };
                    var setting = {
                        view: {
                            showIcon: true,
                            showLine:false,
                            fontCss:setFontCss
                        },
                        async: {
                            enable: true,
                            type: "post",
                            url: ajaxHost + 'webajax/document/getDocSetTree',
                            autoParam: ["DocTreeID=docTreeID"],
                            otherParam:{isFirst:false,type:type},
                            dataFilter: ajaxDataFilter
                        },
                        data: {
                            simpleData: {
                                enable: true,
                                idKey: "DocTreeID",
                                pIdKey: "ParentID",
                                rootPId: 1
                            },
                            key: {
                                title: "Name",
                                name: "Name"
                            },
                            keep: {
                                parent:true
                            }
                        },
                        callback: {
                            onClick: function (event, treeId, treeNode) {
                                clickcbk && clickcbk(event, treeId, treeNode)
                            }
                            ,beforeClick:function(treeId, treeNode, clickFlag){
                                if(treeNode.chkDisabled){
                                    i8ui.error('对不起你无权操作此文件夹！');
                                    //ztree.cancelSelectedNode(treeId);
                                    return false;
                                }
                            }
                        }
                    };
                    var _data=data.ReturnObject;
                    _data=common.tool.resetTreeData(_data);
                    $.fn.zTree.init($('#'+treeBoxId), setting, data.ReturnObject);
                    if(data.ReturnObject && data.ReturnObject.length==0){
                        $('#document_tree').html('<div class="red">您没有可存储的文件夹</div>');
                       // return;
                    }
                    var ztree=$.fn.zTree.getZTreeObj(treeBoxId);
                    if(treeBoxId=='admin_tree' && !admin_ztree){
                        window.admin_ztree=$.fn.zTree.getZTreeObj(treeBoxId);
                        $(".doc-set-cont-left").mCustomScrollbar({
                            theme: "minimal-dark" ,
                            axis:"yx",
                            autoExpandScrollbar:true,
                            advanced:{
                                autoExpandHorizontalScroll:true,
                                autoScrollOnFocus:true
                            }
                        });
                    }
                })
                return ztree;
            },
            addFolderTreeAdmin:function(clickcbk,type){
                var type=type || 1;
                common.tool.addFolderTree("admin_tree",true,type,clickcbk)
            },
            addFolderTreeAdminSel:function(dielog,clickcbk,type){
                var type=type || 1;
                common.tool.addFolderTree('document_tree',false,type,clickcbk);
                //显示隐藏树
                $('#document_tree').click(function(ev){
                    ev.stopPropagation();
                })
                $(dielog).find('.save_position').click(function(ev){
                   $('#document_tree').stop().slideToggle(80).css('visibility','visible');
                    ev.stopPropagation();
                })
                $(dielog).find('.save_position').next().click(function(ev){
                    $('#document_tree').stop().slideToggle(80).css('visibility','visible');
                    ev.stopPropagation();
                })
                $(dielog).on('click',function(){
                    $('#document_tree').stop().slideUp(80);
                })
                //帮助按钮
                $('.admin-help, .user-powerhelp').hover(function(){
                    $(this).next().show();
                },function(){
                    $(this).next().hide();
                })
            }
            ,getScopes:function(dielog,isnew,isFile){
                //isnew ,'true',如果'isNewFile'//新建文件的时候不判断管理员空的情况
                var Scopes=[];
                function transType(type){
                    var _type=0;
                    switch(type){
                        case 'user':
                            _type=0;
                            break;
                        case 'grp':
                            _type=1;
                            break;
                        case 'org':
                            _type=2;
                            break;
                    }
                    return _type;
                }
                function transPmt(txt){
                    var pmt=0;
                    switch(txt){
                        case '只读':
                            pmt=1;
                            break;
                        case '上传':
                            pmt=2;
                            break;
                        case '下载':
                            pmt=2;
                            break;
                        case '完全控制':
                            pmt=4;
                            break;
                        case '管理':
                            pmt=4;
                            break;
                    }
                    return pmt;
                }
                var Scopes=[];
                var newAdmins={};//新增管理员
                var parentAdmins={};//父级管理员
                var otherPowers={};//其他用户权限;
                //设置parentAdmins
                var treeNode=$(dielog).data();
                var parentScopeEntitys={}//父级管理员权限
                var _ParentAdmin=$(dielog).find('.folder_admin_box').data();
                var _ParentAdminIds=_.keys(_ParentAdmin);
                for(var i in _ParentAdmin){
                    parentScopeEntitys[i]=0
                }
                if((!$.isEmptyObject(parentScopeEntitys) || !$.isEmptyObject(treeNode.DocTreeAdmin))  && !isFile){
                    parentAdmins.Pmt=4;
                    parentAdmins.PmtStatus=0;
                    parentAdmins.ScopeEntitys=parentScopeEntitys;
                    Scopes.push(parentAdmins)
                }
                //遍历新增管理员;
                if($(dielog).find('#folder_admin').length){
                    //管理员
                    var scopeEntitys={};
                    $('.folder_admin_box .fw_ksninput_slted').each(function(item){
                        var $this=$(this);
                        var _key=$this.attr('data-uid');
                        var _val=transType($this.attr('user'));
                        if(_.indexOf(_ParentAdminIds,_key)==-1){
                            scopeEntitys[_key]=_val;
                        }
                    })
                    newAdmins.Pmt=4;
                    newAdmins.PmtStatus=2;
                    newAdmins.ScopeEntitys=scopeEntitys;
                    if($('.folder_admin_box .fw_ksninput_slted').length>0){
                        Scopes.push(newAdmins)
                    }
                }
                if(!isnew && $.isEmptyObject(parentAdmins) && $.isEmptyObject(newAdmins.ScopeEntitys)){
                    i8ui.error('管理员不能为空!');
                    return false;
                }
                //遍历上级权限；
                $(dielog).find('.parent_power_item').each(function(index){
                    var $this=$(this);
                    var parentPower=$this.data();
                    if($this.find('.app-checkbox').hasClass('checked')){
                        parentPower.PmtStatus=0;
                    }else{
                        parentPower.PmtStatus=1;
                    }
                    var _val=$this.find('.newselectcked').text();
                    var Pmt=0;
                    parentPower.Pmt=transPmt(_val);
                    //筛选打勾的
                   // if(parentPower.PmtStatus==0){
                        Scopes.push(parentPower);
                    //}
                })
                //遍历其他权限；
                $(dielog).find('.user-power li').each(function(){
                    var $parent=$(this);
                    if($parent.find('.fw_ksninput_slted').length==0){
                        return false;
                    }
                    var otherPower={};
                    var scopeEntitys={};
                    var viewScopeEntitys=[];
                    $parent.find('.fw_ksninput_slted').each(function(){
                        var $this=$(this);
                        var _key=$this.attr('data-uid');
                        var _val=transType($this.attr('data-type'));
                        scopeEntitys[_key]=_val;
                        viewScopeEntitys.push({
                            EntityID:_key,
                            EntityName: $this.text(),
                            EntityType:_val
                        })
                    })
                    var pmtTxt=$parent.find('.newselectcked').text();
                    otherPower.Pmt=transPmt(pmtTxt);
                    otherPower.PmtStatus=2;
                    otherPower.ScopeEntitys=scopeEntitys;
                    otherPower.ViewScopeEntitys=viewScopeEntitys;
                    Scopes.push(otherPower)
                })
                //otherPowers
                console.log(Scopes)
                return Scopes;
            }
        }
        ,page:{
            //根据id渲染整个文档
            renderPgaeByDocId:function(panl,doc_id,idpath,idname,folderName,renderBread){
                panl.pageIndex=1;
                //如果直接传对象
                if($.isPlainObject(doc_id)){
                    idpath=doc_id.IDPath;
                    idname=doc_id.IDPathName;
                    folderName=doc_id.Name;
                    panl.doc_id=doc_id.DocTreeID;
                }else{
                    panl.doc_id= doc_id;
                }
                window.location.hash='#'+panl.doc_id;
                common.page.render_doc_center(panl);
                if(renderBread){
                    common.page.render_bread(idpath,idname,folderName);
                }else{
                    $('#bread_cutting').html(' > <span class="current">'+folderName+'</span>');
                }
                common.page.set_left_active(idpath);
            },
            //添加一条选人控件和下拉
            addPowerItem:function(powerbox,opts){
                //要返回的对象
                var obj={};
                var opts=opts || '<option>只读</option><option>上传</option>';//选项
                var add_power_tpl=require('../../template/document/add_power_item.tpl');
                $(powerbox).find('.icon-blue-add').addClass('icon-yellow-remove').removeClass('icon-blue-add');
                $(powerbox).append(add_power_tpl);
                $(powerbox).find('.power-input').each(function(index,item){
                    //$(item).removeClass('willload');
                    var _input=$(item);
                    if(_input.attr('id')){
                        return;
                    }else{
                        _input.attr('id','power-d'+powerIndex);
                        obj.input=selector.KSNSelector({
                            model:2,width:280,element: '#power-d'+powerIndex,
                            searchType: { "org": true, "user": true, "grp": false },
                            selectCallback: function (uid, uname, uemail,utype,obj) {
                            }
                            //loadItem:{items:$('#participants').attr('participants_ids').split(',')}
                        });
                        //添加排序
                        $(powerbox).find('.notinnt').removeClass('.notinnt').attr('id','power-s'+powerIndex).append(opts).setSelect({
                            newi8select:'newi8-select',
                            dropstyle: 'newselecti',
                            ckedstyle: 'newselectcked',
                            style:"  line-height: 40px;height: 34px!important;width: 150px;float: left;margin-left: 13px;display: block;"
                        })
                        obj.sel=$('#power-s'+powerIndex);
                        powerIndex++;
                    }
                })
                $(powerbox).find('.power-input').last().trigger('focus');
                return obj;
            }
            //用于渲染dielog中的权限部分
            ,render_power_table:function(power_dielog,treeNode){
                var parentScopes=treeNode.Scopes;
                //上级管理员数组
                var parentAdminArr=treeNode.parentAdminArr=_.filter(parentScopes,function(parentScopes){
                    return parentScopes.Pmt==4 && parentScopes.PmtStatus!=2
                });
                //新增管理员数组
                var newAdminArr=treeNode.newAdminArr=_.filter(parentScopes,function(parentScopes){
                    return parentScopes.Pmt==4 && parentScopes.PmtStatus==2
                });
                //上级文件夹权限数组
                var parentPowerArr=treeNode.parentPowerArr=_.filter(parentScopes,function(parentScopes){
                    return parentScopes.Pmt!=4 && parentScopes.PmtStatus!=2
                });
                //其他用户权限数组
                var otherPowerArr=treeNode.otherPowerArr=_.filter(parentScopes,function(parentScopes){
                    return parentScopes.Pmt!=4 && parentScopes.PmtStatus==2
                });
                //父级权限盒子
                var parent_scope=$(power_dielog).find('.parent-scope');
                //其他权限盒子
                var other_scope=$(power_dielog).find('.cu-scope');
                //按照权限条数渲染tr条数加载人员
                $(otherPowerArr).each(function(index){
                    var power_item_tpl=require('../../template/document/add_power_item.tpl');
                    other_scope.find('.icon-blue-add').addClass('icon-yellow-remove').removeClass('icon-blue-add');
                    other_scope.append(add_power_tpl);
                    //var power_item_render=template(power_item_tpl);
                    //table插入行
                    other_scope.append(power_item_tpl);
                    var _Scopes=otherPowerArr[index];
                    var _ScopeEntitys=_Scopes.ScopeEntitys;
                    var ids=[];
                    for(var i in _ScopeEntitys){
                        var _type='user';
                        switch (_ScopeEntitys[i]){
                            case 0:
                                _type='user'
                                    break;
                            case 1:
                                _type='grp'
                                break;
                            case 2:
                                _type='org'
                                break;
                        }
                        ids.push({"type":_type,"id":i,ureadonly:false});
                    }
                    //
                    switch (_Scopes.Pmt){
                        case 1:
                            tr.find('.app-checkbox').eq(0).addClass('checked');
                            break;
                        case 3:
                            tr.find('.app-checkbox').eq(0).addClass('checked');
                            tr.find('.app-checkbox').eq(1).addClass('checked');
                            break;
                        case 4:
                            tr.find('.app-checkbox').eq(2).addClass('checked');
                            break;
                        case 5:
                            tr.find('.app-checkbox').eq(0).addClass('checked');
                            tr.find('.app-checkbox').eq(2).addClass('checked');
                            break;
                        case 7:
                            tr.find('.app-checkbox').addClass('checked');
                            break;
                    }
                    var obj=common.page.addPowerItem($(power_dielog).find('.user-power'));
                    obj.input.setAllselectedData(ids);
                })
            }
            //修改按钮(文件)
            ,btn_edit_ev_file:function(confirmCbk,cancelCbk,data,dielog,isInDetailPage){//isInDetailPage不跳转到修改的文件夹
                var power_dielog=common.page.setDielog('editFile','修改文件',data,dielog,isInDetailPage);
                $(power_dielog).find('dt').eq(2).hide();
                $(power_dielog).find('dd').eq(2).hide();
                $(power_dielog).find('.confirm').eq(0).text('确定');
                $(power_dielog).find('.btn-yellow-h36').parent().hide();
                $(power_dielog).find('.to-kk').hide();
                common.tool.set_dielog_cbk(power_dielog,function(){
                    var $dielog=$(power_dielog)
                    if(!$.trim($('.foldername').val())){
                        i8ui.error('主题不能为空',$('.foldername'));
                        return;
                    }
                    var Scopes=common.tool.getScopes(power_dielog,true,true);//true表示新建或者跳过名字验证(第二个true表示修改文件不获取管理员)
                    if(!Scopes){
                        return false;
                    }
                    var docTree=data;
                    docTree.Scopes=Scopes;
                    docTree.ParentID=$(power_dielog).find('.save_position').attr('docid');
                    docTree.Name=$.trim($('.foldername').val());
                    if(!isInDetailPage){
                        panl.doc_id=docTree.ParentID;
                    }
                    //设置
                    var options={
                        docTree:docTree
                    };
                    options.docTree=$.extend(data,options.docTree,true);
                    //禁止重复提交
                    var $confirm= $($dielog).find('.confirm');
                    if(common.tool.setUnableConfirm($confirm)!=undefined){
                        return false;
                    }
                    common.ajax.onlySaveDocTree(options,function(){
                        power_dielog.close();
                        i8ui.write('修改成功!');
                        if(!isInDetailPage){
                            common.page.render_doc_center(panl);
                            common.page.set_left_active(docTree.IDPath);//更新左边导航高亮
                        }
                    });
                })
                //common.tool.longadd_btn_init(power_dielog);
            }
            //左边重命名按钮
            ,left_rename_btn:function(parent){
                parent.find('input').addClass('editing').removeAttr('disabled').focus().select();
            }
            //中间重命名按钮
            ,center_rename_btn:function(parent_dt){
                parent_dt.addClass('editing');
                parent_dt.find('input').focus().select();
            }
            //左边重命名失去焦点按钮
            ,rename_btn_blur:function(input,cbk){
                input.attr('disabled','disabled').removeClass('editing');
                cbk && cbk();
                //parent.find('input').addClass('editing').removeAttr('disabled');
            }
            //中间重命名失去焦点按钮
            ,center_rename_btn_blur:function(parent,cbk){
                parent.removeClass('.editing');
                cbk && cbk();
                //parent.find('input').addClass('editing').removeAttr('disabled');
            }
            //上传编辑的时候失去焦点事件
            ,upload_rename_btn_blur:function($parent){
                _input=$parent.find('input'),
                    _inputspan= $parent.find('.inputspan'),
                    _val= $.trim(_input.val()),
                    _ext=$parent.attr('ext');
                if(!_val){
                    i8ui.error('文件名不能为空!',$parent);
                    _input.focus();
                    return;
                }
                $parent.removeClass('editing');
                if(_val.indexOf('.'+_ext)<0){
                    _val+='.'+_ext;
                }
                _input.val(_val);
                _inputspan.text(_val);
            }
            ,set_left_active:function(IDPath){
                //处理直接是id还是idpath
                $('.doc-left-nav.isnav').removeClass('active');
                var pathArr=IDPath.split('/');
                if(pathArr.length>1){
                    var curId=pathArr[1];
                }else{
                    var curId=IDPath;
                }
                var $leftNav=$('.doc-left-ul').find('[docid='+curId+']');
                if($leftNav.length>0){
                    $('.doc-left-ul').find('.active').removeClass('active');
                    $leftNav.addClass('active');
                }
            }
            ,render_doc_left:function(){
                common.ajax.getCompanyFirsts({},function(data){
                    if(data.Code){
                        common.page.render_no_data('.folder-body',data.Description);
                    }else{
                        $('.doc-left-ul').find('li').each(function(index){
                            var $btnPower=$(this).find('.btn-power');
                            $(this).find('.doc-item').data(data.ReturnObject[index]);
                            $btnPower.data(data.ReturnObject[index]);
                            $(this).parents('ul').eq(0).find('.btn-move').data(data.ReturnObject[index]);
                        })
                    }
                })
            }
            ,innt_render_doc_center:function(panl){
                $('#document').show();
                $('#picture').show();
                $('#other').show();
                $('#new_file').show();
                $('#my_doc_nav').text('企业文档');
                if(window.location.hash && window.location.hash!='#'){
                    var docTreeID=window.location.hash.split('#')[1];
                    panl.isCompany=true;
                    common.ajax.getDocTree({docTreeID:docTreeID},function(data){
                        $('.doc-left-ul>li').removeClass('active');
                        $('[docid='+data.ReturnObject.DocTree.IDPath.split('/')[1]+']').addClass('active');
                        if(!(data.ReturnObject.DocTree.IsAuthorizePmt || data.ReturnObject.DocTree.IsEditPmt)){
                            $('#update_document').hide();
                        }else{
                            $('#update_document').show();
                        }
                        common.page.renderPgaeByDocId(panl,data.ReturnObject.DocTree);
                        $('#new_file').data(data)
                    },function(data){
                        if(data.Code==5003){
                            var nopower_tpl=require('../../template/task/error_role.tpl')
                            $('.folder-body').html(nopower_tpl);
                            $("#js_cement_page_panl").html("");
                        }else if(data.Code==5001 || data.Code==5005){
                            common.page.render_no_exist('.folder-body')
                        }
                    })
                    //common.page.renderPgaeByDocId(panl)
                }else{
                    var $firstDoc=$('.doc-left-ul li').eq(0);
                    if($firstDoc.length==1){
                       // $firstDoc.addClass('active');
                        $firstDoc.find('.doc-item').trigger('click')
                        //panl.doc_id=$firstDoc.attr('docid');
                       // common.page.render_doc_center(panl);
                    }else{
                        common.page.render_no_data('.folder-body')
                    }
                    //$('.doc-left-nav.my').addClass('active');
                }
            }
            ,render_no_data:function(box,txt){
                //没有数据
                var txt=txt || "没有找到任何数据~";
                $(box).html('<div class="noresult">\
                        <div class="no-resulticon noresult-icon"></div>\
                            <div class="noresult-title">'+txt+'</div>\
                        </div>');
                $("#js_cement_page_panl").html("");
            }
            ,render_quicklink_no_data:function(box){
                //var nodata_tpl=require('../../template/document/quicklink-no-data.tpl');
                var nodata_tpl='<div class="quick-link-des">\
                    <div>\
                    <div class="quick-title"><i class="icon icon-help-blue"></i>什么是快速访问？</div>\
                    <div class="quick-title2">快速访问帮助用户搭建快捷到达需要文件夹或文件的路径。主要用于两种情况：</div>\
                    <p>1. 文件夹层级结构复杂，您需要访问的文件夹层级很深，因此可以通过快速访问直接读取。</p>\
                    <p>2. 当您只拥有子文件夹的只读权限而无权看到父文件夹时，您可通过子文件夹的URL直接访问。为了方便记忆，可通过快速访问创建快捷到达方式。</p>\
                </div>\
                <div>\
                <div class="quick-title"><i class="icon icon-help-blue"></i>如何创建快速访问文件夹？</div>\
                <div class="quick-title2">点击右上角的新建文件夹，在弹出层中，输入需要访问的文件夹URL，并命名，即可创建成功。</div>\
                </div>\
                </div>';
                $(box).html(nodata_tpl);
                $("#js_cement_page_panl").html("");
            }
            ,render_no_exist:function(box){
                //没有数据
                $(box).html('<div class="noresult">\
                        <div class="no-resulticon noresult-icon"></div>\
                            <div class="noresult-title">您查找的文件夹不存在~</div>\
                        </div>');
                $("#js_cement_page_panl").html("");
            }
            ,only_render_doc_center:function(data,isSearch){
                if(!window.apptype){
                    $.post(i8_session.ajaxHost+'webajax/modules/getmutippsvalue',{keys:decodeURIComponent(i8_session.apps)},function(response){
                        if(response){
                            apptype=response.ReturnObject;
                        }
                        template.helper('$fromwhere',function(appid){
                            var where='';
                            var whichApp= _.find(apptype,function(item){
                                return item.ID==appid;
                            })
                            if(appid=='00000000-0000-0000-0000-000000000000'){
                                where='社区';
                            }else if($.isEmptyObject(whichApp)){
                                where='未知';
                            }else{
                                where=whichApp.Name;
                            }
                            return '来自于 '+where;
                        })
                        template.helper('$deleteOrGuidang',function(appid,DocTreeID){
                            var result='';
                            var App_Document= _.find(apptype,function(item){
                                return item.Key=='app_document';
                            })
                            //console.log(App_Document.ID,appid.split('-').join(''))
                            if(appid==App_Document.ID){
                                result='<a class="btn-delete2" docid='+DocTreeID+'>删除</a>';
                            }else{
                                result='<a class="btn-delete" docid='+DocTreeID+'>取消归档</a>';
                            }
                            return result;
                        })
                        only_render_doc_center(data,isSearch)
                        //pagination(data)

                    })
                }else{
                    only_render_doc_center(data,isSearch)
                }
                function only_render_doc_center(data,isSearch){
                    if(data.Total==0){
                        if(panl.isCompany){
                            common.page.render_no_data('.folder-body');
                        }else{
                            common.page.render_no_data('.folder-body','我上传的文档和已经被归档的附件在这里展示');
                        }
                        return;
                    }
                    if(panl.isCompany){
                        var doc_center_tpl=require('../../template/document/center-doc-list.tpl');
                    }else{
                        var doc_center_tpl=require('../../template/document/my-center-doc-list.tpl');
                    }
                    template.helper('$getCanReadUsers',function(CanReadUsers,DocTreeAdmin){
                        var admins=_.values(DocTreeAdmin);
                        var users= _.uniq(admins.concat(CanReadUsers)).join(' ');
                        return users;
                    })
                    var doc_center_render=template(doc_center_tpl);
                    var doc_center_html=doc_center_render(data);
                    console.log(data)
                    $('.folder-body').html(doc_center_html);
                    if(isSearch){
                        $('.folder-body .inputspan').each(function(){
                            var $this=$(this);
                            var old_text=$this.text();
                            console.log(searchpanl.searchName)
                            var _html=old_text.replace(searchpanl.searchName,'<b class="red">'+searchpanl.searchName+'</b>');
                            $this.html(_html)
                        })
                    }
                    $('.folder-body').find('.file-item').each(function(index){
                        var $btn_power=$(this).find('.btn-power');
                        var $btn_edit=$(this).find('.btn-edit');
                        var $inputspan=$(this).find('.inputspan');
                        var $btn_delete=$(this).find('.btn-delete');
                        $btn_power.data(data.ReturnObject[index]);
                        $inputspan.data(data.ReturnObject[index]);
                        $btn_edit.data(data.ReturnObject[index]);
                        $btn_delete.data(data.ReturnObject[index]);
                    })
                    $('.folder-body').find('input').blur(function(){
                        var _input=$(this);
                        var _val= $.trim(_input.val());
                        if(!_val){
                            i8ui.error('名字不能为空！',_input);
                            return;
                        }
                        var _id=_input.attr('docid');
                        common.ajax.renameDocTree({
                            newName:_val,
                            docTreeID:parseInt(_id)
                        },function(data){
                            console.log(data);
                            _input.parents('dt').eq(0).removeClass('editing').find('.inputspan').text(_val);
                            var $editbtn=_input.parents('.file-item').eq(0).find('.btn-edit');
                            if($editbtn.length>0){
                                var newData=$editbtn.data();
                                newData.Name=_val;
                                $editbtn.data(newData)
                            }
                            i8ui.simpleWrite('更新成功',_input.prev());

                        })
                    })
                }
            }
            ,render_doc_center:function(panl){
                $(window).scrollTop(0);
                $('#new_file').show();
                $('.doc-cont').show();
                $('.quick-link-cont').hide();
                $('.doc-set-cont').hide();
                $('.document-set').removeClass('active');
                $('.folder-body').html('<div class="ld-64-write" style="width:64px;height: 64px;"></div>');
                template.helper('$getFileCreatTime',common.tool.getFileCreatTime);
                //更新hash
                if(panl.doc_id){
                    window.location.hash='#'+panl.doc_id;
                }
                if(!panl.isCompany){
                    window.location.hash='';
                }
                common.ajax.getCompanyDTsByParentID({isCompany:panl.isCompany,parentID:panl.doc_id,pageIndex:panl.pageIndex,pageSize:panl.pageSize,fileType:panl.fileType || 0,sortBy:panl.sortBy || 0},function(data){
                    if(panl.isCompany){
                        if(!(data.CurNode && data.CurNode.IsAuthorizePmt || data.CurNode.IsEditPmt)){
                            $('#update_document').hide();
                        }else{
                            $('#update_document').show();
                        }
                    }
                    template.helper('$setDownloadUrl',function(FilePath){
                        var dl_url=location.protocol+"//"+location.host+i8_session.baseHost+"platform/get-file?imgurl="+encodeURIComponent(FilePath);
                        return dl_url;//item.FilePath;
                    })
                    common.page.only_render_doc_center(data);
                    //控制分页
                    if(data.Total<=10){
                        $("#js_cement_page_panl").html("");
                    }
                    fw_page.pagination({
                        ctr: $("#js_cement_page_panl"),
                        totalPageCount: data.Total,
                        pageSize: panl.pageSize,
                        current: panl.pageIndex,
                        fun: function (new_current_page,containers) {
                            panl.pageIndex=new_current_page;
                            common.page.render_doc_center(panl)
                            //SearchPerson(keyword,new_current_page,orgID,isOnlyContract);
                        }, jump: {
                            text: '跳转'
                        }
                    });
                },function(data){
                    console.log(data.Code)
                    if(data.Code==5001 || data.Code==5005){
                        common.page.render_no_exist('.folder-body')
                    }else{
                        i8ui.error(data.Description)
                    }
                })
            }
            ,render_search_doc_center:function(searchpanl){
                $('#new_file').show();
                $('.doc-cont').show();
                $('.quick-link-cont').hide();
                $('.doc-set-cont').hide();
                $('.document-set').removeClass('active');
                $('.folder-body').html('<div class="ld-64-write" style="width:64px;height: 64px;"></div>');
                template.helper('$getFileCreatTime',common.tool.getFileCreatTime);
                common.ajax.getSearchList({
                    searchName:searchpanl.searchName,
                    pageIndex:searchpanl.PageIndex,
                    sortBy:searchpanl.sortBy
                },function(data){
                    if(data.Result){
                        common.page.only_render_doc_center(data,true);
                        //控制分页
                        if(data.Total<=10){
                            $("#js_cement_page_panl").html("");
                        }
                        $('.folder-body').prepend('<div class="doc-search-total">共有<span class="red">'+data.Total+'</span>条关于“<span class="red">'+searchpanl.searchName+'</span>”的搜索结果</div>');
                        $('.folder-body').find('.id-path-name').css('display','inline-block');
                        fw_page.pagination({
                            ctr: $("#js_cement_page_panl"),
                            totalPageCount: data.Total,
                            pageSize: searchpanl.pageSize,
                            current: searchpanl.pageIndex,
                            fun: function (new_current_page,containers) {
                                searchpanl.pageIndex=new_current_page;
                                common.page.render_search_doc_center(searchpanl)
                                //SearchPerson(keyword,new_current_page,orgID,isOnlyContract);
                            }, jump: {
                                text: '跳转'
                            }
                        });
                    }
                })
            }
            ,render_quicklink_center:function(quickpanl){
                $('.quick-link-cont-body').html('<div class="ld-64-write" style="width:64px;height: 64px;"></div>');
                common.ajax.getQuickFinderPage({
                    pageIndex:quickpanl.quickLinkIndex,
                    pageSize:quickpanl.quickLinkPageSize
                },function(data){
                    console.log(data)
                    //没有数据
                    if(data.Total==0){
                        common.page.render_quicklink_no_data('.quick-link-cont-body');
                        return;
                    }
                    var doc_center_tpl=require('../../template/document/quick-link-folder.tpl');
                    var doc_center_render=template(doc_center_tpl);
                    var doc_center_html=doc_center_render(data);
                    $('.quick-link-cont-body').html(doc_center_html);
                    $('.quick-link-cont-body').find('.file-item').each(function(index){
                        var $btn_power=$(this).find('.btn-power');
                        var $inputspan=$(this).find('.inputspan');
                        $btn_power.data(data.ReturnObject[index]);
                        $inputspan.data(data.ReturnObject[index]);
                    })
                    $('.quick-link-cont-body').find('input').blur(function(){
                        var _input=$(this);
                        var _val= $.trim(_input.val());
                        if(!_val){
                            i8ui.error('名字不能为空！',_input);
                            return;
                        }
                        var _id=_input.attr('quickid');
                        common.ajax.saveQuickFinder({
                            entity:{
                                Name:_val,
                                ID:_id,
                                DocTreeID:parseInt(_input.attr('docid')),
                                CreaterID:i8_session.uid
                            },
                            type:2
                        },function(data){
                            console.log(data);
                            _input.parents('dt').eq(0).removeClass('editing').find('.inputspan').text(_val);
                            i8ui.simpleWrite('更新成功',_input.prev());
                        })
                    })
                    //控制分页
                    if(data.Total<=10){
                        $("#js_cement_page_panl").html("");
                    }
                    fw_page.pagination({
                        ctr: '#js_cement_page_panl2',
                        totalPageCount: data.Total,
                        pageSize: quickpanl.quickLinkPageSize,
                        current: quickpanl.quickLinkIndex,
                        fun: function (new_current_page,containers) {
                            quickpanl.quickLinkIndex=new_current_page;
                            common.page.render_quicklink_center(quickpanl)
                            //SearchPerson(keyword,new_current_page,orgID,isOnlyContract);
                        }, jump: {
                            text: '跳转'
                        }
                    });
                })
                template.helper('$getFileCreatTime',common.tool.getFileCreatTime);
            }
            ,render_bread:function(idpath,idname,cur_name){
                console.log(idpath,idname,cur_name)
                var patharr=idpath.split('/');
                var namearr=idname.split('>');
                namearr.shift();
                namearr.pop();
                patharr.shift();
                var html="";
                for(var i=0;i<namearr.length;i++){
                    if(i==0){
                        html+=' > '
                    }
                    html+='<span class="path blue" curid="'+patharr[i]+'">'+namearr[i]+'</span> <span> > </span> ';
                }
                if(!html){
                    html=' > '
                }
                html+='<span class="current">'+cur_name+'</span>';
                $('#bread_cutting').html(html);
            }
            ,render_uploaddoc_dielog:function(confirmCbk,cancelCbk){
                var doc_upload_tpl=require('../../template/document/doc_upload.tpl');
                var doc_upload_dielog=i8ui.showbox({
                    title:'上传文档',
                    cont:doc_upload_tpl
                })
                $(doc_upload_dielog).find('.folder_admin_box').hide();
                $(doc_upload_dielog).find('.folder_admin_title').hide();
                $(doc_upload_dielog).find('dt').eq(0).hide();
                $(doc_upload_dielog).find('dd').eq(0).hide();
                //初始化上传控件

                window.uploader=myupload.doc_uploader.getUploader();
                //uploader.start();
                //myupload.doc_uploader.uploaderReset();
                $(doc_upload_dielog).find('.ct-close').on('click',function(){
                    uploader.stop();
                    myupload.count=0;
                    myupload.doc_uploader.uploaderReset();
                })
                //追加按钮
                myupload.doc_uploader2=common.ajax.up2({},{

                });
                window.uploader2= myupload.doc_uploader2.getUploader();
                /*$('#reupload').on('click',function(){
                    $('#update_document_btn')[0].click();
                })*/
                //渲染权限和文件夹
                if(window.location.hash && window.location.hash!='#'){
                    var docTreeID=window.location.hash.split('#')[1];
                    panl.isCompany=true;
                    common.ajax.getDocTree({docTreeID:docTreeID},function(data){
                        var docTree=data.ReturnObject.DocTree;
                        common.page.setDielog('newFile','上传文档',docTree,doc_upload_dielog)
                    })
                    //$('.powerhide').show();
                }else{
                    common.page.setDielog('newFile','上传文档',null,doc_upload_dielog)
                }

                common.tool.set_dielog_cbk(doc_upload_dielog,confirmCbk,cancelCbk)
            }
            ,render_uploaddoc_batch_dielog:function(file,confirmCbk,cancelCbk){
                var uploaddoc_batch_tpl=require('../../template/document/doc_upload_batch.tpl');
                var uploaddoc_batch_dielog=i8ui.showbox({
                    title:'上传新版本',
                    cont:uploaddoc_batch_tpl
                })
                if(!$('.file-name').val()){
                    var filename=file.name.substr(0,file.name.lastIndexOf('.'));

                    if(filename.length>30){
                        i8ui.error('文件名字不能超过30个字符');
                        filename=filename.substr(0,30);
                    }
                    $('.file-name').val(filename);
                }
                $(uploaddoc_batch_dielog).find('.ct-close').click(function(){
                    myupload.doc_uploader.uploaderReset();
                })
                common.tool.set_dielog_cbk(uploaddoc_batch_dielog,function(){
                    confirmCbk(uploaddoc_batch_dielog);
                },cancelCbk)
            }
            ,render_upload_item:function(file){
                var _str_file=file;
                file= $.parseJSON(file);
                file.Extension=file.name.substr(file.name.lastIndexOf('.')+1);
                var doc_upload_item_tpl=require('../../template/document/doc_upload_item.tpl');
                var doc_upload_item_render=template(doc_upload_item_tpl);
                var doc_upload_item_html=$(doc_upload_item_render(file)).data('qiniudata',_str_file);
                doc_upload_item_html.find('input').blur(function(){
                    common.page.upload_rename_btn_blur(doc_upload_item_html)//添加文件名重命名
                }).on('keydown',function(ev){
                    if(ev.keyCode==13){
                        $(this).trigger('blur');
                    }
                })
                var _item=$('.edit-file-item.loading').eq(0).replaceWith(doc_upload_item_html);
                //console.log(file)
            }
            ,getEntityType:function(str){
                var type=0;
                switch (str){
                    case 'user':
                        type=0;
                        break;
                    case 'grp':
                        type=1;
                        break;
                    case 'org':
                        type=2;
                        break;
                }
                return type;
            }
            ,getPmt:function($cheackboxs){
                var str=0;
                if($cheackboxs.eq(0).hasClass('checked')){
                    str=1;
                }
                if($cheackboxs.eq(1).hasClass('checked')){
                    str=parseInt(str)+2;
                }
                if($cheackboxs.eq(2).hasClass('checked')){
                    str=parseInt(str)+4
                }
                return parseInt(str);
            }
            ,uploadFile_btn_ev:function(){
                var admin_new_folder='.new-folder-cont';
                var $dielog=$(admin_new_folder).parents('.ct-ly').eq(0);
                if($('#upload_hide_ul').find('li').length==0){
                    i8ui.error('至少上传一个文档！');
                    return false;
                }
                var loaded=true;
                $('#upload_hide_ul .success').each(function(){
                    if($(this).css('display')=='none'){
                        loaded=false;
                    }
                })
                if(!loaded){
                    i8ui.error('还有未上传完成的文档！');
                    return false;
                }

                // //提交上传按钮
                var Scopes=common.tool.getScopes(admin_new_folder,'isNewFile',true);//true表示新建
                if(!Scopes){
                    return;
                }
                /*var _name=$('.foldername').val();*/
                var _ParentID=$('.save_position').attr('docid');
                if(!_ParentID){
                    i8ui.error('上级文件夹不能为空!',$('.save_position'));
                    return;
                }
                /*if(!_name){
                    i8ui.error('文件名字不能为空!');
                    return;
                }*/

                var options={
                    docTree:{
                        ParentID:$('.new-folder-cont .save_position').attr('docid'),
                        Scopes:Scopes,
                        Type:1,
                        Name:''

                    },
                    isAddBlogInfo:($dielog.find('.to-kk').css('display')!='none' && $dielog.find('.add-blog-info').hasClass('checked')) ? true : false
                };

                //options.fls=myupload.doc_uploader.getUploadFiles($('.edit-file-item'));
                options.fls=myupload.doc_uploader.getUploadFiles();
                var names=[];//收集名字防止重复
                $('#upload_hide_ul .title').each(function(index){
                    var _val=$.trim($(this).text());
                    console.log(options.fls[index].name=_val)
                    names.push(_val)
                })
                var uniqNmaes= _.uniq(names);
                if(uniqNmaes.length!=names.length){
                    i8ui.error('上传文档中不能存在相同名字的文件!');
                    return false;
                }

                //禁止重复上传
                var $confirm= $($dielog).find('.confirm');
                if(common.tool.setUnableConfirm($confirm)!=undefined){
                    return false;
                }
                //开始保存
                common.ajax.addDocTrees(options,function(data){
                    i8ui.write('上传成功!');
                    if($('.ct-close').length>0){
                        $('.ct-close').trigger('click');
                    }
                    if($.trim(window.location.hash)=='' || $.trim(window.location.hash)=='#'){
                        panl.isCompany=false;
                        common.page.innt_render_doc_center(panl);
                    }else{
                        window.location.hash='#'+options.docTree.ParentID;
                    }
                    panl.pageIndex=1;
                    panl.fileType=0;
                    panl.sortBy=1;
                    $('.nav-item').removeClass('active');
                    $('#all').addClass('active');
                    $('#order').setValue('按时间排序↓');
                    common.page.innt_render_doc_center(panl);
                })
            }
            ,updateFile_btn_ev:function(dielog,cbk){
                var $dielog=dielog;
                var loaded=true;
                $('#upload_hide_ul .success').each(function(){
                    if($(this).css('display')=='none'){
                        loaded=false;
                    }
                })
                if(!loaded){
                    i8ui.error('还有未上传完成的文档！');
                    return false;
                }
                if(!$.trim($('.file-name').val())){
                    i8ui.error('主题不能为空',$('.file-name'));
                    return;
                }
                //开始保存
                var _file=myupload.doc_uploader.getUploadFiles();
                var _name=$.trim($('.file-name').val());
                console.log(_file)
                for(var i=0;i<_file.length;i++){
                    var _oldFileName=_file[i].originalname;
                    _file[i].name=_name+(_oldFileName.substring(_oldFileName.lastIndexOf('.')));
                }
                var options={
                    file:_file,
                    newName: _name
                }
                //提交中
                var $confirm=$(dielog).find('.confirm');
                //禁止重复上传
                var $confirm= $($dielog).find('.confirm');
                if(common.tool.setUnableConfirm($confirm)!=undefined){
                    return false;
                }
                common.ajax.addFileVersion(options,function(data){
                    i8ui.write('上传成功!');
                    myupload.doc_uploader.uploaderReset();
                    cbk && cbk()
                    if($('.ct-close').length>0){
                        $('.ct-close').trigger('click');
                    }
                })
            }
            ,render_file_edit:function(file){
                var file_edit_tpl=require('../../template/document/file_edit.tpl');
                var file_edit_render=template(file_edit_tpl);
                var file_edit_html=file_edit_render(file);
                return file_edit_html;
            }
            //归档按钮(文件)
            ,btn_guidang_ev_file:function(confirmCbk,cancelCbk,fileName,fileId,cbk){//dontjump不跳转到修改的文件夹
                var power_dielog=common.page.setDielog('editFile','文件归档');
                $(power_dielog).find('dt').eq(2).hide();
                $(power_dielog).find('dd').eq(2).hide();
                $(power_dielog).find('.confirm').eq(0).text('确定');
                $(power_dielog).find('.btn-yellow-h36').parent().hide();
                $(power_dielog).find('.to-kk').hide();
                var $foldername=$(power_dielog).find('.foldername');
                $foldername.val(fileName && fileName.substr(0,30));
                if(fileName.length>30){
                    i8ui.error('归档文件名最多不能超过30个字符',$foldername);
                }
                //添加权限事件
                $(power_dielog).on('click','.icon-blue-add',function(){
                    var selOption='';
                    var user_power=$(power_dielog).find('.user-power').get(0);
                    $(user_power).find('li').eq(0).find('label em').each(function(){
                        selOption+='<option>'+$(this).text()+'</option>';
                    })
                    common.page.addPowerItem(user_power,selOption);
                    return false;
                }).find('.new-folder-cont').addClass('guidangdielog').css('max-height',$(window).height()-200 > 500 ? $(window).height()-200 : 500);
                $(power_dielog).find('.foldername').on('input propertychange',function(ev){
                    var _val=$(this).val();
                    if(_val.length>30 && ev.keyCode!=13 && ev.keyCode!=8){
                        i8ui.error('文件名字不能超过30个字符');
                        $(this).val(_val.substr(0,30))
                        return false;
                    }
                })
                /*.mCustomScrollbar({
                    theme: "minimal-dark" ,
                    axis:"y",
                    autoExpandScrollbar:true,
                    advanced:{
                        autoExpandHorizontalScroll:true,
                        autoScrollOnFocus:true
                    },
                    //mouseWheel:{ preventDefault: false }
                    callbacks:{
                        onScrollStart:function(){

                            //alert(99)
                            return false;
                        }
                    }
                });*/
                $(power_dielog).on('click','.app-checkbox',function(){
                    $(this).toggleClass('checked');
                    return false;
                })
                //删除权限事件
                $(power_dielog).on('click','.icon-yellow-remove',function(){
                    $(this).parent().remove();
                    return false;
                })
                common.tool.set_dielog_cbk(power_dielog,function(){
                    var $dielog=$(power_dielog);
                    if(!$.trim($foldername.val())){
                        i8ui.error('主题不能为空',$foldername);
                        return;
                    }
                    var Scopes=common.tool.getScopes(power_dielog,true);//true表示新建或者跳过名字验证
                    if(!Scopes){
                        return false;
                    }
                    var _ParentID=$('.save_position').attr('docid');
                    if(!_ParentID){
                        i8ui.error('储存位置不能为空!',$('.save_position'));
                        return;
                    }
                    var docTree={};
                    docTree.Scopes=Scopes;
                    docTree.DocTreeID=$(power_dielog).find('.save_position').attr('docid');
                    docTree.Name=$.trim($foldername.val());
                    //设置
                    var options={
                        docTree:docTree,
                        fileID:fileId
                    };
                    //禁止重复提交
                    var $confirm= $($dielog).find('.confirm');
                    if(common.tool.setUnableConfirm($confirm)!=undefined){
                        return false;
                    }
                    common.ajax.fileToDocTree(options,function(data){
                        if(data.Result){
                            power_dielog.close();
                            i8ui.write('归档成功!');
                            cbk && cbk();
                        }
                    });
                })
                //common.tool.longadd_btn_init(power_dielog);
            }
            ,renderDocSetTree:function(clickcbk){
                var ztree= common.tool.addFolderTree("admin_tree",true,1,clickcbk);
                return ztree;
            },
            renderAdmin:function(dilog,treeNode,adminInput,type){
                var loadAdmin=false;
                var parentScopes=treeNode.Scopes;
                var docTreeAdmin;//知识库管理员
                var newAdminArr;//新增管理员数组
                var parentScopesArr;//父级权限继承数组
                switch (type){
                    case 'newFolder':
                        newAdminArr=treeNode.newAdminArr=[];
                        break;
                    case 'editFolder':
                        newAdminArr=treeNode.newAdminArr=_.filter(parentScopes,function(parentScopes){
                            return parentScopes.Pmt==4 && parentScopes.PmtStatus==2
                        });
                        loadAdmin=true;
                        break;
                    case 'newFile':
                        newAdminArr=treeNode.newAdminArr=[];
                        break;
                    case 'editFile':
                        newAdminArr=treeNode.newAdminArr=[];
                        parentScopesArr=treeNode.parentScopesArr=_.filter(parentScopes,function(parentScopes){
                            // return parentScopes.PmtStatus!=2
                            return parentScopes.PmtStatus==0
                        });
                        break;
                }
                //显示父权限
                console.log(treeNode.newAdminArr)
                //console.log(parentAdminArr,newAdminArr,parentPowerArr,otherPowerArr);
                $(dilog).data(treeNode);
                var newIds=[];
                if(newAdminArr.length>0){
                    var ids=[];
                    for(var j=0;j<newAdminArr.length;j++){
                        var _Scopes=newAdminArr[j];
                        var _ScopeEntitys=_Scopes.ScopeEntitys;
                        for(var i in _ScopeEntitys){
                            var _type='user';
                            _type=common.tool.transTypeEn(_ScopeEntitys[i])
                            ids.push({"type":_type,"id":i,ureadonly:false});
                            newIds.push(i);
                        }
                    }
                }
                if(!$.isEmptyObject(treeNode.ParentAdmin) || !$.isEmptyObject(treeNode.DocTreeAdmin)){
                    var ParentAdminWidthDocAdmin=$.extend(true, {}, treeNode.ParentAdmin,treeNode.DocTreeAdmin || {});
                    ParentAdminWidthDocAdmin=_.omit(ParentAdminWidthDocAdmin,newIds);
                    var ParentAdmin= $.extend(true, {}, treeNode.ParentAdmin);
                    if(type.indexOf('edit')>=0){
                        ids= _.without(ids, _.keys(ParentAdmin));
                        //ParentAdmin= _.omit(ParentAdmin,newIds);
                        ParentAdmin= _.omit(treeNode.ParentAdmin,newIds);
                    }
                    $('.folder_admin_box').data(ParentAdmin);
                    $('.folder-admin-parent').text(_.values(ParentAdminWidthDocAdmin).reverse().join(' '))
                }else{
                    $('.folder_admin_box').removeData();
                    $('.folder-admin-parent').text('')
                }
                if(adminInput && loadAdmin){
                    adminInput.clearData()
                    adminInput.setAllselectedData(ids)
                }
            },
            renderParentPower:function(dilog,treeNode,type){
                var parentScopes=treeNode.Scopes;
                //上级文件夹权限数组
                var parentPowerArr;
                var parent_power_item_tpl;
                var selOption='';
                var parent_selOption='';
                var readOnly;
                switch (type){
                    case 'newFolder':
                        parentPowerArr=treeNode.parentPowerArr=_.filter(parentScopes,function(parentScopes){
                            //return parentScopes.Pmt!=4;
                            return parentScopes.Pmt!=4 && parentScopes.PmtStatus!=1;
                        });
                        selOption= '<option>只读</option><option>上传</option>';
                        break;
                    case 'editFolder':
                        parentPowerArr=treeNode.parentPowerArr=_.filter(parentScopes,function(parentScopes){
                            return parentScopes.Pmt!=4 && parentScopes.PmtStatus!=2
                            //return parentScopes.Pmt!=4 && parentScopes.PmtStatus==0//（不保留空选择框）
                        });
                        selOption= '<option>只读</option><option>上传</option>';
                        break;
                    case 'newFile':
                        parentPowerArr=treeNode.parentPowerArr=_.filter(parentScopes,function(parentScopes){
                            return parentScopes.Pmt!=4 && parentScopes.PmtStatus!=1;
                            //return parentScopes.PmtStatus!=1;
                        });
                        selOption= '<option>只读</option><option>下载</option><option>完全控制</option>';
                        parent_selOption='<option>只读</option>';
                        readOnly=true;
                        break;
                    case 'editFile':
                        parentPowerArr=treeNode.parentPowerArr=_.filter(parentScopes,function(parentScopes){
                            return parentScopes.PmtStatus!=2;
                            //return parentScopes.Pmt!=4 && parentScopes.PmtStatus==0//（不保留空选择框）
                        });
                        selOption= '<option>只读</option><option>下载</option><option>完全控制</option>';
                        parent_selOption='<option>只读</option>';
                        readOnly=true;
                        break;
                }
                console.log(parentPowerArr)
                var _data={};
                template.helper('$setParentCheckBox',function(PmtStatus){
                    var check='';
                    switch(parseInt(PmtStatus)){
                        case 0:
                            check='checked';
                            break;
                        case 1:
                            check='';
                            break;
                        case 2:
                            check='checked';
                            break;
                    }
                    return check;
                })
                template.helper('$setParentTxt',function(ViewScopeEntitys){
                    var names='';
                    $(ViewScopeEntitys).each(function(index){
                        var type=common.tool.transTypeCn(ViewScopeEntitys[index].EntityType);
                        names+=type+ViewScopeEntitys[index].EntityName+' ';
                    })
                    return names;
                })

                _data.parentPowerArr=parentPowerArr;
                template.helper('$isNotEmptyScope',function(ScopeEntitys){
                    return !$.isEmptyObject(ScopeEntitys);
                })
                parent_power_item_tpl=require('../../template/document/parent_power_item.tpl');
                var parent_power_item_render=template(parent_power_item_tpl);
                var parent_power_item_html=parent_power_item_render(_data);
                $(dilog).find('.parent-scope ul').html(parent_power_item_html || '无');
                //绑定数据和加载下拉框
                $(dilog).find('.parent-scope li').each(function(index){
                    var $this=$(this);
                    var parentPower=parentPowerArr[index];
                    console.log(common.tool.transPmtFolder(parentPower.Pmt))
                    $this.data(parentPower).find('.scope-em').append(parent_selOption || selOption).setSelect({
                        newi8select:'newi8-select',
                        dropstyle: 'newselecti',
                        ckedstyle: 'newselectcked',
                        style:"  line-height: 40px;height: 34px!important;width: 150px;float: left;margin-left: 13px;display: block;"
                    })
                    /*if(readOnly){
                     $this.find('.i8-sel-options').attr('style','display:none!important;height:0px;overflow:hidden;border:none;')
                     }*/
                    $this.find('.i8-select').setValue(common.tool.transPmtFolder(parentPower.Pmt));
                })
                //console.log(parent_power_item_html)
            },
            renderEmptySelfPower:function(dilog,treeNode,type){
                var selOption='';
                switch (type){
                    case 'newFolder':
                        selOption= '<option>只读</option><option>上传</option>';
                        break;
                    case 'editFolder':
                        selOption= '<option>只读</option><option>上传</option>';
                        break;
                    case 'newFile':
                        selOption= '<option>只读</option><option>下载</option><option>完全控制</option>';
                        break;
                    case 'editFile':
                        selOption= '<option>只读</option><option>下载</option><option>完全控制</option>';
                        break;
                }
                var powerbox=$(dilog).find('.user-power');
                var obj=common.page.addPowerItem(powerbox,selOption);

                obj.sel.setValueByIndex(0);
            },
            renderSelfPower:function(dilog,treeNode,type){
                var selOption;
                var otherScopes=treeNode.Scopes;
                var otherPowerArr;
                var powerbox=$(dilog).find('.user-power');
                switch (type){
                    case 'newFolder':
                        otherPowerArr=treeNode.otherPowerArr=[];
                        break;
                    case 'editFolder':
                        otherPowerArr=treeNode.otherPowerArr=_.filter(otherScopes,function(otherScopes){
                            return otherScopes.Pmt!=4 && otherScopes.PmtStatus==2
                        });
                        selOption= '<option>只读</option><option>上传</option>';
                        break;
                    case 'newFile':
                        otherPowerArr=treeNode.otherPowerArr=[];
                        selOption= '<option>只读</option><option>下载</option><option>完全控制</option>';
                        break;
                    case 'editFile':
                        otherPowerArr=treeNode.otherPowerArr=_.filter(otherScopes,function(otherScopes){
                            return otherScopes.PmtStatus==2
                        });
                        selOption= '<option>只读</option><option>下载</option><option>完全控制</option>';
                        break;
                }
                //上级文件夹权限数组
                $(powerbox).html('');
                $(otherPowerArr).each(function(index){
                    //obj.sel
                    var ids=[];
                    var _Scopes=otherPowerArr[index];
                    var _ScopeEntitys=_Scopes.ScopeEntitys;
                    for(var i in _ScopeEntitys){
                        var _type='user';
                        _type=common.tool.transTypeEn(_ScopeEntitys[i])
                        if(!$.isEmptyObject(_ScopeEntitys)){
                            ids.push({"type":_type,"id":i,ureadonly:false});
                        }
                    }
                    if(ids.length>0){
                        var obj=common.page.addPowerItem(powerbox,selOption);
                        obj.input.setAllselectedData(ids);
                    }
                    if(type.indexOf('Folder')>0){
                        obj.sel.setValue(common.tool.transPmtFolder(_Scopes.Pmt));
                    }else{
                        obj.sel.setValue(common.tool.transPmtFile(_Scopes.Pmt));
                    }
                })
                if(otherPowerArr.length==0){
                    var obj=common.page.addPowerItem(powerbox,selOption);
                    obj.sel.setValueByIndex(0);
                }

            }
            ,showSetDielog:function(title,isEditFile,noUpFileBtn,hideAllFirst){//hideAllFirst隐藏整个弹出框
                var admin_new_folder_tpl=require('../../template/document/admin-new-folder.tpl');
                if(isEditFile){
                    admin_new_folder_tpl=require('../../template/document/doc_upload.tpl');
                }
                var admin_new_folder= i8ui.showbox({
                    title:title,
                    cont:admin_new_folder_tpl
                })
                if(noUpFileBtn){
                    $(admin_new_folder).find('.new-folder-cont>div').eq(0).hide();
                }
                if(hideAllFirst){
                    $(admin_new_folder).find('.new-folder-cont').css('visibility','hidden').next().hide();
                }
                return admin_new_folder;
            }
            ,setDielog:function(type,title,treeNode,existDielogName,isInDetailPage){//详细页弹出框
                //existDielogName ‘name’已经存在的dielog窗口名
                if(existDielogName){
                    var admin_new_folder=existDielogName;
                }else{
                    var admin_new_folder_tpl=require('../../template/document/admin-new-folder.tpl');
                    if(type.indexOf('File')>=0){
                        var admin_new_folder_tpl=require('../../template/document/doc_upload.tpl');
                    }
                    var admin_new_folder= i8ui.showbox({
                        title:title,
                        cont:admin_new_folder_tpl
                    })
                }
                //生成下拉框
                var selOption;
                //var readOnly;
                switch (type){
                    case 'newFolder':
                        selOption= '<option>只读</option><option>上传</option>';
                        break;
                    case 'editFolder':
                        selOption= '<option>只读</option><option>上传</option>';
                        break;
                    case 'newFile':
                        selOption= '<option>只读</option><option>下载</option><option>完全控制</option>';
                        break;
                    case 'editFile':
                        selOption= '<option>只读</option><option>下载</option><option>完全控制</option>';
                        break;
                }

                if(window.admin_ztree){
                    var treeNode=treeNode || admin_ztree.getSelectedNodes();
                }

                if(i8_session.appadmin.join('').indexOf('app_document')<0){
                    includeRoot=false;
                }
                //if(admin_ztree.getSelectedNodes())
                var _input=$(admin_new_folder).find('.power-input').attr('id','power-d'+powerIndex);
                var cu_sel=selector.KSNSelector({
                    model:2,width:280,element:'#power-d'+powerIndex+'',
                    searchType: { "org": true, "user": true, "grp": false },
                    selectCallback: function (uid, uname, uemail,utype,obj) {
                    }

                    //,loadItem:{items:[{ureadonly:true,id:$this.attr('ids')}]}
                });
                //管理员
                var adminInput=selector.KSNSelector({
                    model:2,width:'auto',element:'#folder_admin',
                    searchType: { "org": false, "user": true, "grp": false },
                    selectCallback: function (uid, uname, uemail,utype,obj) {
                    }
                    //,loadItem:{items:[{ureadonly:true,id:$this.attr('ids')}]}
                });
                var _type=type.indexOf('File')>=0 ? 2 :1;//2不显示第一级（企业文档）;
                var ztree=common.tool.addFolderTreeAdminSel(admin_new_folder,function(event, treeId, treeNode){
                    //树点击回调
                    $(admin_new_folder).find('.save_position').val(treeNode.IDPathName || "").attr('docid',treeNode.DocTreeID);
                    $(admin_new_folder).find('.save_position').attr('pid',treeNode.ParentID);
                    $('#document_tree').stop().slideUp(80);
                    console.log(treeNode);
                    var _type="";
                    if(type.indexOf('File')>=0){
                        _type='newFile'
                    }
                    if(type.indexOf('Folder')>=0){
                        _type='newFolder'
                    }
                    common.page.renderAdmin(admin_new_folder,treeNode,adminInput,_type);
                    common.page.renderParentPower(admin_new_folder,treeNode,_type);
                    //common.v.doc_set.renderSelfPower(admin_new_folder,treeNode,_type);
                },_type);
                //文件夹储存位置按钮
                //渲染管理员权限
                if(treeNode && (treeNode.length>0 || $.isPlainObject(treeNode)) ){
                    if($.isArray(treeNode)){
                        treeNode=treeNode[0];
                    }
                    if(type.indexOf('edit')>=0){
                        $(admin_new_folder).find('.foldername').val(treeNode.Name);
                        $(admin_new_folder).find('.save_position').attr('docid',treeNode.ParentID);
                        if(treeNode.IDPathName){
                            $(admin_new_folder).find('.save_position').val(treeNode.IDPathName.substring(0,treeNode.IDPathName.lastIndexOf('>')));
                        }
                    }else{
                        $(admin_new_folder).find('.save_position').val(treeNode.IDPathName).attr('docid',treeNode.DocTreeID);
                    }
                    common.page.renderAdmin(admin_new_folder,treeNode,adminInput,type);
                    common.page.renderParentPower(admin_new_folder,treeNode,type)
                    common.page.renderSelfPower(admin_new_folder,treeNode,type);
                }else{
                    common.page.renderEmptySelfPower(admin_new_folder,treeNode,type);
                }

                return admin_new_folder;
            }
           // render_doc_center
            //getCompanyFolderTrees
        }
    }
    $(document).on('hover','.new-folder-cont .save_position',function(){
        $(this).attr('title',$(this).val())
    })
    modules.exports = common;
});
