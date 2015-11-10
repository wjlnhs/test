{each Result as item index}
<tr>
    <td class="org-hd-td">
        <img class="org-hdimg lt" src="{item.HeadImage}?imageView2/1/w/60/h/60"/>
        <div class="org-name-emal">
            <p class="fz14 bold">{item.Name}</p>
            <p>{item.Email}</p>
        </div>
    </td>
    <td>{item.CreateTime}</td>
    <td>
        <span index="{index}" class="org-per-edit">查看资料</span>
        <span class="cl999">|</span>
        <span index="{index}" class="org-per-other">编辑</span>
    </td>
</tr>
{/each}