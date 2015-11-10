define(function (require, exports) {
    var i8ui=require('../../javascripts/common/i8ui');
    var fw_page=require('../common/fw_pagination.js');
    var pageIndex=1;
    var pageSize=8;
    var rolesCn='';
    $('.add-contract').on('click',function(){
        i8ui.showbox({
            title:"如何添加公共通讯录？",
            cont:'<div id="dielog_add_contract"></div>',
            noMask:false
        })
    })
    //处理各种管理员
    var rolesFormat = function(roles,appadmin,rolesCn) {
        var userstyle = "";
        var userstyle2="";
        if(_.indexOf(roles,4)!=-1){
            userstyle += "超管 ";
        }
        if(_.indexOf(roles,20)!=-1){
            userstyle += "基础设置 ";
        }
        if(_.indexOf(roles,30)!=-1){
            userstyle += "社区 ";
        }
        if(_.indexOf(roles,40)!=-1){
            userstyle += "流程管理 ";
        }

        for(var i=0;i<appadmin.length;i++){
            if(rolesCn[appadmin[i]]){
                userstyle2+= rolesCn[appadmin[i]]+' '
            }
        }
        return (userstyle+userstyle2);
    };
    template.helper('$rolesFormat',rolesFormat)
    var renderAdmin=function(data,rolesCn){
        console.log(data);
        console.log(rolesCn);
        var publicMail_tpl=require('../../template/ucenter/publicMailList.tpl');
        var publicMail_render=template(publicMail_tpl);
        data.rolesCn=rolesCn;
        var publicMail_html=publicMail_render(data);
        $('#admin_box tbody').html(publicMail_html);
        //控制分页
        if(data.ReturnObject.Total<=10){
            $("#js_cement_page_panl").html("");
        }
        fw_page.pagination({
            ctr: $("#js_cement_page_panl"),
            totalPageCount: data.Total,
            pageSize: pageSize,
            current: pageIndex,
            fun: function (new_current_page,containers) {
                pageIndex=new_current_page;
                //common.page.render_doc_center(panl)
                getAdminNew(pageIndex)
                //SearchPerson(keyword,new_current_page,orgID,isOnlyContract);
            }, jump: {
                text: '跳转'
            }
        });
        $('.public-cont').show();
    }
    function getAdminNew(pageIndex){
        if(!rolesCn){
            $.post(i8_session.ajaxHost+'webajax/modules/getmutippsvalue',{keys:decodeURIComponent(i8_session.apps)},function(data){
                rolesCn=data.ReturnObject;
                if(rolesCn && rolesCn.length>0){
                    var rolesJson={};
                    for(var i=0;i<rolesCn.length;i++){
                        rolesJson[rolesCn[i]['Key']]=rolesCn[i]['Name']
                    }
                    rolesCn=rolesJson;
                }
                $.post(i8_session.ajaxHost+"webajax/settings/GetAdminNew?" + Math.random(),{pageIndex:pageIndex,pageSize:pageSize},function(data){
                    renderAdmin(data,rolesCn)
                })
            })
        }else{
            $.post(i8_session.ajaxHost+"webajax/settings/GetAdminNew?" + Math.random(),{pageIndex:pageIndex,pageSize:pageSize},function(data){
                renderAdmin(data,rolesCn)
            })
        }
    }
    getAdminNew();


})