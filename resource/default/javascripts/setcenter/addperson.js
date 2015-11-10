/**
 * Created by chenshanlian on 2015/3/19.
 */
define(function(require){
    var i8ui = require("../common/i8ui.js");
    var util = require('../common/util.js');
    var regbox = require('../common/regexp.js');
    var pingyinObj = require('../common/workflow_pinyin.js');
    var classDom = $("#js_class_sel");
    var orgDom = $("#js_org_cked");
    var inputDoms = $("#js_save_div input[type=text]");
    //获取组织架构
    function getDefaulttree() {
        var setting = {
            view: {
                dblClickExpand: false,
                showLine: true,
                showIcon: false,
                nameIsHTML: true,
                showTitle: false
            },
            data: {
                simpleData: {
                    enable: true
                }
            },
            callback: {
                onClick: function (e, treeId, treeNode) {
                    orgDom.attr("orgid", treeNode.id).html(treeNode.name);
                    orgDom.next().hide();
                }
            }
        }
        $.ajax({
            url: i8_session.ajaxHost + "webajax/setcenter/getDefaultOrgTree",
            type: "get",
            dataType: "json",
            cache: false,
            success: function (data) {
                console.log(data);
                if (data.Result) {
                    var newOrgArrs = [];
                    for (var key in data.ReturnObject) {
                        var item = data.ReturnObject[key];
                        newOrgArrs.push({ id: item.OrgID, name: item.Name, title: item.Name, open: (item.ParentID == 0), pId: item.ParentID });
                    }
                    $.fn.zTree.init($("#treedome"), setting, newOrgArrs);
                } else {

                }
            },
            error: function (e1, e2, e3) {

            }
        });
    }
    //获取职级
    function getClassLine(selDom,classid){
        $.ajax({
            url: i8_session.ajaxHost + "webajax/setcenter/getClassLine",
            type: "get",
            dataType: "json",
            cache: false,
            success: function (data) {
                if(data.Result){
                    var selhtml = '';
                    var arrSitem = orderBy(data.ReturnObject);
                    for(var i=0; i<arrSitem.length; i++){
                        var it = arrSitem[i];
                        selhtml += '<option value="'+it.LevelID+'">'+it.Name+'</option>';
                    }
                    classDom.html(selhtml);
                    classDom.setSelect({style:"height: 28px; line-height: 28px; width:360px;"});
                    $("#js_class_sel").setValue(arrSitem[arrSitem.length-1].LevelID);
                }else{
                    i8ui.error(data.Description);
                }
            },
            error: function (e1, e2, e3) {
                i8ui.error("请求出错");
            }
        });
    }
    //账号能否使用验证方法
    function yzPassport(txtDom,type){
        var passport = $.trim(txtDom.val()).toLocaleLowerCase();
        if(type && !regbox.femailTest(passport)){
            i8ui.trterror("邮箱格式不正确！", txtDom.next());
            i8ui.txtError(txtDom);
            return;
        }
        if(!type && !regbox.fmobileTest(passport)){
            i8ui.trterror("手机号格式不正确！", txtDom.next());
            i8ui.txtError(txtDom);
            return;
        }
        //验证账号是否存在该社区
        $.ajax({
            url: "/webajax/login/isJoined",
            type: "post",
            dataType: "json",
            data: { jdata:{passport:passport,acid:i8_session.aid}},
            success: function (data) {
                console.log(data);
                if (data.Result) {
                    if(data.ReturnObject){
                        i8ui.trterror("该账号已存在该社区",txtDom.next());
                        i8ui.txtError(txtDom);
                    }
                }else {
                    i8ui.error(data.Description)
                }
            },
            error: function () {
            }
        });
        //验证账号是否已经使用过
        $.ajax({
            url: "/webajax/login/isJoined",
            type: "post",
            dataType: "json",
            data: { jdata:{passport:passport}},
            success: function (data) {
                console.log(data);
                if (data.Result) {
                    if(data.ReturnObject){
                        $("#set-password").hide();
                        txtDom.attr("include","true");
                    }else{
                        txtDom.attr("include","false");
                        var emailBool = $("#js_save_div input[name='email']").attr("include");
                        var mobileBool = $("#js_save_div input[name='mobile']").attr("include");
                        if(emailBool == "false" && mobileBool == "false"){
                            $("#set-password").show();
                        }
                    }
                }else {
                    i8ui.error(data.Description)
                }
            },
            error: function () {
            }
        });
    }
    //保存员工信息
    function saveOrgfun(){
        var name = $.trim(inputDoms[0].value);
        var NamePinYin = pingyinObj.ConvertPinyin(name);
        var email = $.trim(inputDoms[1].value).toLocaleLowerCase();
        var mobile = $.trim(inputDoms[2].value);
        var pwsswordType = $("#js_pwd_label input")[0].checked;
        var mobileType = document.getElementById("js_passport_mobile").checked;
        var emailType = document.getElementById("js_passport_email").checked
        var password = $.trim(inputDoms[3].value);
        var tel = $.trim(inputDoms[4].value);
        var workclass = $.trim(inputDoms[5].value);
        var orgid = orgDom.attr("orgid");
        var orgName = orgDom.html();
        var classid = $("#js_class_sel").getValue();
        var className = $("#js_class_sel").getKey();
        var sex = document.getElementById("js_sex").checked;

        if(!regbox.ftest(name,regbox.username)){
            i8ui.trterror("请输入2-15个字母、数字或汉字！",$(inputDoms[0]));
            return;
        }
        if(emailType && !regbox.ftest(email,regbox.email)){
            util.bgFlicker($(inputDoms[1]));
            i8ui.trterror("请输入正确的邮箱格式！",$(inputDoms[1]).next());
            return;
        }
        if(mobileType && !regbox.ftest(mobile,regbox.mobile)){
            util.bgFlicker($(inputDoms[2]));
            i8ui.trterror("请输入正确的手机号！",$(inputDoms[2]).next());
            return;
        }
        if(pwsswordType && !regbox.ftest(password,regbox.password)){
            util.bgFlicker($(inputDoms[3]));
            i8ui.trterror("请输入8-20个非空字符！",$("#js_pwd_label"));
            return;
        }
        if(!orgid){
            util.bgFlicker(orgDom);
            i8ui.error("请选择部门！");
            return;
        }
        var colleague = {
            Passport: email,
            Password: password,
            Mobile: mobile,
            Name: name,
            NamePinYin: NamePinYin,
            Tel: tel,
            OrgID: orgid,
            OrgName: orgName,
            ClassID: classid,
            Position: workclass,
            ClassName: className,
            Gender: sex
        }
        $.ajax({
            url: i8_session.ajaxHost + "webajax/setcenter/addColleague",
            type: "get",
            dataType: "json",
            data:{jdata:{colleague:colleague,useMobileLogin:mobileType, useEmailLogin:emailType}},
            success: function (data) {
                if(data.Result){
                    i8ui.write("新增成功！");
                    inputDoms.val("");
                }else{
                    if(data.Code == 1018){
                        i8ui.error("该邮箱已经存在账号！请重新输入!");
                        return;
                    }
                    i8ui.error(data.Description);
                }
            },
            error: function (e1, e2, e3) {
                i8ui.error("请求出错");
            }
        });
    }
    getClassLine();
    getDefaulttree();
    //排序
    function orderBy(arrs){
        for(var i=0; i<arrs.length; i++){
            for(var j= i+1; j<arrs.length; j++){
                if(arrs[i].Score < arrs[j].Score){
                    var item = arrs[j];
                    arrs[j] = arrs[i];
                    arrs[i] = item;
                }
            }
        }
        return arrs;
    }
    //手动输入密码
    $("#js_pwd_label").on("change","input",function(){
        if(this.checked){
            $("#js_pwd_txt").show();
            $("#js_pwd_span").hide();
        }else{
            $("#js_pwd_txt").hide();
            $("#js_pwd_span").show();
        }
    });
    $("#js_add_person").click(saveOrgfun);
    //是否作为登录账号的勾选事件
    $("#js_save_div").on("click","input[name='passport']",function(){
        var emailCked = document.getElementById("js_passport_email").checked;
        var mobileCked = document.getElementById("js_passport_mobile").checked;
        var spanDom = $(this).parents("tr").find("span.add-per-w30");
        if(!emailCked && !mobileCked){
            $(this).attr("checked","checked");
            return;
        }
        $(this).parent().prev().focus();
        if(this.checked){
            spanDom.html("*");
        }else{
            spanDom.html("");
            $(this).parent().prev().attr("include","false");
        }
    });
    //邮箱失去焦点事件
    $("#js_save_div").on("blur","input[name='email']",function(){
        if(document.getElementById("js_passport_email").checked){
            yzPassport($(this),true);
        }
    });
    //手机失去焦点事件
    $("#js_save_div").on("blur","input[name='mobile']",function(){
        if(document.getElementById("js_passport_mobile").checked){
            yzPassport($(this));
        }
    });
});