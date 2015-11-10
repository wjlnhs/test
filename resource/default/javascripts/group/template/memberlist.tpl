{each List as Item}
    <tr>
        <td>
            <img class="my-headimg lt" src="{Item.Member.HeadImage}">
            <p><a class="fz14-weight cl000">{Item.Member.Name}</a></p>
            <p class="fz14">{Item.Member.Email}</p>
        </td>
        <td><p class="group-option-p"><span title="{Item.Member.OrgName}">{Item.Member.OrgName}</span><span class="tcenter" style="width:20px;">|</span><span title="{Item.Member.Position}">{Item.Member.Position}</span></p></td>
        <td>{Item.TopicCount}</td>
        <td>{Item.FileCount}</td>
        {$getStatusBtn(Item)}
    </tr>
{/each}