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
            var fileJson = JSON.parse(info);
            var imgurl = "//dn-"+fileJson.bucket+".qbox.me/"+fileJson.key+"?imageView2/1/w/195/h/80";
            $("#js_logo_img").attr("src",imgurl);
            $("#js_upfile_btn").attr("class","blue94x32").html("选择文件");
            showPerview();
        }
    };
    var attment = fileuploader.i8uploader(options);
    function setBaseInfo(){
        var systemName = $.trim($("#js_sysname").val());
        var files = attment.getUploadFiles();
        if(files && files.length){
            imgInfo = files[0];
        }
//        if(!baseInfo.DomainEdited) {
//            var newDomain = $.trim($("#js_domain").val());
//            var reg = new RegExp('[a-z0-9]{4,}');
//            if (!reg.test(newDomain)) {
//                i8ui.txterror("请输入4位以上字母或数字！", $("#js_domain"));
//                return;
//            } else {
//                baseInfo.Domain = newDomain;
//            }
//        }
        if(systemName == ""){
            i8ui.trterror("请输入系统名称！",$("#js_sysname"));
            return;
        }
        var imgUrl = $("#js_logo_img").attr("src");

        var jdata = {
            accountID: baseInfo.ID,
            domain: baseInfo.Domain,
            cmpName: baseInfo.CompanyName,
            actName: baseInfo.AccountName,
            backimage: baseInfo.BackImage,
            logo: baseInfo.Logo,
            SystemName: systemName
        };
        if(baseInfo.BackImage != imgUrl){
            jdata.info = imgInfo;
        }
        $("#js_have_info").addClass("disabled");
        $.ajax({
            url: i8_session.ajaxHost + "webajax/setcenter/setBaseInfo",
            type: "get",
            dataType: "json",
            data:{jdata:jdata},
            success: function (data) {
                $("#js_have_info").removeClass("disabled");
                if(data.Result){
                    i8ui.write("修改成功！");
                    setTimeout(function(){
                        window.location.reload();
                    },1000)
                }else{
                    i8ui.error(data.Description);

                }
            },
            error: function (e1, e2, e3) {
                i8ui.error("请求出错");
                $("#js_have_info").removeClass("disabled");
            }
        });
    }
    //保存修改
    $("#js_have_info").click(function(){
        if($(this).attr("class").indexOf("disabled") >= 0){
            return false;
        }else{
            setBaseInfo();
        }
    });
    function showPerview(){
        var urlhost = window.location.host;
        var arrs = urlhost.split(".");
        arrs[0] = location.protocol+"//"+ baseInfo.Domain;
        $("#js_url_perview").attr("href",arrs.join('.') + i8_session.baseHost +"setcenter/preview?imgurl="+ $("#js_logo_img").attr("src"));
    }
    showPerview();
    function showApplyDomain(){
        var hosts = window.location.host.split(".");
        var urlhost = "."+hosts[1]+"."+hosts[2];
        var showhtml = '<div class="apply-cont">' +
                            '<div class="apply-div"><span class="apply-tt">公司名称：'+ i8_session.aname +'</span><span class="apply-tt">社区名称：'+ i8_session.aname +'</span></div>'+
                            '<div class="apply-div"><span class="apply-tt">当前域名：'+ window.location.host+'</span><span>申请域名：</span><input id="js_domain" typte="text" /> '+urlhost+'</div>' +
                            '<div class="tright apply-div"><span class="blue94x32 m-r10">申请</span><span class="gray94x32">取消</span></div>'
                        '</div>';
        var sbox = i8ui.showbox({title:"个性化域名申请",cont:showhtml});
        $("#js_apply_a").html();
        //确定
        $(sbox).on("click",".blue94x32",function(){
            var newDomain = $.trim($("#js_domain").val());
            var oldDomain = baseInfo.Domain;
            var reg = new RegExp('[a-z0-9]{4,}');
            if (!reg.test(newDomain)) {
                i8ui.txterror("请输入4位以上字母或数字！", $("#js_domain"));
                return;
            }
            var apply = {
                CompanyName: baseInfo.CompanyName,
                ApplyAppKey:"个性化域名",
                ApplyType:4,
                DomainInfo:{
                    OldDomainName:oldDomain+urlhost,
                    NewDomainName:newDomain+urlhost
                }
            }
            $.ajax({
                url: i8_session.ajaxHost + "webajax/setcenter/applyApplication",
                type: "post",
                dataType: "json",
                data: {jdata:{apply:apply}},
                success: function (data) {
                    if(data.Result){
                        i8ui.write("申请成功！");
                        sbox.close();
                    }else{
                        i8ui.error(data.Description);
                    }
                    console.log(data);
                },
                error: function (e1, e2, e3) {
                    i8ui.error("请求出错");
                }
            });
        });
    }
    $("#js_apply_a").click(showApplyDomain);
})