<div style=" width: 435px; padding: 20px;">
    <div class="sbox-tr" style="padding: 5px 0px;">
        <div class="sbox-tt lt tright" style="width: 80px;"><span class="red m-r5">*</span>上级部门：</div>
        <div class="rel">
            <div id="js_org_sel" class="lt" style="border: 1px solid #DFDFDF; height: 33px; width: 230px; padding: 0px 5px;"></div>
            <div id="js_org_tree" class="hide" style="position:absolute; top: 36px; left:80px;background:#fff; width: 220px;z-index: 10; border: 1px solid #DFDFDF; height: 200px; padding: 10px; overflow: auto;">
                <ul id="addtreedome"class="ztree"></ul>
            </div>
            <a class="select-org-btn lt m-l10" onclick="$('#js_org_tree').toggle();" >重新选择</a>
        </div>
        <div class="clear"></div>
    </div>
    <div id="js_org_options" class="sbox-tr" style="padding: 5px 0px;">
        <div class="sbox-tt lt tright" style="width: 80px;"><span class="red m-r5">*</span>子部门：</div>
        <div class="org-ml80">
           <input type="text" class="add-org-nametxt m-r10" placeholder="请输入节点名称"/><input type="text" class="add-org-numtxt" placeholder="排序编号" /><a class="del-org-op m-l10" >删除</a>
        </div>
        <div class="org-ml80">
           <input type="text" class="add-org-nametxt m-r10" placeholder="请输入节点名称"/><input type="text" class="add-org-numtxt" placeholder="排序编号" /><a class="del-org-op m-l10" >删除</a>
        </div>
    </div>
    <div class="org-ml80" style="padding: 5px 0px;">
        <a class="add-options">新增一项</a>
    </div>
    <div class="org-ml80 m-t10">
        <span class="blue96x32 m-r10">保存</span>
        <span class="gray96x32">取消</span>
    </div>
</div>