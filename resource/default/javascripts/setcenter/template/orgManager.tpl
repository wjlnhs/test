{each ReturnObject as item index}
<div class="lt p10" style="width: 400px;">
    <img class="org-hdimg lt m-r15 m-t5 m-l10" src="{item.Item1.HeadImage}?imageView2/1/w/60/h/60">
    <div class="org-name-emal lt">
        <p class="fz14 bold" style="line-height: 25px;">{item.Item1.Name}</p>
        <p style="line-height: 25px;">{item.Item1.Email}</p>
        {getPartHtml(item)}
    </div>
</div>
<div class="rt rel">
    <span class="org-btn blue" style="right: 150px;">变更负责人</span>
    {if !item.Item3}
    <span class="org-btn yellow">撤销负责人</span>
    {/if}
</div>
{/each}