{each ReturnObject as item index}
<tr>
    <td class="org-hd-td">
        <img class="org-hdimg lt" src="{item.HeadImage}?imageView2/1/w/60/h/60"/>
        <div class="org-name-emal">
            <p class="fz14 bold">{item.Name}</p>
            <p>{item.Email}</p>
        </div>
    </td>
    <td>{item.OrgName}</td>
    <td>
        <a target="_blank" href="setcenter/showperson?uid={item.PassportID}" index="{index}" class="org-per-edit">查看资料</a>
        <span class="cl999">|</span>
        <span index="{index}" class="org-per-other">再入职</span>
    </td>
</tr>
{/each}