define(function (require, exports) {
    var ajaxHost=i8_session.ajaxHost;
    var fw_page=require('../common/fw_pagination');
    var i8ui=require('../common/i8ui');
    var util=require('../common/util');
    var kewword=decodeURIComponent(util.getUrlParam('keyword'));
    if(kewword){
        $('#searchKey').val(kewword);
    }
    var top_menu=$('#top_menu');
    var menu_panel=$('.menu-panel');

    var getTeamUrl=function(uid){
        return i8_session.baseHost+'users/'+uid;
    }

    template.helper('heightlight',function(searchKey,text){
        var searchReg=new RegExp(searchKey,'g');
        return text?text.replace(searchReg,'<b class="red">'+searchKey+'</b>'):'';
    });

    //搜索同事
    var getColleagues=function(options){
        var colleagues=$('#colleagues_panel');
        var _content=colleagues.find('.content');
        var tpl=require('../../template/search/colleagues.tpl');
        var render=template(tpl);
        if(!options.keyword ){
            _content.html(render({noKey:true}));
            return;
        }
        _content.html(render({loading:true}));
        var _page=colleagues.find('.pagination').empty();
        $.ajax({
            url:ajaxHost+'search/searchPerson',
            data:{options:options},
            type:'get',
            dataType: 'json',
            success:function(data){
                if(data.Result){
                    data.keyword =options.keyword;
                    var html=render(data);
                    _content.html(html);
                    i8ui.expendUI($('.cardlabel'),{
                        max_height:30,
                        height:30,
                        bottom:5,
                        right:5
                    });
                }else{
                    _content.html('<div class="tcenter">'+data.Code+'</div>');
                }
                //分页控件绑定
                fw_page.pagination({
                    ctr: _page,
                    totalPageCount: data.Total,
                    pageSize: 6,
                    current: options.pageIndex,
                    fun: function (new_current_page, containers) {
                        options.pageIndex=new_current_page;
                        getColleagues(options);
                    }, jump: {
                        text: '跳转'
                    }
                });
            },error:function(err1){
                _content.html('<div class="tcenter">请求同事数据超时，请检查网络！</div>');
            }
        });
    }

    //搜索文档
    var getDoc=function(options){


        var tpl=require('../../template/search/doc.tpl');
        var render=template(tpl);

        var document=$('#document_panel');
        var _content=document.find('.content');
        if(!options.keyword){
            _content.html(render({noKey:true}));
            return;
        }
        _content.html(render({loading:true}));
        var _page=document.find('.pagination').empty();
        $.ajax({
            url:ajaxHost+'search/searchDoc',
            data:{options:options},
            type:'get',
            dataType: 'json',
            success:function(data){
                if(data.Result){
                    data.searchKey=options.keyword;
                    _content.html(render(data));
                }else{
                    //_content.html('<div class="tcenter">'+data.Description+'</div>');
                }
                //分页控件绑定
                fw_page.pagination({
                    ctr: _page,
                    totalPageCount: data.Total,
                    pageSize: 6,
                    current: options.pageIndex,
                    fun: function (new_current_page, containers) {
                        options.pageIndex=new_current_page;
                        getDoc(options);
                    }, jump: {
                        text: '跳转'
                    }
                });
            },error:function(err1){
                _content.html('<div class="tcenter">请求文档数据超时，请检查网络！</div>');
            }
        });
    }
    /**
     * 高亮显示关键字, 构造函数
     */
    function Highlighter(colors) {
        this.colors = colors;
        if (this.colors == null) {
            //默认颜色
            this.colors = ['#ffffff,#ff0000','#dae9d1,#000000','#eabcf4,#000000',
                '#c8e5ef,#000000','#f3e3cb, #000000', '#e7cfe0,#000000',
                '#c5d1f1,#000000','#deeee4, #000000','#b55ed2,#000000',
                '#dcb7a0,#333333', '#7983ab,#000000', '#6894b5, #000000'];
        }
    }
    Highlighter.prototype.highlight = function(node, keywords) {
        if (!keywords || !node || !node.nodeType || node.nodeType != 1)
            return;

        keywords = this.parsewords(keywords);
        if (keywords == null)
            return;

        for (var i = 0; i < keywords.length; i++) {
            this.colorword(node, keywords[i]);
        }
    }
    Highlighter.prototype.colorword = function(node, keyword) {
        for (var i = 0; i < node.childNodes.length; i++) {
            var childNode = node.childNodes[i];
            if (childNode.nodeType == 3) {
                //childNode is #text
                var re = new RegExp(keyword.word, 'i');
                if (childNode.data.search(re) == -1) continue;
                re = new RegExp('(' + keyword.word + ')', 'gi');
                var forkNode = document.createElement('span');
                forkNode.innerHTML = childNode.data.replace(re, '<span style="background-color:'+keyword.bgColor+';color:'+keyword.foreColor+'" mce_style="background-color:'+keyword.bgColor+';color:'+keyword.foreColor+'">$1</span>');
                node.replaceChild(forkNode, childNode);
            }
            else if (childNode.nodeType == 1) {
                //childNode is element
                this.colorword(childNode, keyword);
            }
        }
    }
    Highlighter.prototype.parsewords = function(keywords) {
        keywords = keywords.replace(/\s+/g, ' ');
        keywords = keywords.split(' ');
        if (keywords == null || keywords.length == 0)
            return null;

        var results = [];
        for (var i = 0; i < keywords.length; i++) {
            var keyword = {};
            var color = this.colors[i % this.colors.length].split(',');
            keyword.word = keywords[i];
            keyword.bgColor = color[0];
            keyword.foreColor = color[1];
            results.push(keyword);
        }
        return results;
    }
    Highlighter.prototype.sort = function(list) {
        list.sort(function(e1, e2) {
            return e1.length < e2.length;
        });
    }
    //根据菜单状态搜索
    var searchByMenuType=function(_menutype){
        var keyword =$('#searchKey').val();
        //var _url=window.location.href;

        //window.location.href=_url.replace(/keyword=[\S]+[#$]/,'keyword='+keyword+'#');
        switch(_menutype){
            case '#dynamic':
                var kankanlist=require('../plugins/i8bloglist/i8blogs');
                var showKankan=null;
                $("#blog_list").unbind();
                //侃侃展示
                showKankan=kankanlist({container:"#blog_list",selectCity:false,listType:"search",keyword:keyword,noConentText:"未搜索到相关动态!",listHeader:false,loadItemComplated:function(){
                    var hl = new Highlighter();
                    hl.highlight(document.getElementById("blog_list"), keyword);
                }});
                showKankan.init();
                break;
            case '#colleagues':
                getColleagues({
                    pageIndex:1,
                    pageSize:6,
                    keyword :keyword
                });;break;
            case '#document':
                getDoc({
                    keyword:keyword,
                    pageIndex:1,
                    pageSize:6
                });break;
        }
    }

    var changehash=function(_menutype){
        menu_panel.hide();
        top_menu.find('span.heit').removeClass('current');

        $(_menutype+'_panel').show();
        top_menu.find('span.heit[menutype='+_menutype+']').addClass('current');
        searchByMenuType(_menutype);
    }

    changehash(window.location.hash);

    //拼接个人主页url
    template.helper('getTeamUrl',function(uid){
        return getTeamUrl(uid);
    });

    $(window).on('hashchange',function(){
        changehash(window.location.hash);
    })

    top_menu.on('click','span.heit',function(){
        var _this=$(this);
        var _menutype=_this.attr('menutype');
        window.location.hash=_menutype;
    });
    $(document).on('keydown',function(e){
        if(e.keyCode=='13'){
            $('#search_btn').trigger('click');
        }
    });

    //搜索按钮
    $('#search_btn').on('click',function(){
        searchByMenuType($('.heit.current').attr('menutype'));
    });

});