{each ReturnObject}
<div class="admin-item">
    <div class="admin-item-content">
        <div class="content-top" {if $value.CoverImg}style="background-image: url('{$value.CoverImg}')"{/if}>
            <div class="content-top-mark">
                <img class="user-photo people60x60" src="{if $value.HeadImage!="00000000-0000-0000-0000-000000000000.png"}{$value.HeadImage}{else}../default/images/community/user-photo.png{/if}" />
                <div class="name"><span class="name-icon"></span>{$value.Name}</div>
                <div class="mail">{$value.Email}</div>
            </div>
        </div>
        <div class="content-bottom">
            <div class="info">
                {$rolesFormat($value.Roles,$value.AppAdmin,rolesCn)}
            </div>
            <div class="mobile">{$value.MPhone}</div>
            <div class="tel">{$value.Tel}</div>
        </div>
    </div>
</div>
{/each}