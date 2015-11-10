{if noKey}
<div class="noresult">
      <div class="no-resulticon noresult-icon"></div>
      <div class="noresult-title">请输入关键字~</div>
</div>
{else if loading}
    <div class="ld-128-gray"></div>
{else}
    {if ReturnObject&&ReturnObject.length}
        {each ReturnObject as item Index}
        <div class="word"  style="margin-left:{Index%2==0?'0px':'40px'}">
                        <span class="kks_op_file_bg filesicons doc-options i8files-ico-{item.Extension}" ></span>
                        <div class="word-right">
                            <div class="word-title">{heightlight(searchKey,item.Name||'-')}</div>
                            <div class="word-options">
                                <span class="author">{heightlight(searchKey,item.CreaterName||'-')}</span>&emsp;|&emsp;{item.LastUpdateTime}&emsp;|&emsp;阅读&emsp;<span class="red">{item.ReadNum}</span>&emsp;|&emsp;评论&emsp;<span class="red">{item.CommentNum}</span>
                            </div>
                        </div>
                    </div>
        {/each}
        <div class="clear m-b10"></div>
    {else}
        <div class="noresult">
              <div class="no-resulticon noresult-icon"></div>
              <div class="noresult-title">没有搜索到文档哦~</div>
        </div>
    {/if}
{/if}