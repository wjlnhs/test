{each ReturnObject}
<div class="file-item" idpath="{$value.IDPath}" type="{if $value.Type==0}folder{else}doc{/if}">
    <span class="app-checkbox"></span>
    <i class="file-icon-{if $value.Type==0}folder{else}{$value.Extension.toLocaleLowerCase()}{/if}"></i>
    <dl class="file-item-info">
        <dt><span class="file-item-title" idpath="{$value.IDPath}" idname="{$value.IDPathName}" docid={$value.DocTreeID}>{if $value.Type!=0}<a target="_blank" href="document/detail/{$value.DocTreeID}" class="inputspan">{$value.Name && $value.Name.substr(0,30)}</a>{else}<span class="inputspan">{$value.Name && $value.Name.substr(0,30)}</span>{/if} <input docid={$value.DocTreeID} value="{$value.Name && $value.Name.substr(0,30)}">{if $value.IsAuthorizePmt && $value.Type!=0}<a class="btn-edit"></a>{/if}</span></dt>
        <dd><span>{$value.CreaterName} 创建于{$getFileCreatTime($value.Type,$value.CreateTime,$value.LastUpdateTime)}</span></dd>
    </dl>
    <dl class="file-item-edit">
       <dd>
           <a class="btn-delete2" docid={$value.DocTreeID}  quickid={$value.ID}>删除</a>
       </dd>
    </dl>
</div>
{/each}
