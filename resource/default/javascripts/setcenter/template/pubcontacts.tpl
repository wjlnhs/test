{each contract as item index}
<tr>
    <td class="org-hd-td">
        {item.name}
    </td>
    <td>{item.tel}</td>
    <td>{item.addr}</td>
    <td>
        <span index="{index}" class="org-per-edit">编辑</span>
        <span class="cl999">|</span>
        <span index="{index}" class="org-per-other">删除</span>
    </td>
</tr>
{/each}