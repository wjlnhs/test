define(function (require, exports, modules) {
    var i8ui = require('../common/i8ui');
    var common = require('./common.js');
    require('./doc-set.js');
    //搜索初始化字段
    window.searchpanl={
        PageIndex:1,
        fileType:0,
        sortBy:1,
        pageSize:10
    }
    //快速链接初始化字段
    window.quickpanl={
        quickLinkIndex:1,//快捷访问第几页
        quickLinkPageSize:10//快捷访问分页条数
    }
    /*common.v={
        doc_set:require('./doc-set-view.js')
    }*/
    window.admin_ztree='';
    //加载文档设置js

    var order_sel=null;
    window.powerIndex=1;//权限表格自增长
    window.myupload={};
    window.panl={
        fileType:0,
        pageIndex:1,
        pageSize:10,
        sortBy:1,
        isCompany:true//false加载我的文档true加载企业文档
    }
    function resetpanls(){
        panl.pageIndex=1;
        panl.fileType=0;
        panl.sortBy=1;
        searchpanl.pageIndex=1;
        searchpanl.fileType=0;
        searchpanl.sortBy=1;
        $('#order').setValue('按时间排序↓');
        $('.nav-item').removeClass('active');
        $('#all').addClass('active');
        $('.nav-bar.lev2').css('background-position','-599px -9px');
    }
    function resetpanl(){
        panl.pageIndex=1;
        panl.fileType=0;
        panl.sortBy=1;
        $('#order').setValue('按时间排序↓');
        $('#seach_doc_input').val('');
    }

    /*window.onhashchange=function(){
        common.page.render_doc_center(panl);
    }*/
    //添加排序
    order_sel=$('#order').setSelect({
        newi8select:'newi8-select',
        dropstyle: 'newselecti',
        ckedstyle: 'newselectcked',
        style:"line-height: 36px;width:280px;float:right;margin-right:6px;margin-top:8px;display:block;"
    })
    //排序
    $('#order').find('em').on('click',function(){
        var _index=$(this).index();
        panl.pageIndex=1;
        searchpanl.pageIndex=1;
        switch (_index){
            case 0:
                panl.sortBy=1;
                searchpanl.sortBy=1;
                break;
            case 1:
                panl.sortBy=0;
                searchpanl.sortBy=0;
                break;
            case 2:
                panl.sortBy=3;
                searchpanl.sortBy=3;
                break;
            case 3:
                panl.sortBy=2;
                searchpanl.sortBy=2;
                break;
        }
        if($.trim($('#seach_doc_input').val())){
            common.page.render_search_doc_center(searchpanl);
        }else{
            common.page.innt_render_doc_center(panl);
        }
    })
    //复选框
    $(document).on('click','.app-checkbox',function(){
         $(this).toggleClass('checked');
    })


    //编辑按钮（文件）
    $(document).on('click','[type=doc] .file-item-edit .btn-edit',function(){
        var edit_dielog=common.page.showSetDielog('编辑文件',true,true,true);
        var docTreeID=$(this).attr('docid');
        var fileitem=$(this).parents('.file-item').eq(0);
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
                }

            }else{
                common.page.render_no_exist(edit_dielog)
                $(edit_dielog).find('.new-folder-cont').css('visibility','visible');
            }
            // console.log(data)
            $(edit_dielog).find('.ct-close').on('click',function(){
                if($(edit_dielog).find('.error-cont').length>0){
                    window.location.reload();
                }
            })
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
        //common.page.btn_edit_ev_file(null,null,$(this).data());
        //common.page.btn_move_ev(moveId,fileitem);
    })


    //保存权限按钮操作
    $(document).on('click','.powertable .btn-save',function(){
        var parent_td=$(this).parents('tr').eq(0);
        if(parent_td.find('.fw_ksninput_slted').length==0){
            i8ui.error('用户不能为空!',parent_td)
            return false;
        }
        if(parent_td.find('.checked').length==0){
            i8ui.error('请至少选择一个权限!',parent_td)
            return false;
        }
        var $parent=$(this).parents('tr').eq(0);
        common.tool.unableSelector($parent);
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

    //中间导航重命名
    $(document).on('click','.file-item-title .btn-edit',function(){
        var $parent=$(this).parents('dt').eq(0);
        common.page.center_rename_btn($parent);
    })
    //上传的文档重命名
    $(document).on('click','.edit-file-item .file-item-title .btn-edit',function(){
        var $parent=$(this).parents('.edit-file-item').eq(0)
        common.page.center_rename_btn($parent);
    })
    //重命名失去焦点
    $('.doc-left-ul').find('input').blur(function(ev){
        var $this=$(this);
        ev.stopPropagation();
        var $parent=$this.parent(0);
        var _input=$('.doc-left-ul .editing');
        var _val= $.trim(_input.val());
        if(!_val){
            i8ui.error('名字不能为空！',$parent);
            return;
        }
        var _id=_input.parents('li').eq(0).attr('docid');
        common.ajax.renameDocTree({
            newName:_val,
            docTreeID:parseInt(_id)
        },function(data){
            console.log(data);
            i8ui.simpleWrite('更新成功',$parent);
        })
        common.page.rename_btn_blur($this);
        $parent.find('.left-nav-txt').text($.trim($(this).val())).show();
        $(this).hide();
    }).keydown(function(ev){
        ev.stopPropagation();
        if(ev.keyCode==13){
            $(this).trigger('click');
        }
    }).on('click',function(ev){
        ev.stopPropagation();
        return false;
    });

    //删除文件
    $(document).on('click','.folder-body .btn-delete2',function(){
        var $this=$(this);
        var $parent=$this.parents('ul').eq(0).prev();
        var _title='确定要删除吗?'
        if($this.parents('[type=folder]').length>0){
            _title='删除文件夹同时删除里面的文件';
        }
        i8ui.confirm({
            'title':_title,
            'btnDom':$this
        },function(){
            common.ajax.deleteDocTree({
                docTreeID:parseInt($this.attr('docid'))
            },function(){
                i8ui.simpleWrite('删除成功',$this)
                $this.parents('.file-item').eq(0).remove();
            })
        })
    })
    //删除文件
    $(document).on('click','.quick-link-cont-body .btn-delete2',function(){
        var $this=$(this);
        var $parent=$this.parents('ul').eq(0).prev();
        var _title='确定要删除吗?'
        var _id=$(this).attr('quickid');
        var _docTreeID=$(this).attr('docid');
        i8ui.confirm({
            'title':_title,
            'btnDom':$this
        },function(){
            common.ajax.deleteQuickFinder({
                quickFinderID:_id
            },function(data){
                i8ui.simpleWrite('删除成功',$this)
                $this.parents('.file-item').eq(0).remove();
            })
        })
    })
    //快速添加快捷方式按钮
    $(document).on('click','.btn-quick',function(){
        var $this=$(this);
        var docTreeID=$this.attr('docid');
        var _name=$this.attr('docname');
        var entity={
            Name:_name,
            DocTreeID:docTreeID,
            CreaterID:i8_session.uid
        }
        common.ajax.saveQuickFinder({
            entity:entity,
            type:1
        },function(data){
            i8ui.simpleWrite('新增自定义文件夹成功!',$this)
        })
    })


    //取消归档
    $(document).on('click','.folder-body .btn-delete',function(){
        var $this=$(this);
        var $parent=$this.parents('ul').eq(0).prev();
        var _title='确定要取消归档吗?'
        var _id=$(this).attr('quickid');
        var _docTreeID=$(this).attr('docid');
        i8ui.confirm({
            'title':_title,
            'btnDom':$this
        },function(){
            common.ajax.deleteDocTree({
                docTreeID:_docTreeID
            },function(data){
                i8ui.simpleWrite('取消归档成功',$this)
                $this.parents('.file-item').eq(0).remove();
            })
        })
    })

    //初始化上传文件计数器
    //var update_document=$('#update_document').get(0);
    myupload.count=0;
    myupload.doc_uploader=common.ajax.up({},{
        uploadStartedCbk:function(up, file){
            console.log(up)
            myupload.count++;
            if(myupload.count==1){
                common.page.render_uploaddoc_dielog(function(){
                    common.page.uploadFile_btn_ev()
                },function(){
                    uploader.stop();
                    myupload.count=0;
                    myupload.doc_uploader.uploaderReset();
                });
            }
        },
        uploadSuccessCbk:function(file){
            //myupload.count.count--;
            //common.page.render_upload_item(file)
            if(myupload.count==0){
                $('.edit-file-item-tip').show()
            }
        }
    });

    /*$(document).on('click','.save_position',function(){
        common.page.btn_sel_folder_ev()
    })*/
    common.page.render_doc_left();
    //common.ajax.getCompanyFolderTrees()
    //modules.exports = common;
    $('.doc-left-ul').on('click','.doc-item',function(){
        $('.isnav').removeClass('active')
        $('.knowledge-cont').removeClass('my');
        $('#my_doc_nav').text('企业文档');
        var doc_id=$(this).parent().attr('docid');
        $('.nav-item').removeClass('active');
        $('#all').addClass('active');
        $('.nav-bar.lev2').css('background-position','-599px -9px');
        resetpanl();
        panl.isCompany=true;
        panl.doc_id=doc_id;
        common.page.render_doc_center(panl);
        $('#bread_cutting').html('<span class="current"></span>');
        $('#bread_cutting .current').html(' > '+$(this).find('.left-nav-txt').text()).attr('curid',doc_id);
        $('.doc-left-ul>li').removeClass('active');
        $(this).parent().addClass('active');
        $('#new_file').show();
        $('.doc-cont').show();
        $('.quick-link-cont').hide();
        $('.doc-set-cont').hide();
        /*显示隐藏上传按钮*/
        var _data=$(this).data();
        if(_data.IsEditPmt || _data.IsAuthorizePmt){
            $('#new_file').show();
            $('#update_document').show();
        }else{
            $('#new_file').hide();
            $('#update_document').hide();
        }
    })

    //初始化
    //common.page.render_doc_center(panl);
    common.page.innt_render_doc_center(panl);
    //分类按钮

    $('#all').on('click',function(){
        panl.pageIndex=1;
        panl.fileType=0;
        common.page.render_doc_center(panl);
        $('.tab-cmt-a.active').removeClass('active');
        $(this).addClass('active');
        $('.nav-bar.lev2').css('background-position','-599px -9px');
    })
    $('#document').on('click',function(){
        panl.pageIndex=1;
        panl.fileType=1;
        $('#seach_doc_input').val('');
        common.page.render_doc_center(panl);
        $('.tab-cmt-a.active').removeClass('active');
        $(this).addClass('active');
        $('.nav-bar.lev2').css('background-position','-530px -9px');

    })
    $('#picture').on('click',function(){
        panl.pageIndex=1;
        panl.fileType=2;
        $('#seach_doc_input').val('');
        common.page.render_doc_center(panl);
        $('.tab-cmt-a.active').removeClass('active');
        $(this).addClass('active');
        $('.nav-bar.lev2').css('background-position','-461px -9px');
    })
    $('#video').on('click',function(){
        panl.pageIndex=1;
        panl.fileType=3;
        $('#seach_doc_input').val('');
        common.page.render_doc_center(panl);
        $('.tab-cmt-a.active').removeClass('active');
        $(this).addClass('active');

    })
    $('#audio').on('click',function(){
        panl.pageIndex=1;
        panl.fileType=4;
        $('#seach_doc_input').val('');
        common.page.render_doc_center(panl);
        $('.tab-cmt-a.active').removeClass('active');
        $(this).addClass('active');
    })
    $('#other').on('click',function(){
        panl.pageIndex=1;
        panl.fileType=5;
        $('#seach_doc_input').val('');
        common.page.render_doc_center(panl);
        $('.tab-cmt-a.active').removeClass('active');
        $(this).addClass('active');
        $('.nav-bar.lev2').css('background-position','-390px -9px');
    })
    //文档跳转
    $('.knowledge-cont').on('click','[type=folder] .inputspan',function(){
        $('#seach_doc_input').val('');
        var _data=$(this).data();
        if(_data.IsEditPmt || _data.IsAuthorizePmt){
            $('#new_file').show();
            $('#update_document').show();
        }else{
            $('#new_file').hide();
            $('#update_document').hide();
        }
        var $parent=$(this).parent(),
            doc_id=parseInt($parent.attr('docid')),
            idpath=$parent.attr('idpath'),
            idname=$parent.attr('idname'),
            folderName=$(this).text();
        panl.isCompany=true;
        if($(this).parents('.quick-link-cont-body').length!=0){
            var renderBread=false;
            common.page.renderPgaeByDocId(panl,doc_id,idpath,idname,folderName,renderBread);
        }else{
            var renderBread=true;
            common.page.renderPgaeByDocId(panl,doc_id,idpath,idname,folderName,renderBread);
        }
        //return false;
    })

    $('#bread_cutting').on('click','.path',function(){
        panl.pageIndex=1;
        panl.doc_id= parseInt($(this).attr('curid'));
        common.page.render_doc_center(panl);
        $(this).nextAll().remove();
        $(this).attr('class','current');
        //common.page.render_bread($parent.attr('idpath'),$parent.attr('idname'),$(this).text())
    })
    $('.prev-lev').on('click',function(){
        $('#bread_cutting .path ').last().trigger('click')
    })
    //获取我的文档
    $('.doc-left-nav.my').on('click',function(){
        $('.knowledge-cont').addClass('my');
        $('#my_doc_nav').text('我的文档');
        $('#bread_cutting').html('');
        $('#update_document').show();
        resetpanl();
        panl.isCompany=false;
        common.page.render_doc_center(panl);
        $('.doc-left-nav.company').removeClass('active');
        $('.isnav').removeClass('active');
        $('.doc-left-ul .active').removeClass('active');
        $(this).addClass('active');
        $('#new_file').hide();
        $('.doc-cont').show();
        $('.quick-link-cont').hide();
        $('.doc-set-cont').hide();
        $('.nav-item').removeClass('active');
        $('#all').addClass('active');
        $('.nav-bar.lev2').css('background-position','-599px -9px');
    })
    $('.isnav').not('.my').on('click',function(){
        $('.isnav').removeClass('active');
        $('.doc-left-ul .active').removeClass('active');
        $(this).addClass('active');
        $('.doc-cont').hide();
    })

    $('.quick-link').on('click',function(){
        $('.doc-set-cont').hide();
        $('.quick-link-cont').show();
        common.page.render_quicklink_center(quickpanl);

    })
    //企业文档
    $('.doc-left-nav.company').on('click',function(){
        return;
        $('#my_doc_nav').text('企业文档');
        resetpanl();
        panl.isCompany=true;
        common.page.render_doc_center(panl);
        $('.doc-left-nav.my').removeClass('active');
        $(this).addClass('active');
    })
    //左边导航显示隐藏事件
    $('.doc-left-ul .icon-right-box').hover(function(){
        $(this).parents('li').eq(0).find('ul').show();
    },function(){
        $(this).parents('li').eq(0).find('ul').hide();
    })
    $('.doc-left-ul ul').hover(function(){
        $(this).show()
    },function(){
        $(this).hide();
    })
    //上传文档删除按钮事件

////添加行事件
    $(document).on('click','.icon-blue-add',function(){
        var selOption='';
        var user_power=$(this).parents('.user-power').get(0);
        $(user_power).find('li').eq(0).find('label em').each(function(){
            selOption+='<option>'+$(this).text()+'</option>';
        })
        common.page.addPowerItem(user_power,selOption);
    })
    $(document).on('input propertychange','.foldername, .file-item-title input',function(ev){
        var _val=$(this).val();
        if(_val.length>30 && ev.keyCode!=13){
            i8ui.error('文件名字不能超过30个字符');
            $(this).val(_val.substr(0,30))
            return false;
        }
        //search_btn.attr('href','/search?keyword='+$(this).val()+'#dynamic');
     })
    //新建自定义文件夹id监听
    $(document).on('input propertychange','.new-quick-link .urllink',function(ev){
        var $this=$(this);
        var oldDocTreeID=$this.attr('oldDocTreeID');
        var _val=$this.val();
        var _url= $.trim($this.val());
       // var _name= $.trim($(quick_link_dielog).find('.foldername').val());
        if(!_url){
            return;//如果url为空
        }
        var docTreeID=_url.substring(parseInt(_url.lastIndexOf('#'))+1);
        //可能是文件(没有hash)
        if(!_url.split('#')[1]){
            docTreeID=$(_url.split('/')).last()[0];
        }
        docTreeID=parseInt(docTreeID);
        if(isNaN(docTreeID)){
            return;//如果id不是数字
        }
        if(oldDocTreeID==docTreeID){
            return;//如果id没变
        }
        $this.attr('oldDocTreeID',docTreeID);
        var entity={
            DocTreeID:docTreeID,
            CreaterID:i8_session.uid
        }
        common.ajax.getDocTree({docTreeID:docTreeID},function(data){
            if(data.ReturnObject){
                $this.removeAttr('errorCode').removeAttr('errorTxt');
                var linkName=data.ReturnObject.DocTree.Name;
                $this.parents('.new-quick-link').find('.foldername').val(linkName)
            }
        },function(data){
            if(data.Code==5003){
                data.Description='对不起你无权限访问该链接！'
            }else if(data.Code==5001){
                data.Description='对不起你访问的链接不存在！'
            }
            $this.attr('errorCode',data.Code).attr('errorTxt',data.Description);
            i8ui.error(data.Description)
        })

        /*common.ajax.saveQuickFinder({
            entity:entity,
            type:1
        },function(data){
            quick_link_dielog.close();
            i8ui.write('新增自定义文件夹成功!')
            common.page.render_quicklink_center(quickpanl)
        })*/
        //search_btn.attr('href','/search?keyword='+$(this).val()+'#dynamic');
    })
    //folder-body
    //$('.folder-body').on('click','[type=doc]')
    //新建自定义文件夹
    $('#new_file_link').on('click',function(){
        var quick_link_dielog_tpl=require('../../template/document/new_quick_link.tpl');
        var quick_link_dielog=i8ui.showbox({
            title:'添加自定义访问链接',
            cont:quick_link_dielog_tpl
        });
        var $urlInput=$(quick_link_dielog).find('.urllink');
        common.tool.set_dielog_cbk(quick_link_dielog,function(){
            var _url= $.trim($(quick_link_dielog).find('.urllink').val());
            var _name= $.trim($(quick_link_dielog).find('.foldername').val());
            if(!_url){
                i8ui.error('自定义文件夹地址不能为空!')
                return;
            }
            if(!_name){
                i8ui.error('自定义文件夹名字不能为空!')
                return;
            }
            var docTreeID=_url.substring(parseInt(_url.lastIndexOf('#'))+1);
            //可能是文件(没有hash)
            if(!_url.split('#')[1]){
                docTreeID=$(_url.split('/')).last()[0];
            }
            docTreeID=parseInt(docTreeID);
            if(isNaN(docTreeID)){
                i8ui.error('自定义文件夹地址不合法!');
                return;
            }
            if($urlInput.attr('errorTxt')){
                i8ui.error($urlInput.attr('errorTxt'))
                return;
            }
            var entity={
                Name:_name,
                DocTreeID:docTreeID,
                CreaterID:i8_session.uid
            }
            common.ajax.saveQuickFinder({
                entity:entity,
                type:1
            },function(data){
                quick_link_dielog.close();
                i8ui.write('新增自定义文件夹成功!')
                common.page.render_quicklink_center(quickpanl)
            })
        },function(){
            quick_link_dielog.close();
        })
    })
    //搜索文档
    $('#seach_doc i').on('click',function(){
        var searchKey= $.trim($('#seach_doc_input').val());
        if(!searchKey){
            i8ui.error('搜索内容不能为空！');
            return;
        }
        resetpanls();
        searchpanl.searchName=searchKey;
        common.page.render_search_doc_center(searchpanl)
    })
    $('#seach_doc input').keydown(function(ev){
        if(ev.keyCode==13){
            $(this).parent().find('i').trigger('click')
        }
    })

    $('#bread_cutting').hover(function(){
        $(this).attr('title',$('#my_doc_nav').text()+$(this).text())
    })
    //编辑上传文件名字
    $(document).on('click','#upload_hide_ul .title',function(){
        var $this=$(this);
        var oldVal=$this.text();
        var ext=oldVal.slice(oldVal.lastIndexOf('.'));
        var oldName=oldVal.slice(0,oldVal.lastIndexOf('.'));

        $this.html('<input class="foldername" style="width:200px;height:16px!important;line-height:18px!important;" value="'+oldName+'" />'+ext);
        $this.find('input').focus();
        $this.find('input').on('blur',function(){
            var $input=$(this);
            var newName=$input.val();
            if(!$.trim(newName)){
                i8ui.error('文件名字不能为空!');
                return false;
            }
            $input.remove();
            $this.text(newName+ext)
        }).on('click',function(){
            return false;
        })
    })
    $(window).scroll(function(){
        var scrollsize = $(document).scrollTop();
        if(scrollsize > 60){
            $(".doc-fix-top").addClass("dofix");
           $('.app-lt').addClass('dofix');
        }else{
            $(".doc-fix-top").removeClass("dofix");
            $('.app-lt').removeClass('dofix');
            //$('.app-lt').css('top','auto')
        }
    })
    //$('.app-lt')固定左边文件夹
    /*var setLeftScrollbar=function(){
        $(".app-lt").css('height',$(window).height()-200).css('min-height',$(window).height()-200).mCustomScrollbar({
            theme: "minimal-dark" ,
            axis:"y",
            autoExpandScrollbar:true,
            advanced:{
                autoExpandHorizontalScroll:true,
                autoScrollOnFocus:true
            }
        });
    }
    setLeftScrollbar();
   $(window).resize(function(){
       $(".app-lt").css('height',$(window).height()-200).css('min-height',$(window).height()-200).mCustomScrollbar("update");
   })*/
    //固定左边文件夹结束


});
