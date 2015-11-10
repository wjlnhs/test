define(function(require,exports){
    var i8ui = require('default/javascripts/common/i8ui');
    var fw = require('default/javascripts/cement/public.js');
    function addType(name,cbk){
        $.ajax({
            url: i8_session.ajaxHost+'webajax/cement/add-type',
            type: 'get',
            dataType: 'json',
            cache: false,
            data:{name: name},
            success: function(result){
                if(result.Result){
                    i8ui.write("新增成功");
                    if(cbk){
                        cbk();
                    }
                }else{
                    if(result.Code == 6302){
                        i8ui.error("分类名称重复！");
                        return;
                    }
                    i8ui.error(result.Description);
                }
            },
            error: function(e1,e2,e3){
            }
        });
    }
    if(fw.getAdmin()){
        $(function(){
            //新增分类
            $("#js_isadmin").on("click",".nav-a1",function(){
                var sbox = i8ui.showbox({title: '添加分类',cont: $("#js_cement_addtype").html()});
                //确定事件
                $(sbox).on("click",".btn-blue96x32",function(){
                    var typename = $.trim($(sbox).find("input").val());
                    if(typename == ""){
                        i8ui.error("请输入分类名称！");
                        return;
                    }
                    if(typename.length > 20){
                        i8ui.error("分类名称太长，不能超过20字符！");
                        return;
                    }
                    if($("#js_cement_typelist").find("a").length >= 8){
                        i8ui.error("分类已达到上限！不能新增分类");
                        return;
                    }
                    addType(typename,function(){
                        sbox.close();
                        loadLeftMenu();
                    });
                });
                //取消事件
                $(sbox).on("click",".btn-gray96x32",function(){
                    sbox.close();
                });
            });
            //删除分类
            $("#js_isadmin").on("click",".nav-a2",function(){
                var strHtml = $("#js_cement_type_list").html();
                fw.getTypeList(function(typeList){
                    var alinks = '';
                    for(var i = 0; i< typeList.length; i++){
                        alinks += '<tr>'+
                            '<td>' + typeList[i].CategoryName + '</td>'+
                            '<td>' + typeList[i].CreateTime + '</td>'+
                            '<td>'+ typeList[i].CreatorName+'</td>'+
                            '<td><a id="'+ typeList[i].ID +'" class="delete"><i class="spbg1 sprite-70"></i>删除</a></td>'+
                            '</tr>';
                    }
                    var sbox = i8ui.showbox({title: '删除分类',cont: strHtml.replace('{typelist}',alinks)});
                    $(sbox).on("click","a.delete",function(){
                        var this$ = $(this);
                        i8ui.confirm({title:"该分类删除后，所包含的内容可在<br>全部中查看。 确定要删除吗？", btnDom: this$},function(){
                            $.ajax({
                                url: i8_session.ajaxHost+'webajax/cement/del-type',
                                type: 'get',
                                dataType: 'json',
                                dataType: 'json',
                                cache: false,
                                data:{categoryID: this$.attr("id")},
                                success: function(result){
                                    if(result.Result){
                                        i8ui.write("删除成功");
                                        loadLeftMenu();
                                        sbox.close();
                                    }else{
                                        i8ui.error(result.Description);
                                    }
                                },
                                error: function(e1,e2,e3){
                                }
                            });
                        })
                    });
                });

            });
        });
    }else{
        $("#js_isadmin").remove();
    }
    //滚动设置
    $(window).scroll(function(){
        if($(document).scrollTop() >= 150){
            $("#js_cement_time_menu").css({top: 62, position: "fixed"});
        }else{
            $("#js_cement_time_menu").css({top: 0, position: "relative"});
        }
    });
});