define(function (require, exports,modules) {

    var i8reg=require('../../javascripts/common/i8reg');
    var i8ui=require('../../javascripts/common/i8ui');
    var ajax=require('./ajax')

    $('.i8select').each(function(i,item){
        var _item=$(item);
        _item.val(_item.attr('seletedval'));
        _item.setSelect({
                newi8select:'newi8-select fw_left m-r10',
                dropstyle: 'newselecti',
                ckedstyle: 'newselectcked',
                cbk:function(dom){

                }
        });
    })

    $('#birthday').setTime({
        dateFmt:'yyyy-MM-dd',
        maxDate:new Date()
    });

    $('#cardexpire').setTime({
        dateFmt:'yyyy-MM-dd'
    });




    var form={
        profession:$('#profession'),//职业
        email:$('#email'),//邮箱
        sex:$('#sex'),//性别
        birthday:$('#birthday'),//出生年月
        cardtype:$('#cardtype'),//证件类别
        cardnum:$('#cardnum'),//证件号码
        cardcompany:$('#cardcompany'),//发证机构
        cardexpire:$('#cardexpire'),//证件截止时间
        country:$('#country'),//国籍
        origin:$('#origin'),//国别
        mobile:$('#mobile'),//手机
        phone:$('#phone'),//固定电话
        address:$('#address'),//家庭地址
        pcode:$('#pcode')//家庭邮编
    }

    var setDisabled=function(){
        $('#apply_process').show();
        formbox.find('input').off('focus').removeClass('checked').attr('disabled','disabled');
        formbox.find('.i8-select').off('click').attr('disabled','disabled');
        $('#submit').hide();
    }

    var formbox=$('#formbox')
    if(formbox.attr('issubmit')=='true'){
        setDisabled();
    }





    var init=function(){
        $('#submit').on('click',function(){
            var formbox=$('#formbox');
            if(i8reg.checkAll(formbox)){
                var send=function(){
                    var model={
                        Profession:form.profession.getValue(),/// 职业
                        Email:form.email.val(),/// 电子邮箱
                        Sex:form.sex.getValue(),/// 性别
                        Birthday:form.birthday.val(),/// 出生年月
                        IDType:form.cardtype.getValue(),/// 证件类型
                        IDNumber:form.cardnum.val(),/// 证件号码
                        Issuer:form.cardcompany.val(), /// 发证机关
                        Deadline:form.cardexpire.val(),/// 证件截止日期
                        Nationality:form.country.getValue(),/// 国籍
                        District:form.origin.getValue(), /// 国别/地区
                        Mobile:form.mobile.val(),/// 手机号码
                        Phone:form.phone.val(),/// 固定电话
                        HomeAddress:form.address.val(),/// 家庭地址
                        HomeZipCode:form.pcode.val(),/// 家庭邮编
                        OrgName:i8_session.orgname
                    }
                    ajax.postData(model,function(data){
                        if($.type(data)=='object'&&data.Result){
                            i8ui.write('申请成功！')
                            setDisabled();
                        }else{
                            i8ui.error('申请失败，'+(data.Description||'网络异常，请重试')+'！');
                        }
                    },'apply');
                }
                send();
            }
        });
    }
    init();
});