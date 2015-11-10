{each List as item Index}
<li class="rt-doc-block oflow">
    <div class="lt rt-doc-img doc-options m-r15 cur m-l20" zindex="{Index}">
        {if /jpg|png|jpeg|gif/.test(item.Extension) }
            <img class="m-t15 m-l10" src="{item.FilePath}?imageView2/1/w/60/h/60" />
            {else}
            <span class="kks_op_file_bg filesicons i8files-ico-{item.Extension}"></span>
        {/if}
    </div>
    <div class="group-doc-cont m-t10" style="margin-left: 96px;">
        <p class="fz14-weight m-t5 doc-options m-b5 cur" zindex="{Index}">{item.FileName}</p>
        <p class="rt-doc-utime">
            <a href="users/{item.CreaterID}" class="rt-doc-uname">{item.CreaterName}</a>
            <span class="p10">|</span>
            <span>{item.CreateTime}</span>
            <P>{getDocSize(item.Length)}B</P>
        </p>
    </div>
</li>
{/each}