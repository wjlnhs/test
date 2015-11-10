/**
 * Created by jialin on 2014/12/19.
 */
    define(function (require, exports) {
        var i8ui = require('default/javascripts/common/i8ui');
        $('.reminding-setting').delegate('.app-checkbox', 'click', function () {
            $(this).toggleClass('checked')
        })
        $('.unread-prompt').delegate('.app-radio', 'click', function () {
            $('.unread-prompt').find('.app-radio').removeClass('checked');
            $(this).addClass('checked');
        })

        //获取全部app
        $.post(i8_session.ajaxHost+'webajax/modules/getmutippsvalue?'+ Math.random(),{keys:decodeURIComponent(['app_workflow','sys_blog','sys_notice'])},function(response){
            var apps=response.ReturnObject;
            $(apps).each(function(index,app){
                var Key=app.Key;
                switch (Key){
                    case "app_workflow" :
                        $('.gongzuoliu').attr('appid',app.ID);
                        break;
                    case "sys_blog" :
                        $('.shequ').attr('appid',app.ID);
                        break;
                    case "sys_notice":
                        $('.xitong').attr('appid',app.ID);
                        break;
                }
            })
            //获取设置app
            $.get(i8_session.ajaxHost+'webajax/settings/GetPerson?'+ Math.random(),{},function(data){
                if(!data.Result){
                    i8ui.error(data.Description);
                    return;
                }
                var _data=data.ReturnObject;
                if(_data.Alarm && _data.Alarm.Tips==null){
                    $('.app-checkbox').addClass('checked');
                    $('.app-radio').eq(0).addClass('checked');
                    return;
                }
                var alarm=[];

                if(_data.Alarm){
                    //alarm= $.parseJSON(_data.Alarm);

                    alarm= _data.Alarm;
                }else{
                    return;
                }
                //tips提醒
                $('.tip .app-checkbox').each(function(index,checkbox){
                    if(alarm && alarm.Tips){
                        var _tips=alarm.Tips;
                        for(var i=0;i<_tips.length;i++){
                            if($(checkbox).attr('appid')==_tips[i]){
                                $(checkbox).addClass('checked')
                            }
                        }
                    }
                })
                //邮件提醒
                $('.mail-prompt .app-checkbox').each(function(index,checkbox){
                    if(alarm && alarm.EMail){
                        var _email=alarm.EMail;
                        for(var i=0;i<_email.length;i++){
                            if($(checkbox).attr('id')==_email[i]){
                                $(checkbox).addClass('checked')
                            }
                        }
                    }
                })
                //小贴士提醒
                $('.unread-prompt .app-radio').each(function(index,checkbox){
                    if(!alarm.Frequency){
                        alarm.Frequency=0;
                    }
                    if(alarm){
                        var _fre=alarm.Frequency;
                        if($(checkbox).attr('key')==_fre){
                            $(checkbox).addClass('checked')
                        }
                    }
                })
            })
        },"json")
        //保存
        $('#save').on('click',function(){
            var subTips=[],
                subEMail=[],
                subFrequency=0;
            //tips
            $('.tip .app-checkbox').each(function(index,checkbox){
                if($(checkbox).hasClass('checked')){
                    subTips.push($(checkbox).attr('appid'))
                }
            })
            //邮件
            $('.mail-prompt .app-checkbox').each(function(index,checkbox){
                if($(checkbox).hasClass('checked')){
                    subEMail.push($(checkbox).attr('id'))
                }
            })
            ////小贴士提醒
            $('.unread-prompt .app-radio').each(function(index,checkbox){
                if($(checkbox).hasClass('checked')){
                    subFrequency=$(checkbox).attr('key');
                }
            })
            var alarm={
                Tips:subTips,
                EMail:subEMail,
                Frequency:subFrequency
            }
            alarm=JSON.stringify(alarm);
            $.post(i8_session.ajaxHost+'webajax/settings/UpdateAlarm?'+ Math.random(),{alarm:alarm},function(data){
                //var data= $.parseJSON(data);
                if(data.Result){
                    i8ui.successMask("恭喜保存设置成功！")
                }else{
                    i8ui.error(data.Description)
                }
            })
        })

        //初始化
        $('#reset').click(function(){
            $('.app-checkbox').addClass('checked');
            $('.app-radio').removeClass('checked').eq(0).addClass('checked');
        });

    })
