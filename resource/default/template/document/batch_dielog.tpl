{each files}
<li class="state-complete" index="{$index}">
    <p class="title" style="text-align:center;">{$value.FileName}</p>
    <p class="info">{$value.CreaterName}   {$renderTime($value.CreateTime,'yyyy年MM月dd日')}</p>
    <p class="imgWrap"><span class="i8files-ico-{$value.Extension}"></span></p>
    <p class="file-edition"></p>
    <p class="delete-version" docTreeID="{$value.DocTreeID}" fileID="{$value.ID}">删除</p>
</li>
{/each}