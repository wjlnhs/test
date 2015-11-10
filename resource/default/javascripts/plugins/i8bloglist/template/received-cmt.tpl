<div class="ext-content">
    <div class="ext-quote-content">
        <div class="quote-content-cmt-kk">
            {if ReplyBlog}
                {if ReplyBlog.AppKey=="sys_blog"||ReplyBlog.AppKey=="app_gift"}
                    {=subTitle}：<a target="_blank" href="ublog/{BlogCreaterID}?bid={BlogID}">{=ReplyBlog.Message}</a>
                {else if ReplyBlog.AppKey=="app_task"||ReplyBlog.AppKey=="app_report"||ReplyBlog.AppKey=="app_document"||ReplyBlog.AppKey=="app_schedule"||ReplyBlog.AppKey=="app_workflow"||ReplyBlog.AppKey=="app_notice"}
                    {if ReplyBlog.AppObj}
                        {=appExtContent}
                    {else}
                        应用源不存在!
                    {/if}
                {else if ReplyBlog.AppKey==""}
                    <span>内容源不存在，可能已被删除</span>
                {/if}
            {else}
                原评论已被删除！
            {/if}
        </div>
    </div>
</div>
