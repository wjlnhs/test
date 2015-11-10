define(function(){
    var fw_page = require('../common/fw_pagination.js');
    var pageSize = 10;
    //获取群组列表
    function getGroupList(pageIndex){
        var funName = $("#js_group_type_menu").find("a.current").attr("funname");
        if(funName == ""){
            i8ui.error("菜单方法调用失败！");
            return;
        }
        $("#js_group_mg_list_ul").html('<p class="tcenter">加载中....</p>');
        $.ajax({
            url: i8_session.ajaxHost+'webajax/group/'+funName,
            type: 'get',
            dataType: 'json',
            success: function(result){
                if(result.Result){
                    var listHtml = '';
                    var domeHt = $("#js_group_mg_ops").html();
                    var arrs = result.ReturnObject;
                    for(var i = 0; i < arrs.length; i++){
                        var _item = arrs[i].Item1;
                        var _item2 = arrs[i].Item2;
                        listHtml += domeHt.replace("{Name}",_item.Name)
                            .replace("{ID}",_item.ID)
                            .replace("{Icon}",_item.Icon)
                            .replace("{LastUpdateTime}",getLastTimestr(_item.LastUpdateTime))
                            .replace("{Description}",_item.Description)
                            .replace("{Status}",getTypeBtn(_item2))
                            .replace("{Type}",_item.Type)
                    }
                    if(listHtml == ""){
                        listHtml = '<div class="tcenter">暂无群组</div>'
                    }
                    //控制分页
                    fw_page.pagination({
                        ctr: $("#js_cement_page_panl"),
                        totalPageCount: data.Item2,
                        pageSize: pageSize,
                        current: pageIndex,
                        fun: function (new_current_page, containers) {
                            getMgList(new_current_page);
                        }, jump: {
                            text: '跳转'
                        }
                    });
                    $("#js_group_mg_list_ul").html(listHtml);
                }else{
                    i8ui.error(result.Description);
                }
            },
            error: function(e1,e2,e3){
            }
        });
    }
    function getTypeBtn(status){
        switch(status){
            case 1:
                return '<span class="ta-group-btn"><i class="spbg1 sprite-30"></i><i class="ta-group-jia">＋</i>加入该群</span>';
                break;
            case 2:
                return '<span class="ta-group-btn"><i class="spbg1 sprite-33"></i>退出该群</span>';
                break;
            case 3:
                return '<span class="ta-group-btn"><i class="spbg1 sprite-25"></i>管理该群</span>';
                break;
            case 4:
                return '<span class="ta-group-btn"><i class="spbg1 sprite-26"></i>重新激活</span>';
                break;
            case 5:
                return '<span class="ta-group-btn"><i class="spbg1 sprite-30"></i><i class="ta-group-jia">＋</i>加入该群</span>';
                break;
            default:
                return '<span class="ta-group-btn"><i class="spbg1 sprite-30"></i><i class="ta-group-jia">＋</i>加入该群</span>';
                break;

        }
    }
    function getLastTimestr(times){
        if(times){
            var reg = new RegExp("[0-9]{4}-[0-9]{1,2}-[0-9]{1,2}");
            return times.match(/[0-9]{4}-[0-9]{1,2}-[0-9]{1,2}/);
        }
    }
    function getgroupMessage(){
        $.ajax({
            url: i8_session.ajaxHost+'webajax/group/getJoinRequestsParam',
            type: 'get',
            dataType: 'json',
            success: function(result){
                console.log(result);
                if(result.Result){
                    var listHtml = '';
                    var domeHt = $("#js_group_mg_ops").html();
                    var arrs = result.ReturnObject;
                    for(var i = 0; i < arrs.length; i++){

                    }
                }else{
                    i8ui.error(result.Description);
                }
            },
            error: function(e1,e2,e3){
            }
        });
    }
    getGroupList("myGroupAndPublicParam");
    getgroupMessage();
    //菜单筛选事件
    $("#js_group_type_menu").on("click","a",function(){
        var $this = $(this);
        var funName = $this.attr("funname");
        $("#js_group_type_menu a").removeClass("current");
        $this.addClass("current");
        if(funName != ""){
            getGroupList(funName);
        }
    });
});