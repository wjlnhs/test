define(function (require, exports) {
    var i8ui = require('default/javascripts/common/i8ui');
    var fw_page=require('default/javascripts/common/fw_pagination.js');
    var RootOrgID=1;//默认根组织id
    var pageIndex=1;
    var keyword="";
    var orgID=1;
    var isOnlyContract=false;
    var searchtxt = "";

    //页面初始化
    LoadTree(true);
    function loadgif(){
        $('table tbody').html('<tr><td align="center" colspan="5"><img src="/default/images/64loading_white.gif"></td></tr>');
        $('#js_cement_page_panl').html("");
    }
    loadgif();
    //事件绑定
    //是否显示常用联系人
    $('.onlyshowalways').click(function(){
        var $this=$(this);
        keyword=$('#peopleSearchBox input').val();
        if($this.hasClass('checked')){
            $this.removeClass('checked')
            isOnlyContract=false;
            SearchPerson(keyword,pageIndex,orgID,isOnlyContract)
        }else{
            $this.addClass('checked');
            isOnlyContract=true;
            SearchPerson(keyword,pageIndex,orgID,isOnlyContract)
        }
    })
    $('.maillist').on('click','.setusual',function(){
        var $this=$(this);
        if($this.hasClass('icon-love-empty')){
            $this.removeClass('icon-love-empty').addClass('icon-love');
            SetContractors($this.attr('cid'),true,$this)
        }else{
            $this.removeClass('icon-love').addClass('icon-love-empty');
            SetContractors($this.attr('cid'),false,$this)
        }
    })
    //设置常用联系人
    function SetContractors(contractID,isAdd,$this){
        $.post(i8_session.ajaxHost+"webajax/settings/SetContractors?" + Math.random(),{contractID:contractID,isAdd:isAdd},function(data){
            
            if(data.Result){
                if(isAdd){
                    i8ui.simpleWrite("已设置为常用联系人",$this)
                }else{
                    i8ui.simpleAlert("已取消常用联系人",$this)
                }

            }else{
                i8ui.simpleAlert(data.Message)
            }
        })
    }

    template.helper("$FunLevels", function (Levels) {
        var userstyle = "";
        for(var i=0;i<Levels.length;i++){
            if (Levels[i] == 4) {
                userstyle += "<span class='app_contacts_userlevel4' title='超级管理员'></span>";
            }
            else if (Levels[i] == 20) {
                userstyle += "<span class='app_contacts_userlevel20' title='基础设置管理员'></span>";
            }
            else if (Levels[i] == 30) {
                userstyle += "<span class='app_contacts_userlevel30' title='社区管理员'></span>";
            }
        }
        userstyle="";
        return userstyle;
    });


    //通讯录收缩
    $('.li-nav2').on('click',function(){
        $('#contacts_tree').slideToggle(100);
    })
     //得到data加载人员
    function renderPeople(data){
        
        if(data.Result){
            require.async('../users/settings/userInfo/template/orgPerson.tpl', function (orgPerson) {
                var render = template(orgPerson);
                var List=data.ReturnObject.Result;
                if(List.length>0){
                    var _html = render({List: List});
                }else{
                    var _html='<tr><td align="center" colspan="5"><div class="no-contract-img"></div><div class="orange ft16 m-t20 bold m-b20">没有任何数据~</div></td></tr>';
                }
                $('.tatlepeople .red').text(data.ReturnObject.totalCount)
                $('.maillist tbody').html(_html);
                //控制分页
                if(data.ReturnObject.totalCount<=10){
                    $("#js_cement_page_panl").html("");
                }
                fw_page.pagination({
                    ctr: $("#js_cement_page_panl"),
                    totalPageCount: data.ReturnObject.totalCount,
                    pageSize: 10,
                    current: pageIndex,
                    fun: function (new_current_page,containers) {
                        pageIndex=new_current_page;
                        SearchPerson(keyword,new_current_page,orgID,isOnlyContract);
                    }, jump: {
                        text: '跳转'
                    }
                });
            })
        }else{
            i8ui.error(data.Message)
        }
    }
    //根据组织加载人员

    //搜索人员
    function SearchPerson(keyword,pageIndex,orgID,isOnlyContract){
        loadgif();
        var orgID=orgID || RootOrgID;
        $.post(i8_session.ajaxHost+"webajax/settings/GetOrgPersonsInfo?" + Math.random(),{keyword:keyword,pageIndex:pageIndex,pageSize:10,orgID:orgID,isOnlyContract:isOnlyContract},function(data){
            renderPeople(data)
        })
    }

    //绑定搜索
    $('#peopleSearchBtn').on('click',function(){
        var input=$('#peopleSearchBox input');
        keyword=input.val();
        orgID=RootOrgID;
        pageIndex=1;

        SearchPerson(keyword,1,RootOrgID,isOnlyContract);
        //树返回顶级
        var zTrees = $.fn.zTree.getZTreeObj("contacts_tree");
        var nodes = zTrees.getNodes();
        if (nodes != null && nodes.length > 0) {
            zTrees.selectNode(nodes[0], false);
            $('body,html').scrollTop(0);
        }
        return false;
    })
    $('#peopleSearchBox input').on('keyup',function(ev){
        if(ev.keyCode==13){
            $('#peopleSearchBtn').trigger('click')
        }
        if(ev.keyCode==8){
            $('#peopleSearchBtn').trigger('click');
            $(this).focus();
        }
    })
    var setting = {
        view: {
            showIcon: false,
            showLine:false
        },
        data: {
            simpleData: {
                enable: true,
                idKey: "OrgID",
                pIdKey: "ParentID",
                rootPId: 1
            },
            key: {
                title: "Name",
                name: "Name"
            }
        },
        callback: {
            onClick: function (event, treeId, treeNode) {
                loadgif()
                keyword = "";
                //清空搜索
                pageIndex=1;
                $(".nav-search-box input").val("");
                    orgID=treeNode.OrgID;
                    $.post(i8_session.ajaxHost+"webajax/settings/GetOrgPersonsInfo?" + Math.random(),{orgID:orgID,isOnlyContract:isOnlyContract},function(data){
                        renderPeople(data);
                    })

                $("#contacts_tree_box").mCustomScrollbar({
                    axis:"xy",
                    theme:"minimal-dark",
                    autoExpandScrollbar:true,
                    advanced:{autoExpandHorizontalScroll:true,
                        autoScrollOnFocus:true}
                });
            }
        }
    };

    function LoadTree(isfirst) {

        var url= i8_session.ajaxHost+"webajax/settings/GetDefaultOrgTree?" + Math.random();
        $.ajax({
            url: url,
            type: 'post',
            dataType: 'json',
            cache: false,
            success: function (data) {
                if (data.Result) {
                    if(data.ReturnObject.length==0){
                        $('#contacts_tree').html('<li>暂无通讯录列表</li>');
                        $('.maillist tbody').html('<tr><td align="center" colspan="5"><div class="no-contract-img"></div><div class="orange ft16 m-t20 bold m-b20">没有任何数据~</div></td></tr>');
                        return;
                    }
                    if(data.ReturnObject[0] && isfirst){
                        data.ReturnObject=data.ReturnObject.slice(0,1);
                    }
                    data.ReturnObject[0].open=true;

                    var _data=data.ReturnObject;
                    for(var i=0;i<_data.length;i++){
                        _data[i].iconSkin='flod';
                    }
                    $.fn.zTree.init($("#contacts_tree"), setting, data.ReturnObject);
                    var zTrees = $.fn.zTree.getZTreeObj("contacts_tree");
                    //var nodes = zTrees.getCheckedNodes(true);
                    var nodes = zTrees.getNodes();
                    if (nodes != null && nodes.length > 0) {
                        //LoadContactsUser(1, nodes[0].id);
                        zTrees.selectNode(nodes[0], false);
                        $('body,html').scrollTop(0)
                    }
                    if(isfirst){
                        $('#contacts_tree_1 a').trigger('click');
                        $('#contacts_tree').append('<li><img src="/default/images/32loading_white.gif"></li>')
                        isfirst=false;
                        LoadTree()
                    }

                    RootOrgID=data.ReturnObject[0].RootID;
                } else {
                    i8ui.error({
                        str: "组织架构生成失败", type: 1
                    });
                }
            }
        });
    }

})