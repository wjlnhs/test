/**
 * Created by chenshanlian on 2015/4/23.
 */
var emailDom = $("#txt_email");
var pwdDom = $("#txt_pwd");
var pubCodeDom = $("#js_pub_token");
var rtData = null;
var jumpUrl = '';
var host = '';
var redirectUrl = '';
var domain = '';
emailDom.val(util.getCookies("i8passport"));
var pwderror = util.getCookies("i8xiaoshipwderror");
function Loging(){
    var usrid= $.trim(emailDom.val()).toLocaleLowerCase();
    var upasswd= $.trim(pwdDom.val());
    var imgCodeDom = document.getElementById("js_img_code");
    var imgcode = imgCodeDom ? $.trim(imgCodeDom.value) : "";
    if(usrid == ""){
        i8ui.txterror("请输入手机号或者邮箱！",emailDom);
        return;
    }
    //验证账号格式
    if(!regObj.ftest(usrid, regObj.email) && !regObj.ftest(usrid, regObj.mobile)){
        i8ui.txterror("请输入正确的手机号或者邮箱！",emailDom);
        i8ui.txtBoxWarn(emailDom);
        return;
    }
    if(upasswd == ""){
        $("#txt_pwd").focus();
        i8ui.txtBoxWarn(pwdDom);
        return;
    }
    //验证图片验证码是否为空
    if(imgCodeDom && imgcode == ""){
        i8ui.txterror("请输入图片验证码！",$(imgCodeDom));
        i8ui.txtBoxWarn($(imgCodeDom));
        return;
    }
    var iskeep7days=document.getElementById("js_keep7days").checked;
    var fromParam=jQuery.url.param("from")?"&from="+jQuery.url.param("from"):"";
    var retUrl=encodeURIComponent(jQuery.url.param("returl"));
    if($("#btn_submit").hasClass("submit-ing")){return;}
    $("#btn_submit").addClass("submit-ing").text("登录中…").css({"background-color":"#a5a5a5"});
    $.post('/webajax/usrdata/authusrlogin', {
        email: usrid,
        password: upasswd,
        keep7days:iskeep7days,
        imgcode:imgcode,
        from:jQuery.url.param("from"),
        returl:retUrl
        },
        function (response) {
            if(response.Result&&response.loginType=="dotnet"){
                try{window.opener.location.reload()}catch (e){}//尝试刷新登入前页面
                var accountList=response.ReturnObject;
                if(accountList.length>0){
                    window.location.href=location.protocol+"//"+response.host+"/Community/Home.aspx?a="+accountList[0].AccountID;
                }else if(accountList.length==0){//无可进入社区
                    noCommunityEnter(usrid);
                }else{

                }
            }else if (response.Result) {
                try{window.opener.location.reload()}catch (e){}//尝试刷新登入前页面
                util.delCookies('i8xiaoshipwderror');
                util.setCookies("i8passport",emailDom.val());
                //var pbc=util.getCookies("u");
                rtData = response.ReturnObject;
                if(response.ReturnObject.dego) {
                    //domain = response.ReturnObject.host.split('.')[0];
                    //host = response.ReturnObject.host;
                    location.href =location.protocol+"//"+decodeURIComponent(response.ReturnObject.entrance);
                    //openUrl();
                }else {
                    if (response.ReturnObject.dctoken) {//有短信验证 暂时直接登录
                        domain = response.ReturnObject.host.split('.')[0];
                        host = response.ReturnObject.host;
                        redirectUrl = response.ReturnObject.redirectUrl;
                        showYzm(response.ReturnObject.aid,response.ReturnObject.userid,response.ReturnObject.domain,response.ReturnObject.sid,response.ReturnObject.nodekey);
                    } else {//无动码令，选择社区
                        var accountlist = response.ReturnObject.alist;
                        util.setCookies("i8passport",emailDom.val());
                        var htmlstr = "";
                        if (accountlist.length > 0) {
                            for (var i = 0; i < accountlist.length; i++) {
                                var comItem = accountlist[i];
                                if (comItem.status == 0) {
                                    host = comItem.host;
                                    redirectUrl = comItem.redirectUrl;
                                    jumpUrl= location.protocol+"//"+ host + redirectUrl +fromParam+"&returl="+retUrl;
                                    if(!comItem.dctoken) {
                                        htmlstr += '<a href="' + jumpUrl + '" class="community-ops"><input type="radio" name="comm-type" />' + comItem.aname + '</a>';
                                    }else{
                                        htmlstr += '<a class="community-ops mgsvalid-ops" target-id="'+comItem.aid+'"><input type="radio" name="comm-type" />' + comItem.aname + '</a>';
                                    }
                                } else {
                                    htmlstr += '<p><a>' + accountlist[i].aname + '</a> （你在该社区已禁用）</p>';
                                }
                            }
                            var sbox = i8ui.showbox({
                                title: "选择进入的社区",
                                cont: htmlstr
                            });
                            //选择社区事件,该社区有短信验证码
                           $(sbox).on("click","a.mgsvalid-ops",function(){
                               var target_id=$(this).attr("target-id");
                               for(var i=0;i<accountlist.length;i++){
                                   if(accountlist[i].aid==target_id){
                                       var targetAct=accountlist[i];
                                       domain = accountlist[i].host.split('.')[0];
                                       host = accountlist[i].host;
                                       showYzm(targetAct.aid,targetAct.userid,targetAct.domain,targetAct.sid,targetAct.nodekey);
                                       sbox.close();
                                   }
                               }
                            });
                        }else{
                            i8ui.error("没有可进入的社区！"); $("#btn_submit").text("登 录").removeAttr("style").removeClass("submit-ing");
                        }
                    }
                }
            } else {
                $("#btn_submit").text("登 录").removeAttr("style").removeClass("submit-ing");
                if(response.Code == 'error'){
                    i8ui.txterror("图片验证码错误！",$(imgCodeDom));
                    i8ui.txtBoxWarn($(imgCodeDom));
                }else{
                    var emsg=response.desc || response.Description;
                    if(emsg.length==0){
                        emsg=response.ReturnObject.Description;
                    }
                    i8ui.error(emsg);
                }
                if(response.ReturnObject && response.ReturnObject.Count >= 3){
                    shoeErrorCode();
                }
            }

    }, "json")
}
//显示短信验证层
function showYzm(aid,uid,subdomain,sid,nodekey,iskeep7days){
    $("#js_login").hide();
    $("#js_token").show();
    if(rtData.mobile){
        $("#js_mobile").html(rtData.mobile);
        $("#js_mobile").prev().html("您绑定的手机号");
        beginSetTime();
    }else{
        pubCodeDom.addClass("disabled");
    }
    //发送手机验证码事件
    pubCodeDom.click(function(){
        if($(this).attr("class").indexOf("disabled")>=0){
            return;
        }
        getYZM(aid,uid);
    });
    if(!rtData.mobile){
        $("#js_txt_mobile").unbind();
        $("#js_txt_mobile").on("blur",function(){
            console.log(1);
            yzPassport($(this));
        });
        $("#js_txt_mobile").on("focus",function(){
            pubCodeDom.removeClass("disabled");
        });
    }
    //验证验证码正确性
    $("#verification_token").click(function(){
        var mbDom = $("#js_txt_mobile");
        var passport = rtData.mobile || mbDom.val();
        var code = $.trim($("#txt_code").val());
        if(!regObj.fmobileTest(passport)){
            falert("手机格式不正确！", $("#js_mobile"));
            return;
        }
        if(code == ""){
            falert("验证码不能为空！", $("#txt_code"));
            return;
        }
        $.ajax({
            url: '/webajax/login/loginAuth',
            type: 'post',
            dataType: 'json',
            data: {jdata: {passport:passport, code:code,domain:subdomain,sid:sid,uid:uid,aid:aid,nk:nodekey},r:Math.random().toString()},
            success: function(data){
                if(data.Result){
                    i8ui.write('验证成功！');
                    redirectUrl=data.ReturnObject.jpmurl;
                    openUrl();
                }else{
                    i8ui.error(data.Description);
                }
            },
            error: function(e1,e2,e3){
                i8ui.error("网络异常");
            }
        });
    });
}
//获取验证码
function getYZM(aid,uid){
    var mbDom = $("#js_txt_mobile");
    var passport = rtData.mobile || mbDom.val();
    if(!regObj.fmobileTest(passport)){
        falert("手机格式不正确！", $("#js_mobile"));
        return;
    }
    if(rtData.mobile){
        $.ajax({
            url: '/webajax/login/addValidInfo',
            type: 'post',
            dataType: 'json',
            data: {jdata: {passport: passport,type:2,accountID:aid,passportID:uid}},
            cache: false,
            success: function(result){
                if(result.Result){
                    $("#js_lg_tp_div").remove();
                    i8ui.simpleWrite('验证码已发送成功！',pubCodeDom);
                    beginSetTime();
                }else{
                    i8ui.error(result.Description);
                }
            },
            error: function(e1,e2,e3){
                i8ui.error("操作失败");
            }
        });
    }else{
        yzPassport(mbDom,false,function(){
            $.ajax({
                url: '/webajax/login/addValidInfo',
                type: 'post',
                dataType: 'json',
                data: {jdata: {passport: passport,type:2}},
                cache: false,
                success: function(result){
                    if(result.Result){
                        $("#js_lg_tp_div").remove();
                        i8ui.simpleWrite('验证码已发送成功！',pubCodeDom);
                        beginSetTime();
                    }else{
                        i8ui.error(result.Description);
                    }
                },
                error: function(e1,e2,e3){
                    i8ui.error("操作失败");
                }
            });
        });
    }
}
//执行登录成功
function openUrl(){
    var fromParam=jQuery.url.param("from")?"&from="+jQuery.url.param("from"):"";
    var retUrl=encodeURIComponent(jQuery.url.param("returl"));
    jumpUrl=location.protocol+"//"+host + redirectUrl +fromParam+"&returl="+retUrl;
    window.open(jumpUrl,"_self");
}
//验证码倒计时
function beginSetTime(){
    var time = 60000;
    util.setCookies2('i8codeinfo',"120000",60);
    setTfunc(time);
    function setTfunc(time){
        pubCodeDom.addClass("disabled").html();
        if(time > 0){
            time = time - 1000;
            pubCodeDom.html(time/1000+'秒后重发');
            setTimeout(function(){
                setTfunc(time);
            },1000)
        }else{
            pubCodeDom.removeClass('disabled').html('获取验证码');
        }
    }

}
$("#btn_submit").click(Loging);
$("input").keyup(function(e){
    var e = e || window.event
    if(e && e.keyCode == 13){
        Loging();
    }
});
//显示错误过多时验证码
if(pwderror == 'oneday'){
    shoeErrorCode();
}
function shoeErrorCode(){
    util.setCookies("i8xiaoshipwderror",'oneday',1);
    $("#js_show_img_code").html('<input class="login-txt m-t10" id="js_img_code" type="text" placeholder="请输入右侧验证码" /><img id="js_yzm_img" class="vtop" src="/verifyCode" />');
    //更新图片验证码
    $("#js_yzm_img").click(function(){
        this.src = '/verifyCode?'+(new Date).valueOf();
    });
}
$(function(){
    if(/s=\{[A-F0-9]{8}(-[A-F0-9]{4}){3}-[A-F0-9]{12}\}/ig.test(location.href)){
        alert('当前帐号在其它地方登录');
    }
})
//getDomain();
function noCommunityEnter(_uid){
    var sbox = i8ui.showbox({
        title: "无可进入的社区",
        cont: '<div class="classic-ls-box"><h3>您曾经加入过的社区：</h3><div id="addedlistul"></div></div>'
    });
    $.post('/webajax/usrdata/getpsptinfo',{uid:_uid},function(response){
        if(response.Result){
            var accountItems=response.ReturnObject||[];
            var ui_html=$("<dl></dl>");
            if (accountItems.length > 0) {
                var addedlist = "";
                for (var i = 0; i < accountItems.length; i++) {
                    addedlist += "<dd>" + accountItems[i].CompanyName + " 【" + (accountItems[i].AccountStatus == 1 ? "禁用状态" : "离职状态") + "】" + "</dd>";
                }
                ui_html.html(addedlist);
                $('#addedlistul').html(ui_html);
                $("#btn_submit").text("登 录").removeAttr("style").removeClass("submit-ing");
            } else {
                $('#addedlistul').html('<span>未找到，历史数据！</span>');
            }

        }else{

        }
    },"json")
}