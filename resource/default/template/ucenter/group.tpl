{each List}
<li class="ta-group-ops">
            <a  href="{getGroupUrl($value.ID)}"><img class="my-headimg lt" src="{=$value.Icon}"></a>
            <div class="ta-group-info lt">
                <p><a class="ta-group-name" href="{getGroupUrl($value.ID)}">{=$value.Name}</a></p>
                <p>创建人：<a  href="{getTeamUrl($value.CreaterID)}">{=$value.CreaterName}</a><span class="mg10">|</span>成员：<a>{$value.Amount}</a>人<span class="mg10">|</span>最新更新：{$value.LastUpdateTime}</p>
                <p class="text-ellipsis">{$value.Description}</p>
            </div>
            <!--<div class="rt">
                <span class="ta-group-btn"><i class="spbg1 sprite-30"></i><i class="ta-group-jia">＋</i>加入该群</span>
            </div>-->
        </li>
{/each}