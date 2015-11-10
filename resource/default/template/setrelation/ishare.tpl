{if loading}
<tr>
    <td colspan="{config.columnNum}">
        <div class="ld-128-write" ></div>
    </td>
</tr>
{else if ReturnObject.totalCount==0}
 <td colspan="{config.columnNum}">
    <div class="noresult">
           <div class="no-resulticon noresult-icon"></div>
           <div class="noresult-title">您没有将{config.appName}分享给别人~</div>
    </div>
 </td>
{else}
{each ReturnObject.Items as item}
<tr relationid={item.ID} targetid={item.TargetID} targettype={item.TargetType} passportid={item.PassportID} source={item.Source} relationtype={item.RelationType}>
                    <td >
                        <div class="imgpanel">
                            <img src="{item.TargetHeadImage||'https://dn-i8res.qbox.me/public/platform/defdept.png'}?imageView2/1/w/60/h/60"/>
                            <span>{item.TargetUserName}</span>
                        </div>
                    </th>
                    <td >
                    {if item.Source==1}
                            主动添加
                        {else if item.Source==2}
                            对方申请
                        {else}
                            汇报上级
                    {/if}
                    </td>
                    {if configOptions[config.appType]}
                        <td>
                           {configOptions[config.appType].keyValue[item.AccessType]||'- - - -'}
                        </td>
                    {/if}
                    <td>
                        {if item.State==0}
                                {if item.Source==3}
                                /
                                {else}
                                    <a class="example_bg_icon1 btn-delete">删除</a>
                                {/if}
                            {else if item.State==1}
                            <span class="red-i">已拒绝</span>
                            <a class="weekdailypng-bg btn-agree">同意</a>
                            <a class="example_bg_icon1 btn-delete">删除</a>
                            {else}
                            <span class="green-i">申请中</span>
                            <a class="weekdailypng-bg btn-agree">同意</a>
                             <a class="weekdailypng-bg btn-refuse">拒绝</a>
                        {/if}
                        <!--
                            <span class="green-i">申请中</span>
                            <a class="example_bg_icon1 btn-delete">删除</a>
                            <a class="weekdailypng-bg btn-agree">同意</a>
                            <a class="weekdailypng-bg btn-refuse">拒绝</a>
                            <a class="weekdailypng-bg btn-reapply">再次申请</a>
                        -->
                    </td>
                </tr>
                {/each}
                {/if}