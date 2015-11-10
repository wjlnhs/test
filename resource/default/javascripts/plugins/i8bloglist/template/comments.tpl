<li class="cmt-li">
    <div class="cmtli-left">
        <a class="reply-user" href="users/{CreaterID}"><img src="{UserHeadImage}"/></a>
    </div>
    <div class="cmtli-right">
        <div class="cmt-content">
            {if ReplyComment}
            <a class="reply-user" href="users/{CreaterID}">{UserName}</a><b class="reply-user">回复</b><a class="reply-user" href="users/{ReplyComment.CreaterID}">{ReplyComment.UserName}</a>
            {else}
            <a class="reply-user" href="users/{CreaterID}">{UserName}</a>
            {/if}
            ：<span class="cmt-txt">{=Message}</span>
            {if locationName}
                 <span class="ft-loc"><b class="i-loc"></b><a l-d="{locString}" class="a-location">{locationName}</a></span>
            {/if}
        </div>
        {if Files.length>0}
        <div class="cmt-attachment kk_files_panl" data-arrs="{attdataStr}">
            <div class="att-title">附件：</div>
            <div class="att-list">
                {each Files}
                    <a class="kks_option_li doc-options" docid="{$value.ID}" zindex={$index}>{$value.FileName}</a>
                {/each}
            </div>
        </div>
        {/if}
        <div class="cmt-options">
            <div class="cmt-opt-right">{if CanDelete}<a class="cmt-del" del_id="{ID}" blog_id="{BlogID}">删除</a> <span class="cmt-split">|</span> {/if}<a class="cmt-reply" cmt_id="{ID}" reply="{CreaterID}|{UserName}">回复</a></div><br class="clear"/>
        </div>

    </div>

</li>