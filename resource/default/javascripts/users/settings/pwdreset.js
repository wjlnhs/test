/**
 * Created by jialin on 2014/12/12.
 */
define(function (require, exports) {
    var fw_form=require('../../common/fw_form.js');
    var i8ui = require('../../common/i8ui');
    //加入表单验证
    var of = fw_form.fw_overification.createNew();
    of.matching({ obj: $("#txt_pwd_new, #txt_pwd_rep") });


    $("#txt_pwd_new").keyup(function () {
        pwStrength($(this).val());
    });
    $("#txt_pwd_new").blur(function () {
        pwStrength($(this).val());
    });
    //验证回调函数
    function getreturn() {
        if ($("#txt_pwd_new").val() == $("#txt_pwd_rep").val()) {
            return true;
        }
        return false;
    }

    function ChangePwd() {
        var oldPassword = $("#txt_pwd_now").val();
        var newPassword = $("#txt_pwd_new").val();
        var repwd = $("#txt_pwd_rep").val();
        if (!of.result()) {
            return false;
        }
        if(newPassword!=repwd){
            i8ui.error("新密码和确认密码不一致！");
            return false;
        }
        if(newPassword==oldPassword){
            i8ui.error("新密码和旧密码不能相同！");
            return false;
        }
        ChangePassword(oldPassword,newPassword);
        $("#txt_pwd_now").val("");
        $("#txt_pwd_new").val("");
        $("#txt_pwd_rep").val("");
        return false;
    }
    function ChangePassword(oldPassword,newPassword) {
        $.ajax({
            url: i8_session.ajaxHost+"webajax/settings/ChangePassword?" + Math.random(),
            type: "post",
            dataType: "json",
            data: { "oldPassword": oldPassword, "newPassword": newPassword},
            success: function (data, textStatus) {
                if (data.Result) {
                    i8ui.successMask("恭喜！修改密码成功");
                }
                else {
                    i8ui.error(data.Message);
                }
            },
            error: function (e1, e2, e3) {

            }
        });
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

    //提交表单
    $('#save_pwd').on('click',function(){

        ChangePwd()
    })
})