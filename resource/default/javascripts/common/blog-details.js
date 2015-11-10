/**
 * Created by kusion on 2015/1/20.
 */
define(function(require,exports){
    var sin_blogDetails=require('../plugins/i8bloglist/singleBlogDetails');
    sin_blogDetails({container:"#sinblog-container"});
    /*var util=require('util');
    var _uid=util.getLastUrlName();
    var _blogid=util.getUrlParam("bid");
    $.get(i8_session.ajaxHost+'webajax/kkcom/get-singleblog',{uid:_uid,blogid:_blogid},function(response){
        if(response.Result){
            console.log(response);
        }
    },"json")*/
})