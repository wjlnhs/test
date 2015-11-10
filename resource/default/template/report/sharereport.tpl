{if loading}
    <div class="ld-128-gray"></div>
{else}
{if ReturnObject.totalCount==0||ReturnObject.Items.length==0}
<div class="noresult">
                       <div class="no-resulticon noresult-icon"></div>
                       <div class="noresult-title">没有分享给您的{rpType==2?'周日':rpType==1?'周':'日'}报！</div>
   </div>
{else}
{each ReturnObject.Items as item Index}
{if item.Score!=0}
<div class="scorepanel abs openscore" index="{Index}"><span class="score">{item.Score}</span>分
            {if item.CanEvaluate}
            <div class="comment-panel canevaluate" index="{Index}">
            {else}
             <div class="comment-panel " index="{Index}">
            {/if}
                <div class="comment-title"><b>评价:</b></div>
                <div class="comment-line">{item.Evaluation||''}</div>
                <em class="em1"><em class="em2"></em></em>
            </div>
        </div>
{/if}
<div class="weekcontent">
            <div class="w-content-left">
                                <a><img src="{item.HeadImage}?imageView2/1/w/60/h/60"></a>
                            </div>
                            <div class="w-content-right item-right-con" style="margin-left:0px;" detail-url="report/detail/{item.ID}">
                                <div class="w-content-title"><span class="w-name">{item.AuthorName}</span><span class="w-role"></span>

                                  {if item.Score==0&&item.RpType==1&&item.CanEvaluate}
                                                    <span class="w-option">
                                                    <a class="btn-yellow-h32 openscore" index="{Index}" >请评分</a></span>
                                                 {/if}
                                </div>
                                <div class="w-content-dec">发起了一条 <span class="w-content-date">{=getReportDate(item.StartTime,item.EndTime,item.RpType,item.ID)}</span></div>
                                <div class="rel"><em class="em1"><em class="em2"></em></em></div>
                                <div class="w-content-box">
                                    {if isRead(item.ReadUsers)}
                                        <div class="weekdailypng-bg w-left isread"></div>
                                    {else}
                                        <div index={Index} class="weekdailypng-bg w-left readit"></div>
                                    {/if}
                                    <div class="w-panel">
                                        <div class="sub-panel">
                                            <div class="w-p-title">本期总结：</div>
                                            {each item.Summarize as su}
                                            <div class="w-p-line"><span class="weekdailypng-bg line-icon"></span>
                                                {su}
                                            </div>
                                            {/each}

                                        </div>
                                        <div class="sub-panel b-lefte6dash">
                                            <div class="w-p-title">下期计划：</div>
                                            {each item.NextPlan as np}
                                            <div class="w-p-line"><span class="weekdailypng-bg line-icon"></span>
                                                {np}
                                            </div>
                                            {/each}
                                        </div>
                                    </div>
                                    <div class="read-panel">
                                                                         {if item.ReadUsers.length>0}
                                                                                                           <div class="read" uid={item.ReadUsers.join(';')}>
                                                                                                               <div class="weekdailypng-bg read-title">已阅：</div>
                                                                                                               <div class="readnamelist">
                                                                                                                    {each item.ReadUserNames as names}
                                                                                                                    <a>{names}</a>
                                                                                                                    {/each}
                                                                                                               </div>
                                                                                                            </div>
                                                                                                        {/if}
                                                                    </div>
                                </div>


                                 {getAtt(item.FileList)}
                                <div class="w-content-footer">
                                    <div class="w-content-pdate">{getLastUpdateTime(item.LastUpdateTime)}</div>
                                    <div class="w-content-option" index="{Index}"><a class="comment-report" optid="{item.ID}" cmtcount="{item.CommentNum}">评论{if item.CommentNum>0}<i class="comment-count">({item.CommentNum})</i>{/if}</a></div>
                                </div>
                            </div>
                            <div class="clear"></div>

        </div>
{/each}

   {/if}
{/if}