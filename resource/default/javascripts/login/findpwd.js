//验证码倒计时
function beginSetTime(){
    var time = 60000;
    util.setCookies2('i8codeinfo',"120000",60);
    setTfunc(time);
    function setTfunc(time){
        $("#js_pub_reg_btn").addClass("disabled").html();
        if(time > 0){
            time = time - 1000;
            $("#js_pub_reg_btn").html(time/1000+'秒后重发');
            setTimeout(function(){
                setTfunc(time);
            },1000)
        }else{
            $("#js_pub_reg_btn").removeClass('disabled').html('获取验证码');
        }
    }

}
//验证错误提示方法
function falert(message,btnDom){
    i8ui.formalert({title:message,stype: true, btnDom: btnDom});
}
//获取验证码
function getYZM(){
    var passport = $.trim($("#txt_passport").val()).toLocaleLowerCase();
    if(!regObj.fmobileTest(passport) && !regObj.femailTest(passport)){
        falert("登录账号格式不正确！", $("#js_mobile"));
        return;
    }
    $.ajax({
        url: i8_session.ajaxHost+'webajax/login/addValidInfo',
        type: 'post',
        dataType: 'json',
        data: {jdata: {passport: passport,type:5}},
        cache: false,
        success: function(result){
            if(result.Result){
                $("#js_lg_tp_div").remove();
                i8ui.write('验证码已发送成功！');
                beginSetTime();
            }else{
                falert(result.Description, $("#txt_passport"));
            }
        },
        error: function(e1,e2,e3){
            i8ui.error("操作失败");
        }
    });
}
//验证码验证
$("#js_register_btn").click(function(){
    var passport = $.trim($("#txt_passport").val()).toLocaleLowerCase();
    var code = $.trim($("#txt_code").val())
    if(!regObj.fmobileTest(passport) && !regObj.femailTest(passport)){
        falert("登录账号格式不正确！", $("#txt_passport"));
        return;
    }
    if(code == ""){
        falert("验证码不能为空！", $("#txt_code"));
        return;
    }
    $.ajax({
        url: i8_session.ajaxHost+'webajax/login/check',
        type: 'post',
        dataType: 'json',
        data: {jdata: {Passport:passport, Code:code}},
        cache: false,
        success: function(data){
            if(data.Result){
                i8ui.write('验证成功！');
                window.location.href = '/login/resetpwd?passport='+ passport+'&code='+code;
            }else{
                i8ui.error(data.Description);
            }
        },
        error: function(e1,e2,e3){
            i8ui.error("获取分类列表失败");
        }
    });
});
$(function(){
    if(util.getCookies("i8codeinfo") == '60000'){
        beginSetTime();
    }
    //获取手机验证码事件
    $("#js_pub_reg_btn").click(function(){
        if($(this).attr("class").indexOf("disabled")>=0){
            return;
        }
        getYZM();
    });
})