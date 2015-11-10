/**
 * Created by kusion on 2015/1/7.
 */
define(function(require,exports){
    var boxer=require('../../common/i8ui');
    var commentlist=require('./i8comments');
    var blogCache=require('./datacache');
    exports.frameBoxEvent=function(container,loadBlogs,settings){//container，评论容器；
        if(settings.autoLoad){
            window.onscroll = function () {
                if (getScrollTop() + getClientHeight() == getScrollHeight()) {
                   if($(".load-moreBlogs",container).is(":visible")) {
                       $("div.load-moreBlogs", container).trigger("click");
                   }
                }
            }
        }
        if(settings.selectCity){//是否加载选择天气
            addSelectCity(container);
        }
        $.get(i8_session.ajaxHost+"webajax/settings/GetPerson?" + Math.random(),function(data){
            if(data.Result && data.ReturnObject && data.ReturnObject.City){
                weatherReport(data.ReturnObject.City)
            }else{
//                $.getScript('http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=js', function(){
//
//
//                    weatherReport(remote_ip_info.province,container);//天气预报
//                });
                  weatherReport(null,container)
            }
        },"json")
        //删除动态、侃侃
        container.on("click","a.opt-del",function(){
            var _this=this;
            var blog_id=$(this).attr("optid");
            boxer.confirm({title:"确定要删除吗？",btnDom: $(_this)},function(divDom){
                $.get(i8_session.ajaxHost+'webajax/kkcom/blogs-del',{id:blog_id},function(response){
                    if(response.Result){
                        //divDom.close();
                        $(_this).parents("li.blist-cell").toggle(250,function(){
                            $(this).remove();
                            if($("li.blist-cell",container).length==0){//如果都删除完了，则显示没有内容提示
                                $(".blogs-nocontent",container).show();
                            }
                        })
                    }
                },"json")
            });
        });
        container.on("click","a.opt-del-cmt",function(){
            var _this=this;
            var cmt_id=$(this).attr("optid");
            var blog_id=$(this).attr("blogid");
            boxer.confirm({title:"确定要删除吗？",btnDom: $(_this)},function(divDom){
                $.get(i8_session.ajaxHost+'webajax/kkcom/comment-del',{blogid:blog_id,commentid:cmt_id},function(response){
                    if(response.Result){
                        //divDom.close();
                        $(_this).parents("li.blist-cell").toggle(250,function(){
                            $(this).remove();
                            if($("li.blist-cell",container).length==0){//如果都删除完了，则显示没有内容提示
                                $(".blogs-nocontent",container).show();
                            }
                        })
                    }
                },"json")
            });
        })
        //侃侃、动态评论
        container.on("click","a.opt-comment",function(){
            var reply_model=$(this).attr("dialogModel");
            if(reply_model=="replykk") {//reply_model为replykk则表示，是在侃侃列表里点击回复
                var fatherCell = $(this).parents("li.blist-cell"), _this = this;
                if ($(this).hasClass("showed")) {
                    fatherCell.find("div.right-comment").toggle(250, function () {
                        $(this).removeClass("showed");
                    })
                } else {
                    var fatherkkid = $(this).attr("optid");
                    var blogObject=blogCache.getBlogsByBlogID(fatherkkid);
                    var commentData = blogObject.Comments; //blogCache.getCommentsByBlogID(fatherkkid);
                    var _rKey=$(this).attr("rKey");
                    var commentContainer = fatherCell.find("div.item-right-con");
                    var options={aTag: this,rKey:_rKey, cmtContainer: commentContainer, datalist: commentData, blogID: fatherkkid,replyModel:reply_model,lsModel:"kankanls",insertType:"kk"};
                    if(blogObject.AppID!="00000000-0000-0000-0000-000000000000"){
                        options["appID"]=blogObject.AppID;
                        if(blogObject.AppObj) {
                            options["sourceID"] = blogObject.AppObj.docTreeID ? blogObject.AppObj.docTreeID : blogObject.AppObj.ID;
                        }
                    }
                    commentlist(options);//lsModel为kankanls表示展示侃侃评论为，在列表中嵌入展示
                }
            }else if(reply_model=="replycmt"){//@我的评论里，点击回复，不加载评论列表，置空
                var fatherCell = $(this).parents("li.blist-cell"), _this = this;
                if ($(this).hasClass("showed")) {
                    fatherCell.find("div.right-comment").toggle(250, function () {
                        $(this).removeClass("showed");
                    })
                } else {
                    var fatherkkid = $(this).attr("optid");
                    var reply_id=$(this).attr("cmt-id");
                    var _rKey=$(this).attr("rKey");
                    var commentContainer = fatherCell.find("div.item-right-con");
                    var cmtObjct= commentlist({aTag: this,rKey:_rKey, cmtContainer: commentContainer, datalist: [],replyid:reply_id, blogID: fatherkkid,replyModel:reply_model,replyCompleted:function(data){
                        boxer.alert({title: "回复成功！",type:2,btnDom:$(_this)});
                        $(_this).trigger("click");
                    }});
                    cmtObjct.extraOuterReply(_this);
                }
            }
        });
        container.on("click","div.load-moreBlogs",function(){
            settings.pageIndex+=1;
            var totalCount=parseInt(container.attr("list-count"));
            var totalPageCount=Math.floor(totalCount/settings.pageSize)+((totalCount%settings.pageSize)==0?0:1);
            if(totalPageCount>1){
                $(".load-moreBlogs",container).show();
            }
            var _this=this;
            $(this).find("span").text("加载中...");
            loadBlogs(container,settings,function(res){
                if(res.result){
                    settings.loadItemComplated();
                    $(_this).find("span").text("加载更多");
                }
            });
        });
        //侃侃
        container.on("click","li.tabBlog-kk",function(){
            $(".blogs-loading",container).show();
            $(".load-moreBlogs",container).hide();
            $(this).siblings("li").removeClass("hover");
            $(this).addClass("hover");
            $(".app-filter-tabName",container).text("应用");
            settings.type=1;
            settings.pageIndex=1;
            settings.listType="kankan";
            if(settings.appid){
                delete settings.appid;
            }
            $("li.blist-cell", container).remove();
            loadBlogs(container,settings,function(){
                $(".blogs-loading",container).hide();
            })
        });
        //所有
        container.on("click","li.tabBlog-all",function(){
            $(".blogs-loading",container).show();
            $(".load-moreBlogs",container).hide();
            $(this).siblings("li").removeClass("hover");
            $(this).addClass("hover");
            $(".app-filter-tabName",container).text("应用");
            $(".app-kk-tabName",container).text("侃侃");
            settings.type=0;
            settings.pageIndex=1;
            settings.listType="kankan";
            if(settings.appid){
                delete settings.appid;
            }
            $("li.blist-cell", container).remove();
            loadBlogs(container,settings,function(){
                $(".blogs-loading",container).hide();
            })
        });
        //应用筛选
        container.on("click","dd.kktab-filter",function(){
            $(".blogs-loading",container).show();
            $(".load-moreBlogs",container).hide();
            var appid=$(this).attr("appid");
            $("a.app-filter-tabName",container).text($(this).attr("tabname"));
            $(".app-kk-tabName",container).text("侃侃");
            $(this).parents("li.tabBlog-app").siblings("li").removeClass("hover");
            $(this).parents("li.tabBlog-app").addClass("hover");
            settings.type=2;
            settings.pageIndex=1;
            settings.appid=appid;
            settings.listType="kankan";
            $("li.blist-cell", container).remove();
            loadBlogs(container,settings,function(){

            })
        });
        container.on("click","a.expend-switch",function(){
            if($(this).hasClass("es-close")){
                $(this).removeClass("es-close");
                $(this).parents("li.blist-cell").find("span.expend-content-line").show();
                $(this).parents("li.blist-cell").find("div.rcon-normal,div.ext-quote-content").css({"max-height":"none"});
                $(this).find("span").text("收起");
                $(this).parents("div.rcon-normal").addClass("fl-content-sn");
                $(this).parents("span.expend-content-line").removeAttr("style");
            }else{
                $(this).parents("li.blist-cell").find("div.rcon-normal,div.ext-quote-content").css({"max-height":"125px"});
                $(this).addClass("es-close");
                $(this).find("span").text("展开");
                $(this).parents("div.rcon-normal").removeClass("fl-content-sn");
                $(this).parents("span.expend-content-line").show();
            }
        });

        container.on("click","a.openscore",function(){
            var reportcommon=require('../../report/common');
            var _this=$(this);
            var data={}
           data.ID=_this.attr('rid');
            reportcommon.fun.openScore(data,function(data){

            });
        });
        container.on("click","div.readit",function(){
            var reportcommon=require('../../report/common');
            var _this=$(this);
            reportcommon.fun.readreport(_this,_this.attr('rid'));
        });

        container.on("click","a.extp-act-btn",function(){
            if(!$(this).hasClass("tag-expended")) {
                $(this).addClass("tag-expended");
                $(this).parents("div.extp-action").siblings("div.app-actionlist").removeClass("action-has-more");
                $(this).text("收起查看更多");
            }else{
                $(this).removeClass("tag-expended");
                $(this).parents("div.extp-action").siblings("div.app-actionlist").addClass("action-has-more");
                $(this).text("展开查看更多");
            }
        });

        container.on("click", "a.a-location",function(){
            var loca_param=$(this).attr("l-d");
            var lbsUrl = "http://" + window.location.host + "/apps/com/lbs?r=" + Math.random().toString() + "&loc=" + loca_param;
            if(window.ActiveXObject){
                window.showModalDialog(lbsUrl, null, "dialogHeight=450px;dialogWidth=620px;center=yes;toolbar=no;menubar=no;scroll=yes;resizable=no;location=no;status=no");
            }else{
                window.open(lbsUrl,'newwindow','height=450,width=620,left=200,top=150,toolbar=no,menubar=no,scrollbars=no, resizable=no,location=no, status=no,z-look=yes,directories=no,location=no')
            }
        })
        //侃侃以群组分类
        var groups=[];
        $("li.tabBlog-kk",container).hover(function(){
            var filterBox=$(this).find("dl.grp-filter");
            filterBox.show().click(function(){return false;});
            if(groups.length==0) {
                $.get(i8_session.ajaxHost + "webajax/group/get-all-my-groups", {}, function (response) {
                    if (response.Result) {
                        groups = response.List;
                        var groupsHtml='<dd class="grp-dd" target-id="allkankan"><i class="grp-kk-sm-ico"></i><span class="grp-name">侃侃</span></dd>';
                        _.each(groups,function(item){
                            groupsHtml+='<dd class="grp-dd" target-id="'+item.ID+'"><i class="grp-sm-ico"></i><span class="grp-name">'+item.Name+'</span></dd>';
                        })
                        filterBox.html(groupsHtml);
                        grpFilterBind(filterBox);
                    }
                }, "json");
            }else{
                grpFilterBind(filterBox);
            }
        },function(){
            $(this).find("dl.grp-filter").hide();
        });
        //筛选群组侃侃
        function grpFilterBind(boxer){
            boxer.unbind().on("click","dd.grp-dd",function(){
                var target_id=$(this).attr("target-id");
                if(target_id=="allkankan"){
                    $("li.tabBlog-kk").trigger("click");
                    $("a.app-kk-tabName",container).text("侃侃");
                    return;
                }
                $(".blogs-loading",container).show();
                $(".load-moreBlogs",container).hide();
                $("a.app-kk-tabName",container).text($(this).find("span.grp-name").text());
                $(this).parents("li.tabBlog-kk").siblings("li").removeClass("hover");
                $(this).parents("li.tabBlog-kk").addClass("hover");
                settings.type=0;
                settings.listType="group";
                settings.appid=target_id;
                $("li.blist-cell", container).remove();
                loadBlogs(container,settings,function(){

                })
                return false;
            })
        }
    };

    //加载选择城市
    function addSelectCity(container){
        $(document).on('click','.location-city',function(){
            var city2=$('.city-name').text();
            var uu=boxer.showbox({
                title:"请选择天气城市？",
                cont:'<div id="weather_city_box" class="i8-form city-group">' +
                    '<div class="select-gray-box"><select style="width: 260px" id="provinceSelect"></select><div class="clear"></div></div>' +
                    '<div class="select-gray-box"><select style="width: 260px" id="citySelect"></select><div class="clear"></div></div>' +
                    '</div>' +
                    '<div class="tcenter"><span class="ct-cancel ct-ly-btn col-f1">取消</span><span class="ct-confirm ct-ly-btn col-blue">确定</span></div>',
                noMask:false
            })
            var i8city=require("../i8city/i8cityweather");
            i8city.init(city2);
            $(uu).on('click','.ct-confirm',function(){
                //var _val=$.trim($('.citylev2-wea').val())
                var selectJson=i8city.getSelect();
                var _val=selectJson.cityName;
                if(_val==""){
                    boxer.error('请选择完整城市信息！')
                    return;
                }else{
                    weatherReport(_val);
                    $.ajax({
                        url: i8_session.ajaxHost+"webajax/settings/UpdateCity?" + Math.random(),
                        type: "post",
                        dataType: "json",
                        data: {city:_val},
                        success: function (data, textStatus) {
                            if (data.Result) {
                                boxer.successMask("保存成功");
                            }
                            else {
                                boxer.error(data.Message);
                            }
                        },
                        error: function (e1, e2, e3) {
                            boxer.error(data.Message);
                        }
                    });
                    uu.close();
                }
            })
            $(uu).on('click','.ct-cancel',function(){
                uu.close();
            })
        })
    }
    //天气预报
    //http://api.map.baidu.com/telematics/v3/weather?location=%E4%B8%8A%E6%B5%B7&output=json&ak=9PRBhPGy49wjkFabhLGbfd7v
    function weatherReport(city,container){
        var api_url=i8_session.ajaxHost+'webajax/modules/getweatherreport?city='+encodeURIComponent(city);
        $.get(api_url,{},function(response){
            if(response.Result){
                var weatherData=response.ReturnObject;//JSON.parse(response.ReturnObject);
                //console.log(weatherData)
                if(weatherData.status=='success'){
                    var Actiy=weatherData.results[0];
                    var weaData=Actiy['weather_data'];
                    var city=Actiy['currentCity'];
                    $("div.date-info",container).text(weaData[0].date+" "+weaData[0].weather);
                    $("a.city-name",container).text(city)
                }
            }
        },"json");
    }
    //获取滚动条当前的位置
    function getScrollTop() {
        var scrollTop = 0;
        if (document.documentElement && document.documentElement.scrollTop) {
            scrollTop = document.documentElement.scrollTop;
        }
        else if (document.body) {
            scrollTop = document.body.scrollTop;
        }
        return scrollTop;
    }
    //获取当前可是范围的高度
    function getClientHeight() {
        var clientHeight = 0;
        if (document.body.clientHeight && document.documentElement.clientHeight) {
            clientHeight = Math.min(document.body.clientHeight, document.documentElement.clientHeight);
        }
        else {
            clientHeight = Math.max(document.body.clientHeight, document.documentElement.clientHeight);
        }
        return clientHeight;
    }
    //获取文档完整的高度
    function getScrollHeight() {
        return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
    }
})