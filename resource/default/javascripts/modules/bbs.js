define(function(require, exports){
    function getBBs(){
        $.ajax({
            url: i8_session.ajaxHost+'webajax/modules/getBBs',
            type: 'get',
            dataType: 'json',
            cache: false,
            data:{size: 10},
            success: function(result){
                if(result.Result){
                    var listHtml = '';
                    if(result.ReturnObject.length <= 0){
                        $("#js_bbs").html('<div class="fz14-weight tcenter p10 cl999"><span class="icon icon-group-no-doc" style="margin-right:10px;"></span>一篇文章都没有哦</div>');
                        return;
                    }
                    for( var key in result.ReturnObject){
                        listHtml += '<li><a target="_blank" href="'+ key +'">'+ result.ReturnObject[key] +'</a></li>';
                    }
                    $('#js_bbs').html(listHtml);
                }
            },
            error: function(e1,e2,e3){

            }
        });
    }
    getBBs();
});