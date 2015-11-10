define(function (require, exports,modules) {

    var i8reg=require('../../javascripts/common/i8reg');
    var i8ui=require('../../javascripts/common/i8ui');
    var util=require('../../javascripts/common/util');
    var rebind=util.getUrlParam('rebind');
    var ajax=require('./ajax');
    var idcard=$('#idcard');
    var cardnum=$('#cardnum');
    var password=$('#password');

    var updatebox=$('#updatebox');
    var rebindbox=$('#rebindbox');


    var oldpassword=$('#oldpassword');
    var newpassword=$('#newpassword');
    var againpassword=$('#againpassword');






    var init=function(){
        $('#rebind').on('click',function(){
            rebindbox.toggle('fast');
            updatebox.hide();
        })

        $('#cancelbind').on('click',function(){
            rebindbox.toggle('fast');
        })

        $('#savebind').on('click',function(){
            if(!i8reg.checkCID(idcard.val())){
                i8ui.simpleAlert('请输入正确的身份证号码',idcard.focus());
                return;
            }
            if(!i8reg.checkZXKH(cardnum.val().replace(/[ ]/g,''))){
                i8ui.simpleAlert('请输入正确的卡号',cardnum.focus());
                return;
            }
            if(!i8reg.checksixPsw(password.val())){
                i8ui.simpleAlert('请输入正确的密码',password.focus());
                return;
            }
            ajax.postData({
                "fun":'BindingEmpPay',
                "param":{
                    IDNumber:idcard.val(),
                    NewCardNo:cardnum.val().replace(/[ ]/g,''),
                    Password:password.val()
                }
            },function(data){
                if($.type(data)=='object'&&data.Result){
                    i8ui.write('重新绑定成功！');
                    $('#cardnumber').html('**********'+cardnum.val().substr(-4));
                    $('input').val('');
                    rebindbox.hide('fast');
                }else{
                    i8ui.error('重新绑定失败，'+(data.Description||'网络异常，请重试')+'！');
                }
            },'bindingemppay');

        });

        $('#update').on('click',function(){
            updatebox.toggle('fast');
            rebindbox.hide();
        })


        $('#cancelupdate').on('click',function(){
            updatebox.toggle('fast');
        })


        $('#saveupdate').on('click',function(){

            if(!i8reg.checksixPsw(oldpassword.val())){
                i8ui.simpleAlert('请输入正确的密码',oldpassword.focus());
                return;
            }
            if(!i8reg.checksixPsw(newpassword.val())){
                i8ui.simpleAlert('请输入新的6位数的密码',newpassword.focus());
                return;
            }
            if(againpassword.val()!=newpassword.val()){
                i8ui.simpleAlert('确认密码与新密码不一致',againpassword.focus());
                return;
            }

            ajax.postData({
                oldPassword:oldpassword.val(),
                password:newpassword.val()
            },function(data){
                if($.type(data)=='object'&&data.Result){
                    i8ui.write('修改成功！');
                    updatebox.hide('fast');
                }else{
                    i8ui.error('修改失败，'+(data.Description||'网络异常，请重试')+'！');
                }
            },'updatepassword');

        });
        if(rebind){
            $('#rebind').trigger('click');
        }

    }
    init();
});