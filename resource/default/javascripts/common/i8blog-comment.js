$(function(){
    var dcockie=util.getCookies('d');
    var blog_id=window.location.hash.substring(1);
    var blog_list=$('#blog_list');
    var publish=$('#publish');
    var publishval=$("#publishval");
    var blog_box=$('#blog_box');
    var _page=$('#page');
    var fw_page=i8ui.pagination();
    var rep_box=$('<div class="reply-box"   id="replybox">\
                        <textarea class="textarea" placeholder="发表回复"></textarea>\
                        <a class="subpublish">发布</a>\
                        <div class="clear"></div>\
                    </div>').css('height',0);
    /// 博客ID BlogID
    /// 创建人ID CreaterID
    /// 评论内容 Comment
    /// 头像地址 HeadImage
    /// 作者名称 CreatorName
    //Parent
    /// 父评论ID ParentID
    /// 状态，0-正常，1-删除,默认0 Status
    /// 帐套ID AccountID

    var ajax=function(url,options,callback){
        $.ajax({
            url: '/'+url,
            type: 'get',
            dataType: 'json',
            data:{options:options},
            cache: false,
            success: function(data){
                callback(data)
            },error:function(error){
                callback(error)
            }
        })
    }

    var getBlogCommentList=function(pageIndex){
        var options={
            blogID:blog_id,
            pageIndex:pageIndex||1,
            pageSize:10
        }
        ajax('webajax/login/getcomment',options,function(data){
            if($.type(data)=='object'&&data.Result){
                if(data.Total==0){
                    blog_box.hide();
                }else{
                    blog_box.show();
                }
                blog_list.html(getBlogCommentHtml(data));
                $('#iframe', parent.document).css('height',$('#content').height()+100+'px');
                fw_page({
                    ctr: _page,
                    totalPageCount: data.Total,
                    pageSize: 10,
                    current: pageIndex,
                    fun: function (new_current_page, containers) {
                        getBlogCommentList(new_current_page);
                    }, jump: {
                        text: '跳转'
                    }
                })
                //jsonpCallback&&jsonpCallback(blog_list.height());
            }
        });

    }

    var deleteBlogComment=function(commentid,_this){
        ajax('webajax/login/deletecomment',{id :commentid},function(data){
            i8ui.simpleWrite('删除成功',_this);
            getBlogCommentList();
        });
    }

    var addBlogComment=function(Comment,dom,ParentID){
        if(dcockie){
            if(!Comment){
                i8ui.txterror('请输入评论内容',dom);
                return;
            }
            var comment={
                BlogID:blog_id,
                Comment:Comment,
                Status:0,
                ParentID:ParentID,
                Title:parent.title,
                Link:parent.link
            }
            ajax('webajax/login/addcomment',{comment:comment},function(data){
                if($.type(data)=='object'&&data.Result){
                    i8ui.simpleWrite('评论成功！',dom);
                    getBlogCommentList();
                }
            });
        }else{
            i8ui.txterror('请先登录！',dom);
        }

    }

    var getBlogCommentHtml=function(data){
        var _html=[];
        var list=data.List;
        for(var i=0;i<list.length;i++){
            var item=list[i];
            var _name=item.CreatorName;
            if(item.ParentID!='00000000-0000-0000-0000-000000000000'){
                for(var j=0;j<list.length;j++){
                    if(list[j].ID==item.ParentID){
                        _name+=' 回复 '+list[j].CreatorName;
                        break;
                    }
                }
            }
            var _deletehtml=(item.CreaterID==data.uid)?'<a class="delete">删除</a>':'';
            var _date=util.formateDate(item.CreateTime)
            _html.push('<div class="blog-panel" id="'+item.ID+'">\
                            <img class="headimg" src="'+item.HeadImage+'" />\
                            <div class="left-text">\
                                <span class="name">'+_name+'</span>\
                                <span class="content">'+item.Comment+'</span>\
                            </div>\
                            <div class="right-option">\
                                <span class="date">'+_date+'</span>\
                                <span class="option">'+_deletehtml+'<a class="reply">回复</a></span>\
                            </div><div class="clear"></div>\
                           </div>');
        }
        return _html.join('');
    }

    publish.on('click',function(){
        addBlogComment(publishval.val(),publish);
    })

    $(document).on('click','.delete',function(){
        var _this=$(this)
        i8ui.confirm({title:'是否确认删除？',btnDom:_this},function(){
            deleteBlogComment(_this.parents('.blog-panel').attr('id'),_this);
        })
    });
    $(document).on('click','.reply',function(){
        var _this=$(this)
        var blog_panel=_this.parents('.blog-panel');
        if(blog_panel.find('.reply-box').length>0){
            rep_box.animate({'height':'0px'},200,function(){
                rep_box.remove();
            });
        }else{
            blog_panel.append(rep_box);
            rep_box.find('textarea').val('');
            rep_box.animate({'height':'76px'},200);
        }
    });

    $(document).on('click','.subpublish',function(){
        var _this=$(this)
        var blog_panel=_this.parents('.blog-panel');
        addBlogComment(rep_box.find('textarea').val(),_this,blog_panel.attr('id'));
    });
    //addBlogComment();
    getBlogCommentList();
});

