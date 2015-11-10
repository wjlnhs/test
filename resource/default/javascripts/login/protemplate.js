/**
 * Created by chenshanlian on 2015/4/2.
 */
define(function(require,exports){
    var htmlarrs = null;
    function getList() {
        $.ajax({
            url: i8_session.ajaxHost + "webajax/login/etI8Recommend",
            type: "get",
            dataType: "json",
            success: function (data) {
                if (data.Result) {
                    htmlarrs = data.ReturnObject.Item2;
                    var tpl = $("#js_prolist").html();
                    var tmp = template(tpl);
                    $("#js_module_list").html(tmp(data));
                } else {
                    i8ui.error(data.Description);
                }
            },
            error: function (e1, e2, e3) {

            }
        });
    }
    //查看审批链
    $("#js_module_list").delegate( ".yell100x36","click", function () {
        var opDom = $(this).parents("div.lg-wk-set").find("input")
        var tempProcID = opDom.attr("id");
        $.ajax({
            url: i8_session.ajaxHost + "webajax/login/getTempProc",
            type: "post",
            dataType: "json",
            data:{jdata:{tempProcID:tempProcID}},
            success: function (data) {
                if (data.Result) {
                    window.diagramMetaData = data.ReturnObject.Process.ProcDesignMetaData;
                    var showhtml = '<div>'+
                                        '<p class="fz14" style="color: #000; font-size: 14px; padding:10px 15px; margin-top: 15px;">请选择合适的审批链</p>'+
                                        '<label class="shenpi-label"><input id="js_type1" type="radio" name="type-name" />自定义审批链</label><a class="spl-op-tps">何为自定义审批链？<span class="spl-op-tpsspan">流程的审批顺序由发起人在发起流程时自己指定</span></a>'+
                                        '<label class="shenpi-label"><input type="radio" checked name="type-name" />默认审批链</label>'+
                                        '<iframe frameborder="0" width="800" height="300" src="/workflow/design/activity/view"></iframe>'+
                                        '<div style="margin: 20px;" class="tright"><span class="gray96x32 m-r20">取消</span><span class="blue96x32">确定</span></div>'+
                                    '</div>'
                    var sbox = i8ui.showbox({
                        title: data.ReturnObject.Name,
                        cont: showhtml
                    });
                    //确定
                    $(sbox).on("click",".blue96x32",function(){
                        if(document.getElementById("js_type1").checked){
                            opDom.attr("default","true");
                        }else{
                            opDom.attr("default","false");
                        }
                        sbox.close();
                    });
                } else {
                    i8ui.error(data.Description);
                }
            },
            error: function (e1, e2, e3) {

            }
        });
    });
    //预览表单
//    $("#js_module_list").delegate(".blue100x36", "click", function () {
//        var tempProcID = $(this).parents("div.lg-wk-set").find("input").attr("id");
//        $.ajax({
//            url: i8_session.ajaxHost + "webajax/login/getTempProc",
//            type: "post",
//            dataType: "json",
//            data:{jdata:{tempProcID:tempProcID}},
//            success: function (data) {
//                if (data.Result) {
//                    require('/workflow/default/stylesheets/process/app_process_pro.css');
//                    require('/workflow/default/stylesheets/process/app_process_payment.css');
//                    require('/workflow/default/stylesheets/process/join_workflow.css');
//                    require('/workflow/default/stylesheets/process/app_process_pro_view.css');
//
//                    i8ui.showbox({
//                        title: data.ReturnObject.Name,
//                        cont: '<div style="min-width: 800px;">'+data.ReturnObject.Process.Form.Meta+'</div>'
//                    });
//                } else {
//                    i8ui.error(data.Description);
//                }
//            },
//            error: function (e1, e2, e3) {
//
//            }
//        });
//    });
    getList();
    //激活选中
    $("#js_activation_btn").click(function(){
        var temps = [];
        $("#js_module_list input").each(function(){
            if(this.checked){
                var isUseCustomApprovalChain = $(this).attr("default") || false;
                temps.push({
                    tempProcID:this.id,
                    isActive: true,
                    isUseCustomApprovalChain:isUseCustomApprovalChain
                });
            }
        });
        if(temps.length <= 0){
            i8ui.error("最少选择一直流程激活吧！");
            return;
        }
        $.ajax({
            url: i8_session.ajaxHost + "webajax/login/exportToProcess",
            type: "post",
            dataType: "json",
            data:{jdata:{temps:temps}},
            success: function (data) {
                if (data.Result) {
                    i8ui.write("激活成功！");
                    setTimeout(function(){
                        window.location.href = '/login/groupcreate'
                    },2000)
                } else {
                    i8ui.error(data.Description);
                }
            },
            error: function (e1, e2, e3) {

            }
        });
    });
})
