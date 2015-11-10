/**
 * Created by kusion on 2015/1/8.
 */
define(function(require,exports){
    var boxer=require('../../common/i8ui');
    var blogPoster=require('../i8poster/js/i8poster');
    var util_com=require('../../common/util');
    function commentList(_setting){
        var setting= $.extend({aTag:"#",
            rKey:"sys_blog",//评论根对象类型，sys_blog为侃侃，aa_workflow
            replyModel:"replykk",
            insertType:"kk",
            cmtContainer:"#",
            cmtsendType:"comment",
            datalist:[],
            defAtUsers:[],
            blogID:"#",
            sourceID:"",
            appID:"",
            loadCompleted:function(){},
            replyCompleted:function(){}
        },_setting);
        //var blogCache=require('./datacache');
        var orgcmt_count=parseInt($(setting.aTag).attr("cmtcount"));//原评论数
        var cmtPostID=_.uniqueId("cmt-poster-");//评论框外围容器ID
        var cmtListID= _.uniqueId("cmt-list-");//评论列表外围容器ID
        var cmts=require('./template/comment-frame.tpl');//评论组件框架
        var cmt_render=template(cmts),cmt_html=cmt_render({cmtPostID: cmtPostID,cmtListID: cmtListID,cmtCount:orgcmt_count});
        var commentModule=$(cmt_html).hide();
        setting.cmtContainer.append(commentModule);
        commentModule.toggle(200,function(){
            $(this).removeAttr("style");
        });
        $(setting.aTag).addClass("showed"); //var fatherkkid=$(this).attr("optid");
        //初始化评论列表
        var postBoxId= _.uniqueId("cmtbox-");
        //初始化评论框
        var posterBlog=blogPoster({container:"#"+cmtPostID,header:{kankan:true,schedule:false,daily:false},sendType:setting.cmtsendType,others:{fatherkkid:setting.blogID,appid:setting.appID,sourceid:setting.sourceID,replyid:setting.replyid},
            enableHeader:false,
            kkConfig:{attachment:true,
                attachid: _.uniqueId("btn_attachment_"),
                attaContainer: _.uniqueId("upContainer_"),
                attabtnContainer: _.uniqueId("btnContainer_"),
                gift:false,face:true,topic:false,scope:false,
                kid:postBoxId,
                ksnconfig:setting.rKey=="app_workflow"?{ "org": false, "user": false, "grp": false }:{ "org": true, "user": true, "grp": true },
                kkplaceholder:setting.kkplaceholder||"说点什么呢!"},
            postCompleted:function(data){
                $("#kk-content-"+postBoxId).val("");
                if(setting.replyModel=="replykk"){
                    extraCommentAdd(data);//新添加
                    orgcmt_count=parseInt($(setting.aTag).attr("cmtcount"));
                    var newCount=orgcmt_count+1;
                    $(setting.aTag).attr("cmtcount",newCount);
                    $(setting.aTag).find("i.comment-count").text("("+newCount+")");
                    if(newCount==1){
                        $("#kk-content-"+postBoxId).parents("div.right-comment").removeClass("no-cmtlist").addClass("have-somecmt");
                    }
                }
                //回复成功完成回调
                if(setting.replyCompleted){
                    setting.replyCompleted(data);
                    addDefaultUsers();
                }
            }
        });
        posterBlog.init();
        var addDefaultUsers=function() {
            if (setting.defAtUsers.length>0) {
                var defValue = "";
                _.each(setting.defAtUsers, function (item) {
                    posterBlog.addUser2Cache(item);
                    defValue += item.uname + " ";
                })
                posterBlog.defAddTxt2Box(defValue);
            }
        }
        addDefaultUsers();
        if(setting.replyModel=="replykk") {//侃侃的评论回复
            var comments_box = $('<ul class="comments-ls-box"></ul>');
            var cmt_li_tpl = require('./template/comments.tpl');
            var pageCmtData= _.groupBy(setting.datalist,function(a,b,c){
                return Math.floor(b/10);
            })
            //排序
            _.each(pageCmtData[0], function (item,index) {
                    item.Message = util_com.atkkContent(item.Message)+" ("+util_com.formateDate(item.CreateTime)+")";
                    if (item.Files.length > 0) {
                        item['attdataStr'] = util_com.toJsonString(item.Files);
                    }
                    if(item.Location){
                        try{
                            var locObj=$.parseJSON(item.Location);
                            item['locString']=encodeURIComponent(item.Location);
                            item['locationName']= locObj.Label;
                        }catch(ex){}
                    }
                    var cmt_li_html = template(cmt_li_tpl)(item);
                    comments_box.append(cmt_li_html);
            });
            if(setting.lsModel=="kankanls") {
                if (setting.datalist.length >= 10) {//侃侃列表评论模式
                        if (comments_box.find("li.comment-more-link").length == 0) {
                            var moreLink= $(setting.aTag).parents("div.item-right-con").find("a.akankan-date").attr("href");
                            if(!moreLink){
                                moreLink = $(setting.aTag).parents("div.item-right-con").attr("detail-url");
                            }
                            comments_box.append('<li class="comment-more-link"><a class="view-a-morecmt" target="_blank" href="' + moreLink + '">更多评论&gt;&gt;</a></li>');
                        }
                }
            }else if(setting.lsModel=="detailsls"){//侃侃详细评论列表模式
                if (setting.datalist.length > 10) {//侃侃列表评论模式
                    if (comments_box.find("li.comment-more-link").length == 0) {
                        comments_box.attr("p-index","0");
                        var more_obj=$('<li class="comment-load-more"><a class="more-comments">加载更多</a></li>');
                        comments_box.append(more_obj);
                        comments_box.on("click","a.more-comments",function(data){
                            var curIndex=parseInt(comments_box.attr("p-index"))||0;
                            var newPageIndex=curIndex+1;
                            if(newPageIndex< _.size(pageCmtData)){
                                _.each(pageCmtData[newPageIndex], function (item,index) {
                                    item.Message = util_com.atkkContent(item.Message)+" ("+util_com.formateDate(item.CreateTime)+")";
                                    if (item.Files.length > 0) {
                                        item['attdataStr'] = util_com.toJsonString(item.Files);
                                    }
                                    var cmt_li_html = template(cmt_li_tpl)(item);
                                    more_obj.before(cmt_li_html);
                                });
                                comments_box.attr("p-index",newPageIndex);
                                if(newPageIndex== _.size(pageCmtData)-1){
                                    $(".comment-load-more").hide();
                                }
                            }
                        })
                    }
                }
            }
            $("#" + cmtListID).append(comments_box);

            if(setting.datalist.length==0){
                $("#" + cmtListID).addClass("no-comment-ls");
            }
            //回复评论绑定
            comments_box.on("click","a.cmt-reply",function(item) {
                var replyUserName=$(this).attr("reply").split('|')[1];
                var replyUserID=$(this).attr("reply").split('|')[0];
                var blog_cmt_id=$(this).attr("cmt_id");
                var postBoxer = _.uniqueId("poster-sub-cmt-");
                if(!$(this).hasClass("showed")) {
                    $(this).addClass("showed");
                    var reply_poster = $('<div class="cmt-reply-poster" id="' + postBoxer + '"></div>');
                    $(this).parents("li.cmt-li").append(reply_poster);
                    var postBoxId = _.uniqueId("cmtsubbox-");
                    //初始化评论框
                    var posterBlog = blogPoster({container: "#" + postBoxer,
                        sendType: setting.cmtsendType,
                        others: {fatherkkid: setting.blogID, appid: setting.appID, sourceid: setting.sourceID, replyid: blog_cmt_id},
                        enableHeader: false,
                        header:{kankan:true,schedule:false,daily:false},
                        kkConfig: {attachment: true,
                            ksnconfig:setting.rKey=="sys_blog"?{ "org": true, "user": true, "grp": true }:{ "org": false, "user": true, "grp": false },
                            attachid: _.uniqueId("btn_attachment_"),
                            attaContainer: _.uniqueId("upContainer_"),
                            attabtnContainer: _.uniqueId("btnContainer_") ,
                            gift: false, face: true, topic: false, scope: false,
                            kid: postBoxId,
                            kkplaceholder: "回复" + replyUserName + "点什么..."},
                        postCompleted: function (data) {
                            if (setting.replyModel == "replykk") {
                                extraCommentAdd(data);//新添加
                                orgcmt_count = parseInt($(setting.aTag).attr("cmtcount"));
                                var newCount = orgcmt_count + 1;
                                $(setting.aTag).attr("cmtcount", newCount);
                                $(setting.aTag).find("i.comment-count").text("(" + newCount + ")");
                                if (newCount == 1) {
                                    $("#kk-content-" + postBoxId).parents("div.right-comment").removeClass("no-cmtlist").addClass("have-somecmt");
                                }
                                reply_poster.toggle(150, function () {
                                    $(this).remove();
                                })
                            }
                        }
                    });
                    posterBlog.init();
                    if (replyUserName) {
                        //$("#kk-content-"+postBoxId).val("回复"+replyUserName+" ");
                        //posterBlog.addUser2Cache({ 'uid': replyUserID, 'uname': '@' + replyUserName,type:0 });//添加到缓存
                    }
                }else{
                    $(this).parents("div.cmtli-right").siblings("div.cmt-reply-poster").toggle(150,function(){
                        $(this).remove();
                    });
                    $(this).removeClass("showed");
                }
            });
            //删除回复
            comments_box.on("click","a.cmt-del",function(){
                var _this=this;
                var cmt_id=$(this).attr("del_id");
                var blog_id=$(this).attr("blog_id");
                boxer.confirm({title:"确定要删除吗？",btnDom: $(_this)},function(divDom){
                    $.get(i8_session.ajaxHost+'webajax/kkcom/comment-del',{commentid:cmt_id,blogid:blog_id},function(response){
                        if(response.Result){
                            //减评论数，从DOM删除
                            var cmtObj=comments_box.parents("div.item-right-con").find("a.opt-comment");
                            var num=parseInt(cmtObj.attr("cmtcount"))-1;
                            cmtObj.attr("cmtcount",num);
                            var newStr=num>0?("("+num+")"):"";
                            cmtObj.find("i.comment-count").text(newStr);
                            $(_this).parents("li.cmt-li").toggle(250,function(){
                                $(this).remove();
                                //单篇侃侃，评论删除
                                if($("#"+cmtListID).find("li.cmt-li").length==0){
                                    $("#" + cmtListID).addClass("no-comment-ls");
                                }
                            });
                            if(num==0){
                                $(_this).parents("div.right-comment").removeClass("have-somecmt").addClass("no-cmtlist");
                            }
                        }
                    },"json")
                });
            });
            comments_box.on("click", "a.a-location",function(){
                var loca_param=$(this).attr("l-d");
                var lbsUrl = location.protocol+"//" + window.location.host + "/apps/com/lbs?r=" + Math.random().toString() + "&loc=" + loca_param;
                if(window.ActiveXObject){
                    window.showModalDialog(lbsUrl, null, "dialogHeight=450px;dialogWidth=620px;center=yes;toolbar=no;menubar=no;scroll=yes;resizable=no;location=no;status=no");
                }else{
                    window.open(lbsUrl,'newwindow','height=450,width=620,left=200,top=150,toolbar=no,menubar=no,scrollbars=no, resizable=no,location=no, status=no,z-look=yes,directories=no,location=no')
                }
            })
        }
        var extraCommentAdd=function(data){
            data.Message=util_com.atkkContent(data.Message)+" ("+util_com.formateDate(data.CreateTime)+")";
            data['attdataStr'] = util_com.toJsonString(data.Files);
            var newItem=template(cmt_li_tpl)(data);
            var firstLi=comments_box.find("li.cmt-li:eq(0)");
            if(firstLi.length==0){
                comments_box.append(newItem);
                $("#" + cmtListID).removeClass("no-comment-ls");
            }else{
                comments_box.find("li.cmt-li:eq(0)").before(newItem);
                var totalCount=comments_box.find("li.cmt-li").length;
                if(totalCount>10){
                    if(setting.lsModel=="kankanls"){
                        comments_box.find("li.cmt-li:eq(10)").remove();
                        //var moreLink= comments_box.parents("div.item-right-con").find("a.akankan-date").attr("href");
                        var moreLink= $(setting.aTag).parents("div.item-right-con").find("a.akankan-date").attr("href");
                        if(!moreLink){
                            moreLink = $(setting.aTag).parents("div.item-right-con").attr("detail-url");
                        }
                        if(comments_box.find("li.comment-more-link").length==0) {
                            comments_box.append('<li class="comment-more-link"><a class="view-a-morecmt" target="_blank" href="' + moreLink + '">更多评论&gt;&gt;</a></li>');
                        }
                    }
                }
            }
        }
        return new function(){
            this.extraOuterReply=function(_this){//收到的回复列表当中，快捷回复时，添加回复对象
                var replyUserName=$(_this).attr("reply").split('|')[1];
                var replyUserID=$(_this).attr("reply").split('|')[0];
                if(replyUserName){
                    $("#kk-content-"+postBoxId).attr("placeholder","说点什么呢!");//.val("回复@"+replyUserName+" ");
                    posterBlog.addUser2Cache({ 'uid': replyUserID, 'uname': '@' + replyUserName,type:0 });//添加到缓存
                }
            };
            this.removeLastComment=function(){

            }
        }
    }
    return commentList;
})