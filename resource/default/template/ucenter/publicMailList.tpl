{each ReturnObject}
<tr>
   <td>
        <img class="lt people60x60" src="{if $value.HeadImage!="00000000-0000-0000-0000-000000000000.png"}{$value.HeadImage}{else}../default/images/community/user-photo.png{/if}"/>
        <div class="lt m-l15">
            <div class="ft14 bold m-t10">{$value.Name}</div>
            <div class="m-t10 ft14">{$value.Email}</div>
        </div>
    </td>
    <td style="line-height:24px;padding-right:20px;">{$rolesFormat($value.Roles,$value.AppAdmin,rolesCn)}</td>
    <td>{$value.MPhone}</td>
    <td>{$value.Tel}</td>
</tr>
{/each}