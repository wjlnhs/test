<div class="dielog-tip task-tip">
    {if !noClose}
        <i class="icon headofarrow"></i>
        <span class="dielog-close" id="{targetUserID}">×</span>
    {/if}
    <div class="dielog-title ft12 l-h36"><span class="blue">{Name}</span>待办的任务{$getTodo(viewNum,doingNum,reviewNum)}</div>
    <ul class="task-tip-cont">
        <li>
            {if baseHost}
                <a target="_blank" href="{baseHost}task" class="score orange">{viewNum}</a>
                {else}
                <span class="score orange">{viewNum}</span>
            {/if}
            <span>待查看的</span>
        </li>
        <li>
            {if baseHost}
                <a target="_blank" href="{baseHost}task" class="score yellow">{doingNum}</a>
                {else}
                <span class="score yellow">{doingNum}</span>
            {/if}
            <span>待完成的</span>
        </li>
        <li>
            {if baseHost}
                <a target="_blank" href="{baseHost}task" class="score green">{reviewNum}</a>
                {else}
                <span class="score green">{reviewNum}</span>
            {/if}
            <span>待评审的</span>
        </li>
    </ul>
    <div class="has-delay">
    已延期：
    {if baseHost}
    <a style="color:#ff5a00;" target="_blank" href="{baseHost}task"> {delayNum}</a>
    {else}
     {delayNum}
    {/if}

    </div>
</div>
