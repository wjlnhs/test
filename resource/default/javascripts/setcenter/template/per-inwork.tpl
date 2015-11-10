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
    <td>{item.CreateTime}</td>
    <td>
        <a target="_blank" href="setcenter/editperson?uid={item.PassportID}" class="org-per-edit lt">编辑</a>
        <span class="cl999 lt m-l5 m-r5">|</span>
        <div class="org-per-other lt rel">
            更多
            <div class="org-ohter-panl hide">
                <a index="{index}" class="disabled-btn" style="display: {item.Status == 2 ? 'none':'block'}">临时禁用</a>
                <a href="setcenter/quit?uid={item.PassportID}&name={item.Name}">设为离职</a>
                <a index="{index}" class="mobile-passport">手机账号</a>
                <a index="{index}" class="email-passport">邮箱账号</a>
            </div>
        </div>
    </td>
</tr>
{/each}