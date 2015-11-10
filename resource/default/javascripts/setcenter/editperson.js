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
    var uid = util.getUrlParam("uid");
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
    function getClassLine(){
        $.ajax({
            url: i8_session.ajaxHost + "webajax/setcenter/getClassLine",
            type: "get",
            dataType: "json",
            success: function (data) {
                var classID = parseInt(classDom.attr("classid"));
                if(data.Result){
                    var selhtml = '';
                    var arrSitem = orderBy(data.ReturnObject);
                    for(var i=0; i<arrSitem.length; i++){
                        var it = arrSitem[i];
                        var slted = '';
                        if(it.LevelID == classID){
                            slted = 'selected';
                        }
                        selhtml = '<option '+slted+' value="'+it.LevelID+'">'+it.Name+'</option>'+selhtml;
                    }
                    classDom.html(selhtml);
                    classDom.setSelect({style:"height: 28px; line-height: 28px; width:360px;"});
                }else{
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
    $("#js_edit_person").click(saveOrgfun);
    //保存员工信息
    function saveOrgfun(){
        var name = $.trim(inputDoms[0].value);
        var NamePinYin = pingyinObj.ConvertPinyin(name);
        var email = $.trim(inputDoms[1].value);
        var mobile = $.trim(inputDoms[2].value);
        var password = $.trim(inputDoms[3].value);
        var tel = $.trim(inputDoms[4].value);
        var position = $.trim(inputDoms[5].value);
        var orgid = orgDom.attr("orgid");
        var orgName = orgDom.html();
        var classid = $("#js_class_sel").getValue();
        var className = $("#js_class_sel").getKey();
        var sex = document.getElementById("js_sex").checked;

        if(!regbox.ftest(name,regbox.username)){
            i8ui.trterror("请输入2-15个字母、数字或汉字！",$(inputDoms[0]));
            return;
        }
        if(!regbox.ftest(email,regbox.email)){
            util.bgFlicker($(inputDoms[1]));
            i8ui.trterror("请输入正确的邮箱格式！",$(inputDoms[1]));
            return;
        }
        if(mobile != "" && !regbox.ftest(mobile,regbox.mobile)){
            util.bgFlicker($(inputDoms[2]));
            i8ui.trterror("请输入正确的手机号！",$(inputDoms[2]));
            return;
        }
        if(password != "" && !regbox.ftest(password,regbox.password)){
            util.bgFlicker($(inputDoms[3]));
            i8ui.trterror("请输入8-20个非空字符！",$(inputDoms[3]));
            return;
        }
        if(!orgid){
            util.bgFlicker(orgDom);
            i8ui.error("请选择部门！");
            return;
        }
        userInfo.Name = name;
        userInfo.Email = email;
        userInfo.MPhone = mobile || userInfo.MPhone;
        userInfo.OrgID = orgid;
        userInfo.OrgName = orgName;
        userInfo.ClassID = classid;
        userInfo.ClassName = className;
        userInfo.NamePinyin = NamePinYin;
        userInfo.Tel = tel;
        userInfo.Position = position;
        userInfo.Gender = sex;
        $.ajax({
            url: i8_session.ajaxHost + "webajax/setcenter/updateInfo",
            type: "get",
            dataType: "json",
            data:{jdata:{psn:userInfo,password:password}},
            success: function (data) {
                if(data.Result){
                    i8ui.write("保存成功！");
                    setTimeout(function(){
                        window.location.href =location.protocol+"//"+ window.location.host + i8_session.baseHost+'setcenter/showperson?uid='+util.getUrlParam("uid");
                    },3000);
                    //inputDoms.val("");
                }else{
                    i8ui.error(data.Description);
                }
            },
            error: function (e1, e2, e3) {
                i8ui.error("请求出错");
            }
        });
    }
    //排序
    function orderBy(arrs){
        for(var i=0; i<arrs.length; i++){
            for(var j= i+1; j<arrs.length; j++){
                if(arrs[i].Score > arrs[j].Score){
                    var item = arrs[j];
                    arrs[j] = arrs[i];
                    arrs[i] = item;
                }
            }
        }
        return arrs;
    }
});