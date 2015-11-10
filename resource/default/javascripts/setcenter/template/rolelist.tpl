<li class="add-zxrole">
    <i class="pic pic_10"></i>增加新角色
</li>
{each Item2 as item index}
<li class="rel" index="{index}">
    <i class="lt pic pic_26"></i>
    <div class="zxrole-info m-t10">
        <p class="fz16" style="overflow: hidden; white-space: nowrap; text-overflow: ellipsis;" title="{item.RoleName}">{item.RoleName}</p>
        <p class="">{item.UserName}</p>
    </div>
    <span class="zxrole-op-edit">编辑</span>
    <span class="zxrole-op-del">删除</span>
</li>
{/each}