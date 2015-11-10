define(function (require, exports,modules) {

    var i8reg=require('../../javascripts/common/i8reg');
    var i8ui=require('../../javascripts/common/i8ui');
    require('./chart');
    var ajax=require('./ajax')



    var form={
        name:$('#name'),
        passport:$('#passport'),
        cardno:$('#cardno'),
        password:$('#password')
    }


    var init=function(){
        $('#bindcard').on('click',function(){
            var formbox=$('#formbox');
            if(i8reg.checkAll(formbox)){
                ajax.postData({
                    "param":{
                        NewCardNo:form.cardno.val().replace(/[ ]/g,''),
                        Password:form.password.val()
                    }
                },function(data){
                    if($.type(data)=='object'&&data.Result){
                        i8ui.write('绑定成功！');
                        window.location.href=i8_session.baseHost+'employeepay/home';
                    }else{
                        i8ui.error('绑定失败，'+(data.Description||'网络异常，请重试')+'！');
                    }
                },'bindingemppay');
            }
        });
    }
    init();
});