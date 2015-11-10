define(function(require){
    var i8ui = require('../common/i8ui');
    var fw = require('../cement/public.js');
    var fw_page = require('../common/fw_pagination.js');
    var seefile = require('../common/seefile.js');
    var commentlist=require('../plugins/i8bloglist/i8comments');
    var typeIcons = {};
    var beginYear = null;
    var beginMonth = null;
    //更新tps提醒数量
    //ps('57d99d89-caab-482a-a0e9-a0a803eed3ba');
    window.loadLeftMenu = function(){
        fw.getTypeList(function(typeList){
            var alinks = '';
            for(var i = 0; i< typeList.length; i++){
                var typecss = '';
                if(i < 3){
                    typeIcons[typeList[i].ID] = 'cement-icon'+ i;
                    typecss = i;
                }else{
                    typeIcons[typeList[i].ID] = 'cement-icon';
                }
                alinks += '<a class="type-menu" typeid="'+ typeList[i].ID +'"><i class="spbg1 cement-icon'+ typecss +'"></i>'+ typeList[i].CategoryName +'</a>';
            }
            $("#js_cement_typelist").html(alinks);
        });
    }
    function getNowDate(num){
        var time = new Date();
        var newtime = time.getTime() + 1000 * 60 * 60 * 24;
        time = new Date(newtime);
        var d = time.getDate();
        var m = time.getMonth() + 1;
        var y = time.getFullYear();
        if(num){
            return (y-num)+ '-' + m+ '-'+ d;
        }
        return  y+ '-' + m+ '-'+ d;
    }
    //加载公告列表
    function getMgList(pageindex){
        var json = {isManage: false, pagesize: fw.pagesize, pageindex:pageindex};
        json.categoryID = $("#js_cement_ltmenu").find("a.current").attr("typeid");
        json.status = 1;
        json.key = '';
        json.beginTime = getBeginTime(beginYear,beginMonth);
        json.endTime = getEndTime(beginYear,beginMonth);
        $("#js_cement_list_ol").html('<div class="ld-64-gray"></div>');
        if(!json.categoryID){
            json.categoryID = '00000000-0000-0000-0000-000000000000';
        }
        fw.getCementList(json,function(data){
            var tbhtml = '';
            var itemS = data.Item1;
            var domeHt = $("#js_cement_list_li").html();
            for(var i=0; i< itemS.length; i++){
                var _item = itemS[i];
                tbhtml += domeHt.replace("{SendTime}", _item.SendTime)
                                .replace("{istop}", _item.IsTop ? '<span class="istop">置顶</span>': '')
                                .replace('{typeIcon}',typeIcons[_item.CategoryID])
                                .replace("{typename}",_item.CategoryName)
                                .replace("{title}", _item.Title)
                                .replace(/\{id\}/g, _item.ID)
                                .replace("{content}", _item.Content)
                                .replace("{cmtcnt}",_item.AppCommentNum)
                                .replace(/\{cmt\}/g,_item.AppCommentNum>0?"("+_item.AppCommentNum+")":"")
                                .replace("{files}",seefile.ks.getCementHtml(_item.FlieList? _item.FlieList:[],false,true))
                                .replace("{isread}",getIsread(_item.ReadUsers,_item.ID))
                                .replace("{readList}",getReadNames(_item.ReadUserNames))
                                .replace("{delete}",getDeleteA(_item.ID));
            }
            if(tbhtml == ""){
                tbhtml = '<div class="noresult"><div class="no-resulticon noresult-icon"></div><div class="noresult-title">暂无发布内容!</div></div>';
            }
            $("#js_cement_list_ol").html(tbhtml);
            if(data.Item2 > 0){
                $("#js_cement_page_panl").show();
            }else{
                $("#js_cement_page_panl").hide();
            }
            //隐藏超出内容
//            $("#js_cement_list_ol").find("div.cement-ops-cont").each(function(){
//                var $this = $(this);
//                if($this.height() > 400){
//                    $this.next().show();
//                }
//            });
            //控制展开收起
            //控制分页
            fw_page.pagination({
                ctr: $("#js_cement_page_panl"),
                totalPageCount: data.Item2,
                pageSize: fw.pagesize,
                current: pageindex,
                fun: function (new_current_page, containers) {
                    getMgList(new_current_page);
                }, jump: {
                    text: '跳转'
                }
            });
        });
    }
    function getReadNames(names){
        var rtstr = '';
        var sSize = 15;
        if(names.length > 0){
            rtstr = '<div class="weekdailypng-bg read-title">已读：</div>';
            if(names.length > sSize){
                rtstr += '<div class="read-names">';
                for(var i=0; i<sSize; i++){
                    rtstr += names[i]+'&nbsp;';
                }
                rtstr += ('<span class="cmt-ssize">等'+names.length+'人</span><span class="cmt-jt-btn"><i class="sprite-gp"></i>展开</span>');
                rtstr += '</div>';
                rtstr += '<div class="read-names hide">'+ names.join("&nbsp;") +'<span class="cmt-jt-btn open"><i class="sprite-gp"></i>收起</span></div>';
            }else{
                rtstr += '<div class="read-names">'+ names.join("&nbsp;") +'</div>';
            }

        }
        return rtstr;
    }
    function getYear(timestr){
        if(timestr){
            var timed = new Date(timestr);
            return timed.getDate();
        }else{
            return new Date().getFullYear();
        }
    }
    function getMonth(timestr){
        if(timestr){
            var timed = new Date(timestr);
            return timed.getMonth() + 1;
        }else{
            return new Date().getMonth() + 1;
        }
    }
    function getIsread(ids,id){
        if(ids && ids.join("-").indexOf(i8_session.uid)>=0){
            return '<span class="cement-read disabled rt"></span>';
        }else{
            return '<span cid="'+ id +'" class="cement-read do-read rt"></span>';
        }
    }
    function getDeleteA(id){
        if(i8_session.utype.join(";").indexOf("30")>=0){
            return '<a del-id="'+ id +'" class="m-r10 del-cement">删除</a><span class="cl999">|</span>';
        }
        return '';
    }
    $(function(){
        loadLeftMenu();
        //菜单分类
        $("#js_cement_ltmenu").on("click","a.type-menu",function(){
            if($(this).attr("typeid") == ""){
                return;
            }
            $("#js_cement_ltmenu").find("a").removeClass("current");
            $(this).addClass("current");
            getMgList(1);

        });
        //删除公告
        function deleCement(id){
            $.ajax({
                url: i8_session.ajaxHost+'webajax/cement/del-cement',
                type: 'get',
                dataType: 'json',
                data: {announcementID: id},
                cache: false,
                success: function(result){
                    if(result.Result){
                        i8ui.write('删除成功！');
                        getMgList();
                    }else{
                        i8ui.error(result.Description);
                    }
                },
                error: function(e1,e2,e3){
                    i8ui.error("获取分类列表失败");
                }
            });
        }
        //删除
        $("#js_cement_list_ol").on("click","a.del-cement",function(){
            var id = $(this).attr("del-id")
            i8ui.confirm({title:"确定要删除吗？",btnDom: $(this)},function(){
                deleCement(id);
            });
        });
        //评论
        $("#js_cement_list_ol").on("click","a.m-comment",function(){
            var app_id="5bb3aa5b-5c47-4264-bee4-187f87526b39";
            var fatherCell=$(this).parents("li.notice-li"),_this=this;
            if($(this).hasClass("showed")){
                fatherCell.find("div.right-comment").toggle(250,function(){
                    $(this).removeClass("showed");
                })
            }else{
                var source_id=$(this).attr("optid");
                var commentData=[];
                var commentContainer=fatherCell.find("div.cement-rt-cont");
                $.get(i8_session.ajaxHost+'webajax/kkcom/get-appscomments',{sourceid:source_id,appid:app_id,r:Math.random().toString()},function(response){
                    if(response.Result){
                        commentlist({aTag:_this,cmtContainer:commentContainer,datalist:response.ReturnObject,appID:app_id,sourceID:source_id,cmtsendType:"appcomment",replyModel:"replykk"});
                    }else{
                        alert('获取评论失败!<br/>'+response.Description);
                    }
                },"json");
            }
        })
        //标记为已读
        $("#js_cement_list_ol").on("click",".do-read",function (){
            var $this = $(this);
            var cid = $this.attr("cid");
            $.ajax({
                url: i8_session.ajaxHost+'webajax/cement/setread',
                type: 'get',
                dataType: 'json',
                data: {cid: cid},
                cache: false,
                success: function(result){
                    if(result.Result){
                        i8ui.alert({title:'标记成功！',btnDom:$this,type:2});
                        $this.removeClass("do-read").addClass("disabled")
                        var readListDom = $this.parents("li.notice-li").find("div.read-names");
                        if(readListDom.length > 0){
                            readListDom.append("&nbsp;"+i8_session.uname);
                        }else{
                            var Domobj = $this.parents("li.notice-li").find("div.read-list");
                            Domobj.html('<div class="weekdailypng-bg read-title">已读：</div><div class="read-names">'+ i8_session.uname +'</div>');
                        }

                    }else{
                        i8ui.error(result.Description);
                    }
                },
                error: function(e1,e2,e3){
                    i8ui.error("请求出错");
                }
            });
        });
        //年份切换
        $("#js_cement_time_menu").on("click",".cement-yeah",function(){
            var $this = $(this);
            if($this.attr("class").indexOf("current") >= 0){
                return;
            }
            $("#js_cement_time_menu").find("div.cement-yeah").removeClass("current").height(25);
            $this.addClass("current").height($this.attr("height"))
            //所有时间事件
            if($(this).text() == "至今"){
                beginYear = '';
                beginMonth = '';
                getMgList(1);
            }
        });
        //月份切换
        $("#js_cement_time_menu").on("click","span",function(){
            var $this = $(this);
            var spanDoms = $this.parent().find("span");
            spanDoms.removeClass("cked");
            $this.addClass("cked");
            beginYear = $this.attr("beginyear");
            beginMonth = $this.attr("beginmonth");
            getMgList(1);
        });
        //展开或者收起
        $("#js_cement_list_ol").on("click",".read-list",function(){
            var domLists = $(this).find("div.read-names");
            if(domLists.length > 1){
                domLists.toggle();
            }
        });
        getTimemenu();
    });
    function getBeginTime(year,month){
        if(year == "" || month == ""){
            return '';
        }
        return  year +'/'+ month+'/01 00:00';
    }
    function getEndTime(year,month){
        if(year == "" || month == ""){
            return '';
        }
        month = parseInt(month)+1
        if(month > 12){
            month = 1;
            year = parseInt(year) + 1;
        }
        return  year +'/'+ month+'/01 00:00';
    }
    function getTimemenu(){
        $.ajax({
            url: i8_session.ajaxHost+'webajax/cement/list-time',
            type: 'get',
            dataType: 'json',
            cache: false,
            success: function(result) {
                if(result.Result){
                    var jsonData = result.ReturnObject;
                    if(!jsonData){
                        return;
                    }
                    var timeHtml = '';
                    var nowYear = new Date().getFullYear();
                    var nowMonth = new Date().getMonth() + 1;
                    for( var k=0;  k<jsonData.length; k++){
                        var item = jsonData[k];
                        var current = '';
                        var styleht = '';
                        var dheight = item.Value.length * 20 + 25;
                        if(k==0){
                            //current = 'current';
                            styleht = 'height:'+ dheight +'px;';
                            //beginYear = item.Key;
                        }
                        timeHtml += '<div class="cement-yeah '+ current +'" style="'+ styleht +'" height="'+ dheight +'">';
                        timeHtml += '<label class="time-year">'+ item.Key +'年</label>'
                        for(var i = 0; i<item.Value.length; i++){
                            var cked = '';
                            if(k == 0 && i == 0){
                                //cked = 'cked';
                                //beginMonth = item.Value[i];
                            }
                            var monthNum = item.Value[i];
                            if(item.Key == nowYear && item.Value[i] == nowMonth){
                                item.Value[i] == nowMonth;
                                monthNum = "当"
                            }
                            timeHtml += '<span beginyear="'+ item.Key +'" beginmonth="'+ item.Value[i] +'" class="'+ cked +'">'+ monthNum +'月</span>'
                        }
                        timeHtml += '</div>';
                    }
                    timeHtml = '<div class="cement-yeah current"><label class="time-year">至今</label></div>' + timeHtml;
                    beginYear = '';
                    beginMonth = '';
                    $("#js_cement_time_menu").html(timeHtml);
                    getMgList(1);
                }
            },
            error: function(e1,e2,e3){
                i8ui.error("获取分类列表失败");
            }
        });
    }
    seefile.ks.bindImgClick($("#js_cement_list_ol"),true);
});