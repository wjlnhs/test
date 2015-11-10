{if noKey}
    <div class="noresult">
          <div class="no-resulticon noresult-icon"></div>
          <div class="noresult-title">请输入关键字~</div>
    </div>
{else if loading}
    <div class="ld-128-gray"></div>
{else}
    {if ReturnObject}
        {if ReturnObject.length>0}
            {each ReturnObject as item Index}
               <div class="card {Index%2==0?'':'c-right'}">
                <a href="{getTeamUrl(item.PassportID)}"><img class="headimg" src="{item.HeadImage}?imageView2/1/w/56/h/56" /></a>
                <div class="card-panel">
                    <div class="card-title">
                        <a href="{getTeamUrl(item.PassportID)}">{heightlight(keyword,item.Name)}<span ></a>（<span >{heightlight(keyword,item.OrgName)}</span>）</span>
                    </div>
                    <div class="card-line">
                        <div class="card-item">座机：{heightlight(keyword,item.Tel||'-')}</div>
                        <div class="card-item">手机：{heightlight(keyword,item.MPhone||'-')}</div>
                        <div class="card-item">邮箱：{heightlight(keyword,item.Email||'-')}</div>
                    </div>
                    <div class="card-line oflow rel cardlabel" >标签： {heightlight(keyword,item.Labels.join(',')||'暂无')}</div>
                </div>
                </div>
            {/each}

        {/if}
        {else if Total==0}
                        <div class="noresult">
                        <div class="no-resulticon noresult-icon"></div>
                        <div class="noresult-title">没有查到同事~</div>
                        </div>
    {/if}
{/if}