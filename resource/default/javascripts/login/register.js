var styleJson = {style:"width:310px;height:30px; line-height:30px;"};
$("#js_ontype").setSelect(styleJson);
$("#js_address").setSelect(styleJson);
$("#js_personnums").setSelect(styleJson);
var pubCodeDom = $("#js_pub_reg_btn");

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
//验证错误提示方法
function falert(message,btnDom){
    i8ui.formalert({title:message,stype: true, btnDom: btnDom});
}
//获取验证码
function getYZM(){
    var mobile = $.trim($("#js_mobile").val());
    var pub_code = $.trim($("#js_pub_code").val());

    if(!regObj.fmobileTest(mobile)){
        falert("请输入正确的手机号", $("#js_mobile"));
        return;
    }
    if(pub_code == ""){
        falert("请输入右侧的验证码", $("#js_pub_code"));
        return;
    }
    $.ajax({
        url: i8_session.ajaxHost+'webajax/login/addValidInfo',
        type: 'get',
        dataType: 'json',
        data: {jdata: {passport: mobile, get_code:pub_code ,type:1}},
        cache: false,
        success: function(result){
            if(result.Result){
                $("#js_lg_tp_div").remove();
                i8ui.write('验证码已成功发送至您的手机！');
                beginSetTime();
            }else{
                if(result.Code == 'error'){
                    falert(result.Description, $("#js_pub_code"));

                }else{
                    falert(result.Description, $("#js_mobile"));
                }
            }
        },
        error: function(e1,e2,e3){
            i8ui.error("获取分类列表失败");
        }
    });
}
//立即注册
function setRegister(){
    var mobile = $.trim($("#js_mobile").val());
    var code = $.trim($("#js_code").val());
    var passportName = $.trim($("#js_passportname").val());
    var accountName = $.trim($("#js_accountname").val());
    var Industry = $("#js_ontype").getKey();
    var Location = $("#js_address").getKey();
    var UserNum = $("#js_personnums").getKey();
    if(!regObj.fmobileTest(mobile)){
        falert("请输入正确的手机号", $("#js_mobile"));
        return;
    }
    if(code == ""){
        falert("请输入正确的手机验证码", $("#js_code"));
        return;
    }
    if(!regObj.ftest(passportName,regObj.username)){
        falert("请输入2-15个数字、字母、汉字", $("#js_passportname"));
        return;
    }
    if(!regObj.ftest(accountName,regObj.nametext)){
        falert("请输入2-15个数字、字母、汉字", $("#js_accountname"));
        return;
    }
    $("#js_lg_tp_div").remove(); //关闭输入错误提示
    $("#js_register_btn").addClass("disabled").html('注册中...');
    $.ajax({
        url: i8_session.ajaxHost+'webajax/login/activeCreate',
        type: 'post',
        dataType: 'json',
        data: {jdata: {Passport:mobile, Code:code, ValidType:1, PassportName: passportName, AccountName: accountName, Industry:Industry, Location:Location, UserNum:UserNum}},
        cache: false,
        success: function(data){
            if(data.Result){
                i8ui.write('注册成功！');
                var rtobj = data.ReturnObject;
                $("#js_register_btn").removeClass("disabled").html('注册成功');
                var rturl = '/login/invite';
                var hostArrs = window.location.host.split('.');
                hostArrs[0] = rtobj.LogInfo.domain;
                window.location.href =location.protocol+"//"+ hostArrs.join(".") +'/newcontext?key='+ rtobj.LogInfo.nodekey +'&auth='+data.auth+'&from=rgt&returl='+rturl;
            }else{
                i8ui.error(data.Description);
                $("#js_register_btn").removeClass("disabled").html('立即注册');
            }
        },
        error: function(e1,e2,e3){
            i8ui.error("获取分类列表失败");
        }
    });
}
$(function(){
    if(util.getCookies("i8codeinfo") == '120000'){
        beginSetTime();
    }
    $("#js_mobile").blur(function(){
        yzPassport($(this));
    });
    $("#js_mobile").focus(function(){
        if($(this).html() == "获取验证码"){
            pubCodeDom.removeClass("disabled");
        }
    });
    //获取手机验证码事件
    pubCodeDom.click(function(){
        if($(this).attr("class").indexOf("disabled")>=0){
            return;
        }
        getYZM();
    });
    //注册事件
    $("#js_register_btn").click(function(){
        setRegister();
    });
    //更新图片验证码
    $("#js_yzm_img").click(function(){
        this.src = '/verifyCode?'+(new Date).valueOf();
    });
})