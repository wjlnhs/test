{each List as item index}
<div class="set-block m-t15 oflow" style="padding: 15px;">
    <img class="org-hdimg lt m-r20" style="width: 60px; height: 60px;" src="{item.Icon}?imageView2/1/w/60/h/60">
    <div class="set-group-info m-t5 m-l5 lt" style="color: #{item.Status == 0 ? "000":"999"}">
        <p class="fz14 bold">{item.Name}{getGroupType(item.Type)}</p>
        <p class="m-t10" style="color: #{item.Status == 0 ? "000":"999"}">
            <label class="w100gp">
                创建人:{item.CreaterName}
            </label>
            <span class="cl_bf">|</span>
            <label class="w100gp">
                成员：{item.Amount} 人
            </label>
            <span class="cl_bf">|</span>
            <label class="w200gp">
                当前管理员：{getManagerNames(item.ManagerNames)}
            </label>
            <span class="cl_bf">|</span>
            <label class="w200gp">
                最新更新：{item.LastUpdateTime}
            </label>
        </p>
        <p class="m-t10">
            组群简介：{item.Description}
        </p>
    </div>
    <div class="set-group-btn rt">
        {getBtnlist(item.Status,index)}
    </div>
    <div class="clear"></div>
</div>
{/each}