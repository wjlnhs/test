define(function(require){
    var i8ui = require('../common/i8ui.js');
    var fw = require('../cement/public.js');
    var fw_page=require('../common/fw_pagination.js');
    $(function(){
        //加载分类
        fw.getTypeList(function(typeList){
            var strhtml = '';
            for(var i = 0; i< typeList.length; i++){
                strhtml += '<option value="'+ typeList[i].ID +'">'+ typeList[i].CategoryName +'</option>'
            }
            strhtml = '<option value="00000000-0000-0000-0000-000000000000">全部</option>' + strhtml;
            $("#js_type_sel").html(strhtml);
            $("#js_type_sel").setSelect({
                cbk:function(){
                    getMgList(1);
                },
                style:"background: #fff; height: 28px; line-height: 28px; width: 100px;"});
        });
        //状态分类
        $("#js_status_sel").setSelect({
            cbk:function(){
                getMgList(1);
            },
            style: "background: #fff; height: 28px; line-height: 28px; width:100px; vertical-align: top;"
        });
        $("span.app-placard-shbtn").click(function(){
            getMgList(1);
        });
        $("#js_manager_tbody").on("click","a.del-cement",function(){
            var id = this.id;
            i8ui.confirm({title:"确定要删除吗？"},function(){
                deleCement(id);
            })
        });
        //置顶
        $("#js_manager_tbody").on("click","a.do-top",function(){
            var id = $(this).attr("cid");
            setTop(id);
        });
        getMgList(1);
    });

    function getStatus(status){
        if(status == 1){
            return '<span class="clgreen">已发布</span>';
        }else{
            return '<span class="clred">待发布</span>';
        }
    }
    //加载公告列表
    function getMgList(pageIndex){
        if(pageIndex == null){
            pageIndex = 1;
        }
        var json = {isManage: true, pagesize: fw.pagesize, pageindex: pageIndex};
        json.categoryID = $("#js_type_sel").getValue();
        json.status = $("#js_status_sel").getValue();
        json.key = $.trim($("#jd_search_shtxt").val());
        if(!json.categoryID){
            json.categoryID = '00000000-0000-0000-0000-000000000000';
        }
        $("#js_manager_tbody").html('<tr><td colspan="9" class="tcenter"><div class="ld-64-write"></div></td></tr>');
        fw.getCementList(json,function(data){
            var tbhtml = '';
            var itemS = data.Item1;
            for(var i=0; i< itemS.length; i++){
                var _item = itemS[i];
                tbhtml +=   '<tr><td><span href="cement/detial?id='+ _item.ID +'" class="cement-td-name">'+ _item.Title +'</span></td>'+
                    '<td>'+ _item.CreateTime +'</td>'+
                    '<td>'+ _item.SendTime +'</td>'+
                    '<td>'+ getPublist(_item.OrgLimitDict,_item.UserLimitDict) +'</td>'+
                    '<td>'+ _item.CreatorName +'</td>'+
                    '<td>'+ _item.Attachment.length +'</td>'+
                    '<td>'+ _item.CategoryName +'</td>'+
                    '<td>'+ getStatus(_item.Status) +'</td>'+
                    '<td>'+ isShowEditbtn(_item.Status, _item.ID) +'<a class="del-cement" id="'+ _item.ID +'"><i class="spbg1 sprite-70"></i>删除</a>'+ isTop(_item.IsTop, _item.ID) +'</td></tr>';
            }
            if(tbhtml == ""){
                tbhtml = '<tr><td colspan="9" class="tcenter fz14-weight cl999" valign="middle"><div class="noresult"><div class="no-resulticon noresult-icon"></div><div class="noresult-title">暂无发布内容!</div></div></td></tr>';
            }
            if(data.Item2 > 0){
                $("#js_cement_page_panl").show();
            }else{
                $("#js_cement_page_panl").hide();
            }
            //控制分页
            fw_page.pagination({
                ctr: $("#js_cement_page_panl"),
                totalPageCount: data.Item2,
                pageSize: fw.pagesize,
                current: pageIndex,
                fun: function (new_current_page, containers) {
                    getMgList(new_current_page);
                }, jump: {
                    text: '跳转'
                }
            });
            $("#js_manager_tbody").html(tbhtml);
        });
    }
    function isShowEditbtn(num,id){
        if(num == 1){
            return '';
        }else{
            return '<a href="cement/edit?id='+ id +'" class="m-r10"><i class="spbg1 sprite-69"></i>编辑</a><a target="_blank" href="cement/detial?id='+ id +'" class="m-r10">预览</a>';
        }
    }
    function isTop(bol,id){
        if(bol){
            return '<span class="clgreen m-l10">已置顶</span>'
        }else{
            return '<a cid="'+ id +'" class="do-top m-l10">置顶</a>';
        }
    }
    //获取发布范围字符串
    function getPublist(arr1,arr2){
        var names = [];
        for(var key in arr1){
            names.push(arr1[key]);
        }
        for(var key in arr2){
            names.push(arr2[key]);
        }
        return names.join("、") || "所有人可见";
    }
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
    //置顶
    function setTop(id){
        $.ajax({
            url: i8_session.ajaxHost+'webajax/cement/settop',
            type: 'get',
            dataType: 'json',
            data: {cid: id},
            cache: false,
            success: function(result){
                if(result.Result){
                    i8ui.write('置顶成功！');
                    getMgList(1);
                }else{
                    i8ui.error(result.Description);
                }
            },
            error: function(e1,e2,e3){
                i8ui.error("请求失败");
            }
        });
    }
    $("#js_cement_head_ct").html('<span class="app-placard-icon lt m-r15"></span><p class="b fz18 m-t10 heit">企业墙管理</p>');
});