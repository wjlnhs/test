<div class="sinblog-container">
    <div class="rcon-normal">
            {=Message}
    </div>
    {if giftImg}
        <div class="gifts-list">
             {each giftImg}
             <span class="giftitem {$value}"></span>
             {/each}
        </div>
    {/if}
    <div class="rcon-extend">
        {if ForwordMessage}
            <div class="quote-box">
                <div class="quote-content">
                    <h3><a href="users/{ForwordUserID}">{ForwardUserName}</a></h3><span class="forward-content">{=ForwordMessage}</span>
                    <i></i>
                    {if ForwordFiles}
                        {if ForwordFiles.length>0}
                            <div class="attFile-list">
                                {=$kdattachmentFiles(ForwordFiles)}
                            </div>
                        {/if}
                    {/if}
                </div>
                <b class="cexpend"></b>
            </div>
        {/if}
    </div>
    {if Files.length>0}
        <div class="attFile-list">
            {=$kdattachmentFiles(Files)}
        </div>
    {/if}
</div>
<div class="right-footer">
     <div class="ft-left"><span class="ft-date">{CreateTime}</span></div>
</div>