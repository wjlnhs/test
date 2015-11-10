define(function(require,exports){
    var util=require('../../../common/util');
    var fileuploader=require('../../qiniu_uploader/qiniu_i8uploader');
    var kankanSelectorCache=[];
    var kankanAttachment=null;
    var isKankan=i8_session.ukankan;
    var postMain=function(_setting){
       var setting= $.extend({
            container:"#",
            sendType:"kankan",//默认kankan,or comment
            enableHeader:true,
            header:{kankan:true,schedule:true,daily:true,task:true},
            kkConfig:{
                attachment:true,
                gift:false,
                face:true,
                topic:true,
                scope:true,
                scopeukk:isKankan,
                attachid:"btn_attachment",
                attabtnContainer:"btn_attachment_container",
                attaContainer:"upContainer",
                kid:"ksn",
                kkplaceholder:"@同事、@部门、@群组。侃侃工作点滴，分享创意灵感！",
                faceitem:""
            },
            others:{},
            postBefore:function(){},
            postCompleted:function(){},
            postfailed:function(){}
        },_setting);
        var kk_attachmnet=null;
        var posterContainer= $(setting.container);
        //初始化kankan Tab控件页
        var TabContent="";
        if(setting.header.kankan){
            setting.kkConfig.faceitem=tplRenderData.faceCanvas({faceBasePath:i8_session.resHost});
            var kankanHTML=tplRenderData.kankan(setting);
            TabContent+=kankanHTML;
        }
        if(setting.header.schedule){
            var scheduleHTML=tplRenderData.schedule(setting);
            TabContent+=scheduleHTML;
        }
        if(setting.header.daily){
            var dailyHTML=tplRenderData.daily(setting);
            TabContent+=dailyHTML;
        }
        if(setting.header.task){
            var taskHTML=tplRenderData.task(setting);
            TabContent+=taskHTML;
        }
        setting['tabcontent']=TabContent;
        var frameHTML=tplRenderData.framebox(setting);
        //事件绑定
        var postEventBind=function(){
            $('.schedule-cycle .app-radio',posterContainer).click(function(){ $('.schedule-cycle .app-radio',posterContainer).removeClass('checked'); $(this).addClass('checked'); });
            $('.weekordaily .app-radio',posterContainer).click(function(){ $('.weekordaily .app-radio',posterContainer).removeClass('checked'); $(this).addClass('checked');});
            $('.kk-btn',posterContainer).click(function(){ $('.schedule-tab, .weekofdaily-tab, .task-tab',posterContainer).hide(); $('.kk-tab',posterContainer).show(); });
            $('.schedule-btn',posterContainer).click(function(){
                $('.kk-tab, .weekofdaily-tab',posterContainer).hide();
                $('.task-tab',posterContainer).hide();
                $('.schedule-tab',posterContainer).show();
                //日程日历
                if(setting.header.schedule){
                    require.async('../../../calendar/addcalendar',function(addcalendar){
                        var _date=new Date();
                        var _h=_date.getHours();
                        var _m=_date.getMinutes();
                        if(_m>30){
                            _h++;
                            _m=0;
                        }else{
                            _m=30;
                        }
                        var scheduleoptions={
                            title:'新建日程/会议',
                            elem:$('#addschedule'),
                            noWindow:true,
                            width:633,
                            callback:setting.postCompleted,
                            data:{
                                addDate:util.dateformat(_date,'yyyy-MM-dd'),
                                addStartTime:util.dateformat(new Date('2014','1','1',_h,_m),'hh:mm'),
                                addEndTime:util.dateformat(new Date('2014','1','1',_h+1,_m),'hh:mm'),
                                Type:1
                            }
                        };
                        var createForm=function(){
                            addcalendar.openWindow(scheduleoptions,function(type){
                                $('#quick_post').find('li.kk-btn').trigger('click');
                                createForm();
                            });
                        };
                        createForm();
                    });
                }
            })
            //任务
            $('.task-btn',posterContainer).click(function(){
                $('.kk-tab, .weekofdaily-tab',posterContainer).hide();
                $('.schedule-tab',posterContainer).hide()
                $('.task-tab',posterContainer).show();
                //日程日历
                if(setting.header.task){
                    require.async('../../../task/newtask',function(newtask){
                        newtask.newtask('.task-tab',setting.postCompleted)
                    });
                }
            })
            $('.weekofdaily-btn',posterContainer).click(function(){
                $('.schedule-tab, .kk-tab',posterContainer).hide();
                $('.task-tab',posterContainer).hide();
                $('.weekofdaily-tab',posterContainer).show();
                //周日报事件绑定
                if(setting.header.daily){
                    //var addport=require('../../../report/addweekport');
                    require.async('../../../report/addweekport',function(addport){
                        //本周的起止日期和当前时间
                        var getweekOptions=function(){
                            var options={};
                            var date=new Date();
                            options.nowTime=util.dateformat(date,'yyyy-MM-dd');
                            var day=(date.getDay()||7)-1;
                            options.beginTime=util.dateformat(new Date(date.getFullYear(),date.getMonth(),date.getDate()-day),'yyyy-MM-dd');
                            options.endTime=util.dateformat(new Date(date.getFullYear(),date.getMonth(),date.getDate()+6-day),'yyyy-MM-dd');
                            return options;
                        }
                        var options=getweekOptions();
                        options.elem=$('#addweekport');
                        options.width=619;
                        options.callback=setting.postCompleted;
                        options.callback2=function(){
                            addport.openaddweekdaily(options);
                            $('#quick_post').find('li.kk-btn').trigger('click');
                        };
                        addport.openaddweekdaily(options);
                        /*setTimeout(function(){
                         addport.openaddweekdaily(options);
                         },3);*/
                    });
                }
            });
            //全局app-checkbox
            $('.app-checkbox',posterContainer).click(function(){ $(this).toggleClass('checked');})
            //侃侃相关事件绑定
            if(setting.header.kankan){//侃侃相关事件
                var selector=require('../../i8selector/fw_selector.js');
                var kankanBox=$(".kk-content-text",posterContainer);
                selector.KSNSelector({ model: 0, element: "#"+kankanBox.attr("id"), searchType:setting.kkConfig.ksnconfig|| { "org": true, "user": true, "grp": true },selectCallback: function (uid, uname, uemail,utype) {
                    var eType=utype=="user"? 0:(utype=="grp"?1:(utype=="org"?2:""));
                    kankanSelectorCache.push({ 'uid': uid, 'uname': '@' + uname,type:eType });
                }
                });
                //发布范围
                $("ul.release-scope-group li",posterContainer).click(function(){
                    if($(this).hasClass("enterprise-community-btn")){
                        $(".scope-txt-title",posterContainer).text("企业社区");
                        $(".release-scope-title",posterContainer).removeClass("only-visible-btn-t");
                        $(".release-scope",posterContainer).attr("scope-value","1");
                    }else if($(this).hasClass("only-visible-btn")){
                        $(".scope-txt-title",posterContainer).text("仅@可见");
                        $(".release-scope-title",posterContainer).addClass("only-visible-btn-t");
                        $(".release-scope",posterContainer).attr("scope-value","2");
                    }
                });
                //创建新群组
                $("ul.release-scope-group li.new-group-btn",posterContainer).click(function(){
                    var addgroup = require('../../../group/addgroup.js');
                    addgroup.groupBox(null,function(data){
                        if(data){
                            kankanSelectorCache.push({uid:data.ID,uname:"@"+data.Name,type:1});
                            //$(".kk-content-text", posterContainer).val("@"+data.Name+" ");
                            insertAtCursor($(".kk-content-text", posterContainer)[0], "@"+data.Name+" ");
                            $(".only-visible-btn",posterContainer).trigger("click");
                            $(".kk-content-text", posterContainer).focus();
                        }
                    });
                });
                $('.release-scope-title',posterContainer).click(function(){
                    $('.release-scope-group',posterContainer).slideToggle(200);
                    return false;
                });
                //礼物
                $('span.giftitem',posterContainer).click(function(){
                    $(this).siblings("span").removeClass("gfactive");
                    $(this).addClass("gfactive");
                    var sendTxt=$(this).attr("title");
                    var mtdata= $(".kk-content-text",posterContainer).val().match(/@[\u4E00-\u9FA5a-zA-Z0-9\-\(\)]{1,}\s#[\u4E00-\u9FA5a-zA-Z0-9\-\(\)]{1,}#/g);
                    $(".kk-content-text",posterContainer).val(mtdata[1]||mtdata[0]+sendTxt);
                    return false;
                });
                //表情
                $(".expression-btn",posterContainer).click(function(){
                    $('.face-layout',posterContainer).slideToggle(200).click(function(){ return false;});
                    return false;
                });
                $('.face-layout span.fw_face_span',posterContainer).mouseover(function(){
                    if ($(this).children().length == 0) {
                        $(this).html('<img src="' + $(this).attr("imgurl") + '"/>');
                    } else {
                        $(this).children().show();
                    }
                }).mouseout(function(){
                    if ($(this).children().length > 0) {
                        $(this).children().hide();
                    }
                }).click(function(){
                    var inputs = '[' + $(this).attr("title") + ']';
                    insertAtCursor(kankanBox[0], inputs);
                    $(".kk-sub",posterContainer).removeClass("post-btn-disabled");
                });
                //话题
                $(".topic-btn",posterContainer).click(function(){
                    if (kankanBox[0].value.indexOf('#请输入话题名称#') == -1) {
                        insertAtCursor(kankanBox[0], '#请输入话题名称#');
                    }
                    var dt_index = kankanBox[0].value.indexOf('#请输入话题名称#');
                    var endPos = 8;
                    if ($.browser.msie && parseInt($.browser.version) < 9) { endPos = 9;}
                    setTextSelected(kankanBox[0], dt_index + 1, dt_index + endPos);
                    $(".kk-sub",posterContainer).removeClass("post-btn-disabled");
                });
                //文件上传按钮
                var options = {'button':setting.kkConfig.attachid,//按钮ID
                    'fileContainerId':setting.kkConfig.attaContainer,//装文件容器
                    'btnContainerId':setting.kkConfig.attabtnContainer,//按钮ID容器
                    'tokenUrl':i8_session.baseHost+'/platform/uptoken',
                    'maxSize':1024*1024*30,
                    'fileUploaded':function(){
                        if(kankanBox[0].value.length==0){
                            insertAtCursor(kankanBox[0], '分享附件');
                        }
                        /*else{
                            insertAtCursor(kankanBox[0], '分享附件');
                        }
                        if(kankanBox[0].value.indexOf('分享附件') == -1){
                            if(kankanBox[0].value.length>0) {
                                insertAtCursor(kankanBox[0], '分享附件');
                            }
                        }*/
                        $(".kk-sub",posterContainer).removeClass("post-btn-disabled");
                    }
                };
                kankanAttachment= fileuploader.i8uploader(options);
                $(".attachment-btn",posterContainer).click(function(){

                })
                /*监控发布可用状态*/
                var lisener = "input";
                if ($.browser.msie) {
                    if ($.browser.version == "7.0" || $.browser.version == "8.0") {
                        lisener = "propertychange";
                    } else if ($.browser.version == "9.0") {
                        lisener = undefined;
                    }
                }
                if (lisener) {
                    kankanBox.unbind(lisener).bind(lisener, function () {/*监测按钮是否可用*/
                        if ($.trim(kankanBox.val()).length > 0) {
                            $(".kk-sub",posterContainer).removeClass("post-btn-disabled");
                        } else {
                            $(".kk-sub",posterContainer).addClass("post-btn-disabled");
                        }
                    });
                } else {/*IE9单独处理*/
                    if (window['mkkTimer']) {
                        clearInterval(window['mkkTimer']);
                    }
                    window['mkkTimer'] = setInterval(function () {
                        if ($.trim(kankanBox.val()).length > 0) {
                            $(".kk-sub",posterContainer).removeClass("post-btn-disabled");
                        } else {
                            $(".kk-sub",posterContainer).addClass("post-btn-disabled");
                        }
                    }, 100);
                }
                $(document).click(function(){
                    $('.release-scope-group,.face-layout',posterContainer).slideUp(200);
                });
                $('.kk-body .attachment-btn',posterContainer).hover(function(){
                    $('.kk-tab .attachment-tip',posterContainer).show();
                },function(){
                    $('.kk-tab .attachment-tip',posterContainer).hide();
                });
                //侃侃发布
                $(".kk-sub",posterContainer).click(function(){
                    var postData={},postUrl="";
                    postData['attachments']= kankanAttachment.getUploadFiles();
                    if(setting.sendType=="kankan"){
                        var kankanContent = $(".kk-content-text", posterContainer).val().replace(/<[^>]+>/g, "");
                        if (kankanContent.length == 0) {
                            emptyWarn($(".kk-content-text", posterContainer));
                            return;
                        }
                        var scope = $(".release-scope", posterContainer).attr("scope-value");
                        if (scope == "scope-null"&&setting.kkConfig.scope) {
                            boxHoverWarn($(".tab-content", posterContainer), "发布范围未选择!");
                            return;
                        }
                        if(scope=="2"){//当发布范围为仅@可见时，检测内容是否包含@对象
                            var tag=0;
                            _.each(kankanSelectorCache,function(item){
                                tag+=(kankanContent.indexOf(item.uname)>-1?1:0);
                            })
                            if(tag==0){
                                boxHoverWarn($(".tab-content", posterContainer), "发布内容未包含@对象!");
                                return;
                            }
                        }
                        if(!setting.kkConfig.scope){//若发布范围设置为false，则直接取设置的defalultScope
                            scope=setting.kkConfig.defalultScope;
                        }
                        if($.trim(kankanContent).length==0){
                            boxHoverWarn($(".tab-content", posterContainer), "发布内容不能为空!");
                            return;
                        }
                        if (setting.postBefore) {
                            setting.postBefore();
                        }
                        kankanContent=kankanContentFormate(kankanContent);
                        if(setting.kkConfig.appid){
                            postData['appid']=setting.kkConfig.appid;
                            if(postData.appid=="460fdf91-952d-4bef-b3d7-51e975c3045e"){//生日祝福
                                var gift=posterContainer.find("span.gfactive").attr("gid");
                                if(gift) {
                                    kankanContent += "[" + gift + "]";
                                }
                            }
                        }
                        if(setting.others.sourceid){//参考ID
                            postData['sourceid']=setting.others.sourceid;
                        }
                        postData= $.extend(postData,{scopeType:scope,kankanContent:kankanContent}),postUrl=i8_session.ajaxHost+'webajax/kkcom/postblog';
                    }else if(setting.sendType=="comment"){//侃侃评论
                        var fatherkkid=setting.others.fatherkkid;
                        var kankanContent = $(".kk-content-text", posterContainer).val().replace(/<[^>]+>/g, "");
                        if ($.trim(kankanContent).length == 0) {
                            emptyWarn($(".kk-content-text", posterContainer));
                            return;
                        }
                        kankanContent=kankanContentFormate(kankanContent);
                        if(setting.others.replyid){
                            postData['replyid']=setting.others.replyid;
                        }
                        if(setting.others.appid){
                            postData["appid"]=setting.others.appid;
                        }
                        if(setting.others.sourceid){//参考ID
                            postData['sourceid']=setting.others.sourceid;
                        }
                        postData= $.extend(postData,{msgContent:kankanContent,fatherkkid:fatherkkid}),postUrl=i8_session.ajaxHost+'webajax/kkcom/comment-add';
                    }else if(setting.sendType=="appcomment"){//应用评论
                        var sourceid=setting.others.sourceid,appid=setting.others.appid;
                        var kankanContent = $(".kk-content-text", posterContainer).val().replace(/<[^>]+>/g, "");
                        if ($.trim(kankanContent).length == 0) {
                            emptyWarn($(".kk-content-text", posterContainer));
                            return;
                        }
                        if(setting.others.replyid){
                            postData['replyid']=setting.others.replyid;
                        }
                        kankanContent=kankanContentFormate(kankanContent);
                        postData= $.extend(postData,{msgContent:kankanContent,appid:appid,sourceid:sourceid}),postUrl=i8_session.ajaxHost+'webajax/kkcom/app-comment-add';
                    }
                    if($(this).hasClass("post-btn-disabled")){return ;}
                    $(this).addClass("post-btn-disabled").text("发布中...");
                    $.post(postUrl,postData,function(response){
                        $(".kk-sub",posterContainer).addClass("post-btn-disabled").text("发布");
                        if(response.Result){
                            $(".kk-content-text", posterContainer).val("");
                            kankanSelectorCache=[];
                            if(kankanAttachment){
                                kankanAttachment.uploaderReset();//重置上传控件
                            }
                            boxHoverWarn($(".tab-content", posterContainer), "发布成功！",1);
                            //发布范围重置
                            $(".release-scope-title",posterContainer).removeClass("only-visible-btn-t");
                            $(".scope-txt-title",posterContainer).text("请选择发布范围");
                            $(".release-scope",posterContainer).attr("scope-value","scope-null");
                            if(setting.postCompleted){
                                setting.postCompleted(response.ReturnObject);
                            }
                        }else{
                            var _description = response.Description||'';
                            boxHoverWarn($(".tab-content", posterContainer), _description);
                        }
                    },"json")
                })
            }
        };
        return new function(){
            this.init=function(){
                posterContainer.html(frameHTML);
                //事件绑定
                postEventBind();
                //if(setting.kkConfig.defalultScope==2){//群组默认选选择仅@可见
                    $(".only-visible-btn",posterContainer).trigger("click");
               // }
            };
            this.addUser2Cache=function(uData){
                kankanSelectorCache.push(uData);
            };
            this.clearInput=function(){
                $(".kk-content-text", posterContainer).val("")
            };
            this.defAddTxt2Box=function(text){
                $(".kk-content-text", posterContainer).val(text)

            }
        };
    };
    var emptyWarn= function (txtobj) {
        var colors = ["rgb(255,255,255)", "rgb(255,238,238)", "rgb(255,221,221)", "rgb(255,204,204)", "rgb(255,187,187)", "rgb(255,255,255)", "rgb(255,238,238)", "rgb(255,221,221)", "rgb(255,204,204)", "rgb(255,187,187)", "rgb(255,255,255)"];
        var colorAnimate = function (cls) {
            var clrTimer = null;
            if (cls.length > 0) {
                clrTimer = setTimeout(function () {
                    txtobj.css({ "background-color": cls.shift() });
                    colorAnimate(cls);
                }, 100);
            } else {
                clearTimeout(clrTimer);
            }
        }
        colorAnimate(colors);
    };
    var boxHoverWarn=function (box, txt,type) {
        var font_color="rgb(255,167,167)";
        if(type==1){
            font_color="rgb(0, 186, 236)";
        }
        var stopPost = $('<div class="warnMsg"><span style="color:'+font_color+'">' + txt + '</span></div>');
        box.append(stopPost);
        var tt=setTimeout(function () {
            stopPost.slideUp(100,function(){
                $(this).remove();
                clearTimeout(tt);
            })
        }, 1500);
    };
    //侃侃内容转换
    var kankanContentFormate=function(content){
        if(kankanSelectorCache.length>0) {
           content=content.replace(/@[\u4E00-\u9FA5a-zA-Z0-9\-\(\)\.]{1,}\s/g, function (item) {
                //kankanSelectorCache
                var uitem=_.findWhere(kankanSelectorCache,{uname:$.trim(item)});
                if(uitem){
                    return '$%$' + uitem.uname.replace("@", "") + ',' + uitem.uid + ','+uitem.type+'$%$ ';
                }
            });
        }
        return content;
    };
    var insertAtCursor=function (myField, myValue) {//光标指定位置插入指定内容
        /*IE support*/
        if (document.all&&window["kkRng"]) {
            myField.focus();
            window["kkRng"].text = myValue;
            window["kkRng"].select();
            window["kkRng"] = undefined;
        }
        /*MOZILLA NETSCAPE support */
        else if (myField.selectionStart || myField.selectionStart == '0') {
            var startPos = myField.selectionStart;
            var endPos = myField.selectionEnd;
            var restoreTop = myField.scrollTop;
            myField.value = myField.value.substring(0, startPos) + myValue + myField.value.substring(endPos, myField.value.length);
            if (restoreTop > 0) {
                myField.scrollTop = restoreTop;
            }
            myField.focus();
            myField.selectionStart = startPos + myValue.length;
            myField.selectionEnd = startPos + myValue.length;
        } else {
            myField.value += myValue;
            myField.focus();
        }
    };
    /*textarea里选中指定位置文本*/
    var setTextSelected=function (inputDom, startIndex, endIndex) {
        if (inputDom.setSelectionRange) {
            inputDom.setSelectionRange(startIndex, endIndex);
        }
        else if (inputDom.createTextRange) //IE
        {
            var range = inputDom.createTextRange();
            range.collapse(true);
            range.moveStart('character', startIndex);
            range.moveEnd('character', endIndex - startIndex - 1);
            range.select();
        }
        inputDom.focus();
    };
    var tplRenderData={
        "framebox":function(data){
            var paramData=data||{};
            var tpl=require('../template/frameBox.tpl');
            var frame_render=template(tpl);
            return frame_render(paramData);
        },
        "kankan":function(data){
            var paramData=data||{};
            var tpl=require('../template/kankan.tpl');
            var kankan_render=template(tpl);
            return kankan_render(paramData);
        },
        "schedule":function(data){
            var paramData=data||{};
            var tpl=require('../template/schedule.tpl');
            var schedule_render=template(tpl);
            return schedule_render(paramData);
        },
        "daily":function(data){
            var paramData=data||{};
            var tpl=require('../template/daily.tpl');
            var daily_render=template(tpl);
            return daily_render(paramData);
        },
        "faceCanvas":function(data){
            var paramData=data||{};
            var item_render=template(require('../template/i8faceitem.tpl'));
            return item_render(paramData);
        },
        "task":function(data){
            var paramData=data||{};
            var tpl=require('../template/task.tpl');
            var daily_render=template(tpl);
            return daily_render(paramData);
        }
    };
    return postMain;
})