define(function (require, exports, modules) {
    var ajaxHost = i8_session.ajaxHost;
    var resHost = i8_session.resHost;
    var i8uploader = require('../plugins/i8uploader/fw_i8uploader.js');
    var i8ui = require('../common/i8ui');
    var common = require('./common.js');
    var selector = require('../plugins/i8selector/fw_selector.js');
    var fileViewer=require('../common/seefile');
    var util=require('../common/util');
    var changedStatus=true;
    window.$task={};
    window.updating=false;
    window.sel_obj={};//选人控件集合

    var taskID=util.getLastUrlName();
    detailPageInit();

    function detailPageInit(){
        //取消事件
        $('body').off('click');
        $(document).off('click');
        //checkbox事件
        $(document).on('click','.app-checkbox',function(){
            var $this=$(this);
            var ID=$this.attr('iid');
            var oid=$this.attr('oid');
            var _Name= $.trim($(this).parent().find('.child-item-txt').attr('title'));
            if($(this).hasClass('checked')){
                common.tool.updateChildTask(taskID,ID,false,_Name,oid,function(){
                    $this.toggleClass('checked');
                    i8ui.simpleWrite('更新成功');
                })
            }else{
                common.tool.updateChildTask(taskID,ID,true,_Name,oid,function(){
                    $this.toggleClass('checked');
                    i8ui.simpleWrite('更新成功');
                })
            }
        })

        //关闭页面
        $(document).on('click','#closeWindow',function(){
            window.open('','_parent','');
            window.close();
        })
        //删除按钮
        $('body').on('click','.task-detail-del',function(){
            i8ui.confirm({
                title:'确认删除本条任务吗？'
            },function(){
                common.ajax.deleteTask({'userID':i8_session.uid,taskID:taskID},function(data){
                    if(data.Result){
                        var no_detail_tpl=require('../../template/task/no_detail.tpl');
                        $('.detail-page').replaceWith(no_detail_tpl);
                        $(document).off('click');
                    }
                })
            })

        })
        common.ajax.getSingleTask({taskID:taskID},function(data){
            template.helper('getStatus',common.tool.getStatus);
            template.helper('$getAlertHtml',common.tool.getAlertHtml);
            template.helper('$getAlertNum',common.tool.getAlertNum);
            template.helper('$getStatusCont',common.page.getStatusCont);
            template.helper('$getBtns',common.page.getBtns);
            template.helper('$rendDelBtn',common.page.rendDelBtn);
            template.helper('$hasEditBtn',common.page.hasEditBtn);
            var task_detail_tpl=require('../../template/task/task_detail.tpl');
            var task_detail_render=template(task_detail_tpl);
            //template.helper('setSelectorAndLoad',common.tool.setSelectorAndLoad);
            if(!data.ReturnObject){
                var no_detail_tpl=require('../../template/task/no_detail.tpl');
                $('.app-footer').before('<div class="error-page-box">')
                $('.error-page-box').html(no_detail_tpl);
                $('.app-content-bg').remove();
            }
            if(data.ReturnObject && data.ReturnObject.task){
                if($('.bodyload').length>0){
                    $('.bodyload').remove();
                }
                $task=data.ReturnObject.task;
                $task.uid=i8_session.uid;
                var task_detail_html=task_detail_render($task);
                var attachmentlist=$task.Files;
                //更新查看
                if($task.Status==1 && $task.OwnerID==i8_session.uid && changedStatus){
                    common.page.see_ev(taskID);
                    changedStatus=false;
                }
                //初始化附件格式
                common.tool.setAttachmentlist(attachmentlist);
                if($('.detail-page').length>0){
                    $('.detail-page').replaceWith(task_detail_html);
                }else{
                    $('.app-content-bg').html(task_detail_html);
                }
                //时间控件不能为空
                $('.time-input').on('blur',function(){
                    if($(this).val()){
                        $(this).addClass('active');
                        $(this).removeClass('noactive');
                    }else{
                        //
                        i8ui.error('时间不能为空！');
                        //$(this).focus();
                        $(this).removeClass('active');
                        $(this).addClass('noactive');
                        return false;
                    }
                })
                //初始化左边导航
                common.page.initLeftNav();
                common.page.renderProcess(data.ReturnObject,'.process-items');
                common.tool.renderChild(null,$task)
                //负责人
                sel_obj.owner=selector.KSNSelector({
                    model:1,width:'auto',element: '#owner',maxSelected:1,
                    searchType: { "org": false, "user": true, "grp": false },
                    selectCallback: function (uid, uname, uemail,utype,obj) {
                        //开始更新
                        common.tool.toUpDateInfo(sel_obj,taskID,function(data){
                            detailPageInit(data)
                        },{ownerID:uid});
                        //$(obj).parents('dd').eq(0).addClass('stopedit');
                    },
                    deleteItemCallBack:function(){
                        $('#owner').focus();
                    },
                    loadItem:{items:[$('#owner').attr('owner_id')]}
                });
                //评审人
                sel_obj.review=selector.KSNSelector({
                    model:1,width:'auto',element: '#review',maxSelected:1,
                    searchType: { "org": false, "user": true, "grp": false },
                    selectCallback: function (uid, uname, uemail,utype,obj) {
                        common.tool.toUpDateInfo(sel_obj,taskID,function(data){
                            detailPageInit(data)
                        },{reviewID:uid});
                    },
                    deleteItemCallBack:function(){
                        $('#review').parent().trigger('click')//.focus();
                    },
                    loadItem:{items:[$('#review').attr('review_id')]}
                });
                //发起人
                if($('#promoter').attr('promoterID')!='00000000-0000-0000-0000-000000000000'){
                    sel_obj.promoter=selector.KSNSelector({
                        model:2,width:'auto',element: '#promoter',maxSelected:1,
                        searchType: { "org": false, "user": true, "grp": false },
                        selectCallback: function (uid, uname, uemail,utype,obj) {
                        },
                        loadItem:{items:[$('#promoter').attr('promoter_id')]}
                    });
                }
                //参与人
                sel_obj.participants=selector.KSNSelector({
                    model:2,width:'auto',element: '#participants',
                    searchType: { "org": false, "user": true, "grp": false },
                    selectCallback: function (uid, uname, uemail,utype,obj) {
                        $('.participants-box input').focus();
                        //obj.focus();
                    },
                    cancelCbk:function(){
                        $('.participants-box input').focus();
                    },
                    loadItem:{items:$('#participants').attr('participants_ids').split(',')}
                });
                //子任务
                sel_obj.child_ownername=selector.KSNSelector({
                    model:1,width:'100',element: '#child_ownername',
                    searchType: { "org": false, "user": true, "grp": false },
                    selectCallback: function (uid, uname, uemail,utype,obj) {
                    },
                    cancelCbk:function(){
                    }//,
                    //loadItem:{items:$('#participants').attr('participants_ids').split(',')}
                });
                //关注按钮
                $('.focus-task').on('click',function(){
                    var $this=$(this);
                    if($(this).hasClass('isfocus-task')){
                        common.ajax.unFavorTask({'taskID':taskID},function(data){
                            data.Code==0 ? i8ui.simpleWrite('取消关注成功!') : i8ui.error('取消关注失败!');
                            if(data.Code==0){
                                $this.toggleClass('isfocus-task');
                                $this.html('<i class="task-icon icon-eye"></i>关注任务');
                            }
                        })

                    }else{
                        common.ajax.favorTask({'taskID':taskID},function(data){
                            data.Code==0 ? i8ui.simpleWrite('关注成功!') : i8ui.error('关注失败!')
                            if(data.Code==0){
                                $this.toggleClass('isfocus-task');
                                $this.html('<i class="task-icon icon-eye"></i>取消关注');
                            }
                        })
                    }


                })
                //评论控件
                var task_id=taskID;
                var app_task_id='1a289157-8af2-4379-94e0-2b04b1b5395d';
                var commentlist=require('../plugins/i8bloglist/i8comments');
                var commentContainer=$("#task-comments");
                var taskData=data.ReturnObject.task;
                var exDefUsr=[];
                var creator={"uid":taskData.CreaterID,"uname":"@"+taskData.CreaterName,type:0};
                exDefUsr.push(creator);
                var owner={"uid":taskData.OwnerID,"uname":"@"+taskData.OwnerName,type:0};
                if(creator.uid!=owner.uid){
                    if(owner.uid!=i8_session.uid){
                        exDefUsr.push(owner)
                    }
                }
                $.get(i8_session.ajaxHost+'webajax/kkcom/get-appscomments',{sourceid:task_id,appid:app_task_id,r:Math.random().toString()},function(response){
                    if(response.Result){
                        commentlist({aTag:"#",rKey:"app_document",cmtContainer:commentContainer,datalist:response.ReturnObject,appID:app_task_id,sourceID:task_id,defAtUsers:exDefUsr,cmtsendType:"appcomment",replyModel:"replykk",lsModel:"detailsls"});
                    }else{
                        alert('获取评论失败!<br/>'+response.Description);
                    }
                },"json");
                fileViewer.ks.bindImgClick(commentContainer);
                //编辑事件
                $('.btn-edit2').on('click',function(ev){
                    if($('.editing').length>0){
                        $(document).trigger('click');
                        return;
                    }
                    var $parent=$(this).parent();
                    if($parent.find('.fw_ksntxtbox').length!=0){
                        common.tool.ableSelector($parent);
                    }
                    //if($(this).parents('dd').eq(0).hasClass('editing')){
                        return false;
                   // }

                })
                //
                $('.execution-time .btn-edit2').on('click',function(){
                    var $parent=$(this).parent();
                    $parent.toggleClass('timestopedit');
                })
                $('.execution-time').on('click',function(){
                    return false;
                })
                $('body').on('click',function(){
                    if($('.time-input.noactive').length>0){
                        i8ui.error('时间不能为空！');
                        return false;
                    }
                    if($('.review-box').hasClass('editing') || $('.owner-box').hasClass('editing')){
                        console.log(sel_obj.owner.selectedData())
                        if(!sel_obj.owner.selectedData()){
                            return;
                        }
                        //开始更新
                        var $parent=$('.editing');
                        common.tool.stopSelector($parent);
                        common.tool.toUpDateInfo(sel_obj,taskID,function(data){
                            detailPageInit(data)
                        });
                        return false;
                    }
                })
                $('body').on('click', '.fw_agtlist',function(){
                    return false;
                })

                $('body').on('click', '.fw_ksntxtbox_alert_ico',function(){
                    return false;
                })

                $(document).on('click',function(ev){
                    //判断是否在编辑字任务
                    var $editingChild=$('.editing-child');

                    if($editingChild.length>0){
                        var $item=$editingChild.parents('.child-item');
                        var ID=$item.attr('iid');
                        var _Name= $.trim($editingChild.find('.child-item-textarea').val());
                        var Finished=$item.find('.app-checkbox').hasClass('checked') ? true : false;
                        var ownerID=$item.find('.fw_ksninput_slted').attr('data-uid');
                        common.tool.updateChildTask(taskID,ID,Finished,_Name,ownerID,function(data){
                            if(data.Result){
                                var items={};
                                data.Items=[data.ReturnObject && data.ReturnObject.UpdatedItem];
                                data.JoinerIDs=data.ReturnObject && data.ReturnObject.JoinerIDs;
                                common.tool.refreshChild(sel_obj,taskID,data,ID)
                            }else{
                                i8ui.error('请求失败!')
                            }
                            //$editingChild.hide();
                            //$editingChild.parent().find('.child-item-txt').text(_Name).css('display','inline-block');
                            //$editingChild.removeClass('editing-child')
                        })

                    }
                    if($('.time-input.noactive').length>0){
                        i8ui.error('时间不能为空！');
                        return false;
                    }
                    if( !sel_obj.owner.selectedData() && $('.editing').length>0){
                        i8ui.error('负责人不能为空');
                        return;
                    }
                    /**/
                    if((!$('#execution_time').hasClass('timestopedit')) || (!$('#reminding_setting').hasClass('stopedit')) || (!$('.participants-box').hasClass('stopedit'))){

                        common.tool.reFreshemindTime();
                        common.tool.reFreshStartEndTime();
                        if(!$('.participants-box').hasClass('stopedit')){
                            var $parent=$('.participants-box');
                            common.tool.stopSelector($parent);
                            common.tool.toUpDateInfo(sel_obj,taskID,function(data){
                                detailPageInit(data)
                            });
                        }else{
                            common.tool.toUpDateInfo(sel_obj,taskID);
                        }
                    }
                    $('#execution_time').addClass('timestopedit');
                    $('#reminding_setting').addClass('stopedit');
                })
                //绑定时间
                $('#start_time').setTime({dateFmt:'yyyy-MM-dd HH:mm:00',maxDate:'#F{$dp.$D(\'end_time\')}'})
                $('#end_time').setTime({dateFmt:'yyyy-MM-dd HH:mm:00',minDate:'#F{$dp.$D(\'start_time\')}'})

                //添加时间单位下拉控件
                $('#time_em').setSelect({
                    newi8select:'newi8-select',
                    dropstyle: 'newselecti',
                    ckedstyle: 'newselectcked'
                })
                $('#time_em').setValue(common.tool.getAlertJson($task.AlertBefore).em);
                //任务描述
                $('#des_txt').click(function(){
                    if($task.Status==4 || $task.Status==5){
                        return;
                    }
                    if($('.editing').length>0){
                        return;
                    }
                    var $parent=$(this).parent();
                    if($parent.hasClass('no-power')){
                        return false;
                    }
                    $parent.removeClass('stopedit')
                    $(this).hide();
                    $parent.find('textarea').show().focus();
                })
                //任务描述
                $('#des_box textarea').blur(function(){
                    var $parent=$(this).parent();
                    $('#des_txt').show();
                    $parent.find('textarea').hide();
                    $('#des_txt').text($.trim($(this).val()));
                    common.tool.toUpDateInfo(sel_obj,taskID);
                })
                //开始结束时间
                $('#time_delay_txt').click(function(ev){
                    if($task.Status==4 || $task.Status==5){
                        return;
                    }
                    if($('.editing').length>0){
                        return;
                    }
                    var $parent=$(this).parent();
                    if($parent.hasClass('no-power')){
                        return false;
                    }
                    $parent.toggleClass('stopedit');
                    return false;
                })
                $('#delay_time_box').click(function(ev){
                    return false;
                })
                $('.fw_ksntxtbox').click(function(){
                    return false;
                })

                $('.fw_ksninput').on('mouseover',function(){
                    $(this).addClass('ishover')
                }).on('mouseout',function(){
                    $(this).removeClass('ishover')
                })
                $('.fw_ksntxtbox_alert_ico').on('mouseover',function(){
                    $(this).addClass('ishover')
                }).on('mouseout',function(){
                    $(this).removeClass('ishover')
                })

                //子任务操作
                $('#add_btn').on('click',function(){
                    var _val=$.trim($('#add_child_input').val());
                    var ownerID=sel_obj.child_ownername.selectedData();
                    if(ownerID.length==0){
                        i8ui.error('子任务负责人不能为空!',$('.add-blue-box .fw_ksntxtbox'))
                        return;
                    }
                    if(_val){
                        common.tool.addChildTask(taskID,_val,ownerID,sel_obj)//添加
                    }else{
                        i8ui.error('子任务不能为空!',$('#add_child_input'))
                    }
                    $('#add_child_input').val('');
                    sel_obj.child_ownername.clearData();
                })
                $('#add_child_input').on('keydown',function(ev){
                    if(ev.keyCode==13){
                        $('#add_btn').trigger('click')
                    }
                })
                $(document).on('click','.child-item i',function(){
                    var child_item=$(this).parent();
                    var _txt=child_item.text();
                    i8ui.confirm({
                        title:'确认删除该子任务吗？'
                    },function(){
                        var iid=child_item.attr('iid');
                        common.tool.deleteChildTask(taskID,iid,child_item)
                    })

                })

                //初始化附件
                window.uploader=common.ajax.up({
                    button:'myuploaderbtn',
                    btnContainerId:'myuploaderbtn_outbox',
                    fileContainerId:'uploader',
                    attachmentlist:[],
                    allFileUploaded_cbk:function(up,files,info){
                        //console.log(file,up,info)
                        var files=uploader.getUploadFiles()
                        //$('#'+oid).find('.imgWrap').append('<div class="savingtxt">正在保存....</div>');
                        common.tool.updateFiles(uploader,taskID,files);
                        //uploader.uploaderReset();
                    }
                });
                /*$(document).on('click','.file-panel .cancel',function(){
                    var _li=$(this).parents('li').eq(0);
                    var deleteID=_li.attr('doc_id') || _li.attr('id');
                    common.tool.deleteFile(uploader,taskID,deleteID)
                })*/
                //删除附件
                $(document).on('click','.show-attachmentlist .del-down-a',function(){
                    var $this=$(this);
                    i8ui.confirm({title:'确定删除当前版本信息吗?'},function(){
                        var _li=$this.parents('li').eq(0);
                        var deleteID=_li.attr('id') || _li.attr('doc_id');
                        common.tool.deleteFile(uploader,taskID,deleteID)
                    })
                })

                //文件附件
                if(attachmentlist){
                    common.tool.setAttachmentlist(attachmentlist);
                    $('.show-attachmentlist').html(fileViewer.ks.getHtml(attachmentlist,true,null,true));
                    fileViewer.ks.bindImgClick($('.show-attachmentlist'));
                }

                //状态按钮
                $('#finish_btn').on('click',function(){
                    common.page.finish_btn_ev(taskID,detailPageInit);
                })
                $('#stop_btn').on('click',function(){
                    common.page.stop_btn_ev(taskID,detailPageInit);
                })
                $('#review_btn').on('click',function(){
                    common.page.review_btn_ev(taskID,detailPageInit);
                })
                $('#restart_btn').on('click',function(){
                    common.page.restart_btn_ev(taskID,detailPageInit);
                })

            }
        },function(data){
            //console.log(data)
            if(data.Code==6202){
                var no_detail_tpl=require('../../template/task/no_detail.tpl');
                $('.app-footer').before('<div class="error-page-box">');
                $('.error-page-box').html(no_detail_tpl);
                $(document).off('click');
                $('.app-content-bg').remove();
            }else if(data.Code==6201){
                var error_role_tpl=require('../../template/task/error_role.tpl');
                $('.app-footer').before('<div class="error-page-box">');
                $('.error-page-box').html(error_role_tpl);
                $('.app-content-bg').remove();
                $(document).off('click');
               //i8ui.error(data.Description)
            }else{
                $('.app-content-bg').html(data.Description)
                $(document).off('click');
            }
        })
    }
    $(window).scroll(function(){
        if($(window).scrollTop()>90){
            $('.task-cont-l').css({
                top:30
            })
        }else{
            $('.task-cont-l').css({
                top:131
            })
        }
    })


});
