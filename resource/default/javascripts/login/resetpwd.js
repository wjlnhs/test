
var passport = util.getUrlParam("passport");
var code = util.getUrlParam("code");
if(passport == "" || code == ""){
    window.location.href = '/login/findpwd';
}
//pwStrength函数
//当用户放开键盘或密码输入框失去焦点时,根据不同的级别显示不同的颜色
function pwStrength(pwd) {
    O_color = "#808080";
    L_color = "#FF0000";
    M_color = "#FF9900";
    H_color = "#74BC00";
    var _tips = "";
    if (pwd == null || pwd == '') {
        Lcolor = Mcolor = Hcolor = O_color;
    }
    else {
        S_level = checkStrong(pwd);
        switch (S_level) {
            case 0:
                Lcolor = Mcolor = Hcolor = O_color;
                _tips = "";
            case 1:
                Lcolor = L_color;
                Mcolor = Hcolor = O_color;
                _tips = '　弱';
                break;
            case 2:
                Lcolor = Mcolor = M_color;
                Hcolor = O_color;
                _tips = '　中';
                break;
            default:
                Lcolor = Mcolor = Hcolor = H_color;
                _tips = '　强';
        }
    }

    document.getElementById("strength_L").style.background = Lcolor;
    document.getElementById("strength_M").style.background = Mcolor;
    document.getElementById("strength_H").style.background = Hcolor;
    document.getElementById("password_tips").innerHTML = _tips;
    return;
}
//bitTotal函数
//计算出当前密码当中一共有多少种模式
function bitTotal(num) {
    modes = 0;
    for (i = 0; i < 4; i++) {
        if (num & 1) modes++;
        num >>>= 1;
    }
    return modes;
}
//测试某个字符是属于哪一类.
function CharMode(iN) {
    if (iN >= 48 && iN <= 57) //数字
        return 1;
    if (iN >= 65 && iN <= 90) //大写字母
        return 2;
    if (iN >= 97 && iN <= 122) //小写
        return 4;
    else
        return 8; //特殊字符
}
function checkStrong(sPW) {
    if (sPW.length <= 4)
        return 0; //密码太短
    Modes = 0;
    for (i = 0; i < sPW.length; i++) {
        //测试每一个字符的类别并统计一共有多少种模式.
        Modes |= CharMode(sPW.charCodeAt(i));
    }
    return bitTotal(Modes);
}
$("#txt_password1").keyup(function () {
    pwStrength($(this).val());
});
$("#txt_password1").blur(function () {
    pwStrength($(this).val());
    if($(this).val().length <8 || $(this).val().length >20){
        i8ui.trterror("密码长度不正确！",$("div.lev-box"));
    }
});
$("#txt_password2").blur(function () {
    var pwd1 = $.trim($("#txt_password1").val());
    var pwd2 = $.trim($("#txt_password2").val());
    if(pwd1 != "" && pwd2 != pwd1){
        i8ui.txterror("两次密码不一致！",$("#txt_password2"));
    }
});

//修改密码
$("#js_save_btn").click(function(){
    var pwd1 = $.trim($("#txt_password1").val());
    var pwd2 = $.trim($("#txt_password2").val());
    if(pwd1.length <8 || pwd1.length >20){
        i8ui.trterror("密码长度不正确！",$("div.lev-box"));
        return;
    }
    if(pwd1 != "" && pwd2 != pwd1){
        i8ui.txterror("两次密码不一致！",$("#txt_password2"));
        return;
    }
    var jdata = {
        passport: passport ,
        code: code,
        newpassword: pwd1
    }
    $.ajax({
        url: i8_session.ajaxHost+'webajax/login/userResetPassword',
        type: 'post',
        dataType: 'json',
        data: {jdata: jdata},
        cache: false,
        success: function(data){
            if(data.Result){
                i8ui.write('修改成功！');
                window.location.href = '/';
            }else{
                i8ui.error(data.Description);
            }
        },
        error: function(e1,e2,e3){
            i8ui.error("网络异常");
        }
    });
});