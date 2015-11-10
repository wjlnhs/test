{each List as item index}
<tr>
    <td class="org-hd-td">
        <img class="org-hdimg lt" src="{item.HeadImage}?imageView2/1/w/60/h/60"/>
        <div class="org-name-emal">
            <p class="fz14 bold">{item.UserName}</p>
            <p>{item.Email}</p>
        </div>
    </td>
    <td>{item.PartTime.Name}</td>
    <td>{item.PartTime.ClassName}</td>
    <td>{getOrgName(item.PartTime.OrgID)}</td>
    <td>
        <span index="{index}" class="org-per-edit">编辑</span>
        <span class="cl999">|</span>
        <span index="{index}" class="org-per-other">删除</span>
    </td>
</tr>
{/each}
