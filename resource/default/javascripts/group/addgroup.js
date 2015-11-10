define(function(require,exports){
    var i8ui = require('../common/i8ui');
    var fileuploader=require('../plugins/qiniu_uploader/qiniu_i8uploader');
    var util = require('../common/util.js');
    var pingyinObj = require('../common/workflow_pinyin.js');
    var fw = require('../group/public.js');
    var inviteSel = null;
    function upfile(){
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
                var imgurl = "https://dn-"+fileJson.bucket+".qbox.me/"+fileJson.key;
                $("#js_add_group_icon").attr("src",imgurl);
                $("#js_upfile_btn").attr("class","btn-blue96x32").html("选择文件");
            }
        };
        fileuploader.i8uploader(options);
    }
    var uname = i8_session.uname;
    function addGroup(adbox,callback){
        var groupName = $.trim($("#js_add_gp_name").val());
        var groupIntro = $.trim($("#js_add_gp_intro").val());
        var groupType = $("input[name='group_type']:checked").val();
        var groupIcon = $("#js_add_group_icon").attr("src");
        var regName = new RegExp("^[a-zA-Z0-9\u4e00-\u9fa5]{2,30}$");
        if(!regName.test(groupName)){
            util.i8alert({str:"群组名称只能输入字母、数字、汉字，且长度不能超过30个字！",stype: true, btnobj: $("#js_add_gp_name")});
            i8ui.txtError($("#js_add_gp_name"));
            $("#js_add_gp_name").focus();
            return;
        }
        if(groupIntro == ""){
            util.i8alert({str:"请输入群组简介！",stype: true, btnobj: $("#js_add_gp_intro")});
            i8ui.txtError($("#js_add_gp_intro"));
            $("#js_add_gp_intro").focus();
            return;
        }
        if(groupIntro.length > 40){
            util.i8alert({str:"群组简介不能超过40个字！",stype: true, btnobj: $("#js_add_gp_intro")});
            i8ui.txtError($("#js_add_gp_intro"));
            $("#js_add_gp_intro").focus();
            return;
        }
        var NamePinYin = pingyinObj.ConvertPinyin(groupName);
        $("#js_lg_tp_div").remove();
        $.ajax({
            url: i8_session.ajaxHost+'webajax/group/saveGroupParam',
            type: 'post',
            dataType: 'json',
            data: {Name: groupName, Description: groupIntro, Type: groupType,Icon: groupIcon, NamePinYin: NamePinYin},
            success: function(result){
                if(result.Result){
                    i8ui.write("创建成功！");
                    var groupDT = result.ReturnObject;
                    var inviteArrs = inviteSel? inviteSel.selectedData() : [];
                    if(inviteArrs.length > 0){
                        var datas = {
                            groupID: groupDT.ID,
                            userIDs: inviteArrs.split(";"),
                            message: fw.getMessage("invite",groupDT, uname)
                        }
                        $.ajax({
                            url: i8_session.ajaxHost+'webajax/group/inviteMember',
                            type: 'get',
                            dataType: 'json',
                            data: datas,
                            cache: false,
                            success: function(result){
                                if(result.Result){
                                    adbox.close();
                                    if(callback){
                                        callback(groupDT);
                                    }else{
                                        setTimeout(function(){
                                            var aDom = document.createElement("div");
                                            $("body").append(aDom);
                                            aDom.innerHTML="<form id='hiddenlink' action='/group/home' target='_blank'><input type='hidden' name='id' value='"+ groupDT.ID+"'></form>";
                                            var s=document.getElementById("hiddenlink");
                                            s.submit();
                                        },1500);
                                    }
                                }else{
                                    i8ui.error("邀请出错！");
                                }
                            },
                            error: function(e1,e2,e3){
                            }
                        });
                    }else{
                        i8ui.write("创建成功！");
                        adbox.close();
                        if(callback){
                            callback(groupDT);
                        }else{
                            setTimeout(function(){
                                var aDom = document.createElement("div");
                                $("body").append(aDom);
                                aDom.innerHTML="<form id='hiddenlink' action='group/home' target='_blank'><input type='hidden' name='id' value='"+ groupDT.ID+"'></form>";
                                var s=document.getElementById("hiddenlink");
                                s.submit();
                            },1500);
                        }
                    }

                }else{
                    i8ui.error(result.Description);
                }
            },
            error: function(e1,e2,e3){
            }
        });
    }
    function updateGroup(grpObj, adbox, callback){
        var groupName = $.trim($("#js_add_gp_name").val());
        var groupIntro = $.trim($("#js_add_gp_intro").val());
        var groupType = $("input[name='group_type']:checked").val();
        var groupIcon = $("#js_add_group_icon").attr("src");
        var regName = new RegExp("^[a-zA-Z0-9\u4e00-\u9fa5]{2,30}$");
        if(!regName.test(groupName)){
            util.i8alert({str:"群组名称只能输入字母、数字、汉字，且长度不能超过30个字！",stype: true, btnobj: $("#js_add_gp_name")});
            i8ui.txtError($("#js_add_gp_name"));
            $("#js_add_gp_name").focus();
            return;
        }
        if(groupIntro == ""){
            util.i8alert({str:"请输入群组简介！",stype: true, btnobj: $("#js_add_gp_intro")});
            i8ui.txtError($("#js_add_gp_intro"));
            $("#js_add_gp_intro").focus();
            return;
        }
        if(groupIntro.length > 40){
            util.i8alert({str:"群组简介不能超过40个字！",stype: true, btnobj: $("#js_add_gp_intro")});
            i8ui.txtError($("#js_add_gp_intro"));
            $("#js_add_gp_intro").focus();
            return;
        }
        $("#js_lg_tp_div").remove();
        grpObj.Name = groupName;
        grpObj.NamePinYin = pingyinObj.ConvertPinyin(groupName);
        grpObj.Description = groupIntro;
        grpObj.Icon = groupIcon;
        grpObj.Type = groupType;
        grpObj.ignoreMembers = true;
        var grpdt = grpObj;
        grpdt.Members = undefined;
        $.ajax({
            url: i8_session.ajaxHost+'webajax/group/updateGroupParam',
            type: 'post',
            dataType: 'json',
            data: {group: grpdt},
            success: function(result){
                if(result.Result){
                    i8ui.write("保存成功！");
                    adbox.close();
                    if(callback){
                        callback(grpObj);
                    }
                }else{
                    i8ui.error(result.Description);
                }
            },
            error: function(e1,e2,e3){
            }
        });
    }
    function loadDt(grpObj){
        var i = 0;
        var radioDoms = $("#js_add_gp_type").find("div");
        $("#js_add_gp_name").val(grpObj.Name);
        $("#js_add_gp_intro").val(grpObj.Description);
        radioDoms.removeClass("ck");
        if(grpObj.Type == 1){
            i = 2;
        }
        if(grpObj.Type == 2){
            i = 1;
        }
        $(radioDoms[i]).find("input").attr("checked","checked");
        $(radioDoms[i]).addClass("ck");
        $("#js_add_group_icon").attr("src",grpObj.Icon);
        $("#js_addedit_grp_btn").html("保存修改");
    }
    function showAddGroup(grpObj,callback){
        var tpl = require("./template/addgroup.tpl");
        var tmp = template(tpl);
        var title = "创建群组"
        if(grpObj){
            title = "编辑群组"
        }
        var groupBox = i8ui.showbox({
            title:title,
            cont:tmp({})
        });
        //分类切换选择事件
        $("#js_add_gp_type").on("click","label",function(){
            var $this = $(this);
            $("#js_add_gp_type").find("div.igroup-type-op").removeClass("ck");
            $this.parent().addClass("ck");
        });
        //新增群组或者编辑群组
        $(groupBox).on("click","span.igroup-c-btn",function(){
            var btnDom = $(this);
            if(btnDom.attr("class").indexOf("disabled")>=0){
                return;
            }
            btnDom.addClass("disabled");
            setTimeout(function(){
                btnDom.removeClass("disabled");
            },3000);
            if($(this).html() == "创建新群组"){
                addGroup(groupBox,callback);
            }else{
                updateGroup(grpObj,groupBox,callback);
            }
        });
         upfile();
        if(grpObj){
            loadDt(grpObj);
        }else{
            $("#js_gp_add_tr").show();
            var selector = require('../plugins/i8selector/fw_selector.js');
            inviteSel = selector.KSNSelector({
                model:2,
                width: 597,
                element: '#js_invite_gp_txt',
                searchType: { "org": false, "user": true, "grp": false },
                selectCallback: function (uid, uname, uemail,utype,obj) {
                }
            });
        }

    }
    exports.groupBox = showAddGroup;
});