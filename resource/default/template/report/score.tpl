{if loading}
<div class="ld-64-write" ></div>
{else}
{if ReturnObject.length==1}
    {if ReturnObject[0].Score!=0}
    <div class="rt-block-cont">
        <div class="rt-cement">
            <div class="rt-cement-tt">
                <div class="scorepanel">
                    <div class="fw_left"><span class="score {openscore}">{ReturnObject[0].Score}</span>
                        分</div>
                    <div class="starlist {openscore}">
                        <a class="weekdailypng-bg {ReturnObject[0].Score>=1?'starcheck':''}"></a>
                        <a class="weekdailypng-bg {ReturnObject[0].Score>=2?'starcheck':''}"></a>
                        <a class="weekdailypng-bg {ReturnObject[0].Score>=3?'starcheck':''}"></a>
                        <a class="weekdailypng-bg {ReturnObject[0].Score>=4?'starcheck':''}"></a>
                        <a class="weekdailypng-bg {ReturnObject[0].Score>=5?'starcheck':''}"></a>
                    </div>
                </div>
            </div>
            <div class="rt-cement-intro {openscore}" >
                <b>评语</b><br/>
               {ReturnObject[0].Evaluation}
            </div>
        </div>
    </div>
    {else}
    <div class="rt-block-cont">
        <div class="no-score-result">
            <div class="weekdailypng-bg no-score"></div>
            <div class="no-score-desc">
                <span >本周还没有人评分哦~</span><br/>
                {if ReturnObject[0].CanEvaluate}
                                                <a class="btn-blue-h32 openscore">立即评分</a>
                {else if uid==ReturnObject[0].UserID||uid==ReturnObject[0].PassportID}
                    <a class="btn-blue-h32 invent-btn" rid={ReturnObject[0].ID} date-time="{getScore(ReturnObject[0].StartTime,ReturnObject[0].EndTime)}">邀请评分</a>
                {/if}

            </div>

        </div>
    </div>
    {/if}
    {else}
    <div class="rt-block-cont">
            <div class="no-report">
                <div class="weekdailypng-bg unsubmit">
                    本周还未提交周报哦！
                </div>
                <a class="btn-blue-h32 adddaily" rptype="1" begintime="{begintime}" endtime="{endtime}">立刻提交周报</a>
            </div>
        </div>
  {/if}

  {/if}
  <div class="clear"></div>