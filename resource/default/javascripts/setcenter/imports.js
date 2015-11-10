/**
 * Created by chenshanlian on 2015/3/31.
 */
define(function(require){
    var i8ui = require('../common/i8ui.js');
    var util = require('../common/util.js');
    var upfileContor = require('../plugins/i8uploader/fw_i8uploader.js');
    var aid = i8_session.aid;
    var pid = i8_session.uid;
    function upfile(){
        var rootPath='/default/';
        var option={
            publishBtn:'#js_save_set_img',
            swf:rootPath + 'swf/Uploader.swf', // 'swf/swfupload.swf',
            server: i8_session.ajaxHost+'webajax/login/pubExcel?aid='+ aid+"&pid="+ pid,//
            pick: {
                id: '#js_upfile_btn',
                label: '立即上传',
                html: '<a class="dr-down-link">立即上传</a>'
            },
            attachmentlist: [],
            dnd: '#uploader .queueList',
            paste: document.body,
            disableGlobalDnd: true,
            accept:{
                extensions: 'xlsx'
            },
            completeDelete:true,
            chunked: true,
            fileNumLimit: 1,
            fileSizeLimit: 20 * 1024 * 1024,    // 所有文件限制20M
            fileSingleSizeLimit: 5 * 1024 * 1024 ,   // 单个文件限制5M
            uploadSuccess: function (file,data) {
                var rightcount = 0;
                var errorcount = 0;
                var rightHtml = '';
                var errorHtml = '';
                for(var key in file){
                    if(file[key] == 0){
                        for(var i=0; i<data.psnArray.length; i++){
                            if(key == data.psnArray[i].Passport){
                                rightcount++;
                                rightHtml += '<tr><td style="width:100px;">'+ key +'</td><td style="width:100px;">'+ data.psnArray[i].Name +'</td><td style="width:100px;">'+ data.psnArray[i].OrgPath +'</td></tr>';
                            }
                        }

                    }else{
                        errorcount++;
                        errorHtml += '<tr><td style="width:100px;">'+ key +'</td><td><span style="color: red;">'+ file[key] +'</span></td></tr>';
                    }
                }
                errorcount = errorcount + data.ErrorArray.length;
                for(var i=0; i<data.ErrorArray.length; i++){
                    errorHtml += '<tr><td style="width:100px;">'+ data.ErrorArray[i].Passport +'</td><td><span style="color: red;">'+ data.ErrorArray[i].errTxt +'</span></td></tr>';
                }
                $("#com_set_import_after").show();
                $("#com_set_import_prev").hide();
                $("#js_import_success_num").html(rightcount);
                $("#js_import_error_num").html(errorcount);
                $("#js_show_success_lists").html(rightHtml);
                $("#js_show_error_lists").html(errorHtml);
            }, /*文件上传成功回调*/
            uploadFailed: function (file) {
                i8ui.error("文件上传失败！")
            },/*文件上传失败*/
            uploadCompleted: function (error) {
            },//文件上传结束 成功或失败
            deleteCallBack: function (file) {
            }, /*删除文件回调*/
            uploadStarted: function (file) {
                $('#js_set_img_type2').append('<img class="loadImg" style="position: absolute;top:30%;left: 50%; margin-left: -30px;margin-top: -30px;width: 60px;z-index:999;" src="/default/images/preloader_6.gif">');
            }/*开始上传触发*/
        };
        //console.log(upfileContor);
        return upfileContor.i8uploader(option);
        //$(option.publishBtn).on('click',function(){
        //    console.log(i8uploader.getUploadFiles());//获取上传的文件
        //    console.log(i8uploader.getExistFiles());//获取初始化已有的文件
        //});
    }
    function getClassline(){
        $.ajax({
            url: i8_session.ajaxHost + "webajax/login/getClassline",
            type: "post",
            dataType: "json",
            data: {aid: aid},
            success: function (data) {
                console.log(data);
            },
            error: function (e1, e2, e3) {

            }
        });
    }

    upfile();
    $("#js_down_url").attr("href",'/webajax/login/excel_module.xlsx?aid='+aid+"&pid="+ pid);
    $("#js_return_invite").attr("href","/login/invite?a="+aid+"&pid="+ pid);
    $("#js_upfile_btn_span").click(function(){
        $("#com_set_import_prev").show();
        $("#com_set_import_after").hide();
    });
});
