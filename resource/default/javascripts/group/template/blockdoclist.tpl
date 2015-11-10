{each Items as item Index}
    <div class="rt-doc-block oflow kks_option_li">
        <div class="lt rt-doc-img doc-options m-r10" zindex="{Index}" >
        {if /jpg|png|jpeg|gif/.test(item.Extension) }
            <img class="m-t10 m-l10" src="{item.FilePath}?imageView2/1/w/60/h/60" />
            {else}
            <span class="kks_op_file_bg filesicons i8files-ico-{item.Extension}"></span>
        {/if}
        </div>
        <div>
            <p class="rt-doc-name doc-options fz14-weight m-t10" zindex="{Index}">{item.FileName}</p>
            <a href="users/{item.CreaterID}" class="rt-doc-uname">{item.CreaterName}</a>
            <p class="rt-doc-utime">{item.CreateTime}</p>
        </div>
    </div>
{/each}