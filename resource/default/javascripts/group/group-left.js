define(function(require){
    var i8ui = require('../common/i8ui.js');
    function getBegin() {
    }
    //获取活跃的群组
    function getActiveGroup(){
        $.ajax({
            url: i8_session.ajaxHost+'webajax/group/getMostActivityGroup',
            type: 'get',
            dataType: 'json',
            data:{topN: 5},
            success: function(result){
                if(result.Result){
                    var listHtml = '';
                    for(var i=0; i<result.ReturnObject.length; i++){
                        var _item = result.ReturnObject[i];
                        listHtml += '<a href="group/home?id='+ _item.ID +'"><i class="spbg1 sprite-40"></i>'+ _item.Name +'</a>';
                    }
                    if(listHtml == ""){
                        listHtml == "暂无活跃群组"
                    }
                    $("#js_active_groups").html(listHtml);
                }
            },
            error: function(e1,e2,e3){
            }
        });
    }

    getActiveGroup();
    getBegin();
});