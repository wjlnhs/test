/**
 * Created by jialin on 2015/6/18.
 */
define(function (require, exports, modules) {
    var i8ui = require('../common/i8ui.js');
    var common = require('./common.js');
    var selector = require('../plugins/i8selector/fw_selector.js');
    var i8reg = require('../common/i8reg');
    var setrelation=require('../setrelation/setrelation');
    //require('../../stylesheets/task.css')
    var sel_obj={};//选人控件集合
    var _newtask=function(ele,cbk){
        var new_task_tpl=require('../../template/task/new_task.tpl');
        var head_w, participants_w, review_w;
        if(ele){//有ele代表首页使用
            $(ele).html(new_task_tpl).append('<i class="icon headofarrow"></i>');
            head_w=participants_w=640;
            review_w=508
            $('.task-tab #time_em').css('width',222)
        }
        $("#add_StartTime").setTime({
            dateFmt:'yyyy-MM-dd HH:mm:00',maxDate:'#F{$dp.$D(\'add_EndTime\')}'
        });
        $("#add_EndTime").setTime({
            dateFmt:'yyyy-MM-dd HH:mm:00',minDate:'#F{$dp.$D(\'add_StartTime\')}'
        })
        $('.add-review-name').on('click',function(){
            $(this).toggleClass('checked');
            $('#review_name').toggleClass('active');
            return false;
        })
        sel_obj.head=selector.KSNSelector({
            model:1,width: head_w || 720,element: '#head',
            maxSelected:1,
            searchType: { "org": false, "user": true, "grp": false },
            selectCallback: function (uid, uname, uemail,utype,obj) {
            }
        });
        sel_obj.participants=selector.KSNSelector({
            model:2,width: participants_w || 720,element: '#participants',
            searchType: { "org": false, "user": true, "grp": false },
            selectCallback: function (uid, uname, uemail,utype,obj) {
            }
            //,loadItem:{items:[i8_session.uid]}
        });
        sel_obj.review=selector.KSNSelector({
            model:1,width:review_w ||  563,element: '#review_people',maxSelected:1,
            searchType: { "org": false, "user": true, "grp": false },
            selectCallback: function (uid, uname, uemail,utype,obj) {
            }
        });
        //添加时间单位下拉控件
        $('#time_em').setSelect({
            newi8select:'newi8-select',
            dropstyle: 'newselecti',
            ckedstyle: 'newselectcked'
        });

        $('.more').click(function(){
            $(this).toggleClass('isup');
            $('.more-box').slideToggle(100);
        })
        //上传附件初始化
        try{
            uploader=common.ajax.up({});
        }catch (e){

        }
        //注册保存事件
       if(ele){
           _bindSave(ele,false,cbk);
       }
    }
    var _bindSave=function(ele,isdielog,cbk){
        $(ele).on('click','#save_task',function(){
            var $this=$(this);
            var delayTime=0;

            if($.trim($('#delay_time').val()!="")){
                if(isNaN($('#delay_time').val())){
                    i8ui.error('请输入正确的任务提醒时间！');
                    return;
                }else{
                    var time_em=$('.newselectcked').text();
                    switch (time_em){
                        case '分钟':
                            delayTime=$('#delay_time').val();
                            break;
                        case '小时':
                            delayTime=$('#delay_time').val()*60;
                            break;
                        case '天':
                            delayTime=$('#delay_time').val()*60*24;
                            break;
                    }
                }
            }

            if(i8reg.checkAll(ele)){
                //判断评审人是否为空
                if($('#review_name').find('.app-checkbox').hasClass('checked')){
                    if($('#review_name').find('.fw_ksninput_slted').length==0){
                        i8ui.error('还没有设置评审人');
                        return;
                    }
                }
                //判断负责人是否为空
                if($('#ownerName').find('.fw_ksninput_slted').length==0){
                    i8ui.error('负责人不能为空！');
                    return;
                }
                if($this.hasClass('saving')){
                    return;
                }
                $this.addClass('saving btn-gray96x32').text('提交中');
                //提交动作
                var addTask=function(fls){
                    common.ajax.addTask({
                        entity:{
                            Name: $.trim($('#taskName').val()),
                            CreaterID:i8_session.uid,
                            CreaterName:i8_session.uname,
                            OwnerName:$.trim($('#ownerName em').text()),
                            OwnerID:sel_obj.head.selectedData(),
                            BeginTime:$('#add_StartTime').val(),
                            EndTime:$('#add_EndTime').val(),
                            Description:$.trim($('#task_des').val()),
                            ReviewName:$.trim($('#review_name').val()),
                            ReviewID:sel_obj.review.selectedData() || [],
                            AlertBefore:delayTime || 15,
                            FileIDs:fls,
                            //JoinerIDs:sel_obj.participants.selectedData()=="" ? [i8_session.uid] : participants.selectedData().split(';')
                            JoinerIDs:sel_obj.participants.selectedData() ? sel_obj.participants.selectedData().split(';') : []
                        }
                    },function(data){
                        if(data.Result){
                            if(isdielog){
                                ele.close();
                                i8ui.successMask('保存成功');
                            }else{
                                _newtask(ele);
                                cbk && cbk(data.ReturnObject);
                                $('.kk-btn').trigger('click');
                                console.log(cbk);
                                i8ui.write('保存成功')
                            }

                            $('#nav_initiated').trigger('click');
                        }else{
                            i8ui.error('保存失败!');
                        }
                    })
                }
                if(uploader.getUploadFiles().length==0){
                    addTask([]);
                    return false;
                }
                //上传七牛
                common.ajax.toqinniu(uploader.getUploadFiles(),function(data){
                    console.log(data);
                    //执行添加
                    var fls=[];
                    if(data.Result){
                        if(data.ReturnObject.length>0){
                            fls=common.tool.getAttachIds(data.ReturnObject)
                        }
                        addTask(fls);
                    }

                })
            }
        })
    }
    exports.newtask=_newtask;
    exports.bindSave=_bindSave;
    //modules.exports = common;
});
