define(function (require, exports, module) {
    var ajaxHost = i8_session.ajaxHost;
    var i8ui = require('../common/i8ui');
    //require('../../stylesheets/task-tip.css')
    var renderRpt={
        //获取任务统计
        getUserRpt:function(options, callback){
            $.ajax({
                url: ajaxHost + 'webajax/task/getUserRpt',
                type: 'get',
                dataType: 'json',
                data: {options: options},
                success: function (data) {
                    if(data.Description){
                        i8ui.error(data.Description+' (获取任务统计)')
                    }else{
                        callback(data);
                    }
                }, error: function (error) {
                    callback(error);
                }
            });
        },
        renderRptHtml:function(targetUserID,dom){
            var $Name=i8_session.uname;
            if($(targetUserID).length>0){
                return;
            }
            template.helper('$getTodo',function(viewNum,doingNum,reviewNum){
                var str='<a target="_blank" href="'+i8_session.baseHost+'task" class="task-num">';
                str+=parseInt(viewNum)+parseInt(doingNum)+parseInt(reviewNum);
                str+='</a>';
                return str;
            })

            var task_tip_tpl=require('../../template/task/task_tip.tpl');
            renderRpt.getUserRpt({
                targetUserID:targetUserID
            },function(data){
                if(data.Result){
                    var $data=data.ReturnObject;
                    console.log(data)
                    $data.Name=$Name;
                    $data.baseHost=i8_session.baseHost;
                    $data.targetUserID=targetUserID;
                    $data.noClose=true;
                    var task_tip_render=template(task_tip_tpl);
                    var task_tip_html=task_tip_render($data);
                    $(dom).html(task_tip_html);
                }
            })
        },
        renderRpt:function(targetUserID,$Name,dom){
            clearTimeout(timer)
            if($(targetUserID).length>0){
                return;
            }
            template.helper('$getTodo',function(viewNum,doingNum,reviewNum){
                var str='<span class="task-num">';
                str+=parseInt(viewNum)+parseInt(doingNum)+parseInt(reviewNum);
                str+='</span>';
                return str;
            })
            var task_tip_tpl=require('../../template/task/task_tip.tpl');
            var timer=setTimeout(function(){
                if($(targetUserID).length>0){
                    return;
                }
                if($('.ct-ly').length>0){
                    $('.ct-ly').remove()
                }
                var tip_dielog=i8ui.showbox({
                    cont:'<div class="dielog-tip task-tip">\
                                <div class="ld-128-write" style="width:128px;height: 128px;margin-top: 30px;"></div>\
                            </div>',
                    btnDom:dom
                });
                $(tip_dielog).css({
                    'background':'none',
                    'box-shadow':'none',
                    'border':'none',
                    'margin-top':'244px'
                }).find('.dielog-close').on('click',function(){
                    tip_dielog.close();
                })
                renderRpt.getUserRpt({
                    targetUserID:targetUserID
                },function(data){
                    if(data.Result){
                        var $data=data.ReturnObject;
                        console.log(data)
                        $data.Name=$Name;
                        $data.targetUserID=targetUserID;
                        var task_tip_render=template(task_tip_tpl);
                        var task_tip_html=task_tip_render($data);
                        // $parent.append(task_tip_html)
                        //console.log(task_tip_html);
                        $(tip_dielog).find('.dielog-tip').replaceWith(task_tip_html);
                        $(tip_dielog).find('.dielog-close').on('click',function(){
                            tip_dielog.close();
                        })

                        /*$(window.tip_dielog).css({
                         top:dom.offset().top,
                         left:dom.offset().left
                         })*/
                    }
                })
            })
        }
    }
    module.exports=renderRpt;
});
