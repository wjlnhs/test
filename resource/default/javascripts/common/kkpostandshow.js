/**
 * Created by kusion on 2015/1/4.
 */
define(function(require,exports){
    var blogPoster=require('../plugins/i8poster/js/i8poster');
    var kankanlist=require('../plugins/i8bloglist/i8blogs');
    var showKankan=null;
    var postBloger=blogPoster({container:"#quick_post",postCompleted:function(data){
            if(showKankan&& _.isObject(data)){
                showKankan.appendBefore(data);
            }
    }});
    postBloger.init();
    //侃侃展示
    showKankan=kankanlist({container:"#blog_list",selectCity:true});
    showKankan.init();

})