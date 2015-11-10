{each feed}
    <div class="{setIconClass($value.Action)} {if $index>4}processitem-hide{/if}">
        <i class="task-icon"></i>
        <span class="time blue">{$renderTime($value.CreateTime,'yyyy/MM/dd hh:mm')}</span>
        <img class="user-pic" src="{if $value.HeadImage}{$value.HeadImage}?imageView2/1/w/32/h/32{else}https://dn-i8res.qbox.me/public/platform/defhead.png?imageView2/1/w/32/h/32{/if}" alt="">
        <div class="process-txt"><span class="ft12"><a href="users/{$value.CreaterID}">{$value.CreaterName}</a> {setContent($value.Content,$value.Action)}</span></div>
    </div>
{/each}
{if feed.length>5}
<div onclick="$(this).parent().toggleClass('process-open')" class="processitem-more blue">点击查看更多</div>
<div onclick="$(this).parent().toggleClass('process-open')" class="processitem-less blue">点击收起</div>
{/if}