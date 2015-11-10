/**
 * Created by kusion on 2015/1/20.
 */
define(function(require,exports){
    function sinBlogDetails(options) {
        var setting= $.extend({container:"#"},options);
        var sinblogTpl = require('./template/sinblog-details.tpl');
        var fileViewer=require('../../common/seefile');
        var util = require('../../common/util');
        var i8comment=require('./i8comments');
        var _uid = util.getLastUrlName();
        var _blogid = util.getUrlParam("bid");
        template.helper("$kdattachmentFiles",function(datalist){
            if(datalist.length){
                return fileViewer.ks.getDetialHtml(datalist);
            }
        });
        $.get(i8_session.ajaxHost+'webajax/kkcom/get-singleblog', {uid: _uid, blogid: _blogid}, function (response) {
            if (response.Result) {
                var sinBlog_render = template(sinblogTpl);
                response.ReturnObject.Message=util.atkkContent(response.ReturnObject.Message);
                response.ReturnObject.ForwordMessage=util.atkkContent(response.ReturnObject.ForwordMessage);
                response.ReturnObject.CreateTime=util.formateDate(response.ReturnObject.CreateTime);
                var gift_list=[];
                //item.ScopeType="仅相关人可见";
                response.ReturnObject.Message= response.ReturnObject.Message.replace(/\[(gift\-0\d)\]/g,function(i,j){
                    gift_list.push(j);
                    return "";
                });
                if(gift_list.length>0){
                    response.ReturnObject['giftImg']=gift_list;
                }
                var html_sinBlog = sinBlog_render(response.ReturnObject);
                $(setting.container).html(html_sinBlog);
                var fatherkkid = response.ReturnObject.ID;
                var commentData = response.ReturnObject.Comments;
                var commentContainer = $("#sinblog-comments");
                i8comment({aTag: this, cmtContainer: commentContainer, datalist: commentData, blogID: fatherkkid,replyModel:"replykk",lsModel:"detailsls"});//lsModel为dtailsls则为侃侃详细评论列表
                fileViewer.ks.bindDetialClick($("#dynamic"));
            }
        }, "json")
    }
    return sinBlogDetails;
})