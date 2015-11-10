/**
 * Created by Administrator on 2015/6/15.
 */
define(function(require){
    var i8ui = require('../common/i8ui.js');
    //保存信息
    $("#js_set_quit").click(function(){
        var positions = [];
        $("#js_tblist").find("table").each(function(){
            var inputs = $(this).find("input");
            var textares = $(this).find("textarea");
            var options = {};
            options.name = $(inputs[0]).val();
            options.wage = $(inputs[1]).val();
            options.workyear = $(inputs[2]).val();
            options.duty = ($(textares[0]).val()).replace(/\n/g,"<br>");
            options.requirement = ($(textares[1])).val().replace(/\n/g,"<br>");
            positions.push(options);
        });
        $.ajax({
            url: i8_session.ajaxHost + "webajax/setcenter/writefile",
            type: "post",
            dataType: "json",
            cache: false,
            data:{positions: positions},
            success: function (data) {
                if (data.Result) {
                    i8ui.write("保存成功！");
                } else {
                    i8ui.error("保存失败！");
                }
            },
            error: function (e1, e2, e3) {

            }
        });
    });
    //删除选项
    $("#js_tblist").on("click",".org-btn",function(){
        $(this).parents("table").remove();
    });
    //新增职位
    $("#js_add_op").click(function(){
        var htmlstr = '<table class="position-table"><tr><td>职位名称：<input type="text" value="" /><span class="org-btn blue delete">删除</span></td><td>职位薪资：<input type="text" value="" /></td><td>工作年份：<input type="text" value="" /></td></tr><tr><td colspan="3">岗位职责：<textarea></textarea></td></tr><tr><td colspan="3">岗位要求：<textarea></textarea></td></tr></table>'
        $("#js_tblist").append(htmlstr)
    });
    function getList(){
        $.ajax({
            url: i8_session.ajaxHost + "webajax/setcenter/readfile",
            type: "get",
            dataType: "json",
            cache: false,
            success: function (data) {
                var tpl = $("#js_tpl").html();
                var tmp = template(tpl);
                var html = tmp({Item:data});
                $("#js_tblist").html(html);
            },
            error: function (e1, e2, e3) {

            }
        });
    }
    getList();
});
