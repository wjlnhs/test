define(function(require, exports){
    var i8ui = require('../common/i8ui');
    var fw = require('../cement/public.js');
    //var top_nav_fix = require('../../javascripts/modules/top-nav-fix.js');
    var myLinkSet = [];
    function getBegin(){
        getMylinks();
    }
    function getMylinks(){
        getLinks(2,function(data){
            var listHtml = '';
            myLinkSet = [];
            var lists = data || [];
            for( var i = 0; i < lists.length; i++){
                var _item = lists[i];
                myLinkSet.push(_item.ID);
                listHtml += '<a target="_blank" href="'+ _item.Link +'"><i class="spbg1 sprite-51"></i>'+ _item.Title +'</a>';
            }
            if(listHtml == ''){
                listHtml = '<div class="links-tps-cont"><span class="spbg1 sprite-112"></span><p style="padding-top: 20px;">点击这里</p><p>进行常用设置</p></div>';
            }
            $('#js_links_list').html(listHtml);
        });
    }
    var linksDom = null;
    function bindClick(){
        //群组click事件
        $('#js_left_group').click(function(){
            var $this = $(this)
            if($this.attr("class").indexOf("open") >= 0 ){
                $this.removeClass("open");
            }else{
                $this.addClass("open");
            }
            $this.next().toggle();
        });

        //常用链接设置
        $('#js_links_set').click(function(){
            if(linksDom){
                linksDom.close();
            }
            console.log(myLinkSet);
            var tpl = require('./template/linksbox.tpl');
            var tmp = template(tpl);
            linksDom = i8ui.showbox({
                title:'常用应用设置',
                noMask: true,
                cont: tmp({})
            });

            var showDom = $(linksDom);
            showDom.css({top: $(this).offset().top, left: $(this).offset().left+ 40});
            getAllLinks();
            //判断是否是信息管理员
            if(i8_session.utype.join(",").indexOf("30") >= 0){
                $("#js_ismanager_div").show();
                //新增链接
                showDom.on("click","span.links-add-btn",function(){
                    var $this = $(this);
                    var linkName = $.trim($("#js_links_name").val());
                    var linkUrl = $.trim($("#js_links_url").val());
                    if(linkName == ""){
                        i8ui.alert({title:"请输入链接名称",btnDom: $this});
                        return;
                    }
                    if(linkUrl == ""){
                        i8ui.alert({title:"请输入链接地址",btnDom: $this});
                        return;
                    }
                    $.ajax({
                        url: i8_session.ajaxHost+'webajax/modules/addAppLinkParam',
                        type: 'get',
                        dataType: 'json',
                        cache: false,
                        data:{title:linkName,links: linkUrl},
                        success: function(result){
                            if(result.Result){
                                i8ui.alert({title:"新增成功！",type:2,btnDom: $this});
                                $("#js_links_name,#js_links_url").val("");
                                getAllLinks();
                            }else{
                                i8ui.error(result.Description);
                            }
                        },
                        error: function(e1,e2,e3){
                            i8ui.error("请求出错！");
                        }
                    });
                });
            }
            //取消
            showDom.on('click','span.btn-gray96x32', linksDom.close);
            //删除链接事件
            showDom.on("click","span.link-del",function(){
                var $this = $(this);
                var jobj = {};
                jobj[$this.attr("lid")] = 1;
                var liDom = $this.parent();
                i8ui.confirm({title: "确定要删除吗？",btnDom: $this},function(){
                    updateSet(jobj,function(data){
                        i8ui.alert({title:"删除成功！", type:2, btnDom:$this});
                        liDom.remove();
                    });
                });

            });
            //更新设置
            showDom.on("click","span.btn-blue96x32",function(){
                var $this = $(this);
                var jobj = {};
                var inputDom = $("#js_all_link_list").find("input");
                inputDom.each(function(){
                    var linkid = $(this).attr("lid");
                    jobj[linkid] = 0;
                    if(this.checked){
                        jobj[linkid] = 2;
                    }
                });
                updateSet(jobj, function(data){
                    getMylinks();
                    i8ui.alert({title:"设置成功！", type:2, btnDom:$this});
                    linksDom.close();
                });
            });
        });
    }
    //获取常用链接列表
    function getLinks(status,cbk){
        $.ajax({
            url: i8_session.ajaxHost+'webajax/modules/getAppLinkParam',
            type: 'get',
            dataType: 'json',
            cache: false,
            data:{status:status},
            success: function(result){
                if(result.Result){
                    cbk(result.ReturnObject);
                }else{
                    i8ui.error(result.Description);
                }
            },
            error: function(e1,e2,e3){
                i8ui.error("请求出错！");
            }
        });
    }
    function getAllLinks(){
        getLinks(-1,function(data){
            var listHtml = '';
            var mylinksetStr = myLinkSet.join(",");
            for( var i = 0; i < data.length; i++){
                var _item = data[i];
                var del_link = '';
                var isChecked = '';
                if(fw.getComadmin()){
                    del_link = '<span lid="'+ _item.ID +'" class="link-del spbg1 sprite-65"></span>';
                }
                if(mylinksetStr.indexOf(_item.ID)>=0){
                    isChecked = 'checked';
                }
                listHtml += '<li class="rel"><label><input '+ isChecked +' type="checkbox" lid="'+ _item.ID+'" />'+ _item.Title +'</label>'+ del_link +'</li>';
            }
            if(listHtml == ""){
                listHtml = '<div class="tcenter fz14-weight l-h25 cl999"><span class="icon icon-group-no-doc" style="margin:0px; margin-bottom: 10px;"></span><br>新增公司其他常用系统的链接，方便其他同事进行设置</div>'
                $("#js_all_link_btn").hide();
                var kankanstr = '';
                //判断是否是管理员
                if(!fw.getComadmin()){
                    $.ajax({
                        url: i8_session.ajaxHost+'webajax/modules/getalladmin',
                        type: 'get',
                        dataType: 'json',
                        cache: false,
                        success: function(result){
                            console.log(result);
                            if(result.Result){
                                var Items = result.ReturnObject.admin;
                                for(var i=0; i< Items.length; i++){
                                    var adminstr = Items[i].Roles.join(" ");
                                    if(adminstr.indexOf("30")>=0){
                                        kankanstr += '$%$'+ Items[i].Name +','+ Items[i].PassportID +',0$%$ ';
                                    }
                                }
                                $("#js_all_link_list").append('<div class="tcenter m-t10"><span class="blue-button">通知管理员尽快维护</span></div>');
                            }else{
                                i8ui.error(result.Description);
                            }
                        },
                        error: function(e1,e2,e3){
                            i8ui.error("请求出错！");
                        }
                    });
                    //发送管理员新增的 邀请侃侃
                    $("#js_all_link_list").on("click",".blue-button",function(){
                        var $this = $(this);
                        if(kankanstr == ""){
                            i8ui.alert({title: "当前社区暂无社区管理员！", btnDom: $this});
                            return;
                        }
                        $.post(i8_session.ajaxHost+'webajax/kkcom/postblog',{scopeType:2,kankanContent: kankanstr+' 请新增公司其他常用系统的链接，方便其他同事进行设置'},function(response){
                            if(response.Result){
                                i8ui.alert({title: "通知成功！",type:2, btnDom: $this});
                                linksDom.close();
                            }else{
                                i8ui.alert({title: response.Description, btnDom: $this});
                            }
                        },"json");
                    });
                }
            }else{
                $("#js_all_link_btn").show();
            }
            $('#js_all_link_list').html(listHtml);
        });
    }
    //修改常用链接设置
    function updateSet(lid, callback){
        $.ajax({
            url: i8_session.ajaxHost+'webajax/modules/updateAppLinkStatusParam',
            type: 'get',
            dataType: 'json',
            cache: false,
            data:{linkID: JSON.stringify(lid)},
            success: function(result){
                if(result.Result){
                    callback(result);
                }else{
                    i8ui.error(result.Description);
                }
            },
            error: function(e1,e2,e3){
                i8ui.error("请求出错！");
            }
        });
    }
    //删除常用链接
    function delLink(lid,callback){
        $.ajax({
            url: i8_session.ajaxHost+'webajax/modules/updateAppLinkStatusParam',
            type: 'get',
            dataType: 'json',
            cache: false,
            data:{linkID: lid},
            success: function(result){
                if(result.Result){
                    callback(result);
                }else{
                    i8ui.error(result.Description);
                }
            },
            error: function(e1,e2,e3){
                i8ui.error("请求出错！");
            }
        });
    }
    getBegin();
    bindClick();
    //新增群组事件
    $("#js_group_left_ul").on("click","a.nav-a2",function(){
        var addgroup = require('../group/addgroup.js');
        addgroup.groupBox();
    });
    /**
     * 页面homeleft.ejs转移
     * */
    var winurl=window.location.href.toLocaleLowerCase();
    if(winurl.indexOf("/ucenter/contacts")>0 || winurl.indexOf("/ucenter/publicmail")>0){
        $('#js_group_left_ul a').removeClass('current');
        $('#link_contacts').addClass('current');
    }
})