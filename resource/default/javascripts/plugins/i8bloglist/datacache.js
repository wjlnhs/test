/**
 * Created by kusion on 2015/1/7.
 */
define(function(require,exports){
    var blogsListCache=[];
    exports.setDataList=function(dlist){
        blogsListCache= _.union(blogsListCache,dlist);
    };
    //获取指定侃侃评论列表
    exports.getCommentsByBlogID=function(blogid){
        var comments=_.findWhere(blogsListCache,{ID:blogid});
        return comments.Comments||[];
    };
    exports.getBlogsByBlogID=function(blogid){
        var blog= _.findWhere(blogsListCache,{ID:blogid});
        return blog;
    };
    exports.addDataListTop=function(item){
        if(blogsListCache&& _.isObject(item)){
            blogsListCache= _.union([item],blogsListCache);
        }
    };
    exports.addCommentByID=function(item,id){
        if(blogsListCache&& _.isObject(item)){
            var objItem=_.find(blogsListCache,{ID:id});
            objItem.Comments.push(item);
            objItem.CommentCount+=1;
        }
    };
    exports.delCommentByID=function(item_id,cmt_id){
        if(blogsListCache&& _.isObject(item)){
            var objItem= _.find(blogsListCache,{ID:item_id});

        }
    }
})