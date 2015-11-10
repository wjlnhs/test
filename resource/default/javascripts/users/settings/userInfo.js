/**
 * Created by jialin on 2014/12/10.
 */
define(function (require, exports) {
    var i8reg = require('default/javascripts/common/i8reg');
    var util = require('../../common/util.js');
    var i8ui = require('default/javascripts/common/i8ui');
    var regObj = require('../../common/regexp.js');
    var i8City = require('default/javascripts/plugins/i8city/i8city');
    //require('default/javascripts/common/fw_cpec');
    /*build(remove.start)*/
    require('default/javascripts/common/wdatepicker');
    /*build(remove.end)*/
    require('default/javascripts/users/settings/userInfo/personalInfo.js');
    require('default/javascripts/users/settings/userInfo/jobInfo');
    /*build(remove.start)*/
    require('default/javascripts/common/underscore-min-cmd');
    /*build(remove.end)*/
    var userPassport = null;
    var clearTime = false;
    //pageload
    function loadPassport(){
        $.post(i8_session.ajaxHost+'webajax/settings/GetPassportEntity?'+ Math.random(),function(data){
            console.log(data);
            if(data.Result){
                var Identitys=data.ReturnObject.Identitys;
                var Email=null,Mobile=null;
                for(var i=0;i<Identitys.length;i++){
                    if(Identitys[i].Type==0){
                        Email=Identitys[i].Passport;
                    }
                    if(Identitys[i].Type==1){
                        Mobile=Identitys[i].Passport;
                    }
                }
                var tpl = require('./userInfo/template/passport.tpl');
                var tmp = template(tpl);
                var passportData = {pMobile: Mobile, pEmail: Email,isCancel:(Mobile && Email)};
                $("#js_passport").html(tmp(passportData));
                if(!userPassport){
                    bindPassportClick();
                }
                userPassport = passportData;
            }
        })
    }
    //验证码倒计时
    function beginSetTime(){
        var time = 60000;
        clearTime = false;
        util.setCookies2('i8codeinfo',"120000",60);
        setTfunc(time);
        function setTfunc(time){
            $("#js_pub_reg_btn").addClass("disabled").html();
            if(time > 0){
                time = time - 1000;
                $("#js_pub_reg_btn").html(time/1000+'秒后重发');
                setTimeout(function(){
                    if(!clearTime){
                        setTfunc(time);
                    }
                },1000)
            }else{
                $("#js_pub_reg_btn").removeClass('disabled').html('获取验证码');
            }
        }
    }
    //获取验证码
    function getYZM(json){
        if(json.mobile != undefined && !regObj.fmobileTest(json.mobile)){
            i8ui.txterror("手机格式不正确！", json.btnDom);
            i8ui.txtError(json.btnDom);
            return;
        }
        if(json.email != undefined && !regObj.femailTest(json.email)){
            i8ui.txterror("邮箱格式不正确！", json.btnDom);
            i8ui.txtError(json.btnDom);
            return;
        }
        var passport = json.mobile || json.email.toLocaleLowerCase();
        $.ajax({
            url: i8_session.baseHost+'/webajax/login/addValidInfo',
            type: 'post',
            dataType: 'json',
            data: {jdata: {passport: passport, type:6}},
            cache: false,
            success: function(result){
                if(result.Result){
                    $("#js_lg_tp_div").remove();
                    i8ui.simpleWrite('验证码已发送成功！',json.btnDom);
                    beginSetTime();
                }else{
                    i8ui.error(result.Description);
                }
            },
            error: function(e1,e2,e3){
                i8ui.error("操作失败");
            }
        });
    }
    //账号能否使用验证方法
    function yzPassport(txtDom,type){
        var passport = $.trim(txtDom.val()).toLocaleLowerCase();
        if(type && !regObj.femailTest(passport)){
            i8ui.txterror("邮箱格式不正确！", txtDom);
            i8ui.txtError(txtDom);
            $("#js_pub_reg_btn").addClass("disabled");
            return;
        }
        if(!type && !regObj.fmobileTest(passport)){
            i8ui.txterror("手机号格式不正确！", txtDom);
            i8ui.txtError(txtDom);
            $("#js_pub_reg_btn").addClass("disabled");
            return;
        }
        $.ajax({
            url: i8_session.ajaxHost+"webajax/login/isJoined",
            type: "post",
            dataType: "json",
            data: { jdata:{passport:passport}},
            success: function (data) {
                console.log(data);
                if (data.Result) {
                    if(!data.ReturnObject){
                        $("#js_pub_reg_btn").removeClass("disabled");
                    }else{
                        i8ui.txterror("该账号已存在",txtDom);
                        i8ui.txtError(txtDom);
                        $("#js_pub_reg_btn").addClass("disabled");
                    }
                }else {
                    i8ui.error(data.Description)
                }
            },
            error: function () {
            }
        });
    }
    //账号事件绑定
    function bindPassportClick(){
        var panlDiv = $("#js_passport");
        //新增手机号事件
        panlDiv.on("click",".add-mobile",function(){
            var tpl = require("./userInfo/template/addMobile.tpl");
            var tmp = template(tpl);
            clearTime = true;
            var sbox = i8ui.showbox({
                title: '新增手机号',
                cont: tmp(personInfo)
            });
            //失去焦点验证
            $(sbox).on("blur","#js_mobile",function(){
                yzPassport($(this));
            });
            //获得光标激活按钮
            $(sbox).on("focus","#js_mobile",function(){
                $("#js_pub_reg_btn").removeClass("disabled");
            });
            //获取验证码
            $(sbox).on("click",".get-code",function(){
                if($(this).attr("class").indexOf("disabled")>=0){
                    return false;
                }
                getYZM({
                    mobile: $.trim($("#js_mobile").val()),
                    btnDom: $("#js_mobile")
                });
            });
            //保存新增手机号
            $(sbox).on("click",".save-mobile",function(){
                var mobileDom = $("#js_mobile");
                var codeDom = $("#js_part_code");
                var ischecked = document.getElementById("js_is_checked").checked;
                var mobile = $.trim(mobileDom.val());
                var code = $.trim(codeDom.val());
                if(!regObj.fmobileTest(mobile)){
                    i8ui.txterror("手机号格式不正确！", mobileDom);
                    i8ui.txtError(mobileDom);
                    return;
                }
                if(!code){
                    i8ui.txterror("请输入验证码！", codeDom);
                    i8ui.txtError(codeDom);
                    return;
                }
                var jdata = {
                    newPassport: mobile,
                    code: code,
                    cascade: ischecked
                }
                SetNewPassport(jdata,function(){
                    i8ui.write("新增成功！");
                    sbox.close();
                    loadPassport();
                });
            });
        });
        //新增邮箱帐号事件
        panlDiv.on("click",".add-email",function(){
            var tpl = require("./userInfo/template/addEmail.tpl");
            var tmp = template(tpl);
            clearTime = true;
            var sbox = i8ui.showbox({
                title: '新增邮箱账号',
                cont: tmp(personInfo)
            });
            //失去焦点验证
            $(sbox).on("blur","#js_email",function(){
                yzPassport($(this),true);
            });
            //获得光标激活按钮
            $(sbox).on("focus","#js_email",function(){
                $("#js_pub_reg_btn").removeClass("disabled");
            });
            //获取验证码
            $(sbox).on("click",".get-code",function(){
                if($(this).attr("class").indexOf("disabled")>=0){
                    return false;
                }
                getYZM({
                    email: $.trim($("#js_email").val()),
                    btnDom: $("#js_email")
                });
            });
            //保存
            $(sbox).on("click",".save-email",function(){
                var emailDom = $("#js_email");
                var codeDom = $("#js_part_code");
                var ischecked = document.getElementById("js_is_checked").checked;
                var email = $.trim(emailDom.val());
                var code = $.trim(codeDom.val());
                if(!regObj.femailTest(email)){
                    i8ui.txterror("邮箱账号格式不正确！", emailDom);
                    i8ui.txtError(emailDom);
                    return;
                }
                if(!code){
                    i8ui.txterror("请输入验证码！", codeDom);
                    i8ui.txtError(codeDom);
                    return;
                }
                var jdata = {
                    newPassport: email,
                    code: code,
                    cascade: ischecked
                }
                SetNewPassport(jdata,function(){
                    i8ui.write("新增成功！");
                    sbox.close();
                    loadPassport();
                });
            });
        });
        //修改邮箱事件
        panlDiv.on("click",".update-email",function(){
            var tpl = require("./userInfo/template/saveEmail.tpl");
            var tmp = template(tpl);
            clearTime = true;
            var sbox = i8ui.showbox({
                title: '修改邮箱账号',
                cont: tmp(userPassport)
            });
            //失去焦点验证
            $(sbox).on("blur","#js_new_email",function(){
                yzPassport($(this),true);
            });
            //获得光标激活按钮
            $(sbox).on("focus","#js_new_email",function(){
                $("#js_pub_reg_btn").removeClass("disabled");
            });
            //获取验证码
            $(sbox).on("click",".get-code",function(){
                if($(this).attr("class").indexOf("disabled")>=0){
                    return false;
                }
                getYZM({
                    email: $.trim($("#js_new_email").val()),
                    btnDom: $("#js_new_email")
                });
            });
            //保存修改邮箱
            $(sbox).on("click",".save-email",function(){
                var emailDom = $("#js_new_email");
                var codeDom = $("#js_part_code");
                var passwordDom = $("#js_password");
                var ischecked = document.getElementById("js_is_checked").checked;
                var emial = $.trim(emailDom.val());
                var code = $.trim(codeDom.val());
                var password = $.trim(passwordDom.val());
                if(!regObj.femailTest(emial)){
                    i8ui.txterror("邮箱格式不正确！", emailDom);
                    i8ui.txtError(emailDom);
                    return;
                }
                if(!regObj.ftest(password,regObj.password)){
                    i8ui.txterror("密码格式不正确！", passwordDom);
                    i8ui.txtError(passwordDom);
                    return;
                }
                if(!code){
                    i8ui.txterror("请输入验证码！", codeDom);
                    i8ui.txtError(codeDom);
                    return;
                }
                var jdata = {
                    oldPassport: userPassport.pEmail,
                    newPassport: emial,
                    password: password,
                    code: code,
                    cascade: ischecked

                }
                ChangePassport(jdata,function(){
                    i8ui.write("修改成功！");
                    sbox.close();
                    loadPassport();
                });
            });
        });
        //修改手机账号事件
        panlDiv.on("click",".update-mobile",function(){
            var tpl = require("./userInfo/template/saveMobile.tpl");
            var tmp = template(tpl);
            clearTime = true;
            var sbox = i8ui.showbox({
                title: '修改手机账号',
                cont: tmp(userPassport)
            });
            //失去焦点验证
            $(sbox).on("blur","#js_new_mobile",function(){
                yzPassport($(this));
            });
            //获得光标激活按钮
            $(sbox).on("focus","#js_new_mobile",function(){
                $("#js_pub_reg_btn").removeClass("disabled");
            });
            //获取验证码
            $(sbox).on("click",".get-code",function(){
                if($(this).attr("class").indexOf("disabled")>=0){
                    return false;
                }
                getYZM({
                    mobile: $.trim($("#js_new_mobile").val()),
                    btnDom: $("#js_new_mobile")
                });
            });
            //保存
            $(sbox).on("click",".save-mobile",function(){
                var mobileDom = $("#js_new_mobile");
                var codeDom = $("#js_part_code");
                var passwordDom = $("#js_password");
                var ischecked = document.getElementById("js_is_checked").checked;
                var mobile = $.trim(mobileDom.val());
                var code = $.trim(codeDom.val());
                var password = $.trim(passwordDom.val());
                if(!regObj.fmobileTest(mobile)){
                    i8ui.txterror("手机号格式不正确！", mobileDom);
                    i8ui.txtError(mobileDom);
                    return;
                }
                if(!regObj.ftest(password,regObj.password)){
                    i8ui.txterror("密码格式不正确！", passwordDom);
                    i8ui.txtError(passwordDom);
                    return;
                }
                if(!code){
                    i8ui.txterror("请输入验证码！", codeDom);
                    i8ui.txtError(codeDom);
                    return;
                }
                var jdata = {
                    oldPassport: userPassport.pMobile,
                    newPassport: mobile,
                    password: password,
                    code: code,
                    cascade: ischecked
                }
                ChangePassport(jdata,function(){
                    i8ui.write("修改成功！");
                    sbox.close();
                    loadPassport();
                });
            });
        });
        //取消邮箱账号
        panlDiv.on("click",".cancel-email",function(){
            var tpl = require("./userInfo/template/cancelPassport.tpl");
            var tmp = template(tpl);
            var sbox = i8ui.showbox({
                title: '取消邮箱账号',
                cont: tmp({email: userPassport.pEmail})
            });
            //确定
            $(sbox).on('click',".cancel-part",function(){
                var passwordDom = $("#js_password");
                var password = $.trim(passwordDom.val());
                if(!regObj.ftest(password,regObj.password)){
                    i8ui.txterror("密码格式不正确！", passwordDom);
                    i8ui.txtError(passwordDom);
                    return;
                }
                DeletePassport(userPassport.pEmail,password,function(){
                    i8ui.write("取消成功！");
                    loadPassport();
                    sbox.close();
                });
            });
        });
        //取消手机账号
        panlDiv.on("click",".cancel-mobile",function(){
            var tpl = require("./userInfo/template/cancelPassport.tpl");
            var tmp = template(tpl);
            var sbox = i8ui.showbox({
                title: '取消手机账号',
                cont: tmp({mobile: userPassport.pMobile})
            });
            //确定
            $(sbox).on('click',".cancel-part",function(){
                var passwordDom = $("#js_password");
                var password = $.trim(passwordDom.val());
                if(!regObj.ftest(password,regObj.password)){
                    i8ui.txterror("密码格式不正确！", passwordDom);
                    i8ui.txtError(passwordDom);
                    return;
                }
                DeletePassport(userPassport.pMobile,password,function(){
                    i8ui.write("取消成功！");
                    loadPassport();
                    sbox.close();
                });
            });
        });
    }
    loadPassport();
    //按钮切换
    $('.personal-info').delegate('.app-checkbox', 'click', function () {
        $(this).toggleClass('checked');
    })
    //展开编辑
    //获取parent $('..b-gray-sty1')(最外面框)
    function getparent(children) {
        return children.parents('.b-gray-sty1').eq(0);
    }
    $('.personal-info').on('click','>.cate-row',function(){
        if( $(this).find('.b-blue-sty1').css('display')=='none' && $(this).hasClass('personaldata')){
            $('.reedit').show();
        }
        if($(this).find('>.cate-body').css('display')=='block' && $(this).hasClass('personaldata')){
            $('.reedit').hide();
        }
        $(this).toggleClass('isopen').find('>.cate-body').slideToggle(50);
    })
    $('.personal-info').on('click','>.cate-row>.cate-body',function(){
        $('.i8city2,.i8city1').hide();
        return false;
    })
    $('.personal-info').on('click','.citylev2,.citylev1',function(){
            return false;
    });

    //2.收起动作
    function retract(parent, $this) {
        //parent.find('>a').hide();
        //parent.find('.editing').show();
        parent.find('>.cate-body').slideUp(50, function () {
            parent[0].isExpansion = false;
        });
        parent.removeClass('isopen')
    }

    $(document).delegate('.retract', 'click', function () {
        var $this = $(this);
        var parent = getparent($this);
        retract(parent, $this)
    })

    //确认按钮事件及其回调
    function confirm(parent, $this, cbk) {
        var _editbox = parent.find('.b-blue-sty1');
        var _previewbox = parent.find('.preview');
        _previewbox.show();
        //_editbox.hide();
        confirm_common(parent, $this);
        cbk ? cbk() : '';

    }

    //第二层折叠职业和教育
    $('.personal-info').on('click','.gray-yellow', function () {
        var $this=$(this);
        var $arrow=$this.find('.arrow');
        var parent = $(this).parents('.cate-body').eq(0);
        $arrow.toggleClass('active');
        parent.find('.cate-item').slideToggle(50);
    })

    //新增凭证
    function SetNewPassport(jdata,cbk){
        $.ajax({
            url: i8_session.ajaxHost+"webajax/settings/SetNewPassport",
            type: "post",
            dataType: "json",
            data: {jdata:jdata},
            success: function (data) {
                if (data.Result) {
                    cbk();
                }else {
                    i8ui.error(data.Message)
                }
            },
            error: function () {
            }
        });
    }
    //删除凭证
    function DeletePassport(oldPassport,password,cbk){
        $.post(i8_session.ajaxHost+"webajax/settings/DeletePassport?" + Math.random(),{oldPassport:oldPassport,password:password},function(data){
            if(data.Result){
                cbk();
            }else{
                if(data.Code==1016){
                    i8ui.error("至少存在一个账号！")
                }else{
                    i8ui.error(data.Message)
                }
            }
        })
    }
    //修改凭证
    function ChangePassport(jdata,cbk){
        $.ajax({
            url: i8_session.ajaxHost+"webajax/settings/UpdatePassport",
            type: "post",
            dataType: "json",
            data: { jdata:jdata},
            success: function (data) {
                if (data.Result) {
                    cbk();
                }
                else {
                    i8ui.error(data.Message)
                }
            },
            error: function () {
            }
        });
    }

    /*-------------------华丽的分割线------------------------------------------------------------------------------------------------------------------------------------*/
    //个人资料
    $('.personaldata').delegate('.app-radio', 'click', function () {
        $('.personaldata .app-radio').removeClass('checked');
        $(this).addClass('checked')
    })
    $('.personaldata').delegate('.reedit', 'click', function () {
        $('.personaldata .preview').hide().next().show();
        $('.reedit').hide();
        return false;
    })

    //个人资料取消按钮,
    $('.personaldata').delegate('.cancel', 'click', function () {
        $('.personaldata').find("[defaultvalue]").each(function () {
            $(this).val($(this).attr('defaultvalue'));
        })
        $('.personaldata').find('.b-blue-sty1').hide().prev().show();
        retract($('.personaldata'), $('.personaldata .cancel'));
        $('.reedit').hide();

    })


    /*-------------------华丽的分割线------------------------------------------------------------------------------------------------------------------------------------*/
    //个人标签
    //获取建议标签
    function getSuggestLables(cbk){
        $.post(i8_session.ajaxHost+"webajax/settings/SuggestLables?" + Math.random(),{},function(data){
            if(data.Result){
                cbk(data.ReturnObject)
            }else{
                i8ui.error(data.Message)
            }
        })
    }
    //获取浏览器标签
    function getBrowserLables(){
        var labels=[];
        if($('.cate-body .tile-nor').length>0){
            $('.cate-body .tile-nor').each(function(index,item){
                labels.push($(item).text())
            })
        }else{
            labels=[""];
        }
        return labels;
    }
    function addTagDefualt(){
        var DefualtStr=getBrowserLables().join(' ');
        $('.personaltag').attr('Defualt',DefualtStr)
    }
    addTagDefualt();
    //保存标签
    function UpdateLabel(labels,cbk){
        $.post(i8_session.ajaxHost+"webajax/settings/UpdateLabel?" + Math.random(),{"labels":labels},function(data){
            if(data.Result){
                cbk(labels)
            }else{
                i8ui.error(data.Message)
            }
        })
    }
    function removeClass_active() {
        $('#mytag .tile-nor').each(function () {
            var _value = $(this).text();
            var yourLikes = $('.tile-add.active');
            //if(yourLikes.length>0){
            yourLikes.each(function () {
                if ($(this).text() == _value) {
                    $(this).removeClass('active')
                }
            })
            //}
        })
    }

    //初始化tile-add
    function addClass_active() {
        $('#mytag .tile-nor').each(function () {
            var _value = $(this).text();
            var yourLikes = $('.tile-add');
            yourLikes.each(function () {
                if ($(this).text() == _value) {
                    $(this).addClass('active')
                }
            })
        })
    }

    addClass_active();
    $('#newTagInput').keydown(function (e) {
        if (e.keyCode == 13) {
            var _value = $.trim($('#newTagInput').val());
            if(_value==""){
                i8ui.error('输入标签不能为空',$('#newTagInput'))
                return;
            }
            $('#newTagInput').val("");
            var tagArr=_value.split(' ');
            tagArr= _.difference(tagArr,getBrowserLables());
            var sameTag=_.intersection(tagArr,getBrowserLables()|| []);
            for(var i=0;i<tagArr.length;i++){
                if($.trim(tagArr[i])){
                    $('#newTagInput').after('<span class="tile-nor">' + tagArr[i] + '<i class="icon"></i></span>');
                    if(sameTag.length>0){
                        i8ui.error('已存在相同标签'+sameTag.join(',')+'已过滤')
                    }
                }
            }
        }
    })
    getSuggestLables(function(data){
        var result="";
        for(var i=0;i<data.length;i++){
            if(data[i].Label!=""){
                result+='<span class="tile-add">'+data[i].Label+'<i class="icon"></i></span>'
            }
        }
        $('#suggest_lables').append(result);
    })

    $('.personaltag').delegate('.tile-nor i', 'click', function () {
        removeClass_active();
        $(this).parents('.tile-nor').eq(0).remove();
    })
    $('.personaltag').delegate('.tile-add', 'click', function () {
        if(_.indexOf(getBrowserLables(),$(this).text())!=-1){
            i8ui.error('已存在相同标签');
            return;
        }
        if ($(this).hasClass('active')) {
            return;
        }
        $(this).addClass('active');
        $('#newTagInput').after($(this).clone(true).attr('class', 'tile-nor'));
    })

    $('.personaltag .app-radio').click(function () {
        $('.personaldata .app-radio').removeClass('checked');
        $(this).addClass('checked')
    })
    $('.personaltag .confirm').click(function () {
        var labels=getBrowserLables();
        labels= _.uniq(labels);
        UpdateLabel(labels,function(labels){
            var _html="";
            if(labels&&labels[0]==""&&labels==1){
                labels=[];
            }
            if(labels && labels[0]!=""){
                var _len=labels.length;
                for(var i=0;i<3;i++){
                    if($.trim(labels[i])){
                        _html+='<span class="intro"><span class="tile-nor">'+labels[i]+'</span></span>'
                    }
                }
                if(_len>3){
                    _html+='<span class="intro"><span class="tile-nor">...</span></span>'
                }
            }else{
                _html='<span class="intro">这个家伙很懒~</span>'
            }
            $('.personaltag .editing .intro').remove();
            $('.personaltag .editing .edit').before(_html);
            $('.personaltag .retract').trigger('click');
            i8ui.successMask("保存成功")
            addTagDefualt();
            addClass_active();
        })

    });
    //个人标签取消按钮
    $('.personaltag .cancel').click(function () {
        $('.personaltag .retract').trigger('click')
        $('#mytag .tile-nor').remove();
        var _value=$('.personaltag').attr('defualt');
        $('#newTagInput').val("")
        var tagArr=_value.split(' ')
        for(var i=0;i<tagArr.length;i++){
            if(tagArr[i]){
                $('#newTagInput').after('<span class="tile-nor">' + tagArr[i] + '<i class="icon"></i></span>');
            }
        }
        $('.tile-add').removeClass('active');
    });


    /*-------------------华丽的分割线------------------------------------------------------------------------------------------------------------------------------------*/
    //工作信息
    //初始化工作城市
    function jobCityLoad(){
        $('.job-info .b-blue-sty1').each(function(index,item){
            var _val=$(item).find('.citylev1').val()+ "-" +$(item).find('.citylev2').val();
            $(item).prev().find('.citytxt').text(_val)
        })
    }
    $('.job-info').on('keydown','.citylev1, .citylev2',function(){
        $(this).attr('cus','true');
        $(this).parent().attr('lev2code','');
    })
    //更新静态标题
    function updateTitle(parent){
        var itemstr="";
        if(parent=='.job-info'){
            itemstr=".jobitem"
        }else{
            itemstr=".eduitem"
        }
        if($(parent).find(itemstr).length>0){
            $(parent).find('.intro').text($(parent).find(itemstr).eq(0).find('.mainname').text());
        }else{
            $(parent).find('.intro').html('这个家伙很懒~')
        }
    }
    jobCityLoad();


    $('.job-info').on('click', '.btn-edit-one', function () {
        var itembox = $(this).parents('.cate-body').eq(0);
        itembox.find('.cate-item').show();
        itembox.find('.preview').hide().next().show();
        itembox.find('.arrow').addClass('active');
        return false;
    })

    ///取消按钮
    $('.job-info').on('click', '.cancel', function () {
        var itemparent = $(this).parents('.b-blue-sty1').eq(0);
        itemparent.find("[defaultvalue]").each(function () {
            $(this).val($(this).attr('defaultvalue'));
        })
        itemparent.hide().prev().show();
        if(!$(this).parents('.cate-body').eq(0).attr('cid')){
            $(this).parents('.cate-body').eq(0).remove();
        }
    })
    //删除
    function DeleteExperience($this,id,parnet){
        if(!id){
            i8ui.successMask('删除成功！')
            $this.parents('.cate-body').eq(0).remove();
            return;
        }
        $.post(i8_session.ajaxHost+"webajax/settings/DeleteExperience?" + Math.random(),{id: id},function(data){
            if(data.Result){
                i8ui.successMask('删除成功！')
                $this.parents('.cate-body').eq(0).remove();
                updateTitle(parnet)
            }else{
                i8ui.error(data.Message)
            }
        })
    }
    //删除按钮
    $('.job-info').delegate( '.btn-delete','click', function () {
        var $this = $(this);
        var id=$this.parents('.cate-body').eq(0).attr('cid');
        i8ui.confirm({title: '确定删除本条工作信息吗'}, function () {
            DeleteExperience($this,id,'.job-info')
        })
        return false;
    })
    //增加一条工作信息
    $('.job-info').delegate('.add-job', 'click', function () {
        var jobInfoTemp=require('./userInfo/template/jobInfo.tpl');
        var render = template.compile(jobInfoTemp),
            StartTime = new Date().format('yyyy-MM-dd'),
            EndTime = new Date().format('yyyy-MM-dd');
        var subDate = {
            ID:"",
            MainName: "",
            Position: "",
            Location: "",
            StartTime: StartTime,
            EndTime: EndTime,
            fromadd:true
        }
        var _html = render({List: [subDate]});
        _html=$(_html).find('.btn-fold').addClass('active').end().find('.preview').hide().end().find('.b-blue-sty1').show().end();
        $('.add-job').parent().before(_html);
        $('.startTime').each(function(){
            var $this=$(this);
            var idindex=$this.attr('idindex');
            if(!$this.attr('setfinish')){
                $this.attr('setfinish','finished');
                $('#edit_StartTime_'+idindex).setTime({
                    dateFmt:"yyyy-MM-dd",
                    maxDate:"#F{$dp.$D('edit_EndTime_"+idindex+"');}"
                });
                $('#edit_EndTime_'+idindex).setTime({
                    dateFmt:"yyyy-MM-dd",
                    minDate:"#F{$dp.$D('edit_StartTime_"+idindex+"');}"
                })
            }
        })
        //itemparent.hide().prev().show();
        window.addgrowthIndex++;
        return false;
    })

    //增加或者修改
    function SaveExperience($this,itemparent,render,subDate,expType,parent){
        var cbktitle="添加成功";
        if(itemparent.attr('cid')){
            cbktitle='修改成功!';
            subDate.ID=itemparent.attr('cid')
        }
        if($(itemparent).find(".citylev1").val()!="" && $(itemparent).find(".citylev2").val()==""){
            i8ui.error("请填写完整地区信息！");
            $(itemparent).find(".citylev2")[0].focus();
            return;
        }
        if(!$(itemparent).find(".city-group").attr('lev2code') && expType==1){
            i8ui.error("不支持自定义输入地区！请重新选择！",$(itemparent).find(".city-group"));
            $(itemparent).find(".citylev1")[0].focus();
            return;
        }
        $.post(i8_session.ajaxHost+"webajax/settings/SaveExperience?" + Math.random(),{entity:subDate},function(data){
            if(data.Result){
                i8ui.successMask(cbktitle)
                $.post(i8_session.ajaxHost+"webajax/settings/GetExperience?" + Math.random(),{expType:expType},function(data){
                    if(data.Result){
                        var result=data.ReturnObject
                        var _data=_.max(result,function(result){return new Date(result.LastUpdateTime.replace(/\-/g,'/')).getTime()});
                        if(expType==1){
                            _data.CityTxt=$(itemparent).find('.citylev1').val()+ "-" +$(itemparent).find('.citylev2').val();
                            _data.City1Txt=$(itemparent).find('.citylev1').val();
                            _data.City2Txt=$(itemparent).find('.citylev2').val();
                        }
                        _data.fromsub=true;
                        var uu = render({List: [_data]})
                        itemparent.replaceWith(uu);
                        updateTitle(parent);
                    }else{
                        i8ui.error(data.Message)
                    }
                })
            }else{
                i8ui.error(data.Message)
            }
        })
    }

    ///提交按钮
    $('.job-info').on('click','.confirm', function () {
        var $this=$(this);
        var itemparent = $this.parents('.cate-body').eq(0);
        if(!i8reg.checkAll(itemparent)){
            return false;
        }
        //var jobInfoTemp=
        require.async('default/javascripts/users/settings/userInfo/template/jobInfo.tpl', function (jobInfoTemp) {
            var render = template.compile(jobInfoTemp);
            var subDate = {
                MainName: itemparent.find('.company').val(),
                Position: itemparent.find('.position').val(),
                Location: itemparent.find('.city-group').attr('lev2code'),
                StartTime: itemparent.find('.startTime').val(),
                EndTime: itemparent.find('.endTime').val(),
                ExperienceType:1
            }
            SaveExperience($this,itemparent,render,subDate,1,'.job-info');
        })
        window.addgrowthIndex++;
    })


    /*-------------------华丽的分割线------------------------------------------------------------------------------------------------------------------------------------*/
    //教育信息
    $('.edu-info').delegate('.btn-edit-one', 'click', function () {
        var itembox = $(this).parents('.cate-body').eq(0);
        itembox.find('.cate-item').show();
        itembox.find('.preview').hide().next().show();
        itembox.find('.arrow').addClass('active');
        return false;
    })

    ///取消按钮
    $('.edu-info').delegate('.cancel', 'click', function () {
        var itemparent = $(this).parents('.b-blue-sty1').eq(0);
        itemparent.find("[defaultvalue]").each(function () {
            $(this).val($(this).attr('defaultvalue'));
        })
        itemparent.hide().prev().show();
        if(!$(this).parents('.cate-body').eq(0).attr('cid')){
            $(this).parents('.cate-body').eq(0).remove();
        }
    })
    //删除按钮
    $('.edu-info').on('click', '.btn-delete', function () {
        var $this = $(this);
        var id=$this.parents('.cate-body').eq(0).attr('cid');
        i8ui.confirm({title: '确定删除本条教育信息吗'}, function () {
            DeleteExperience($this,id,'.edu-info');
            $this.parents('.cate-body').eq(0).remove();
        })
        return false;
    })

    //增加一条教育信息
    $('.edu-info').delegate('.add-edu', 'click', function () {
        require.async('default/javascripts/users/settings/userInfo/template/edu.tpl', function (eduInfoTemp) {
            var render = template.compile(eduInfoTemp);
            var StartTime = new Date().format('yyyy-MM-dd');
            var EndTime = new Date().format('yyyy-MM-dd');
            var subDate = {
                MainName: "",
                Position: "",
                StartTime: StartTime,
                EndTime: EndTime,
                fromadd:true
            }
            var _html = render({List: [subDate]});
            _html=$(_html).find('.btn-fold').addClass('active').end().find('.preview').hide().end().find('.b-blue-sty1').show().end();
            $('.add-edu').parent().before(_html);
            //itemparent.replaceWith(_html).show();
        })
    })
    ///提交按钮
    $('.edu-info').delegate('.confirm', 'click', function () {
        var $this=$(this);
        var itemparent = $this.parents('.cate-body').eq(0);
        if(!i8reg.checkAll(itemparent)){
            return false;
        }
        require.async('default/javascripts/users/settings/userInfo/template/edu.tpl', function (eduInfoTemp) {
            var render = template.compile(eduInfoTemp);
            var StartTime = itemparent.find('.start-year').val() + '-' + itemparent.find('.start-month').val();
            var EndTime = itemparent.find('.end-year').val() + '-' + itemparent.find('.end-month').val();
            var subDate = {
                MainName: itemparent.find('.school').val(),
                Position: itemparent.find('.position').val(),
                StartTime: StartTime,
                EndTime: EndTime,
                ExperienceType:2
            }
            var _StartTimeStr=new Date(StartTime.replace('-','/')).getTime();
            var _EndTimeStr=new Date(EndTime.replace('-','/')).getTime();
            if(_StartTimeStr-_EndTimeStr>0){
                i8ui.error('开始时间不能小于结束时间！');
                return false;
            }
            SaveExperience($this,itemparent,render,subDate,2,'.edu-info')
            //itemparent.hide().prev().show();
        })
        window.addgrowthIndex++;
    })

    //时间控件
    $('.edu-info').delegate('.icon_select_gray','click',function () {
        $(this).prev()[0].focus();
    });
    $('.startTime').each(function(){
        var $this=$(this);
        var idindex=$this.attr('idindex');
        if(!$this.attr('setfinish')){
            $this.attr('setfinish','finished');
            $('#edit_StartTime_'+idindex).setTime({
                dateFmt:"yyyy-MM-dd",
                maxDate:"#F{$dp.$D('edit_EndTime_"+idindex+"');}"
            });
            $('#edit_EndTime_'+idindex).setTime({
                dateFmt:"yyyy-MM-dd",
                minDate:"#F{$dp.$D('edit_StartTime_"+idindex+"');}"
            })
        }
    })
})