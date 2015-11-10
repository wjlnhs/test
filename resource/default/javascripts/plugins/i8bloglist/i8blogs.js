/**
 * Created by kusion on 2015/1/4.
 */
define(function(require,exports){
    var util_com=require('../../common/util');
    var cacheModule=require('./datacache');
    var blogEvent=require('./blog-events');
    var fileViewer=require('../../common/seefile');
    var i8ui=require('../../../javascripts/common/i8ui');
    var taskProcess=require('../../task/process');
    var guidEmpty="00000000-0000-0000-0000-000000000000";
    //周日标题
    function dailyReportTitle(rptData){
        var _startTime=new Date(rptData.StartTime);
        var _endTime=new Date(rptData.EndTime);
        if(_startTime=='Invalid Date'||isNaN(_startTime)){
            _startTime= new Date(rptData.StartTime.replace(/-/g,'/'));
        }
        if(_endTime=='Invalid Date'||isNaN(_endTime)){
            _endTime= new Date(rptData.EndTime.replace(/-/g,'/'));
        }
        if(rptData.RpType==0){
            return ' <a target="_blank" href="report/detail/'+rptData.ID+'">'+_startTime.getFullYear()+'年'+(_startTime.getMonth()+1)+'月'+_startTime.getDate()+'日'+'日报</a>';
        }else{
            return ' <a target="_blank" href="report/detail/'+rptData.ID+'">'+_startTime.getFullYear()+'年'+(_startTime.getMonth()+1)+'月'+_startTime.getDate()+'日-'+_endTime.getFullYear()+'年'+(_endTime.getMonth()+1)+'月'+_endTime.getDate()+'日'+'周报</a>';
        }
    }
    var getTplLib={
        listContainer:function(data){
            var param=data||{};
            var list_render=template(require('./template/blogs-container.tpl'));
            return list_render(data);
        },
        listCellTpl:function(data){
            var param=data||{};
            var cell_render=template(require('./template/kk-cell-frame.tpl'));
            return cell_render(param);
        },
        lsitemNormal:function(data){
            var param=data||{};
            var item_render=template(require('./template/extend-normal.tpl'));
            return item_render(param);
        },
        listSubCellRecCmt:function(data){
            var param=data||{};
            var item_render=template(require('./template/received-cmt.tpl'));
            return item_render(param);
        },
        listSubCellPosCmt:function(data){
            var param=data||{};
            var item_render=template(require('./template/post-cmt.tpl'));
            return item_render(param);
        },
        appTplReport:function(data){

            if(data.AppObj){
                template.helper('getUrl',function(id){
                    return i8_session.baseHost+'report/detail/'+id;
                });
                var rptData=data.AppObj;// $.parseJSON(data.AppObj.Content||'{}');
                var item_render=template(require('./template/kk-app-report-feeds.tpl'));

                data.Message=data.Message+dailyReportTitle(data.AppObj);
                //data.Message=data.Message+"<a href=\"/report/detail/"+rptData.ID+"\">"+rptData.StartTime.split(' ')[0]+(rptData.RpType==0?"日报":"周报")+"</a>";
                //判断是否已阅
                template.helper('isRead',function(userArr,UserID){
                    if(UserID==i8_session.uid){
                        return -1;
                    }
                    return userArr.join(';').search(i8_session.uid)>=0;
                });
                return item_render(rptData);
            }else{
                return "该周日报不存在";
            }
        },
        appTplTask:function(data){
            if(data.AppObj){
                //var taskData=data.AppObj;// $.parseJSON(data.AppObj.Content||'{}');
                var taskProcessList=taskProcess.renderProcess(data.AppObj);
                var item_render=template(require('./template/kk-app-task-feeds.tpl'));
                return item_render({taskprolist:taskProcessList});
            }else{
                return "该任务不存在";
            }
        },
        appTplSchedule:function(data){
            if(data.AppObj){
                var item_render=template(require('./template/kk-app-schedule-feeds.tpl'));
                return item_render(data.AppObj);
            }else{
                return "该日程不存在";
            }
        },
        appTplWorkflow:function(data){
            if(data.AppObj){
                var item_render=template(require('./template/kk-app-workflow-feeds.tpl'));
                return item_render(data.AppObj);
            }else{
                return "该流程不存在";
            }
        },
        appTplDocument:function(data){
            if(data.AppObj){
                var item_render=template(require('./template/kk-app-doc-feeds.tpl'));
                return item_render(data.AppObj);
            }else{
                return "文档不存在";
            }
        }
    };
    //文件附件
    template.helper('$attachmentFiles',function(datalist){
        if(datalist.length){
            return fileViewer.ks.getHtmlKK(datalist);
        }
    });
    template.helper('$onlyDate',function(fulldate){
        return fulldate.split(' ')[0];
    });
    template.helper('$shortime',function(date){
        var nTime=new Date(date.replace(/\-/g,"/"));
        return nTime.getFullYear()+"/"+ ((nTime.getMonth()+1).toString().length==1?("0"+(nTime.getMonth()+1).toString()):(nTime.getMonth()+1))+"/"+ (nTime.getDate().toString().length==1?("0"+nTime.getDate()):nTime.getDate())+" "+(nTime.getHours().toString().length==1?("0"+nTime.getHours()):nTime.getHours())+":"+(nTime.getMinutes().toString().length==1?("0"+nTime.getMinutes()):nTime.getMinutes());
    });
    template.helper('$removeBr',function(data){
        if(data){
            return data.replace(/<br\/>/g,'\r\n');
        }else{
            return data;
        }
    })
    function blogsList(_setting){
        var settings= $.extend({
            container:"#",
            listType:"kankan",
            listHeader:true,
            pageIndex:_setting.pageIndex||1,
            pageSize:20,
            selectCity:false,
            noConentText:"赶紧和同事分享，讨论吧!",
            loadItemComplated:function(){}
        },_setting);
        return new function(){
            var container=$(settings.container);
            this.init=function(){
                var container_html= getTplLib.listContainer(settings);
                container.html(container_html);
                loadBlogs(container,settings,settings.loadItemComplated)//加载记录
                settings['autoLoad']=true;//启用滚动条自动加载
                blogEvent.frameBoxEvent(container,loadBlogs,settings);//事件绑定
                fileViewer.ks.bindImgClick(container);
                //加载实时最新
                container.on("click","li.latest-kankan",function(){
                    var _this=this;
                    var b_time=container.attr("server-time");
                    $.get(i8_session.ajaxHost+'webajax/kkcom/get-latestblogs',{btime:b_time},function(response){
                        if(response.Result){
                            var latestData=response.ReturnObject;
                            var latestHtml="";
                            _.each(latestData,function(item){
                                latestHtml+=builderSingleItem(item,settings);
                            });
                            container.attr("server-time",response.emdTime);
                            $(_this).after(latestHtml);
                            $(_this).hide();
                            $("#txt-latest-num").text(0);
                            $("li.tabBlog-all",container).trigger("click");
                        }
                    });
                })
            };
            this.appendBefore=function(data){
                cacheModule.addDataListTop(data);//新插入的数据，添加到缓存
                var newItem=builderSingleItem(data);//侃侃框发布之后，立即插入到列表
                if(container.find("li.blist-cell:eq(0)").length==0){
                    container.find("ul.blogs-list-items").html(newItem);
                    $(".blogs-nocontent",container).hide();
                }else{
                    container.find("li.blist-cell:eq(0)").before(newItem);
                }
            }
        }
    }
    //加载列表数据
    function loadBlogs(container,settings,loadCompleted){
        $(".blogs-nocontent", container).hide();
        var req_url=i8_session.ajaxHost+"webajax/kkcom/getblogslist";
        var server_time=container.attr("server-time");//时间戳
        var params={
            time:server_time,
            type:settings.type||0,
            pageSize:settings.pageSize,
            pageIndex:settings.pageIndex,
            r: _.now()
        };
        if(settings.appid){
            params['apps']=settings.appid;
        }
        switch (settings.listType){
            case "group"://获取群组侃侃列表
                req_url=i8_session.ajaxHost+"webajax/kkcom/get-entitylist";
                break;
            case "personal"://获取个人主页侃侃列表
                params['tuid']=settings.tuid;
                req_url=i8_session.ajaxHost+"webajax/kkcom/get-personalbloglist";
                break;
            case "ucomment"://评论获取
                params['cmtype']=settings.cmtype||1;//评论类型，1-发出，2-收到
                params['appid']=settings.appid;
                req_url=i8_session.ajaxHost+"webajax/kkcom/get-usercomments";
                break;
            case "atmecmt"://@我的评论
                params['appid']=settings.appid;
                req_url=i8_session.ajaxHost+"webajax/kkcom/get-atmecomments";
                break;
            case "atmeblog"://@我的侃侃
                req_url=i8_session.ajaxHost+"webajax/kkcom/get-atmeblogs";
                break;
            case "workflow"://工作流
                req_url=i8_session.ajaxHost+"webajax/kkcom/getappblogslist";
                params['appid']=settings.appid;
                params["sourceid"]=settings.sourceid;
                break;
            case "search"://搜索中心
                req_url=i8_session.ajaxHost+"webajax/kkcom/search-blogs";
                params['kw']=settings.keyword;
                break;
        }

        $.get(req_url,params,function(response){
            if(response.Result){
                if(params.pageIndex==1){//记录第一次总条数
                    container.attr("list-count",response.Total);
                    if(response.ReturnObject.length==0) {
                        $(".blogs-nocontent", container).show();
                    }
                }
                if(response.ReturnObject.length>0) {
                    var curPageHtml = builderBlogs(response.ReturnObject, container,settings);//构建侃侃
                    $(".blogs-list-items", container).append(curPageHtml);
                    $(".blogs-loading",container).hide();
                    var totalCount=parseInt(container.attr("list-count"));
                    var totalPageCount=Math.floor(totalCount/params.pageSize)+((totalCount%params.pageSize)==0?0:1);
                    if(totalPageCount>1){
                        $(".load-moreBlogs",container).show();
                    }else{
                        $(".load-moreBlogs",container).hide();
                    }
                    if(totalPageCount==params.pageIndex){
                        $(".load-moreBlogs",container).hide();
                    }
                    if (loadCompleted) {
                        loadCompleted({result: true});
                        container.find(".rcon-normal").each(function(){
                            if($(this).height()>125){
                                $(this).css({"max-height":"125px"});
                                $(this).parents("li.blist-cell").find("span.expend-content-line").show();
                            }else{
                                $(this).parents("li.blist-cell").find("span.expend-content-line").hide();
                            }
                        })
                    }
                }else{
                    $(".blogs-loading",container).hide();
                    if (loadCompleted) {
                        loadCompleted({result: true});
                    }
                }
                if(settings.listType=="kankan") {//首侃侃广场下，及时侃侃提醒启用
                    window.realTimeKankan = function (rdata) {
                        $(".latest-kankan", container).show();
                        var numBer = $("#txt-latest-num").text();
                        var newNum = parseInt(numBer) ? parseInt(numBer) + 1 : 1;
                        $("#txt-latest-num").text(newNum);
                    }
                }
            }else{
                if(loadCompleted){
                    loadCompleted({result:false});
                }
            }
        },"json");

    }
    //批量构建侃侃
    function builderBlogs(datasource,container,settings){
        var blogsHtml="";
        var datalist=datasource;
        cacheModule.setDataList(datalist);
        _.each(datalist,function(item){
            blogsHtml+=builderSingleItem(item,settings);
        });
        return blogsHtml;
    }
    //人员HTML链接转换
    function createrMate(user){
        if(_.isObject(user)) {
            if (user.CreaterID && user.UserName) {
                var newUser = user.CreaterID == i8_session.uid ? "<a href=\"/users/" + user.CreaterID + "\">我</a>" : ("<a href=\"/users/" + user.CreaterID + "\">" + user.UserName + "</a>");
                return newUser;
            } else {
                return "";
            }
        }else{
            return "";
        }
    }
    function txtLinkFormate(txt,link){
        var newTxt=txt.replace(/\$%\$([^,?]+)[^\$%\$]+\$%\$/g, "@$1").replace(/<a[^>]+?>|<\/a>/g, "");
        if(link){
            return '<a href="'+link+'" blank="_blank">'+newTxt+'</a>';
        }else{
            return newTxt;
        }
    }
    //单篇侃侃分类构建
    function builderSingleItem(item,settings){
        if(!_.isEmpty(item)) {
            item=dataFormate(item);//数据转换
            if (item.MessageType == 1) {//侃侃内容转换
                var cell_html="";
                if(item.isForward){//兼容老转发内容
                    item['forwardContent']='<h3><a href="users/'+item.ForwordUserID+'">'+item.ForwardUserName+'</a></h3><span class="forward-content">'+item.ForwordMessage+'</span>';
                    item['extendContent']=getTplLib.lsitemNormal(item);
                }
                var cell_html = getTplLib.listCellTpl(item);
                return cell_html;
            } else if (item.MessageType == 2) {
                switch (item.AppKey){
                    case "app_report":
                        item['isForward']=true;
                        item['Message']="发了一条";
                        item['forwardContent']=getTplLib.appTplReport(item);
                        item['extendContent']=getTplLib.lsitemNormal(item);
                        if(item.AppObj) {
                            item['detailUrl'] = "report/detail/" + item.AppObj.ID;
                        }else{
                            item['detailUrl'] = "#";
                        }
                        break;
                    case "app_task":
                        item['isForward']=true;
                        item['forwardContent']=getTplLib.appTplTask(item);
                        item['extendContent']=getTplLib.lsitemNormal(item);
                        break;
                    case "app_schedule":
                        item['isForward']=true;
                        item['forwardContent']=getTplLib.appTplSchedule(item);
                        item['extendContent']=getTplLib.lsitemNormal(item);
                        if(item.AppObj) {
                            item['detailUrl'] = "calendar/detail/" + item.AppObj.ID + "?ownerids=" + item.AppObj.CreaterID;
                        }else{
                            item['detailUrl']="#";
                        }
                        break;
                    case "app_workflow":
                        item['isForward']=true;
                        item['forwardContent']=getTplLib.appTplWorkflow(item);
                        item['extendContent']=getTplLib.lsitemNormal(item);
                        break;
                    case "app_document":
                        if(item.AppObj) {
                            item['detailUrl'] = "document/detail/" + item.AppObj.docTreeID;
                        }else{
                            item['detailUrl'] = "#";
                        }
                        //item['isForward']=true;
                        //item['forwardContent']=getTplLib.appTplDocument(item);
                        item['extendContent']=getTplLib.lsitemNormal(item);
                        break;
                }
                var cell_html = getTplLib.listCellTpl(item);
                return cell_html;
            }
            //利用收到评论，发出的评论，内容转换(ReplyBlog属性只有评论模型才有)
            //if(_.isObject(item.ReplyBlog)|| _.isObject(item.ReplyComment)){
                item['isForward']=true;
                item['is2sub']= _.isObject(item.ReplyComment);
                if(settings.listType=="ucomment") {
                    if (settings.cmtype == "2") {//收到的评论
                        if(item.ReplyID!=guidEmpty){//来自对评论回复   //if(_.isObject(item.ReplyComment)){
                            item['extendName']=createrMate(item)+"回复"+createrMate(item.ReplyComment);
                            //item['subTitle']=createrMate(item.ReplyComment)+"的评论";
                            item.ReplyBlog=item.ReplyBlog?item.ReplyBlog:item.ReplyComment;
                            item=commentMsgFormate(item);
                            //item.ReplyBlog=item.ReplyComment;//将ReplyComment属性值转移到ReplyBlog上，方便统一处理,模板里用到 {if ReplyBlog}
                            //if(item.ReplyBlog) {
                            if(item.ReplyBlog) {
                                //item.ReplyBlog['AppKey'] = "sys_blog";//将评论Object对象，新增一个AppKey为sys_blog，方便模板当Blog对象处理.
                                item.ReplyBlog.Message = item.ReplyBlog.Message.replace(/\$%\$([^,?]+)[^\$%\$]+\$%\$/g, "@$1").replace(/<a[^>]+?>|<\/a>/g, "");
                            }
                        }else{//来自对侃侃评论，以及来自应用的评论
                            item['extendName']=createrMate(item)+"评论"+createrMate(item.ReplyBlog);
                            item['subTitle']=createrMate(item.ReplyBlog)+"的侃侃";
                            item=commentMsgFormate(item);
                            if(item.ReplyBlog) {
                                item.ReplyBlog.Message = item.ReplyBlog.Message.replace(/\$%\$([^,?]+)[^\$%\$]+\$%\$/g, "@$1").replace(/<a[^>]+?>|<\/a>/g, "");
                            }
                        }
                    } else if (settings.cmtype == "1") {//发出的评论
                        if(item.ReplyID!=guidEmpty){//对评论的回复
                            item['extendName']=createrMate(item)+"回复"+createrMate(item.ReplyComment);
                            item['subTitle']=createrMate(item.ReplyComment)+"的评论";
                            item.ReplyBlog=item.ReplyComment;//将ReplyComment属性值转移到ReplyBlog上，方便统一处理,模板里用到 {if ReplyBlog}
                            /*if(item.ReplyBlog) {
                                item.ReplyBlog['AppKey'] = "sys_blog";//将评论Object对象，新增一个AppKey为sys_blog，方便模板当Blog对象处理.
                            }*/
                            item=commentMsgFormate(item);
                            if(item.ReplyBlog) {
                                item.ReplyBlog.Message = item.ReplyBlog.Message.replace(/\$%\$([^,?]+)[^\$%\$]+\$%\$/g, "@$1");
                            }
                            item.Message=item.Message.replace(/<a[^>]+?>|<\/a>/g,"");
                        }else{//对侃侃或应用的评论
                            //item=commentMsgFormate(item);
                            item=commentMsgFormate(item);
                            if(item.ReplyBlog) {
                                item.ReplyBlog.Message = item.ReplyBlog.Message.replace(/\$%\$([^,?]+)[^\$%\$]+\$%\$/g, "@$1").replace(/<a[^>]+?>|<\/a>/g, "");
                            }
                            //tem.Message=item.Message.replace(/<a[^>]+?>|<\/a>/g,"");
                        }
                    }
                    item['attdataStr']=util_com.toJsonString(item.Files);
                }
                if(settings.listType=="atmecmt"){//@我的评论
                    if(item.ReplyID!=guidEmpty){
                        item['extendName']=createrMate(item)+"回复"+createrMate(item.ReplyComment);
                        item['subTitle']=createrMate(item.ReplyComment)+"的评论";
                        item.ReplyBlog=item.ReplyComment;//将ReplyComment属性值转移到ReplyBlog上，方便统一处理,模板里用到 {if ReplyBlog}
                        if(item.ReplyBlog) {
                            //item.ReplyBlog['AppKey'] = "sys_blog";//将评论Object对象，新增一个AppKey为sys_blog，方便模板当Blog对象处理.
                            item=commentMsgFormate(item);
                        }
                    }else{//对侃侃或应用的@我的评论
                          //item['extendName'] = createrMate(item) + "评论" + createrMate(item.ReplyBlog);
                          //item['subTitle'] = createrMate(item.ReplyBlog) + "的侃侃";
                        item=commentMsgFormate(item);
                        if(item.ReplyBlog){
                            item.ReplyBlog.Message=item.ReplyBlog.Message.replace(/\$%\$([^,?]+)[^\$%\$]+\$%\$/g,"@$1");
                        }
                    }
                    item['attdataStr']=util_com.toJsonString(item.Files);
                }
                item['itemType']="comment";
                item.Message=util_com.atkkContent(item.Message);
                if(item.ReplyBlog){
                    item.ReplyBlog.Message=util_com.atkkContent(item.ReplyBlog.Message);
                    item.ReplyBlog.Message=item.ReplyBlog.Message.replace(/<a[^>]+?>|<\/a>/g, "").replace(/\[gift\-\w+\]/g,"");//把引用框内的a标签彻底删除掉
                }

                item['forwardContent'] = getTplLib.listSubCellRecCmt(item);
                /*if(settings.cmtype=="2") {
                    item['forwardContent'] = getTplLib.listSubCellRecCmt(item);
                }else{
                    item['forwardContent'] = getTplLib.listSubCellPosCmt(item);
                }*/
                item['extendContent']=getTplLib.lsitemNormal(item);
                var cell_html = getTplLib.listCellTpl(item);
                return cell_html;

            //}else{
            //    return "lost";
            //}
        }else{
            return "";
        }
    }
    //@我的评论，收到的评论，数据转换
    function commentMsgFormate(item){
        if(_.isObject(item.ReplyBlog)) {
            if (item.ReplyBlog.AppKey == "sys_blog"||item.ReplyBlog.AppKey=="app_gift") {
                var kk_txt=item.ReplyBlog.AppKey=="app_gift"?"生日祝福":"侃侃";
                item['extendName'] = createrMate(item) + "评论" + createrMate(item.ReplyBlog);
                item['subTitle'] = createrMate(item.ReplyBlog) + "的"+(item.is2sub?"评论":kk_txt);
            }else if(item.ReplyBlog.AppKey == "app_task"){
                if(item.ReplyBlog.AppObj) {
                    item['extendName'] = createrMate(item);// + "评论任务：<a href=\"task/detail/" + item.ReplyBlog.AppObj.task.ID + "\" target=\"_blank\">" + item.ReplyBlog.Message + "</a>";
                    if(item.is2sub){
                        item['appExtContent']=createrMate({"CreaterID":item.ReplyBlog.AppObj.task.CreaterID,"UserName":item.ReplyBlog.AppObj.task.CreaterName})+'的评论：'+txtLinkFormate(item.ReplyBlog.Message,'task/detail/' + item.ReplyBlog.AppObj.task.ID);//<a href="task/detail/'+item.ReplyBlog.AppObj.task.ID+'" target="_blank">'+item.ReplyBlog.AppObj.task.Name+'</a>';
                    }else{
                        item['appExtContent']=createrMate({"CreaterID":item.ReplyBlog.AppObj.task.CreaterID,"UserName":item.ReplyBlog.AppObj.task.CreaterName})+'发布的任务：<a href="task/detail/'+item.ReplyBlog.AppObj.task.ID+'" target="_blank">'+item.ReplyBlog.AppObj.task.Name+'</a>';
                    }
                }else{
                    item['extendName'] = createrMate(item);// + "评论任务：该任务已删除";
                }
            }else if(item.ReplyBlog.AppKey=="app_schedule"){
                if(item.ReplyBlog.AppObj) {
                    item['extendName'] = createrMate(item);// + "评论日程：<a href=\"calendar/detail/" + item.ReplyBlog.AppObj.ID + "?ownerids=" + item.ReplyBlog.AppObj.CreaterID + "\" target=\"_blank\">" + item.ReplyBlog.Message + "</a>";
                    if(item.is2sub) {
                        item['appExtContent'] = createrMate(item.ReplyBlog) + "的评论："+txtLinkFormate(item.ReplyBlog.Message,'calendar/detail/' + item.ReplyBlog.AppObj.ID);//<a href=\"calendar/detail/" + item.ReplyBlog.AppObj.ID + "?ownerids=" + item.ReplyBlog.AppObj.CreaterID + "\" target=\"_blank\">" + item.ReplyBlog.Message + "</a>";
                    }else{
                        item['appExtContent'] = createrMate(item.ReplyBlog) + "发布的日程：<a href=\"calendar/detail/" + item.ReplyBlog.AppObj.ID + "?ownerids=" + item.ReplyBlog.AppObj.CreaterID + "\" target=\"_blank\">" + item.ReplyBlog.Message + "</a>";
                    }
                }else{
                    item['extendName'] = createrMate(item);// + "评论日程：该日程已删除";
                }
            }else if(item.ReplyBlog.AppKey=="app_document"){
                if(item.ReplyBlog.AppObj) {
                    item['extendName'] = createrMate(item);// + "评论企业文档：<a href=\"document/detail/" + item.ReplyBlog.AppObj.docTreeID + "\" target=\"_blank\">" + item.ReplyBlog.Message + "</a>";
                    if(item.is2sub){
                        item['appExtContent']=createrMate(item.ReplyBlog)+"的评论："+txtLinkFormate(item.ReplyBlog.Message,'document/detail/' + item.ReplyBlog.AppObj.docTreeID);//<a href=\"document/detail/" + item.ReplyBlog.AppObj.docTreeID + "\" target=\"_blank\">" + item.ReplyBlog.AppObj.FileName + "</a>";
                    }else{
                        item['appExtContent']=createrMate(item.ReplyBlog)+"发布的文档：<a href=\"document/detail/" + item.ReplyBlog.AppObj.docTreeID + "\" target=\"_blank\">" + item.ReplyBlog.AppObj.FileName + "</a>";
                    }
                }else{
                    item['extendName'] = createrMate(item);// + "评论企业文档：该文档已删除";
                }
            }else if(item.ReplyBlog.AppKey=="app_report"){
                if(item.ReplyBlog.AppObj) {
                    item['extendName'] = createrMate(item);// + "评论周日报：" +
                    if(item.is2sub){
                        item['appExtContent']=createrMate(item.ReplyBlog)+"的评论："+txtLinkFormate(item.ReplyBlog.Message,'report/detail/'+item.ReplyBlog.AppObj.ID);
                    }else{
                        item['appExtContent']=createrMate(item.ReplyBlog)+ '发布的周日报：'+ dailyReportTitle(item.ReplyBlog.AppObj);
                    }
                }else{
                    item['extendName'] = createrMate(item);// + "评论周日报：该周日报已删除";
                }
            }else if(item.ReplyBlog.AppKey=="app_workflow"){
                if(item.ReplyBlog.AppObj) {
                    item['extendName'] = createrMate(item);// + "对流程的留言：<a href=\"workflow" + item.ReplyBlog.AppObj.ViewUrl + "\" target=\"_blank\">" + item.ReplyBlog.AppObj.ProcTitle + "</a>";
                    if(!item.ReplyBlog.AppObj.Creator){item.ReplyBlog.AppObj.Creator={ID:"",Name:""}};
                    if(item.is2sub){
                        item['appExtContent']=createrMate({"CreaterID":item.ReplyBlog.AppObj.Creator.ID,"UserName":item.ReplyBlog.AppObj.Creator.Name})+"的留言："+txtLinkFormate(item.ReplyBlog.Message,'/workflow' + item.ReplyBlog.AppObj.ViewUrl);
                    }else{
                        item['appExtContent']=createrMate({"CreaterID":item.ReplyBlog.AppObj.Creator.ID,"UserName":item.ReplyBlog.AppObj.Creator.Name})+"发起的流程：<a href=\"/workflow" + item.ReplyBlog.AppObj.ViewUrl + "\" target=\"_blank\">" + item.ReplyBlog.AppObj.ProcTitle + "</a>";
                    }

                }else{
                    item['extendName'] = createrMate(item);// + "对流程的留言：该流程已不存在";
                }
            }else if(item.ReplyBlog.AppKey=="app_notice"){
                if(item.ReplyBlog.AppObj){
                    item['extendName'] = createrMate(item);
                    if(item.is2sub){
                        item['appExtContent']=createrMate(item.ReplyBlog)+'的评论：'+txtLinkFormate(item.ReplyBlog.Message,'cement/list');//<a href="cement/list" target="_blank">'+item.ReplyBlog.AppObj.Title+'</a>';
                    }else{
                        item['appExtContent']=createrMate(item.ReplyBlog)+'发布企业墙：<a href="cement/list" target="_blank">'+item.ReplyBlog.AppObj.Title+'</a>';
                    }
                }
            }
        }
        return item;
    }
    //渲染模板前，数据转换
    function dataFormate(item){
        //权限转换,1-全员公开，2-At人可见，3-参与人可见
        //if(item.MessageType==1){
        //    item.ScopeType=item.ScopeType==1?"":(item.ScopeType==2?"仅@可见":"参与人可见") ;
        //}
        switch (item.ScopeType){
            case 1:
                item.ScopeType="";//全员公开
                break;
            case 2:
                item.ScopeType="仅@人可见";//全员公开
                break
            case 3:
                item.ScopeType="仅相关人可见";//全员公开
                break;
            case 4:
                item.ScopeType="发起人可见";//全员公开
                break;
        }
        item.Message =util_com.atkkContent(item.Message);//@用户内容转换
        switch (item.AppKey){
            case "app_gift":
                var gift_list=[];
                //item.ScopeType="仅相关人可见";
                item.Message=item.Message.replace(/\[(gift\-0\d)\]/g,function(i,j){
                    gift_list.push(j);
                    return "";
                });
                if(gift_list.length>0){
                    item['giftImg']=gift_list;
                }
                break;
            case "app_schedule":
                if(item.AppObj){
                    //item.ScopeType="仅相关人可见";
                    item.Message=(item.AppObj.seqence>0?"更新":"新建")+ (item.AppObj.Type==1?"日程":"会议") +"：<a href=\"calendar/detail/"+item.AppObj.ID+"?ownerids="+item.AppObj.CreaterID+"\" target=\"_blank\">"+item.AppObj.Title+"</a>";
                }else{
                    item.Message="新建日程："+item.Message;
                }
                break;
            case "app_workflow":
                item.UserName="流程管理";
                if(item.AppObj) {
                    var approver = item.AppObj.Approvers, appUser = "",creator="";
                    var appus = _.map(approver, function (item, m, p) {
                        return '<a href="users/' + item.Key + '">' + item.Value + '</a>';
                    });
                    if(item.AppObj.Creator){
                        creator='<a href="users/'+item.AppObj.Creator.ID+'">'+item.AppObj.Creator.Name+'</a>发起流程：';
                    }
                    appUser = appus.length > 0 ? "待" + appus.join('、') + "审批" : "";
                    item.Message =creator+ '<a href="/workflow' + item.AppObj.ViewUrl + '" target="_blank">' + item.Message + '</a>';
                    if(item.AppObj.Status==0) {
                        item.Message +=('[<span style="color:#FF9500">审批中</span>]'+appUser);
                    }else if(item.AppObj.Status==2){
                        item.Message +='[<span style="color:#008000">审批通过</span>]';
                    }else if(item.AppObj.Status==3){
                        item.Message +='[<span style="color:#ff0000">审批未通过</span>]';
                    }else if(item.AppObj.Status==4){
                        item.Message +='[<span style="color:#ff0000">流程出错</span>]';
                    }else if(item.AppObj.Status==5){
                        item.Message +='[<span style="color:#888">流程撤回</span>]';
                    }
                    //item.ScopeType="仅发起人可见";
                }
                break;
            case "app_document":
                //item.ScopeType="仅相关人可见";
                /*if(item.AppObj){
                    //item.Message="上传了企业文档：<a href=\"document/detail/"+item.AppObj.docTreeID+"\" target=\"_blank\">"+item.AppObj.FileName+"</a>，欢迎大家查阅!"
                }else{

                }*/
                //item['isForward']=false;
                break;
            case "app_report":
                //item.ScopeType="仅相关人可见";
                break;
            case "app_task":
                if(item.AppObj){
                    //item.ScopeType="仅相关人可见";
                    item.Message='<a href="task/detail/'+item.AppObj.task.ID+'" target="_blank">'+ item.AppObj.task.Name+'</a>';
                }
                break;
        }
        /*if(item.AppKey=="app_gift"){
            var gift_list=[];
            item.Message=item.Message.replace(/\[(gift\-0\d)\]/g,function(i,j){
               gift_list.push(j);
                return "";
            });
            if(gift_list.length>0){
                item['giftImg']=gift_list;
            }
        }*/
        //更新时间转换
        item.LastUpdateTime=util_com.formateDate(item.LastUpdateTime);
        if(item.ForwordID!="00000000-0000-0000-0000-000000000000"){
            item['isForward']=true;
            item.ForwordMessage=util_com.atkkContent(item.ForwordMessage);
        }
        if(item.Location){
           try{
               var locObj=$.parseJSON(item.Location);
               item['locString']=encodeURIComponent(item.Location);
               item['locationName']= locObj.Label;
           }catch(ex){}
        }
        return item;
    }
    return blogsList;
})