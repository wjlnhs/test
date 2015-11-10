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
    var tbodyDom = $("#js_tbody_list");
    //获取公共通讯录列表
    function getList() {
        tbodyDom.html('<tr><td colspan="4"><div class="ld-64-write"></div></td></tr>');
        $.ajax({
            url: i8_session.ajaxHost + "webajax/ucenter_ajax/getpublicmail",
            type: "get",
            dataType: "json",
            cache: false,
            success: function (data) {
                console.log(data);
                if (data.Result) {
                    personArrs = data.ReturnObject.contract;
                    var tpl = require('./template/pubcontacts.tpl');
                    var tmp = template(tpl);
                    template.helper("getRole",function(arrs){
                        var str = arrs.join('，');
                        return str.replace('20','基础设置管理员').replace('30','社区管理员').replace("40","流程管理员");
                    });
                    if(personArrs.length <= 0){
                        tbodyDom.html('<tr><td colspan="4"><div class="noresult bold"><div class="noresult-icon"></div>公共通讯录还没有数据哦~</div></td></tr>');
                    }else{
                        tbodyDom.html(tmp(data.ReturnObject));
                    }

                } else {
                    i8ui.error(data.Description);
                }
            },
            error: function (e1, e2, e3) {
            }
        });
    }
    //新增公共通讯录
    $("#js_add_cont").click(function(){
        var tpl = require('./template/saveContacts.tpl');
        var tmp = template(tpl);
        var sbox = i8ui.showbox({
            title:"新增公共通讯录",
            cont:tmp({})
        });
        //保存
        $(sbox).on("click",".blue96x32",function(){
            var name = $.trim($("#js_contatcs_tt").val());
            var tel = $.trim($("#js_contatcs_tel").val());
            var addr = $.trim($("#js_contatcs_info").val());
            if(name == ""){
                i8ui.error("请输入显示标题！");
                $("#js_contatcs_tt").focus();
                return;
            }
            if(tel == ""){
                i8ui.error("不能为空!");
                $("#js_contatcs_tel").focus();
                return;
            }
            var pubjson = {
                name : name,
                tel : tel,
                addr : addr
            }
            $.ajax({
                url: i8_session.ajaxHost + "webajax/setcenter/setPublicList",
                type: "get",
                dataType: "json",
                cache: false,
                data:{jdata:{pub: pubjson}},
                success: function (data) {
                    console.log(data);
                    if (data.Result) {
                        i8ui.write("新增成功！");
                        sbox.close();
                        getList();
                    } else {
                        i8ui.error(data.Description);
                    }
                },
                error: function (e1, e2, e3) {
                }
            });
        });
    });
    //删除通讯录
    tbodyDom.on("click",".org-per-other",function(){
        var $this = $(this);
        var item = personArrs[$this.attr("index")];
        i8ui.confirm({title:"确定要删除吗？",btnDom: $(this)},function(){
            $.ajax({
                url: i8_session.ajaxHost + "webajax/setcenter/delPublicList",
                type: "get",
                dataType: "json",
                cache: false,
                data:{jdata:{pubID: item.id}},
                success: function (data) {
                    console.log(data);
                    if (data.Result) {
                        i8ui.write("删除成功！");
                        getList();
                    } else {
                        i8ui.error(data.Description);
                    }
                },
                error: function (e1, e2, e3) {
                }
            });
        });
    });
    //编辑通讯录
    tbodyDom.on("click",".org-per-edit",function(){
        var $this = $(this);
        var item = personArrs[$this.attr("index")];
        var tpl = require('./template/saveContacts.tpl');
        var tmp = template(tpl);

        var sbox = i8ui.showbox({
            title:"编辑公共通讯录",
            cont:tmp(item)
        });
        //保存
        $(sbox).on("click",".blue96x32",function(){
            var name = $.trim($("#js_contatcs_tt").val());
            var tel = $.trim($("#js_contatcs_tel").val());
            var addr = $.trim($("#js_contatcs_info").val());
            if(name == ""){
                i8ui.error("请输入显示标题！");
                $("#js_contatcs_tt").focus();
                return;
            }
            if(tel == ""){
                i8ui.error("不能为空，且不能输入特殊字符！");
                $("#js_contatcs_tel").focus();
                return;
            }
            item.name = name;
            item.addr = addr;
            item.tel = tel;
            $.ajax({
                url: i8_session.ajaxHost + "webajax/setcenter/setPublicList",
                type: "get",
                dataType: "json",
                cache: false,
                data:{jdata:{pub: item}},
                success: function (data) {
                    console.log(data);
                    if (data.Result) {
                        i8ui.write("保存成功！");
                        sbox.close();
                        getList();
                    } else {
                        i8ui.error(data.Description);
                    }
                },
                error: function (e1, e2, e3) {
                }
            });
        });
    });
    getList();
});
