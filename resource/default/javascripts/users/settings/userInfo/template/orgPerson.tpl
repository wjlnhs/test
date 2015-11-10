{each List}
<tr>
   <td>
        <a href="users/{$value.Item1.PassportID}"><img class="lt people60x60" src="{if $value.Item1.HeadImage!="00000000-0000-0000-0000-000000000000.png"}{$value.Item1.HeadImage}{else}../default/images/community/user-photo.png{/if}"/></a>
        <div class="lt m-l15">
            <div class="ft14 bold m-t10"><a style="color:#000;" href="users/{$value.Item1.PassportID}">{$value.Item1.Name}</a>{$FunLevels($value.Item2)}{if $value.Item4 }<span class="app_contacts_userorgowner" title="部门负责人"></span>{/if}</div>
            <div class="m-t10 ft14">{$value.Item1.Email}</div>
        </div>
    </td>
    <td>{$value.Item1.OrgName} | {$value.Item1.Position}</td>
    <td>{$value.Item1.MPhone}</td>
    <td>{$value.Item1.Tel}</td>
    <td><i class="icon {if $value.Item3}icon-love{else}icon-love-empty{/if} setusual" cid="{$value.Item1.PassportID}"></i></td>
</tr>
{/each}