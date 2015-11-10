/**
 * Created by chenshanlian on 2015/3/20.
 */
define(function(require){
    var regObj = require('../common/regexp.js');
    var i8ui = require('../common/i8ui.js');
    var util = require('../common/util.js');
    var fw_page = require('../common/fw_pagination.js');
    var i8selector = require("../plugins/i8selector/fw_selector.js");

    var orgJson = {};
    var orgNames = [];
    var currOrg = null;
    var zTree = null;
    var newOrgArrs = [];
    var perSons = [];
    var pageSize = 20;
    var classLineObj={};//职级列表缓存
    var orgInfoDom = $("#js_org_info");
    var orgdivDom = $("#js_org_list_div");//组织人员
    var orgPartsDom = $("#js_org_parts");//兼职
    var orgMangerDom = $("#js_org_manger");//负责人
   // var orgRelation=$('#js_org_relation');//汇报关系设置
   // var orgRelationTop=$('#js_org_relation_top');//汇报顶级
    var partTimes = [];
    var nodeAdoms = null;
    //汇报关系设置搜索条件
   // var searchRelationPerson= i8selector.KSNSelector({ model: 2, element: '#searchRelationPerson', width: '312', isAbox: true, searchType: { "org": false, "user": true, "grp": false }});
    //高亮当前节点
    function showNode(node){
        $("#contacts_tree").find("a").removeClass("current");
        $("#"+node.tId+"_a").addClass("current");
    }
    function getDefault(cbk) {
        var setting = {
            view: {
                dblClickExpand: false,
                showLine: false,
                showIcon: false,
                nameIsHTML: true,
                showTitle: false
            },
            data: {
                simpleData: {
                    enable: true
                },
                key:{
                    checked: true
                }
            },
            callback: {
                onClick: function (e, treeId, treeNode) {
                    currOrg = treeNode;
                    if(!treeNode.pId){
                        treeNode.pId = 0;
                    }
                    showNode(treeNode);
                    currOrg.pname = orgJson[currOrg.pId];
                    showSelectedOrg();
                }
            }
        }
        $.ajax({
            url: i8_session.ajaxHost + "webajax/setcenter/getDefaultOrgTree",
            type: "get",
            dataType: "json",
            cache: false,
            success: function (data) {
                if (data.Result) {
                    newOrgArrs = [];
                    for (var i=0; i<data.ReturnObject.length; i++) {
                        var item = data.ReturnObject[i];
                        orgNames[item.Name] = item.OrgID;
                        orgJson[item.OrgID] = item.Name;
                        var cked = (item.ParentID == 0);
                        if(currOrg && currOrg.pId == item.OrgID){
                            cked = true;
                        }
                        newOrgArrs.push({ id: item.OrgID, name: item.Name, title: item.Name, open:cked , pId: item.ParentID, mid:item.ManagerID, order: item.Order,Deepth: item.Deepth,iconSkin:'flod' });
                        if(!currOrg && i == 0){
                            currOrg = newOrgArrs[0];
                            currOrg.pname = orgJson[currOrg.pId];
                        }
                    }
                    zTree = $.fn.zTree.init($("#contacts_tree"), setting, newOrgArrs);
                    var node = zTree.getNodeByParam("id",currOrg.id);
                    showNode(node);
                    if(cbk){
                        cbk();
                    }
                } else {
                    i8ui.error(data.Description);
                }
            },
            error: function (e1, e2, e3) {

            }
        });
    }
    //获取部门信息
    function getOrgInfo(){
        orgInfoDom.html('<div class="ld-64-write"></div>');
        $.ajax({
            url: i8_session.ajaxHost + "webajax/setcenter/getOrgInfo",
            type: "get",
            dataType: "json",
            cache: false,
            data:{jdata:{orgID:currOrg.id}},
            success: function (data) {
                if (data.Result) {
                    var tpl = require('./template/curOrg.tpl');
                    var tmp = template(tpl);
                    template.helper("getParentName",function(data){
                        if(data == 0){
                            return "无";
                        }else{
                            return orgJson[data];
                        }
                    });
                    template.helper("getManagerName",function(data){
                        if(data){
                            return data;
                        }else{
                            return '<span class="org-set-fzr">暂未设定</span>';
                        }
                    });
                    orgInfoDom.html(tmp(data));
                } else {
                    i8ui.error(data.Description);
                }
            },
            error: function (e1, e2, e3) {

            }
        });
    }
    //获取部门员工信息列表
    function getOrgPersonInfo(pageIndex){
        $("#js_page1").html("");
        orgdivDom.find("tbody").html('<tr><td colspan="6"><div class="ld-64-write"></div></td></tr>');
        var searchKey = $.trim($("#js_person_shtxt").val());
        $.ajax({
            url: i8_session.ajaxHost + "webajax/setcenter/getOrgPersonsInfo",
            type: "get",
            dataType: "json",
            cache: false,
            data:{jdata:{orgID:currOrg.id, psize:pageSize, pindex: pageIndex, searchKey: searchKey}},
            success: function (data) {
                if (data.Result) {
                    var tpl = require('./template/orgperson.tpl');
                    var tmp = template(tpl);
                    perSons = data.ReturnObject.Result;
                    template.helper("getTimestr",function(data){
                        return data.substring(0,10);
                    });
                    $("#js_total1").html(data.ReturnObject.totalCount);
                    orgdivDom.find("tbody").html(tmp(data.ReturnObject));
                    //控制分页
                    fw_page.pagination({
                        ctr: $("#js_page1"),
                        totalPageCount: data.ReturnObject.totalCount,
                        pageSize: pageSize,
                        current: pageIndex,
                        fun: function (new_current_page, containers) {
                            getOrgPersonInfo(new_current_page);
                        }, jump: {
                            text: '跳转'
                        }
                    });
                } else {
                    i8ui.error(data.Description);
                }
            },
            error: function (e1, e2, e3) {
            }
        });
    }
    //加载负责人信息
    function getManagerinfo(){
        $.ajax({
            url: i8_session.ajaxHost + "webajax/setcenter/getOrgManagers",
            type: "get",
            dataType: "json",
            cache: false,
            data:{jdata:{orgIDs:[currOrg.id]}},
            success: function (data) {
                console.log(data);
                if (data.Result) {
                    var aDom = $($("#js_org_per_type").find("a")[1]);
                    if(data.ReturnObject.length > 0 && data.ReturnObject[0].Item1){
                        var tpl = require('./template/orgManager.tpl');
                        aDom.removeClass("false");
                        var tmp = template(tpl);
                        template.helper("getPartHtml",function(data){
                            if(data.Item2){
                                return '<p style="line-height: 25px; color:#F8B62F;">兼职名称：'+ data.Item2.Name +'</p>'
                            }else{
                                return '';
                            }
                        });
                        $("#js_org_manger").html(tmp(data));
                    }else{
                        aDom.addClass("false");
                        var htmlstr = '<div class="tcenter l-h30 p10"><span class="red m-r20">暂无负责人</span><span class="blue94x32 set-manager">立即设置</span></div>'
                        $("#js_org_manger").html(htmlstr);
                    }

                } else {
                    i8ui.error(data.Description);
                }
            },
            error: function (e1, e2, e3) {

            }
        });
    }
    //获取当前节点分页兼职信息
    function getOrgParts(pageIndex){
        $("#js_page2").html("");
        orgPartsDom.find("tbody").html('<tr><td colspan="4"><div class="ld-64-write"></div></td></tr>');
        $.ajax({
            url: i8_session.ajaxHost + "webajax/setcenter/getOrgPartTimes",
            type: "get",
            dataType: "json",
            cache: false,
            data:{jdata:{orgID:currOrg.id, psize:pageSize, pindex: pageIndex}},
            success: function (data) {
                if (data.Result) {
                    var tpl = require('./template/orgpartlist.tpl');
                    var tmp = template(tpl);
                    partTimes = data.List;
                    $("#js_total2").html(data.Total);
                    template.helper('getOrgName',function(orgid){
                        return orgJson[orgid];
                    });
                    orgPartsDom.find("tbody").html(tmp(data));
                    //控制分页
                    fw_page.pagination({
                        ctr: $("#js_page2"),
                        totalPageCount: data.Total,
                        pageSize: pageSize,
                        current: pageIndex,
                        fun: function (new_current_page, containers) {
                            getOrgParts(new_current_page);
                        }, jump: {
                            text: '跳转'
                        }
                    });
                } else {
                    i8ui.error(data.Description);
                }
            },
            error: function (e1, e2, e3) {

            }
        });
    }
    //获取所有的兼职信息
    function getOrgAllParts(cbk){
        $.ajax({
            url: i8_session.ajaxHost + "webajax/setcenter/getOrgPartTimes",
            type: "get",
            dataType: "json",
            cache: false,
            data:{jdata:{orgID:currOrg.id, psize:100, pindex: 1}},
            success: function (data) {
                cbk(data);
            },
            error: function (e1, e2, e3) {

            }
        });
    }
    //显示选择的节点的数据
    function showSelectedOrg(){
        getOrgInfo();
        getOrgPersonInfo(1);
        getManagerinfo();
        getOrgParts(1);
    }
    //切换列表事件
    var divDoms=$('.js_org_panel');
    $("#js_org_per_type").on("click","a",function(){
        $("#js_org_per_type a").removeClass("current");
        var index=$(this).addClass("current").attr("index");
        divDoms.hide();
        switch (index){
            case '1':
                orgdivDom.show();
                getOrgPersonInfo(1);
                break;
            case '2':
                orgMangerDom.show();
                getManagerinfo();
                break;
            case '3':
                orgPartsDom.show();
                getOrgParts(1);
                break;
            /*case '4':
                orgRelation.show();
                getRelation();//获取汇报关系
                break;
            case '5':
                orgRelationTop.show();
                ;break;*/
            default :break;
        }
    });
    //添加下级
    orgInfoDom.on("click",".blue",function(){
        var tpl = require('./template/addorg.tpl');
        var tmp = template(tpl);
        var sbox = i8ui.showbox({
            title: "新增下级部门",
            cont: tmp({})
        });
        var opsParent = $("#js_org_options");
        //初始化选择默认父节点
        var selTreeNode = $("#js_org_sel");
        selTreeNode.attr("orgid",currOrg.id).html(currOrg.name);
        var setting = {
            view: {
                dblClickExpand: false,
                showLine: true,
                showIcon: false,
                nameIsHTML: true,
                showTitle: false
            },
            data: {
                simpleData: {
                    enable: true
                }
            },
            callback: {
                onClick: function (e, treeId, treeNode) {
                    selTreeNode.attr("orgid",treeNode.id).html(treeNode.name);
                    $("#js_org_tree").hide();
                }
            }
        }
        $.fn.zTree.init($("#addtreedome"), setting, newOrgArrs);
        //删除
        $(sbox).on("click",".del-org-op",function(){
            $(this).parent().remove();
        });
        //新增一项
        $(sbox).on("click",".add-options",function(){
            if(opsParent.find("div.org-ml80").length >= 10){
                return;
            }
            opsParent.append('<div class="org-ml80"><input type="text" class="add-org-nametxt m-r10" placeholder="请输入节点名称"><input type="text" class="add-org-numtxt" placeholder="排序编号"><a class="del-org-op m-l10">删除</a></div>');
            sbox.againShow();
        });
        //保存
        $(sbox).on("click",".blue96x32",function(){
            var orgDatas = [];
            var bol = true;
            opsParent.find("input.add-org-nametxt").each(function(){
                var orgname = $.trim(this.value);
                var orgNameDom = $(this);
                var orgNumDom = orgNameDom.next();
                var orderNum = $.trim($(this).next().val());
                var delDom = $(this).next().next();
                if(!regObj.ftest(orgname,regObj.nametext)){
                    i8ui.trterror("名称格式错误！",delDom);
                    i8ui.txtError(orgNameDom);
                    bol = false;
                    return false;
                }
                if(!regObj.ftest(orderNum,regObj.num)){
                    i8ui.trterror("请输入数字！",delDom);
                    i8ui.txtError(orgNumDom);
                    bol = false;
                    return false;
                }
                if(orgNames[orgname]){
                    i8ui.trterror("节点已存在！",delDom);
                    bol = false;
                    return false;
                }
                for(var i=0; i<orgDatas.length; i++){
                    if(orgDatas[i].Item2 == orgname){
                        i8ui.txtError(orgNameDom);
                        i8ui.trterror("名称重复！",delDom);
                        return false;
                    }
                }
                orgDatas.push({"Item1":'00000000-0000-0000-0000-000000000000', "Item2": orgname, "Item3":orderNum});
                bol = true;
            });
            if(!bol){
                //i8ui.error("请输入正确的部门信息！");
                return false;
            }
            var pId = $("#js_org_sel").attr("orgid");
            $.ajax({
                url: i8_session.ajaxHost + "webajax/setcenter/createOrgDatas",
                type: "post",
                dataType: "json",
                cache: false,
                data:{ jdata:{parentOrgId: (pId || currOrg.id), managerType: 0, orgDatas:orgDatas}},
                success: function (data) {
                    if (data.Result) {
                        i8ui.write("保存成功！");
                        getDefault();
                        sbox.close();
                    } else {
                        i8ui.error(data.Description);
                    }
                },
                error: function (e1, e2, e3) {

                }
            });
        });
    });
    //编辑部门
    orgInfoDom.on("click",".write",function(){
        var tpl = require('./template/editorg.tpl');
        var tmp = template(tpl);
        var sbox = i8ui.showbox({
            title: "编辑“"+currOrg.name+"”",
            cont: tmp(currOrg)
        });
        //初始化选择默认父节点
        var selTreeNode = $("#js_org_sel");
        var setting = {
            view: {
                dblClickExpand: false,
                showLine: true,
                showIcon: false,
                nameIsHTML: true,
                showTitle: false
            },
            data: {
                simpleData: {
                    enable: true
                }
            },
            callback: {
                onClick: function (e, treeId, treeNode) {
                    selTreeNode.attr("orgid",treeNode.id).html(treeNode.name);
                    $("#js_org_tree").hide();
                    return false;
                }
            }
        }
        var parentsOrgArrs = [];
        for(var i=0; i<newOrgArrs.length; i++){
            var orgItem = newOrgArrs[i]
            if(orgItem.id != currOrg.id){
                parentsOrgArrs.push(orgItem);
            }
        }
        $(sbox).on("click","a.select-org-btn",function(){
            $('#js_org_tree').toggle();
            return false;
        });
        $(sbox).on("click",function(){
            $("#js_org_tree").hide();
            return false;
        });
        $(sbox).on("click",".ztree",function(){
            return false;
        })
        $.fn.zTree.init($("#addtreedome"), setting, parentsOrgArrs);

        //保存
        $(sbox).on("click",".blue96x32",function(){
            var txtorgDom = $(sbox).find(".add-org-nametxt");
            var numDom = $(sbox).find(".add-org-numtxt");
            var orgName = $.trim(txtorgDom.val());
            var order = $.trim(numDom.val());
            var pid = $("#js_org_sel").attr("orgid");
            if(!regObj.ftest(orgName,regObj.nametext)){
                i8ui.trterror("部门名称格式不正确！",txtorgDom);
                return;
            }
            if(!regObj.ftest(order,regObj.num)){
                i8ui.trterror("只能输入数字！",numDom);
                return;
            }
            $.ajax({
                url: i8_session.ajaxHost + "webajax/setcenter/updateOrgData",
                type: "get",
                dataType: "json",
                cache: false,
                data:{jdata:{orgId:currOrg.id, parentOrgId:pid, orgName: orgName,order:order}},
                success: function (data) {
                    if (data.Result) {
                        i8ui.write("保存成功！");
                        currOrg.pId = pid;
                        currOrg.order = order;
                        currOrg.name = orgName;
                        getOrgInfo();
                        getDefault();
                        //zTree.updateNode(currOrg);
                        //getDefault();
                        sbox.close();
                    } else {
                        i8ui.error(data.Description);
                    }
                },
                error: function (e1, e2, e3) {

                }
            });
        });
    });
    //删除部门
    orgInfoDom.on("click",".yellow",function(){
        $.ajax({
            url: i8_session.ajaxHost + "webajax/setcenter/getDecendantsPersonCount",
            type: "get",
            dataType: "json",
            cache: false,
            data:{jdata:{orgID:currOrg.id,queryType:0}},
            success: function (data) {
                if (data.Result) {
                    var perNums = data.ReturnObject.Item1;
                    var partNums = data.ReturnObject.Item2;

                    if(perNums > 0 || perNums > 0){
                        var perHtml = perNums > 0 ? '<span class="red bold"> '+perNums+' </span>位员工':'';
                        var partHtml = partNums > 0 ?'<span class="red bold"> '+partNums+' </span>位兼职' : '';
                        i8ui.showbox({
                            title: "删除“"+currOrg.name+"”",
                            cont: '<div style="padding:20px;">该部门以及子部门下还有'+perHtml+' '+ partHtml +'，不能删除<div class="tright m-t20"><span class="gray94x32">取消</span></div></div>'
                        })

                    }else{
                        i8ui.confirm({title:"确定要删除部门“"+currOrg.name+"”吗？"},function(){
                            $.ajax({
                                url: i8_session.ajaxHost + "webajax/setcenter/deleteOrgById",
                                type: "post",
                                dataType: "json",
                                cache: false,
                                data:{jdata:{orgId:currOrg.id}},
                                success: function (data) {
                                    if (data.Result) {
                                        if(data.ReturnObject) {
                                            i8ui.write("删除成功！");
                                            var newCurrOrg = currOrg.getParentNode();
                                            zTree.removeNode(currOrg);
                                            orgNames[currOrg.name] = null;
                                            currOrg = newCurrOrg;
                                            showNode(currOrg);
                                            showSelectedOrg();
                                        }
                                        else {
                                            i8ui.write("删除失败！");
                                        }
                                    } else {
                                        i8ui.error(data.Description);
                                    }
                                },
                                error: function (e1, e2, e3) {

                                }
                            });
                        });
                    }
                } else {
                    i8ui.error(data.Description);
                }
            },
            error: function (e1, e2, e3) {

            }
        });
    });
    //临时禁用
    orgdivDom.on("click",".disabled-btn",function(){
        var index = $(this).attr("index");
        var item = perSons[index];
        var tpl = require('./template/banper.tpl');
        var tmp = template(tpl);
        var sbox = i8ui.showbox({
            title: "禁用员工",
            cont: tmp(item.Item1)
        });
        //确定
        $(sbox).on("click",".blue96x32",function(){
            var remark = $.trim($("#js_disabled_mark").val());
            if(remark == ""){
                $("#js_disabled_mark").focus();
                i8ui.txterror("请输入禁用原因",$("#js_disabled_mark"));
                return;
            }
            if(remark.length > 50){
                $("#js_disabled_mark").focus();
                i8ui.txterror("禁用原因不能超过50个字！",$("#js_disabled_mark"));
                return;
            }
            $.ajax({
                url: i8_session.ajaxHost + "webajax/setcenter/updateStatus",
                type: "get",
                dataType: "json",
                cache: false,
                data:{jdata:{passportID:item.Item1.PassportID, status:2, remark:remark}},
                success: function (data) {
                    if (data.Result) {
                        i8ui.write("禁用成功！");
                        sbox.close();
                        getOrgPersonInfo(1);
                    } else {
                        i8ui.error(data.Description);
                    }
                },
                error: function (e1, e2, e3) {

                }
            });
        });

    });
    //设置负责人
    orgMangerDom.on("click",".set-manager,.blue",function(){
        var tpl = require('./template/setorgManager.tpl');
        var tmp = template(tpl);
        var rtObj = null;
        var sbox = i8ui.showbox({
            title: "设置“"+currOrg.name+"”的负责人",
            cont: tmp({})
        });
        var partSelctDom = $("#js_set_mgpart");
        getOrgAllParts(function(data){
            if(data.Result){
                var itemArrs = data.List;
                if(!itemArrs || itemArrs.length <= 0){
                    $("#js_setmg_part_div").html('<div class="tcenter">该部门没有任何兼职角色</div>');
                }else{
                    var optionhtml = '';
                    for(var i=0; i<itemArrs.length; i++){
                        optionhtml+='<option value="'+itemArrs[i].PartTime.ID+'">'+ itemArrs[i].PartTime.Name+'&nbsp;('+itemArrs[i].UserName+')</option>'
                    }
                    partSelctDom.html(optionhtml);
                    partSelctDom.setSelect({style:"width:325px;line-height:32px; height:32px;"});
                }
            }
        });
        var ksn_owner = i8selector.KSNSelector({
            model: 1,
            width: 320,
            element: "#js_set_mgtxt",
            isAbox: true,
            searchType: { "org": false, "user": true, "grp": false },
            selectCallback: function(uid){
                $.ajax({
                    url: i8_session.ajaxHost + "webajax/setcenter/getOrgManagersByPID",
                    type: "get",
                    dataType: "json",
                    cache: false,
                    data:{jdata:{passportID:uid, orgID:currOrg.id}},
                    success: function (data) {
                        console.log(data);
                        if (data.Result) {
                            rtObj = data.ReturnObject;
                            var tpsDom = $("#js_set_mgtps");
                            if(rtObj.Item2.OrgID != currOrg.id ){
                                var partName = (rtObj.Item3? rtObj.Item3.Name : '');
                                if(!partName || partName == "null"){
                                    partName  = "";
                                }
                                var tpsDomHtml = '<p class="">'+rtObj.Item2.Name+'当前归属在【'+rtObj.Item2.OrgName+'】，您可以选择：</p>'+
                                    '<div class="m-l20">'+
                                    (rtObj.Item4?'':'<label class="set-mg-label"><input id="js_set_mg_cktype1" checked name="set-manager-type" type="radio"/>从<span>【'+rtObj.Item2.OrgName+'】</span>移入到当前部门</label>')+
                                    '<label class="set-mg-label m-b5">'+
                                    '<input name="set-manager-type" '+(rtObj.Item4?'checked':'')+' type="radio"/>仍归属在<span>【'+rtObj.Item2.OrgName+'】</span>，设置兼职属性：'+
                                    '</label>'+
                                    '<p class="fz12 l-h20 m-l20">兼职名称：<input id="js_part_txt_name" style="height: 25px; width:110px; padding: 0px 5px;" value="'+ partName +'" type="text" /></p>'+
                                    '<p class="fz12 l-h20 m-l20 m-t15">所在职级：<select id="classLineSelect" style="height: 25px; width:120px;">'+$(template('classLine',classLineObj)).html()+'</select></p>'+
                                    '</div>';
                                tpsDom.html(tpsDomHtml).show();
                                $('#classLineSelect').setSelect();
                                sbox.againShow();
                            }else{
                                tpsDom.hide();
                            }
                        } else {
                            i8ui.error(data.Description);
                        }
                    },
                    error: function (e1, e2, e3) {

                    }
                });
            },
            deleteCallback: function(){
                $("#js_set_mgtps").hide();
            }
        });
        //设置类型切换
        $(sbox).on("click","input[name='set-mgtype']",function(){
            var contID = $(this).val();
            $(sbox).find(".set-type-cont").hide();
            $("#"+contID).show();
            sbox.againShow();
        });
        //保存
        $(sbox).on("click",".blue96x32",function(){
            var ckbol = $('#js_set_mg_ck1').attr('checked');
            var leaderType = 1;
            var managerID = ksn_owner.selectedData();
            var isOhterOrg = $("#js_set_mgtps").css("display");
            var moveOther =  $('#js_set_mg_cktype1').attr('checked')

            if(!ckbol){//选择已有兼职角色
                managerID = $("#js_set_mgpart").getValue();
                leaderType = 2;
                var jdata = {
                    orgID: currOrg.id,
                    leaderType: leaderType,
                    managerID: managerID
                };
                setManager(jdata,function(){
                    i8ui.write("保存成功！");
                    getManagerinfo();
                    sbox.close();
                });
            }else{
                //选择的用户属于其它部门
                if(isOhterOrg != "none"){
                    //如果选择创建兼职
                    if(!moveOther){
                        leaderType = 2;
                        var partName = $.trim($("#js_part_txt_name").val());
                        if(!regObj.ftest(partName,regObj.username)){
                            i8ui.trterror("名称不合法！",$("#js_part_txt_name"));
                            return;
                        }
                        var entitydata = {
                            partName: partName,
                            orgId: currOrg.id,
                            orgName: currOrg.name,
                            passportID: rtObj.Item2.PassportID,
                            updateIfExist: false,
                            ClassID: $('#classLineSelect').getValue()
                        }
                        //如果兼职名称跟原保持不变
                        if(rtObj.Item3 && partName == rtObj.Item3.Name){
                            entitydata.updateIfExist = true;
                        }
                        addPartTime(entitydata,function(data){
                            var jdata = {
                                orgID: currOrg.id,
                                leaderType: leaderType,
                                managerID: data.ID
                            };
                            setManager(jdata,function(){
                                i8ui.write("保存成功！");
                                getManagerinfo();
                                sbox.close();
                            });
                        })
                    }else{
                        var jdata = {
                            orgID: currOrg.id,
                            leaderType: leaderType,
                            managerID: managerID
                        };
                        setManager(jdata,function() {
                            i8ui.write("保存成功！");
                            getManagerinfo();
                            sbox.close();
                        });
                    }
                }else{
                    var jdata = {
                        orgID: currOrg.id,
                        leaderType: leaderType,
                        managerID: managerID
                    };
                    setManager(jdata,function() {
                        i8ui.write("保存成功！");
                        getManagerinfo();
                        sbox.close();
                    });
                }
            }


        });
    });
    //撤销负责人
    orgMangerDom.on("click",".yellow",function(){
        i8ui.confirm({title:"确定要撤销该部门负责人吗？"},function(){
            $.ajax({
                url: i8_session.ajaxHost + "webajax/setcenter/removeOrgManager",
                type: "post",
                dataType: "json",
                cache: false,
                data:{jdata:{orgID:currOrg.id}},
                success: function (data) {
                    if (data.Result) {
                        i8ui.write("撤销成功！");
                        getManagerinfo();
                    } else {
                        i8ui.error(data.Description);
                    }
                },
                error: function (e1, e2, e3) {

                }
            });
        });
    })
    //新增兼职
    orgPartsDom.on("click",".add-parttime",function(){
        var tpl = require('./template/saveParttime.tpl');
        var tmp = template(tpl);
        var sbox = i8ui.showbox({
            title: "新增兼职",
            cont: tmp(currOrg)
        });
        $('#classLineSelectPanel').html(template('classLine',classLineObj));
        $('#classLineSelect').setSelect();
        var ksn_owner = i8selector.KSNSelector({
            model: 1,
            width: 156,
            element: "#js_add_part_txt",
            isAbox: true,
            searchType: { "org": false, "user": true, "grp": false }
        });
        //保存
        $(sbox).on("click",".blue96x32",function(){
            var partNameDom = $(sbox).find("input.add-part-name");
            var partName = $.trim(partNameDom.val());
            if(!regObj.ftest(partName,regObj.username)){
                i8ui.trterror("兼职名称不合法！",partNameDom);
                return;
            }
            var uid = ksn_owner.selectedData();
            if(!uid || uid == ""){
                i8ui.trterror("请输入人员！",$("#js_add_part_txt").parent());
                return;
            }
            var entitydata = {
                partName: partName,
                orgId: currOrg.id,
                orgName: currOrg.name,
                passportID: uid,
                updateIfExist: false,
                ClassID:$('#classLineSelect').getValue()
            }
            addPartTime(entitydata,function(data){
                i8ui.write("新增成功！");
                sbox.close();
                getOrgParts(1);
            })
        });
    });
    //编辑兼职
    orgPartsDom.on("click",".org-per-edit",function(){
        var index = $(this).attr("index");
        var item = partTimes[index];
        var tpl = require('./template/saveParttime.tpl');
        var tmp = template(tpl);
        var sbox = i8ui.showbox({
            title: "编辑兼职“"+currOrg.name+"”",
            cont: tmp({name: currOrg.name,partName: item.PartTime.Name})
        });
        $('#classLineSelectPanel').html(template('classLine',classLineObj));
        $('#classLineSelect').setSelect();
        $('#classLineSelect').setValue(item.PartTime.ClassID);
        var ksn_owner = i8selector.KSNSelector({
            model: 1,
            width: 156,
            element: "#js_add_part_txt",
            isAbox: true,
            searchType: { "org": false, "user": true, "grp": false }
        });
        ksn_owner.setAllselectedData([{type:"user",id:item.PartTime.PassportID}]);//初始化选人控件的值
        //保存
        $(sbox).on("click",".blue96x32",function(){
            var partNameDom = $(sbox).find("input.add-part-name");
            var partName = $.trim(partNameDom.val());
            if(!regObj.ftest(partName,regObj.username)){
                i8ui.trterror("兼职名称不合法！",partNameDom);
                return;
            }
            var uid = ksn_owner.selectedData();
            if(!uid || uid == ""){
                i8ui.trterror("请输入人员！",$("#js_add_part_txt").parent());
                return;
            }
            var entitydata = {
                partName: partName,
                orgId: currOrg.id,
                orgName: currOrg.name,
                passportID: uid,
                id: item.PartTime.ID,
                ClassID:$('#classLineSelect').getValue()
            }
            $.ajax({
                url: i8_session.ajaxHost + "webajax/setcenter/updatePartTime",
                type: "get",
                dataType: "json",
                cache: false,
                data:{jdata:entitydata},
                success: function (data) {
                    if (data.Result) {
                        i8ui.write("保存成功！");
                        sbox.close();
                        getOrgParts(1);
                    } else {
                        i8ui.error(data.Description);
                    }
                },
                error: function (e1, e2, e3) {
                }
            });
        });
    });
    //删除兼职
    orgPartsDom.on("click",".org-per-other",function(){
        var $this = $(this);
        var index = $this.attr("index");
        var item = partTimes[index];


        var checkWithDelPartTime=function(callback){
            $.ajax({
                url: i8_session.ajaxHost + "webajax/setcenter/checkWithDelPartTime",
                type: "get",
                dataType: "json",
                cache: false,
                data:{jdata:{partTimeID:item.PartTime.ID}},
                success: function (data) {
                    if (data.Result) {
                        if(data.ReturnObject&&!data.ReturnObject.Item1){
                            var relation={
                                SubUserIDs:[],
                                SubPartTimeIDs:[],
                                Names:[],
                                PartTimeID:item.PartTime.ID,
                                PartTimeName:item.PartTime.Name
                            }
                            _.each(data.ReturnObject.Item2,function(item){
                                relation.Names.push(item.MemberName);
                                if(item.MemberType==1){
                                    relation.SubUserIDs.push(item.MemberID);
                                }else{
                                    relation.SubPartTimeIDs.push(item.MemberID);
                                }
                            })
                            alertReportRelation(relation)
                        }else{
                            isCanDelelePartTime();
                        }
                    } else {
                        i8ui.error(data.Description);
                    }
                },
                error: function (e1, e2, e3) {
                    i8ui.error('请求超时，请重试!')
                }
            });
        }

        //提示有汇报关系不能删除
        var alertReportRelation=function(relation,callback) {
            i8ui.error('抱歉，目前有<span class="red bold"> ' + relation.Names.length + '</span>人（' + relation.Names.join('，') + ')向该角色汇报，无法删除!');
        }

        var deleteReportRelation=function(relation,callback){
            i8ui.error('抱歉，目前有<span class="red bold"> '+relation.Names.length+'</span>人（'+relation.Names.join('，')+')向该角色汇报，无法删除!');
            /*var  deletepop='<div class="report-delete-box"><div class="app-templete-line">抱歉，目前有<span class="red bold"> {Names.length} </span>人（{Names.join(\'\')})向该角色汇报，无法删除!</div><span class="dielog-footer-btns p-b10 p-t10">\
                <a class="dielog-cancel gray96x32 btn-unactive form-cancel">取消</a>\
            </span></div>';
            var showbox=i8ui.showbox({
                title:'删除“'+relation.PartTimeName+'”的汇报下级',
                cont:template(deletepop)(relation)
            });
            var $showbox=$(showbox);
            $showbox.on('click','.dielog-cancel',function(){
                showbox.close();
            });*/

            /*
            var i8personpart=require('default/javascripts/common/fw_i8personpart.js');
            var deletehtml=require('./template/deletepart-pop.tpl')
            var showbox=i8ui.showbox({
                title:'删除“'+item.PartTime.UserName+'”的汇报下级',
                cont:template(deletehtml)(relation)
            });
            var $showbox=$(showbox);
            var i8personpartinit=i8personpart.init({
                id:'choosereportPerson',
                elem:$showbox.find('.personpart')
            });
            $showbox.on('click','.app-checkbox',function(){
                $(this).toggleClass('checked');
            });

            $showbox.on('click','.dielog-cancel',function(){
                showbox.close();
            });

            $showbox.on('click','.dielog-ok',function(){
                var leader=i8personpartinit.getSelect();
                if(!leader.leaderID){
                    i8ui.error('请选择汇报上级!');
                    return;
                }
                if(leader.leaderID==relation.PartTimeID){
                    i8ui.error('新汇报上级和原汇报上级为重名，请选择其他人员或兼职角色!');
                    return;
                }
                var options={
                    leaderID:leader.leaderID,
                    leaderType:leader.leaderType,/// 没有负责人,0 /// 非兼职,1/// 兼职,2
                    userIDs:relation.SubUserIDs||[] ,
                    partTimeIDs:relation.SubPartTimeIDs||[],
                    isSynchOrg:$('#isSync').hasClass('checked')
                }
                saveMembersLeader(options,function(){
                    i8ui.write('修改成功！');
                    showbox.close();
                    callback&&callback();
                })
            });*/
        }

        var saveMembersLeader=function(jdata,callback){
            $.ajax({
                url: i8_session.ajaxHost + 'webajax/setcenter/saveMembersLeader',
                type: 'get',
                dataType: 'json',
                data:{jdata:jdata},
                cache:false,
                success: function (data) {
                    if(data.Result){
                        callback&&callback(data);
                    }else{
                        i8ui.error(data.Description);
                    }

                }, error: function (e1, e2, e3) {
                    i8ui.error('请求超时，请检查网络！');
                }
            });
        }

        var isCanDelelePartTime=function(){
            i8ui.confirm({title:"确定要删除兼职“"+item.PartTime.Name+"”吗？"},function(){
                $.ajax({
                    url: i8_session.ajaxHost + "webajax/setcenter/delelePartTime",
                    type: "post",
                    dataType: "json",
                    cache: false,
                    data:{jdata:{id:item.PartTime.ID}},
                    success: function (data) {
                        if (data.Result) {
                            i8ui.write("删除成功！");
                            getOrgParts(1);
                        } else {
                            i8ui.error(data.Description);
                        }
                    },
                    error: function (e1, e2, e3) {

                    }
                });
            });
            /*

            $.ajax({
                url: i8_session.ajaxHost + "webajax/setcenter/isCanDelelePartTime",
                type: "get",
                dataType: "json",
                cache: false,
                data:{jdata:{id:item.PartTime.ID}},
                success: function (data) {
                    if (data.Result) {
                        if(!data.ReturnObject){
                            i8ui.error('该兼职是部门负责人，不能删除');
                        }else{
                            i8ui.confirm({title:"确定要删除兼职“"+item.PartTime.Name+"”吗？"},function(){
                                $.ajax({
                                    url: i8_session.ajaxHost + "webajax/setcenter/delelePartTime",
                                    type: "post",
                                    dataType: "json",
                                    cache: false,
                                    data:{jdata:{id:item.PartTime.ID}},
                                    success: function (data) {
                                        if (data.Result) {
                                            i8ui.write("删除成功！");
                                            getOrgParts(1);
                                        } else {
                                            i8ui.error(data.Description);
                                        }
                                    },
                                    error: function (e1, e2, e3) {

                                    }
                                });
                            });
                        }
                    } else {
                        i8ui.error(data.Description);
                    }
                },
                error: function (e1, e2, e3) {

                }
            });*/
        }
        checkWithDelPartTime();

    });
    //查询事件
    orgdivDom.on("click",".person-search",function(){
        getOrgPersonInfo(1);
    })
    //回车查询
    $("#js_person_shtxt").keyup(function(e){
        var e = e || window.event
        if(e && e.keyCode == 13){
            getOrgPersonInfo(1);
        }
    });

    //搜索汇报关系按钮 查询事件
   /* $('#btnSearchRelation').on('click',function(){
        getRelation();
    });
    //复选框注册
    orgRelation.find('table').on('click','.app-checkbox',function(){
        var checkbox=$(this).toggleClass('checked');
        if(checkbox.hasClass('check-all')){
            checkbox.hasClass('checked')?
                orgRelation.find('table').find('.app-checkbox').addClass('checked'):
                orgRelation.find('table').find('.app-checkbox').removeClass('checked');
        }else{
            var checkall=orgRelation.find('table').find('.check-all');
            var len=orgRelation.find('tbody').find('.app-checkbox:not(.checked)').length;
            len==0?checkall.addClass('checked'):checkall.removeClass('checked');
        }
    });*/
    getDefault(function(){
        showSelectedOrg();
    });
    getClassLine();
    //新增兼职
    function addPartTime(jdata,cbk){
        $.ajax({
            url: i8_session.ajaxHost + "webajax/setcenter/addPartTime",
            type: "get",
            dataType: "json",
            cache: false,
            data:{jdata:jdata},
            success: function (data) {
                if (data.Result) {
                    cbk(data.ReturnObject)
                } else {
                    i8ui.error(data.Description);
                }
            },
            error: function (e1, e2, e3) {
            }
        });
    }
    //设置负责人
    function setManager(jdata,cbk){
        if(!jdata.managerID || jdata.managerID == ""){
            i8ui.error("负责人不能为空！");
            return;
        }
        $.ajax({
            url: i8_session.ajaxHost + "webajax/setcenter/setOrgManager",
            type: "post",
            dataType: "json",
            cache: false,
            data:{jdata:jdata},
            success: function (data) {
                console.log(data);
                if (data.Result) {
                    cbk(data)
                } else {
                    i8ui.error(data.Description);
                }
            },
            error: function (e1, e2, e3) {

            }
        });
    }
    //排序
    function orderBy(arrs){
        arrs = arrs || [];
        for(var i=0; i<arrs.length; i++){
            for(var j= i+1; j<arrs.length; j++){
                if(arrs[i].Score < arrs[j].Score){
                    var item = arrs[j];
                    arrs[j] = arrs[i];
                    arrs[i] = item;
                }
            }
        }
        return arrs;
    }
    function getClassLine(){
        $.ajax({
            url: i8_session.ajaxHost + "webajax/setcenter/getClassLine",
            type: "get",
            dataType: "json",
            cache: false,
            success: function (data) {
                data.ReturnObject = orderBy(data.ReturnObject);
                classLineObj=data;
            },
            error: function (e1, e2, e3) {
                classLineObj={Result:false,Description:'请求超时，请检查网络'};
            }
        });
    }

    //获取汇报关系
     /*  function getRelation(pageIndex){
        var tbody=orgRelation.find('tbody').html(template('relationtemp',{loading:true}));

        $.ajax({
            url: i8_session.ajaxHost + "webajax/setcenter/getRelationShip",
            type: "get",
            dataType: "json",
            cache: false,
            data:{jdata:{pageIndex:pageIndex||1,pageSize:10,orgID:'',userIDs:[]},funName:'getRelationShip'},
            success: function (data) {
                if(data.Result){
                    tbody.html(template('relationtemp',data));
                }else{
                    tbody.html(template('relationtemp',{error:data.Description}));
                }

            },
            error: function (e1, e2, e3) {
                tbody.html(template('relationtemp',{error:'请求超时，请检查网络！'}));
            }
        });
    }

    //设置汇报关系
    function setUsersLeader(jdata){

        var tbody=orgRelation.find('tbody').html(template('relationtemp',{loading:true}));
        $.ajax({
            url: i8_session.ajaxHost + "webajax/setcenter/setUsersLeader",
            type: "get",
            dataType: "json",
            cache: false,
            data:{jdata:jdata,funName:'getRelationShip'},
            success: function (data) {
                if(data.Result){
                    //tbody.html(template('relationtemp',data));
                }else{
                    //tbody.html(template('relationtemp',{error:data.Description}));
                }

            },
            error: function (e1, e2, e3) {
                //tbody.html(template('relationtemp',{error:'请求超时，请检查网络！'}));
            }
        });
    }*/
});
