 {if itemType=="comment"}
  <li class="blist-cell">
     <div class="item-left-con">
         <i class="item-ico i-task"><a href="users/{CreaterID}"><img src="{UserHeadImage}?imageView2/1/w/60/h/60" alt=""/></a></i>
     </div>
     <div class="item-right-con">
         <div class="right-header"><div class="hd-left">{=extendName}</div><div class="hd-right"><span class="scope-desc">仅发起人可见</span></div></div>
         <div class="right-d-con">
             <div class="rcon-normal">
                     {=Message}
                     <span class="expend-content-line"><a class="expend-switch es-close"><span>展开</span><i></i></a></span>
             </div>
             {if Files.length>0}
                 <div class="cmt-attachment kk-refer-attachment kk_files_panl" data-arrs="{attdataStr}">
                     <div class="att-title">附件：</div>
                     <div class="att-list">
                     {each Files}
                        <a class="kks_option_li doc-options" docid="{$value.ID}" zindex="{$index}">{$value.FileName}</a>
                     {/each}
                     </div>
                 </div>
             {/if}
             {if isForward}
                {=extendContent}
             {/if}
         </div>
         <div class="right-footer">
             <div class="ft-left"><span class="ft-date">
                {if ReplyBlog}
                    {LastUpdateTime}
                    <!--{if ReplyBlog.AppKey=="sys_blog"}
                        <a target="_blank" href="ublog/{BlogCreaterID}?bid={BlogID}">{LastUpdateTime}</a>
                    {else}
                        {LastUpdateTime}
                    {/if}-->
                {/if}
                </span></div>
             <div class="ft-right">
                 {if CanDelete}
                 <a class="opt-del-cmt" optid="{ID}" blogid="{BlogID}">删除</a>
                 <span class="split-line">|</span>
                 {/if}
                 <a class="opt-comment" cmt-id="{ID}" optid="{BlogID}" dialogModel="replycmt" reply="{CreaterID}|{UserName}" cmtCount="{CommentCount}">回复</a>
             </div>
         </div>
     </div>
 </li>
 {else}
 <li class="blist-cell">
    <div class="item-left-con">
        <i class="item-ico {AppKey}">
        {if UserType==0}
            <a href="users/{CreaterID}"><img src="{UserHeadImage}?imageView2/1/w/60/h/60" alt=""/></a>
        {else}
            <img src="{UserHeadImage}?imageView2/1/w/60/h/60" alt=""/>
        {/if}
        </i>
    </div>
    <div class="item-right-con" detail-url="{detailUrl}">
        <div class="right-header">
            <div class="hd-left">
                <h3 class="item-author">
                    {if UserType==0}<a href="users/{CreaterID}">{UserName}</a>{else}{UserName}{/if}
                </h3>
            </div>
            <div class="hd-right">
                <span class="scope-desc">{ScopeType}</span>
            </div>
        </div>
        <div class="right-d-con">
            <div class="rcon-normal">
                    {=Message}
                    <span class="expend-content-line" style="display: none;"><a class="expend-switch es-close"><span>展开</span><i></i></a></span>
            </div>
            {if isForward}
                {=extendContent}
            {/if}
            {if Files.length>0}
                <div class="attFile-list">
                    {=$attachmentFiles(Files)}
                </div>
            {/if}
            {if giftImg}
                <div class="gifts-list">
                     {each giftImg}
                     <span class="giftitem {$value}"></span>
                     {/each}
                </div>
            {/if}
        </div>
        <div class="right-footer">
            <div class="ft-left">
            {if MessageType==1}
                <a class="akankan-date" href="ublog/{CreaterID}?bid={ID}" target="_blank"><span class="ft-date">{LastUpdateTime}</span></a>
            {else}
                <span class="ft-date">{LastUpdateTime}</span>
            {/if}
            {if locationName}
                <span class="ft-loc"><b class="i-loc"></b><a l-d="{locString}" class="a-location">{locationName}</a></span>
            {/if}
            </div>
            <div class="ft-right">
                {if CanDelete}
                <a class="opt-del" optid="{ID}">删除</a>
                {if MessageType=="1"}<span class="split-line">|</span>{/if}
                {/if}
                {if UserType==0}
                <a class="opt-comment" optid="{ID}" dialogModel="replykk" cmtCount="{CommentCount}" rKey="{AppKey}">评论<i class="comment-count">{if CommentCount>0}({CommentCount}){/if}</i></a>
                {/if}
            </div>
        </div>
    </div>
</li>
{/if}