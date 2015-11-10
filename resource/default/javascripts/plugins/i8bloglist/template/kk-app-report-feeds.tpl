<div class="app-feeds">
    <div class="feeds-left">
        {if ReadUsers&&isRead(ReadUsers,UserID)==-1}
            <b class="app-ico report"></b>
            {else if ReadUsers&&isRead(ReadUsers,UserID)}
            <div class="weekdailypng-bg w-left isread"></div>
            {else}
            <div rid={ID} class="weekdailypng-bg w-left readit"></div>
        {/if}

    </div>
    <div class="feeds-right">
        <div class="current-report">
            <div class="cont-title">本期总结：</div>
            <div class="cont-list">
            {each Summarize}
                <p><span class="r-p-dot">&bull;</span><span class="r-p-text"> {$value}</span></p>
            {/each}
            </div>
        </div>
        <div class="next-report">
            <div class="cont-title">下期计划：</div>
            <div class="cont-list">
            {each NextPlan}
                <p><span class="r-p-dot">&bull;</span> <span class="r-p-text">{$value}</span></p>
            {/each}
            </div>
        </div>
        <br class="clear"/>
    </div>
</div>

<div class="app-report-score">
{if RpType==1}
    {if !Score||Score==0}
        <a target="_blank" href={getUrl(ID)} >未评分</a>
        {else}
        <a target="_blank" href={getUrl(ID)} >{Score}分</a>
    {/if}
{/if}
</div>

<div class="read-panel oflow">
    {if ReadUsers&&ReadUsers.length>0}
         <div class="read" uid={ReadUsers.join(';')}>
         <div class="weekdailypng-bg read-title">已阅：</div>
         <div class="readnamelist">
         {each ReadUserNames as names}
         <a>{names}</a>
         {/each}
         </div>
         </div>
    {/if}
</div>

