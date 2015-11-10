define(function (require, exports, modules) {
    var i8ui = require('../common/i8ui');
    var common = require('./common.js');
    var selector = require('../plugins/i8selector/fw_selector.js');
    var $cont=$('.doc-set-cont');
    //渲染静态设置权限
    function renderReadOnlyNode(treeNode){
        console.log(treeNode)
        if(treeNode.Deepth==0){
            $('#admin_delete_folder').hide();
            $('#admin_edit_folder').hide();
        }else{
            $('#admin_delete_folder').show();
            $('#admin_edit_folder').show();
        }
        var parentScopes=treeNode.Scopes;
        var doc_set_readonly_tpl=require('../../template/document/doc-set-readonly.tpl');
        var doc_set_readonly_render=template(doc_set_readonly_tpl);
        var doc_set_readonly_html=doc_set_readonly_render(treeNode);
        $('.doc-set-cont-right').html(doc_set_readonly_html);

        var parentPowerArr=treeNode.parentPowerArr=_.filter(parentScopes,function(parentScopes){
            return parentScopes.Pmt!=4 && parentScopes.PmtStatus==0;
        });
        var otherPowerArr=treeNode.otherPowerArr=_.filter(parentScopes,function(parentScopes){
            return parentScopes.Pmt!=4 && parentScopes.PmtStatus==2;
        });
        var adminStr='';
        var parentPowerStr='';
        var otherPowerStr='';
        var ParentAdminWidthDocAdmin=$.extend(true, {}, treeNode.ParentAdmin,treeNode.DocTreeAdmin || {});
        ParentAdminWidthDocAdmin=_.omit(ParentAdminWidthDocAdmin, _.keys(treeNode.ParentAdmin));
        for(var i in ParentAdminWidthDocAdmin){
            adminStr+=ParentAdminWidthDocAdmin[i]+' '
        }
        for(var i in treeNode.ParentAdmin){
            adminStr+=treeNode.ParentAdmin[i]+' '
        }

        for(var i=0;i<parentPowerArr.length;i++){
            if($.isEmptyObject(parentPowerArr[i].ScopeEntitys)){
                continue;
            }
            parentPowerStr+='<li>';
            var viewScopeEntitys=parentPowerArr[i].ViewScopeEntitys;
            for (var j=0;j<viewScopeEntitys.length;j++){
                var _type=common.tool.transTypeCn(viewScopeEntitys[j].EntityType);
                parentPowerStr+=_type+viewScopeEntitys[j].EntityName+' ';
            }
            var power='只读';
            if(parentPowerArr[i].Pmt==2){
                power='上传';
            }
            parentPowerStr+='<span class="blue m-l20">'+power+'</span></li>'
        }
        for(var i=0;i<otherPowerArr.length;i++){
            if($.isEmptyObject(otherPowerArr[i].ScopeEntitys)){
                continue;
            }
            otherPowerStr+='<li>';
            var viewScopeEntitys=otherPowerArr[i].ViewScopeEntitys;
            for (var j=0;j<viewScopeEntitys.length;j++){
                var _type=common.tool.transTypeCn(viewScopeEntitys[j].EntityType);
                otherPowerStr+=_type+viewScopeEntitys[j].EntityName+' ';
            }
            var power='只读';
            if(otherPowerArr[i].Pmt==2){
                power='上传';
            }
            otherPowerStr+='<span class="blue m-l20">'+power+'</span></li>'
        }
        $('.admin-folder-cont .folder_admin_box').html(adminStr || '无');
        $('.admin-folder-cont .parent-scope-box ul').html(parentPowerStr || '无');
        $('.admin-folder-cont .user-power').html(otherPowerStr || '无');
        /*if(treeNode.Deepth==0){
         $('.admin-folder-cont .folder_admin_box').html('知识库管理员');
         }*/
    }
    //左边树
    $('.document-set').on('click',function(){
        $('.doc-set-cont').show();
        $('.quick-link-cont').hide();
        if($.trim($('#admin_tree').html())){
            return;
        }
        common.page.renderDocSetTree(function(event, treeId, treeNode){
            renderReadOnlyNode(treeNode)
        })
    });

    $('#admin_new_folder').on('click',function(){
        var admin_new_folder=common.page.setDielog('newFolder','新建文件夹');
        //新建文件夹设置提交
        common.tool.set_dielog_cbk(admin_new_folder,function(){
            var Scopes=common.tool.getScopes(admin_new_folder,true);//true表示新建
            var treeNode=$(admin_new_folder).data();
            if(!Scopes){
                return;
            }
            var _name= $.trim($(admin_new_folder).find('.foldername').val());
            var _ParentID=$(admin_new_folder).find('.save_position').attr('docid');
            if(!_ParentID){
                i8ui.error('上级文件夹不能为空!');
                return;
            }
            if(!_name){
                i8ui.error('文件夹名字不能为空!');
                return;
            }
            var docTree={
                Scopes:Scopes,
                Type:0,
                Name:_name,
                ParentID:_ParentID
            }
            common.ajax.onlySaveDocTree({
                docTree:docTree
            },function(data){
                //common.page.render_doc_center(panl);
                admin_new_folder.close();
                i8ui.write('新建成功!');
                console.log(data);
                var newNode=data.ReturnObject;
                var pid=data.ReturnObject.ParentID;
                try{
                    var _treeNode=admin_ztree.getNodeByParam('DocTreeID', pid, null);
                    newNode= common.tool.resetTreeData([newNode]);
                    if(_treeNode){
                        admin_ztree.addNodes(_treeNode,newNode);
                    }
                }
                catch (e){}
                //admin_ztree.refresh();
            });

        });
    })

    //编辑按钮
    $('#admin_edit_folder').on('click',function(){
        //文件夹储存位置按钮
        if(!admin_ztree){
            admin_ztree=$.fn.zTree.getZTreeObj("admin_tree");
        }
        var tree_treeNode=admin_ztree.getSelectedNodes();
        if(tree_treeNode.length==0){
            i8ui.error('请选择一个文件夹！');
            return false;
        }
        //新建窗口
        var _admin_edit_folder=common.page.showSetDielog('编辑文件夹');
        //加载文件夹信息
        common.ajax.getDocTree({docTreeID:tree_treeNode[0].DocTreeID},function(data){
            var treeNode=data.ReturnObject.DocTree;
            var admin_edit_folder=common.page.setDielog('editFolder','编辑文件夹',treeNode,_admin_edit_folder);
            var $dielog=$(admin_edit_folder);
            $(admin_edit_folder).find('.save_position').attr('cu_id',treeNode.DocTreeID);
            //修改文件夹提交
            common.tool.set_dielog_cbk(admin_edit_folder,function(){
                var Scopes=common.tool.getScopes(admin_edit_folder);
                //var treeNode=$(admin_edit_folder).data();
                if(!Scopes){
                    return;
                }
                var _name= $.trim($(admin_edit_folder).find('.foldername').val());
                var _ParentID=$(admin_edit_folder).find('.save_position').attr('docid');
                //var _ParentID=$(admin_edit_folder).find('.save_position').attr('treeid');
                var _cu_id=$(admin_edit_folder).find('.save_position').attr('cu_id');
                $(admin_edit_folder).find('.save_position').attr('treeid',treeNode.DocTreeID);
                if(!_name){
                    i8ui.error('文件夹名字不能为空!');
                    return;
                }
                //禁止重复提交
                var $confirm= $dielog.find('.confirm');
                if(common.tool.setUnableConfirm($confirm)!=undefined){
                    return false;
                }
                var docTree={
                    Scopes:Scopes,
                    Type:0,
                    Name:_name,
                    ParentID:_ParentID
                }
                var _docTree= $.extend(treeNode,docTree);
                common.ajax.onlySaveDocTree({
                    docTree:_docTree
                },function(data){
                    //if()
                    console.log(data)
                    //var newNode= data.ReturnObject;
                   // newNode= common.tool.resetTreeData([newNode]);
                    //newNode= $.extend(tree_treeNode[0],newNode[0],true);
                    //console.log(newNode)
                    //admin_ztree.updateNode(newNode);
                    //admin_ztree.reAsyncChildNodes(tree_treeNode[0], "refresh");
                    //zAsync
                    var nodes = admin_ztree.getSelectedNodes();
                    if (nodes.length>0) {
                        var parentNode=nodes[0].getParentNode();
                        if(parentNode){
                            if(nodes[0].ParentID!=_ParentID){
                                admin_ztree.removeNode(nodes[0]);
                                parentNode=admin_ztree.getNodeByParam('DocTreeID',_ParentID);
                            }
                            admin_ztree.reAsyncChildNodes(parentNode, "refresh");
                        }
                    }
                   // common.page.render_doc_center(panl);
                    admin_edit_folder.close();
                    i8ui.write('修改成功!');
                    renderReadOnlyNode(data.ReturnObject)
                });
            });
        })

    })
    //删除按钮
    $('#admin_delete_folder').on('click',function(){
        //文件夹储存位置按钮
        if(!admin_ztree){
            admin_ztree=$.fn.zTree.getZTreeObj("admin_tree");
        }
        var tree_treeNode=admin_ztree.getSelectedNodes();
        if(tree_treeNode.length==0){
            i8ui.error('请选择一个文件夹！');
            return false;
        }
        var delId=tree_treeNode[0].DocTreeID;
        //确定删除吗？
        i8ui.confirm({
            title:'删除文件夹同时删除里面的文件'
        },function(){
            common.ajax.deleteDocTree({
                docTreeID:delId
            },function(data){
                if(data.Result){
                    admin_ztree.removeNode(tree_treeNode[0]);
                    $('.doc-left-ul').find('[docid='+delId+']').remove();
                }
                //$this.parents('.file-item').eq(0).remove();
            })
        })
    })

    //$('.folder-body').on('click','[type=doc]')
});
