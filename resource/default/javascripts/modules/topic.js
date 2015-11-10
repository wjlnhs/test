define(function(require,exports){
    function getHotTopic(){
        $.ajax({
            url: i8_session.ajaxHost+'webajax/modules/topic?',
            type: 'get',
            dataType: 'json',
            cache: false,
            data:{topn:5},
            success: function(result){
                if(result.Result){
                    var listHtml = '';
                    if(result.ReturnObject.length <= 0){
                        $("#js_topic").html('<div class="fz14-weight tcenter p10 cl999"><span class="icon icon-no-topic"></span>最近都没有热门话题哦~</div>');
                        return;
                    }
                    for( var i = 0; i < result.ReturnObject.length; i++){
                        if(i>=5){
                            break;
                        }
                        var _item = result.ReturnObject[i];
                        var title= _item.Topic.replace(/\$%\$([^,]+).+?\$%\$/g,"@$1");
                        listHtml += '<li><a target="_blank" href="search?keyword='+ title +'#dynamic">'+ title +'</a></li>';
                    }
                    $('#js_topic').html(listHtml);
                }
            },
            error: function(e1,e2,e3){
            }
        });
    }
    getHotTopic();
});