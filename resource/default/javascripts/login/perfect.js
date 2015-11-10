//保存
$("#js_save_btn").click(function(){
    var name = $.trim($("#txt_name").val());
    var position = $.trim($("#txt_position").val());
    var email = $.trim($("#txt_email").val() || $("#txt_email").html());
    if(!regObj.ftest(name, regObj.username)){
        i8ui.txterror("姓名格式不正确！", $("#txt_name"));
        return;
    }
    if(!regObj.femailTest(email)){
        i8ui.txterror("邮箱格式不正确！", $("#txt_email"));
        return;
    }
    var psn = {
        name: name,
        position: position,
        email: email
    }
    perFect(psn);
});
$("#txt_email").blur(function(){
    yzPassport($(this),"email");
});
function perFect(psn){
    $.ajax({
        url: '/webajax/login/updateInfoFirst',
        type: 'post',
        dataType: 'json',
        data: {jdata: psn},
        cache: false,
        success: function(data){
            if(data.Result){
                i8ui.write('保存成功！');
                console.log(i8_session);
                window.location.href = '/';
            }else{
                i8ui.error(data.Description);
            }
        },
        error: function(e1,e2,e3){
            i8ui.error("网络异常");
        }
    });
}

//账号能否使用验证方法
function yzPassport(txtDom,type){
    var passport = $.trim(txtDom.val());
    if(type == "email" && !regObj.femailTest(passport)){
        var errortps = "邮箱格式不正确！";
        if(passport == ""){
            errortps = "请填写邮箱！";
        }
        i8ui.txterror(errortps, txtDom);
        i8ui.txtBoxWarn(txtDom);
        return;
    }
    if(type == "mobile" && !regObj.fmobileTest(passport)){
        var errortps = "手机号格式不正确！";
        if(passport == ""){
            errortps = "请填写手机号！";
        }
        i8ui.txterror(errortps, txtDom);
        i8ui.txtBoxWarn(txtDom);
        return;
    }
}
