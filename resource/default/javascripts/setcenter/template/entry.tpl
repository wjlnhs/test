<div style=" width: 385px; padding: 10px 30px 20px 30px;">
    <div class="sbox-tr" style="padding: 5px 0px;">
        <div class="sbox-tt lt" style="width: 80px;">&nbsp;姓名</div>
        <div class="sbox-td lt">
            {Name}
        </div>
        <div class="clear"></div>
    </div>
    <div class="sbox-tr" style="padding: 5px 0px;">
        <div class="sbox-tt lt" style="width: 80px;"><span class="red m-r5">*</span>部门名称</div>
        <div class="sbox-td rel">
            <div id="js_org_sel" class="lt" orgid="{OrgID}" style="border: 1px solid #DFDFDF; height: 33px; width: 230px; padding: 0px 5px;">{OrgName}</div>
            <div id="js_org_tree" class="hide" style="position:absolute; top: 36px; left:80px;background:#fff; width: 220px;z-index: 10; border: 1px solid #DFDFDF; height: 200px; padding: 10px; overflow: auto;">
                <ul id="treedome"class="ztree"></ul>
            </div>
            <a class="select-org-btn rt" onclick="$('#js_org_tree').toggle();" >重新选择</a>
        </div>
        <div class="clear"></div>
    </div>
    <div class="sbox-tr" style="padding: 5px 0px;">
            <div class="sbox-tt lt" style="width: 80px;"><span class="red m-r5">*</span>职级</div>
            <div class="sbox-td lt">
                <select id="js_class_sel" style="height:33px;">
                    <option>员工</option>
                </select>
            </div>
            <div class="clear"></div>
        </div>
    <div class="tright m-t10" style="margin-right: 65px;">
        <span class="gray96x32 m-r10">取消</span>
        <span class="blue96x32">保存</span>
    </div>
</div>