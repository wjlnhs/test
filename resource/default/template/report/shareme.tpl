{if loading}
<tr>
    <td colspan="3">
        <div class="ld-128-write" ></div>
    </td>
</tr>
{else if ReturnObject.totalCount==0}
 <td colspan="3">
    <div class="noresult">
           <div class="no-resulticon noresult-icon"></div>
           <div class="noresult-title">没有人将{appName}分享给您~</div>
       </div>
 </td>
{else}
{each ReturnObject.Items as item}
<tr relationid={item.ID} targetid={item.TargetPassportID} passportid={item.PassportID}  source={item.Source} relationtype={item.RelationType}>
                    <td class="perc-30">
                        <div class="imgpanel">
                            <img src="{item.TargetHeadImage}?imageView2/1/w/60/h/60"/>
                            <span>{item.TargetUserName}</span>
                        </div>
                    </th>
                    <td class="perc-30">
                    {if item.Source==1}
                            对方分享
                        {else if item.Source==2}
                            主动请求
                        {else}
                            下属
                    {/if}
                    </td>
                    <td >
                        {if item.State==0}
                            {if item.Source==3}
                                /
                            {else}
                                <a class="example_bg_icon1 btn-delete" >删除</a>
                            {/if}
                            {else if item.State==1}
                            <span class="red-i">已拒绝</span>
                                <a class="weekdailypng-bg btn-again">再次申请</a>
                            {else}
                            <span class="green-i">申请中</span>
                            <a class="example_bg_icon1 btn-delete">删除</a>
                        {/if}
                        <!--
                        <span class="green-i">申请中</span>
                        <a class="example_bg_icon1 btn-delete">删除</a>
                        <a class="weekdailypng-bg btn-agree">同意</a>
                        <a class="weekdailypng-bg btn-refuse">拒绝</a>
                        <a class="weekdailypng-bg btn-reapply">再次申请</a>-->
                    </td>
                </tr>
                {/each}
                {/if}