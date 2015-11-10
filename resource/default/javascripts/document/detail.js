define(function (require, exports, modules) {
    var i8ui = require('../common/i8ui');
    var common = require('./common.js');
    var selector = require('../plugins/i8selector/fw_selector.js');
    var fileViewer=require('../common/seefile');
    var util=require('../common/util');
    window.myupload={};
    window.powerIndex=1;//权限表格自增长
    //checkbox事件
    var _url=window.location.href.split('?')[0].split('#')[0];
    var docTreeID=_url.substring(_url.lastIndexOf('/')+1);
    i8_session.docTreeID=docTreeID;


    $('#delete_doc').on('click',function(){
        var $this=$(this);
        i8ui.confirm({
            'title':'确定要删除吗？'
        },function(){
            common.ajax.deleteDocTree({
                docTreeID:parseInt($this.attr('docid'))
            },function(){
                //$this.parents('.file-item').eq(0).remove();
                i8ui.write('删除成功！');
               setTimeout(function(){
                   window.opener.location.reload();
                   window.open('','_parent','');
                   window.close();
               },1000)
                /*var no_detail_tpl=require('../../template/document/no_detail.tpl');
                $('.file-item').replaceWith(no_detail_tpl);
                $('body').css('background','#f5f5f5')*/
            })
        })
    })
    $('#file_item_show .js_sf_fullScreen').click(function(){
        //fileViewer.sf.fullScreen();
        $('#file_item_show').toggleClass('full_iframe')
        $('#file_item_show').find('.js_sf_fullScreen').toggleClass('full');
        $('#js_head_nav').toggleClass('hide')
    })
    //加载版本和在线文档和绑定下载版本
    function renderVersionsList(loadIframe){
        //格式化附件列表
        var getAtt=function(attachmentsArr){
            var html=fileViewer.ks.getHtmlKK(attachmentsArr);
            fileViewer.ks.bindImgClick($('.file-item-edition'),true);
            return html;
        }
        var getdocIframe=function(attachmentsArr,aid){
            var html=fileViewer.sf.loadToDiv(attachmentsArr,aid,'dociframe');
            //fileViewer.ks.bindImgClick($('.file-item-edition'),true);
            return html;
        }
        common.ajax.getFileVersions({docTreeID:i8_session.docTreeID},function(data){
            var resultFiles=data.ReturnObject && data.ReturnObject.files || null;
            if(!resultFiles){
                $('#file_item_show').html('该文档不存在！或已被删除！');
                return false;
            }
            if(loadIframe){
                $('#file_item_show').find('>*').not('.js_sf_fullScreen').remove();
                $('#file_item_show').append(getdocIframe(resultFiles[0],'#file_item_show'));
            }
            if($('.state-complete').length>0){
                $('.state-complete').remove();
            }
            $('.file-item-edition').data(data.ReturnObject);
            template.helper('$renderTime',common.tool.renderTime);
            var batch_dielog_tpl=require('../../template/document/batch_dielog.tpl');
            var batch_dielog_render=template(batch_dielog_tpl);
            var batch_dielog_html=batch_dielog_render(data.ReturnObject);
            $('.add-edition').after(batch_dielog_html);
            if(data.ReturnObject && resultFiles.length>0){
                if(resultFiles[0].CreaterID!=i8_session.uid){
                    $('#update_document_box').addClass('no-power');
                }
            }
            $('.state-complete').each(function(index){
                var $this=$(this);
                var _length=$('.state-complete').length;
                $this.data(resultFiles[index]);
                $this.find('.file-edition').text(_length-index)
            }).on('click','.title, .imgWrap',function(){
                //绑定展示事件
                var _data=$(this).parents('.state-complete').eq(0).data();
                $('#file_item_show').find('>*').not('.js_sf_fullScreen').remove();
                $('#file_item_show').append(getdocIframe(_data,'#file_item_show'));
            }).on('click','.delete-version',function(){
                //删除版本事件
                var $this=$(this);
                i8ui.confirm({
                    title:'确定删除当前版本信息吗?'
                },function(){
                    var _docTreeID=$this.attr('docTreeID');
                    var _fileID=$this.attr('fileID');
                    common.ajax.deleteFileVersion({
                        docTreeID:_docTreeID,
                        fileID:_fileID
                    },function(data){
                        if(data.Result){
                            i8ui.write('删除成功!');
                            $this.parents('li').eq(0).remove();
                            $('.state-complete').each(function(index){
                                var $this=$(this);
                                var _length=$('.state-complete').length;
                                $this.find('.file-edition').text(_length-index)
                            })
                        }
                    })
                })
            })
        })
    }
    renderVersionsList(true);
    //上传新版本

    myupload.doc_uploader=common.ajax.up({
        maxFiles:1
    },{
        uploadStartedCbk:function(file){
            if($('.ct-ly').length==0){
                common.page.render_uploaddoc_batch_dielog(file,function(dielog){
                    common.page.updateFile_btn_ev(dielog,renderVersionsList);
                },function(){
                    myupload.doc_uploader.uploaderReset();
                });
            }

        },
        uploadSuccessCbk:function(file){
            //common.page.render_upload_item(file)
        }
    });
    //加载版本
    $('#edit_doc').on('click',function(){
        var edit_dielog=common.page.showSetDielog('编辑文件',true,true,true);
        common.ajax.getDocTree({docTreeID:docTreeID},function(data){
            //common.page.btn_edit_ev_file(data,false)//false表示不跳转
            if(data.ReturnObject){
                var _data=data.ReturnObject.DocTree;
                if(_data && _data.IsAuthorizePmt){
                    $(edit_dielog).find('.new-folder-cont').css('visibility','visible').next().show();
                    common.page.btn_edit_ev_file(null,null,_data,edit_dielog,'isInDetailPage')
                }else{
                    var nopower_tpl=require('../../template/task/error_role.tpl')
                    $('.new-folder-cont').html(nopower_tpl);
                    $(edit_dielog).find('.new-folder-cont').css('visibility','visible');
                    $(edit_dielog).find('.ct-close').on('click',function(){
                        window.location.reload();
                    })
                }

            }else{
                common.page.render_no_exist(edit_dielog);
                $(edit_dielog).find('.new-folder-cont').css('visibility','visible');
                $(edit_dielog).find('.ct-close').on('click',function(){
                    window.location.reload();
                })
            }
            // console.log(data)
        },function(data){
            if(data.Code==5001 || data.Code==5005){
                common.page.render_no_data('.new-folder-cont','您编辑的文件不存在~');
                $(edit_dielog).find('.new-folder-cont').css('visibility','visible');
                return;
            }else{
                i8ui.error(data.Description)
            }
            $(edit_dielog).find('.ct-close').on('click',function(){
                window.location.reload();
            })
        })
        //common.page.edit_file_btn_ev(data);
    });
    ////添加行事件
    $(document).on('click','.icon-blue-add',function(){
        var selOption='';
        var user_power=$(this).parents('.user-power').get(0);
        $(user_power).find('li').eq(0).find('label em').each(function(){
            selOption+='<option>'+$(this).text()+'</option>';
        })
        common.page.addPowerItem(user_power,selOption);
    })
    $(document).on('input propertychange','.foldername, .file-item-title input, .file-name',function(ev){
        var _val=$(this).val();
        if(_val.length>30 && ev.keyCode!=13){
            i8ui.error('文件名字不能超过30个字符');
            $(this).val(_val.substr(0,30))
            return false;
        }
        //search_btn.attr('href','/search?keyword='+$(this).val()+'#dynamic');
    })

    //版本下载按钮
    $('#down_doc').on('click',function(){
        var _data=[];
        var $this=$(this);
        common.ajax.getFileVersions({docTreeID:$this.attr('docid')},function(data){
            //_data=data.ReturnObject;
            if(data.ReturnObject){
                data.ReturnObject.Total=data.ReturnObject.files.length;
            }
            if(!data.ReturnObject || data.ReturnObject.files.length==0){
                i8ui.error('文件被已被删除！')
                window.location.reload();
                return false;
            }
            if(data.ReturnObject && !data.ReturnObject.IsDownloadPmt){
                i8ui.error('您的下载权限已经被删除！');
                window.location.reload();
                return false;
            }

            template.helper('$seefile_getDownUrl',function(file){
                return fileViewer.sf.getDownUrl(file)
            })
            var download_versions_tpl=require('../../template/document/download_versions.tpl');
            var download_versionsr_render=template(download_versions_tpl);
            var download_versionsrr_html=download_versionsr_render(data.ReturnObject);
            var download_versions_dielog=i8ui.showbox({
                title:'请选择下载版本',
                cont:download_versionsrr_html
            });
            $('#download_versions').find('.app-radio2').eq(0).addClass('checked');
            $(download_versions_dielog).find('.confirm').on('click',function(){
                download_versions_dielog.close();
            })
            $(download_versions_dielog).find('.cancel').on('click',function(){
                download_versions_dielog.close();
            })
        })
        //}
        return false;

    })

    $(document).on('click','.app-checkbox',function(){
        $(this).toggleClass('checked');
    })

    //编辑权限按钮操作
    $(document).on('click','.powertable .btn-edit',function(){
        var $parent=$(this).parents('tr').eq(0);
        common.tool.ableSelector($parent);
    })
    //编辑权限删除行按钮
    $(document).on('click','.powertable .icon-yellow-remove',function(){
        // var lis=$(this).parents('.user-power').eq(0)
        $(this).parent().remove();
    })
    //编辑权限取消行按钮
    $(document).on('click','.powertable .btn-delete',function(){
        $(this).parent().parent().remove();
    })
    //下载按钮
    $(document).on('click','.ct-ly .app-radio2',function(){
        $('.app-radio2').removeClass('checked');
        $(this).addClass('checked');
        $(this).parents('.ct-ly').find('.confirm').attr('href',$(this).attr('filepath'))
    })
    //关闭页面
    $(document).on('click','#closeWindow',function(){
        window.open('','_parent','');
        window.close();
    })

    //$('.add-edition')
    $('.slide-down-btn').click(function(){
        $(this).toggleClass('up');
        $('.detail-page-power').slideToggle();
    });
    //评论控件
    var doc_id=$("#doctree_id").val();
    var app_doc_id='47bfcb77-8640-433c-b482-70b81ec18a0a';
    var commentlist=require('../plugins/i8bloglist/i8comments');
    var commentContainer=$("#doc-details");
    //var taskData=data.ReturnObject.task;
    var exDefUsr=[];
    var creator={"uid":$('.detail-page-des').attr('createrID'),"uname":"@"+$('.detail-page-des').attr('createrName'),type:0};//创建人
    console.log(creator)
    if(creator.uid!=i8_session.uid){
        exDefUsr.push(creator)
    }
    $.get(i8_session.ajaxHost+'webajax/kkcom/get-appscomments',{sourceid:doc_id,appid:app_doc_id,r:Math.random().toString()},function(response){
        if(response.Result){
            commentlist({aTag:"#",rKey:"app_document",cmtContainer:commentContainer,datalist:response.ReturnObject,appID:app_doc_id,sourceID:doc_id,defAtUsers:exDefUsr,cmtsendType:"appcomment",replyModel:"replykk",lsModel:"detailsls"});
        }else{
            alert('获取评论失败!<br/>'+response.Description);
        }
    },"json");
    fileViewer.ks.bindImgClick(commentContainer);
});
