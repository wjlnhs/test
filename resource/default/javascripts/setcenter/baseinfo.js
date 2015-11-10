/**
 * Created by chenshanlian on 2015/3/16.
 */
define(function(require){
    var i8ui = require('../common/i8ui.js');
    var util = require('../common/util.js');
    var regbox = require('../common/regexp.js');
    var fileuploader=require('../plugins/qiniu_uploader/qiniu_i8uploader');
    var imgInfo = null;
    //文件上传按钮
    var options = {'button':"js_upfile_btn",//按钮ID
        'fileContainerId':'js_upfile_lists',//装文件容器
        'btnContainerId':'js_upfile_div',//按钮ID容器
        'tokenUrl':'/platform/uptoken',
        'flashUrl':'/default/javascripts/plugins/qiniu_uploader/plupload/Moxie.swf',
        'beforeUpload':function(){
            $("#js_upfile_btn").attr("class","loading32").html("上传中...");
        },
        'fileUploaded':function(up, file, info){
            var fileJson = eval('('+info+')');
            var imgurl = "//dn-"+fileJson.bucket+".qbox.me/"+fileJson.key+"?imageView2/1/w/195/h/80";
            $("#js_logo_img").attr("src",imgurl);
            $("#js_upfile_btn").attr("class","blue94x32").html("选择文件");
        }
    };
    var attment = fileuploader.i8uploader(options);
    function setBaseInfo(){
        var companyName = $.trim($("#js_company_name").val());
        var accountName = $.trim($("#js_account_name").val());
        var files = attment.getUploadFiles();
        if(files && files.length){
            imgInfo = files[0];
        }
        if(!regbox.ftest(companyName,regbox.nametext)){
            i8ui.txterror("请输入2-15个字符，不包含特殊字符！",$("js_company_name"));
            return;
        }
        if(!regbox.ftest(accountName,regbox.nametext)){
            i8ui.txterror("请输入2-15个字符，不包含特殊字符！",$("js_account_name"));
            return;
        }
        var jdata = {
            domain: baseInfo.Domain,
            cmpName: companyName,
            actName: accountName,
            backimage: baseInfo.BackImage,
            logo: baseInfo.Logo,
            SystemName: baseInfo.SystemName
        };
        var imgUrl = $("#js_logo_img").attr("src");
        if(baseInfo.Logo != imgUrl){
            jdata.info = imgInfo;
        }
        $.ajax({
            url: i8_session.ajaxHost + "webajax/setcenter/setLogoInfo",
            type: "get",
            dataType: "json",
            data:{jdata:jdata},
            success: function (data) {
                console.log(data);
                if(data.Result){
                    i8ui.write("保存成功！");
                }else{
                    i8ui.error(data.Description);
                }
            },
            error: function (e1, e2, e3) {
                i8ui.error("请求出错");
            }
        });
    }
    //保存修改
    $("#js_have_info").click(setBaseInfo);
//    $.ajax({
//        url: i8_session.ajaxHost + "webajax/setcenter/getBaseInfo",
//        type: "get",
//        dataType: "json",
//        success: function (data) {
//            console.log(data);
//        },
//        error: function (e1, e2, e3) {
//            i8ui.error("请求出错");
//        }
//    });
})