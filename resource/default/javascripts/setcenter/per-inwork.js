/**
 * Created by chenshanlian on 2015/3/20.
 */
define(function(require){
    var regObj = require('../common/regexp.js');
    var i8ui = require('../common/i8ui.js');
    var util = require('../common/util.js');
    var fw_page = require('../common/fw_pagination.js');

    var pageSize = 10;
    var personArrs = [];
    var sheachDom = $("#js_person_shtxt");
    var tbodyDom = $("#js_tbody_list");
    //获取人员列表
    function getStatusPersons(pageIndex) {
        var searchKey = $.trim(sheachDom.val());
        tbodyDom.html('<tr><td colspan="3"><div class="ld-64-write"></div></td></tr>');
        $("#js_page_panl").html("");
        $.ajax({
            url: i8_session.ajaxHost + "webajax/setcenter/getPersonListByStatus",
            type: "get",
            dataType: "json",
            cache: false,
            data:{jdata:{pindex: pageIndex, psize:pageSize, status:0, searchKey: searchKey}},
            success: function (data) {
                console.log(data);
                if (data.Result) {
                    personArrs = data.ReturnObject;
                    var tpl = require('./template/per-inwork.tpl');
                    var tmp = template(tpl);
                    template.helper("getpersonEdit",function(index){
                        return ''
                    });
                    tbodyDom.html(tmp(data));
                    $("#js_total").html(data.Total);

                    //控制分页
                    fw_page.pagination({
                        ctr: $("#js_page_panl"),
                        totalPageCount: data.Total,
                        pageSize: pageSize,
                        current: pageIndex,
                        fun: function (new_current_page, containers) {
                            getStatusPersons(new_current_page);
                        }, jump: {
                            text: '跳转'
                        }
                    });
                } else {

                }
            },
            error: function (e1, e2, e3) {

            }
        });
    }
    //获取员工账号信息
    function getPersonInfo(uid,cbk){
        $.ajax({
            url: i8_session.ajaxHost+'webajax/setcenter/getPassport',
            type: 'get',
            dataType: 'json',
            cache: false,
            data: {uid: uid},
            success: function(data){
                console.log(data);
                if(data.Result){
                    var pArrs = data.ReturnObject.Identitys || [];
                    cbk(pArrs)
                }else{
                    i8ui.error(data.Description);
                }
            },
            error: function(e1,e2,e3){
                i8ui.error("");
            }
        });
    }
    //临时禁用
    tbodyDom.on("click",".disabled-btn",function(){
        var index = $(this).attr("index");
        var item = personArrs[index];
        var tpl = require('./template/banper.tpl');
        var tmp = template(tpl);
        var sbox = i8ui.showbox({
            title: "禁用员工",
            cont: tmp(item)
        });
        //确定
        $(sbox).on("click",".blue96x32",function(){
            var remark = $.trim($("#js_disabled_mark").val());
            if(remark == ""){
                $("#js_disabled_mark").focus();
                i8ui.txterror("请输入禁用原因",$("#js_disabled_mark"));
                return;
            }
            if(remark.length > 50){
                $("#js_disabled_mark").focus();
                i8ui.txterror("禁用原因不能超过50个字！",$("#js_disabled_mark"));
                return;
            }
            $.ajax({
                url: i8_session.ajaxHost + "webajax/setcenter/updateStatus",
                type: "get",
                dataType: "json",
                cache: false,
                data:{jdata:{passportID:item.PassportID, status:2, remark:remark}},
                success: function (data) {
                    if (data.Result) {
                        i8ui.write("禁用成功！");
                        sbox.close();
                        getStatusPersons(1);
                    } else {
                        i8ui.error(data.Description);
                    }
                },
                error: function (e1, e2, e3) {

                }
            });
        });

    });
    //手机账号 | 邮箱账号
    tbodyDom.on("click",".mobile-passport,.email-passport",function(){
        var index = $(this).attr("index");
        var item = personArrs[index];
        var title = "手机账号";
        var type = 1;
        var isEdit = "编辑"
        if($(this).attr("class") == "email-passport"){
            title = "邮箱账号";
            type = 0;
        }

        getPersonInfo(item.PassportID,function(pArrs){
            var pItem = null;
            for(var i=0; i<pArrs.length; i++){
                if(pArrs[i].Type == type){
                    pItem = pArrs[i];
                    break;
                }
            }
            if(!pItem){
                isEdit = "新增";
            }
            var tpl = require('./template/editPassport.tpl');
            var tmp = template(tpl);
            var sbox = i8ui.showbox({
                title: isEdit+title,
                cont: tmp({title:title,Name:item.Name,isEdit:isEdit})
            });
            var txtPassport = pItem ? pItem.Passport : "";
            $("#js_passport_txt").val(txtPassport).attr("oldPassport",txtPassport);

            //失去焦点账号格式验证
            $("#js_passport_txt").blur(function(){
                var $this = $(this);
                var passport = $.trim($this.val());
                if(!passport){
                    i8ui.txterror("账号不能为空！",$this);
                    i8ui.txtError($this);
                    return;
                }
                if(type == 0 && !regObj.femailTest(passport)){
                    i8ui.txterror(title+"格式不正确！",$this);
                    i8ui.txtError($this);
                    return;
                }
                if(type == 1 && !regObj.fmobileTest(passport)){
                    i8ui.txterror(title+"格式不正确！",$this);
                    i8ui.txtError($this);
                    return;
                }
            });
            //确定
            $(sbox).on("click",".blue96x32",function(){
                var pDom = $("#js_passport_txt");
                var newPassport = $.trim(pDom.val());
                var oldPassport = pDom.attr("oldPassport");
                if(!newPassport){
                    i8ui.txterror("账号不能为空！",pDom);
                    i8ui.txtError(pDom);
                    return;
                }
                if(type == 0 && !regObj.femailTest(newPassport)){
                    i8ui.txterror(title+"格式不正确！",pDom);
                    i8ui.txtError(pDom);
                    return;
                }
                if(type == 1 && !regObj.fmobileTest(newPassport)){
                    i8ui.txterror(title+"格式不正确！",pDom);
                    i8ui.txtError(pDom);
                    return;
                }
                if(isEdit == "编辑"){
                    var password = $.trim($("#js_password_txt").val());
                    if(newPassport == oldPassport && !password){
                        i8ui.write("保存成功！");
                        sbox.close();
                        return;
                    }
                    if(password && !regObj.ftest(password,regObj.password)){
                        i8ui.txterror("请输入8-20个非空字符",$("#js_password_txt"));
                        i8ui.txtError($("#js_password_txt"));
                        return;
                    }
                    var params = {
                        personID:item.PassportID,
                        newPassport:newPassport,
                        oldPassport:oldPassport,
                        password: password
                    }
                    savePassport(params,sbox);
                }else{
                    var params = {
                        personID:item.PassportID,
                        newPassport:newPassport
                    }
                    addPassport(params,sbox);
                }

            });
        });

    });
    function addPassport(param,sbox){
        $.ajax({
            url: i8_session.ajaxHost + "webajax/setcenter/setUserNewPassport",
            type: "post",
            dataType: "json",
            data:{jdata:param},
            success: function (data) {
                if (data.Result) {
                    i8ui.write("新增成功！");
                    sbox.close();
                } else {
                    if(data.Code == 1038){
                        i8ui.error("账号已占用，不能新增");
                    }else{
                        i8ui.error(data.Description);
                    }
                }
            },
            error: function (e1, e2, e3) {

            }
        });
    }
    function savePassport(param,sbox){
        $.ajax({
            url: i8_session.ajaxHost + "webajax/setcenter/changeUserPassport",
            type: "post",
            dataType: "json",
            data:{jdata:param},
            success: function (data) {
                if (data.Result) {
                    i8ui.write("保存成功！");
                    sbox.close();
                } else {
                    i8ui.error(data.Description);
                }
            },
            error: function (e1, e2, e3) {

            }
        });
    }
    $("#js_searh_btn").click(function(){
        getStatusPersons(1);
    });
    //回车查询
    $("#js_person_shtxt").keyup(function(event){
        if(event.keyCode ==13){
            getStatusPersons(1);
        }
    });
    getStatusPersons(1);
});

