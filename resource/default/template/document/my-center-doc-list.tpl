{each ReturnObject}
<div class="file-item" idpath="{$value.IDPath}" type="{if $value.Type==0}folder{else}doc{/if}">
    <span class="app-checkbox"></span>
    <i class="file-icon-{if $value.Type==0}folder{else}{$value.Extension}{/if}"></i>
    <dl class="file-item-info">
        <dt><span class="file-item-title" idpath="{$value.IDPath}" idname="{$value.IDPathName}" docid={$value.DocTreeID}><a target="_blank" href="{if $value.Type!=0}document/detail/{$value.DocTreeID}{else}javascript:void(0){/if}" class="inputspan">{$value.Name && $value.Name.substr(0,30)}</a><input docid={$value.DocTreeID} value="{$value.Name && $value.Name.substr(0,30)}"><a class="btn-edit"></a></span></dt>
        {if $value.Type==0}
        <dd class="folder-info"><span class="folder-info-left"><b class="m-r5">文件总数:</b>{$value.FileCount}<b class="m-l20"> 创建人:</b> {$value.CreaterName} <b style="margin-left:20px;">阅读权限:</b> <span class="admins" title="{$getCanReadUsers($value.CanReadUsers,$value.DocTreeAdmin)}">{$getCanReadUsers($value.CanReadUsers,$value.DocTreeAdmin)}</span></span></dd>
        {else}
        <dd><span>{$value.CreaterName} 创建于{$getFileCreatTime($value.Type,$value.CreateTime,$value.LastUpdateTime)}</span>&nbsp; {$fromwhere($value.AppID)}<span class="id-path-name" title="{$value.IDPathName}">&nbsp;&nbsp;{$value.IDPathName}</span></dd>
        {/if}
    </dl>
    <dl class="file-item-edit">
        <dd>
        {if $value.Type!=0}
        <ul>
            <li>{if $value.Type!=0}
                <a href="{$setDownloadUrl($value.FilePath)}&attname={$value.Name}.{$value.Extension.toLocaleLowerCase()}" class="btn-download">下载</a>{/if}
            </li>
            <li>{if $value.Type!=0}<a class="btn-quick m-r20" docname="{$value.Name}" docid={$value.DocTreeID}>快捷</a>{/if}</li>
            <li style="width:94px;">
                {$deleteOrGuidang($value.AppID,$value.DocTreeID)}
            </li>

        </ul>
        {else}
            <ul>
                <li>{if $value.IsCreateQuick}<a class="btn-quick m-r20" docname="{$value.Name}" docid={$value.DocTreeID}>快捷</a>{/if}</li>
            </ul>
        {/if}
        </dd>
    </dl>
</div>
{/each}
