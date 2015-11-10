{if loading}
<li><div class="ld-32-write"></div></li>
{else if noresult}
<li style="height:auto">
 <div class="rt-block-cont">
                <div class="no-report">
                    <div class="weekdailypng-bg unsubmit">
                        <span >没有人分享周日报给我~</span>
                    </div>
                </div>
            </div>
</li>
{else}
{each Items as item Index}
<li>
                <div class="abs">
                    <img src="{item.HeadImage}?imageView2/1/w/60/h/60" />
                </div>
                <div class="daily-text">
                    <div class="daily-name">{item.Name}</div>
                    {if item.SubmitState==2}
                    <div><span class="weekdailypng-bg unready">未提交</span><a class="blue m-l5 addreporttips" pid={item.PassportID}>提醒他填写</a></div>
                     </div>
                                    {else}
                    <div><span class="weekdailypng-bg already">已提交</span></div>
                    </div>
                    {/if}
            </li>

            {/each}
{/if}