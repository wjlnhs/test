{each Items}
<div class="child-item" iid="{$value.ID}" oid="{$value.OwnerID}">
    <i class="btn-delete2"></i>
    <span  iid="{$value.ID}" class="app-checkbox v--4 {if $value.Finished}checked{/if}"></span>
    <div class="child-edit-box">
        <textarea style="width:600px;" class="child-item-textarea" value ="{$value.Name}"  >{$value.Name}</textarea>
        <input id="{$value.ID}" oid="{$value.OwnerID}" class="child-owner"/>
        <div class="clear"></div>
    </div>
    <span class="child-item-txt" style="max-width:600px;" title="{$value.Name}">{$value.Name} <b class="in-bl" style="text-align:right;min-width:100px;position:absolute;right:10px;top:0px;">负责人:{if $value.OwnerName}{$value.OwnerName}{else}无{/if}</b></span>
</div>
{/each}