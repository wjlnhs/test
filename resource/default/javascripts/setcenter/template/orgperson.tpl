{each Result as item index}
<tr>
    <td class="org-hd-td">
        <img class="org-hdimg lt" src="{item.Item1.HeadImage}?imageView2/1/w/60/h/60"/>
        <div class="org-name-emal">
            <p class="fz14 bold">{item.Item1.Name}</p>
            <p>{item.Item1.Email}</p>
        </div>
    </td>
    <td>{item.Item1.OrgName}</td>
    <td>{item.Item1.ClassName}</td>
    <td>{item.Item1.MPhone}</td>

    <td>
        <a target="_blank" href="setcenter/editperson?uid={item.Item1.PassportID}" class="org-per-edit lt">编辑</a>
        <span class="cl999 lt m-l5 m-r5">|</span>
        <div class="org-per-other lt rel">
            更多
            <div class="org-ohter-panl hide">
                <a index="{index}" class="disabled-btn" style="display: {item.Item1.Status == 2 ? 'none':'block'}">临时禁用</a>
                <a href="setcenter/quit?uid={item.Item1.PassportID}&name={item.Item1.Name}">设为离职</a>
            </div>
        </div>

    </td>
</tr>
{/each}
