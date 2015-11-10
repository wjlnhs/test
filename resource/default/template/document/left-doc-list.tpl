{each ReturnObject}
    <li docid="{$value.DocTreeID}">
        <span class="doc-item"  style="cursor:pointer">
            <i class="icon-file-m"></i><input value="{$value.Name}" disabled="disabled" /><i class="icon-right"></i>
            <i class="doc-nav-icon-arrow"></i>
        </span>
        <ul>
            <li><a href="javascript:void(0)" class="btn-edit">&nbsp;重命名</a></li>
            <li><a href="javascript:void(0)" class="btn-power">&nbsp;权限</a></li>
            <li><a href="javascript:void(0)" class="btn-move">&nbsp;移动</a></li>
            <li><a href="javascript:void(0)" class="btn-delete2">&nbsp;删除</a></li>
        </ul>
    </li>
{/each}

