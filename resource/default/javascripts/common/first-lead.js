var lead={
    isReaded:function(i8_session,E){//E代表位数科学记数法
        var isReaded=true;
        var num=new Number('1E'+E);
        var statusStr=i8_session.readstatus.toString();
        if(statusStr.charAt(statusStr.length-1-E)==0 || statusStr.charAt(statusStr.length-1-E)==''){
            isReaded=false;
        }else{
            return isReaded;
        }
        //i8_session.readstatus=parseInt(statusStr)+num;
        var options={
            status:parseInt(statusStr)+num
        }
        var ajaxBaseHost=i8_session.ajaxHost;
        $.ajax({
            url: ajaxBaseHost + 'webajax/modules/updateGuideStatus',
            type: 'post',
            dataType: 'json',
            data:{options:options},
            cache:false,
            success: function (data) {
                console.log(data)
                //callback(data);
            }, error: function (error) {
                //callback({Result:false,Description:'网络异常，请重试！'});
            }
        });
        return false;
    }
    //首页
    ,homeLead:function(){
        //var E=
        //lead.setGuideStatus(i8_session,0)
        if(lead.isReaded(i8_session,0)){
            return;
        }
        var beeBodyArr=[''];
        var beeHtml='<div class="bee-lead">\
                    <div class="bee-lead-cont">\
                        <p class="title">欢迎进入i8小时工作平台！</p><p>让小8带您快速浏览一下全新的页面分布吧！</p>\
                    </div>\
                    <div class="bee-bottom">\
                        <span class="next-lead" next="0">下一步</span><span class="touse">我想直接使用</span>\
                    </div>\
                  </div>';
        var beelocation=[
            {
                top:138,
                left:375
            },{
                top: 128,
                left: 802
            },{
                top: 123,
                left: 1018
            },{
                top: 123,
                left: 1098
            },{
                top: 123,
                left: 1098
            },{
                top: 221,
                left: 343
            },{
                top: 128,
                left: 792
            }
        ]
        var stepsTxtArr=[
            '<p style="line-height: 60px;">这里是i8小时几大核心应用的主要入口。</p>',
            '<p style="margin-top: 104px;">拥有专项权限的管理员可以从这里进入，</p><p>对企业架构、数据、流程、金融进行管理</p>',
            '<p>这里是搜索中心，可通过关键字搜索</p><p>同事、文档、侃侃</p>',
            '<p style="line-height: 60px;">在个人设置中完善个人基本信息。</p>',
            '<p style="line-height: 60px;">侃侃的评论，以及其他消息在此进入查看。</p>',
            '<p style="line-height: 60px;">这里是i8小时各办公小应用的入口。</p>',
            '<p>您的个人办公安排都可在这里查看。</p><p>并且可自定义需要显示的组件。</p>'
        ]
        var steps='<div class="home-steps"><div class="lead-step lead-step1"></div>\
                <div class="lead-step lead-step7"></div>\
                <div class="lead-step lead-step2"></div>\
                <div class="lead-step lead-step3"></div>\
                <div class="lead-step lead-step4"></div>\
                <div class="lead-step lead-step5"></div>\
                <div class="lead-step lead-step6"></div>\
                </div>'
        var _html='<div class="lead-box lead-box-home">'+beeHtml+steps+'</div>';
        $('body').append('<div class="lead-msk"></div>').append(_html);
        $('.bee-lead').css('top',$(window).height()/2-110);
        $('.lead-box-home .next-lead').on('click',function(){
            var $this=$(this);
            var _index=parseInt($this.attr('next'));
            if(_index==6){
                $('.bee-lead .touse').hide();
                $this.text('开始使用').css('margin-left','40px')
            }
            if(_index>=7){
                $('.bee-lead .touse').trigger('click')
            }
            $('.home-steps .lead-step').hide();
            $('.home-steps .lead-step').eq(_index).fadeIn();
            $this.attr('next',_index+1);
            $('.bee-lead-cont').html(stepsTxtArr[_index])
            $('.bee-lead').css(beelocation[_index])
        })
        $('.bee-lead .touse').on('click',function(){
            $('.lead-msk, .lead-box').remove()
        })
    },
    yellowDashedLead:function(txthtml,location,istype2,wrapbox){
    var beeBodyArr=[''];
    var txthtml=txthtml ||'';
    var wrapbox=wrapbox || 'body';
    var $wrapbox=$(wrapbox);
    var bottomHtml='<span class="next-lead" style="margin-left: 35px; width: 70px;">我知道了</span></span>'
    if (istype2){
        bottomHtml='<span class="next-lead" next="0">下一步</span><span class="touse">我想直接使用</span>'
    }
    var defLocation={//默认坐标
        T:195,
        L:242,
        H:40,
        W:280
    }
    var location= $.extend(defLocation,location)
    var beeHtml='<div class="bee-lead">\
                    <div class="bee-lead-cont">\
                        '+txthtml+'\
                    </div>\
                    <div class="bee-bottom">\
                        '+bottomHtml+'\
                    </div>\
                  </div>';
    if(!wrapbox){
        var _html='<div class="lead-box lead-box-home">'+beeHtml+'</div>';
    }else{
        var _html=beeHtml;
        $wrapbox.css('position','relative')
    }
    $wrapbox.append('<div style="width: '+defLocation.W+'px;height:'+defLocation.H+'px;left:'+defLocation.L+'px;top:'+defLocation.T+'px;" class="todo-dashed lead-yellow-dashed">').append(_html);

    $('.bee-lead').css('top',$(window).height()/2-110);
    //$('.bee-lead .todo').attr('href',$('.tbody_wfAppList a').eq(0).attr('href'))
        $(wrapbox).find('.lead-yellow-dashed').addClass('active');
    $('.bee-lead .next-lead').on('click',function(){
        var $this=$(this);
        if(!$this.attr('next')){
            $('.home-steps .lead-box').hide();
            console.log($(wrapbox))
            $(wrapbox).find('.bee-lead').hide();
            $('.lead-box').hide();
            $(wrapbox).find('.lead-yellow-dashed').hide();
        }
    })
    $('.touse').on('click',function(){
        $('.home-steps .lead-box').hide();
        $(wrapbox).find('.bee-lead').hide();
        $('.lead-box').hide();
        $(wrapbox).find('.lead-yellow-dashed').hide();
    })
}
    ,//流程待办
    todoLead:function(){
        if(lead.isReaded(i8_session,1)){
            return;
        }
        var txthtml='<p style="line-height: 60px;">有个流程需要我审批，<a class="todo" href="javascript:void(0);" target="_blank">点击</a>去处理吧！</p>'
        lead.yellowDashedLead(txthtml,{})
        //点击按钮(蓝色的字)
        $('.bee-lead .todo').on('click',function(){
            if($('.tbody_wfAppList a').length==0){
                alert('没有待办信息!')
            }else{
                $('.bee-lead .todo').attr('href',$('.tbody_wfAppList a').eq(0).attr('href'))
            }
        })
        $('.todo-dashed').on('click',function(){
            $('.todo')[0].click();
        })
        $('.bee-lead').animate('top',150)
    }
    //流程同意
    ,agreeLead:function(T,L){
        if(lead.isReaded(i8_session,2)){
            return;
        }
    var txthtml='<p>i8小助手在欢迎我使用i8小时</p><p>试试“<a class="btn_approve_agree_clone" href="javascript:void(0);">同意</a>”它的申请吧</p>'
        lead.yellowDashedLead(txthtml,{
            T:T || 566,
            L:L || 400,
            H:47,
            W:120
        })
        setTimeout(function(){
            $('.bee-lead').animate({
                top:T-244, //322,
                left:L+50//450
            })
            $('html,body').animate({'scrollTop':T-300})
        },200)
        $('.btn_approve_agree_clone, .todo-dashed').click(function(){
            $('.btn_approve_agree').trigger('click')
        })
    }
    //自定义流程按钮
    ,customList:function(){
        if(lead.isReaded(i8_session,3)){
            return;
        }
        var txthtml='<p>试试我刚同意的流程是怎样发起的吧！</p><p><a class="todo" href="javascript:void(0);" target="_blank">点击</a>发起自定义流程！</p>'
        lead.yellowDashedLead(txthtml,{
            T:187,
            L:253,
            H:40,
            W:239
        })
        //点击按钮(蓝色的字)
        $('.bee-lead .todo').on('click',function(){
            if($('.app-templete-name').length==0){
                alert('自定义流程按钮还没加载完成!请稍等!')
            }else{
                $('.bee-lead .todo').attr('href',$('.app-templete-name').eq(0).find('a').attr('href'))
            }
        })
        $('.todo-dashed').on('click',function(){
            $('.todo')[0].click();
        })
        setTimeout(function(){
            $('.bee-lead').animate({
                top:224,
                left:308
            })
        },500)
    }
    //自定义流程页面
    ,customProLead:function(){
        if(lead.isReaded(i8_session,4)){
            return;
        }
        var txthtml='<p style="line-height: 60px;">输入主题试试，比如“出差申请”</p>'
        lead.yellowDashedLead(txthtml,{
            T:13,
            L:17,
            H:48,
            W:950
        },true,'.proc_detail_center_wrap')
        //点击按钮(蓝色的字)
        $('.bee-lead .todo').on('click',function(){
            if($('.app-templete-name').length==0){
                alert('自定义流程按钮还没加载完成!请稍等!')
            }else{
                $('.bee-lead .todo').attr('href',$('.app-templete-name').eq(0).find('a').attr('href'))
            }
        })
        setTimeout(function(){
            $('.bee-lead').animate({
                top:62
            })
        },500)
        //更新步骤
        var updateStep=function(json){
            $('.bee-lead').animate({
                top:json.beeT,
                left:json.beeL
            })
            $('.lead-yellow-dashed').removeClass('active').animate({
                top:json.T,
                left:json.L,
                height:json.H,
                width:json.W
            })
            setTimeout(function(){
                $('.lead-yellow-dashed').addClass('active')
            },30)
            $('.bee-lead-cont').html(json.stepHtml);

        }
        $('.lead-yellow-dashed').on('click',function(){
            var $this=$(this);
            var step=parseInt($('.next-lead').attr('next'));
            $this.hide();
            switch (step){
                case 0:
                    $('#ProcTitle').focus();
                    break;
                case 1:
                    $('iframe').contents().find('.wysiwyg').focus();
                    break;
                case 2:
                    $('.tbox_mutiLineBox').focus();
                    break;
                case 3:
                    break;
                case 4:
                    break;
            }
        })
        $('.next-lead').on('click',function(){
            var step=parseInt($('.next-lead').attr('next'));
            $('.lead-yellow-dashed').show();
            switch (step){
                case 0:
                updateStep({
                    beeT:298,
                    T:80,
                    L:17,
                    H:200,
                    W:950,
                    stepHtml:'<p>填写详细内容</p><p>比如“下周一至周三项目出差XX客户公司”</p>'
                })
                    break;
                case 1:
                    updateStep({
                        beeT:38,
                        T:281,
                        L:17,
                        H:110,
                        W:950,
                        stepHtml:'<p>填写申请原因</p><p>比如“项目需要，前期需求调研”</p>'
                    })
                    break;
                case 2:
                    updateStep({
                        beeT:328,
                        T:572,
                        L:17,
                        H:129,
                        W:950,
                        stepHtml:'<p style="line-height: 60px;">选择审批人，比如“我的上级”</p>'
                    })
                    var approvalTop=$('.app_addnew_approval_tb').offset().top;
                    var windowTop=$(window).height()+$(window).scrollTop();
                    if(approvalTop>(windowTop-200)){
                        var targetScrollTop=approvalTop+200-$(window).height();
                    }
                    $(window).scrollTop(targetScrollTop)
                    break;
                case 3:
                    var _H=parseInt($('#btnSubmit').outerHeight())+10;
                    var _W=parseInt($('#btnSubmit').outerWidth())+10;
                    updateStep({
                        beeT:461,
                        beeL:393,
                        T:716,
                        L:300,
                        H:_H,
                        W:_W,
                        stepHtml:'<p>该填的都填了，如果没问题</p><p>我们就“<a  href="javascript:void(0);" class="triggersub">提交</a>”吧！</p>'
                    })

                    break;
                case 4:
                    $('.touse').trigger('click');
                    break;
                default:
                    $('.touse').trigger('click');
            }
            $('.bee-lead-cont').on('click','.triggersub',function(){
                $('#btnSubmit').trigger('click')
            })
            $('.next-lead').attr('next',step+1)

            $('.todo-dashed').on('click',function(){

                var step=parseInt($('.next-lead').attr('next'));
                if(step==4){
                    $('#btnSubmit').trigger('click');
                }

            })
        })
    }
    //日程日历
    ,calendar:function(){
        if(lead.isReaded(i8_session,5)){
            return;
        }
        if($('.calendar-bee').length!=0){
            return;
        }
        var txthtml='<p style="line-height: 60px;">点击，用拖拽的方式可以直接创建日程</p>'
        lead.yellowDashedLead(txthtml,{
            T:255,
            L:152,
            H:141,
            W:120
        },null,'#mycalendarview_panel')
        $('.lead-yellow-dashed').css('background-color','#68d6ed').on('mousedown',function(){
            $(this).remove();
        }).addClass('calendar-dashed').append('<div style="height: 138px;margin-left: 2px;margin-top: 2px;margin-right: 1px;background-color:#68d6ed;"></div>');
        $('#mycalendarview_panel .bee-lead').not('.meeting-bee').addClass('calendar-bee');
        setTimeout(function(){
            $('#mycalendarview_panel .bee-lead').animate({
                top:192,
                left:450
            })
        },500)
    }
    //会议
    ,meeting:function(){
        if(lead.isReaded(i8_session,6)){
            return;
        }
        if($('.meeting-bee').length!=0){
            return;
        }
        var txthtml='<p style="text-align: left;margin-left: 40px;line-height: 24px;padding-top: 10px;">1.这里显示的是会议室占用情况</p><p style="text-align: left;margin-left: 40px;">2.直接拖拽点击空白时间，可以直接创建会议。</p>'
        $('.app-content').css('position','relative');
        $('.lead-yellow-dashed').addClass('meeting-dashed');
        lead.yellowDashedLead(txthtml,{
            T:0,
            L:0,
            H:0,
            W:0
        },null,'#room_panel')
        $('#room_panel .bee-lead').not('.calendar-bee').addClass('meeting-bee');
        setTimeout(function(){
            $('#room_panel .bee-lead').animate({
                top:200
            })
        },500)
    }
    //新建会议/日程(取消了)
    ,newMeetorCalendar:function(){
        if($('.communityPlugin').length>0 ){
            return;
        }
        if($('.newMeeting-bee').length!=0){
            return;
        }
        var txthtml='<p style="line-height: 60px;">填入新建的日程/会议主题！</p>'
        $('.app-content').css('position','relative');
    var _width=$('.communityPlugin').length>0 ? 728 : 810;
        lead.yellowDashedLead(txthtml,{
            T:-8,
            L:-8,
            H:50,
            W:_width
        },null,'.edit-schedule-cont')
        $('.edit-schedule-cont .lead-yellow-dashed').addClass('newMeeting-dashed').on('click',function(){
            $(this).remove();
            $('#schedule_title').focus();
        });
        $('.edit-schedule-cont .bee-lead').addClass('newMeeting-bee');
        setTimeout(function(){
            $('.edit-schedule-cont .newMeeting-bee').animate({
                top:80
            })
        },500)
    }
}