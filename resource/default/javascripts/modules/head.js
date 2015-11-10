/**
 *该文件，已转移到tips.js里
 */
define(function(require, exports){
    var i8ui = require('../common/i8ui.js');
    var util = require('../common/util.js');
    require('../common/rootbtn.js');

    //是否多社区
    if(i8_session.multiact){
        $("#js_show_communitys").show();
        var actList = [];
        //获取社区列表
        function getActList(){
            $.ajax({
                url: i8_session.ajaxHost+'webajax/login/getActList',
                type: 'post',
                dataType: 'json',
                cache: false,
                success: function(result){
                    if(result.Result){
                        var listsHTML = '';
                        actList = result.ReturnObject;
                        for(var i=0; i<actList.length; i++){
                            var item = actList[i];
                            var iscurrent =  (i8_session.aid == item.aid ? "current": "");
                            var isdef = '<em title="设为默认社区" class="spbg1 sprite-117"></em>';
                            if(item.isdef){
                                isdef = '<em title="默认社区" class="spbg1 sprite-116"></em>';
                            }
                            listsHTML += '<a class="'+iscurrent+'" domain="'+item.domain+'"><span class="namespan">'+item.aname+'</span><i class="spbg1 sprite-87"></i>'+ isdef+'</a>';
                        }
                        $("#js_community_list").html(listsHTML);
                    }else{
                            i8ui.error(result.Description);
                    }
                },
                error: function(e1,e2,e3){
                    i8ui.error("操作失败");
                }
            });
        }
        //显示|隐藏社区列表
        $("#js_show_communitys").click(function(){
            if($(this).attr("class").indexOf("up") >= 0){
                $(this).removeClass("up");
            }else{
                $(this).addClass("up");
            }
            $("#js_community_list").toggle();
            if($("#js_community_list a").length <= 0){
                getActList();
            }
        }).show();
        //社区切换
        $("#js_community_list").on("click","a",function(){
            if($(this).hasClass("current")){
                return;
            }
            var _domain=$(this).attr("domain");
            var targetAct= _.findWhere(actList,{domain:_domain});
            if(targetAct.dctoken){
               var gcodeBox= i8ui.showbox({
                    title:"进入该社区需要短信验证码",
                    cont:'<div class="valMsg-box p-t15">' +
                        (targetAct.mobile.length==0?'<div class="p10 oflow p-b10"><div class="l-hh36 fw_left"><span>*</span>绑定手机号</div><div class="p-lr-15 fw_left"><input type="text" class="w-240-h33" style="height:30px" id="txt_phoneNum"/></div></div>':"")+
                            '<div class="p10 oflow p-b10">' +
                                '<div class="l-hh36 fw_left"><span style="color:red">*</span>短信验证码</div><div class="p-lr-15 fw_left"><input type="text" class="w-128-h33" style="height:30px" id="txt_msgCode"/></div><div class="fw_left"><button class="blue-button rt" id="btn_getCode">获取验证码</button></div>' +
                            '</div>' +
                            '<div class="p10 m-b10 tright"><button class="blue-button" id="btn_submitmsg">确定</button>　<button class="gray-button" id="btn_cancelmsg">取消</button></div>' +
                        '</div>'
                });
                $("#btn_getCode").click(function(){
                    if(!$(this).hasClass("get-disabled")) {
                        var bindTel= $.trim($("#txt_phoneNum").val());
                        if(targetAct.mobile.length==0){
                            if(bindTel.length==0){
                                i8ui.error('您还未绑定手机号!');
                                return;
                            }
                        }
                        var button = $(this), sec = 59;
                        button.css({"background-color": "#bfbfbf"}).addClass("get-disabled").text("59秒后重发");
                        var timer = setInterval(function () {
                            if (sec > 0) {
                                sec--;
                                button.text(sec + "秒后重发");
                            } else {
                                sec = 59;
                                clearInterval(timer);
                                button.text("获取验证码").removeAttr("style").removeClass("get-disabled");
                            }
                        }, 1000);
                        if(targetAct.msgCode) {
                            $.post(i8_session.ajaxHost + 'webajax/appcom/getValidateCodeMsg', {code:targetAct.msgCode,aid:targetAct.aid,tel:bindTel}, function (resp) {
                                if(resp.Result){
                                    i8ui.simpleWrite('验证码已发送成功！',button);
                                }else{
                                    i8ui.error(result.Description);
                                }
                            }, "json")
                        }
                    }
                });
                $("#btn_submitmsg").click(function(){
                    var phoneNum = targetAct.mobile,valiCode= $.trim($("#txt_msgCode").val());
                    if(targetAct.mobile.length==0) {
                        phoneNum = $.trim($("#txt_phoneNum").val());
                        if (!(new RegExp("1[3-9][0-9]{9}", "g")).exec(phoneNum)) {
                            i8ui.error('请绑定正确的手机号码！');
                            return ;
                        }
                    }
                    if(valiCode.length==0){
                        i8ui.error('请输入验手机证码！');
                        return;
                    }
                    $.post(i8_session.ajaxHost + 'webajax/appcom/validateCode', {bindTel:targetAct.mobile.length==0,phoneNo: phoneNum, vcode: valiCode,dm:targetAct.domain,aid:targetAct.aid}, function (resp) {
                        if (resp.Result) {
                            createNewSocLink(targetAct,function(data){
                                window.location.href = data.openurl
                            });
                        }else{
                            i8ui.error(resp.Description);
                            $("#btn_getCode").text("获取验证码").removeAttr("style").removeClass("get-disabled");
                        }
                    }, "json");
                });
                $("#btn_cancelmsg").click(function(){ gcodeBox.close();});
                $("#txt_phoneNum").blur(function(){
                    var preBindTel=$.trim($(this).val());
                    if (!(new RegExp("1[3-9][0-9]{9}", "g")).exec(preBindTel)) {
                        i8ui.error('请绑定正确的手机号码！');
                        $(this).select();
                        return ;
                    }
                    $.post(i8_session.ajaxHost + '/webajax/login/isJoined',{jdata:{passport:preBindTel}},function(reps){
                        if(reps.Result){

                        }else{
                            i8ui.error('手机号无效，可能已被占用！');
                        }
                    },"json")
                })
            }else{
                var index = $(this).index();
                var item = actList[index];
                createNewSocLink(item,function(data){
                    window.location.href = data.openurl
                })
            }
        });
        //创建切换社区链接
        function createNewSocLink(data,callback){
            $.post(i8_session.ajaxHost+'webajax/usrdata/createauth',{jdata: data},function(resp){
                if(resp.Result){
                    if(callback){
                        callback(resp.ReturnObject);
                    }
                }
            },"json");
        }
        //设置默认社区
        $("#js_community_list").on("click",".sprite-117",function(){
            var index = $(this).parent().index();
            var item = actList[index];
            $.ajax({
                url: '/webajax/login/setDefaultAccount',
                type: 'post',
                dataType: 'json',
                cache: false,
                data:{jdata: {acid: item.aid}},
                success: function(result){
                    if(result.Result){
                        getActList();
                    }else{
                        i8ui.error(result.Description);
                    }
                },
                error: function(e1,e2,e3){
                    i8ui.error("操作失败");
                }
            });
            return false;
        });
    }else{
        $("#js_show_communitys").remove();
    }
});
