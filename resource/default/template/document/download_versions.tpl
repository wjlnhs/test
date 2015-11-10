<ul id="download_versions">
{each files}
<li index="{Total-$index}">
    <span filepath="{$seefile_getDownUrl($value)}"  class="app-radio2"></span>{Total-$index}.0版本{$value.FileName}
</li>
{/each}
</ul>
<div class="m-l15 m-r15">
        <div class="h-45 m-t15">
            <a style="color:#fff" href="{$seefile_getDownUrl(files[0])}" target="_blank" class="btn-blue96x32 rt confirm">下载</a>
            <span class="btn-gray96x32 m-r10 rt cancel">取消</span>
        </div>
        <div class="clear"></div>
    </div>