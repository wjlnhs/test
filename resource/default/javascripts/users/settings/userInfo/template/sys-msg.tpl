{each List}
<div class="talk-item m-b15" msgid="{$value.CreaterID}">
    <span class="del m-l20 m-t10 rt blue" delid="{$value.ID}">删除</span>
    <span class="time">{$dateFormat($value.CreateTime,'yyyy年MM月dd日hh:mm')}</span>
    <i class="abs icon icon-bell"></i>
    <div class="ft14 bold m-t10 black msgtitle">系统通知</div>
    <div class="lt talk-item-content">
        <div class="m-t10 ft13">{$setCont($value.ActionType,$value.Content)}</div>
    </div>
</div>
{/each}
