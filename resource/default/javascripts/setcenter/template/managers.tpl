{each ReturnObject as item index}
<tr>
    <td class="org-hd-td">
        <img class="org-hdimg lt" src="{item.HeadImage}?imageView2/1/w/60/h/60"/>
        <div class="org-name-emal">
            <p class="fz14 bold">{item.Name}</p>
            <p>{item.Email}</p>
        </div>
    </td>
    <td>{funMangers(item.Roles,item.AppAdmin)}</td>
    <td>
        <a index="{index}" class="org-per-edit">变更角色</a>
        <span>|</span>
        <a uid="{item.PassportID}" class="org-per-other">撤销管理员</a>
    </td>
</tr>
{/each}