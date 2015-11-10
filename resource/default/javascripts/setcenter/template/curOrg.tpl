<div class="org-ck-name">当前部门：{ReturnObject.Name}</div>
<dl class="org-info">
    <dt>部门名称：</dt>
    <dd>{ReturnObject.Name}</dd>
    <dt>上级部门：</dt>
    <dd>{getParentName(ReturnObject.ParentID)}</dd>
    <dt>部门负责人：</dt>
    <dd>{getManagerName(ReturnObject.ManagerName)}</dd>
</dl>
<span class="org-btn blue">+ 添加下级</span>
<span class="org-btn write"><i class="pic pic_19"></i>编辑</span>
<span class="org-btn yellow"><i class="pic pic_12" style="vertical-align: -3px; margin-right: 10px;"></i>删除</span>