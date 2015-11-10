define(function(require){
    var i8ui = require('../common/i8ui');
    var util = require('../common/util');
    var fw = require('../cement/public.js');
    var fileuploader=require('../plugins/qiniu_uploader/qiniu_i8uploader');
    var i8selector = require("../plugins/i8selector/fw_selector.js");
    var urlId = fw.getUrlParam("id");
    var cementObj = null;
    var isupfile = true;
    var upfilebox = null;
    var typeIcons = {};
    function getTimeCompare(t1,t2){
        var time1 = new Date(t1.replace(/-/g,"/"));
        var time2 = new Date(t2.replace(/-/g,"/"));
        return time1 > time2;
    }
    var fileObj = null;
    var ksn_owner = i8selector.KSNSelector({
        model: 2,
        width: 854,
        element: "#js_pub_scope",
        isAbox: true,
        searchType: { "org": true, "user": true, "grp": false },
        selectCallback: function(uid){
            //getManagerByID(uid);
            document.getElementById("js_pub_scope2").checked = true;
            //console.log(ksn_owner.getAllselectedData());
        }
    });
    function upfile(list){
        //文件上传按钮
        var options = {'button':"js_upfile_btn",//按钮ID
            'fileContainerId':'js_upfile_lists',//装文件容器
            'btnContainerId':'js_upfile_div',//按钮ID容器
            'tokenUrl':'/platform/uptoken',
            'flashUrl':i8_session.resHost+'default/javascripts/plugins/qiniu_uploader/plupload/Moxie.swf',
            'attachmentlist': list,
            'maxFiles':6,
            'beforeUpload':function(){
                $("#js_upfile_btn").attr("class","loading32").html("上传中...");
            },
            'fileUploaded':function(up, file, info){
                var fileJson = eval('('+info+')');
                var imgurl = "https://dn-"+fileJson.bucket+".qbox.me/"+fileJson.key+"?imageView2/1/w/195/h/80";
                $("#js_logo_img").attr("src",imgurl);
                $("#js_upfile_btn").attr("class","blue94x32").html("选择文件");
                //console.log(fileObj.getExistFiles());
                //console.log(fileObj.getUploadFiles());
            }
        };
        fileObj = fileuploader.i8uploader(options);
    }
    function editLoad(id){
        $.ajax({
            url: i8_session.ajaxHost+'webajax/cement/get-cementid',
            type: 'get',
            dataType: 'json',
            cache: false,
            data: {announcementID: id},
            success: function(result){
                console.log(result.ReturnObject);
                if(result.Result){
                    cementObj = result.ReturnObject;
                    $("#js_cement_topic").val(cementObj.Title);
                    editor.html(cementObj.Content);
                    $("#js_pub_type2").attr("checked","checked");
                    $("#js_pubtime").val(cementObj.SendTime);
                    $("#js_cement_save_btn").html("保存修改");
                    $("#js_type_list").setValue(cementObj.CategoryID);
                    var selDatas = [];
                    if(cementObj.UserLimitDict){
                        for(var key in cementObj.UserLimitDict){
                            selDatas.push({id:key,type:'user'});
                        }
                    }
                    if(cementObj.OrgLimitDict){
                        for(var key in cementObj.OrgLimitDict){
                            selDatas.push({id:key,type:'org'});
                        }
                    }
                    ksn_owner.setAllselectedData(selDatas);
                    if(selDatas.length > 0){
                        document.getElementById("js_pub_scope2").checked = true;
                    }
                    upfile(result.ReturnObject.FlieList);
                }else{
                    i8ui.error(result.Message);
                }
            },
            error: function(e1,e2,e3){
                i8ui.error("获取分类列表失败");
            }
        });
    }
    //选择立即发布 清空时间框
    $("#js_pub_type1").click(function(){
        if(this.checked){
            $("#js_pubtime").val("");
        }
    });
    //加载分类
    fw.getTypeList(function(typeList){
        var strhtml = '';
        for(var i = 0; i< typeList.length; i++){
            if(i < 3){
                typeIcons[typeList[i].ID] = 'cement-icon'+ i;
            }else{
                typeIcons[typeList[i].ID] = 'cement-icon';
            }
            strhtml += '<option value="'+ typeList[i].ID +'">'+ typeList[i].CategoryName +'</option>';
        }
        if(strhtml == ""){
            strhtml = '<option>暂无分类</option>';
        }
        $("#js_type_list").html(strhtml);
        $("#js_type_list").setSelect({style:"background: #fff; height: 33px; line-height: 33px; width: 1070px;"});
        if(cementObj){
            $("#js_type_list").setValue(cementObj.CategoryID);
        }
    });
    function addCement(type){
        var categoryID = $("#js_type_list").getValue();
        var releaseType = 0;
        var sendTime = '';
        var orgLimitDict = {} //发布组织范围
        var userLimitDict = {}; //发布用户范围
        if(!document.getElementById("js_pub_type1").checked){
            releaseType = 1;
            sendTime = $("#js_pubtime").val();
        }
        var title = $.trim($("#js_cement_topic").val());
        var content = editor.html();
        if(categoryID == ""){
            i8ui.error('分类为空！');
            return;
        }
        if(releaseType == 1 && sendTime == ""){
            i8ui.error('请选择定时发布时间！');
            $("#js_pubtime").focus();
            return;
        }
        if(document.getElementById("js_pub_scope2").checked){
            var ckAlls = ksn_owner.getAllselectedData();
            for(var i=0; i<ckAlls.length; i++){
                var item = ckAlls[i];
                if(item.type == 'user'){
                    userLimitDict[item.id] = item.name;
                }else if(item.type == 'org'){
                    orgLimitDict[item.id] = item.name;
                }
            }
            if(orgLimitDict.length == 0 && userLimitDict.length == 0){
                i8ui.error('发布范围不能为空！');
                return;
            }
        }
        if(title == ""){
            i8ui.error('请输入标题！');
            $("#js_cement_topic").focus();
            return;
        }
        if(content == ""){
            i8ui.error('请输入内容！');
            $("#js_cement_cont").focus();
            return;
        }
        var old_atachment = fileObj.getExistFiles();
        //获取附件信息
        var attachment = fileObj.getUploadFiles();

        var ajax_url = i8_session.ajaxHost+'webajax/cement/addcement';
        if(type == "update"){
            ajax_url = i8_session.ajaxHost+'webajax/cement/update-cement';
            if(getTimeCompare(cementObj.CreateTime,sendTime)){
                i8ui.alert({title:'发布时间不能小于创建时间！',btnDom: $("#js_pubtime")});
                $("#js_pubtime").focus();
                return;
            }
        }
        var jdata = {
            categoryID: categoryID,
            title: title,
            content: content,
            releaseType: releaseType,
            sendTime: sendTime,
            announID: urlId,
            isTop: document.getElementById("js_isup2").checked,
            attachment: attachment,
            oldfile: old_atachment,
            orgLimitDict: encodeURI(util.toJsonString(orgLimitDict)),
            userLimitDict:encodeURI(util.toJsonString(userLimitDict))
        }
        $(".placard-have-btn").addClass("placard-cancel-btn");
        $.ajax({
            url: ajax_url,
            type: 'post',
            dataType: 'json',
            data: {jdata: jdata},
            cache: false,
            success: function(result){
                console.log(result);
                if(result.Result){
                    i8ui.write('发布成功！');
                    setTimeout(function(){
                        window.location.href="/cement/manager";
                    },1500);
                }else{
                    i8ui.error(result.Description);
                    $(".placard-have-btn").removeClass("placard-cancel-btn");
                }
            },
            error: function(e1,e2,e3){
                i8ui.error("服务器异常，发布失败");
                $(".placard-have-btn").removeClass("placard-cancel-btn");
            }
        });

    }
    //保存
    $("#js_cement_save_btn").click(function(){
        if($(this).html() == "发布"){
            addCement();
        }else{
            addCement('update');
        }
    });
    function begin(){
        if( urlId != ""){
            editLoad(urlId);
        }else{
            upfile();
        }
        $("#js_cement_head_ct").html('<span class="app-placard-icon2 lt m-r15"></span><p class="b fz18 m-t10 heit lt">编辑发布</p>');
    };
    //预览
    $("#js_cement_view_btn").click(function(){
        require('../../stylesheets/fj_see.css');
        var filesDoms = $("#js_upfile_lists").find("li");
        var imgHtml = '';
        var fileHtml = '';
        filesDoms.each(function(){
            var $this = $(this);
            var imgDoms = $this.find("img");
            if(imgDoms.length > 0){
                var srcUrl = imgDoms.attr("src");
                imgHtml += '<li class="kks_option_li cememt-file-img doc-options oflow"><img src="'+ srcUrl.split("?")[0] +'?imageView2/1/w/345/h/215"></li>'
            }else{
                var fileName = $this.find("p.title").html();
                fileHtml += '<li class="file-li oflow p-l20"><span style="max-width:290px;" class="filename-span doc-options m-l10">'+ fileName +'</span><a class="doc-options">查看</a><a class="kks-down-a attfile-down">下载</a><a class="btn-place-on-file">归档</a></li>'
            }
        });

        var htmlstr = '<div style="background: #f5f5f5;padding: 20px 20px 20px 0px;">'+
            '<p class="cement-type tcenter cl000 lt"><i class="cment-bg '+ typeIcons[$("#js_type_list").getValue()] +'"></i>'+ $("#js_type_list").getKey() +'</p>'+
            '<div class="cement-rt-cont m-l110 w705 item-right-con">'+
                '<div class="cement-ops-panl rel">'+
                    '<div class="cement-ops-cont">'+
                        '<span class="rt-linj">◆<span>◆</span></span>'+
                        '<p class=""><span class="cl000 fz14-weight" href="cement/detial?id={id}">'+ $("#js_cement_topic").val() +'</span></p>'+
                        '<div class="cl000">'+
                            editor.html()+
                        '</div>'+
                        '<div class="m-t10">'+
                            '<ul class="kks_op_ulimgs">'+ imgHtml +'</ul>'+
                            '<ul class="att_ulfile">'+ fileHtml +'</ul>'+
                        '</div>'+
                    '</div>'+
                '</div>'+
                '<div class="cement-list-edit">'+
                    '<span>刚刚</span>'+
                    '<div class="rt">删除<a class="m-l10 m-comment opt-comment">评论</a></div>'+
                '</div>'+
            '</div>'+
        '</div>';
        var sbox = i8ui.showbox({
            title:"发布预览",
            cont:htmlstr
        });
    });
    begin();
})