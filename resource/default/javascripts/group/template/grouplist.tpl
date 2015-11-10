{each List as Item}
    <li class="ta-group-ops">
        <img class="my-headimg lt" src="{Item.Item1.Icon}">
        <div class="ta-group-info lt">
            <p><a href="group/home?id={Item.Item1.ID}"; class="ta-group-name">{Item.Item1.Name}</a>{getGroupType(Item.Item1.Type)}</p>
            <p>创建人：<a href="/community/users/{Item.Item1.CreaterID}">{Item.Item1.CreaterName}</a><span class="mg10">|</span>成员：
                {if Item.Item1.Status == 0}
                    <a href="group/home?id={Item.Item1.ID}#members">{Item.Item1.Amount}</a>人
                {else}
                    {Item.Item1.Amount}人
                {/if}
                <span class="mg10">|</span>最新更新：{Item.Item1.LastUpdateTime}</p>
            <p>群组简介：{Item.Item1.Description}</p>
        </div>
        <div class="rt rel">
            {$getTypeBtn(Item)}
        </div>
    </li>
{/each}